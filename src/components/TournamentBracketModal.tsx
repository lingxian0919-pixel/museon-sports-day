'use client';

import React from 'react';
import { X, Trophy, Swords } from 'lucide-react';
import { Match } from '../lib/types';

interface TournamentBracketModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
}

export default function TournamentBracketModal({ isOpen, onClose, matches }: TournamentBracketModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl glass-card hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Swords className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              18개 학급 토너먼트 대진표 & 진행 트리
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              1학년(1~5반), 2학년(1~7반), 3학년(1~6반) 본선 및 결승 토너먼트
            </p>
          </div>
        </div>

        {/* Tournament Tree Structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* 4강 / 준결승 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-center px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              4강 (준결승전)
            </h3>
            {matches.filter(m => m.round === '4강').map(match => (
              <div key={match.id} className="glass-card p-3 space-y-1.5 border-slate-300 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-400">{match.court}</span>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{match.teamA.name}</span>
                  <span>{match.scoreA}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{match.teamB.name}</span>
                  <span>{match.scoreB}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 결승전 */}
          <div className="flex flex-col gap-4 justify-center">
            <h3 className="text-xs font-bold text-center px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> 결승전 (FINAL)
            </h3>
            {matches.filter(m => m.round === '결승').slice(0, 2).map(match => (
              <div key={match.id} className="glass-card p-4 space-y-2 border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20">
                <div className="flex justify-between text-[11px] font-bold text-amber-500">
                  <span>{match.sport} 챔피언십</span>
                  <span>+{match.pointsForWinner}pt</span>
                </div>
                <div className="flex justify-between text-sm font-black">
                  <span className="text-indigo-600 dark:text-indigo-400">{match.teamA.name}</span>
                  <span className="text-lg">{match.scoreA}</span>
                </div>
                <div className="flex justify-between text-sm font-black">
                  <span className="text-purple-600 dark:text-purple-400">{match.teamB.name}</span>
                  <span className="text-lg">{match.scoreB}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 종합 시상 및 우승 */}
          <div className="flex flex-col gap-4 justify-center items-center text-center p-6 glass-card bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/20">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 animate-bounce">
              <Trophy className="w-8 h-8" />
            </div>
            <h4 className="font-black text-slate-900 dark:text-white text-base">
              종합 우승 학급 트로피
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              총 18개 반 중 가장 높은 누적 포인트를 획득한 학급이 2026 체육대회 종합 우승을 차지합니다!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
