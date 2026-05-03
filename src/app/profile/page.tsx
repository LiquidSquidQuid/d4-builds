import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Profile — D4 Builds',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const battletag =
    profile?.battletag ??
    user.user_metadata?.battletag ??
    user.user_metadata?.name ??
    'Nephalem';

  const displayName = profile?.display_name ?? battletag;
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <div className="profile-hero">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{displayName}</h1>
            <p className="profile-meta">Joined {joinDate}</p>
          </div>
        </div>

        <div className="profile-card">
          <h2>My Builds</h2>
          <p className="profile-empty">No builds yet. Build creation coming soon.</p>
        </div>

        <div className="profile-card">
          <h2>My Characters</h2>
          <p className="profile-empty">No characters tracked yet. Character tracking coming soon.</p>
        </div>
      </div>
    </div>
  );
}
