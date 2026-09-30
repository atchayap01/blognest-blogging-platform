import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PenSquare,
  Compass,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Database,
  BookOpen,
} from 'lucide-react';
import { DatabaseModal } from './DatabaseModal';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Zone 1: Single element brand wordmark */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-600 transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="font-display text-2xl font-semibold tracking-tight text-stone-900 group-hover:text-blue-700 transition-colors">
                  BlogNest
                </span>
              </Link>

              {/* Zone 2: Clean text nav links */}
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-2 decoration-blue-600'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/explore"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/explore')
                      ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-2 decoration-blue-600'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  Explore Articles
                </Link>
                {user && (
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-2 decoration-blue-600'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
            </div>

            {/* Zone 3: Actions & Auth */}
            <div className="flex items-center gap-3">
              {/* DB Status Indicator */}
              <button
                type="button"
                onClick={() => setShowDbModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md border border-stone-200/80 transition-colors"
                title="View Database Status & Configuration"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-mono">MongoDB Active</span>
              </button>

              {user ? (
                <>
                  <Link
                    to="/create"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 active:bg-black rounded-lg shadow-xs transition-colors"
                  >
                    <PenSquare className="w-3.5 h-3.5" />
                    <span>Write</span>
                  </Link>

                  {/* User Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=1c1917&color=fff`
                        }
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-stone-200"
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200/80 py-1.5 z-50 animate-in fade-in duration-100">
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-sm font-semibold text-stone-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-stone-500 truncate">{user.email}</p>
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest block mt-0.5">
                            Role · {user.role}
                          </span>
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          My Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-stone-400" />
                          Dashboard
                        </Link>
                        <Link
                          to="/create"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        >
                          <PenSquare className="w-3.5 h-3.5 text-stone-400" />
                          Write Article
                        </Link>

                        <div className="my-1 border-t border-stone-100"></div>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 text-base font-medium rounded-lg ${
                isActive('/') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`block px-3 py-2 text-base font-medium rounded-lg ${
                isActive('/explore') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-700'
              }`}
            >
              Explore Stories
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 text-base font-medium rounded-lg ${
                    isActive('/dashboard') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-700'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/create"
                  className={`block px-3 py-2 text-base font-medium rounded-lg ${
                    isActive('/create') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-700'
                  }`}
                >
                  Write Post
                </Link>
                <Link
                  to="/profile"
                  className={`block px-3 py-2 text-base font-medium rounded-lg ${
                    isActive('/profile') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-700'
                  }`}
                >
                  Profile ({user.name})
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-base font-medium text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 px-4 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDbModal(true)}
                className="w-full text-left px-3 py-2 text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                MongoDB Status & Settings
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Database Modal */}
      {showDbModal && <DatabaseModal onClose={() => setShowDbModal(false)} />}
    </>
  );
};
