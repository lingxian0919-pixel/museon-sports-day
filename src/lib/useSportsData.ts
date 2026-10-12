'use client';

import { useState, useEffect, useMemo } from 'react';
import { Match, GradeScore, ClassRanking, SportRankingEntry, MatchStatus } from './types';
import {
  INITIAL_MATCHES,
  INITIAL_SPORT_RANKINGS,
  generateCleanMatches,
  generateCleanSportRankings,
  recalculateAllScores,
  getRankPoints,
} from './mockData';
import { addRankingScore } from './supabase';

const STORAGE_KEY_MATCHES = 'museon_sports_matches_v13';
const STORAGE_KEY_GRADES = 'museon_sports_grades_v13';
const STORAGE_KEY_CLASSES = 'museon_sports_classes_v13';
const STORAGE_KEY_SPORT_RANKINGS = 'museon_sports_sport_rankings_v13';

export function useSportsData() {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [sportRankings, setSportRankings] = useState<SportRankingEntry[]>(INITIAL_SPORT_RANKINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // "종목별 각 반별 포인트 계산표"와 100% 동일한 공식(recalculateAllScores)으로
  // "체육대회 실시간 종합 리더보드"(classRankings) 및 학년 총점(gradeScores)을 실시간 자동 산출
  const { classRankings, gradeScores } = useMemo(
    () => recalculateAllScores(matches, sportRankings),
    [matches, sportRankings]
  );

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMatches = localStorage.getItem(STORAGE_KEY_MATCHES);
        const savedSportRankings = localStorage.getItem(STORAGE_KEY_SPORT_RANKINGS);

        if (savedMatches) {
          const parsed: Match[] = JSON.parse(savedMatches);
          const synced = parsed.map((m) => {
            const initial = INITIAL_MATCHES.find((im) => im.id === m.id);
            if (initial && initial.time !== m.time) {
              return { ...m, time: initial.time, court: initial.court };
            }
            return m;
          });
          setMatches(synced);
        }
        if (savedSportRankings) {
          setSportRankings(JSON.parse(savedSportRankings));
        }
      } catch {
        // ignore
      }
      setIsLoaded(true);

      // Listen to cross-tab storage changes
      const handleStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY_MATCHES && e.newValue) {
          try { setMatches(JSON.parse(e.newValue)); } catch {}
        }
        if (e.key === STORAGE_KEY_SPORT_RANKINGS && e.newValue) {
          try { setSportRankings(JSON.parse(e.newValue)); } catch {}
        }
      };

      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, []);

  // Save to localStorage when updated
  const saveState = (
    newMatches: Match[],
    newSportRankings: SportRankingEntry[] = sportRankings
  ) => {
    if (typeof window !== 'undefined') {
      const { classRankings: nextClasses, gradeScores: nextGrades } =
        recalculateAllScores(newMatches, newSportRankings);
      localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(newMatches));
      localStorage.setItem(STORAGE_KEY_SPORT_RANKINGS, JSON.stringify(newSportRankings));
      localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(nextClasses));
      localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(nextGrades));
    }
  };

  const handleScoreUpdate = (matchId: string, team: 'A' | 'B', delta: number) => {
    const updatedMatches = matches.map((m) => {
      if (m.id !== matchId) return m;
      const nextScoreA = team === 'A' ? Math.max(0, m.scoreA + delta) : m.scoreA;
      const nextScoreB = team === 'B' ? Math.max(0, m.scoreB + delta) : m.scoreB;
      const nextStatus =
        m.status === 'scheduled' && (nextScoreA > 0 || nextScoreB > 0)
          ? 'in_progress'
          : m.status;
      return {
        ...m,
        scoreA: nextScoreA,
        scoreB: nextScoreB,
        status: nextStatus,
      };
    });
    setMatches(updatedMatches);
    saveState(updatedMatches, sportRankings);
  };

  const handleFinishMatch = (matchId: string, winner: 'teamA' | 'teamB') => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const winningTeam = winner === 'teamA' ? targetMatch.teamA : targetMatch.teamB;

    // Update Match status & Propagate winner to downstream matches
    const updatedMatches = matches.map((m) => {
      if (m.id === matchId) {
        return {
          ...m,
          status: 'completed' as const,
          winnerTeam: winner,
        };
      }
      let nextMatch = { ...m };
      if (m.sourceMatchAId === matchId) {
        nextMatch.teamA = winningTeam;
        if (nextMatch.status === 'scheduled') nextMatch.status = 'in_progress';
      }
      if (m.sourceMatchBId === matchId) {
        nextMatch.teamB = winningTeam;
        if (nextMatch.status === 'scheduled') nextMatch.status = 'in_progress';
      }
      return nextMatch;
    });

    setMatches(updatedMatches);
    saveState(updatedMatches, sportRankings);

    // Supabase 명예의 전당 등록
    if (winningTeam.classNum > 0) {
      const nickname = `${winningTeam.grade}학년 ${winningTeam.classNum}반`;
      addRankingScore(nickname, targetMatch.pointsForWinner || 100).catch(() => {});
    }
  };

  const handleCancelWinner = (matchId: string) => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch || targetMatch.status !== 'completed' || !targetMatch.winnerTeam) return;

    const updatedMatches = matches.map((m) => {
      if (m.id === matchId) {
        return {
          ...m,
          status: 'in_progress' as const,
          winnerTeam: undefined,
        };
      }
      let nextMatch = { ...m };
      if (m.sourceMatchAId === matchId) {
        nextMatch.teamA = {
          name: `${targetMatch.bracketLabel || '이전 경기'} 승자`,
          grade: targetMatch.grade || 1,
          classNum: 0,
        };
        if (nextMatch.status === 'completed') {
          nextMatch.status = 'in_progress';
          nextMatch.winnerTeam = undefined;
        }
      }
      if (m.sourceMatchBId === matchId) {
        nextMatch.teamB = {
          name: `${targetMatch.bracketLabel || '이전 경기'} 승자`,
          grade: targetMatch.grade || 1,
          classNum: 0,
        };
        if (nextMatch.status === 'completed') {
          nextMatch.status = 'in_progress';
          nextMatch.winnerTeam = undefined;
        }
      }
      return nextMatch;
    });

    setMatches(updatedMatches);
    saveState(updatedMatches, sportRankings);
  };

  const handleStatusUpdate = (matchId: string, status: MatchStatus) => {
    const updatedMatches = matches.map((m) => {
      if (m.id !== matchId) return m;
      return {
        ...m,
        status,
        ...(status === 'scheduled'
          ? { scoreA: 0, scoreB: 0, winnerTeam: undefined }
          : {}),
      };
    });

    setMatches(updatedMatches);
    saveState(updatedMatches, sportRankings);
  };

  const handleUpdateSportRanking = (
    sportId: string,
    grade: number,
    classNum: number,
    rank: number,
    record?: string
  ) => {
    const newPoints = getRankPoints(sportId, rank);

    const updatedRankings = sportRankings.map((r) => {
      if (r.sportId === sportId && r.grade === grade && r.classNum === classNum) {
        return {
          ...r,
          rank,
          record: record !== undefined ? record : r.record,
          points: newPoints,
        };
      }
      return r;
    });

    setSportRankings(updatedRankings);
    saveState(matches, updatedRankings);

    if (newPoints > 0) {
      const nickname = `${grade}학년 ${classNum}반`;
      addRankingScore(nickname, newPoints).catch(() => {});
    }
  };

  // 모든 경기 대기중, 점수 0점, 승리반 없음 완전 초기화
  const handleResetData = () => {
    const cleanMatches = generateCleanMatches();
    const cleanRankings = generateCleanSportRankings();

    setMatches(cleanMatches);
    setSportRankings(cleanRankings);
    saveState(cleanMatches, cleanRankings);
  };

  return {
    matches,
    gradeScores,
    classRankings,
    sportRankings,
    isLoaded,
    handleScoreUpdate,
    handleFinishMatch,
    handleCancelWinner,
    handleStatusUpdate,
    handleUpdateSportRanking,
    handleResetData,
  };
}
