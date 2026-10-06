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
