
import React from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
import beforeImg from '../public/before1.png';
import afterImg from '../public/after1.jpeg';

interface VisibleResultsSectionProps {
  onCtaClick?: () => void;
}

const VisibleResultsSection: React.FC<VisibleResultsSectionProps> = ({ onCtaClick }) => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left Side: The Visual Slider */}
          <div className="w-full max-w-md mx-auto">
            <BeforeAfterSlider
              beforeImage={beforeImg}
              afterImage={afterImg}
            />
          </div>

          {/* Right Side: Content */}
          <div className="space-y-8 text-center md:text-left">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#6B8E23] font-bold">Scientific Transformation</span>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900">
                Visible Scalp Recovery
              </h2>
              <p className="text-gray-500 text-sm md:text-base font-light italic">
                A cleaner scalp environment through advanced botanical science.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-base font-medium text-gray-900">Targets flaking and irritation at the source</h3>
                <p className="text-gray-600 font-light leading-relaxed text-sm">
                  Our Neem Seed Kernel formulations are clinically designed to rebalance the scalp microbiome. By incorporating active Ginseng and Pro-Vitamin B5, we support the natural barrier function.
                </p>
              </div>

              <ul className="space-y-3 text-sm font-light text-gray-600">
                <li className="flex items-center space-x-3 justify-center md:justify-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6B8E23]"></div>
                  <span>Reduces visible dandruff in 4 weeks</span>
                </li>
                <li className="flex items-center space-x-3 justify-center md:justify-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6B8E23]"></div>
                  <span>Soothes chronic scalp itchiness</span>
                </li>
                <li className="flex items-center space-x-3 justify-center md:justify-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6B8E23]"></div>
                  <span>pH-balanced to maintain hair integrity</span>
                </li>
              </ul>

              <p className="text-[10px] text-gray-400 italic">
                *Clinical observations based on a 12-week user trial of the full Neem Seed Kernel Regimen.
              </p>

              <div className="pt-4">
                <button
                  onClick={onCtaClick}
                  className="bg-black text-white px-8 py-4 text-[12px] font-medium tracking-widest hover:bg-gray-800 transition-all uppercase rounded-sm"
                >
                  Shop the Shampoo
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VisibleResultsSection;

//push code .....//