'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Send, User, Clock, Sparkles } from 'lucide-react';
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
    <div className="glass-panel p-6 flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          <span className="p-2.5 rounded-xl bg-pink-500/10 text-pink-500 dark:text-pink-400">
            <MessageSquare className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                실시간 전교생 응원 및 소통 게시판
              </h2>
              {isSupabaseConfigured && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Supabase DB 연동
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              18개 학급 친구들과 선후배, 선생님을 향한 따뜻하고 열정적인 응원 한마디를 남겨주세요!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>실시간 응원글 {posts.length}건 등록됨</span>
        </div>
      </div>

      {/* Main 2-column layout on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cheer Writing Form (5 cols on lg) */}
        <div className="lg:col-span-5">
          <form onSubmit={handleCreatePost} className="glass-card p-5 space-y-3 sticky top-24">
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>✍️ 응원 메시지 남기기</span>
            </h3>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  작성자 (학급 / 닉네임)
                </label>
                <input
                  type="text"
                  placeholder="예: 2학년 3반 응원단장, 체육부장"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full glass-input px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  응원 한마디 제목
                </label>
                <input
                  type="text"
                  placeholder="예: 3학년 1반 축구 결승 무조건 우승 가자!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full glass-input px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  응원 내용
                </label>
                <textarea
                  placeholder="신나고 따뜻한 응원의 메시지를 자유롭게 남겨주세요!"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={3}
                  className="w-full glass-input px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/20 transition-all active:scale-98"
            >
              <Send className="w-3.5 h-3.5" />
              <span>응원글 등록하기</span>
            </button>
          </form>
        </div>

        {/* Right: Posts Feed Grid (7 cols on lg) */}
        <div className="lg:col-span-7">
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">응원 메시지 불러오는 중...</div>
            ) : posts.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">첫 번째 응원 메시지를 남겨보세요!</div>
            ) : (
              posts.map((post) => {
                const hasLiked = likedIds.has(post.id);

                return (
                  <div
                    key={post.id}
                    className="glass-card p-4 flex flex-col justify-between hover:border-pink-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
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

                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800/60 text-[11px]">
                      <span className="text-[10px] text-slate-400">#무선중 #18개학급리그 #함께하는체육대회</span>
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-semibold ${
                          hasLiked
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold'
                            : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>좋아요 {post.likes}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
