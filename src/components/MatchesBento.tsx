'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Clock,
  MapPin,
  Plus,
  Minus,
  CheckCircle2,
  Award,
  ShieldAlert,
  Eye,
  RotateCcw,
  Sparkles,
  GitBranch,
  ListOrdered,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Match } from '../lib/types';
import { SPORT_CATEGORIES } from '../lib/mockData';

interface MatchesBentoProps {
  matches: Match[];
  isScorerMode?: boolean;
  onScoreUpdate?: (matchId: string, team: 'A' | 'B', delta: number) => void;
  onFinishMatch?: (matchId: string, winner: 'teamA' | 'teamB') => void;
  onCancelWinner?: (matchId: string) => void;
}

export default function MatchesBento({
  matches,
  isScorerMode = false,
  onScoreUpdate,
  onFinishMatch,
  onCancelWinner,
}: MatchesBentoProps) {
  // 기본 선택 종목: 축구 (1학년 첫 대진표 지정 종목)
  const [selectedSport, setSelectedSport] = useState<string>('soccer');
  // 학년 탭 (1학년, 2학년, 3학년)
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  // 보기 모드: 트리 뷰 vs 목록 뷰
  const [viewMode, setViewMode] = useState<'bracket' | 'list'>('bracket');

  const handleFinish = (match: Match, winner: 'teamA' | 'teamB') => {
    confetti({
      particleCount: 130,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
    });
    if (onFinishMatch) {
      onFinishMatch(match.id, winner);
    }
  };

  const getSportName = (sportId: string) => {
    return SPORT_CATEGORIES.find((s) => s.id === sportId)?.name || sportId;
  };

  const getSportCategoryBadge = (sportId: string) => {
    if (sportId === 'soccer') return '축구 (남)';
    if (sportId === 'futsal') return '풋살 (여)';
    if (sportId === 'dodgeball') return '피구 (혼성)';
    if (sportId === 'tug_of_war') return '줄다리기 (혼성)';
    return SPORT_CATEGORIES.find((s) => s.id === sportId)?.name || sportId;
  };

  // 현재 선택된 종목 & 학년의 경기 목록
  const gradeMatches = matches.filter(
    (m) => m.sport === selectedSport && m.grade === selectedGrade
  );

  // 결승전 및 최종 챔피언 확인
  const finalMatch = gradeMatches.find((m) => m.round === '결승');
  const championTeam =
    finalMatch?.status === 'completed' && finalMatch?.winnerTeam
      ? finalMatch.winnerTeam === 'teamA'
        ? finalMatch.teamA
        : finalMatch.teamB
      : null;

  return (
    <div className="glass-panel p-6 flex flex-col h-full shadow-lg border border-slate-200/80 dark:border-slate-800">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
              <Trophy className="w-5 h-5" />
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                실시간 18팀 종목별 대진표 & 경기 현황
              </h2>
              {isScorerMode ? (
                <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> 기록원 입력 모드
                </span>
              ) : (
                <span className="text-[10px] bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold px-2.5 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> 학생 조회 전용
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            종목 및 학년을 선택하면 토너먼트 대진표가 표시됩니다.{' '}
            {isScorerMode
              ? '반 이름 오른쪽에서 실시간 점수 입력 및 우승 승리를 결정할 수 있습니다.'
              : '경기가 종료된 팀은 색상이 하이라이트됩니다.'}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('bracket')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'bracket'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" /> 토너먼트 대진표 트리
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" /> 경기 카드 목록
          </button>
        </div>
      </div>

      {/* 2. 11개 종목 선택 탭 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 text-xs font-medium no-scrollbar border-b border-slate-200/50 dark:border-slate-800/80">
        {SPORT_CATEGORIES.map((cat) => {
          const isSelected = selectedSport === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedSport(cat.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/40'
                  : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. 학년 선택 탭 (1학년, 2학년, 3학년) */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6 bg-slate-100/70 dark:bg-slate-900/40 p-2 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <span className="text-slate-500 dark:text-slate-400 mr-1 pl-1">학년별 대진표:</span>
          {[
            { grade: 1, name: '1학년', desc: '5개 학급' },
            { grade: 2, name: '2학년', desc: '7개 학급' },
            { grade: 3, name: '3학년', desc: '6개 학급' },
          ].map((item) => {
            const isSelected = selectedGrade === item.grade;
            return (
              <button
                key={item.grade}
                onClick={() => setSelectedGrade(item.grade)}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-black shadow-sm ring-1 ring-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
                }`}
              >
                <span>{item.name} 대진표</span>
                <span className="text-[10px] opacity-75 font-normal">({item.desc})</span>
              </button>
            );
          })}
        </div>

        {/* Selected sport information banner */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <span>{getSportCategoryBadge(selectedSport)}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>{selectedGrade}학년 토너먼트</span>
          {selectedGrade === 1 && (
            <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">
              (5팀 토너먼트)
            </span>
          )}
        </div>
      </div>

      {/* 4. 대진표 콘텐츠 렌더링 */}
      {viewMode === 'bracket' ? (
        <div className="overflow-x-auto pb-4 no-scrollbar">
          {selectedGrade === 1 && (
            <Grade1TournamentTree
              matches={gradeMatches}
              sportName={getSportName(selectedSport)}
              championTeam={championTeam}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={handleFinish}
              onCancel={onCancelWinner}
            />
          )}

          {selectedGrade === 2 && (
            <Grade2TournamentTree
              matches={gradeMatches}
              sportName={getSportName(selectedSport)}
              championTeam={championTeam}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={handleFinish}
              onCancel={onCancelWinner}
            />
          )}

          {selectedGrade === 3 && (
            <Grade3TournamentTree
              matches={gradeMatches}
              sportName={getSportName(selectedSport)}
              championTeam={championTeam}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={handleFinish}
              onCancel={onCancelWinner}
            />
          )}
        </div>
      ) : (
        /* 목록형 뷰 */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gradeMatches.map((m) => (
            <BracketMatchCard
              key={m.id}
              match={m}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={handleFinish}
              onCancel={onCancelWinner}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1학년 토너먼트 트리 컴포넌트 (4개 경기: ① 예선 -> ②, ③ 4강 -> ④ 결승 -> 챔피언)
// ---------------------------------------------------------------------------
function Grade1TournamentTree({
  matches,
  sportName,
  championTeam,
  isScorerMode,
  onScoreUpdate,
  onFinish,
  onCancel,
}: {
  matches: Match[];
  sportName: string;
  championTeam: Match['teamA'] | null;
  isScorerMode: boolean;
  onScoreUpdate?: (matchId: string, team: 'A' | 'B', delta: number) => void;
  onFinish: (match: Match, winner: 'teamA' | 'teamB') => void;
  onCancel?: (matchId: string) => void;
}) {
  const m1 = matches.find((m) => m.matchNumber === 1);
  const m2 = matches.find((m) => m.matchNumber === 2);
  const m3 = matches.find((m) => m.matchNumber === 3);
  const m4 = matches.find((m) => m.matchNumber === 4);

  return (
    <div className="min-w-[900px] flex items-stretch gap-6 py-2">
      {/* 1단계: 예선 (Match ①) */}
      <div className="flex-1 flex flex-col justify-end gap-3">
        <div className="text-center pb-2">
          <span className="text-xs font-black px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            1단계: 예선
          </span>
          <p className="text-[11px] text-slate-400 mt-1">① 예선전 승자 4강 진출</p>
        </div>
        <div className="flex-1 flex flex-col justify-end pb-8">
          {m1 && (
            <div className="relative">
              <BracketMatchCard
                match={m1}
                isScorerMode={isScorerMode}
                onScoreUpdate={onScoreUpdate}
                onFinish={onFinish}
                onCancel={onCancel}
              />
              {/* Connector line to Match ③ */}
              <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-indigo-500/30" />
            </div>
          )}
        </div>
      </div>

      {/* 2단계: 4강 준결승 (Match ② & Match ③) */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div className="text-center pb-2">
          <span className="text-xs font-black px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            2단계: 4강 (준결승전)
          </span>
          <p className="text-[11px] text-slate-400 mt-1">승자 2팀 결승전 진출</p>
        </div>

        {/* 4강 1경기 (Match ②) */}
        <div className="relative">
          {m2 && (
            <BracketMatchCard
              match={m2}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={onFinish}
              onCancel={onCancel}
            />
          )}
          <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-indigo-500/30" />
        </div>

        {/* 4강 2경기 (Match ③) */}
        <div className="relative">
          {m3 && (
            <BracketMatchCard
              match={m3}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={onFinish}
              onCancel={onCancel}
            />
          )}
          <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-indigo-500/30" />
        </div>
      </div>

      {/* 3단계: 결승전 (Match ④) */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="text-center pb-2">
          <span className="text-xs font-black px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> 3단계: 결승전 (FINAL)
          </span>
          <p className="text-[11px] text-slate-400 mt-1">1학년 최종 챔피언 결정전</p>
        </div>
        <div className="flex-1 flex flex-col justify-center relative">
          {m4 && (
            <BracketMatchCard
              match={m4}
              isFinal={true}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={onFinish}
              onCancel={onCancel}
            />
          )}
          <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-amber-500/40" />
        </div>
      </div>

      {/* 4단계: 1학년 최종 우승 학급 카드 */}
      <div className="w-64 flex flex-col justify-center">
        <div className="text-center pb-2">
          <span className="text-xs font-black px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            🏆 1학년 챔피언
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <ChampionCard
            championTeam={championTeam}
            grade={1}
            sportName={sportName}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2학년 토너먼트 트리 컴포넌트 (사용자 도면 media_1791380819346.png 반영)
// ⓒ, ⓑ, ⓐ -> ⓔ, ⓓ -> ⓕ (결승)
// ---------------------------------------------------------------------------
function Grade2TournamentTree({
  matches,
  sportName,
  championTeam,
  isScorerMode,
  onScoreUpdate,
  onFinish,
  onCancel,
}: {
  matches: Match[];
  sportName: string;
  championTeam: Match['teamA'] | null;
  isScorerMode: boolean;
  onScoreUpdate?: (matchId: string, team: 'A' | 'B', delta: number) => void;
  onFinish: (match: Match, winner: 'teamA' | 'teamB') => void;
  onCancel?: (matchId: string) => void;
}) {
  const mc = matches.find((m) => m.matchLetter === 'c' || m.matchNumber === 1);
  const mb = matches.find((m) => m.matchLetter === 'b' || m.matchNumber === 2);
  const ma = matches.find((m) => m.matchLetter === 'a' || m.matchNumber === 3);
  const me = matches.find((m) => m.matchLetter === 'e' || m.matchNumber === 4);
  const md = matches.find((m) => m.matchLetter === 'd' || m.matchNumber === 5);
  const mf = matches.find((m) => m.matchLetter === 'f' || m.matchNumber === 6);

  return (
    <div className="min-w-[1000px] flex items-stretch gap-6 py-2">
      {/* 1단계: 8강 (ⓒ, ⓑ, ⓐ) */}
      <div className="flex-1 flex flex-col justify-between gap-3">
        <div className="text-center pb-2">
          <span className="text-xs font-black px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            1단계: 8강
          </span>
          <p className="text-[11px] text-slate-400 mt-1">ⓒ, ⓑ, ⓐ 승자 4강 진출</p>
        </div>
        {mc && (
          <div className="relative">
            <BracketMatchCard
              match={mc}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={onFinish}
              onCancel={onCancel}
            />
            <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-indigo-500/30" />
          </div>
        )}
        {mb && (
          <div className="relative">
            <BracketMatchCard
              match={mb}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={onFinish}
              onCancel={onCancel}
            />
            <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-indigo-500/30" />
          </div>
        )}
        {ma && (
          <div className="relative">
            <BracketMatchCard
              match={ma}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={onFinish}
              onCancel={onCancel}
            />
            <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-indigo-500/30" />
          </div>
        )}
      </div>

      {/* 2단계: 4강 준결승 (ⓔ: ⓒ승자 vs ⓑ승자, ⓓ: ⓐ승자 vs 부전승) */}
      <div className="flex-1 flex flex-col justify-around gap-4">
        <div className="text-center pb-2">
          <span className="text-xs font-black px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            2단계: 4강 준결승
          </span>
          <p className="text-[11px] text-slate-400 mt-1">ⓔ & ⓓ 승자 결승 진출</p>
        </div>
        {me && (
          <div className="relative">
            <BracketMatchCard
              match={me}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={onFinish}
              onCancel={onCancel}
            />
            <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-indigo-500/30" />
          </div>
        )}
        {md && (
          <div className="relative">
            <BracketMatchCard
              match={md}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={onFinish}
              onCancel={onCancel}
            />
            <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-indigo-500/30" />
          </div>
        )}
      </div>

      {/* 3단계: 결승전 (ⓕ: ⓔ승자 vs ⓓ승자) */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="text-center pb-2">
          <span className="text-xs font-black px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> 3단계: 결승전 (FINAL)
          </span>
          <p className="text-[11px] text-slate-400 mt-1">2학년 최종 챔피언 결정전</p>
        </div>
        <div className="flex-1 flex flex-col justify-center relative">
          {mf && (
            <BracketMatchCard
              match={mf}
              isFinal={true}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={onFinish}
              onCancel={onCancel}
            />
          )}
          <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-amber-500/40" />
        </div>
      </div>

      {/* 4단계: 2학년 최종 우승 학급 카드 */}
      <div className="w-64 flex flex-col justify-center">
        <div className="text-center pb-2">
          <span className="text-xs font-black px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            🏆 2학년 챔피언
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <ChampionCard
            championTeam={championTeam}
            grade={2}
            sportName={sportName}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3학년 토너먼트 트리 컴포넌트 (사용자 도면 media_1791381767024.png 반영)
// ㉡, ㉠ -> ㉣ & ㉢ -> ㉤ (결승전)
// ---------------------------------------------------------------------------
function Grade3TournamentTree({
  matches,
  sportName,
  championTeam,
  isScorerMode,
  onScoreUpdate,
  onFinish,
  onCancel,
}: {
  matches: Match[];
  sportName: string;
  championTeam: Match['teamA'] | null;
  isScorerMode: boolean;
  onScoreUpdate?: (matchId: string, team: 'A' | 'B', delta: number) => void;
  onFinish: (match: Match, winner: 'teamA' | 'teamB') => void;
  onCancel?: (matchId: string) => void;
}) {
  const mb = matches.find((m) => m.matchLetter === 'ㄴ' || m.matchNumber === 1);
  const ma = matches.find((m) => m.matchLetter === 'ㄱ' || m.matchNumber === 2);
  const mc = matches.find((m) => m.matchLetter === 'ㄷ' || m.matchNumber === 3);
  const md = matches.find((m) => m.matchLetter === 'ㄹ' || m.matchNumber === 4);
  const me = matches.find((m) => m.matchLetter === 'ㅁ' || m.matchNumber === 5);

  return (
    <div className="min-w-[1000px] flex items-stretch gap-6 py-2">
      {/* 1단계: 8강 (㉡, ㉠ 경기) */}
      <div className="flex-1 flex flex-col justify-end gap-3">
        <div className="text-center pb-2">
          <span className="text-xs font-black px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            1단계: 8강
          </span>
          <p className="text-[11px] text-slate-400 mt-1">㉡, ㉠ 승자 4강(㉣) 진출</p>
        </div>
        <div className="flex-1 flex flex-col justify-end gap-3 pb-2">
          {mb && (
            <div className="relative">
              <BracketMatchCard
                match={mb}
                isScorerMode={isScorerMode}
                onScoreUpdate={onScoreUpdate}
                onFinish={onFinish}
                onCancel={onCancel}
              />
              <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-indigo-500/30" />
            </div>
          )}
          {ma && (
            <div className="relative">
              <BracketMatchCard
                match={ma}
                isScorerMode={isScorerMode}
                onScoreUpdate={onScoreUpdate}
                onFinish={onFinish}
                onCancel={onCancel}
              />
              <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-indigo-500/30" />
            </div>
          )}
        </div>
      </div>

      {/* 2단계: 4강 준결승 (㉢ 4강 1경기 & ㉣ 4강 2경기) */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div className="text-center pb-2">
          <span className="text-xs font-black px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            2단계: 4강 준결승
          </span>
          <p className="text-[11px] text-slate-400 mt-1">㉢ & ㉣ 승자 결승(㉤) 진출</p>
        </div>

        {/* ㉢ 4강 1경기 (좌측 준결승) */}
        <div className="relative">
          {mc && (
            <BracketMatchCard
              match={mc}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={onFinish}
              onCancel={onCancel}
            />
          )}
          <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-indigo-500/30" />
        </div>

        {/* ㉣ 4강 2경기 (㉡ 승자 vs ㉠ 승자) */}
        <div className="relative">
          {md && (
            <BracketMatchCard
              match={md}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={onFinish}
              onCancel={onCancel}
            />
          )}
          <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-indigo-500/30" />
        </div>
      </div>

      {/* 3단계: 결승전 (㉤: ㉢ 승자 vs ㉣ 승자) */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="text-center pb-2">
          <span className="text-xs font-black px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> 3단계: 결승전 (FINAL)
          </span>
          <p className="text-[11px] text-slate-400 mt-1">3학년 최종 챔피언 결정전</p>
        </div>
        <div className="flex-1 flex flex-col justify-center relative">
          {me && (
            <BracketMatchCard
              match={me}
              isFinal={true}
              isScorerMode={isScorerMode}
              onScoreUpdate={onScoreUpdate}
              onFinish={onFinish}
              onCancel={onCancel}
            />
          )}
          <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-[2px] bg-amber-500/40" />
        </div>
      </div>

      {/* 4단계: 3학년 최종 우승 학급 카드 */}
      <div className="w-64 flex flex-col justify-center">
        <div className="text-center pb-2">
          <span className="text-xs font-black px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            🏆 3학년 챔피언
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <ChampionCard
            championTeam={championTeam}
            grade={3}
            sportName={sportName}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 단일 대진표 경기 카드 컴포넌트 (점수 조작 + 우승팀 색상 변경 하이라이트)
// ---------------------------------------------------------------------------
function BracketMatchCard({
  match,
  isFinal = false,
  isScorerMode,
  onScoreUpdate,
  onFinish,
  onCancel,
}: {
  match: Match;
  isFinal?: boolean;
  isScorerMode: boolean;
  onScoreUpdate?: (matchId: string, team: 'A' | 'B', delta: number) => void;
  onFinish: (match: Match, winner: 'teamA' | 'teamB') => void;
  onCancel?: (matchId: string) => void;
}) {
  const isTeamAWinner = match.winnerTeam === 'teamA';
  const isTeamBWinner = match.winnerTeam === 'teamB';
  const isCompleted = match.status === 'completed';

  // 아직 대진 상대가 정해지지 않은 플레이스홀더 여부
  const isPlaceHolderA = match.teamA.classNum === 0;
  const isPlaceHolderB = match.teamB.classNum === 0;
  const canPlay = !isPlaceHolderA && !isPlaceHolderB;

  return (
    <div
      className={`glass-card p-3 rounded-2xl border transition-all flex flex-col justify-between ${
        isFinal
          ? 'border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20 shadow-md'
          : isCompleted
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : match.status === 'in_progress'
          ? 'border-indigo-500/40 ring-1 ring-indigo-500/30 shadow-md'
          : 'border-slate-200/80 dark:border-slate-800'
      }`}
    >
      {/* 카드 상단 정보 */}
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-1.5 font-bold">
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] ${
              isFinal
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black'
                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
            }`}
          >
            {match.bracketLabel || match.round}
          </span>
          <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
            <Award className="w-3 h-3" /> +{match.pointsForWinner}pt
          </span>
        </div>

        <div>
          {isCompleted ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 종료
            </span>
          ) : match.status === 'in_progress' ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /> 진행중
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700/80 text-slate-500 font-medium">
              대기중
            </span>
          )}
        </div>
      </div>

      {/* 팀 리스트 및 점수 입력 영역 */}
      <div className="space-y-2 my-1">
        {/* === Team A === */}
        <div
          className={`p-2 rounded-xl flex items-center justify-between transition-all border ${
            isTeamAWinner
              ? 'bg-gradient-to-r from-emerald-500/25 via-teal-500/15 to-emerald-500/10 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-black shadow-sm ring-1 ring-emerald-500/40'
              : isTeamBWinner
              ? 'opacity-40 bg-slate-100/40 dark:bg-slate-800/30 border-transparent text-slate-400'
              : 'bg-slate-100/80 dark:bg-slate-800/60 border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-100'
          }`}
        >
          {/* 반 이름 (왼쪽) */}
          <div className="flex items-center gap-1.5 truncate mr-2">
            {isTeamAWinner && (
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0 animate-bounce" />
            )}
            <span
              className={`text-xs truncate ${
                isTeamAWinner
                  ? 'font-black text-emerald-700 dark:text-emerald-300'
                  : isPlaceHolderA
                  ? 'text-slate-400 font-normal italic'
                  : 'font-bold'
              }`}
            >
              {match.teamA.name}
            </span>
            {isTeamAWinner && (
              <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.2 rounded-full shrink-0">
                {isFinal ? '우승' : '승리'}
              </span>
            )}
          </div>

          {/* 반 이름 오른쪽 점수 컨트롤/조회 (사용자 요구사항!) */}
          <div className="flex items-center gap-1 shrink-0">
            {isScorerMode ? (
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-300 dark:border-slate-700 shadow-xs">
                <button
                  type="button"
                  onClick={() => onScoreUpdate && onScoreUpdate(match.id, 'A', -1)}
                  disabled={match.scoreA <= 0}
                  className="w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-25"
                  title="1점 감점"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span
                  className={`w-6 text-center text-xs font-black ${
                    isTeamAWinner
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {match.scoreA}
                </span>
                <button
                  type="button"
                  onClick={() => onScoreUpdate && onScoreUpdate(match.id, 'A', 1)}
                  className="w-5 h-5 flex items-center justify-center rounded text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-bold"
                  title="1점 추가"
                >
                  <Plus className="w-3 h-3" />
                </button>

                {/* 우승/승리 결정 버튼 */}
                {!isCompleted && canPlay && (
                  <button
                    type="button"
                    onClick={() => onFinish(match, 'teamA')}
                    className="ml-1 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black shadow-xs whitespace-nowrap"
                    title="승리 확정 (다음 라운드 진출)"
                  >
                    승리
                  </button>
                )}
              </div>
            ) : (
              /* 학생용 조회 전용 점수 뱃지 */
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                  isTeamAWinner
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200'
                }`}
              >
                {match.scoreA}
              </span>
            )}
          </div>
        </div>

        {/* === Team B === */}
        <div
          className={`p-2 rounded-xl flex items-center justify-between transition-all border ${
            isTeamBWinner
              ? 'bg-gradient-to-r from-emerald-500/25 via-teal-500/15 to-emerald-500/10 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-black shadow-sm ring-1 ring-emerald-500/40'
              : isTeamAWinner
              ? 'opacity-40 bg-slate-100/40 dark:bg-slate-800/30 border-transparent text-slate-400'
              : 'bg-slate-100/80 dark:bg-slate-800/60 border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-100'
          }`}
        >
          {/* 반 이름 (왼쪽) */}
          <div className="flex items-center gap-1.5 truncate mr-2">
            {isTeamBWinner && (
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0 animate-bounce" />
            )}
            <span
              className={`text-xs truncate ${
                isTeamBWinner
                  ? 'font-black text-emerald-700 dark:text-emerald-300'
                  : isPlaceHolderB
                  ? 'text-slate-400 font-normal italic'
                  : 'font-bold'
              }`}
            >
              {match.teamB.name}
            </span>
            {isTeamBWinner && (
              <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.2 rounded-full shrink-0">
                {isFinal ? '우승' : '승리'}
              </span>
            )}
          </div>

          {/* 반 이름 오른쪽 점수 컨트롤/조회 */}
          <div className="flex items-center gap-1 shrink-0">
            {isScorerMode ? (
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-300 dark:border-slate-700 shadow-xs">
                <button
                  type="button"
                  onClick={() => onScoreUpdate && onScoreUpdate(match.id, 'B', -1)}
                  disabled={match.scoreB <= 0}
                  className="w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-25"
                  title="1점 감점"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span
                  className={`w-6 text-center text-xs font-black ${
                    isTeamBWinner
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {match.scoreB}
                </span>
                <button
                  type="button"
                  onClick={() => onScoreUpdate && onScoreUpdate(match.id, 'B', 1)}
                  className="w-5 h-5 flex items-center justify-center rounded text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-bold"
                  title="1점 추가"
                >
                  <Plus className="w-3 h-3" />
                </button>

                {/* 우승/승리 결정 버튼 */}
                {!isCompleted && canPlay && (
                  <button
                    type="button"
                    onClick={() => onFinish(match, 'teamB')}
                    className="ml-1 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black shadow-xs whitespace-nowrap"
                    title="승리 확정 (다음 라운드 진출)"
                  >
                    승리
                  </button>
                )}
              </div>
            ) : (
              /* 학생용 조회 전용 점수 뱃지 */
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                  isTeamBWinner
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200'
                }`}
              >
                {match.scoreB}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 카드 하단 정보 및 취소 버튼 */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/60">
        <span className="flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 shrink-0" /> {match.court}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {match.time}
          </span>
          {isScorerMode && isCompleted && (
            <button
              type="button"
              onClick={() => onCancel && onCancel(match.id)}
              className="text-rose-500 hover:underline font-bold text-[10px] flex items-center gap-0.5 ml-1"
              title="경기 완료 취소 및 재개"
            >
              <RotateCcw className="w-2.5 h-2.5" /> 취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 최종 우승 학급 트로피 카드
// ---------------------------------------------------------------------------
function ChampionCard({
  championTeam,
  grade,
  sportName,
}: {
  championTeam: Match['teamA'] | null;
  grade: number;
  sportName: string;
}) {
  if (championTeam && championTeam.classNum > 0) {
    return (
      <div className="glass-card p-5 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/15 via-purple-500/10 to-indigo-500/15 text-center flex flex-col items-center justify-center gap-2.5 shadow-xl animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/40 animate-bounce">
          <Trophy className="w-9 h-9" />
        </div>
        <div>
          <span className="text-[11px] font-extrabold text-amber-500 tracking-wider">
            {grade}학년 {sportName} 우승
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            {championTeam.name}
          </h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black text-xs flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> 챔피언 트로피 획득!
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center flex flex-col items-center justify-center gap-2 opacity-80">
      <div className="w-12 h-12 rounded-full bg-slate-200/70 dark:bg-slate-800 flex items-center justify-center text-slate-400">
        <Trophy className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {grade}학년 {sportName} 챔피언
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          결승전 완료 시 우승 학급이 자동으로 등극합니다!
        </p>
      </div>
    </div>
  );
}
