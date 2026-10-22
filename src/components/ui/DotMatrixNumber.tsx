import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface DotMatrixNumberProps {
  value: string; // e.g. "06", "24", "18", "99.4"
  suffix?: string; // e.g. " | 04", "+", "%"
  duration?: number;
  className?: string;
}

export function DotMatrixNumber({
  value,
  suffix = '',
  duration = 1.6,
  className = '',
}: DotMatrixNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Parse numeric portion
    const target = parseFloat(value);
    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }

    const isDecimal = value.includes('.');
    const decimalPlaces = isDecimal ? value.split('.')[1].length : 0;
    const padZeros = value.startsWith('0') && !isDecimal ? value.length : 0;

    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Apple ease-out cubic curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      let formatted = isDecimal ? current.toFixed(decimalPlaces) : Math.floor(current).toString();
      if (padZeros > 0 && formatted.length < padZeros) {
        formatted = formatted.padStart(padZeros, '0');
      }

      setDisplayValue(formatted);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={`font-doto font-bold tracking-tight select-none ${className}`}>
      {displayValue}
      {suffix && <span className="font-sans font-light opacity-60 ml-0.5">{suffix}</span>}
    </span>
  );
}
