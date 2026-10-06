export type TeamColor = 'blue' | 'white';

export interface Team {
  name: string;
  grade: number; // 1, 2, 3
  classNum: number;
  color: TeamColor;
}

export type MatchStatus = 'scheduled' | 'in_progress' | 'completed';

export interface Match {
  id: string;
  sport: string;
  round: '8강' | '4강' | '3·4위전' | '결승' | '리그전';
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  status: MatchStatus;
  winner?: TeamColor | 'draw';
  time: string;
  court: string;
  pointsForWinner: number;
}

export interface SportCategory {
  id: string;
  name: string;
  iconName: string;
  category: '구기종목' | '육상' | '민속/단체' | 'e스포츠';
  totalPoints: number;
  description: string;
}

export interface GradeScore {
  grade: number;
  blueScore: number;
  whiteScore: number;
  totalScore: number;
  goldMedals: number;
  silverMedals: number;
  bronzeMedals: number;
}

export interface ClassRanking {
  rank: number;
  grade: number;
  classNum: number;
  color: TeamColor;
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
