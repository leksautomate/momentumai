
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-8 flex justify-between items-center border-b border-white/5 sticky top-0 z-50 glass-panel">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-brand font-black text-white italic">M</div>
        <h1 className="text-xl font-brand font-black tracking-tighter uppercase italic">
          Momentum<span className="text-indigo-500">AI</span>
        </h1>
      </div>
      <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
        <a href="#" className="hover:text-white transition-colors">Pricing</a>
        <a href="#" className="hover:text-white transition-colors">Showcase</a>
        <a href="#" className="hover:text-white transition-colors">Tutorials</a>
      </nav>
      <button className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all shadow-lg shadow-white/5">
        Get Credits
      </button>
    </header>
  );
};

export default Header;
