import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MyBuildsList from '@/components/builds/MyBuildsList';
import MyCharactersList from '@/components/characters/MyCharactersList';
import type { CharacterWithProgress } from '@/lib/types/characters';

export const metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const [profileResult, buildsResult, charactersResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('builds')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false }),
    supabase
      .from('characters')
      .select('*, progression_steps(*)')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false }),
  ]);

  const profile = profileResult.data;
  const builds = buildsResult.data ?? [];
  const characters = (charactersResult.data ?? []) as CharacterWithProgress[];

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
          <div className="profile-card-header">
            <h2>My Builds</h2>
            <Link href="/builds/new" className="login-btn">
              + New Build
            </Link>
          </div>
          <MyBuildsList builds={builds} />
        </div>

        <div className="profile-card">
          <h2>My Characters</h2>
          <MyCharactersList characters={characters} builds={builds} />
        </div>
      </div>
    </div>
  );
}
