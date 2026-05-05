import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const providerToken = data.session.provider_token;

      if (providerToken) {
        try {
          const battletag = await fetchBattleTag(providerToken);

          if (battletag) {
            const admin = createAdminClient();
            const userId = data.session.user.id;

            await admin.auth.admin.updateUserById(userId, {
              user_metadata: { battletag },
            });

            await admin
              .from('profiles')
              .update({ battletag, display_name: battletag })
              .eq('id', userId);
          }
        } catch (err) {
          console.error('[auth/callback] Failed to fetch battletag:', err);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?auth_error=true`);
}

async function fetchBattleTag(accessToken: string): Promise<string | null> {
  const response = await fetch('https://oauth.battle.net/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error(
      `[auth/callback] Battle.net userinfo returned ${response.status}`
    );
    return null;
  }

  const data = await response.json();
  return data.battletag ?? null;
}
