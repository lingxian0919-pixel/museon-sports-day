'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ScoreHero from '../../components/ScoreHero';
import MatchesBento from '../../components/MatchesBento';
import ClassSportScoreMatrix from '../../components/ClassSportScoreMatrix';
import TournamentBracketModal from '../../components/TournamentBracketModal';
import ScoreRulesModal from '../../components/ScoreRulesModal';
import ResetConfirmModal from '../../components/ResetConfirmModal';
import { useSportsData } from '../../lib/useSportsData';
import { Swords, RotateCcw, ShieldAlert, Award } from 'lucide-react';

export default function ScorerAdminPage() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isBracketOpen, setIsBracketOpen] = useState<boolean>(false);
  const [isScoreRulesOpen, setIsScoreRulesOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  const {
    matches,
    classRankings,
    sportRankings,
    handleScoreUpdate,
    handleFinishMatch,
    handleCancelWinner,
    handleStatusUpdate,
    handleUpdateSportRanking,
    handleResetData,
  } = useSportsData();

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
      {/* Scorer Exclusive Top Control Bar (Neo-Brutalist Bento Card) */}
      <div className="mb-4 glass-card bg-[#FF5C8D] dark:bg-slate-800 px-4 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs border-[3px] border-black shadow-[5px_5px_0px_0px_#000000]">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-3 py-1 rounded-lg bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black text-xs flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 stroke-[2.5]" /> 교사 / 기록원 관리 모드
          </span>
          <span className="font-black text-black dark:text-white">
            실시간 득점 입력(+1점) 및 우승 확정 조작 권한이 활성화되어 있습니다.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsScoreRulesOpen(true)}
            className="neo-btn px-3 py-1.5 rounded-xl bg-[#FFE600] hover:bg-[#00E599] text-black font-black flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>종목별 공식 배점표</span>
          </button>
          <button
            onClick={() => setIsResetModalOpen(true)}
            title="초기 데이터로 리셋"
            className="neo-btn px-3 py-1.5 rounded-xl bg-white hover:bg-rose-500 hover:text-white text-black font-black flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>데이터 초기화</span>
          </button>
        </div>
      </div>

      {/* Header (isScorerMode=true) */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        topClass={classRankings[0]}
        isScorerMode={true}
      />

      {/* Modular Bento Grid Container */}
      <div className="grid grid-cols-1 gap-6">
        {/* Bento Module 1: Real-time 18 Classes Overall Rankings */}
        <ScoreHero classRankings={classRankings} />

        {/* Bento Module 2: Matches and Brackets Bento Section (Scorer Mode) */}
        <MatchesBento
          matches={matches}
          isScorerMode={true}
          onScoreUpdate={handleScoreUpdate}
          onFinishMatch={handleFinishMatch}
          onCancelWinner={handleCancelWinner}
          onStatusUpdate={handleStatusUpdate}
          sportRankings={sportRankings}
          onUpdateSportRanking={handleUpdateSportRanking}
        />

        {/* Bento Module 3: Real-time Sport Points Matrix Table per Class */}
        <ClassSportScoreMatrix
          matches={matches}
          sportRankings={sportRankings}
          isScorerMode={true}
        />
      </div>

      {/* Footer Bento Card */}
      <footer className="mt-8 glass-panel bg-[#FFE600] dark:bg-[#1e2235] p-6 text-xs text-black dark:text-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000000] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#00E599] border-[3px] border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center text-black font-black text-base">
            기
          </div>
          <div>
            <div className="font-black text-sm text-black dark:text-white">
              무선중학교 체육대회 기록원/운영진 전용 콘솔
            </div>
            <div className="text-[11px] font-bold text-black/80 dark:text-slate-300">
              18개 학급 실시간 스코어 제어 • 점수 수정 즉시 전교생 실시간 동기화
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-black">
          <button
            onClick={() => setIsBracketOpen(true)}
            className="neo-btn px-3 py-1.5 rounded-lg bg-white text-black hover:bg-[#38BDF8] flex items-center gap-1"
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

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleResetData}
      />
    </main>
  );
}
