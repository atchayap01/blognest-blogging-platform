import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post, CategoryInfo } from '../types';
import { postService } from '../services/postService';
import { PostCard } from '../components/PostCard';
import {
  Search,
  PenSquare,
  Sparkles,
  TrendingUp,
  Filter,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'oldest'>('newest');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, sortBy]);

  const fetchInitialData = async () => {
    try {
      const catRes = await postService.getCategories();
      if (catRes.success) {
        setCategories(catRes.categories);
      }
    } catch (e) {
      console.warn('Could not load categories:', e);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await postService.getPosts({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery.trim() || undefined,
        sort: sortBy,
        limit: 9,
      });

      if (res.success) {
        setPosts(res.posts);
      }
    } catch (err: any) {
      console.error('Failed to fetch posts:', err);
      setError(err.message || 'Failed to fetch posts from MongoDB server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('newest');
  };

  // Find lead story if available and not filtered
  const isFiltered = selectedCategory !== 'All' || !!searchQuery.trim();
  const leadPost = !isFiltered && posts.length > 0 ? posts[0] : null;
  const gridPosts = !isFiltered && posts.length > 0 ? posts.slice(1) : posts;

  const calculateReadTime = (text: string) => {
    const words = text ? text.split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
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
    <div className="space-y-12 pb-20">
      {/* Editorial Masthead */}
      <section className="pt-6 pb-4 border-b border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 font-mono pb-4 border-b border-stone-100 gap-2">
          <span>VOL. IV · THE ENGINEERING ARCHIVES</span>
          <span>AUTONOMOUS MONGODB ATLAS STORAGE · RESTful API</span>
          <span>EST. 2026</span>
        </div>

        <div className="py-8 sm:py-12 text-center max-w-4xl mx-auto space-y-4">
          <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-stone-900 leading-tight">
            Write. Share. Connect.
          </h1>
          <p className="font-prose text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto italic font-normal leading-relaxed">
            Curated essays, technical architecture notes, and thoughtful perspectives from engineers and creators.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4">
            <Link
              to={user ? '/create' : '/register'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>{user ? 'Publish an Article' : 'Start Writing Free'}</span>
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
            >
              <span>Explore Archive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tier 1: Lead Story Showcase (When unfiltered) */}
      {leadPost && (
        <section className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:border-stone-300 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image side */}
            <Link
              to={`/posts/${leadPost._id}`}
              className="lg:col-span-7 relative block aspect-[16/10] lg:aspect-auto overflow-hidden bg-stone-100"
            >
              <img
                src={leadPost.featuredImage}
                alt={leadPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </Link>

            {/* Editorial copy side */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-800 mb-3">
                  <span>Cover Story</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span>{leadPost.category}</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-stone-400 font-normal font-sans normal-case">
                    {calculateReadTime(leadPost.content)}
                  </span>
                </div>

                <h2 className="font-display font-semibold text-2xl sm:text-3xl text-stone-900 hover:text-blue-800 transition-colors leading-snug mb-4">
                  <Link to={`/posts/${leadPost._id}`}>{leadPost.title}</Link>
                </h2>

                <p className="font-prose text-stone-600 text-base leading-relaxed line-clamp-4 mb-6">
                  {leadPost.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={
                      leadPost.author?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        leadPost.author?.name || 'Author'
                      )}&background=1c1917&color=fff`
                    }
                    alt={leadPost.author?.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <span className="text-xs font-medium text-stone-900 block leading-tight">
                      {leadPost.author?.name}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {formatDate(leadPost.createdAt)}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/posts/${leadPost._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter & Search Bar */}
      <section className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search essays by keyword, architecture topic, or tag..."
              className="w-full pl-10 pr-20 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-md transition-colors"
            >
              Search
            </button>
          </form>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-700 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <label htmlFor="sortBy" className="sr-only">Sort By</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-xs font-medium"
            >
              <option value="newest">Latest First</option>
              <option value="popular">Most Discussed</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Segmented Category Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pt-3 mt-3 border-t border-stone-100 no-scrollbar">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-2">
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            All Publications
          </button>
          {['Web Development', 'Career', 'Best Practices', 'Technology', 'Design'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="ml-auto text-xs text-blue-700 hover:underline shrink-0 font-medium"
            >
              Reset filters
            </button>
          )}
        </div>
      </section>

      {/* Main Articles Grid */}
      <section>
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-2xl text-stone-900">
              {isFiltered ? `Results for "${selectedCategory}"` : 'Recent Articles'}
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {posts.length} {posts.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {error && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-center space-y-2 mb-8">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchPosts}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Reconnecting
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pulse h-96"
              >
                <div className="h-48 bg-stone-100"></div>
                <div className="p-6 space-y-3">
                  <div className="w-20 h-3 bg-stone-200 rounded"></div>
                  <div className="w-full h-5 bg-stone-200 rounded"></div>
                  <div className="w-3/4 h-3 bg-stone-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : gridPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-8 space-y-3">
            <Search className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-display font-semibold text-lg text-stone-800">No publications found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn't find any articles matching your search query or filter. Try clearing filters to see all essays.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
