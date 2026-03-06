import type { Metadata, Viewport } from "next";
import { Montserrat, Noto_Sans_JP, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: '#FF2D78',
}

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
    <html lang="ja" className="dark" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${notoSansJP.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
