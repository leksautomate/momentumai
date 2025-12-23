
import React, { useState } from 'react';
import { VisualStyle, Feed, Slide, GenerationStatus, AspectRatio } from './types';
import Header from './components/Header';
import LoadingOverlay from './components/LoadingOverlay';
import SlideCard from './components/SlideCard';
import { generateScript, generateSlideImage } from './services/geminiService';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(1);
  const [style, setStyle] = useState<VisualStyle>(VisualStyle.CINEMATIC);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [status, setStatus] = useState<GenerationStatus>({ step: 'idle', message: '', progress: 0 });
  const [feed, setFeed] = useState<Feed | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const handleDownloadImage = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `momentum-ai-${topic.toLowerCase().replace(/\s+/g, '-')}-${index + 1}.png`;
    link.click();
  };
  
  const handleGenerate = async () => {
    if (!topic.trim()) return;

    try {
      setStatus({ step: 'scripting', message: 'Analyzing topic & engineering narrative bridges...', progress: 10 });
      setFeed(null);

      const scriptResult = await generateScript(topic, slideCount, style);
      
      const newFeed: Feed = {
        id: Math.random().toString(36).substr(2, 9),
        topic,
        style,
        aspectRatio,
        slides: scriptResult.slides.map((s, idx) => ({
          ...s,
          id: `${idx}`,
          generatingImage: true
        })) as Slide[],
        hashtags: scriptResult.hashtags,
        totalWords: scriptResult.slides.reduce((acc, s) => acc + (s.text?.split(' ').length || 0), 0)
      };

      setFeed(newFeed);
      setStatus({ step: 'visualizing', message: 'Synthesizing viral aesthetics...', progress: 40 });

      const updatedSlides = [...newFeed.slides];
      for (let i = 0; i < updatedSlides.length; i++) {
        const slide = updatedSlides[i];
        setStatus(prev => ({
          ...prev,
          message: `Visualizing ${aspectRatio} frame ${i + 1} of ${updatedSlides.length}...`,
          progress: 40 + (i / updatedSlides.length) * 55
        }));

        try {
          const imageUrl = await generateSlideImage(slide.imagePrompt, style, aspectRatio);
          updatedSlides[i] = { ...slide, imageUrl, generatingImage: false };
          setFeed(prev => prev ? { ...prev, slides: [...updatedSlides] } : null);
        } catch (err) {
          console.error(`Failed image generation`, err);
          updatedSlides[i] = { ...slide, generatingImage: false };
          setFeed(prev => prev ? { ...prev, slides: [...updatedSlides] } : null);
        }
      }

      setStatus({ step: 'completed', message: 'Momentum Engineered!', progress: 100 });
      setTimeout(() => setStatus(prev => ({ ...prev, step: 'idle' })), 1500);

    } catch (error) {
      console.error("Generation failed:", error);
      setStatus({ step: 'error', message: 'The engine stalled. Please try again.', progress: 0 });
      setTimeout(() => setStatus(prev => ({ ...prev, step: 'idle' })), 3000);
    }
  };

  const fullScript = feed?.slides.map(s => s.text).join('\n\n') || '';
  const hashtagText = feed?.hashtags.map(t => `#${t.replace(/^#/, '')}`).join(' ') || '';
  const combinedBundle = `${fullScript}\n\n.\n.\n.\n${hashtagText}`;

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/30">
      <Header />
      
      {status.step !== 'idle' && status.step !== 'error' && (
        <LoadingOverlay status={status.message} progress={status.progress} />
      )}

      <main className="flex-1 flex flex-col items-center">
        {/* Input Section */}
        <section className={`w-full max-w-6xl px-6 py-12 transition-all duration-700 ${feed ? 'opacity-40 scale-95 blur-sm h-0 overflow-hidden py-0' : 'opacity-100 scale-100'}`}>
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-6xl font-brand font-black uppercase italic tracking-tighter leading-tight">
              FB Optimized. <span className="gradient-text">Instant Retention.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Engineered for high-impact Facebook posts with 400-word deep-narrative scripts.
            </p>
          </div>

          <div className="glass-panel p-2 rounded-[2rem] shadow-2xl shadow-indigo-500/10">
            <div className="flex flex-col md:flex-row gap-2">
              <input 
                type="text" 
                placeholder="What story are we telling today?"
                className="flex-1 bg-transparent border-none focus:ring-0 p-6 text-xl font-medium outline-none"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button 
                onClick={handleGenerate}
                disabled={!topic || status.step !== 'idle'}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-12 py-4 rounded-3xl text-lg font-black italic uppercase transition-all flex items-center justify-center gap-3 whitespace-nowrap"
              >
                Engineer Now
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="glass-panel p-6 rounded-3xl space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 italic">Aspect Ratio</label>
              <div className="flex gap-2">
                {[
                  { id: '1:1', icon: 'M3 3h18v18H3z' },
                  { id: '9:16', icon: 'M7 2h10v20H7z' }
                ].map(ratio => (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id as AspectRatio)}
                    className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl transition-all border ${aspectRatio === ratio.id ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'}`}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d={ratio.icon}/></svg>
                    <span className="text-xs font-bold">{ratio.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 italic">Slides ({slideCount})</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" min="1" max="10" step="1" 
                  className="flex-1 accent-indigo-500"
                  value={slideCount}
                  onChange={(e) => setSlideCount(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl space-y-3 lg:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 italic">Style Engine</label>
              <div className="flex gap-2">
                {Object.values(VisualStyle).map(v => (
                  <button
                    key={v}
                    onClick={() => setStyle(v)}
                    className={`flex-1 py-2 text-[10px] uppercase font-black tracking-widest rounded-xl border transition-all ${style === v ? 'bg-indigo-600 border-indigo-500' : 'bg-white/5 border-white/5 text-white/40'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {feed && (
          <section className="w-full max-w-7xl px-6 py-12 animate-slide-in">
            <div className="flex flex-col lg:flex-row gap-12">
              
              {/* Visual Preview */}
              <div className="lg:w-1/2 space-y-6">
                 <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setFeed(null)}
                      className="flex items-center gap-2 text-xs font-black text-indigo-400 hover:text-white transition-colors uppercase italic"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      Restart Engine
                    </button>
                    <div className="flex gap-2">
                       <span className="text-[10px] bg-white/10 px-2 py-1 rounded font-black uppercase tracking-tighter">{feed.aspectRatio}</span>
                       <span className="text-[10px] bg-indigo-500 px-2 py-1 rounded font-black uppercase tracking-tighter italic">Viral Ready</span>
                    </div>
                 </div>

                 {feed.slides.length === 1 ? (
                   <div className={`mx-auto overflow-hidden rounded-[2.5rem] glass-panel border-white/20 shadow-2xl relative group ${feed.aspectRatio === '9:16' ? 'max-w-[360px] aspect-[9/16]' : 'max-w-[500px] aspect-square'}`}>
                      {feed.slides[0].imageUrl ? (
                        <>
                          <img src={feed.slides[0].imageUrl} className="w-full h-full object-cover" alt="Momentum Result" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                             <button 
                                onClick={() => handleDownloadImage(feed.slides[0].imageUrl!, 0)}
                                className="w-full py-4 bg-white text-black font-black uppercase italic rounded-2xl flex items-center justify-center gap-2"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Save Visual
                             </button>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 italic font-black text-white/20 uppercase tracking-widest animate-pulse">
                          Generating Frame...
                        </div>
                      )}
                   </div>
                 ) : (
                   <div className="flex gap-4 overflow-x-auto pb-6 slide-container snap-x">
                      {feed.slides.map((s, idx) => (
                        <div key={s.id} className="flex-shrink-0 snap-center">
                           <SlideCard slide={s} style={feed.style} />
                           <button 
                              onClick={() => s.imageUrl && handleDownloadImage(s.imageUrl, idx)}
                              className="w-full mt-2 py-2 text-[10px] font-black uppercase italic text-gray-500 hover:text-white transition-colors"
                           >
                              Download Slide {idx + 1}
                           </button>
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              {/* Data & Script */}
              <div className="lg:w-1/2 space-y-8">
                <div className="glass-panel p-8 rounded-[3rem] border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 flex gap-2">
                    <button 
                      onClick={() => handleCopy(fullScript, 'Script')}
                      title="Copy Script"
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 italic mb-6">FB Optimized Narrative</h4>
                  <div className="max-h-[450px] overflow-y-auto pr-4 text-gray-300 leading-relaxed font-medium whitespace-pre-line text-sm slide-container italic bg-white/5 p-4 rounded-2xl border border-white/5">
                    {fullScript}
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-500">{feed.totalWords} words generated</span>
                    <span className="text-[10px] font-black uppercase text-emerald-400 italic flex items-center gap-1">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                      Facebook Ready
                    </span>
                  </div>
                </div>

                <div className="glass-panel p-8 rounded-[3rem] border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 italic">Meta Bundle (10 Tags)</h4>
                    <button 
                      onClick={() => handleCopy(hashtagText, 'Hashtags')}
                      className="text-[10px] font-black uppercase italic text-gray-400 hover:text-white underline underline-offset-4"
                    >
                      Copy All Tags
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {feed.hashtags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-white/5 rounded-xl text-xs font-bold text-gray-400 border border-white/5">
                        #{tag.replace(/^#/, '')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <button 
                      onClick={() => handleCopy(combinedBundle, 'Post Bundle')}
                      className="py-5 bg-white text-black font-black uppercase italic rounded-3xl text-sm transition-all hover:bg-gray-200 flex items-center justify-center gap-2"
                   >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      Copy All (FB Format)
                   </button>
                   <button 
                      onClick={() => { if(feed.slides[0].imageUrl) handleDownloadImage(feed.slides[0].imageUrl, 0); }}
                      className="py-5 bg-indigo-600 text-white font-black uppercase italic rounded-3xl text-sm transition-all hover:bg-indigo-500 flex items-center justify-center gap-2"
                   >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Download Asset
                   </button>
                </div>
              </div>

            </div>
          </section>
        )}
      </main>

      <footer className="py-8 px-8 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-600">
          MomentumAI • Built for High-Retention Narrative Flow • 2024
        </p>
      </footer>
    </div>
  );
};

export default App;
