import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import {
  Edit3,
  Image as ImageIcon,
  Tag,
  Folder,
  ArrowLeft,
  AlertCircle,
  Save,
  Trash2,
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

const CATEGORIES = [
  'Web Development',
  'Technology',
  'Career',
  'Best Practices',
  'Design',
  'Tutorial',
  'Cloud & DevOps',
];

export const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadPost(id);
    }
  }, [id]);

  const loadPost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await postService.getPostById(postId);

      if (res.success && res.post) {
        const post = res.post;

        // Check ownership
        if (user && user._id !== post.author?._id && user.role !== 'admin') {
          setError('Unauthorized: You are not permitted to edit someone else’s article.');
          setLoading(false);
          return;
        }

        setTitle(post.title || '');
        setCategory(post.category || 'Web Development');
        setExcerpt(post.excerpt || '');
        setFeaturedImage(post.featuredImage || '');
        setTagsInput(post.tags ? post.tags.join(', ') : '');
        setContent(post.content || '');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load post for editing.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const res = await postService.updatePost(id, {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        featuredImage: featuredImage.trim() || undefined,
        category: category.trim(),
        tags: parsedTags,
      });

      if (res.success && res.post) {
        navigate(`/posts/${id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update post.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      const res = await postService.deletePost(id);
      if (res.success) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete post.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 space-y-4 animate-pulse">
        <div className="w-28 h-6 bg-slate-200 rounded"></div>
        <div className="h-96 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-full h-10 bg-slate-200 rounded"></div>
          <div className="w-full h-10 bg-slate-100 rounded"></div>
          <div className="w-full h-40 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-6">
        <Link
          to={id ? `/posts/${id}` : '/dashboard'}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Post</span>
        </Link>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Post</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 border-b border-stone-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-stone-900">Edit Article</h1>
            <p className="text-xs text-stone-500 font-serif italic">
              Update your article content, tags, or cover photo. Changes are saved to MongoDB instantly.
            </p>
          </div>
        </div>

        {error && (
          <div className="m-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="editTitle" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Article Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="editTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 text-base text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="editCategory" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-slate-400" />
                Category
              </label>
              <select
                id="editCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="editTags" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Tags (comma separated)
              </label>
              <input
                id="editTags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="editExcerpt" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Summary Excerpt
            </label>
            <textarea
              id="editExcerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={300}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label htmlFor="editFeaturedImage" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              Featured Image URL
            </label>
            <input
              id="editFeaturedImage"
              type="url"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {featuredImage && (
              <div className="mt-3 aspect-[16/7] rounded-xl overflow-hidden bg-slate-100 max-w-sm">
                <img
                  src={featuredImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="editContent" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Article Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="editContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              required
              className="w-full px-4 py-3 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors border border-stone-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 active:bg-stone-950 rounded-xl shadow-xs disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Saving changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Blog Post"
        message="Are you sure you want to permanently delete this article? This action cannot be undone."
        confirmLabel="Delete Post"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
