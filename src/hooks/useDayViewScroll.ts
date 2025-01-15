import { useEffect, RefObject } from 'react';

export const useDayViewScroll = (
  scrollContainerRef: RefObject<HTMLDivElement>,
  hourHeight: number
) => {
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isScrolling: NodeJS.Timeout;
    let lastScrollTop = container.scrollTop;

    const handleScroll = () => {
      // Clear the existing timeout
      clearTimeout(isScrolling);

      // Set a new timeout
      isScrolling = setTimeout(() => {
        const currentScrollTop = container.scrollTop;
        const halfHourHeight = hourHeight / 2;
        
        // Calculate the nearest 30-minute slot
        const nearestSlot = Math.round(currentScrollTop / halfHourHeight) * halfHourHeight;
        
        // Only snap if the scroll has ended and we're not already at a slot
        if (currentScrollTop !== lastScrollTop && currentScrollTop !== nearestSlot) {
          container.scrollTo({
            top: nearestSlot,
            behavior: 'smooth'
          });
        }
        
        lastScrollTop = nearestSlot;
      }, 150);
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(isScrolling);
    };
  }, [hourHeight, scrollContainerRef]);
};