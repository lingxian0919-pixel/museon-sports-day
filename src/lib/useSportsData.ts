'use client';

import { useState, useEffect } from 'react';
import { Match, GradeScore, ClassRanking } from './types';
import {
  INITIAL_MATCHES,
  INITIAL_GRADE_SCORES,
  INITIAL_CLASS_RANKINGS
} from './mockData';
import { addRankingScore } from './supabase';

const STORAGE_KEY_MATCHES = 'museon_sports_matches_v2';
const STORAGE_KEY_GRADES = 'museon_sports_grades_v2';
const STORAGE_KEY_CLASSES = 'museon_sports_classes_v2';

export function useSportsData() {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [gradeScores, setGradeScores] = useState<GradeScore[]>(INITIAL_GRADE_SCORES);
  const [classRankings, setClassRankings] = useState<ClassRanking[]>(INITIAL_CLASS_RANKINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMatches = localStorage.getItem(STORAGE_KEY_MATCHES);
        const savedGrades = localStorage.getItem(STORAGE_KEY_GRADES);
        const savedClasses = localStorage.getItem(STORAGE_KEY_CLASSES);

        if (savedMatches) setMatches(JSON.parse(savedMatches));
        if (savedGrades) setGradeScores(JSON.parse(savedGrades));
        if (savedClasses) setClassRankings(JSON.parse(savedClasses));
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
      };

      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, []);

  // Save to localStorage when updated
  const saveState = (newMatches: Match[], newGrades: GradeScore[], newClasses: ClassRanking[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(newMatches));
      localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(newGrades));
      localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(newClasses));
    }
  };

  const handleScoreUpdate = (matchId: string, team: 'A' | 'B', delta: number) => {
    const updatedMatches = matches.map((m) => {
      if (m.id !== matchId) return m;
      return {
        ...m,
        scoreA: team === 'A' ? Math.max(0, m.scoreA + delta) : m.scoreA,
        scoreB: team === 'B' ? Math.max(0, m.scoreB + delta) : m.scoreB,
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

    // 1. Update Match status
    const updatedMatches = matches.map((m) => {
      if (m.id !== matchId) return m;
      return {
        ...m,
        status: 'completed' as const,
        winnerTeam: winner,
      };
    });

    // 2. Award points to Grade Score
    const updatedGrades = gradeScores.map((gs) => {
      if (gs.grade !== winningTeam.grade) return gs;
      return {
        ...gs,
        totalScore: gs.totalScore + points,
        goldMedals: gs.goldMedals + 1,
      };
    });

    // 3. Award points to Class Ranking
    const updatedClasses = classRankings.map((cr) => {
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
    const sortedClasses = updatedClasses.map((cr, idx) => ({ ...cr, rank: idx + 1 }));

    setMatches(updatedMatches);
    setGradeScores(updatedGrades);
    setClassRankings(sortedClasses);
    saveState(updatedMatches, updatedGrades, sortedClasses);

    // Also register to Supabase rankings
    const nickname = `${winningTeam.grade}학년 ${winningTeam.classNum}반`;
    addRankingScore(nickname, points).catch(() => {});
  };

  const handleResetData = () => {
    if (confirm('모든 점수와 경기 상태를 초기 상태로 리셋하시겠습니까?')) {
      setMatches(INITIAL_MATCHES);
      setGradeScores(INITIAL_GRADE_SCORES);
      setClassRankings(INITIAL_CLASS_RANKINGS);
      saveState(INITIAL_MATCHES, INITIAL_GRADE_SCORES, INITIAL_CLASS_RANKINGS);
    }
  };

  return {
    matches,
    gradeScores,
    classRankings,
    isLoaded,
    handleScoreUpdate,
    handleFinishMatch,
    handleResetData,
  };
}
