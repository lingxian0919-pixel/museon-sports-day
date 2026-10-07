'use client';

import React, { useState } from 'react';
import { X, Trophy, Swords, CheckCircle2 } from 'lucide-react';
import { Match } from '../lib/types';
import { SPORT_CATEGORIES } from '../lib/mockData';

interface TournamentBracketModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
}

export default function TournamentBracketModal({ isOpen, onClose, matches }: TournamentBracketModalProps) {
  const [selectedSport, setSelectedSport] = useState<string>('soccer');
  const [selectedGrade, setSelectedGrade] = useState<number>(1);

  if (!isOpen) return null;

  const getSportName = (sportId: string) => {
    return SPORT_CATEGORIES.find(s => s.id === sportId)?.name || sportId;
  };

  const currentMatches = matches.filter(
    (m) => m.sport === selectedSport && m.grade === selectedGrade
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl glass-card hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Swords className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              18개 학급 토너먼트 대진표 & 진행 현황
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              1학년(5팀), 2학년(7팀), 3학년(6팀) 종목별 토너먼트 대진 트리
            </p>
          </div>
        </div>

        {/* Sport selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
          {SPORT_CATEGORIES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSport(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                selectedSport === s.id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Grade tabs */}
        <div className="flex items-center gap-2 mb-5">
          {[1, 2, 3].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedGrade === g
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/40'
              }`}
            >
              {g}학년 대진표
            </button>
          ))}
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentMatches.map((match) => {
            const isTeamAWinner = match.winnerTeam === 'teamA';
            const isTeamBWinner = match.winnerTeam === 'teamB';

            return (
              <div
                key={match.id}
                className="glass-card p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {match.bracketLabel || match.round}
                  </span>
                  <span>{match.court}</span>
                </div>

                <div
                  className={`p-2 rounded-lg flex items-center justify-between text-xs transition-all ${
                    isTeamAWinner
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black border border-emerald-500/30'
                      : isTeamBWinner
                      ? 'opacity-40 text-slate-400'
                      : 'bg-slate-100/70 dark:bg-slate-800/60 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {isTeamAWinner && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{match.teamA.name}</span>
                  </div>
                  <span className="font-black px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                    {match.scoreA}
                  </span>
                </div>

                <div
                  className={`p-2 rounded-lg flex items-center justify-between text-xs transition-all ${
                    isTeamBWinner
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black border border-emerald-500/30'
                      : isTeamAWinner
                      ? 'opacity-40 text-slate-400'
                      : 'bg-slate-100/70 dark:bg-slate-800/60 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {isTeamBWinner && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{match.teamB.name}</span>
                  </div>
                  <span className="font-black px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                    {match.scoreB}
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

