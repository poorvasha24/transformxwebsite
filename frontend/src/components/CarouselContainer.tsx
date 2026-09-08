import React, { useRef, useEffect, useState } from 'react';

interface CarouselContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const CarouselContainer: React.FC<CarouselContainerProps> = ({ children, title, subtitle }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<number>(0);
  const requestRef = useRef<number>(0);

  // Arrow key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHovering || !scrollRef.current) return;
      if (e.key === 'ArrowRight') {
        scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovering]);

  // Slow move on hover via pointer movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    const { left, width } = scrollRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    
    // If hovering on right 20%
    if (x > width * 0.8) {
      setScrollDirection(1);
    } 
    // If hovering on left 20%
    else if (x < width * 0.2) {
      setScrollDirection(-1);
    } 
    else {
      setScrollDirection(0);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setScrollDirection(0);
  };

  useEffect(() => {
    const animateScroll = () => {
      if (scrollRef.current && scrollDirection !== 0) {
        scrollRef.current.scrollLeft += scrollDirection * 2; // slow scroll speed
      }
      requestRef.current = requestAnimationFrame(animateScroll);
    };
    requestRef.current = requestAnimationFrame(animateScroll);
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [scrollDirection]);

  return (
    <div className="relative w-full overflow-hidden my-12" onMouseEnter={() => setIsHovering(true)} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
      {(title || subtitle) && (
        <div className="flex flex-col items-center text-center mb-8">
          {subtitle && (
            <div className="text-[10px] font-mono tracking-[0.4em] text-[#cc0000] mb-3 flex items-center justify-center gap-3 uppercase">
              <span className="w-8 h-[1px] bg-[#cc0000]/40" />
              <span>{subtitle}</span>
              <span className="w-8 h-[1px] bg-[#cc0000]/40" />
            </div>
          )}
          {title && (
            <h2 className="font-orbitron font-black text-2xl sm:text-4xl tracking-wide text-white uppercase" dangerouslySetInnerHTML={{__html: title}}></h2>
          )}
        </div>
      )}
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar px-4 sm:px-12"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};
