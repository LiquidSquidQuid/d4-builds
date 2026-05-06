import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BuildCard from '@/components/builds/BuildCard';
import type { Build } from '@/lib/types/builds';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, battletag')
    .eq('id', id)
    .single();

  const name = profile?.battletag ?? profile?.display_name ?? 'Player';
  return {
    title: `${name}'s Profile`,
    description: `View ${name}'s public Diablo 4 builds and stats.`,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !profile) {
    notFound();
  }

  // Fetch public builds
  const { data: builds } = await supabase
    .from('builds')
    .select('*')
    .eq('user_id', id)
    .eq('is_public', true)
    .order('vote_count', { ascending: false });

  const publicBuilds = (builds ?? []) as Build[];
  const totalVotes = publicBuilds.reduce((sum, b) => sum + b.vote_count, 0);
  const displayName = profile.battletag ?? profile.display_name ?? 'Nephalem';

  const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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

        <div className="public-profile-stats">
          <div className="public-profile-stat">
            <span className="public-profile-stat-value">{publicBuilds.length}</span>
            <span className="public-profile-stat-label">Builds</span>
          </div>
          <div className="public-profile-stat">
            <span className="public-profile-stat-value">{totalVotes}</span>
            <span className="public-profile-stat-label">Votes</span>
          </div>
        </div>

        {publicBuilds.length > 0 ? (
          <div className="profile-card">
            <h2>Public Builds</h2>
            <div className="profile-builds-list">
              {publicBuilds.map(build => (
                <BuildCard key={build.id} build={build} />
              ))}
            </div>
          </div>
        ) : (
          <div className="profile-card">
            <p className="profile-empty">No public builds yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
