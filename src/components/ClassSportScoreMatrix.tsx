'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Trophy,
  Award,
  Crown,
  Sparkles,
  Info,
  CheckCircle2,
  Table as TableIcon,
} from 'lucide-react';
import { Match, SportRankingEntry } from '../lib/types';
import {
  SPORT_CATEGORIES,
  isTournamentSport,
  calcClassSportScore,
  calcClassSportScoreDetail,
} from '../lib/mockData';
import ScoreRulesModal from './ScoreRulesModal';

interface ClassSportScoreMatrixProps {
  matches: Match[];
  sportRankings: SportRankingEntry[];
  isScorerMode?: boolean;
}

interface ClassInfo {
  grade: number;
  classNum: number;
  label: string;
}

export default function ClassSportScoreMatrix({
  matches,
  sportRankings,
  isScorerMode = false,
}: ClassSportScoreMatrixProps) {
  const [selectedGradeTab, setSelectedGradeTab] = useState<number | 'all'>('all');
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // 18개 모든 학급 목록 정의
  const ALL_CLASSES: ClassInfo[] = [
    // 1학년 5학급
    { grade: 1, classNum: 1, label: '1-1' },
    { grade: 1, classNum: 2, label: '1-2' },
    { grade: 1, classNum: 3, label: '1-3' },
    { grade: 1, classNum: 4, label: '1-4' },
    { grade: 1, classNum: 5, label: '1-5' },
    // 2학년 7학급
    { grade: 2, classNum: 1, label: '2-1' },
    { grade: 2, classNum: 2, label: '2-2' },
    { grade: 2, classNum: 3, label: '2-3' },
    { grade: 2, classNum: 4, label: '2-4' },
    { grade: 2, classNum: 5, label: '2-5' },
    { grade: 2, classNum: 6, label: '2-6' },
    { grade: 2, classNum: 7, label: '2-7' },
    // 3학년 6학급
    { grade: 3, classNum: 1, label: '3-1' },
    { grade: 3, classNum: 2, label: '3-2' },
    { grade: 3, classNum: 3, label: '3-3' },
    { grade: 3, classNum: 4, label: '3-4' },
    { grade: 3, classNum: 5, label: '3-5' },
    { grade: 3, classNum: 6, label: '3-6' },
  ];

  // 탭 필터링된 학급 목록
  const displayedClasses =
    selectedGradeTab === 'all'
      ? ALL_CLASSES
      : ALL_CLASSES.filter((c) => c.grade === selectedGradeTab);

  // 각 반별 11개 종목 총점 계산
  const classTotals: Record<string, number> = {};
  displayedClasses.forEach((c) => {
    const key = `${c.grade}-${c.classNum}`;
    let sum = 0;
    SPORT_CATEGORIES.forEach((s) => {
      sum += calcClassSportScore(s.id, c.grade, c.classNum, matches, sportRankings);
    });
    classTotals[key] = sum;
  });

  // 현재 표시된 학급 중 최고 득점 반 찾기
  const maxScore = Math.max(...Object.values(classTotals), 0);

  // 학년별 색상 스타일 헬퍼
  const getGradeTheme = (grade: number) => {
    switch (grade) {
      case 1:
        return {
          header: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          pill: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
        };
      case 2:
        return {
          header: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
          pill: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
        };
      case 3:
      default:
        return {
          header: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
          pill: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
        };
    }
  };

  return (
    <section className="glass-panel p-5 sm:p-7 relative overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 실시간 점수 연동 자동 집계
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                종목별 각 반별 포인트 계산표
                <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20 hidden sm:inline-block">
                  X축: 18개 반 • Y축: 11개 종목
                </span>
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-9">
            대진표 경기 승패 및 순위표 기록이 실시간으로 종합 계산되어 즉시 반영됩니다.
          </p>
        </div>

        {/* Tab Filter & Modal Button */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Grade filter tabs */}
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedGradeTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedGradeTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              전체 (18개 반)
            </button>
            <button
              onClick={() => setSelectedGradeTab(1)}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                selectedGradeTab === 1
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              1학년 (5학급)
            </button>
            <button
              onClick={() => setSelectedGradeTab(2)}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                selectedGradeTab === 2
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2학년 (7학급)
            </button>
            <button
              onClick={() => setSelectedGradeTab(3)}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                selectedGradeTab === 3
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              3학년 (6학급)
            </button>
          </div>

          {/* Score Rules Modal Button */}
          <button
            onClick={() => setIsRulesModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>종목별 배점표</span>
          </button>
        </div>
      </div>

      {/* Main Matrix Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-inner bg-slate-50/50 dark:bg-slate-900/50">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          {/* Table Header: X-Axis (Classes) */}
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 sticky top-0 z-20">
              <th className="py-3 px-3.5 font-black text-slate-800 dark:text-slate-200 w-44 sticky left-0 bg-slate-100 dark:bg-slate-800 z-30 shadow-sm border-r border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5">
                  <TableIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>종목 (Y축) \ 반 (X축)</span>
                </div>
              </th>

              {displayedClasses.map((c) => {
                const theme = getGradeTheme(c.grade);
                return (
                  <th
                    key={`${c.grade}-${c.classNum}`}
                    className={`py-3 px-2 text-center font-black transition-colors ${theme.header}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] opacity-75 font-medium">
                        {c.grade}학년
                      </span>
                      <span className="text-xs font-black">
                        {c.classNum}반
                      </span>
                    </div>
                  </th>
                );
              })}

              <th className="py-3 px-3 text-center font-black bg-amber-500/15 text-amber-700 dark:text-amber-300 border-l border-slate-200 dark:border-slate-700 w-24">
                종목 배점
              </th>
            </tr>
          </thead>

          {/* Table Body: Y-Axis (11 Sports) */}
          <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
            {SPORT_CATEGORIES.map((sport, sIdx) => {
              const isTourney = isTournamentSport(sport.id);
              return (
                <tr
                  key={sport.id}
                  className={`transition-colors hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 ${
                    sIdx % 2 === 0
                      ? 'bg-white/60 dark:bg-slate-900/40'
                      : 'bg-slate-50/40 dark:bg-slate-900/70'
                  }`}
                >
                  {/* Fixed Sport Name Header Cell */}
                  <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-slate-100 sticky left-0 bg-inherit z-10 border-r border-slate-200/70 dark:border-slate-700/70 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-black shrink-0">
                        {sIdx + 1}
                      </span>
                      <div className="truncate">
                        <div className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <span className="truncate">{sport.name}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                              isTourney
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                                : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {isTourney ? '토너먼트' : '순위제'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Sport Points per Class Cells */}
                  {displayedClasses.map((c) => {
                    const cellKey = `${sport.id}-${c.grade}-${c.classNum}`;
                    const score = calcClassSportScore(
                      sport.id,
                      c.grade,
                      c.classNum,
                      matches,
                      sportRankings
                    );
                    const detailInfo = calcClassSportScoreDetail(
                      sport.id,
                      c.grade,
                      c.classNum,
                      matches,
                      sportRankings
                    );
                    const isHovered = hoveredCell === cellKey;

                    return (
                      <td
                        key={cellKey}
                        onMouseEnter={() => setHoveredCell(cellKey)}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`py-2 px-1 text-center font-bold transition-all relative ${
                          score > 0
                            ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-extrabold'
                            : 'text-slate-400 dark:text-slate-500 font-medium'
                        } ${isHovered ? 'ring-2 ring-indigo-500 z-10' : ''}`}
                      >
                        {score > 0 ? (
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-black">{score}</span>
                            {detailInfo.badge && (
                              <span className="text-[9px] scale-90 px-1 py-0 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold whitespace-nowrap">
                                {detailInfo.badge}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] opacity-60">0</span>
                        )}

                        {/* Hover Tooltip */}
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none border border-slate-700">
                            <div className="font-bold text-amber-300">
                              {c.grade}학년 {c.classNum}반 • {sport.name}
                            </div>
                            <div className="text-slate-200 mt-0.5">{detailInfo.detail}</div>
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Sport Max Points / Description */}
                  <td className="py-2 px-2 text-center border-l border-slate-200 dark:border-slate-700 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/5">
                    1위 {sport.totalPoints}pt
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer: Column Totals for Each Class */}
          <tfoot>
            <tr className="border-t-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/90 font-black">
              <td className="py-3.5 px-3.5 font-black text-slate-900 dark:text-white sticky left-0 bg-slate-100 dark:bg-slate-800 z-30 shadow-sm border-r border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-xs sm:text-sm font-black">누적 총점 (TOTAL)</span>
                </div>
              </td>

              {displayedClasses.map((c) => {
                const total = classTotals[`${c.grade}-${c.classNum}`] || 0;
                const isLeader = total > 0 && total === maxScore;

                return (
                  <td
                    key={`total-${c.grade}-${c.classNum}`}
                    className={`py-3.5 px-1.5 text-center font-black transition-all ${
                      isLeader
                        ? 'bg-amber-500/25 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/50'
                        : total > 0
                        ? 'text-indigo-600 dark:text-indigo-300'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      {isLeader && (
                        <Crown className="w-3.5 h-3.5 text-amber-500 mb-0.5 animate-bounce" />
                      )}
                      <span className="text-xs sm:text-sm font-black">{total}</span>
                      <span className="text-[9px] opacity-75 font-semibold">pt</span>
                    </div>
                  </td>
                );
              })}

              <td className="py-3.5 px-2 text-center border-l border-slate-200 dark:border-slate-700 text-xs font-black text-amber-600 dark:text-amber-400">
                11종목 합산
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer Info & Calculation Legend */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            득점 획득 반 (자동 배점 반영)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
            0pt (대기중 / 순위 미부여)
          </span>
          <span className="flex items-center gap-1">
            <Crown className="w-3 h-3 text-amber-500 inline-block" />
            현재 선두 1위 학급
          </span>
        </div>

        <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>대진표 결과 입력 및 순위 수정 시 즉시 자동 집계됩니다.</span>
        </div>
      </div>

      {/* Official Score Rules Modal */}
      <ScoreRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </section>
  );
}
