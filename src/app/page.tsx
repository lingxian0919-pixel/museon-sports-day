'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ScoreHero from '../components/ScoreHero';
import MatchesBento from '../components/MatchesBento';
import ClassSportScoreMatrix from '../components/ClassSportScoreMatrix';
import TournamentBracketModal from '../components/TournamentBracketModal';
import ScoreRulesModal from '../components/ScoreRulesModal';
import { useSportsData } from '../lib/useSportsData';
import { Swords, Eye, Award } from 'lucide-react';

export default function StudentViewerPage() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isBracketOpen, setIsBracketOpen] = useState<boolean>(false);
  const [isScoreRulesOpen, setIsScoreRulesOpen] = useState<boolean>(false);
  const { matches, classRankings, sportRankings } = useSportsData();

  // Initialize theme (Neo-Brutalism light pop mode by default)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <main className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 relative">
      {/* Top Bento Banner: Mode Indicator & Announcements */}
      <div className="mb-4 glass-card bg-[#00E599] dark:bg-slate-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-black dark:text-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000000]">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-2.5 py-1 rounded-lg bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black text-xs flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 stroke-[2.5]" /> 학생 참관 화면
          </span>
          <span className="font-black text-black dark:text-white">
            실시간 득점 및 18개 반 순위가 자동 반영됩니다. (조회 전용 • 네오 브루탈리즘 벤토 그리드)
          </span>
        </div>
        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setIsScoreRulesOpen(true)}
            className="neo-btn px-3 py-1 rounded-lg bg-[#FF5C8D] hover:bg-[#FFE600] text-black font-black flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>종목별 배점표</span>
          </button>
          <button
            onClick={() => setIsBracketOpen(true)}
            className="neo-btn px-3 py-1 rounded-lg bg-white hover:bg-[#38BDF8] text-black font-black flex items-center gap-1"
          >
            <Swords className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>대진표 트리</span>
          </button>
        </div>
      </div>

      {/* Header (isScorerMode=false) */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        topClass={classRankings[0]}
        isScorerMode={false}
      />

      {/* Modular Bento Grid Container */}
      <div className="grid grid-cols-1 gap-6">
        {/* Bento Module 1: Real-time 18 Classes Overall Rankings */}
        <ScoreHero classRankings={classRankings} />

        {/* Bento Module 2: Matches and Brackets Bento Section (View-Only) */}
        <MatchesBento
          matches={matches}
          isScorerMode={false}
          sportRankings={sportRankings}
        />

        {/* Bento Module 3: Real-time Sport Points Matrix Table per Class */}
        <ClassSportScoreMatrix
          matches={matches}
          sportRankings={sportRankings}
          isScorerMode={false}
        />
      </div>

      {/* Footer Bento Card */}
      <footer className="mt-8 glass-panel bg-[#FFE600] dark:bg-[#1e2235] p-6 text-xs text-black dark:text-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000000] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FF5C8D] border-[3px] border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center text-black font-black text-base">
            무
          </div>
          <div>
            <div className="font-black text-sm text-black dark:text-white">
              무선중학교 체육대회 학생용 실시간 포털
            </div>
            <div className="text-[11px] font-bold text-black/80 dark:text-slate-300">
              1학년(5팀) • 2학년(7팀) • 3학년(6팀) 총 18팀 리그 • 학생 조회 전용
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-black">
          <button
            onClick={() => setIsBracketOpen(true)}
            className="neo-btn px-3 py-1.5 rounded-lg bg-white text-black hover:bg-[#00E599] flex items-center gap-1"
          >
            <Swords className="w-3.5 h-3.5 stroke-[2.5]" /> 대진표 안내
          </button>
          <span className="px-3 py-1.5 rounded-lg bg-black text-white border-2 border-black">
            © 2026 무선중학교
          </span>
        </div>
      </footer>

      {/* Tournament Bracket Modal */}
      <TournamentBracketModal
        isOpen={isBracketOpen}
        onClose={() => setIsBracketOpen(false)}
        matches={matches}
      />

      {/* Official Score Rules Modal */}
      <ScoreRulesModal
        isOpen={isScoreRulesOpen}
        onClose={() => setIsScoreRulesOpen(false)}
      />
    </main>
  );
}
