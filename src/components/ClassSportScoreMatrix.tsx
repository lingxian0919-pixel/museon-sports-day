'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Trophy,
  Award,
  Crown,
  Sparkles,
  Info,
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

  // 학년별 네오 브루탈리즘 팝 컬러 헬퍼
  const getGradeTheme = (grade: number) => {
    switch (grade) {
      case 1:
        return {
          pill: 'bg-[#00E599] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]',
        };
      case 2:
        return {
          pill: 'bg-[#38BDF8] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]',
        };
      case 3:
      default:
        return {
          pill: 'bg-[#C084FC] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]',
        };
    }
  };

  return (
    <section className="glass-panel p-5 sm:p-7 relative overflow-hidden bg-white dark:bg-[#1e2235] border-[3px] border-black shadow-[6px_6px_0px_0px_#000000]">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b-[3px] border-black">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#00E599] text-black border-[3px] border-black shadow-[3px_3px_0px_0px_#000000]">
              <Calculator className="w-5 h-5 stroke-[2.5]" />
            </span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-black dark:text-[#FFE600] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5C8D] stroke-[2.5]" /> 실시간 점수 연동 자동 집계
              </span>
              <h2 className="text-lg sm:text-xl font-black text-black dark:text-white flex items-center gap-2 flex-wrap">
                종목별 각 반별 포인트 계산표
                <span className="text-xs bg-[#FFE600] text-black font-black px-2.5 py-0.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hidden sm:inline-block">
                  18개 반 • 11개 종목
                </span>
              </h2>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1.5 pl-12">
            대진표 경기 승패 및 순위표 기록이 실시간으로 종합 계산되어 즉시 반영됩니다.
          </p>
        </div>

        {/* Tab Filter & Modal Button */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Grade filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-black">
            {[
              { id: 'all' as const, label: '전체 (18개 반)', activeBg: 'bg-[#FFE600] text-black' },
              { id: 1 as const, label: '1학년 (5학급)', activeBg: 'bg-[#00E599] text-black' },
              { id: 2 as const, label: '2학년 (7학급)', activeBg: 'bg-[#38BDF8] text-black' },
              { id: 3 as const, label: '3학년 (6학급)', activeBg: 'bg-[#C084FC] text-black' },
            ].map((tab) => {
              const isActive = selectedGradeTab === tab.id;
              return (
                <button
                  key={String(tab.id)}
                  onClick={() => setSelectedGradeTab(tab.id)}
                  className={`neo-btn px-3 py-1.5 rounded-xl transition-all ${
                    isActive
                      ? tab.activeBg
                      : 'bg-slate-100 dark:bg-slate-800 text-black dark:text-white hover:bg-[#FFE600] hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Score Rules Modal Button */}
          <button
            onClick={() => setIsRulesModalOpen(true)}
            className="neo-btn px-3.5 py-1.5 rounded-xl bg-[#FF5C8D] hover:bg-[#FFE600] text-black text-xs font-black flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 stroke-[2.5]" />
            <span>종목별 배점표</span>
          </button>
        </div>
      </div>

      {/* Main Matrix Table Container */}
      <div className="overflow-x-auto rounded-2xl border-[3px] border-black shadow-[5px_5px_0px_0px_#000000] bg-white dark:bg-slate-900">
        <table className="w-full text-xs text-left border-collapse min-w-[920px]">
          {/* Table Header: X-Axis (11 Sports + Total) */}
          <thead>
            <tr className="border-b-[3px] border-black bg-[#FFE600] text-black sticky top-0 z-20">
              <th className="py-3.5 px-3.5 font-black text-black w-36 sticky left-0 bg-[#FFE600] z-30 border-r-[3px] border-black">
                <div className="flex items-center gap-1.5">
                  <TableIcon className="w-4 h-4 text-black stroke-[2.5]" />
                  <span className="text-xs sm:text-sm font-black">반 \ 종목</span>
                </div>
              </th>

              {SPORT_CATEGORIES.map((sport) => {
                const isTourney = isTournamentSport(sport.id);
                return (
                  <th
                    key={sport.id}
                    className="py-2.5 px-2 text-center font-black text-black border-r-2 border-black min-w-[80px]"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-black border-[1.5px] border-black shrink-0 ${
                          isTourney ? 'bg-[#FF5C8D] text-black' : 'bg-[#00E599] text-black'
                        }`}
                      >
                        {isTourney ? '토너먼트' : '순위제'}
                      </span>
                      <span className="text-xs font-black whitespace-nowrap">
                        {sport.name}
                      </span>
                    </div>
                  </th>
                );
              })}

              <th className="py-3 px-3 text-center font-black bg-[#38BDF8] text-black border-l-[3px] border-black w-28">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>누적 총점</span>
                  </div>
                  <span className="text-[9px] font-black">(TOTAL)</span>
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body: Y-Axis (Classes) */}
          <tbody className="divide-y-2 divide-black">
            {displayedClasses.map((c, cIdx) => {
              const theme = getGradeTheme(c.grade);
              const classKey = `${c.grade}-${c.classNum}`;
              const total = classTotals[classKey] || 0;
              const isLeader = total > 0 && total === maxScore;

              return (
                <tr
                  key={classKey}
                  className={`transition-colors hover:bg-[#FFF9DB] dark:hover:bg-slate-800 ${
                    cIdx % 2 === 0
                      ? 'bg-white dark:bg-slate-900'
                      : 'bg-[#FAF7F0] dark:bg-slate-800/70'
                  }`}
                >
                  {/* Fixed Class Name Header Cell (Y-Axis) */}
                  <td className="py-2.5 px-3.5 font-black text-black dark:text-white sticky left-0 bg-inherit z-10 border-r-[3px] border-black">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-black shrink-0 ${theme.pill}`}
                        >
                          {c.grade}학년
                        </span>
                        <span className="text-xs sm:text-sm font-black text-black dark:text-white whitespace-nowrap">
                          {c.classNum}반
                        </span>
                      </div>
                      {isLeader && (
                        <Crown className="w-4 h-4 text-black fill-[#FFE600] shrink-0" />
                      )}
                    </div>
                  </td>

                  {/* Sport Points Cells for this Class (X-Axis) */}
                  {SPORT_CATEGORIES.map((sport) => {
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
                        className={`py-2 px-1 text-center font-black transition-all relative border-r-2 border-black ${
                          score > 0
                            ? 'bg-[#D1FAE5] dark:bg-emerald-900/50 text-black dark:text-emerald-200'
                            : 'text-slate-400 dark:text-slate-500 font-bold'
                        } ${isHovered ? 'bg-[#FFE600] !text-black z-10' : ''}`}
                      >
                        {score > 0 ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-xs font-black">{score}</span>
                            {detailInfo.badge && (
                              <span className="text-[9px] px-1.5 py-0 rounded bg-[#00E599] text-black border border-black font-black whitespace-nowrap">
                                {detailInfo.badge}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] opacity-60">0</span>
                        )}

                        {/* Hover Tooltip */}
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-3 py-1.5 bg-black text-white text-[11px] rounded-xl shadow-[4px_4px_0px_0px_#FFE600] whitespace-nowrap z-50 pointer-events-none border-2 border-white">
                            <div className="font-black text-[#FFE600]">
                              {c.grade}학년 {c.classNum}반 • {sport.name}
                            </div>
                            <div className="text-white font-bold mt-0.5">{detailInfo.detail}</div>
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Row Total Score for this Class */}
                  <td
                    className={`py-2.5 px-2 text-center font-black border-l-[3px] border-black transition-all ${
                      isLeader
                        ? 'bg-[#FFE600] text-black'
                        : total > 0
                        ? 'bg-[#E0F2FE] dark:bg-indigo-950/60 text-black dark:text-[#38BDF8]'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {isLeader && (
                        <Crown className="w-4 h-4 text-black fill-black animate-bounce shrink-0" />
                      )}
                      <span className="text-xs sm:text-sm font-black">{total}</span>
                      <span className="text-[9px] font-black">pt</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info & Calculation Legend */}
      <div className="mt-4 pt-3 border-t-[3px] border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-black text-black dark:text-white">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#00E599] border-2 border-black inline-block" />
            득점 획득 반 (자동 배점 반영)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-300 border-2 border-black inline-block" />
            0pt (대기중 / 순위 미부여)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#FFE600] border-2 border-black inline-block" />
            현재 선두 1위 학급
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <Info className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
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
