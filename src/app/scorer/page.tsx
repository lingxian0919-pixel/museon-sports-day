'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import ScoreHero from '../../components/ScoreHero';
import MatchesBento from '../../components/MatchesBento';
import GradeRankingsBento from '../../components/GradeRankingsBento';
import CheeringBoardBento from '../../components/CheeringBoardBento';
import LiveRankingsBento from '../../components/LiveRankingsBento';
import TournamentBracketModal from '../../components/TournamentBracketModal';
import { useSportsData } from '../../lib/useSportsData';
import { Swords, RotateCcw, ShieldAlert, Eye, Share2, Check } from 'lucide-react';

export default function ScorerAdminPage() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isBracketOpen, setIsBracketOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const {
    matches,
    gradeScores,
    classRankings,
    handleScoreUpdate,
    handleFinishMatch,
    handleResetData,
  } = useSportsData();

  // Initialize theme from system or default dark
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleCopyScorerLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 relative">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-2/3 left-1/3 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Scorer Exclusive Top Control Bar */}
      <div className="mb-4 glass-card px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs bg-amber-500/10 border-amber-500/40">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5" /> 교사 / 기록원 관리 모드
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            실시간 득점 입력(+1점) 및 우승 확정 조작 권한이 활성화되어 있습니다.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleCopyScorerLink}
            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">기록원 링크 복사완료!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-amber-500" />
                <span>기록원 링크 복사</span>
              </>
            )}
          </button>

          <button
            onClick={handleResetData}
            title="초기 데이터로 리셋"
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>데이터 초기화</span>
          </button>

          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1 transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>학생용 화면(조회전용) 보기</span>
          </Link>
        </div>
      </div>

      {/* Header (isScorerMode=true) */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        topClass={classRankings[0]}
        isScorerMode={true}
      />

      {/* Hero Section: Real-time 18 Classes Overall Rankings & Grade Summary */}
      <ScoreHero
        classRankings={classRankings}
        gradeScores={gradeScores}
      />

      {/* Bento Grid Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Bento Card 1: Matches and Brackets (8 cols) - 득점 조작 버튼 활성화 (Scorer Mode) */}
        <div className="lg:col-span-8">
          <MatchesBento
            matches={matches}
            isScorerMode={true}
            onScoreUpdate={handleScoreUpdate}
            onFinishMatch={handleFinishMatch}
          />
        </div>

        {/* Bento Card 2: 18 Classes Rankings Leaderboard (4 cols) */}
        <div className="lg:col-span-4">
          <GradeRankingsBento
            gradeScores={gradeScores}
            classRankings={classRankings}
          />
        </div>
      </div>

      {/* Secondary Bento Grid: Community Board & Hall of Fame Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Bento Card 3: Cheering Community Board (Supabase posts) (6 cols) */}
        <div className="lg:col-span-6">
          <CheeringBoardBento />
        </div>

        {/* Bento Card 4: Live Hall of Fame Rankings (Supabase rankings) (6 cols) */}
        <div className="lg:col-span-6">
          <LiveRankingsBento />
        </div>
      </div>

      {/* Footer */}
      <footer className="glass-panel p-6 text-xs text-slate-500 dark:text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
            기
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">
              무선중학교 체육대회 기록원/운영진 전용 콘솔
            </div>
            <div className="text-[11px] text-slate-400">
              18개 학급 실시간 스코어 제어 • 점수 수정 즉시 전교생 실시간 동기화
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setIsBracketOpen(true)}
            className="hover:text-indigo-500 transition-colors flex items-center gap-1"
          >
            <Swords className="w-3.5 h-3.5" /> 대진표 안내
          </button>
          <span>•</span>
          <Link href="/" className="text-blue-500 hover:underline flex items-center gap-1 font-bold">
            <Eye className="w-3.5 h-3.5" /> 학생용 보기 화면
          </Link>
          <span>•</span>
          <span>© 2026 무선중학교</span>
        </div>
      </footer>

      {/* Tournament Bracket Modal */}
      <TournamentBracketModal
        isOpen={isBracketOpen}
        onClose={() => setIsBracketOpen(false)}
        matches={matches}
      />
    </main>
  );
}
