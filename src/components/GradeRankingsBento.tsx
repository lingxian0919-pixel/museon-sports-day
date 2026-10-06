'use client';

import React, { useState } from 'react';
import { Medal, Trophy, Crown, Users } from 'lucide-react';
import { ClassRanking, GradeScore } from '../lib/types';

interface GradeRankingsBentoProps {
  gradeScores: GradeScore[];
  classRankings: ClassRanking[];
}

export default function GradeRankingsBento({ gradeScores, classRankings }: GradeRankingsBentoProps) {
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');

  const filteredRankings = selectedGrade === 'all'
    ? classRankings
    : classRankings.filter((cr) => cr.grade === selectedGrade);

  const getGradeTheme = (grade: number) => {
    switch (grade) {
      case 1:
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 2:
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 3:
      default:
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20';
    }
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400">
            <Crown className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              18개 학급 상세 순위표
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              1학년(5반), 2학년(7반), 3학년(6반) 전체 누적 순위
            </p>
          </div>
        </div>
      </div>

      {/* Grade Filter Buttons */}
      <div className="flex items-center gap-1 bg-slate-200/50 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-semibold mb-3">
        <button
          onClick={() => setSelectedGrade('all')}
          className={`flex-1 py-1 rounded-lg transition-all ${
            selectedGrade === 'all'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          전체 (18)
        </button>
        <button
          onClick={() => setSelectedGrade(1)}
          className={`flex-1 py-1 rounded-lg transition-all ${
            selectedGrade === 1
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          1학년 (5)
        </button>
        <button
          onClick={() => setSelectedGrade(2)}
          className={`flex-1 py-1 rounded-lg transition-all ${
            selectedGrade === 2
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          2학년 (7)
        </button>
        <button
          onClick={() => setSelectedGrade(3)}
          className={`flex-1 py-1 rounded-lg transition-all ${
            selectedGrade === 3
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          3학년 (6)
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[460px] pr-1">
        {filteredRankings.map((cr) => {
          return (
            <div
              key={`${cr.grade}-${cr.classNum}`}
              className={`glass-card p-3 flex items-center justify-between text-xs hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors ${
                cr.rank === 1 ? 'border-amber-500/40 bg-amber-500/5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    cr.rank === 1
                      ? 'bg-amber-400 text-amber-950 font-black ring-1 ring-amber-300'
                      : cr.rank === 2
                      ? 'bg-slate-300 text-slate-800 font-bold'
                      : cr.rank === 3
                      ? 'bg-amber-700 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cr.rank}
                </span>

                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                    <span>{cr.grade}학년 {cr.classNum}반</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${getGradeTheme(cr.grade)}`}>
                      {cr.grade}학년
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    전적: {cr.wins}승 {cr.losses}패
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                  {cr.score.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 ml-0.5">pt</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
