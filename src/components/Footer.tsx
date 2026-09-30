import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Shield, Code, Database, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                BlogNest
              </span>
            </Link>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              A high-performance full-stack publishing platform with real-time comments, 
              JWT authentication, and MongoDB Atlas database storage. Built for developers, thinkers, and storytellers.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Database className="w-3 h-3" /> MongoDB Atlas Ready
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Shield className="w-3 h-3" /> JWT & Bcrypt Auth
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Code className="w-3 h-3" /> Express + React + TS
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Featured Stories
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-blue-600 transition-colors">
                  All Topics & Categories
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-blue-600 transition-colors">
                  Write an Article
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
                  Creator Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech & Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Markdown Formatting</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Nested Comment Threads</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Dynamic Full-Text Search</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>REST API Architecture</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BlogNest. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for writers and readers.</span>
            <span className="font-semibold text-slate-700">Production Reliability</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
