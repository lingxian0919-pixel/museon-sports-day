'use client';

import React from 'react';
import { Medal, Trophy, TrendingUp, Users, Crown } from 'lucide-react';
import { ClassRanking, GradeScore } from '../lib/types';

interface GradeRankingsBentoProps {
  gradeScores: GradeScore[];
  classRankings: ClassRanking[];
}

export default function GradeRankingsBento({ gradeScores, classRankings }: GradeRankingsBentoProps) {
  // Sort grade by total score descending
  const sortedGrades = [...gradeScores].sort((a, b) => (b.blueScore + b.whiteScore) - (a.blueScore + a.whiteScore));

  return (
    <div className="glass-panel p-6 flex flex-col h-full">
      {/* Title */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400">
            <Crown className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              학년 및 학급별 종합 랭킹
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              종목 우승 누적 포인트를 합산한 실시간 학년/반 순위입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Grade Podium Top 3 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {sortedGrades.map((gs, idx) => {
          const totalPoints = gs.blueScore + gs.whiteScore;
          const isFirst = idx === 0;

          return (
            <div
              key={gs.grade}
              className={`glass-card p-3.5 flex flex-col items-center text-center relative overflow-hidden transition-transform hover:-translate-y-0.5 ${
                isFirst
                  ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/15 via-transparent to-transparent ring-1 ring-amber-500/30'
                  : ''
              }`}
            >
              {isFirst && (
                <div className="absolute top-1 right-1 text-amber-500 animate-bounce">
                  <Crown className="w-4 h-4" />
                </div>
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm mb-2 shadow-sm ${
                  idx === 0
                    ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                    : idx === 1
                    ? 'bg-slate-300 text-slate-800 ring-2 ring-slate-200'
                    : 'bg-amber-700/60 text-amber-100 ring-2 ring-amber-700'
                }`}
              >
                {idx + 1}위
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {gs.grade}학년
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 my-1">
                {totalPoints.toLocaleString()} pt
              </span>

              {/* Medals */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <span title="금메달" className="flex items-center text-amber-500 font-bold">
                  🥇{gs.goldMedals}
                </span>
                <span title="은메달" className="flex items-center text-slate-400 font-bold">
                  🥈{gs.silverMedals}
                </span>
                <span title="동메달" className="flex items-center text-amber-700 font-bold">
                  🥉{gs.bronzeMedals}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Leaderboard Table */}
      <div className="flex-1">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-1">
          <Medal className="w-4 h-4 text-indigo-500" /> 반별 세부 득점 순위표 (TOP 8)
        </h3>

        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {classRankings.map((cr) => {
            const isBlue = cr.color === 'blue';

            return (
              <div
                key={`${cr.grade}-${cr.classNum}`}
                className="glass-card p-3 flex items-center justify-between text-xs hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                      cr.rank === 1
                        ? 'bg-amber-400 text-amber-950'
                        : cr.rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : cr.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cr.rank}
                  </span>

                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                      <span>{cr.grade}학년 {cr.classNum}반</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          isBlue
                            ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                            : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isBlue ? '청군' : '백군'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      전적: {cr.wins}승 {cr.losses}패
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                    {cr.score} pt
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
