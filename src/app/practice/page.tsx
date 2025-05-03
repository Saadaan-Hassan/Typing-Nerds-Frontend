'use client';

import { useState } from 'react';

import { EndScreen } from '@/components/practice/end-screen';
import { TypingPlayground } from '@/components/practice/typing-playground';

export default function PracticePage() {
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState({
    wpm: 0,
    accuracy: 0,
    totalLetters: 0,
    correctLetters: 0,
    incorrectLetters: 0,
    timeElapsed: 0,
    wpmOverTime: [] as { time: number; wpm: number }[],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFinish = (results: any) => {
    setResults(results);
    setIsFinished(true);
  };

  const handleRestart = () => {
    setIsFinished(false);
  };

  return (
    <div className="flex flex-col">
      {!isFinished ? (
        <TypingPlayground onFinish={handleFinish} />
      ) : (
        <EndScreen results={results} onRestart={handleRestart} />
      )}
    </div>
  );
}
