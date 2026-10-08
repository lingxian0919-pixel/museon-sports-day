'use client';

import { useState, useEffect } from 'react';
import { Match, GradeScore, ClassRanking, SportRankingEntry, MatchStatus } from './types';
import {
  INITIAL_MATCHES,
  INITIAL_GRADE_SCORES,
  INITIAL_CLASS_RANKINGS,
  INITIAL_SPORT_RANKINGS,
  generateCleanMatches,
  generateCleanSportRankings,
  generateCleanGradeScores,
  generateCleanClassRankings,
  recalculateAllScores,
  getRankPoints,
} from './mockData';
import { addRankingScore } from './supabase';

const STORAGE_KEY_MATCHES = 'museon_sports_matches_v12';
const STORAGE_KEY_GRADES = 'museon_sports_grades_v12';
const STORAGE_KEY_CLASSES = 'museon_sports_classes_v12';
const STORAGE_KEY_SPORT_RANKINGS = 'museon_sports_sport_rankings_v12';

export function useSportsData() {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [gradeScores, setGradeScores] = useState<GradeScore[]>(INITIAL_GRADE_SCORES);
  const [classRankings, setClassRankings] = useState<ClassRanking[]>(INITIAL_CLASS_RANKINGS);
  const [sportRankings, setSportRankings] = useState<SportRankingEntry[]>(INITIAL_SPORT_RANKINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMatches = localStorage.getItem(STORAGE_KEY_MATCHES);
        const savedGrades = localStorage.getItem(STORAGE_KEY_GRADES);
        const savedClasses = localStorage.getItem(STORAGE_KEY_CLASSES);
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
        if (savedGrades) setGradeScores(JSON.parse(savedGrades));
        if (savedClasses) setClassRankings(JSON.parse(savedClasses));
        if (savedSportRankings) setSportRankings(JSON.parse(savedSportRankings));
      } catch {
        // ignore
      }
      setIsLoaded(true);

      // Listen to cross-tab storage changes
      const handleStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY_MATCHES && e.newValue) {
          try { setMatches(JSON.parse(e.newValue)); } catch {}
        }
        if (e.key === STORAGE_KEY_GRADES && e.newValue) {
          try { setGradeScores(JSON.parse(e.newValue)); } catch {}
        }
        if (e.key === STORAGE_KEY_CLASSES && e.newValue) {
          try { setClassRankings(JSON.parse(e.newValue)); } catch {}
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
    newGrades: GradeScore[],
    newClasses: ClassRanking[],
    newSportRankings: SportRankingEntry[] = sportRankings
  ) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(newMatches));
      localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(newGrades));
      localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(newClasses));
      localStorage.setItem(STORAGE_KEY_SPORT_RANKINGS, JSON.stringify(newSportRankings));
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
    saveState(updatedMatches, gradeScores, classRankings, sportRankings);
  };

  const handleFinishMatch = (matchId: string, winner: 'teamA' | 'teamB') => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const winningTeam = winner === 'teamA' ? targetMatch.teamA : targetMatch.teamB;

    // 1. Update Match status & Propagate winner to downstream matches
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

    // 2. 일괄 종합 점수 및 순위 동기화 (배점표 기준)
    const { classRankings: updatedClasses, gradeScores: updatedGrades } =
      recalculateAllScores(updatedMatches, sportRankings);

    setMatches(updatedMatches);
    setGradeScores(updatedGrades);
    setClassRankings(updatedClasses);
    saveState(updatedMatches, updatedGrades, updatedClasses, sportRankings);

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
      }
      if (m.sourceMatchBId === matchId) {
        nextMatch.teamB = {
          name: `${targetMatch.bracketLabel || '이전 경기'} 승자`,
          grade: targetMatch.grade || 1,
          classNum: 0,
        };
      }
      return nextMatch;
    });

    // 점수 재계산
    const { classRankings: updatedClasses, gradeScores: updatedGrades } =
      recalculateAllScores(updatedMatches, sportRankings);

    setMatches(updatedMatches);
    setGradeScores(updatedGrades);
    setClassRankings(updatedClasses);
    saveState(updatedMatches, updatedGrades, updatedClasses, sportRankings);
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

    const { classRankings: updatedClasses, gradeScores: updatedGrades } =
      recalculateAllScores(updatedMatches, sportRankings);

    setMatches(updatedMatches);
    setGradeScores(updatedGrades);
    setClassRankings(updatedClasses);
    saveState(updatedMatches, updatedGrades, updatedClasses, sportRankings);
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

    const { classRankings: updatedClasses, gradeScores: updatedGrades } =
      recalculateAllScores(matches, updatedRankings);

    setSportRankings(updatedRankings);
    setGradeScores(updatedGrades);
    setClassRankings(updatedClasses);
    saveState(matches, updatedGrades, updatedClasses, updatedRankings);

    if (newPoints > 0) {
      const nickname = `${grade}학년 ${classNum}반`;
      addRankingScore(nickname, newPoints).catch(() => {});
    }
  };

  // 모든 경기 대기중, 점수 0점, 승리반 없음 완전 초기화
  const handleResetData = () => {
    const cleanMatches = generateCleanMatches();
    const cleanRankings = generateCleanSportRankings();
    const cleanGrades = generateCleanGradeScores();
    const cleanClasses = generateCleanClassRankings();

    setMatches(cleanMatches);
    setSportRankings(cleanRankings);
    setGradeScores(cleanGrades);
    setClassRankings(cleanClasses);
    saveState(cleanMatches, cleanGrades, cleanClasses, cleanRankings);
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
