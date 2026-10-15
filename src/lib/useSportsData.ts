'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Match, SportRankingEntry, MatchStatus } from './types';
import {
  INITIAL_MATCHES,
  INITIAL_SPORT_RANKINGS,
  generateCleanMatches,
  generateCleanSportRankings,
  recalculateAllScores,
  getRankPoints,
} from './mockData';
import {
  supabase,
  addRankingScore,
  fetchMatchesFromDb,
  fetchSportRankingsFromDb,
  updateMatchScoreInDb,
  finishMatchInDb,
  cancelWinnerInDb,
  updateMatchStatusInDb,
  updateSportRankingInDb,
  resetAllDataInDb,
  verifyScorerPin,
  dbToMatch,
  dbToSportRanking,
} from './supabase';

const STORAGE_KEY_MATCHES = 'museon_sports_matches_v13';
const STORAGE_KEY_SPORT_RANKINGS = 'museon_sports_sport_rankings_v13';
const SESSION_KEY_PIN = 'museon_scorer_pin';

export function useSportsData() {
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [sportRankings, setSportRankings] = useState<SportRankingEntry[]>(INITIAL_SPORT_RANKINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [scorerPin, setScorerPin] = useState<string | null>(null);
  const [isScorerAuthenticated, setIsScorerAuthenticated] = useState<boolean>(false);

  // References for cross-event updates without stale closures
  const matchesRef = useRef<Match[]>(matches);
  matchesRef.current = matches;
  const rankingsRef = useRef<SportRankingEntry[]>(sportRankings);
  rankingsRef.current = sportRankings;

  // "종목별 각 반별 포인트 계산표"와 100% 동일한 공식(recalculateAllScores)으로
  // "체육대회 실시간 종합 리더보드"(classRankings) 및 학년 총점(gradeScores)을 실시간 자동 산출
  const { classRankings, gradeScores } = useMemo(
    () => recalculateAllScores(matches, sportRankings),
    [matches, sportRankings]
  );

  // Save to local cache safely (DB-first cache)
  const saveLocalCache = (
    nextMatches: Match[],
    nextSportRankings: SportRankingEntry[]
  ) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(nextMatches));
        localStorage.setItem(STORAGE_KEY_SPORT_RANKINGS, JSON.stringify(nextSportRankings));
      } catch (e) {
        console.warn('Local cache save skipped:', e);
      }
    }
  };

  // Check saved session PIN on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPin = sessionStorage.getItem(SESSION_KEY_PIN);
      if (savedPin) {
        setScorerPin(savedPin);
        setIsScorerAuthenticated(true);
      }
    }
  }, []);

  // 1. Initial Load: Read local cache for immediate display, then fetch and sync with Supabase DB
  // 2. Setup Realtime subscription to reflect changes on all connected devices
  useEffect(() => {
    let isMounted = true;

    // Fast initial local cache load
    if (typeof window !== 'undefined') {
      try {
        const cachedM = localStorage.getItem(STORAGE_KEY_MATCHES);
        const cachedR = localStorage.getItem(STORAGE_KEY_SPORT_RANKINGS);
        if (cachedM) setMatches(JSON.parse(cachedM));
        if (cachedR) setSportRankings(JSON.parse(cachedR));
      } catch {}
    }

    async function syncWithDb() {
      try {
        const [dbMatches, dbRankings] = await Promise.all([
          fetchMatchesFromDb(),
          fetchSportRankingsFromDb(),
        ]);

        if (isMounted) {
          if (dbMatches && dbMatches.length > 0) {
            setMatches(dbMatches);
            saveLocalCache(dbMatches, dbRankings || rankingsRef.current);
          }
          if (dbRankings && dbRankings.length > 0) {
            setSportRankings(dbRankings);
            saveLocalCache(dbMatches || matchesRef.current, dbRankings);
          }
          setIsLoaded(true);
        }
      } catch (err) {
        console.warn('Failed to fetch from DB on mount, falling back to local cache:', err);
        if (isMounted) setIsLoaded(true);
      }
    }

    syncWithDb();

    // Supabase Realtime Subscription: listens to matches and sport_rankings updates across all devices
    if (supabase) {
      const channel = supabase
        .channel('sports_day_realtime_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'matches' },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const updated = dbToMatch(payload.new);
              setMatches((prev) => {
                const exists = prev.some((m) => m.id === updated.id);
                const next = exists
                  ? prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
                  : [...prev, updated];
                saveLocalCache(next, rankingsRef.current);
                return next;
              });
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sport_rankings' },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              const updated = dbToSportRanking(payload.new);
              setSportRankings((prev) => {
                const exists = prev.some((r) => r.id === updated.id);
                const next = exists
                  ? prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
                  : [...prev, updated];
                saveLocalCache(matchesRef.current, next);
                return next;
              });
            }
          }
        )
        .subscribe();

      return () => {
        isMounted = false;
        supabase?.removeChannel(channel);
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Scorer Authentication methods
  const authenticateScorer = async (pin: string): Promise<boolean> => {
    try {
      const isValid = await verifyScorerPin(pin);
      if (isValid) {
        setScorerPin(pin);
        setIsScorerAuthenticated(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(SESSION_KEY_PIN, pin);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logoutScorer = () => {
    setScorerPin(null);
    setIsScorerAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_KEY_PIN);
    }
  };

  const clearSyncError = () => {
    setSyncError(null);
  };

  // Helper to retrieve current PIN
  const getActivePin = () => {
    return scorerPin || (typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_KEY_PIN) : null);
  };

  // 1. 경기 득점 업데이트 (+/-)
  const handleScoreUpdate = async (matchId: string, team: 'A' | 'B', delta: number) => {
    const pin = getActivePin();
    if (!pin) {
      setSyncError('점수 수정 권한이 없습니다. 상단 기록원 PIN 인증을 먼저 진행해 주세요.');
      return;
    }

    const prevMatches = matches;
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const nextScoreA = team === 'A' ? Math.max(0, targetMatch.scoreA + delta) : targetMatch.scoreA;
    const nextScoreB = team === 'B' ? Math.max(0, targetMatch.scoreB + delta) : targetMatch.scoreB;
    const nextStatus: MatchStatus =
      targetMatch.status === 'scheduled' && (nextScoreA > 0 || nextScoreB > 0)
        ? 'in_progress'
        : targetMatch.status;

    // Optimistic UI update
    const updatedMatches = matches.map((m) =>
      m.id === matchId
        ? { ...m, scoreA: nextScoreA, scoreB: nextScoreB, status: nextStatus }
        : m
    );
    setMatches(updatedMatches);
    saveLocalCache(updatedMatches, sportRankings);

    setIsSyncing(true);
    setSyncError(null);
    try {
      await updateMatchScoreInDb(matchId, nextScoreA, nextScoreB, nextStatus, pin);
    } catch (err: any) {
      console.error('Failed to update match score in DB:', err);
      // Rollback on failure
      setMatches(prevMatches);
      saveLocalCache(prevMatches, sportRankings);
      setSyncError(
        err.message?.includes('AUTH_FAILED')
          ? '기록원 인증 실패: 올바른 PIN 번호가 아닙니다.'
          : '점수 저장 실패: 네트워크 연결 상태를 확인해 주세요.'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // 2. 경기 승리 확정 (다음 라운드 진출)
  const handleFinishMatch = async (matchId: string, winner: 'teamA' | 'teamB') => {
    const pin = getActivePin();
    if (!pin) {
      setSyncError('승리 확정 권한이 없습니다. 상단 기록원 PIN 인증을 먼저 진행해 주세요.');
      return;
    }

    const prevMatches = matches;
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const winningTeam = winner === 'teamA' ? targetMatch.teamA : targetMatch.teamB;

    // Optimistic UI update
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
    saveLocalCache(updatedMatches, sportRankings);

    // Supabase Hall of Fame score
    if (winningTeam.classNum > 0) {
      const nickname = `${winningTeam.grade}학년 ${winningTeam.classNum}반`;
      addRankingScore(nickname, targetMatch.pointsForWinner || 100).catch(() => {});
    }

    setIsSyncing(true);
    setSyncError(null);
    try {
      await finishMatchInDb(matchId, winner, pin);
    } catch (err: any) {
      console.error('Failed to finish match in DB:', err);
      // Rollback on failure
      setMatches(prevMatches);
      saveLocalCache(prevMatches, sportRankings);
      setSyncError(
        err.message?.includes('AUTH_FAILED')
          ? '기록원 인증 실패: 올바른 PIN 번호가 아닙니다.'
          : '경기 승리 확정 저장 실패: 네트워크 연결 상태를 확인해 주세요.'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // 3. 승리 취소 (진행중으로 복구)
  const handleCancelWinner = async (matchId: string) => {
    const pin = getActivePin();
    if (!pin) {
      setSyncError('승리 취소 권한이 없습니다. 상단 기록원 PIN 인증을 먼저 진행해 주세요.');
      return;
    }

    const prevMatches = matches;
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch || targetMatch.status !== 'completed' || !targetMatch.winnerTeam) return;

    // Optimistic UI update
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
    saveLocalCache(updatedMatches, sportRankings);

    setIsSyncing(true);
    setSyncError(null);
    try {
      await cancelWinnerInDb(matchId, pin);
    } catch (err: any) {
      console.error('Failed to cancel winner in DB:', err);
      // Rollback on failure
      setMatches(prevMatches);
      saveLocalCache(prevMatches, sportRankings);
      setSyncError(
        err.message?.includes('AUTH_FAILED')
          ? '기록원 인증 실패: 올바른 PIN 번호가 아닙니다.'
          : '승리 취소 저장 실패: 네트워크 연결 상태를 확인해 주세요.'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // 4. 경기 상태 수동 제어 (대기중 / 진행중 / 종료)
  const handleStatusUpdate = async (matchId: string, status: MatchStatus) => {
    const pin = getActivePin();
    if (!pin) {
      setSyncError('경기 상태 변경 권한이 없습니다. 상단 기록원 PIN 인증을 먼저 진행해 주세요.');
      return;
    }

    const prevMatches = matches;
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
    saveLocalCache(updatedMatches, sportRankings);

    setIsSyncing(true);
    setSyncError(null);
    try {
      await updateMatchStatusInDb(matchId, status, pin);
    } catch (err: any) {
      console.error('Failed to update match status in DB:', err);
      // Rollback on failure
      setMatches(prevMatches);
      saveLocalCache(prevMatches, sportRankings);
      setSyncError(
        err.message?.includes('AUTH_FAILED')
          ? '기록원 인증 실패: 올바른 PIN 번호가 아닙니다.'
          : '경기 상태 저장 실패: 네트워크 연결 상태를 확인해 주세요.'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // 5. 순위제 7개 종목 기록 및 순위 변경
  const handleUpdateSportRanking = async (
    sportId: string,
    grade: number,
    classNum: number,
    rank: number,
    record?: string
  ) => {
    const pin = getActivePin();
    if (!pin) {
      setSyncError('순위 변경 권한이 없습니다. 상단 기록원 PIN 인증을 먼저 진행해 주세요.');
      return;
    }

    const prevRankings = sportRankings;
    const newPoints = getRankPoints(sportId, rank);

    const targetEntry = sportRankings.find(
      (r) => r.sportId === sportId && r.grade === grade && r.classNum === classNum
    );
    if (!targetEntry) return;

    const finalRecord = record !== undefined ? record : targetEntry.record || '';

    // Optimistic UI update
    const updatedRankings = sportRankings.map((r) => {
      if (r.id === targetEntry.id) {
        return {
          ...r,
          rank,
          record: finalRecord,
          points: newPoints,
        };
      }
      return r;
    });

    setSportRankings(updatedRankings);
    saveLocalCache(matches, updatedRankings);

    if (newPoints > 0) {
      const nickname = `${grade}학년 ${classNum}반`;
      addRankingScore(nickname, newPoints).catch(() => {});
    }

    setIsSyncing(true);
    setSyncError(null);
    try {
      await updateSportRankingInDb(targetEntry.id, rank, finalRecord, newPoints, pin);
    } catch (err: any) {
      console.error('Failed to update sport ranking in DB:', err);
      // Rollback on failure
      setSportRankings(prevRankings);
      saveLocalCache(matches, prevRankings);
      setSyncError(
        err.message?.includes('AUTH_FAILED')
          ? '기록원 인증 실패: 올바른 PIN 번호가 아닙니다.'
          : '순위 저장 실패: 네트워크 연결 상태를 확인해 주세요.'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // 6. 데이터 전체 초기화 (모든 경기 대기중, 점수 0점, 승리반 없음)
  const handleResetData = async () => {
    const pin = getActivePin();
    if (!pin) {
      setSyncError('데이터 초기화 권한이 없습니다. 상단 기록원 PIN 인증을 먼저 진행해 주세요.');
      return;
    }

    const prevMatches = matches;
    const prevRankings = sportRankings;

    const cleanMatches = generateCleanMatches();
    const cleanRankings = generateCleanSportRankings();

    // Optimistic UI update
    setMatches(cleanMatches);
    setSportRankings(cleanRankings);
    saveLocalCache(cleanMatches, cleanRankings);

    setIsSyncing(true);
    setSyncError(null);
    try {
      await resetAllDataInDb(cleanMatches, cleanRankings, pin);
    } catch (err: any) {
      console.error('Failed to reset all data in DB:', err);
      // Rollback on failure
      setMatches(prevMatches);
      setSportRankings(prevRankings);
      saveLocalCache(prevMatches, prevRankings);
      setSyncError(
        err.message?.includes('AUTH_FAILED')
          ? '기록원 인증 실패: 올바른 PIN 번호가 아닙니다.'
          : '전체 데이터 초기화 실패: 네트워크 연결 상태를 확인해 주세요.'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    matches,
    gradeScores,
    classRankings,
    sportRankings,
    isLoaded,
    isSyncing,
    syncError,
    scorerPin,
    isScorerAuthenticated,
    authenticateScorer,
    logoutScorer,
    clearSyncError,
    handleScoreUpdate,
    handleFinishMatch,
    handleCancelWinner,
    handleStatusUpdate,
    handleUpdateSportRanking,
    handleResetData,
  };
}
