
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ScalpInsightsSectionProps {
  onCtaClick?: () => void;
}

const ScalpInsightsSection: React.FC<ScalpInsightsSectionProps> = ({ onCtaClick }) => {
  return (
    <section className="py-24 md:py-32 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Side: Visual Focus with Callouts */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] bg-gray-50 rounded-sm overflow-hidden">
              <img 
                src="im5.png" 
                alt="Scalp Insight Analysis" 
                className="w-full h-full object-cover grayscale-[30%]"
              />
              
              {/* Callouts - Using thin lines and minimal text */}
              <div className="absolute top-[25%] left-[45%] flex items-center group">
                <div className="w-12 h-[1px] bg-white/60"></div>
                <div className="ml-2 px-2 py-1 bg-white/10 backdrop-blur-md rounded-sm border border-white/20">
                  <span className="text-[9px] uppercase tracking-widest text-white font-medium">Dandruff</span>
                </div>
              </div>

              <div className="absolute top-[40%] right-[30%] flex items-center flex-row-reverse group">
                <div className="w-16 h-[1px] bg-white/60"></div>
                <div className="mr-2 px-2 py-1 bg-white/10 backdrop-blur-md rounded-sm border border-white/20">
                  <span className="text-[9px] uppercase tracking-widest text-white font-medium">Itchy Scalp</span>
                </div>
              </div>

              <div className="absolute bottom-[35%] left-[35%] flex items-center group">
                <div className="w-20 h-[1px] bg-white/60"></div>
                <div className="ml-2 px-2 py-1 bg-white/10 backdrop-blur-md rounded-sm border border-white/20">
                  <span className="text-[9px] uppercase tracking-widest text-white font-medium">Dryness</span>
                </div>
              </div>

              <div className="absolute top-[15%] left-[20%] flex items-center group">
                <div className="w-8 h-[1px] bg-white/60"></div>
                <div className="ml-2 px-2 py-1 bg-white/10 backdrop-blur-md rounded-sm border border-white/20">
                  <span className="text-[9px] uppercase tracking-widest text-white font-medium">Build-up</span>
                </div>
              </div>
            </div>

            {/* Subtle floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-xl border border-gray-100 hidden md:block max-w-[180px]">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Analysis</p>
              <p className="text-xs text-gray-600 font-light leading-relaxed">Identifying root causes is the first step to follicular recovery.</p>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="space-y-10 order-1 lg:order-2">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-[#6B8E23] font-bold">Hair & Scalp Insights</span>
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#111111] leading-[1.1]">
                Scalp health affects hair health.
              </h2>
              <p className="text-gray-500 text-base md:text-lg font-light leading-relaxed">
                Understand your scalp concerns. Choose care that works at the source.
              </p>
            </div>

            <div className="space-y-6 max-w-lg">
              <p className="text-gray-600 font-light text-sm md:text-base leading-relaxed">
                Many hair concerns begin at the scalp. Identifying issues like dandruff, dryness, and irritation helps choose the right care routine. IMERBELA formulations are designed to support scalp balance using Neem Seed Kernel Extract and clean, thoughtful ingredients.
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={onCtaClick}
                  className="group flex items-center space-x-4 bg-[#111111] text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all rounded-sm"
                >
                  <span>Explore Neem Seed Kernel Care</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ScalpInsightsSection;
