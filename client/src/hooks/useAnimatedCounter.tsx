import { useState, useEffect } from "react";

export function useAnimatedCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
      const easedProgress = easeOutQuart(progress);
      
      const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    // Start animation after a short delay
    const timeout = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [target, duration]);

  return count;
}
