'use client';

import React, { useState } from 'react';
import { Trophy, Clock, MapPin, Plus, CheckCircle2, Award, Swords, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Match, SportCategory } from '../lib/types';
import { SPORT_CATEGORIES } from '../lib/mockData';

interface MatchesBentoProps {
  matches: Match[];
  onScoreUpdate: (matchId: string, team: 'A' | 'B', delta: number) => void;
  onFinishMatch: (matchId: string, winner: 'teamA' | 'teamB') => void;
}

export default function MatchesBento({ matches, onScoreUpdate, onFinishMatch }: MatchesBentoProps) {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'scheduled'>('all');

  const filteredMatches = matches.filter((m) => {
    const sportMatch = selectedSport === 'all' || m.sport === selectedSport;
    const statusMatch = statusFilter === 'all' || m.status === statusFilter;
    return sportMatch && statusMatch;
  });

  const handleFinish = (match: Match, winner: 'teamA' | 'teamB') => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
    });
    onFinishMatch(match.id, winner);
  };

  const getSportName = (sportId: string) => {
    return SPORT_CATEGORIES.find((s) => s.id === sportId)?.name || sportId;
  };

  const getGradeBadge = (grade: number) => {
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
      {/* Header and Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              실시간 18팀 종목별 대진표 & 경기 현황
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            1학년(1~5반), 2학년(1~7반), 3학년(1~6반) 총 18개 팀의 실시간 경기 현황입니다.
          </p>
        </div>

        {/* Status filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-200/50 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-semibold">
          {(['all', 'in_progress', 'scheduled', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === st
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st === 'all' && '전체 보기'}
              {st === 'in_progress' && '🔴 진행중'}
              {st === 'scheduled' && '⏳ 예정'}
              {st === 'completed' && '✅ 종료'}
            </button>
          ))}
        </div>
      </div>

      {/* Sport Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 text-xs font-medium no-scrollbar">
        <button
          onClick={() => setSelectedSport('all')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
            selectedSport === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
              : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
        >
          전체 종목 ({matches.length})
        </button>
        {SPORT_CATEGORIES.map((cat) => {
          const count = matches.filter((m) => m.sport === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedSport(cat.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedSport === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{cat.name}</span>
              <span className="opacity-75 text-[10px] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {filteredMatches.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm">
            해당 조건의 경기가 없습니다.
          </div>
        ) : (
          filteredMatches.map((match) => {
            const isAWinning = match.scoreA > match.scoreB;
            const isBWinning = match.scoreB > match.scoreA;

            return (
              <div
                key={match.id}
                className={`glass-card p-4 flex flex-col justify-between transition-all hover:border-indigo-500/40 ${
                  match.status === 'in_progress'
                    ? 'ring-1 ring-emerald-500/30 border-emerald-500/30'
                    : ''
                }`}
              >
                {/* Match top info */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      {getSportName(match.sport)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                      {match.round}
                    </span>
                    <span className="text-amber-500 font-bold flex items-center gap-0.5">
                      <Award className="w-3.5 h-3.5" /> +{match.pointsForWinner}pt
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {match.status === 'in_progress' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 진행중
                      </span>
                    )}
                    {match.status === 'scheduled' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-medium">
                        대기중
                      </span>
                    )}
                    {match.status === 'completed' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> 경기 종료
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Teams & Scoreboard */}
                <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 my-2">
                  {/* Team A */}
                  <div className="flex-1 flex flex-col items-start">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm text-slate-900 dark:text-slate-100">
                        {match.teamA.name}
                      </span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold mt-1 ${getGradeBadge(match.teamA.grade)}`}>
                      {match.teamA.grade}학년 {match.teamA.classNum}반
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 px-3">
                    <span
                      className={`text-2xl font-black ${
                        isAWinning
                          ? 'text-indigo-600 dark:text-indigo-400 font-black'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {match.scoreA}
                    </span>
                    <span className="text-slate-400 font-bold">:</span>
                    <span
                      className={`text-2xl font-black ${
                        isBWinning
                          ? 'text-indigo-600 dark:text-indigo-400 font-black'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {match.scoreB}
                    </span>
                  </div>

                  {/* Team B */}
                  <div className="flex-1 flex flex-col items-end">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm text-slate-900 dark:text-slate-100 text-right">
                        {match.teamB.name}
                      </span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold mt-1 ${getGradeBadge(match.teamB.grade)}`}>
                      {match.teamB.grade}학년 {match.teamB.classNum}반
                    </span>
                  </div>
                </div>

                {/* Location and Schedule */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 px-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {match.court}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {match.time}
                  </span>
                </div>

                {/* Teacher / Admin Controls (실시간 득점 & 우승 판정) */}
                {match.status === 'in_progress' && (
                  <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span>실시간 득점 조작</span>
                      <span className="text-[10px] text-slate-400">교사 / 기록원 전용</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onScoreUpdate(match.id, 'A', 1)}
                        className="py-1.5 px-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center gap-1 transition-colors truncate"
                      >
                        <Plus className="w-3.5 h-3.5 shrink-0" /> {match.teamA.name} +1점
                      </button>
                      <button
                        onClick={() => onScoreUpdate(match.id, 'B', 1)}
                        className="py-1.5 px-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center gap-1 transition-colors truncate"
                      >
                        <Plus className="w-3.5 h-3.5 shrink-0" /> {match.teamB.name} +1점
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleFinish(match, 'teamA')}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors truncate"
                      >
                        🏆 {match.teamA.name} 우승 (+{match.pointsForWinner}pt)
                      </button>
                      <button
                        onClick={() => handleFinish(match, 'teamB')}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-colors truncate"
                      >
                        🏆 {match.teamB.name} 우승 (+{match.pointsForWinner}pt)
                      </button>
                    </div>
                  </div>
                )}

                {/* Completed winner announcement */}
                {match.status === 'completed' && match.winnerTeam && (
                  <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center gap-1.5 text-xs font-bold text-amber-500">
                    <Trophy className="w-4 h-4" />
                    <span>
                      {match.winnerTeam === 'teamA' ? match.teamA.name : match.teamB.name} 우승! (+{match.pointsForWinner}pt 획득)
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
