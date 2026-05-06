'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface VoteButtonProps {
  buildId: string;
  initialVoteCount: number;
  initialHasVoted: boolean;
  userId: string | null;
}

export default function VoteButton({ buildId, initialVoteCount, initialHasVoted, userId }: VoteButtonProps) {
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleVote = async () => {
    if (!userId) {
      // Trigger login
      await supabase.auth.signInWithOAuth({
        provider: 'custom:battlenet' as never,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      return;
    }

    if (loading) return;
    setLoading(true);

    // Optimistic update
    const newHasVoted = !hasVoted;
    setHasVoted(newHasVoted);
    setVoteCount(prev => prev + (newHasVoted ? 1 : -1));

    try {
      if (newHasVoted) {
        const { error } = await supabase
          .from('build_votes')
          .insert({ build_id: buildId, user_id: userId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('build_votes')
          .delete()
          .eq('build_id', buildId)
          .eq('user_id', userId);
        if (error) throw error;
      }
    } catch {
      // Rollback
      setHasVoted(!newHasVoted);
      setVoteCount(prev => prev + (newHasVoted ? -1 : 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`vote-button ${hasVoted ? 'vote-button-active' : ''}`}
      onClick={handleVote}
      disabled={loading}
      aria-label={hasVoted ? 'Remove vote' : 'Vote for this build'}
    >
      <span className="vote-button-icon">&#9650;</span>
      <span className="vote-button-count" aria-live="polite">{voteCount}</span>
    </button>
  );
}
