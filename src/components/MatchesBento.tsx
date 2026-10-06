'use client';

import React, { useState } from 'react';
import { Trophy, Clock, MapPin, Plus, CheckCircle2, Award, Flame, Play, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Match, SportCategory } from '../lib/types';
import { SPORT_CATEGORIES } from '../lib/mockData';

interface MatchesBentoProps {
  matches: Match[];
  onScoreUpdate: (matchId: string, team: 'A' | 'B', delta: number) => void;
  onFinishMatch: (matchId: string, winner: 'blue' | 'white') => void;
}

export default function MatchesBento({ matches, onScoreUpdate, onFinishMatch }: MatchesBentoProps) {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'scheduled'>('all');

  const filteredMatches = matches.filter((m) => {
    const sportMatch = selectedSport === 'all' || m.sport === selectedSport;
    const statusMatch = statusFilter === 'all' || m.status === statusFilter;
    return sportMatch && statusMatch;
  });

  const handleFinish = (match: Match, winner: 'blue' | 'white') => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: winner === 'blue' ? ['#3b82f6', '#60a5fa', '#93c5fd'] : ['#f43f5e', '#fb7185', '#fda4af'],
    });
    onFinishMatch(match.id, winner);
  };

  const getSportName = (sportId: string) => {
    return SPORT_CATEGORIES.find((s) => s.id === sportId)?.name || sportId;
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
              실시간 대진표 및 경기 진행 상황
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            각 종목별 실시간 스코어 및 토너먼트 진행 현황을 공유합니다.
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
            const isBlueWinning = match.scoreA > match.scoreB;
            const isWhiteWinning = match.scoreB > match.scoreA;

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
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 my-2">
                  {/* Team A (Blue) */}
                  <div className="flex-1 flex flex-col items-start">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate max-w-[110px]">
                        {match.teamA.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold ml-4">
                      {match.teamA.grade}학년 청군
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 px-3">
                    <span
                      className={`text-2xl font-black ${
                        isBlueWinning
                          ? 'text-blue-600 dark:text-blue-400 font-black'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {match.scoreA}
                    </span>
                    <span className="text-slate-400 font-bold">:</span>
                    <span
                      className={`text-2xl font-black ${
                        isWhiteWinning
                          ? 'text-rose-600 dark:text-rose-400 font-black'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {match.scoreB}
                    </span>
                  </div>

                  {/* Team B (White) */}
                  <div className="flex-1 flex flex-col items-end">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate max-w-[110px] text-right">
                        {match.teamB.name}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    </div>
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mr-4">
                      {match.teamB.grade}학년 백군
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

                {/* Teacher / Admin Controls (점수 득점 & 우승 판정) */}
                {match.status === 'in_progress' && (
                  <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span>실시간 득점 조작</span>
                      <span className="text-[10px] text-slate-400">교사 / 기록원 전용</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onScoreUpdate(match.id, 'A', 1)}
                        className="py-1.5 px-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> 청군 +1점
                      </button>
                      <button
                        onClick={() => onScoreUpdate(match.id, 'B', 1)}
                        className="py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> 백군 +1점
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleFinish(match, 'blue')}
                        className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                      >
                        🏆 청군 우승 확정 (+{match.pointsForWinner}pt)
                      </button>
                      <button
                        onClick={() => handleFinish(match, 'white')}
                        className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors"
                      >
                        🏆 백군 우승 확정 (+{match.pointsForWinner}pt)
                      </button>
                    </div>
                  </div>
                )}

                {/* Completed winner announcement */}
                {match.status === 'completed' && match.winner && (
                  <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center gap-1.5 text-xs font-bold">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span className={match.winner === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}>
                      {match.winner === 'blue' ? match.teamA.name : match.teamB.name} 우승! (+{match.pointsForWinner}pt 획득)
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
