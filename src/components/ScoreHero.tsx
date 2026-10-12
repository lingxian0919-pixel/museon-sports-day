'use client';

import React, { useState } from 'react';
import { Trophy, Crown, Sparkles, TrendingUp, Medal } from 'lucide-react';
import { ClassRanking, GradeScore } from '../lib/types';

interface ScoreHeroProps {
  classRankings: ClassRanking[];
  gradeScores?: GradeScore[];
}

export default function ScoreHero({ classRankings }: ScoreHeroProps) {
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<number | 'all'>('all');

  // Filter rankings based on selected grade
  const filteredRankings =
    selectedGradeFilter === 'all'
      ? classRankings
      : classRankings.filter((cr) => cr.grade === selectedGradeFilter);

  // Top 3 classes from the current filtered list
  const top1 = filteredRankings[0];
  const top2 = filteredRankings[1];
  const top3 = filteredRankings[2];

  // Neo-Brutalism Grade Pop Color badges helper
  const getGradeTheme = (grade: number) => {
    switch (grade) {
      case 1:
        return {
          badge: 'bg-[#00E599] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]',
          accentBar: 'bg-[#00E599]',
        };
      case 2:
        return {
          badge: 'bg-[#38BDF8] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]',
          accentBar: 'bg-[#38BDF8]',
        };
      case 3:
      default:
        return {
          badge: 'bg-[#C084FC] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]',
          accentBar: 'bg-[#C084FC]',
        };
    }
  };

  return (
    <section className="glass-panel p-5 sm:p-7 relative overflow-hidden mb-6 bg-white dark:bg-[#1e2235] border-[3px] border-black shadow-[6px_6px_0px_0px_#000000]">
      <div className="relative z-10 w-full flex flex-col justify-between">
        {/* Top Header & Grade Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b-[3px] border-black">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF5C8D] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] text-[11px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" /> 18개 학급 실시간 벤토 리더보드
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight">
              체육대회 실시간 종합 리더보드
            </h2>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
              종목별 각 반별 포인트 계산표의 11개 종목 합산 총점이 실시간으로 자동 반영됩니다.
            </p>
          </div>

          {/* Neo-Brutalist Grade Filter Pill Tabs */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {[
              { id: 'all' as const, label: '전체 (18팀)', activeBg: 'bg-[#FFE600] text-black' },
              { id: 1 as const, label: '1학년 (5팀)', activeBg: 'bg-[#00E599] text-black' },
              { id: 2 as const, label: '2학년 (7팀)', activeBg: 'bg-[#38BDF8] text-black' },
              { id: 3 as const, label: '3학년 (6팀)', activeBg: 'bg-[#C084FC] text-black' },
            ].map((tab) => {
              const isActive = selectedGradeFilter === tab.id;
              return (
                <button
                  key={String(tab.id)}
                  onClick={() => setSelectedGradeFilter(tab.id)}
                  className={`neo-btn px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    isActive
                      ? `${tab.activeBg} translate-x-[-1px] translate-y-[-1px]`
                      : 'bg-slate-100 dark:bg-slate-800 text-black dark:text-white hover:bg-[#FFE600] hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Apple-style Modular Bento Grid: Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 my-5">
          {/* 1st Place Champion - Featured Large Bento Card (6 cols on lg) */}
          {top1 && (
            <div className="md:col-span-6 lg:col-span-6 p-5 rounded-2xl bg-[#FFE600] text-black border-[3px] border-black shadow-[6px_6px_0px_0px_#000000] neo-card-interactive flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-xl bg-black text-[#FFE600] font-black text-xs flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]">
                  <Crown className="w-4 h-4 fill-[#FFE600]" /> 1위 종합 챔피언
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-lg font-black ${getGradeTheme(top1.grade).badge}`}>
                  {top1.grade}학년
                </span>
              </div>

              <div className="my-2 flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                    {top1.grade}학년 {top1.classNum}반
                  </div>
                  <div className="text-xs font-extrabold text-black/80 mt-0.5">
                    전 종목 실시간 합산 선두
                  </div>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000000]">
                  <span className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                    {top1.score.toLocaleString()}
                  </span>
                  <span className="text-xs font-black text-black ml-1">pt</span>
                </div>
              </div>

              <div className="text-xs font-black text-black flex items-center justify-between pt-3 mt-2 border-t-[2.5px] border-black">
                <span className="px-2 py-0.5 rounded-md bg-white/80 border-2 border-black">
                  토너먼트 전적: {top1.wins}승 {top1.losses}패
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#FF5C8D] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  🥇 단독 선두 질주
                </span>
              </div>
            </div>
          )}

          {/* 2nd Place Bento Card (3 cols on md, 3 cols on lg) */}
          {top2 && (
            <div className="md:col-span-3 lg:col-span-3 p-4 rounded-2xl bg-[#E0F2FE] dark:bg-slate-800 text-black dark:text-white border-[3px] border-black shadow-[5px_5px_0px_0px_#000000] neo-card-interactive flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-[#38BDF8] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black text-xs flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5 stroke-[2.5]" /> 2위 준우승권
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-black ${getGradeTheme(top2.grade).badge}`}>
                  {top2.grade}학년
                </span>
              </div>
              <div className="my-2">
                <div className="text-lg sm:text-xl font-black text-black dark:text-white">
                  {top2.grade}학년 {top2.classNum}반
                </div>
                <div className="text-2xl sm:text-3xl font-black text-black dark:text-[#38BDF8] tracking-tight mt-1">
                  {top2.score.toLocaleString()}
                  <span className="text-xs font-black ml-1">pt</span>
                </div>
              </div>
              <div className="text-[11px] font-black flex items-center justify-between pt-2.5 border-t-2 border-black">
                <span>전적: {top2.wins}승 {top2.losses}패</span>
                <span className="px-2 py-0.5 rounded bg-white text-black border-2 border-black">
                  🥈 맹추격중
                </span>
              </div>
            </div>
          )}

          {/* 3rd Place Bento Card (3 cols on md, 3 cols on lg) */}
          {top3 && (
            <div className="md:col-span-3 lg:col-span-3 p-4 rounded-2xl bg-[#FCE7F3] dark:bg-slate-800 text-black dark:text-white border-[3px] border-black shadow-[5px_5px_0px_0px_#000000] neo-card-interactive flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-[#FF5C8D] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] font-black text-xs flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5 stroke-[2.5]" /> 3위 입상권
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-black ${getGradeTheme(top3.grade).badge}`}>
                  {top3.grade}학년
                </span>
              </div>
              <div className="my-2">
                <div className="text-lg sm:text-xl font-black text-black dark:text-white">
                  {top3.grade}학년 {top3.classNum}반
                </div>
                <div className="text-2xl sm:text-3xl font-black text-black dark:text-[#FF5C8D] tracking-tight mt-1">
                  {top3.score.toLocaleString()}
                  <span className="text-xs font-black ml-1">pt</span>
                </div>
              </div>
              <div className="text-[11px] font-black flex items-center justify-between pt-2.5 border-t-2 border-black">
                <span>전적: {top3.wins}승 {top3.losses}패</span>
                <span className="px-2 py-0.5 rounded bg-white text-black border-2 border-black">
                  🥉 3위권
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modular Bento Grid for 4th ~ 18th Classes */}
        <div className="mt-2 pt-4 border-t-[3px] border-black">
          <div className="text-xs font-black text-black dark:text-white mb-3 flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00E599] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              <span>
                {selectedGradeFilter === 'all'
                  ? '4위 ~ 18위 학급 벤토 그리드 현황'
                  : `${selectedGradeFilter}학년 4위 이하 학급 순위`}
              </span>
            </span>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border-2 border-black text-black dark:text-white">
              총 {filteredRankings.length}개 학급 출전중
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3">
            {filteredRankings.slice(3).map((cr, idx) => (
              <div
                key={`${cr.grade}-${cr.classNum}`}
                className="p-3 rounded-xl bg-[#FFFDF5] dark:bg-slate-800 border-[3px] border-black shadow-[3px_3px_0px_0px_#000000] neo-card-interactive flex flex-col justify-between text-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-black text-white font-black text-[11px]">
                    {idx + 4}위
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${getGradeTheme(cr.grade).badge}`}>
                    {cr.grade}학년
                  </span>
                </div>
                <div className="font-black text-sm text-black dark:text-white my-0.5">
                  {cr.grade}학년 {cr.classNum}반
                </div>
                <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t-2 border-black/20 dark:border-white/20 text-[11px]">
                  <span className="font-black text-xs px-1.5 py-0.5 rounded bg-[#FFE600] text-black border border-black">
                    {cr.score}pt
                  </span>
                  <span className="font-bold text-slate-600 dark:text-slate-300 text-[10px]">
                    {cr.wins}승 {cr.losses}패
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
