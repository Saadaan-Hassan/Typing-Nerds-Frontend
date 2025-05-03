'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getRandomText } from '@/lib/text-utils';
import { LiveStats } from '@/components/practice/live-stats';
import { RoundOptions } from '@/components/practice/round-options';
import { TypingArea } from '@/components/practice/typing-area';
import { VisualKeyboard } from '@/components/practice/visual-keyboard';

interface TypingPlaygroundProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFinish: (results: any) => void;
}

export function TypingPlayground({ onFinish }: TypingPlaygroundProps) {
  const [text, setText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [roundDuration, setRoundDuration] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errorCount, setErrorCount] = useState(0);
  const [currentKey, setCurrentKey] = useState('');
  const [wpmOverTime, setWpmOverTime] = useState<
    { time: number; wpm: number }[]
  >([]);
  const [difficulty, setDifficulty] = useState<
    'beginner' | 'intermediate' | 'advanced'
  >('beginner');
  const [lastTypedCorrect, setLastTypedCorrect] = useState(true);
  const [textCategory, setTextCategory] = useState<'word' | 'code'>('word');

  const startTimeRef = useRef<number | null>(null);
  const typingAreaRef = useRef<HTMLDivElement>(null);
  const hasFinishedRef = useRef(false);

  // Load text only when not active or on mount
  useEffect(() => {
    if (!isActive) setText(getRandomText(difficulty));
  }, [difficulty, isActive]);

  // Countdown
  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive]);

  // Define handleFinish as useCallback to avoid recreating it on each render
  const handleFinish = useCallback(() => {
    setIsActive(false);
    let correct = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === text[i]) correct++;
    }
    const finalAcc = typedText.length
      ? Math.round((correct / typedText.length) * 100)
      : 100;
    const elapsed = roundDuration - timeLeft;
    const finalWpm = elapsed
      ? Math.round(typedText.length / 5 / (elapsed / 60))
      : 0;

    onFinish({
      wpm: finalWpm,
      accuracy: finalAcc,
      totalLetters: typedText.length,
      correctLetters: correct,
      incorrectLetters: typedText.length - correct,
      timeElapsed: elapsed,
      content: text,
      category: textCategory,
      wpmOverTime,
    });
  }, [
    typedText,
    text,
    roundDuration,
    timeLeft,
    textCategory,
    wpmOverTime,
    onFinish,
  ]);

  // Auto finish
  useEffect(() => {
    if (isActive && timeLeft === 0 && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      handleFinish();
    }
  }, [timeLeft, isActive, handleFinish]);

  // Stats update
  useEffect(() => {
    if (!isActive || typedText.length === 0) return;
    const minutes =
      (Date.now() - (startTimeRef.current ?? Date.now())) / 1000 / 60;
    const words = typedText.length / 5;
    const current = minutes > 0 ? Math.round(words / minutes) : 0;
    setWpm(current);

    let correct = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (i < text.length && typedText[i] === text[i]) correct++;
    }
    const acc = Math.round((correct / typedText.length) * 100);
    setAccuracy(acc);
    setErrorCount(typedText.length - correct);

    // Adaptive difficulty (won't reset text mid-test now)
    if (current > 60 && acc > 95) setDifficulty('advanced');
    else if (current > 40 && acc > 90) setDifficulty('intermediate');
    else setDifficulty('beginner');

    setCurrentKey(text[typedText.length] || '');
    setLastTypedCorrect(
      typedText[typedText.length - 1] === text[typedText.length - 1]
    );
  }, [typedText, text, isActive]);

  const handleTextChange = (newText: string) => {
    // start on first char
    if (!isActive && newText.length > 0 && !hasFinishedRef.current) {
      setIsActive(true);
      startTimeRef.current = Date.now();
      typingAreaRef.current?.focus();
      setWpmOverTime([]);
      hasFinishedRef.current = false;
      setTypedText(newText.charAt(0));
      return;
    }
    if (!isActive) return;

    setTypedText(newText);

    // append only when exactly done
    if (newText.length === text.length) {
      setText((prev) => prev + ' ' + getRandomText(difficulty));
    }

    // record WPM graph
    const elapsed = roundDuration - timeLeft;
    const cw =
      elapsed > 0 ? Math.round(newText.length / 5 / (elapsed / 60)) : 0;
    setWpmOverTime((prev) => [...prev, { time: elapsed, wpm: cw }]);
  };

  const handleDurationChange = (dur: number) => {
    setRoundDuration(dur);
    setTimeLeft(dur);
    setTypedText('');
    setIsActive(false);
    hasFinishedRef.current = false;
    startTimeRef.current = null;
    setWpmOverTime([]);
  };

  const handleCategoryChange = (category: 'word' | 'code') => {
    setTextCategory(category);
    // This would ideally fetch a different type of text content based on category
    // For now, we'll just use the existing text generation
  };

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex h-[15%] gap-4">
        <div className="basis-1/2">
          <RoundOptions
            duration={roundDuration}
            onDurationChange={handleDurationChange}
            category={textCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <div className="basis-1/2">
          <LiveStats
            wpm={wpm}
            accuracy={accuracy}
            errors={errorCount}
            timeLeft={timeLeft}
          />
        </div>
      </div>
      <div className="flex-shrink-0">
        <div
          ref={typingAreaRef}
          className="border-border h-full rounded-md border bg-white p-4 focus:outline-none"
          tabIndex={0}
        >
          <TypingArea
            text={text}
            typedText={typedText}
            onTextChange={handleTextChange}
            isActive={isActive}
          />
        </div>
      </div>
      <div className="flex-grow">
        <div className="border-border rounded-md border bg-white p-4">
          <VisualKeyboard
            currentKey={currentKey}
            typedKey={typedText.slice(-1)}
            isCorrect={lastTypedCorrect}
          />
        </div>
      </div>
    </div>
  );
}
