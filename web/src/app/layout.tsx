import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Desert Convoy Cinematic',
  description: '15s camera choreography through a desert convoy',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
