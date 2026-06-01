import { useEffect, useRef, useState } from 'react';

/** Hide header on scroll down, show on scroll up */
export function useScrollHeader(threshold = 8) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= threshold) {
        setVisible(true);
      } else if (y > lastY.current + 4) {
        setVisible(false);
      } else if (y < lastY.current - 4) {
        setVisible(true);
      }
      lastY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return visible;
}
