import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '무선중 체육대회 | 실시간 대진표 & 점수 현황',
  description: '무선중학교 체육대회 실시간 대진표, 종목별 진행상황 및 학년별 종합 랭킹 공유 플랫폼',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
