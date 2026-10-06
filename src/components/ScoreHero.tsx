'use client';

import React, { useState } from 'react';
import { Trophy, Crown, Sparkles, TrendingUp, Medal, Users, Award } from 'lucide-react';
import { ClassRanking, GradeScore } from '../lib/types';

interface ScoreHeroProps {
  classRankings: ClassRanking[];
  gradeScores: GradeScore[];
}

export default function ScoreHero({ classRankings, gradeScores }: ScoreHeroProps) {
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<number | 'all'>('all');

  // Filter rankings based on selected grade
  const filteredRankings = selectedGradeFilter === 'all'
    ? classRankings
    : classRankings.filter((cr) => cr.grade === selectedGradeFilter);

  // Top 3 classes from the current filtered list
  const top1 = filteredRankings[0];
  const top2 = filteredRankings[1];
  const top3 = filteredRankings[2];

  // Grade color badges helper
  const getGradeTheme = (grade: number) => {
    switch (grade) {
      case 1:
        return {
          badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
          border: 'border-emerald-500/30',
          dot: 'bg-emerald-500',
        };
      case 2:
        return {
          badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20',
          gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
          border: 'border-blue-500/30',
          dot: 'bg-blue-500',
        };
      case 3:
      default:
        return {
          badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20',
          gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
          border: 'border-purple-500/30',
          dot: 'bg-purple-500',
        };
    }
  };

  // Total points for 3 grades
  const totalAllGrades = gradeScores.reduce((sum, g) => sum + g.totalScore, 0) || 1;

  return (
    <div className="glass-panel p-6 sm:p-8 relative overflow-hidden mb-6">
      {/* Background glowing effects */}
      <div className="gradient-blob bg-amber-500/15 w-80 h-80 -top-10 -left-10 pointer-events-none" />
      <div className="gradient-blob bg-indigo-500/15 w-80 h-80 -bottom-10 -right-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-8">
        {/* Left: Overall Class Rankings (실시간 종합 순위) */}
        <div className="w-full lg:w-7/12 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> 18개 학급 실시간 종합 순위
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  체육대회 실시간 종합 리더보드
                </h2>
              </div>

              {/* Grade Filter Pill Tabs */}
              <div className="flex items-center gap-1 bg-slate-200/50 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
                <button
                  onClick={() => setSelectedGradeFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedGradeFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  전체 (18팀)
                </button>
                <button
                  onClick={() => setSelectedGradeFilter(1)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedGradeFilter === 1
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  1학년 (5팀)
                </button>
                <button
                  onClick={() => setSelectedGradeFilter(2)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedGradeFilter === 2
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  2학년 (7팀)
                </button>
                <button
                  onClick={() => setSelectedGradeFilter(3)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedGradeFilter === 3
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  3학년 (6팀)
                </button>
              </div>
            </div>

            {/* Top 3 Podium Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
              {/* 1st Place Champion */}
              {top1 && (
                <div className="glass-card p-4 relative overflow-hidden border-amber-500/40 bg-gradient-to-b from-amber-500/15 via-transparent to-transparent ring-1 ring-amber-500/30 flex flex-col justify-between sm:order-2 order-1 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center gap-1 shadow-sm">
                      <Crown className="w-3.5 h-3.5" /> 1위 챔피언
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold ${getGradeTheme(top1.grade).badge}`}>
                      {top1.grade}학년
                    </span>
                  </div>
                  <div className="my-2">
                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      {top1.grade}학년 {top1.classNum}반
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight mt-1">
                      {top1.score.toLocaleString()}
                      <span className="text-xs font-semibold text-slate-400 ml-1">pt</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span>전적: {top1.wins}승 {top1.losses}패</span>
                    <span className="text-amber-500 font-bold">🥇 선두 질주</span>
                  </div>
                </div>
              )}

              {/* 2nd Place */}
              {top2 && (
                <div className="glass-card p-4 relative overflow-hidden border-slate-300 dark:border-slate-700 bg-gradient-to-b from-slate-300/10 via-transparent to-transparent flex flex-col justify-between sm:order-1 order-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1">
                      <Medal className="w-3 h-3 text-slate-400" /> 2위
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold ${getGradeTheme(top2.grade).badge}`}>
                      {top2.grade}학년
                    </span>
                  </div>
                  <div className="my-2">
                    <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {top2.grade}학년 {top2.classNum}반
                    </div>
                    <div className="text-2xl font-black text-slate-700 dark:text-slate-200 tracking-tight mt-1">
                      {top2.score.toLocaleString()}
                      <span className="text-xs font-semibold text-slate-400 ml-1">pt</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span>전적: {top2.wins}승 {top2.losses}패</span>
                    <span className="text-slate-400 font-medium">🥈 추격중</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {top3 && (
                <div className="glass-card p-4 relative overflow-hidden border-amber-700/30 bg-gradient-to-b from-amber-700/10 via-transparent to-transparent flex flex-col justify-between sm:order-3 order-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center gap-1">
                      <Medal className="w-3 h-3 text-amber-700" /> 3위
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold ${getGradeTheme(top3.grade).badge}`}>
                      {top3.grade}학년
                    </span>
                  </div>
                  <div className="my-2">
                    <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {top3.grade}학년 {top3.classNum}반
                    </div>
                    <div className="text-2xl font-black text-amber-700 dark:text-amber-400 tracking-tight mt-1">
                      {top3.score.toLocaleString()}
                      <span className="text-xs font-semibold text-slate-400 ml-1">pt</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span>전적: {top3.wins}승 {top3.losses}패</span>
                    <span className="text-amber-700 dark:text-amber-400 font-medium">🥉 입상권</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Rank 4~8 Ticker */}
          <div className="mt-2 pt-3 border-t border-slate-200/50 dark:border-slate-800/60">
            <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> 상위권 득점 현황 (4위 ~ 8위)
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredRankings.slice(3, 8).map((cr, idx) => (
                <div
                  key={`${cr.grade}-${cr.classNum}`}
                  className="glass-card px-2.5 py-1 flex items-center gap-2 text-xs"
                >
                  <span className="font-bold text-slate-400">{idx + 4}위</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {cr.grade}-{cr.classNum}반
                  </span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                    {cr.score}pt
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Grade-level Summary & Participation Breakdown */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Users className="w-4 h-4 text-indigo-500" /> 학년별 누적 포인트 및 참가 현황
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">총 18개 반</span>
            </div>

            <div className="space-y-3">
              {gradeScores.map((gs) => {
                const gradePercent = Math.round((gs.totalScore / totalAllGrades) * 100);
                const avgScore = Math.round(gs.totalScore / gs.classesCount);

                return (
                  <div key={gs.grade} className="glass-card p-3.5 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${getGradeTheme(gs.grade).dot}`} />
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {gs.grade}학년 ({gs.classesCount}개 반)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          반 평균 {avgScore}pt
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-bold">
                        <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                          {gs.totalScore.toLocaleString()}pt
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {gradePercent}%
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all duration-500 ${
                          gs.grade === 1
                            ? 'bg-emerald-500'
                            : gs.grade === 2
                            ? 'bg-blue-500'
                            : 'bg-purple-500'
                        }`}
                        style={{ width: `${gradePercent}%` }}
                      />
                    </div>

                    {/* Medals */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="text-[10px]">
                        {gs.grade === 1 && '1반 ~ 5반 경합'}
                        {gs.grade === 2 && '1반 ~ 7반 경합'}
                        {gs.grade === 3 && '1반 ~ 6반 경합'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 font-bold">🥇 {gs.goldMedals}</span>
                        <span className="text-slate-400 font-bold">🥈 {gs.silverMedals}</span>
                        <span className="text-amber-700 font-bold">🥉 {gs.bronzeMedals}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall 3-Grade ratio bar */}
          <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/60">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-semibold">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                ● 1학년 (5팀)
              </span>
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                ● 2학년 (7팀)
              </span>
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                ● 3학년 (6팀)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${(gradeScores[0].totalScore / totalAllGrades) * 100}%` }}
              />
              <div
                className="bg-blue-500 transition-all duration-500"
                style={{ width: `${(gradeScores[1].totalScore / totalAllGrades) * 100}%` }}
              />
              <div
                className="bg-purple-500 transition-all duration-500"
                style={{ width: `${(gradeScores[2].totalScore / totalAllGrades) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
