import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 z-50 flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-mono">{`{}`}</span>
          AI Code Mentor
        </Link>
      </div>

      <div className="flex items-center gap-8">
        {/* Auth removed as requested */}
      </div>
    </nav>
  );
};