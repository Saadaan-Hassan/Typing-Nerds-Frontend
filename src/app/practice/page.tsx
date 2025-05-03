// app/practice/page.tsx
'use client';

import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Sample word list
const WORDS = [
  'apple',
  'banana',
  'orange',
  'grape',
  'melon',
  'peach',
  'cherry',
  'pear',
  'plum',
  'kiwi',
  'mango',
  'lime',
  'lemon',
  'apricot',
  'date',
  'fig',
  'guava',
  'papaya',
  'berry',
  'coconut',
];

const KEY_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

// type Difficulty = 'beginner' | 'intermediate' | 'advanced';

type Stat = {
  timeLeft: number;
  wpm: number;
  accuracy: number;
  errors: number;
  history: { second: number; wpm: number }[];
};

export default function PracticeModule() {
  const [roundLength, setRoundLength] = useState(30);
  // const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [lines, setLines] = useState<string[]>(generateLines(3));
  const [currentChar, setCurrentChar] = useState(0);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [stat, setStat] = useState<Stat>({
    timeLeft: roundLength,
    wpm: 0,
    accuracy: 100,
    errors: 0,
    history: [],
  });
  const [ended, setEnded] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!ended) {
      timer = setInterval(() => {
        setStat((prev) => {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const timeLeft = Math.max(roundLength - Math.floor(elapsed), 0);
          if (timeLeft <= 0) {
            clearInterval(timer);
            setEnded(true);
          }
          const correctChars = currentChar - prev.errors;
          const wpm = Math.round(correctChars / 5 / (elapsed / 60));
          const accuracy =
            Math.round((correctChars / currentChar) * 100) || 100;
          const history = [
            ...prev.history,
            { second: roundLength - timeLeft, wpm },
          ];
          return { timeLeft, wpm, accuracy, errors: prev.errors, history };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [ended, roundLength, currentChar]);

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (ended) return;
    const key = e.key.toLowerCase();
    setPressedKey(key);
    const allText = lines.join(' ');
    const targetChar = allText[currentChar];
    const correct = key === targetChar;
    setIsCorrect(correct);
    setCurrentChar((prev) => prev + 1);
    setStat((prev) => ({ ...prev, errors: prev.errors + (correct ? 0 : 1) }));
    // highlightNextFinger(key);
  };

  const restart = () => {
    setLines(generateLines(3));
    setCurrentChar(0);
    setEnded(false);
    startTimeRef.current = Date.now();
    setStat({
      timeLeft: roundLength,
      wpm: 0,
      accuracy: 100,
      errors: 0,
      history: [],
    });
  };

  const share = () => {
    navigator.share?.({
      title: 'My Typing Score',
      text: `I typed ${stat.wpm} WPM with ${stat.accuracy}% accuracy!`,
    });
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyPress}
      className="flex flex-col items-center space-y-6 p-4 focus:outline-none"
    >
      <RoundOptions value={roundLength} onChange={setRoundLength} />
      <TypingArea lines={lines} currentChar={currentChar} />
      <div className="flex space-x-4">
        <Keyboard pressedKey={pressedKey} isCorrect={isCorrect} />
        <Fingers highlightIndex={currentChar} />
      </div>
      <LiveStats {...stat} />
      {ended && <EndScreen stat={stat} onRestart={restart} onShare={share} />}
    </div>
  );
}

// Generate lines of random words
function generateLines(count: number) {
  const lines: string[] = [];
  for (let i = 0; i < count; i++) {
    lines.push(
      Array(10)
        .fill(0)
        .map(() => WORDS[Math.floor(Math.random() * WORDS.length)])
        .join(' ')
    );
  }
  return lines;
}

// Round length selector
function RoundOptions({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <RadioGroup
      value={String(value)}
      onValueChange={(v) => onChange(Number(v))}
      className="flex space-x-4"
    >
      {[15, 30, 60, 120].map((sec) => (
        <RadioGroupItem key={sec} value={String(sec)}>
          {sec}s
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}

// Typing area with blinking cursor
function TypingArea({
  lines,
  currentChar,
}: {
  lines: string[];
  currentChar: number;
}) {
  const allText = lines.join(' ');
  return (
    <div className="w-full max-w-2xl rounded-lg bg-gray-50 p-4 font-mono text-lg leading-snug">
      {allText.split('').map((ch, idx) => {
        const colorClass =
          idx < currentChar
            ? idx <
              currentChar - (currentChar - (currentChar - (currentChar - idx)))
              ? 'text-green-600'
              : 'text-red-600'
            : 'text-gray-400';
        return (
          <span key={idx} className={clsx(colorClass)}>
            {ch === ' ' ? ' ' : ch}
          </span>
        );
      })}
      <span className="inline-block h-6 w-1 animate-pulse bg-black align-bottom" />
    </div>
  );
}

// Visual keyboard
function Keyboard({
  pressedKey,
  isCorrect,
}: {
  pressedKey: string | null;
  isCorrect: boolean;
}) {
  return (
    <div className="space-y-1">
      {KEY_ROWS.map((row, i) => (
        <div key={i} className="flex space-x-1">
          {row.map((key) => {
            const isActive = key === pressedKey;
            const base = 'w-8 h-8 flex items-center justify-center rounded-lg';
            const activeClass = isActive
              ? isCorrect
                ? 'bg-green-300'
                : 'bg-red-300'
              : 'bg-gray-200';
            return (
              <div key={key} className={clsx(base, activeClass)}>
                {key.toUpperCase()}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Fingers visualization (simple circles)
function Fingers({ highlightIndex }: { highlightIndex: number }) {
  return (
    <div className="flex w-40 flex-wrap">
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={clsx(
              'm-1 h-4 w-4 rounded-full',
              i === highlightIndex % 10 ? 'ring-2 ring-blue-500' : 'bg-blue-200'
            )}
          />
        ))}
    </div>
  );
}

// Live stats display
function LiveStats({ timeLeft, wpm, accuracy, errors }: Stat) {
  return (
    <div className="flex space-x-6 text-center">
      <div>Time: {timeLeft}s</div>
      <div>WPM: {wpm}</div>
      <div>Acc: {accuracy}%</div>
      <div>Err: {errors}</div>
    </div>
  );
}

// End screen overlay
function EndScreen({
  stat,
  onRestart,
  onShare,
}: {
  stat: Stat;
  onRestart: () => void;
  onShare: () => void;
}) {
  return (
    <div className="bg-opacity-50 fixed inset-0 flex flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6">
        <h2 className="text-2xl font-bold">Results</h2>
        <div>WPM: {stat.wpm}</div>
        <div>Accuracy: {stat.accuracy}%</div>
        <div>Errors: {stat.errors}</div>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stat.history}>
              <XAxis dataKey="second" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={onRestart}>Restart</Button>
          <Button onClick={onShare}>Share</Button>
        </div>
      </div>
    </div>
  );
}
