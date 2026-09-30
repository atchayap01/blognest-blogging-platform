import React, { useState, useEffect } from 'react';
import { Post, CategoryInfo } from '../types';
import { postService } from '../services/postService';
import { PostCard } from '../components/PostCard';
import { Search, Compass, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'oldest'>('newest');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, selectedTag, sortBy, page]);

  const fetchCategories = async () => {
    try {
      const res = await postService.getCategories();
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await postService.getPosts({
        search: searchQuery.trim() || undefined,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        tag: selectedTag || undefined,
        sort: sortBy,
        page,
        limit: 9,
      });

      if (res.success) {
        setPosts(res.posts);
        setTotalPages(res.totalPages);
        setTotalCount(res.total);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const resetAll = () => {
    setSelectedCategory('All');
    setSelectedTag('');
    setSearchQuery('');
    setSortBy('newest');
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-blue-800 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover & Learn</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-stone-900 tracking-tight">
            Explore All Blog Posts
          </h1>
          <p className="font-serif text-stone-600 text-base sm:text-lg mt-2 leading-relaxed italic">
            Browse curated articles across web development, software architecture, career advice, and engineering craft.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <form onSubmit={handleSearch} className="mt-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, titles, or concepts..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors"
            >
              Search
            </button>

            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
              <label htmlFor="exploreSortBy" className="sr-only">Sort Articles</label>
              <select
                id="exploreSortBy"
                value={sortBy}
                onChange={(e: any) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent focus:outline-none cursor-pointer text-xs"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Commented</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </form>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-5 border-t border-stone-100 mt-6 no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              selectedCategory === 'All'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => {
                setSelectedCategory(c.name);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors flex items-center gap-1.5 ${
                selectedCategory === c.name
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{c.name}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  selectedCategory === c.name
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-200/80 text-stone-700'
                }`}
              >
                {c.count}
              </span>
            </button>
          ))}
        </div>

        {/* Active Tag filter indicator */}
        {selectedTag && (
          <div className="mt-4 flex items-center gap-2 text-xs text-stone-600">
            <span>Filtered by tag:</span>
            <span className="inline-flex items-center gap-1 bg-stone-100 border border-stone-200 text-stone-800 px-2.5 py-1 rounded-md font-medium">
              #{selectedTag}
              <button onClick={() => setSelectedTag('')} className="hover:text-rose-600 ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-200">
          <p className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Showing {posts.length} of {totalCount} total publications
          </p>
          {(selectedCategory !== 'All' || selectedTag || searchQuery) && (
            <button
              onClick={resetAll}
              className="text-xs text-blue-700 hover:underline font-semibold"
            >
              Clear all active filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden animate-pulse h-96"
              >
                <div className="h-48 bg-stone-100"></div>
                <div className="p-5 space-y-3">
                  <div className="w-20 h-3 bg-stone-200 rounded"></div>
                  <div className="w-full h-5 bg-stone-200 rounded"></div>
                  <div className="w-3/4 h-3 bg-stone-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-8 space-y-3">
            <Compass className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-display font-semibold text-lg text-stone-800">No matching articles</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn't find any published stories matching your criteria. Try resetting your search filters.
            </p>
            <button
              onClick={resetAll}
              className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-stone-700 px-3">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
