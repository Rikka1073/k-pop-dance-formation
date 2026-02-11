'use client'

import { useState } from 'react'
import { Header } from '@/components/layout'
import { LanguageToggle } from '@/components/ui'

const content = {
  ja: {
    title: '利用規約',
    sections: [
      {
        heading: '第1条（適用）',
        body: '本規約は、本サービス「K-POP Formation Viewer」（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本規約に同意した上で本サービスを利用するものとします。',
      },
      {
        heading: '第2条（サービス内容）',
        body: '本サービスは、K-POPダンスのフォーメーションをYouTube動画と同期して可視化するツールを提供します。本サービスはYouTube IFrame APIを使用しており、YouTube利用規約が適用されます。',
      },
      {
        heading: '第3条（禁止事項）',
        body: 'ユーザーは以下の行為を行ってはなりません。',
        list: [
          '法令または公序良俗に違反する行為',
          '本サービスの運営を妨害する行為',
          '他のユーザーまたは第三者の権利を侵害する行為',
          '不正アクセスまたはそれに類する行為',
          '本サービスを商業目的で無断利用する行為',
        ],
      },
      {
        heading: '第4条（知的財産権）',
        body: '本サービス上で表示される動画コンテンツの著作権は、各権利者に帰属します。本サービスはYouTubeの公式APIを通じて動画を埋め込み表示しており、動画の複製・ダウンロードは行いません。ユーザーが作成したフォーメーションデータの著作権は、当該ユーザーに帰属します。',
      },
      {
        heading: '第5条（免責事項）',
        body: '本サービスは現状有姿で提供され、運営者は本サービスの完全性、正確性、有用性について保証しません。本サービスの利用により生じた損害について、運営者は一切の責任を負いません。本サービスは予告なく変更、中断、終了する場合があります。',
      },
      {
        heading: '第6条（規約の変更）',
        body: '運営者は、必要に応じて本規約を変更することができます。変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。',
      },
    ],
    effectiveDate: '制定日：2025年2月10日',
  },
  en: {
    title: 'Terms of Service',
    sections: [
      {
        heading: 'Article 1 (Application)',
        body: 'These Terms of Service set forth the conditions for using "K-POP Formation Viewer" (hereinafter referred to as "the Service"). Users shall use the Service upon agreeing to these Terms.',
      },
      {
        heading: 'Article 2 (Service Description)',
        body: 'The Service provides a tool to visualize K-POP dance formations synchronized with YouTube videos. The Service uses the YouTube IFrame API and is subject to the YouTube Terms of Service.',
      },
      {
        heading: 'Article 3 (Prohibited Activities)',
        body: 'Users shall not engage in the following activities:',
        list: [
          'Activities that violate laws or public order and morals',
          'Activities that interfere with the operation of the Service',
          'Activities that infringe on the rights of other users or third parties',
          'Unauthorized access or similar activities',
          'Unauthorized commercial use of the Service',
        ],
      },
      {
        heading: 'Article 4 (Intellectual Property Rights)',
        body: 'Copyrights of video content displayed on the Service belong to their respective rights holders. The Service embeds videos through the official YouTube API and does not copy or download videos. Copyrights of formation data created by users belong to those users.',
      },
      {
        heading: 'Article 5 (Disclaimer)',
        body: 'The Service is provided "as is," and the operator does not guarantee the completeness, accuracy, or usefulness of the Service. The operator shall not be liable for any damages arising from the use of the Service. The Service may be changed, suspended, or terminated without prior notice.',
      },
      {
        heading: 'Article 6 (Changes to Terms)',
        body: 'The operator may change these Terms as necessary. The revised Terms shall take effect upon posting on the Service.',
      },
    ],
    effectiveDate: 'Effective Date: February 10, 2025',
  },
}

export default function TermsPage() {
  const [lang, setLang] = useState<'ja' | 'en'>('ja')
  const t = content[lang]

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">{t.title}</h1>
          <LanguageToggle lang={lang} onToggle={setLang} />
        </div>

        <div className="prose prose-invert prose-pink max-w-none space-y-8">
          {t.sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-xl font-semibold text-white mb-4">{section.heading}</h2>
              <p className="text-gray-300 leading-relaxed">{section.body}</p>
              {section.list && (
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-3">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <p className="text-gray-500 text-sm pt-8 border-t border-gray-800">
            {t.effectiveDate}
          </p>
        </div>
      </main>
    </div>
  )
}
