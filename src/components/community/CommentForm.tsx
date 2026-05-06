'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CommentFormProps {
  buildId: string;
  parentId?: string | null;
  userId: string | null;
  onSubmit: () => void;
  onCancel?: () => void;
}

export default function CommentForm({ buildId, parentId, userId, onSubmit, onCancel }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  if (!userId) {
    return (
      <div className="comment-form-auth">
        <p>Sign in with Battle.net to comment.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const { error: err } = await supabase
        .from('comments')
        .insert({
          build_id: buildId,
          user_id: userId,
          parent_id: parentId ?? null,
          content: content.trim(),
        });

      if (err) throw new Error(err.message);
      setContent('');
      onSubmit();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? 'Write a reply...' : 'Write a comment...'}
        className="build-editor-textarea comment-form-textarea"
        rows={parentId ? 2 : 3}
        maxLength={2000}
      />
      {error && <p className="comment-form-error">{error}</p>}
      <div className="comment-form-actions">
        <button
          type="submit"
          className="comment-form-submit"
          disabled={loading || !content.trim()}
        >
          {loading ? 'Posting...' : parentId ? 'Reply' : 'Comment'}
        </button>
        {onCancel && (
          <button type="button" className="comment-form-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
