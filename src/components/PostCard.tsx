import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { MessageSquare, Calendar, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, showActions = false, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user && (user._id === post.author?._id || user.role === 'admin');

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const authorName = post.author?.name || 'Anonymous Author';
  const authorAvatar =
    post.author?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=2563eb&color=fff`;

  const calculateReadTime = (text: string) => {
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  return (
    <article className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-200 flex flex-col h-full">
      {/* Featured Image */}
      <Link to={`/posts/${post._id}`} className="relative block aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={post.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </Link>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Category Kicker */}
          <div className="flex items-center gap-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-blue-800">
            <span>{post.category || 'General'}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-400 font-normal font-sans normal-case tracking-normal">
              {calculateReadTime(post.content || '')}
            </span>
          </div>

          {/* Post Title */}
          <h3 className="font-display font-semibold text-xl sm:text-2xl text-stone-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2.5 leading-snug">
            <Link to={`/posts/${post._id}`}>{post.title}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-stone-600 text-sm line-clamp-2 leading-relaxed mb-4">
            {post.excerpt}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-4 border-t border-stone-100 mt-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            {/* Author & Date with clean separator */}
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={authorAvatar}
                alt={authorName}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover border border-stone-200 shrink-0"
              />
              <span className="font-medium text-stone-800 truncate">{authorName}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-stone-500 shrink-0">{formatDate(post.createdAt)}</span>
            </div>

            {/* Comment Count */}
            <div className="flex items-center gap-1 text-stone-500 font-mono text-[11px] shrink-0 pl-2">
              <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
              <span>{post.commentCount || 0}</span>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between">
            <Link
              to={`/posts/${post._id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors group/btn"
            >
              <span>Read article</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>

            {/* Quick Actions (if owner or showActions requested) */}
            {(showActions || isOwner) && (
              <div className="flex items-center gap-1">
                <Link
                  to={`/edit/${post._id}`}
                  className="p-1 text-stone-500 hover:text-blue-700 hover:bg-stone-100 rounded transition-colors"
                  title="Edit post"
                >
                  <Edit className="w-3.5 h-3.5" />
                </Link>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(post._id)}
                    className="p-1 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
