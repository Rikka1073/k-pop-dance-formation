'use client'

import { useState } from 'react'
import { Header } from '@/components/layout'
import { LanguageToggle } from '@/components/ui'

const content = {
  ja: {
    title: 'プライバシーポリシー',
    sections: [
      {
        heading: '1. はじめに',
        body: '本プライバシーポリシーは、本サービス「K-POP Formation Viewer」におけるユーザー情報の取り扱いについて説明します。',
      },
      {
        heading: '2. 収集する情報',
        body: '本サービスでは以下の情報を収集する場合があります。',
        list: [
          'アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）',
          'ユーザーが作成したフォーメーションデータ',
          'Cookieによる利用状況データ',
        ],
      },
      {
        heading: '3. 情報の利用目的',
        body: '収集した情報は以下の目的で利用します。',
        list: [
          'サービスの提供・改善',
          '利用状況の分析',
          '不正利用の防止',
        ],
      },
      {
        heading: '4. 第三者サービス',
        body: '本サービスは以下の第三者サービスを利用しています。',
        list: [
          'YouTube IFrame API（動画の埋め込み表示）',
          'Vercel（ホスティング）',
        ],
        links: [
          { text: 'Google プライバシーポリシー', url: 'https://policies.google.com/privacy' },
        ],
      },
      {
        heading: '5. Cookieの使用',
        body: '本サービスはCookieを使用する場合があります。ブラウザの設定によりCookieを無効にすることができますが、一部機能が制限される場合があります。',
      },
      {
        heading: '6. データの保護',
        body: 'ユーザー情報の保護のため、適切なセキュリティ対策を講じています。ただし、インターネット上での完全なセキュリティを保証するものではありません。',
      },
      {
        heading: '7. ポリシーの変更',
        body: '本ポリシーは予告なく変更される場合があります。変更後のポリシーは、本サービス上に掲載した時点で効力を生じます。',
      },
    ],
    effectiveDate: '制定日：2025年2月10日',
  },
  en: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: '1. Introduction',
        body: 'This Privacy Policy explains how we handle user information in "K-POP Formation Viewer" (the Service).',
      },
      {
        heading: '2. Information We Collect',
        body: 'The Service may collect the following information:',
        list: [
          'Access logs (IP address, browser information, access time)',
          'Formation data created by users',
          'Usage data through cookies',
        ],
      },
      {
        heading: '3. Purpose of Use',
        body: 'We use the collected information for the following purposes:',
        list: [
          'Providing and improving the Service',
          'Analyzing usage patterns',
          'Preventing unauthorized use',
        ],
      },
      {
        heading: '4. Third-Party Services',
        body: 'The Service uses the following third-party services:',
        list: [
          'YouTube IFrame API (video embedding)',
          'Vercel (hosting)',
        ],
        links: [
          { text: 'Google Privacy Policy', url: 'https://policies.google.com/privacy' },
        ],
      },
      {
        heading: '5. Use of Cookies',
        body: 'The Service may use cookies. You can disable cookies through your browser settings, but some features may be limited.',
      },
      {
        heading: '6. Data Protection',
        body: 'We implement appropriate security measures to protect user information. However, we cannot guarantee complete security on the internet.',
      },
      {
        heading: '7. Changes to Policy',
        body: 'This Policy may be changed without prior notice. The revised Policy shall take effect upon posting on the Service.',
      },
    ],
    effectiveDate: 'Effective Date: February 10, 2025',
  },
}

export default function PrivacyPage() {
  const [lang, setLang] = useState<'ja' | 'en'>('ja')
  const t = content[lang]

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">{t.title}</h1>
          <LanguageToggle lang={lang} onToggle={setLang} />
        </div>

        <div className="prose prose-invert prose-pink max-w-none space-y-8">
          {t.sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">{section.heading}</h2>
              <p className="text-[var(--foreground-muted)] leading-relaxed">{section.body}</p>
              {section.list && (
                <ul className="list-disc list-inside text-[var(--foreground-muted)] space-y-2 mt-3">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {section.links && (
                <div className="mt-3">
                  {section.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 text-sm"
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </section>
          ))}

          <p className="text-[var(--foreground-muted)] text-sm pt-8 border-t border-[var(--card-border)]">
            {t.effectiveDate}
          </p>
        </div>
      </main>
    </div>
  )
}
