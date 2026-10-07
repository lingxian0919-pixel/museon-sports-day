'use client';

import React from 'react';
import { X, Award, Medal, Trophy, CheckCircle2 } from 'lucide-react';
import { SPORT_RANK_POINTS_TABLE, SPORT_CATEGORIES, isTournamentSport } from '../lib/mockData';

interface ScoreRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScoreRulesModal({ isOpen, onClose }: ScoreRulesModalProps) {
  if (!isOpen) return null;

  const scoreRows = [
    { no: 1, id: 'three_legged', name: '2인 3각' },
    { no: 2, id: 'soccer', name: '축구' },
    { no: 3, id: 'dodgeball', name: '피구' },
    { no: 4, id: 'futsal', name: '풋살' },
    { no: 5, id: 'jump_rope', name: '단체줄넘기(8자마라톤)' },
    { no: 6, id: 'tug_of_war', name: '줄다리기' },
    { no: 7, id: 'relay', name: '이어달리기' },
    { no: 8, id: 'ox_quiz', name: 'O.X 퀴즈' },
    { no: 9, id: 'bottle_flip', name: '물병던지기' },
    { no: 10, id: 'jegichagi', name: '제기차기' },
    { no: 11, id: 'disc_golf', name: '디스크 골프' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-4xl p-5 sm:p-6 relative max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200/80 dark:border-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl glass-card hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          title="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Trophy className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              체육대회 종목별 공식 배점표
              <span className="text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                11개 전 종목 기준
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              순위(1등~7등)에 따라 학급 종합 점수에 자동 합산되는 공식 배점표입니다.
            </p>
          </div>
        </div>

        {/* Official Score Table */}
        <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200/80 dark:border-slate-700/80">
                  <th className="py-2.5 px-3 w-14">번호</th>
                  <th className="py-2.5 px-4 text-left w-48">종 목</th>
                  <th className="py-2.5 px-3 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-black">
                    1등 🥇
                  </th>
                  <th className="py-2.5 px-3 bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-bold">
                    2등 🥈
                  </th>
                  <th className="py-2.5 px-3 bg-orange-500/10 text-orange-700 dark:text-orange-300 font-bold">
                    3등 🥉
                  </th>
                  <th className="py-2.5 px-3">4등</th>
                  <th className="py-2.5 px-3">5등</th>
                  <th className="py-2.5 px-3">6등</th>
                  <th className="py-2.5 px-3">7등</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 font-medium">
                {scoreRows.map((item) => {
                  const pts = SPORT_RANK_POINTS_TABLE[item.id] || [0, 0, 0, 0, 0, 0, 0];
                  const isTourney = isTournamentSport(item.id);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-slate-400 font-bold">{item.no}</td>
                      <td className="py-2.5 px-4 text-left font-black text-slate-900 dark:text-slate-100 flex items-center justify-between">
                        <span>{item.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                            isTourney
                              ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {isTourney ? '토너먼트' : '순위제'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-black text-amber-600 dark:text-amber-400 bg-amber-500/5">
                        {pts[0]}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-200 bg-slate-200/20 dark:bg-slate-700/20">
                        {pts[1]}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-orange-600 dark:text-orange-400 bg-orange-500/5">
                        {pts[2]}
                      </td>
                      <td className={`py-2.5 px-3 ${pts[3] === 0 ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        {pts[3]}
                      </td>
                      <td className={`py-2.5 px-3 ${pts[4] === 0 ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        {pts[4]}
                      </td>
                      <td className={`py-2.5 px-3 ${pts[5] === 0 ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        {pts[5]}
                      </td>
                      <td className={`py-2.5 px-3 ${pts[6] === 0 ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        {pts[6]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="glass-card p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>배점 적용 안내</span>
          </div>
          <p className="pl-5 text-[11px]">
            • <strong>1학년 (5개반)</strong>: 1등~5등 점수가 학급에 부여됩니다.
          </p>
          <p className="pl-5 text-[11px]">
            • <strong>2학년 (7개반)</strong>: 1등~7등 점수가 학급에 부여됩니다.
          </p>
          <p className="pl-5 text-[11px]">
            • <strong>3학년 (6개반)</strong>: 1등~6등 점수가 학급에 부여됩니다.
          </p>
          <p className="pl-5 text-[11px]">
            • <strong>O.X 퀴즈, 물병던지기, 제기차기, 디스크 골프</strong>는 1등(50pt), 2등(40pt), 3등(30pt)만 배점되며 4등 이하는 0pt입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
