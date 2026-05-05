# Battle.net OAuth Integration Notes

> Reference for Claude Code. Covers the exact OAuth flow, Supabase wiring, and implementation details for Battle.net login.

---

## Prerequisites

1. **Register an app at [develop.battle.net](https://develop.battle.net)**
   - Create a Blizzard developer account (free)
   - Create a new application → get `Client ID` and `Client Secret`
   - Add your redirect URI: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
   - Note: Blizzard may take a few days to approve the app

2. **No D4 Character API exists.** Blizzard has profile APIs for WoW, D3, and SC2 but has never shipped one for Diablo 4. All build and gear data in our app is manual player entry. Do not attempt to fetch character data from Blizzard APIs.

---

## Battle.net OAuth 2.0 Endpoints

| Purpose | URL |
|---|---|
| Authorization | `https://oauth.battle.net/authorize` |
| Token exchange | `https://oauth.battle.net/token` |
| User info | `https://oauth.battle.net/userinfo` |

**Important:** All three endpoints use the region-agnostic `oauth.battle.net` domain. The older regional `us.api.blizzard.com/oauth/userinfo` URLs return 404 — do not use them.

---

## Authorization Code Flow

### Step 1: Redirect to Battle.net

```
GET https://oauth.battle.net/authorize
  ?client_id=<CLIENT_ID>
  &redirect_uri=<REDIRECT_URI>
  &response_type=code
  &scope=openid
  &state=<CSRF_STATE>
```

**Scopes available:** `openid` is sufficient for identity (BattleTag + account ID). Game-specific scopes (`wow.profile`, `d3.profile`, `sc2.profile`) exist but there is no `d4.profile` scope.

### Step 2: User authorizes → redirected back with code

```
GET <REDIRECT_URI>?code=<AUTH_CODE>&state=<CSRF_STATE>
```

### Step 3: Exchange code for access token

```
POST https://oauth.battle.net/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=<AUTH_CODE>
&redirect_uri=<REDIRECT_URI>
&client_id=<CLIENT_ID>
&client_secret=<CLIENT_SECRET>
```

**Token response:**

```json
{
  "access_token": "...",
  "token_type": "bearer",
  "expires_in": 86400,
  "scope": "openid"
}
```

**No refresh token.** Battle.net does not issue refresh tokens. Tokens expire in 24 hours. When a token expires, the user must re-authenticate. Supabase handles session management independently, so this mostly affects any direct Blizzard API calls (which we don't need for D4).

### Step 4: Fetch user info

```
GET https://oauth.battle.net/userinfo
Authorization: Bearer <ACCESS_TOKEN>
```

**Response:**

```json
{
  "sub": "12345678",
  "id": 12345678,
  "battletag": "PlayerOne#1234"
}
```

The `id` / `sub` is the player's unique Blizzard account ID. The `battletag` is their display name.

---

## Supabase Integration

### Approach: Custom OAuth Provider (Dashboard)

Supabase supports custom OAuth providers via the dashboard. Battle.net is not a built-in provider, so we use manual configuration.

### Dashboard Setup

1. Go to **Supabase Dashboard → Authentication → Providers**
2. Click **Add Provider → Manual configuration**
3. Configure:

| Field | Value |
|---|---|
| Provider ID | `custom:battlenet` |
| Client ID | Your Battle.net app Client ID |
| Client Secret | Your Battle.net app Client Secret |
| Authorization URL | `https://oauth.battle.net/authorize` |
| Token URL | `https://oauth.battle.net/token` |
| UserInfo URL | `https://oauth.battle.net/userinfo` |
| Scopes | `openid` |

4. Copy the **Callback URL** shown (read-only) — this is what you register as the redirect URI in the Battle.net developer portal.

**PKCE:** Enabled by default. Supabase generates the code challenge and verifier automatically. If Battle.net doesn't support PKCE (verify during setup), disable it in the provider settings.

**Limit:** Supabase allows up to 3 custom OAuth providers per project. Battle.net will be one. You can add Discord or others later.

---

## Next.js Implementation

### Client-side login trigger

```typescript
// src/components/auth/LoginButton.tsx
'use client';

import { createBrowserClient } from '@/lib/supabase/client';

export function LoginButton() {
  const supabase = createBrowserClient();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'custom:battlenet' as any,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error('Login error:', error.message);
  };

  return (
    <button onClick={handleLogin}>
      Sign in with Battle.net
    </button>
  );
}
```

### OAuth callback route

```typescript
// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to home with error param
  return NextResponse.redirect(`${origin}/?auth_error=true`);
}
```

### Middleware for session refresh

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### Profile auto-creation

The database trigger `on_auth_user_created` (defined in ARCHITECTURE.md schema) automatically creates a profile row when a new user signs up. It extracts `battletag` from `raw_user_meta_data`, which Supabase populates from the userinfo response.

**Verify during implementation:** Check that Supabase maps the `battletag` field from the userinfo response into `raw_user_meta_data`. If it uses a different key (e.g., `name` or `preferred_username`), update the trigger accordingly.

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Server-only (never prefixed with NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Battle.net Client ID and Secret are stored in the Supabase dashboard, not in your codebase. No Battle.net env vars needed in Next.js.

---

## Gotchas and Edge Cases

1. **TypeScript typing for custom providers.** Supabase's `signInWithOAuth` expects a union type for `provider`. `'custom:battlenet'` isn't in that union. Cast with `as any` or extend the type locally.

2. **BattleTag format.** BattleTags include a `#` and numbers (e.g., `PlayerOne#1234`). Blizzard has been transitioning away from the number suffix — verify the current format in the userinfo response during testing.

3. **No refresh token.** The Blizzard access token expires in 24h, but this doesn't affect the Supabase session. Supabase manages its own JWT-based session independently. Only matters if you ever need to call Blizzard APIs directly (we don't for D4).

4. **Region handling.** The userinfo endpoint is regional. Start with US only. If you need EU/KR/TW support, you'd need to let the user pick their region or detect it, then configure multiple custom providers or proxy through an Edge Function.

5. **PKCE compatibility.** Supabase enables PKCE by default. Battle.net's OAuth may or may not support PKCE — test during setup. If it fails, disable PKCE for the `custom:battlenet` provider in the dashboard.

6. **Rate limits.** Blizzard enforces rate limits on API calls (historically 36,000/hour per client). This only matters for the userinfo call during login, which is negligible volume.
