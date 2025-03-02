// app/(app)/dashboard/components/graph/hooks/useDimensions.ts
import { useState, useCallback, useEffect } from 'react';
import _ from 'lodash';

interface Dimensions {
  width: number;
  height: number;
}

/**
 * Hook to measure and track dimensions of a DOM element
 * with efficient updates using throttling
 */
export function useDimensions(ref: React.RefObject<HTMLElement>): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  const updateDimensions = useCallback(
    _.throttle(() => {
      if (ref.current) {
        setDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    }, 100),
    [ref]
  );

  useEffect(() => {
    if (!ref.current) return;
    
    updateDimensions();
    
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(ref.current);
    
    window.addEventListener("resize", updateDimensions);
    
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [ref, updateDimensions]);

  return dimensions;
}