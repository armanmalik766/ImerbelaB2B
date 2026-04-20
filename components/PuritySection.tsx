import React from 'react';

const PuritySection: React.FC = () => {
  return (
    <section className="bg-gray-50/50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#111111] leading-tight">
            From cleanse to care—
            <br />
            purity that performs.
          </h2>
          <div className="space-y-4 pt-4">
            <InfoPill icon="/neem-icon.png" text="Neem-powered cleansing" />
            <InfoPill icon="/root-icon.png" text="Strengthens from root" />
            <InfoPill icon="/hair-icon.png" text="For healthy, resilient hair" />
          </div>
          <p className="text-gray-500 font-light leading-relaxed text-sm md:text-base pt-4">
            Crafted with neem seed kernel extract, this formula purifies the scalp while strengthening roots for hair that's not just clean, but truly resilient.
          </p>
        </div>

        {/* Image */}
        <div className="animate-in fade-in slide-in-from-right-8 duration-700">
          <img 
            src="/shapooBanner1.jpg" 
            alt="Imerbela Neem Seed Kernel Shampoo" 
            className="rounded-lg shadow-lg w-full h-auto object-cover" 
          />
        </div>
      </div>
    </section>
  );
};

const InfoPill: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
      <img src={icon} alt="" className="w-6 h-6" />
    </div>
    <span className="text-base font-medium text-gray-800">{text}</span>
  </div>
);

export default PuritySection;
