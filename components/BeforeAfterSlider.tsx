
import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
      const { left, width } = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - left, width));
      setPosition((x / width) * 100);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div 
      ref={containerRef}
      className="relative aspect-[4/5] w-full overflow-hidden select-none cursor-ew-resize bg-gray-100 rounded-sm"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* After Image (Background) */}
      <img 
        src={afterImage} 
        alt="After treatment" 
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before Image (Overlay) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${position}%`, borderRight: '1px solid white' }}
      >
        <img 
          src={beforeImage} 
          alt="Before treatment" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${(100 / position) * 100}%`, maxWidth: 'none' }}
          draggable={false}
        />
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-black/40 backdrop-blur-md text-white text-[9px] uppercase tracking-widest px-2 py-1 font-medium">Before</span>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <span className="bg-black/40 backdrop-blur-md text-white text-[9px] uppercase tracking-widest px-2 py-1 font-medium">After</span>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 z-20 w-[2px] bg-white pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-lg">
          <div className="flex space-x-1">
            <div className="w-[1px] h-3 bg-gray-400"></div>
            <div className="w-[1px] h-3 bg-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
