import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { Post } from '../types';
import { PostCard } from '../components/PostCard';
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Save,
  LogOut,
  AlertCircle,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, updateUserContext, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    if (!user) return;
    try {
      setLoadingPosts(true);
      const res = await postService.getPosts({ author: user._id });
      if (res.success) {
        setPosts(res.posts);
      }
    } catch (err) {
      console.error('Failed to load user posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);
      const res = await authService.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        avatar: avatar.trim() || undefined,
      });

      if (res.success && res.user) {
        updateUserContext(res.user);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-stone-100 pb-8">
          <img
            src={
              avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                name || 'User'
              )}&background=1c1917&color=fff`
            }
            alt={name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-3xl object-cover border border-stone-200 shadow-sm shrink-0"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900">{name}</h1>
              <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200 self-center sm:self-auto">
                {user?.role}
              </span>
            </div>

            <p className="font-serif italic text-sm text-stone-600 max-w-xl">
              {bio || 'No bio provided yet. Add one below to tell readers about your experience.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-stone-500 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 font-sans">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1.5 font-sans">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Member since {formatDate(user?.createdAt)}
              </span>
              <span className="flex items-center gap-1.5 font-sans font-semibold text-blue-800">
                <FileText className="w-3.5 h-3.5" />
                {posts.length} published {posts.length === 1 ? 'article' : 'articles'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="self-center sm:self-start px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 border border-rose-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Edit Profile Form */}
        <div className="pt-8">
          <h2 className="font-display text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-stone-700" />
            Edit Profile Information
          </h2>

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profileName" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="profileName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={50}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
                />
              </div>

              <div>
                <label htmlFor="profileAvatar" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Avatar Image URL
                </label>
                <input
                  id="profileAvatar"
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="profileBio" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Bio / Headline
              </label>
              <textarea
                id="profileBio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={300}
                placeholder="Software engineer writing about backend systems, databases, and clean code..."
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
              />
              <span className="text-[11px] text-stone-400 font-mono mt-1 block">
                {bio.length}/300 characters
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 active:bg-stone-950 rounded-xl shadow-xs disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Saving...</span>
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
      </div>

      {/* User's Published Posts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-stone-900">Articles Published by You</h2>
            <p className="text-xs text-stone-500 font-mono">
              Total {posts.length} published {posts.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>

        {loadingPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-200 h-64 animate-pulse"
              ></div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-2">
            <FileText className="w-10 h-10 text-stone-300 mx-auto" />
            <h4 className="font-display text-base font-semibold text-stone-800">No published articles</h4>
            <p className="text-xs text-stone-500">
              You haven't written any articles yet. Create your first post from the dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} showActions={true} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
