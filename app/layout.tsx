import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '小D｜音视频转录整理助手',
  description: '把视频、播客和会议录音整理成分享式提纯稿的 AI Agent 静态展示页。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
