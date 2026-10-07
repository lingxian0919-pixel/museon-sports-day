export interface Team {
  name: string;
  grade: number; // 1, 2, 3
  classNum: number; // 1학년: 1~5, 2학년: 1~7, 3학년: 1~6
}

export type MatchStatus = 'scheduled' | 'in_progress' | 'completed';

export interface Match {
  id: string;
  sport: string;
  round: '예선' | '8강' | '4강' | '3·4위전' | '결승' | '리그전';
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  status: MatchStatus;
  winnerTeam?: 'teamA' | 'teamB' | 'draw';
  time: string;
  court: string;
  pointsForWinner: number;
  grade?: number; // 1, 2, 3
  matchNumber?: number; // 1, 2, 3, 4 ...
  matchLetter?: string; // 'a', 'b', 'c', 'd', 'e', 'f'
  bracketLabel?: string; // e.g. '① 예선', '② 4강 1경기', '③ 4강 2경기', '④ 결승전'
  sourceMatchAId?: string; // id of match whose winner feeds into teamA
  sourceMatchBId?: string; // id of match whose winner feeds into teamB
}


export interface SportCategory {
  id: string;
  name: string;
  iconName: string;
  category: string;
  totalPoints: number;
  description: string;
}

export interface GradeScore {
  grade: number;
  totalScore: number;
  goldMedals: number;
  silverMedals: number;
  bronzeMedals: number;
  classesCount: number; // 1학년: 5, 2학년: 7, 3학년: 6
}

export interface ClassRanking {
  rank: number;
  grade: number;
  classNum: number;
  score: number;
  wins: number;
  losses: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
}

export interface RankingItem {
  id: string;
  nickname: string;
  score: number;
  played_at: string;
}
