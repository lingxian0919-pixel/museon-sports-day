'use client';

import React, { useState } from 'react';
import { Sun, Moon, Flame, Trophy, Radio, Users, Share2, Check } from 'lucide-react';
import { ClassRanking } from '../lib/types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  topClass?: ClassRanking;
  isScorerMode?: boolean;
}

export default function Header({
  darkMode,
  setDarkMode,
  topClass,
  isScorerMode = false
}: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = isScorerMode
        ? `${window.location.origin}/scorer`
        : window.location.origin;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-4 z-40 mb-6">
      <div className="glass-panel px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Brand & Live status */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Trophy className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Radio className="w-3 h-3" /> LIVE 18개 학급 본선 리그
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent">
              2026 무선중 체육대회
            </h1>
          </div>
        </div>

        {/* Center: Live Leader & 18 Classes Summary */}
        <div className="hidden xl:flex items-center gap-3 bg-slate-200/50 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-300/40 dark:border-slate-700/50 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>총 18개 학급 리그</span>
          </div>
          {topClass && (
            <>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 font-black">🥇 선두</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {topClass.grade}학년 {topClass.classNum}반
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                  ({topClass.score}pt)
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right: Share Link, Dark Mode */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">

          {/* Copy URL button */}
          <button
            onClick={handleCopyLink}
            title={isScorerMode ? '기록원용 전용 링크 복사' : '학생 공유용 링크 복사'}
            className="px-3 py-1.5 rounded-xl glass-card hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-bold">복사됨!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">
                  {isScorerMode ? '기록원 링크 복사' : '학생용 링크 복사'}
                </span>
                <span className="sm:hidden">공유</span>
              </>
            )}
          </button>

          {/* Dark Mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="테마 전환"
            className="p-2 rounded-xl glass-card hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 transition-transform active:scale-95 shadow-sm"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
