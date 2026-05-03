'use client';

import { createClient } from '@/lib/supabase/client';

export default function LoginButton() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'custom:battlenet' as never,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button className="login-btn" onClick={handleLogin}>
      Sign in with Battle.net
    </button>
  );
}
