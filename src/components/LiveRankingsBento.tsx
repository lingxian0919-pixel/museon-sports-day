'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Plus, Sparkles } from 'lucide-react';
import { RankingItem } from '../lib/types';
import { getRankings, addRankingScore, isSupabaseConfigured } from '../lib/supabase';

export default function LiveRankingsBento() {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [score, setScore] = useState<number>(50);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      const data = await getRankings();
      setRankings(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !score) return;

    const updated = await addRankingScore(nickname.trim(), Number(score));
    setRankings(updated);
    setNickname('');
    setShowAddModal(false);
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500 dark:text-violet-400">
            <Zap className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              체육대회 명예의 전당 점수 랭킹
              {isSupabaseConfigured && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                  DB 연동
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              학급 및 개인 챌린지 최고 득점자 랭킹 (Supabase rankings)
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" /> 득점 기록
        </button>
      </div>

      {/* Add score form modal inline */}
      {showAddModal && (
        <form onSubmit={handleAddScore} className="glass-card p-3 mb-3 space-y-2 border-indigo-500/30">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            새로운 점수 기록 등록
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="학급명 / 선수 (예: 2학년 3반)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="glass-input px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="추가 포인트 (예: 50)"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              required
              min={1}
              className="glass-input px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              저장하기
            </button>
          </div>
        </form>
      )}

      {/* Rankings List */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[360px] pr-1">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">랭킹 불러오는 중...</div>
        ) : rankings.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">등록된 랭킹 기록이 없습니다.</div>
        ) : (
          rankings.map((item, index) => {
            const isTop3 = index < 3;
            return (
              <div
                key={item.id}
                className="glass-card p-3 flex items-center justify-between text-xs hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                      index === 0
                        ? 'bg-amber-400 text-amber-950 font-black ring-1 ring-amber-300'
                        : index === 1
                        ? 'bg-slate-300 text-slate-900 font-bold'
                        : index === 2
                        ? 'bg-amber-700 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {item.nickname}
                      {isTop3 && <Sparkles className="w-3 h-3 text-amber-500" />}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      최근 업데이트: {new Date(item.played_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">
                    {item.score.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-0.5">점</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
