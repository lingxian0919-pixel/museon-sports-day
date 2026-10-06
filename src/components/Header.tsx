'use client';

import React from 'react';
import { Sun, Moon, Flame, Trophy, Radio } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  totalBlue: number;
  totalWhite: number;
}

export default function Header({ darkMode, setDarkMode, totalBlue, totalWhite }: HeaderProps) {
  return (
    <header className="sticky top-4 z-40 mb-6">
      <div className="glass-panel px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                <Radio className="w-3 h-3" /> LIVE 경기 진행중
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent">
              2026 무선중 체육대회
            </h1>
          </div>
        </div>

        {/* Center: Live Match Summary Pill */}
        <div className="hidden md:flex items-center gap-4 bg-slate-200/50 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-300/40 dark:border-slate-700/50 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-300 dark:ring-blue-700"></span>
            <span className="font-bold text-blue-600 dark:text-blue-400">청군 {totalBlue}점</span>
          </div>
          <span className="text-slate-400 font-bold">VS</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-rose-600 dark:text-rose-400">백군 {totalWhite}점</span>
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-300 dark:ring-rose-700"></span>
          </div>
        </div>

        {/* Right: Quick actions & Dark mode toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/20">
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>열정 한마당</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="테마 전환"
            className="p-2.5 rounded-xl glass-card hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 transition-transform active:scale-95 shadow-sm"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600 hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
