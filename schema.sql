-- 무선중 체육대회 데이터베이스 스키마 및 RLS 정책
-- Supabase SQL Editor에서 실행 가능한 스크립트입니다.

-- 1. 게시물 테이블 (id, title, content, author, created_at, likes)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  likes integer default 0 not null
);

-- 2. 점수 랭킹 테이블 (id, nickname, score, played_at)
create table if not exists public.rankings (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  score integer default 0 not null,
  played_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) 활성화
alter table public.posts enable row level security;
alter table public.rankings enable row level security;

-- 공용 읽기 및 작성 정책 설정
drop policy if exists "Allow public read posts" on public.posts;
create policy "Allow public read posts" on public.posts for select using (true);

drop policy if exists "Allow public insert posts" on public.posts;
create policy "Allow public insert posts" on public.posts for insert with check (true);

drop policy if exists "Allow public update posts" on public.posts;
create policy "Allow public update posts" on public.posts for update using (true);

drop policy if exists "Allow public read rankings" on public.rankings;
create policy "Allow public read rankings" on public.rankings for select using (true);

drop policy if exists "Allow public insert rankings" on public.rankings;
create policy "Allow public insert rankings" on public.rankings for insert with check (true);

-- 초기 샘플 데이터
insert into public.posts (title, content, author, likes) values
('3학년 1반 축구 4강 진출 축하!!', '역전골 터졌을 때 전율이었습니다. 결승까지 가자!', '무선중응원단장', 18),
('점심시간 이어달리기 예선 안내', '각 반 대표 선수들은 12시 40분까지 운동장 본부석으로 집합 바랍니다.', '체육부장선생님', 24),
('2학년 피구 결승전 명승부', '마지막 1명 남았을 때 수비 대박이었음 ㄷㄷ 모두 수고했어요!', '2-3반장', 12);

insert into public.rankings (nickname, score, played_at) values
('3학년 1반 (청군)', 380, now()),
('2학년 4반 (백군)', 350, now()),
('1학년 2반 (청군)', 310, now()),
('3학년 3반 (백군)', 290, now()),
('2학년 1반 (청군)', 270, now()),
('1학년 5반 (백군)', 240, now());
