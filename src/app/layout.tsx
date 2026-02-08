import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'K-POP Formation Viewer',
    template: '%s | K-POP Formation Viewer',
  },
  description: 'K-POPダンスのフォーメーションを動画と同期して確認。カバーダンス練習に最適。',
  keywords: ['K-POP', 'フォーメーション', 'ダンス', 'カバーダンス', '振り付け', 'formation', 'dance'],
  authors: [{ name: 'Formation Viewer Team' }],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'K-POP Formation Viewer',
    title: 'K-POP Formation Viewer',
    description: 'K-POPダンスのフォーメーションを動画と同期して確認。カバーダンス練習に最適。',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K-POP Formation Viewer',
    description: 'K-POPダンスのフォーメーションを動画と同期して確認。カバーダンス練習に最適。',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
