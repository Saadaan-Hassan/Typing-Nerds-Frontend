'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

interface TypingAreaProps {
  text: string;
  typedText: string;
  onTextChange: (text: string) => void;
  isActive: boolean;
}

export function TypingArea({
  text,
  typedText,
  onTextChange,
  isActive,
}: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollLeft = el.scrollWidth - el.clientWidth;
  }, [typedText]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        return;
      }
      if (!isActive) {
        onTextChange(e.key);
        return;
      }
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === 'Backspace') {
        onTextChange(typedText.slice(0, -1));
        return;
      }
      if (e.key.length > 1) return;
      onTextChange(typedText + e.key);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [typedText, onTextChange, isActive]);

  const display = text.slice(0, 400);
  const pos = typedText.length;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="h-full overflow-x-hidden font-mono text-lg whitespace-pre focus:outline-none"
    >
      <div className="relative inline-block">
        {display.split('').map((c, i) => (
          <span
            key={i}
            className={cn(
              'relative inline-block align-top whitespace-pre',
              i < pos
                ? c.toLowerCase() === typedText[i]?.toLowerCase()
                  ? 'text-green-500'
                  : 'bg-red-100 text-red-500'
                : 'text-gray-500'
            )}
          >
            {i === pos && (
              <span className="bg-primary animate-blink absolute top-0 left-0 -ml-[1px] h-full w-[2px]" />
            )}
            {c === ' ' ? '\u00A0' : c}
          </span>
        ))}
        {pos === display.length && (
          <span className="bg-primary animate-blink inline-block h-full w-[2px] align-top" />
        )}
      </div>
    </div>
  );
}
