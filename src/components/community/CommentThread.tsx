'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CommentWithAuthor } from '@/lib/types/community';
import CommentForm from './CommentForm';

interface CommentThreadProps {
  buildId: string;
  userId: string | null;
}

export default function CommentThread({ buildId, userId }: CommentThreadProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles:user_id(display_name, battletag)')
      .eq('build_id', buildId)
      .order('created_at', { ascending: true });

    setComments((data ?? []) as CommentWithAuthor[]);
    setLoading(false);
  }, [buildId, supabase]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const topLevel = comments.filter(c => !c.parent_id);
  const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId);

  return (
    <div className="comment-thread">
      <h2 className="build-detail-section-title">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      <CommentForm
        buildId={buildId}
        userId={userId}
        onSubmit={fetchComments}
      />

      {loading ? (
        <p className="comment-loading">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="comment-empty">No comments yet. Be the first!</p>
      ) : (
        <div className="comment-list">
          {topLevel.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={getReplies(comment.id)}
              buildId={buildId}
              userId={userId}
              onUpdate={fetchComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: CommentWithAuthor;
  replies: CommentWithAuthor[];
  buildId: string;
  userId: string | null;
  onUpdate: () => void;
}

function CommentItem({ comment, replies, buildId, userId, onUpdate }: CommentItemProps) {
  const [showReply, setShowReply] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const isOwner = userId === comment.user_id;

  const authorName = comment.profiles?.battletag ?? comment.profiles?.display_name ?? 'Unknown';
  const date = new Date(comment.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    setLoading(true);
    try {
      await supabase
        .from('comments')
        .update({ content: editContent.trim() })
        .eq('id', comment.id);
      setEditing(false);
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await supabase.from('comments').delete().eq('id', comment.id);
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-item-header">
        <span className="comment-author">{authorName}</span>
        <span className="comment-date">{date}</span>
      </div>

      {editing ? (
        <div className="comment-edit">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="build-editor-textarea comment-form-textarea"
            rows={2}
          />
          <div className="comment-edit-actions">
            <button className="comment-form-submit" onClick={handleEdit} disabled={loading}>Save</button>
            <button className="comment-form-cancel" onClick={() => { setEditing(false); setEditContent(comment.content); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <p className="comment-content">{comment.content}</p>
      )}

      <div className="comment-actions">
        {userId && !editing && (
          <button
            className="comment-action-btn"
            onClick={() => setShowReply(!showReply)}
          >
            Reply
          </button>
        )}
        {isOwner && !editing && (
          <>
            <button className="comment-action-btn" onClick={() => setEditing(true)}>Edit</button>
            <button className="comment-action-btn comment-delete-btn" onClick={handleDelete} disabled={loading}>Delete</button>
          </>
        )}
      </div>

      {showReply && (
        <div className="comment-reply-form">
          <CommentForm
            buildId={buildId}
            parentId={comment.id}
            userId={userId}
            onSubmit={() => { setShowReply(false); onUpdate(); }}
            onCancel={() => setShowReply(false)}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="comment-replies">
          {replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]}
              buildId={buildId}
              userId={userId}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
