'use client';

import React from 'react';
import { ShieldAlert, Award, TrendingUp, Sparkles, Flag } from 'lucide-react';
import { GradeScore } from '../lib/types';

interface ScoreHeroProps {
  totalBlue: number;
  totalWhite: number;
  gradeScores: GradeScore[];
}

export default function ScoreHero({ totalBlue, totalWhite, gradeScores }: ScoreHeroProps) {
  const total = totalBlue + totalWhite || 1;
  const bluePercent = Math.round((totalBlue / total) * 100);
  const whitePercent = 100 - bluePercent;
  const diff = Math.abs(totalBlue - totalWhite);
  const leadingTeam = totalBlue >= totalWhite ? '청군' : '백군';

  return (
    <div className="glass-panel p-6 sm:p-8 relative overflow-hidden mb-6">
      {/* Background glowing effects */}
      <div className="gradient-blob bg-blue-500/20 w-72 h-72 -top-10 -left-10 pointer-events-none" />
      <div className="gradient-blob bg-rose-500/20 w-72 h-72 -bottom-10 -right-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: Overall Team Scoreboard */}
        <div className="w-full lg:w-7/12 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> 청군 vs 백군 실시간 종합 총점
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              현재 {leadingTeam} {diff}점 리드 중!
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-2">
            {/* Blue Team Card */}
            <div className="glass-card p-5 relative overflow-hidden border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 hover:scale-[1.01] transition-transform">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 text-sm">
                  <Flag className="w-4 h-4" /> 청 군 (BLUE)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 font-bold">
                  {bluePercent}%
                </span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                {totalBlue.toLocaleString()}
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ml-1">점</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-blue-500" /> 홀수 반 연합 (1·3·5반)
              </div>
            </div>

            {/* White Team Card */}
            <div className="glass-card p-5 relative overflow-hidden border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-orange-500/5 hover:scale-[1.01] transition-transform">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 text-sm">
                  <Flag className="w-4 h-4" /> 백 군 (WHITE)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 font-bold">
                  {whitePercent}%
                </span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                {totalWhite.toLocaleString()}
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ml-1">점</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-rose-500" /> 짝수 반 연합 (2·4·6반)
              </div>
            </div>
          </div>

          {/* Tug of war bar */}
          <div className="mt-4">
            <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700 h-full relative"
                style={{ width: `${bluePercent}%` }}
              />
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-700 h-full relative"
                style={{ width: `${whitePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Grade-level Points Summary Breakdown */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> 학년별 획득 포인트 현황
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">총 3개 학년</span>
          </div>

          <div className="space-y-3">
            {gradeScores.map((gs) => {
              const gradeTotal = gs.blueScore + gs.whiteScore;
              return (
                <div key={gs.grade} className="glass-card p-3.5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {gs.grade}학년 종합
                    </span>
                    <div className="flex items-center gap-3 font-semibold">
                      <span className="text-blue-600 dark:text-blue-400">청군 {gs.blueScore}</span>
                      <span className="text-slate-300 dark:text-slate-600">/</span>
                      <span className="text-rose-600 dark:text-rose-400">백군 {gs.whiteScore}</span>
                      <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-800 dark:text-slate-200 font-bold ml-1">
                        {gradeTotal}점
                      </span>
                    </div>
                  </div>
                  {/* Mini gauge */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{ width: `${gradeTotal ? (gs.blueScore / gradeTotal) * 100 : 50}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-500"
                      style={{ width: `${gradeTotal ? (gs.whiteScore / gradeTotal) * 100 : 50}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
