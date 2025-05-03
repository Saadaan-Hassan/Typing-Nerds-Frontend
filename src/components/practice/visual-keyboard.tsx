'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface VisualKeyboardProps {
  currentKey: string;
  typedKey: string;
  isCorrect: boolean;
}

interface KeyProps {
  char: string;
  width?: string;
  height?: string;
  finger: number;
  isCurrentKey: boolean;
  lastTypedKey: string;
  isCorrect: boolean;
}

// Define finger colors
const fingerColors = {
  0: 'bg-red-500', // Left pinky - Red
  1: 'bg-blue-500', // Left ring - Blue
  2: 'bg-green-500', // Left middle - Green
  3: 'bg-yellow-500', // Left index - Yellow
  4: 'bg-gray-300', // Left thumb - Gray
  5: 'bg-gray-300', // Right thumb - Gray
  6: 'bg-yellow-500', // Right index - Yellow
  7: 'bg-green-500', // Right middle - Green
  8: 'bg-blue-500', // Right ring - Blue
  9: 'bg-red-500', // Right pinky - Red
};

// Define keyboard layout with finger assignments
const keyboardLayout = [
  [
    { char: '`', finger: 0 },
    { char: '1', finger: 0 },
    { char: '2', finger: 1 },
    { char: '3', finger: 2 },
    { char: '4', finger: 3 },
    { char: '5', finger: 3 },
    { char: '6', finger: 6 },
    { char: '7', finger: 6 },
    { char: '8', finger: 7 },
    { char: '9', finger: 8 },
    { char: '0', finger: 9 },
    { char: '-', finger: 9 },
    { char: '=', finger: 9 },
    { char: 'Backspace', finger: 9, width: 'w-16' },
  ],
  [
    { char: 'Tab', finger: 0, width: 'w-10' },
    { char: 'q', finger: 0 },
    { char: 'w', finger: 1 },
    { char: 'e', finger: 2 },
    { char: 'r', finger: 3 },
    { char: 't', finger: 3 },
    { char: 'y', finger: 6 },
    { char: 'u', finger: 6 },
    { char: 'i', finger: 7 },
    { char: 'o', finger: 8 },
    { char: 'p', finger: 9 },
    { char: '[', finger: 9 },
    { char: ']', finger: 9 },
    { char: '\\', finger: 9 },
  ],
  [
    { char: 'Caps', finger: 0, width: 'w-12' },
    { char: 'a', finger: 0 },
    { char: 's', finger: 1 },
    { char: 'd', finger: 2 },
    { char: 'f', finger: 3 },
    { char: 'g', finger: 3 },
    { char: 'h', finger: 6 },
    { char: 'j', finger: 6 },
    { char: 'k', finger: 7 },
    { char: 'l', finger: 8 },
    { char: ';', finger: 9 },
    { char: "'", finger: 9 },
    { char: 'Enter', finger: 9, width: 'w-12' },
  ],
  [
    { char: 'Shift', finger: 0, width: 'w-16' },
    { char: 'z', finger: 0 },
    { char: 'x', finger: 1 },
    { char: 'c', finger: 2 },
    { char: 'v', finger: 3 },
    { char: 'b', finger: 3 },
    { char: 'n', finger: 6 },
    { char: 'm', finger: 6 },
    { char: ',', finger: 7 },
    { char: '.', finger: 8 },
    { char: '/', finger: 9 },
    { char: 'Shift', finger: 9, width: 'w-16' },
  ],
  [{ char: 'Space', finger: 5, width: 'w-64' }],
];

function Key({
  char,
  width = 'w-10',
  height = 'h-10',
  finger,
  isCurrentKey,
  lastTypedKey,
  isCorrect,
}: KeyProps) {
  const isLastTyped = char.toLowerCase() === lastTypedKey.toLowerCase();
  const fingerColor =
    fingerColors[finger as keyof typeof fingerColors] || 'bg-gray-300';

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-md border-2 text-sm font-medium transition-colors',
        width,
        height,
        isCurrentKey
          ? 'border-white shadow-lg ring-2 ring-white'
          : isLastTyped
            ? isCorrect
              ? 'border-green-600 bg-green-500 text-white'
              : 'border-red-600 bg-red-500 text-white'
            : fingerColor,
        fingerColor,
        'text-white'
      )}
    >
      {char}
    </div>
  );
}

function Finger({ finger, isActive }: { finger: number; isActive: boolean }) {
  const fingerColor =
    fingerColors[finger as keyof typeof fingerColors] || 'bg-gray-300';

  return (
    <div
      className={cn(
        'h-14 w-5 rounded-full transition-all',
        fingerColor,
        isActive ? 'scale-125 shadow-lg ring-2 ring-white' : 'opacity-80'
      )}
    />
  );
}

export function VisualKeyboard({
  currentKey,
  typedKey,
  isCorrect,
}: VisualKeyboardProps) {
  const [activeFingerIndex, setActiveFingerIndex] = useState<number | null>(
    null
  );

  // Determine which finger should be active based on the current key
  useEffect(() => {
    if (!currentKey) {
      setActiveFingerIndex(null);
      return;
    }

    // Find the finger for the current key
    for (const row of keyboardLayout) {
      for (const key of row) {
        if (key.char.toLowerCase() === currentKey.toLowerCase()) {
          setActiveFingerIndex(key.finger);
          return;
        }
      }
    }

    // Default to index finger if key not found
    setActiveFingerIndex(3);
  }, [currentKey]);

  return (
    <div className="flex flex-col gap-4">
      {/* Finger guide above keyboard */}
      <div className="flex items-end justify-center space-x-4">
        <div className="flex space-x-1">
          <Finger finger={0} isActive={activeFingerIndex === 0} />
          <Finger finger={1} isActive={activeFingerIndex === 1} />
          <Finger finger={2} isActive={activeFingerIndex === 2} />
          <Finger finger={3} isActive={activeFingerIndex === 3} />
          <Finger finger={4} isActive={activeFingerIndex === 4} />
        </div>
        <div className="flex space-x-1">
          <Finger finger={5} isActive={activeFingerIndex === 5} />
          <Finger finger={6} isActive={activeFingerIndex === 6} />
          <Finger finger={7} isActive={activeFingerIndex === 7} />
          <Finger finger={8} isActive={activeFingerIndex === 8} />
          <Finger finger={9} isActive={activeFingerIndex === 9} />
        </div>
      </div>
      {/* Color legend */}
      <div className="flex justify-center">
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div className="flex flex-col items-center">
            <div className="mb-1 h-3 w-3 rounded-full bg-red-500"></div>
            <span>Pinky</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-1 h-3 w-3 rounded-full bg-blue-500"></div>
            <span>Ring</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-1 h-3 w-3 rounded-full bg-green-500"></div>
            <span>Middle</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-1 h-3 w-3 rounded-full bg-yellow-500"></div>
            <span>Index</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-1 h-3 w-3 rounded-full bg-gray-300"></div>
            <span>Thumb</span>
          </div>
        </div>
      </div>

      {/* Keyboard layout */}
      <div className="flex flex-col items-center space-y-1">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex space-x-1">
            {row.map((key, keyIndex) => (
              <Key
                key={`${rowIndex}-${keyIndex}`}
                char={key.char}
                width={key.width}
                height={key.height}
                finger={key.finger}
                isCurrentKey={
                  key.char.toLowerCase() === currentKey.toLowerCase()
                }
                lastTypedKey={typedKey}
                isCorrect={isCorrect}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
