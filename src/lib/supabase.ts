import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Post, RankingItem } from './types';
import { INITIAL_POSTS, INITIAL_RANKINGS } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEY_POSTS = 'museon_sports_posts';
const STORAGE_KEY_RANKINGS = 'museon_sports_rankings';

export async function getPosts(): Promise<Post[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Post[];
      }
    } catch {
      // Fallback to local storage
    }
  }

  // Client-side local storage fallback
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEY_POSTS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_POSTS));
  }
  return INITIAL_POSTS;
}

export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'likes'>): Promise<Post> {
  const newPost: Post = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`,
    title: post.title,
    content: post.content,
    author: post.author || '익명의 학생',
    created_at: new Date().toISOString(),
    likes: 0,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          title: newPost.title,
          content: newPost.content,
          author: newPost.author,
          likes: 0
        }])
        .select()
        .single();

      if (!error && data) {
        return data as Post;
      }
    } catch {
      // Fallback to local save
    }
  }

  if (typeof window !== 'undefined') {
    const existing = await getPosts();
    const updated = [newPost, ...existing];
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(updated));
  }

  return newPost;
}

export async function likePost(postId: string): Promise<number> {
  if (supabase) {
    try {
      const { data: current } = await supabase
        .from('posts')
        .select('likes')
        .eq('id', postId)
        .single();

      const newLikes = (current?.likes || 0) + 1;
      const { error } = await supabase
        .from('posts')
        .update({ likes: newLikes })
        .eq('id', postId);

      if (!error) return newLikes;
    } catch {
      // Fallback
    }
  }

  if (typeof window !== 'undefined') {
    const existing = await getPosts();
    const target = existing.find(p => p.id === postId);
    if (target) {
      target.likes += 1;
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(existing));
      return target.likes;
    }
  }
  return 1;
}

export async function getRankings(): Promise<RankingItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('score', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as RankingItem[];
      }
    } catch {
      // Fallback
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEY_RANKINGS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    localStorage.setItem(STORAGE_KEY_RANKINGS, JSON.stringify(INITIAL_RANKINGS));
  }
  return INITIAL_RANKINGS;
}

export async function addRankingScore(nickname: string, score: number): Promise<RankingItem[]> {
  const newItem: RankingItem = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `r-${Date.now()}`,
    nickname,
    score,
    played_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('rankings').insert([{
        nickname,
        score,
      }]);
      return await getRankings();
    } catch {
      // Fallback
    }
  }

  if (typeof window !== 'undefined') {
    const current = await getRankings();
    const existingIndex = current.findIndex(r => r.nickname === nickname);
    if (existingIndex >= 0) {
      current[existingIndex].score += score;
    } else {
      current.push(newItem);
    }
    current.sort((a, b) => b.score - a.score);
    localStorage.setItem(STORAGE_KEY_RANKINGS, JSON.stringify(current));
    return current;
  }

  return INITIAL_RANKINGS;
}

// ==========================================
// Matches & Sport Rankings DB Sync Layer
// ==========================================

import { Match, SportRankingEntry, MatchStatus } from './types';

export function matchToDb(m: Match) {
  return {
    id: m.id,
    sport: m.sport,
    round: m.round,
    team_a: m.teamA,
    team_b: m.teamB,
    score_a: m.scoreA,
    score_b: m.scoreB,
    status: m.status,
    winner_team: m.winnerTeam || null,
    time: m.time || '',
    court: m.court || '',
    points_for_winner: m.pointsForWinner || 100,
    grade: m.grade || 1,
    match_number: m.matchNumber || null,
    match_letter: m.matchLetter || null,
    bracket_label: m.bracketLabel || null,
    source_match_a_id: m.sourceMatchAId || null,
    source_match_b_id: m.sourceMatchBId || null,
    updated_at: new Date().toISOString(),
  };
}

export function dbToMatch(row: any): Match {
  return {
    id: row.id,
    sport: row.sport,
    round: row.round,
    teamA: typeof row.team_a === 'string' ? JSON.parse(row.team_a) : row.team_a,
    teamB: typeof row.team_b === 'string' ? JSON.parse(row.team_b) : row.team_b,
    scoreA: Number(row.score_a) || 0,
    scoreB: Number(row.score_b) || 0,
    status: (row.status as MatchStatus) || 'scheduled',
    winnerTeam: (row.winner_team as 'teamA' | 'teamB' | 'draw') || undefined,
    time: row.time || '',
    court: row.court || '',
    pointsForWinner: Number(row.points_for_winner) || 100,
    grade: Number(row.grade) || 1,
    matchNumber: row.match_number !== null && row.match_number !== undefined ? Number(row.match_number) : undefined,
    matchLetter: row.match_letter || undefined,
    bracketLabel: row.bracket_label || undefined,
    sourceMatchAId: row.source_match_a_id || undefined,
    sourceMatchBId: row.source_match_b_id || undefined,
  };
}

export function sportRankingToDb(r: SportRankingEntry) {
  return {
    id: r.id,
    sport_id: r.sportId,
    grade: r.grade,
    class_num: r.classNum,
    rank: r.rank,
    record: r.record || '',
    points: r.points,
    updated_at: new Date().toISOString(),
  };
}

export function dbToSportRanking(row: any): SportRankingEntry {
  return {
    id: row.id,
    sportId: row.sport_id,
    grade: Number(row.grade) || 1,
    classNum: Number(row.class_num) || 1,
    rank: Number(row.rank) || 0,
    record: row.record || '',
    points: Number(row.points) || 0,
  };
}

export async function verifyScorerPin(pin: string): Promise<boolean> {
  if (!supabase) return pin === '2026';
  try {
    const { data, error } = await supabase.rpc('verify_scorer_pin', { pin });
    if (error) {
      console.warn('verify_scorer_pin error:', error);
      return pin === '2026';
    }
    return Boolean(data);
  } catch {
    return pin === '2026';
  }
}

export async function fetchMatchesFromDb(): Promise<Match[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('grade', { ascending: true })
      .order('match_number', { ascending: true });

    if (error || !data || data.length === 0) {
      return null;
    }
    return data.map(dbToMatch);
  } catch (err) {
    console.error('fetchMatchesFromDb error:', err);
    return null;
  }
}

export async function fetchSportRankingsFromDb(): Promise<SportRankingEntry[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('sport_rankings')
      .select('*')
      .order('grade', { ascending: true })
      .order('class_num', { ascending: true });

    if (error || !data || data.length === 0) {
      return null;
    }
    return data.map(dbToSportRanking);
  } catch (err) {
    console.error('fetchSportRankingsFromDb error:', err);
    return null;
  }
}

export async function updateMatchScoreInDb(
  matchId: string,
  scoreA: number,
  scoreB: number,
  status: string,
  pin: string
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.rpc('rpc_update_match_score', {
    p_match_id: matchId,
    p_score_a: scoreA,
    p_score_b: scoreB,
    p_status: status,
    p_pin: pin,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function finishMatchInDb(
  matchId: string,
  winner: 'teamA' | 'teamB',
  pin: string
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.rpc('rpc_finish_match', {
    p_match_id: matchId,
    p_winner: winner,
    p_pin: pin,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function cancelWinnerInDb(
  matchId: string,
  pin: string
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.rpc('rpc_cancel_winner', {
    p_match_id: matchId,
    p_pin: pin,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function updateMatchStatusInDb(
  matchId: string,
  status: string,
  pin: string
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.rpc('rpc_update_match_status', {
    p_match_id: matchId,
    p_status: status,
    p_pin: pin,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function updateSportRankingInDb(
  id: string,
  rank: number,
  record: string,
  points: number,
  pin: string
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.rpc('rpc_update_sport_ranking', {
    p_id: id,
    p_rank: rank,
    p_record: record,
    p_points: points,
    p_pin: pin,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function resetAllDataInDb(
  cleanMatches: Match[],
  cleanRankings: SportRankingEntry[],
  pin: string
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.rpc('rpc_reset_all_data', {
    p_clean_matches: cleanMatches.map(matchToDb),
    p_clean_rankings: cleanRankings.map(sportRankingToDb),
    p_pin: pin,
  });
  if (error) {
    throw new Error(error.message);
  }
}
