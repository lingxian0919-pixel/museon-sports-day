'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import ScoreHero from '../components/ScoreHero';
import MatchesBento from '../components/MatchesBento';
import GradeRankingsBento from '../components/GradeRankingsBento';
import CheeringBoardBento from '../components/CheeringBoardBento';
import LiveRankingsBento from '../components/LiveRankingsBento';
import TournamentBracketModal from '../components/TournamentBracketModal';
import { useSportsData } from '../lib/useSportsData';
import { Swords, Bell, Heart, ShieldAlert, Eye } from 'lucide-react';

export default function StudentViewerPage() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isBracketOpen, setIsBracketOpen] = useState<boolean>(false);
  const { matches, gradeScores, classRankings } = useSportsData();

  // Initialize theme from system or default dark
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <main className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 relative">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-2/3 left-1/3 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Banner: Mode Indicator & Announcements */}
      <div className="mb-4 glass-card px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700 dark:text-slate-300 border-blue-500/30">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-black text-[11px] flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> 학생 참관 화면
          </span>
          <span className="truncate">
            실시간 득점 및 18개 반 순위가 자동 반영됩니다. (조회 전용)
          </span>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setIsBracketOpen(true)}
            className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>대진표 트리</span>
          </button>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link
            href="/scorer"
            className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>기록원 모드 이동</span>
          </Link>
        </div>
      </div>

      {/* Header (isScorerMode=false) */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        topClass={classRankings[0]}
        isScorerMode={false}
      />

      {/* Hero Section: Real-time 18 Classes Overall Rankings & Grade Summary */}
      <ScoreHero
        classRankings={classRankings}
        gradeScores={gradeScores}
      />

      {/* Bento Grid Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Bento Card 1: Matches and Brackets (8 cols) - 득점 조작 버튼 비활성화 (View-Only) */}
        <div className="lg:col-span-8">
          <MatchesBento
            matches={matches}
            isScorerMode={false}
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
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black">
            무
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">
              무선중학교 체육대회 학생용 실시간 포털
            </div>
            <div className="text-[11px] text-slate-400">
              1학년(5팀) • 2학년(7팀) • 3학년(6팀) 총 18팀 리그 • 학생 조회 전용
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
          <Link href="/scorer" className="text-amber-500 hover:underline flex items-center gap-1 font-bold">
            <ShieldAlert className="w-3.5 h-3.5" /> 기록원 페이지
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
