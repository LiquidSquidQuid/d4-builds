'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const supabase = createClient();

  const battletag =
    user.user_metadata?.battletag ??
    user.user_metadata?.name ??
    user.user_metadata?.preferred_username ??
    'Nephalem';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="user-menu">
      <a href="/profile" className="user-menu-tag">{battletag}</a>
      <button className="user-menu-signout" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}
