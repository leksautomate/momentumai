
import React from 'react';
import { Slide, VisualStyle } from '../types';

interface SlideCardProps {
  slide: Slide;
  style: VisualStyle;
}

const SlideCard: React.FC<SlideCardProps> = ({ slide, style }) => {
  return (
    <div className="flex-shrink-0 w-[320px] md:w-[400px] h-[500px] md:h-[600px] glass-panel rounded-3xl overflow-hidden flex flex-col relative group">
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-black/40 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-xs font-black italic tracking-widest border border-white/10 uppercase">
          Slide {slide.slideNumber}
        </span>
      </div>
      
      <div className="h-2/3 w-full bg-neutral-900 relative overflow-hidden">
        {slide.imageUrl ? (
          <img 
            src={slide.imageUrl} 
            alt={`Slide ${slide.slideNumber}`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-neutral-900 to-neutral-800">
            <div className="w-12 h-12 border-2 border-white/10 border-t-white/40 rounded-full animate-spin mb-4" />
            <p className="text-xs text-neutral-500 uppercase font-black tracking-widest italic">Visualizing momentum...</p>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center bg-black/40">
        <p className="text-sm md:text-base leading-relaxed text-gray-200 font-medium">
          {slide.text}
        </p>
      </div>

      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
      </div>
    </div>
  );
};

export default SlideCard;
