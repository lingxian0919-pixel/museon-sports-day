'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ScoreHero from '../components/ScoreHero';
import MatchesBento from '../components/MatchesBento';
import GradeRankingsBento from '../components/GradeRankingsBento';
import CheeringBoardBento from '../components/CheeringBoardBento';
import LiveRankingsBento from '../components/LiveRankingsBento';
import TournamentBracketModal from '../components/TournamentBracketModal';
import {
  INITIAL_MATCHES,
  INITIAL_GRADE_SCORES,
  INITIAL_CLASS_RANKINGS
} from '../lib/mockData';
import { Match, GradeScore, ClassRanking } from '../lib/types';
import { addRankingScore } from '../lib/supabase';
import { Swords, Calendar, HelpCircle, Bell, Heart } from 'lucide-react';

export default function SportsDayPage() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [gradeScores, setGradeScores] = useState<GradeScore[]>(INITIAL_GRADE_SCORES);
  const [classRankings, setClassRankings] = useState<ClassRanking[]>(INITIAL_CLASS_RANKINGS);
  const [isBracketOpen, setIsBracketOpen] = useState<boolean>(false);

  // Initialize theme from system or default dark
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Calculate total Blue & White team points
  const totalBlue = gradeScores.reduce((sum, g) => sum + g.blueScore, 0);
  const totalWhite = gradeScores.reduce((sum, g) => sum + g.whiteScore, 0);

  // Handler for live score updates (+1, -1)
  const handleScoreUpdate = (matchId: string, team: 'A' | 'B', delta: number) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        return {
          ...m,
          scoreA: team === 'A' ? Math.max(0, m.scoreA + delta) : m.scoreA,
          scoreB: team === 'B' ? Math.max(0, m.scoreB + delta) : m.scoreB,
        };
      })
    );
  };

  // Handler for completing a match & awarding points to grade and class
  const handleFinishMatch = (matchId: string, winner: 'blue' | 'white') => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return;

    const points = targetMatch.pointsForWinner || 100;
    const winningTeam = winner === 'blue' ? targetMatch.teamA : targetMatch.teamB;

    // 1. Update Match status
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        return {
          ...m,
          status: 'completed',
          winner,
        };
      })
    );

    // 2. Award points to Grade Score
    setGradeScores((prev) =>
      prev.map((gs) => {
        if (gs.grade !== winningTeam.grade) return gs;
        return {
          ...gs,
          blueScore: winner === 'blue' ? gs.blueScore + points : gs.blueScore,
          whiteScore: winner === 'white' ? gs.whiteScore + points : gs.whiteScore,
          goldMedals: gs.goldMedals + 1,
        };
      })
    );

    // 3. Award points to Class Ranking
    setClassRankings((prev) => {
      const updated = prev.map((cr) => {
        if (cr.grade === winningTeam.grade && cr.classNum === winningTeam.classNum) {
          return {
            ...cr,
            score: cr.score + points,
            wins: cr.wins + 1,
          };
        }
        return cr;
      });

      // Re-sort and recalculate rank
      updated.sort((a, b) => b.score - a.score);
      return updated.map((cr, idx) => ({ ...cr, rank: idx + 1 }));
    });

    // 4. Also register to Supabase rankings
    const nickname = `${winningTeam.grade}학년 ${winningTeam.classNum}반 (${winner === 'blue' ? '청군' : '백군'})`;
    addRankingScore(nickname, points).catch(() => {});
  };

  return (
    <main className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 relative">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-2/3 left-1/3 w-80 h-80 bg-rose-500/10 dark:bg-rose-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Notification Announcement */}
      <div className="mb-4 glass-card px-4 py-2.5 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="font-bold text-amber-600 dark:text-amber-400">[실시간 공지]</span>
          <span className="truncate">
            잠시 후 15:30부터 학년 대항 줄다리기 4강전이 중앙 운동장에서 진행됩니다!
          </span>
        </div>
        <button
          onClick={() => setIsBracketOpen(true)}
          className="hidden sm:flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
        >
          <Swords className="w-3.5 h-3.5" />
          <span>전체 토너먼트 트리 보기</span>
        </button>
      </div>

      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        totalBlue={totalBlue}
        totalWhite={totalWhite}
      />

      {/* Hero Section: Total Points & Tug of War Gauge */}
      <ScoreHero
        totalBlue={totalBlue}
        totalWhite={totalWhite}
        gradeScores={gradeScores}
      />

      {/* Bento Grid Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Bento Card 1: Matches and Brackets (8 cols) */}
        <div className="lg:col-span-8">
          <MatchesBento
            matches={matches}
            onScoreUpdate={handleScoreUpdate}
            onFinishMatch={handleFinishMatch}
          />
        </div>

        {/* Bento Card 2: Grade and Class Rankings (4 cols) */}
        <div className="lg:col-span-4">
          <GradeRankingsBento
            gradeScores={gradeScores}
            classRankings={classRankings}
          />
        </div>
      </div>

      {/* Secondary Bento Grid: Community Board & Hall of Fame Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Bento Card 3: Cheering Community Board (Supabase posts) (6 cols) */}
        <div className="lg:col-span-6">
          <CheeringBoardBento />
        </div>

        {/* Bento Card 4: Live Hall of Fame Rankings (Supabase rankings) (6 cols) */}
        <div className="lg:col-span-6">
          <LiveRankingsBento />
        </div>
      </div>

      {/* Footer Info & Timetable */}
      <footer className="glass-panel p-6 text-xs text-slate-500 dark:text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black">
            무
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">
              무선중학교 체육대회 운영본부
            </div>
            <div className="text-[11px] text-slate-400">
              Vercel Seoul Region (icn1) • Supabase Seoul Region (ap-northeast-2)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setIsBracketOpen(true)}
            className="hover:text-indigo-500 transition-colors flex items-center gap-1"
          >
            <Swords className="w-3.5 h-3.5" /> 대진표 안내
          </button>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> 공정하고 즐거운 축제
          </span>
          <span>•</span>
          <span>© 2026 무선중학교</span>
        </div>
      </footer>

      {/* Tournament Bracket Modal */}
      <TournamentBracketModal
        isOpen={isBracketOpen}
        onClose={() => setIsBracketOpen(false)}
        matches={matches}
      />
    </main>
  );
}
