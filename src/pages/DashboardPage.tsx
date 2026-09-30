import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { Post, Comment, DashboardStats } from '../types';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  PenSquare,
  User as UserIcon,
  Trash2,
  Edit,
  ExternalLink,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalCommentsReceived: 0,
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [recentComments, setRecentComments] = useState<
    (Comment & { post: { _id: string; title: string } })[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await userService.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
        setPosts(res.posts);
        setRecentComments(res.recentComments);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      const res = await postService.deletePost(deleteTargetId);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p._id !== deleteTargetId));
        setStats((prev) => ({
          ...prev,
          totalPosts: Math.max(0, prev.totalPosts - 1),
        }));
      }
      setDeleteTargetId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || 'User'
              )}&background=1c1917&color=fff`
            }
            alt={user?.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900">
                Welcome back, {user?.name}!
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 font-serif italic">
              Manage your authored articles, review audience interactions, and view MongoDB analytics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 border border-stone-200"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile Settings</span>
          </Link>
          <Link
            to="/create"
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Write New Post</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
              My Published Articles
            </span>
            <span className="text-2xl font-mono font-bold text-stone-900">{stats.totalPosts}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
              Total Comments Received
            </span>
            <span className="text-2xl font-mono font-bold text-stone-900">
              {stats.totalCommentsReceived}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
              Audience Engagement
            </span>
            <span className="text-sm font-semibold text-stone-900">
              {stats.totalPosts > 0
                ? (stats.totalCommentsReceived / stats.totalPosts).toFixed(1)
                : '0'}{' '}
              comments / post avg
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'posts'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Articles ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'comments'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Recent Comments ({recentComments.length})</span>
        </button>
      </div>

      {/* Tab Content: Posts */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-stone-200 animate-pulse h-24"
                ></div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-3">
              <FileText className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-display font-semibold text-lg text-stone-800">You haven't published any posts yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Ready to share your voice? Write your first blog post and start discussions with readers.
              </p>
              <div className="pt-2">
                <Link
                  to="/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Write Your First Post</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs divide-y divide-stone-100">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        post.featuredImage ||
                        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                    />
                    <div>
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-blue-800 mb-1">
                        {post.category}
                      </span>
                      <h3 className="font-display text-base sm:text-lg font-semibold text-stone-900 hover:text-blue-800 transition-colors">
                        <Link to={`/posts/${post._id}`}>{post.title}</Link>
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-stone-500 mt-1.5 font-mono text-[11px]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {formatDate(post.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                          {post.commentCount || 0} comments
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link
                      to={`/posts/${post._id}`}
                      className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                      title="View Live Post"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/edit/${post._id}`}
                      className="p-2 text-stone-500 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(post._id)}
                      className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Comments */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-stone-200 animate-pulse h-24"
                ></div>
              ))}
            </div>
          ) : recentComments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-2">
              <MessageSquare className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-display font-semibold text-lg text-stone-800">No comments received yet</h3>
              <p className="text-xs text-stone-500">
                When readers comment on your stories, their feedback will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
              {recentComments.map((comment) => (
                <div key={comment._id} className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          comment.author?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            comment.author?.name || 'Reader'
                          )}&background=1c1917&color=fff`
                        }
                        alt={comment.author?.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-stone-200"
                      />
                      <span className="text-xs font-semibold text-stone-900">
                        {comment.author?.name || 'Reader'}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        commented on
                      </span>
                      <Link
                        to={`/posts/${comment.post?._id || comment.post}`}
                        className="text-xs font-semibold text-blue-800 hover:underline truncate max-w-xs"
                      >
                        "{comment.post?.title || 'Article'}"
                      </Link>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200 font-serif italic">
                    "{comment.content}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Blog Post"
        message="Are you sure you want to delete this article? All comments related to this post will also be deleted from MongoDB."
        confirmLabel="Delete Post"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeletePost}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
