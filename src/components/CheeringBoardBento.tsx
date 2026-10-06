'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Send, User, Clock } from 'lucide-react';
import { Post } from '../lib/types';
import { getPosts, createPost, likePost, isSupabaseConfigured } from '../lib/supabase';

export default function CheeringBoardBento() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const newPost = await createPost({
        title: title.trim(),
        content: content.trim(),
        author: author.trim() || '익명의 무선인',
      });
      setPosts([newPost, ...posts]);
      setTitle('');
      setContent('');
      setAuthor('');
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (likedIds.has(postId)) return;

    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
    setLikedIds(prev => new Set(prev).add(postId));

    try {
      await likePost(postId);
    } catch {
      // ignore
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return '방금 전';
    }
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-full">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-pink-500/10 text-pink-500 dark:text-pink-400">
            <MessageSquare className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              실시간 학급 응원 게시판
              {isSupabaseConfigured && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                  DB 연동
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              18개 학급 친구들과 선후배를 향한 응원의 메시지를 남겨보세요!
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          총 {posts.length}개 응원글
        </span>
      </div>

      {/* Post Form */}
      <form onSubmit={handleCreatePost} className="glass-card p-4 mb-4 space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="작성자 (예: 2-3 응원단)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="glass-input px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="제목 (예: 3학년 1반 결승 파이팅!)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="sm:col-span-2 glass-input px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          <textarea
            placeholder="따뜻하고 활기찬 응원 메시지를 남겨주세요!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={2}
            className="flex-1 glass-input px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-indigo-500/20 transition-transform active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">등록</span>
          </button>
        </div>
      </form>

      {/* Cheering Post List */}
      <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">응원 메시지 불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">첫 번째 응원 메시지를 남겨보세요!</div>
        ) : (
          posts.map((post) => {
            const hasLiked = likedIds.has(post.id);

            return (
              <div
                key={post.id}
                className="glass-card p-3.5 flex flex-col justify-between hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 shrink-0">
                    <span className="flex items-center gap-0.5">
                      <User className="w-3 h-3 text-slate-400" /> {post.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-slate-400" /> {formatDate(post.created_at)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-[10px] text-slate-400">#무선중 #18개학급 #실시간응원</span>
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                      hasLiked
                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
