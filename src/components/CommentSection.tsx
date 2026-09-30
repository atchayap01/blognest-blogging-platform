import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { commentService } from '../services/commentService';
import { MessageSquare, Send, Trash2, Calendar, User, AlertCircle } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface CommentSectionProps {
  postId: string;
  initialCommentCount?: number;
  onCommentCountChange?: (newCount: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  initialCommentCount = 0,
  onCommentCountChange,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await commentService.getCommentsByPost(postId);
      if (res.success) {
        setComments(res.comments);
        if (onCommentCountChange) {
          onCommentCountChange(res.count);
        }
      }
    } catch (err: any) {
      console.error('Failed to load comments:', err);
      setError(err.message || 'Could not load comments.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const res = await commentService.createComment(postId, content.trim());
      if (res.success && res.comment) {
        const updated = [res.comment, ...comments];
        setComments(updated);
        setContent('');
        if (onCommentCountChange) {
          onCommentCountChange(res.commentCount);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      setDeleting(true);
      const res = await commentService.deleteComment(commentToDelete);
      if (res.success) {
        const updated = comments.filter((c) => c._id !== commentToDelete);
        setComments(updated);
        if (onCommentCountChange) {
          onCommentCountChange(res.commentCount);
        }
      }
      setCommentToDelete(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-stone-200">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-stone-900">Discussion</h2>
            <p className="text-xs text-stone-500 font-mono">
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'} on this article
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* New Comment Form (or login call-to-action) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs mb-8">
        {user ? (
          <form onSubmit={handleAddComment} className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=1c1917&color=fff`
                }
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-stone-200"
              />
              <span className="text-xs font-semibold text-stone-800">
                Commenting as <span className="text-blue-800 font-bold">{user.name}</span>
              </span>
            </div>

            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are your thoughts on this story? Write a respectful and insightful comment..."
                rows={3}
                maxLength={1000}
                required
                className="w-full px-4 py-3 text-sm text-stone-800 placeholder-stone-400 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-400 font-mono">
                {content.length}/1000 characters
              </span>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Comment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 px-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto mb-3 border border-stone-200">
              <User className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base font-semibold text-stone-900 mb-1">
              Join the Conversation
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
              Sign in or create a free BlogNest account to share feedback, ask questions, and engage with the author.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-stone-200 animate-pulse space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-200"></div>
                  <div className="space-y-1">
                    <div className="w-24 h-3 bg-stone-200 rounded"></div>
                    <div className="w-16 h-2.5 bg-stone-200 rounded"></div>
                  </div>
                </div>
                <div className="w-full h-12 bg-stone-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300 p-8">
            <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-stone-700">No comments yet</h4>
            <p className="text-xs text-stone-500 mt-1">
              Be the first to share your perspectives on this story!
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const author = comment.author;
            const authorName = author?.name || 'Anonymous User';
            const authorAvatar =
              author?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                authorName
              )}&background=1c1917&color=fff`;

            const isAuthor =
              user && (user._id === author?._id || user.role === 'admin');

            return (
              <div
                key={comment._id}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs hover:border-stone-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={authorAvatar}
                      alt={authorName}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900">
                          {authorName}
                        </span>
                        {author?.role === 'admin' && (
                          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            Staff
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5 font-mono">
                        <Calendar className="w-3 h-3 text-stone-300" />
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Delete button (owner only) */}
                  {isAuthor && (
                    <button
                      type="button"
                      onClick={() => setCommentToDelete(comment._id)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete your comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-stone-700 whitespace-pre-line leading-relaxed pl-12 font-prose">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Comment Confirmation Modal */}
      <ConfirmModal
        isOpen={!!commentToDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel="Delete Comment"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDeleteComment}
        onCancel={() => setCommentToDelete(null)}
      />
    </section>
  );
};
