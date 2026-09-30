import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/postService';
import {
  PenSquare,
  Image as ImageIcon,
  Tag,
  Folder,
  Eye,
  Edit,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  'Web Development',
  'Technology',
  'Career',
  'Best Practices',
  'Design',
  'Tutorial',
  'Cloud & DevOps',
];

const PRESET_IMAGES = [
  {
    name: 'Code & Screen',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Tech & Architecture',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Team & Collaboration',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Minimal Workspace',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
  },
];

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [customCategory, setCustomCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
  );
  const [tagsInput, setTagsInput] = useState('React, TypeScript, WebDev');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Please provide a title and content for your article.');
      return;
    }

    const finalCategory =
      category === 'Other' && customCategory.trim()
        ? customCategory.trim()
        : category;

    try {
      setSubmitting(true);
      setError(null);

      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const res = await postService.createPost({
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        featuredImage: featuredImage.trim() || undefined,
        category: finalCategory,
        tags: parsedTags,
      });

      if (res.success && res.post) {
        navigate(`/posts/${res.post._id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to publish post. Please check fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        {/* Tab switch between Editor and Preview */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isPreview
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isPreview
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 border-b border-stone-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200">
            <PenSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-stone-900">Create New Article</h1>
            <p className="text-xs text-stone-500 font-serif italic">
              Share your insights, code architecture, or tutorials with the BlogNest community
            </p>
          </div>
        </div>

        {error && (
          <div className="m-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isPreview ? (
          /* Live Preview Tab */
          <div className="p-6 sm:p-10 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {category === 'Other' ? customCategory || 'General' : category}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {title || 'Untitled Post'}
            </h1>
            <p className="text-slate-600 italic text-base">
              {excerpt || 'Your summary excerpt will appear here...'}
            </p>

            {featuredImage && (
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={featuredImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="prose max-w-none text-slate-800 whitespace-pre-line leading-relaxed font-serif text-base pt-4 border-t border-slate-100">
              {content || 'Start typing in the editor to see your rendered content here...'}
            </div>
          </div>
        ) : (
          /* Form Fields */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="postTitle" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Article Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="postTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Understanding Microservices with Node.js and Docker"
                required
                maxLength={150}
                className="w-full px-4 py-3 text-base text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category and Tags Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label htmlFor="postCategory" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-slate-400" />
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="postCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">Custom Category...</option>
                </select>

                {category === 'Other' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter category name"
                    className="mt-2 w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                )}
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="postTags" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Tags (comma separated)
                </label>
                <input
                  id="postTags"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. JavaScript, Architecture, MongoDB"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="postExcerpt" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Summary Excerpt
              </label>
              <textarea
                id="postExcerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                maxLength={300}
                placeholder="A brief 1-2 sentence preview for the card and search engines (leave blank to auto-generate from content)"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <label htmlFor="postFeaturedImage" className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                Featured Image URL
              </label>
              <input
                id="postFeaturedImage"
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Quick Image Presets */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400">Quick presets:</span>
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setFeaturedImage(preset.url)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="postContent" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Article Content (Markdown supported) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Supports ## Headings, &gt; Quotes, ``` Code blocks
                </span>
              </div>
              <textarea
                id="postContent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={14}
                required
                placeholder="Write your article here...
## Introduction
Share your background and context...

### Key Concepts
- First principle
- Second principle

```typescript
const solution = 'Clean code';
```"
                className="w-full px-4 py-3 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <Link
                to="/"
                className="px-5 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors border border-stone-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 active:bg-stone-950 rounded-xl shadow-xs disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Publishing to MongoDB...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Publish Post</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
