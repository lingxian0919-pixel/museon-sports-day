'use client';

import { useState, useEffect } from 'react';
import { Match, GradeScore, ClassRanking, SportRankingEntry, MatchStatus } from './types';
import {
  INITIAL_MATCHES,
  INITIAL_GRADE_SCORES,
  INITIAL_CLASS_RANKINGS,
  INITIAL_SPORT_RANKINGS,
  calculateRankPoints,
  getRankPoints,
  SPORT_CATEGORIES,
} from './mockData';
import { addRankingScore } from './supabase';

const STORAGE_KEY_MATCHES = 'museon_sports_matches_v10';
const STORAGE_KEY_GRADES = 'museon_sports_grades_v10';
const STORAGE_KEY_CLASSES = 'museon_sports_classes_v10';
const STORAGE_KEY_SPORT_RANKINGS = 'museon_sports_sport_rankings_v10';

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

        if (savedMatches) setMatches(JSON.parse(savedMatches));
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
      const nextStatus = (m.status === 'scheduled' && (nextScoreA > 0 || nextScoreB > 0)) ? 'in_progress' : m.status;
      return {
        ...m,
        scoreA: nextScoreA,
        scoreB: nextScoreB,
        status: nextStatus,
      };
    });
    setMatches(updatedMatches);
    saveState(updatedMatches, gradeScores, classRankings);
  };

  const handleFinishMatch = (matchId: string, winner: 'teamA' | 'teamB') => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const points = targetMatch.pointsForWinner || 100;
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

    // 2. Award points to Grade Score if valid class
    let updatedGrades = gradeScores;
    if (winningTeam.classNum > 0) {
      updatedGrades = gradeScores.map((gs) => {
        if (gs.grade !== winningTeam.grade) return gs;
        return {
          ...gs,
          totalScore: gs.totalScore + points,
          goldMedals: gs.goldMedals + 1,
        };
      });
    }

    // 3. Award points to Class Ranking if valid class
    let updatedClasses = classRankings;
    if (winningTeam.classNum > 0) {
      updatedClasses = classRankings.map((cr) => {
        if (cr.grade === winningTeam.grade && cr.classNum === winningTeam.classNum) {
          return {
            ...cr,
            score: cr.score + points,
            wins: cr.wins + 1,
          };
        }
        return cr;
      });

      // Re-sort and recalculate rank 1 to 18
      updatedClasses.sort((a, b) => b.score - a.score);
      updatedClasses = updatedClasses.map((cr, idx) => ({ ...cr, rank: idx + 1 }));
    }

    setMatches(updatedMatches);
    setGradeScores(updatedGrades);
    setClassRankings(updatedClasses);
    saveState(updatedMatches, updatedGrades, updatedClasses);

    // Also register to Supabase rankings
    if (winningTeam.classNum > 0) {
      const nickname = `${winningTeam.grade}학년 ${winningTeam.classNum}반`;
      addRankingScore(nickname, points).catch(() => {});
    }
  };

  const handleCancelWinner = (matchId: string) => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch || targetMatch.status !== 'completed' || !targetMatch.winnerTeam) return;

    const points = targetMatch.pointsForWinner || 100;
    const prevWinningTeam = targetMatch.winnerTeam === 'teamA' ? targetMatch.teamA : targetMatch.teamB;

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
        nextMatch.teamA = { name: `${targetMatch.bracketLabel || '이전 경기'} 승자`, grade: targetMatch.grade || 1, classNum: 0 };
      }
      if (m.sourceMatchBId === matchId) {
        nextMatch.teamB = { name: `${targetMatch.bracketLabel || '이전 경기'} 승자`, grade: targetMatch.grade || 1, classNum: 0 };
      }
      return nextMatch;
    });

    let updatedGrades = gradeScores;
    if (prevWinningTeam.classNum > 0) {
      updatedGrades = gradeScores.map((gs) => {
        if (gs.grade !== prevWinningTeam.grade) return gs;
        return {
          ...gs,
          totalScore: Math.max(0, gs.totalScore - points),
          goldMedals: Math.max(0, gs.goldMedals - 1),
        };
      });
    }

    let updatedClasses = classRankings;
    if (prevWinningTeam.classNum > 0) {
      updatedClasses = classRankings.map((cr) => {
        if (cr.grade === prevWinningTeam.grade && cr.classNum === prevWinningTeam.classNum) {
          return {
            ...cr,
            score: Math.max(0, cr.score - points),
            wins: Math.max(0, cr.wins - 1),
          };
        }
        return cr;
      });
      updatedClasses.sort((a, b) => b.score - a.score);
      updatedClasses = updatedClasses.map((cr, idx) => ({ ...cr, rank: idx + 1 }));
    }

    setMatches(updatedMatches);
    setGradeScores(updatedGrades);
    setClassRankings(updatedClasses);
    saveState(updatedMatches, updatedGrades, updatedClasses);
  };

  const handleStatusUpdate = (matchId: string, status: MatchStatus) => {
    const updatedMatches = matches.map((m) => {
      if (m.id !== matchId) return m;
      return {
        ...m,
        status,
      };
    });
    setMatches(updatedMatches);
    saveState(updatedMatches, gradeScores, classRankings, sportRankings);
  };

  const handleUpdateSportRanking = (
    sportId: string,
    grade: number,
    classNum: number,
    rank: number,
    record?: string
  ) => {
    const newPoints = getRankPoints(sportId, rank);

    let oldPoints = 0;
    const existing = sportRankings.find(
      (r) => r.sportId === sportId && r.grade === grade && r.classNum === classNum
    );
    if (existing) oldPoints = existing.points;

    const delta = newPoints - oldPoints;

    // 1. Update sportRankings
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

    // 2. Adjust points in gradeScores
    let updatedGrades = gradeScores;
    if (delta !== 0) {
      updatedGrades = gradeScores.map((gs) => {
        if (gs.grade !== grade) return gs;
        return {
          ...gs,
          totalScore: Math.max(0, gs.totalScore + delta),
          goldMedals:
            rank === 1
              ? gs.goldMedals + 1
              : existing?.rank === 1
              ? Math.max(0, gs.goldMedals - 1)
              : gs.goldMedals,
        };
      });
    }

    // 3. Adjust points in classRankings
    let updatedClasses = classRankings;
    if (delta !== 0) {
      updatedClasses = classRankings.map((cr) => {
        if (cr.grade === grade && cr.classNum === classNum) {
          return {
            ...cr,
            score: Math.max(0, cr.score + delta),
            wins: rank === 1 ? cr.wins + 1 : cr.wins,
          };
        }
        return cr;
      });
      updatedClasses.sort((a, b) => b.score - a.score);
      updatedClasses = updatedClasses.map((cr, idx) => ({ ...cr, rank: idx + 1 }));
    }

    setSportRankings(updatedRankings);
    setGradeScores(updatedGrades);
    setClassRankings(updatedClasses);
    saveState(matches, updatedGrades, updatedClasses, updatedRankings);

    // Also register to Supabase rankings if point delta is positive
    if (delta > 0) {
      const nickname = `${grade}학년 ${classNum}반`;
      addRankingScore(nickname, delta).catch(() => {});
    }
  };

  const handleResetData = () => {
    if (confirm('모든 점수와 경기 상태를 초기 상태로 리셋하시겠습니까?')) {
      setMatches(INITIAL_MATCHES);
      setGradeScores(INITIAL_GRADE_SCORES);
      setClassRankings(INITIAL_CLASS_RANKINGS);
      setSportRankings(INITIAL_SPORT_RANKINGS);
      saveState(INITIAL_MATCHES, INITIAL_GRADE_SCORES, INITIAL_CLASS_RANKINGS, INITIAL_SPORT_RANKINGS);
    }
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

