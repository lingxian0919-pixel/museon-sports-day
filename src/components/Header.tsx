'use client';

import React, { useState } from 'react';
import { Sun, Moon, Trophy, Radio, Users, Share2, Check, Sparkles } from 'lucide-react';
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
  isScorerMode = false,
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
    <header className="sticky top-3 z-40 mb-6">
      <div className="glass-panel bg-[#FFE600] dark:bg-[#1e2235] px-5 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 border-[3px] border-black shadow-[6px_6px_0px_0px_#000000]">
        {/* Brand & Live status */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5C8D] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center text-black shrink-0">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00E599] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] text-[11px] font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                  <Radio className="w-3 h-3 stroke-[2.5]" /> LIVE 18개 학급 본선 리그
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-black dark:text-white mt-1 drop-shadow-[1px_1px_0px_rgba(255,255,255,0.6)] dark:drop-shadow-none">
                2026 무선중 체육대회
              </h1>
            </div>
          </div>
        </div>

        {/* Center Bento Pill: Live Leader & 18 Classes Summary */}
        <div className="hidden xl:flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] text-xs">
          <div className="flex items-center gap-1.5 font-black text-black dark:text-white">
            <Users className="w-4 h-4 text-[#FF5C8D] stroke-[2.5]" />
            <span>총 18개 학급 벤토 리그</span>
          </div>
          {topClass && (
            <>
              <span className="text-black dark:text-slate-500 font-black">|</span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-[#FFE600] text-black border-2 border-black font-black text-[11px]">
                  🥇 현재 선두
                </span>
                <span className="font-black text-black dark:text-white">
                  {topClass.grade}학년 {topClass.classNum}반
                </span>
                <span className="text-[#FF5C8D] font-black">
                  ({topClass.score}pt)
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right: Share Link, Dark Mode */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          {/* Copy URL button */}
          <button
            onClick={handleCopyLink}
            title={isScorerMode ? '기록원용 전용 링크 복사' : '학생 공유용 링크 복사'}
            className="neo-btn px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-[#38BDF8] dark:hover:bg-[#38BDF8] text-black dark:text-white hover:text-black text-xs font-black flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-black stroke-[3]" />
                <span className="font-black">링크 복사됨!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 stroke-[2.5]" />
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
            className="neo-btn p-2 rounded-xl bg-[#38BDF8] hover:bg-[#FF5C8D] text-black"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-black stroke-[2.5]" />
            ) : (
              <Moon className="w-4 h-4 text-black stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
