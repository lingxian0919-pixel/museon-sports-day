'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ScoreHero from '../../components/ScoreHero';
import MatchesBento from '../../components/MatchesBento';
import ClassSportScoreMatrix from '../../components/ClassSportScoreMatrix';
import TournamentBracketModal from '../../components/TournamentBracketModal';
import ScoreRulesModal from '../../components/ScoreRulesModal';
import ResetConfirmModal from '../../components/ResetConfirmModal';
import ScorerPinModal from '../../components/ScorerPinModal';
import { useSportsData } from '../../lib/useSportsData';
import {
  Swords,
  RotateCcw,
  ShieldAlert,
  Award,
  ShieldCheck,
  Lock,
  RefreshCw,
  AlertTriangle,
  X,
  Radio,
} from 'lucide-react';

export default function ScorerAdminPage() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isBracketOpen, setIsBracketOpen] = useState<boolean>(false);
  const [isScoreRulesOpen, setIsScoreRulesOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);

  const {
    matches,
    gradeScores,
    classRankings,
    sportRankings,
    isSyncing,
    syncError,
    isScorerAuthenticated,
    authenticateScorer,
    logoutScorer,
    clearSyncError,
    handleScoreUpdate,
    handleFinishMatch,
    handleCancelWinner,
    handleStatusUpdate,
    handleUpdateSportRanking,
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

  // Prompt for PIN on initial visit if not authenticated
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isScorerAuthenticated) {
        setIsPinModalOpen(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isScorerAuthenticated]);

  return (
    <main className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 relative">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-2/3 left-1/3 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Save Failure / Sync Error Toast */}
      {syncError && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full bg-rose-950/95 border-2 border-rose-500 text-white rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-bounce-short flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-rose-200">저장 실패 알림</div>
            <div className="text-slate-200 mt-0.5 leading-relaxed">{syncError}</div>
          </div>
          <button
            onClick={clearSyncError}
            className="p-1.5 rounded-lg hover:bg-rose-800 text-rose-300 hover:text-white transition-colors"
            title="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scorer Exclusive Top Control Bar */}
      <div className="mb-4 glass-card px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs bg-amber-500/10 border-amber-500/40">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5" /> 교사 / 기록원 관리 모드
          </span>

          {/* Scorer Authentication Status Pill */}
          {isScorerAuthenticated ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> PIN 인증 완료
              <button
                onClick={logoutScorer}
                className="ml-1 text-[10px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                title="인증 해제"
              >
                (해제)
              </button>
            </span>
          ) : (
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-[11px] flex items-center gap-1 border border-rose-500/30 hover:bg-rose-500/30 transition-colors animate-pulse"
            >
              <Lock className="w-3.5 h-3.5" /> PIN 미인증 (수정 시 인증 필요)
            </button>
          )}

          {/* Realtime DB Status Pill */}
          <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-medium text-[11px] flex items-center gap-1">
            {isSyncing ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                <span>DB 동기화 중...</span>
              </>
            ) : (
              <>
                <Radio className="w-3 h-3 text-emerald-500" />
                <span>Supabase 공용 DB 실시간 연동</span>
              </>
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!isScorerAuthenticated && (
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>기록원 PIN 입력</span>
            </button>
          )}

          <button
            onClick={() => setIsScoreRulesOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-200 font-bold flex items-center gap-1 transition-colors border border-amber-500/30"
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>종목별 공식 배점표</span>
          </button>
          <button
            onClick={() => setIsResetModalOpen(true)}
            title="초기 데이터로 리셋"
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 transition-colors border border-rose-500/30 cursor-pointer shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
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

      {/* Hero Section: Real-time 18 Classes Overall Rankings */}
      <ScoreHero
        classRankings={classRankings}
      />

      {/* Matches and Brackets Bento Section (Scorer Mode) */}
      <div className="mb-6">
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
      </div>

      {/* Real-time Sport Points Matrix Table per Class */}
      <div className="mb-8">
        <ClassSportScoreMatrix
          matches={matches}
          sportRankings={sportRankings}
          isScorerMode={true}
        />
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
              18개 학급 실시간 스코어 제어 • Supabase 공용 DB 실시간 동기화 (다중 기기 동시 지원)
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
          <span>© 2026 무선중학교</span>
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

      {/* Scorer PIN Authentication Modal */}
      <ScorerPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={(pin) => authenticateScorer(pin)}
        verifyFn={authenticateScorer}
      />
    </main>
  );
}
