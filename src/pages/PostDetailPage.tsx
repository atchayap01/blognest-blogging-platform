import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Post } from '../types';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { CommentSection } from '../components/CommentSection';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Tag,
  Share2,
  Check,
  AlertCircle,
} from 'lucide-react';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await postService.getPostById(postId);
      if (res.success && res.post) {
        setPost(res.post);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to load this blog post.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Estimate read time based on word count
  const calculateReadTime = (text: string) => {
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  // Helper to render content with markdown-like formatting cleanly
  const renderFormattedContent = (content: string) => {
    if (!content) return null;

    const sections = content.split('\n\n');

    return (
      <div className="space-y-6 text-slate-800 text-base sm:text-lg leading-relaxed font-serif">
        {sections.map((section, idx) => {
          const trimmed = section.trim();

          // Heading 1 / 2
          if (trimmed.startsWith('## ')) {
            return (
              <h2
                key={idx}
                className="text-2xl sm:text-3xl font-bold font-sans text-slate-900 pt-4 pb-1 border-b border-slate-100 tracking-tight"
              >
                {trimmed.replace(/^##\s+/, '')}
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={idx}
                className="text-xl sm:text-2xl font-bold font-sans text-slate-900 pt-3 pb-1 tracking-tight"
              >
                {trimmed.replace(/^###\s+/, '')}
              </h3>
            );
          }

          // Blockquote
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-blue-600 bg-blue-50/50 pl-4 py-3 pr-4 rounded-r-xl italic text-slate-700 font-sans text-base"
              >
                {trimmed.replace(/^>\s*/, '')}
              </blockquote>
            );
          }

          // Code block
          if (trimmed.startsWith('```')) {
            const cleanCode = trimmed.replace(/^```[a-z]*\n?/, '').replace(/```$/, '');
            return (
              <div key={idx} className="my-4 font-mono text-xs sm:text-sm bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto shadow-inner">
                <pre>{cleanCode}</pre>
              </div>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split('\n').filter(Boolean);
            return (
              <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2 font-sans text-base text-slate-700">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item.replace(/^[-*]\s+/, '')}</li>
                ))}
              </ul>
            );
          }

          // Standard paragraph
          return (
            <p key={idx} className="leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-pulse">
        <div className="w-24 h-6 bg-slate-200 rounded"></div>
        <div className="w-3/4 h-10 bg-slate-200 rounded"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Post Not Found</h2>
        <p className="text-sm text-slate-600">{error || 'This article may have been removed or does not exist.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  const isOwner = user && (user._id === post.author?._id || user.role === 'admin');
  const authorName = post.author?.name || 'Anonymous Author';
  const authorAvatar =
    post.author?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=2563eb&color=fff`;

  return (
    <article className="max-w-4xl mx-auto pb-20">
      {/* Top Nav Back & Controls */}
      <div className="flex items-center justify-between py-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Articles</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg shadow-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-stone-200">
              <Link
                to={`/edit/${post._id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Post</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Header Info */}
      <header className="space-y-4 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-800">
          <span>{post.category || 'General'}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-stone-500 font-normal font-sans normal-case flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {calculateReadTime(post.content)}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 tracking-tight leading-[1.15]">
          {post.title}
        </h1>

        <p className="font-serif text-lg sm:text-xl text-stone-600 leading-relaxed italic font-normal">
          {post.excerpt}
        </p>

        {/* Author Bio Banner */}
        <div className="pt-4 pb-2 border-y border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={authorAvatar}
              alt={authorName}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover border border-stone-200 shadow-xs"
            />
            <div>
              <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                {authorName}
                {post.author?.role === 'admin' && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                    Staff
                  </span>
                )}
              </h4>
              <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5 font-sans">
                <Calendar className="w-3 h-3 text-stone-400" />
                Published on {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-10 rounded-3xl overflow-hidden aspect-[16/9] bg-stone-100 shadow-xs border border-stone-200">
          <img
            src={post.featuredImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        </div>
      )}

      {/* Full Content Body */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-12 shadow-xs">
        {renderFormattedContent(post.content)}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-stone-100 flex flex-wrap items-center gap-2 font-sans">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3" /> Topics:
            </span>
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-md transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Author Card Box */}
      {post.author?.bio && (
        <div className="mt-8 bg-stone-50 rounded-2xl p-6 border border-stone-200 flex items-start gap-4">
          <img
            src={authorAvatar}
            alt={authorName}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover shrink-0 border border-stone-300"
          />
          <div>
            <span className="text-[11px] uppercase font-semibold tracking-wider text-stone-400">
              Written by
            </span>
            <h4 className="text-base font-semibold text-stone-900">{authorName}</h4>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
              {post.author.bio}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Comments Section */}
      <CommentSection
        postId={post._id}
        initialCommentCount={post.commentCount}
        onCommentCountChange={(count) => {
          setPost((prev) => (prev ? { ...prev, commentCount: count } : null));
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Blog Post"
        message="Are you sure you want to permanently delete this blog post? All associated comments and discussions will also be removed. This action cannot be reversed."
        confirmLabel="Delete Post"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeletePost}
        onCancel={() => setShowDeleteModal(false)}
      />
    </article>
  );
};
