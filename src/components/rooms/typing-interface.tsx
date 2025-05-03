'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

interface TypingInterfaceProps {
  text: string;
  typedText: string;
  onTextChange: (text: string) => void;
  isActive: boolean;
  disabled?: boolean;
}

export function TypingInterface({
  text,
  typedText,
  onTextChange,
  isActive,
  disabled = false,
}: TypingInterfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && !disabled && containerRef.current) {
      containerRef.current.focus();
    }
  }, [isActive, disabled]);

  useEffect(() => {
    if (!isActive || disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        onTextChange(typedText.slice(0, -1));
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        onTextChange(typedText + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typedText, onTextChange, isActive, disabled]);

  // Calculate which characters are correct/incorrect
  const renderText = () => {
    return text.split('').map((char, index) => {
      const isTyped = index < typedText.length;
      const isCorrect = isTyped && char === typedText[index];
      const isCurrentPosition = index === typedText.length;

      return (
        <span
          key={index}
          className={cn(
            'relative',
            isTyped
              ? isCorrect
                ? 'text-green-500'
                : 'bg-red-100 text-red-500'
              : 'text-gray-400'
          )}
        >
          {isCurrentPosition && (
            <span className="bg-primary animate-blink absolute top-0 left-0 h-full w-0.5" />
          )}
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'focus:ring-primary/20 rounded-md p-4 font-mono text-lg whitespace-pre-wrap focus:ring-2 focus:outline-none',
        disabled ? 'bg-muted cursor-not-allowed opacity-70' : 'cursor-text'
      )}
      tabIndex={disabled ? -1 : 0}
    >
      {renderText()}
      {typedText.length === text.length && (
        <span className="bg-primary animate-blink ml-0.5 inline-block h-full w-0.5" />
      )}
    </div>
  );
}
