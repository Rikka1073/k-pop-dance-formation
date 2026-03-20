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
        body: '本規約は、「K-POP Formation Viewer」（以下「本サービス」）の利用条件を定めるものです。本サービスはK-POPファンによるファンのためのツールとして個人が運営しています。ご利用の前に本規約をお読みいただき、同意の上でご利用ください。',
      },
      {
        heading: '第2条（サービスの性質）',
        body: '本サービスは、ダンスフォーメーションの位置情報（座標データ）を作成・閲覧するためのファン向けツールです。動画コンテンツの保有・配信は行わず、YouTube IFrame APIを通じて公式に埋め込んだ動画を表示します。K-POPアーティストの映像・楽曲・振付に関するすべての権利は各権利者に帰属します。本サービスはそれらを侵害する意図を持たず、あくまで学習・楽しむためのツール提供を目的としています。',
      },
      {
        heading: '第3条（YouTubeコンテンツについて）',
        body: '本サービスはGoogle LLCが提供するYouTube IFrame APIを利用しています。YouTube利用規約およびGoogleプライバシーポリシーが適用されます。本サービスは動画の複製・ダウンロード・再配布を行いません。YouTube上で削除・制限された動画は本サービス上でも表示されません。',
      },
      {
        heading: '第4条（ユーザーが作成したデータについて）',
        body: 'ユーザーが作成・投稿するフォーメーションデータ（座標・タイミング情報等）の著作権はそのユーザーに帰属します。ユーザーは運営者に対し、本サービスの運営・改善のためにデータを利用する権利を許諾するものとします。権利者からの正当な要請がある場合、運営者はコンテンツを削除することがあります。',
      },
      {
        heading: '第5条（著作権への配慮）',
        body: 'K-POPアーティストの楽曲・映像・振付に関する著作権は、各レーベル・アーティスト・権利者に帰属します。本サービスはファン活動を支援する趣旨で運営しており、権利者からの申し立てがあった場合は誠実に対応します。',
      },
      {
        heading: '第6条（禁止事項）',
        body: 'ユーザーは以下の行為を行ってはなりません。',
        list: [
          '法令または公序良俗に違反する行為',
          '本サービスの運営を妨害する行為',
          '他のユーザーまたは第三者の権利・プライバシーを侵害する行為',
          '不正アクセスやシステムへの攻撃行為',
          'その他、運営者が不適切と判断する行為',
        ],
      },
      {
        heading: '第7条（免責事項）',
        body: '本サービスは個人が趣味で運営するツールであり、現状有姿で提供されます。継続的な稼働や正確性を保証するものではなく、予告なく変更・中断・終了する場合があります。本サービスの利用によって生じた損害について、運営者は責任を負いません。',
      },
      {
        heading: '第8条（個人情報の取り扱い）',
        body: 'アクセスログ等の情報はサービス改善のためにのみ利用します。第三者への提供は行いません。',
      },
      {
        heading: '第9条（規約の変更）',
        body: '本規約は必要に応じて変更することがあります。重要な変更は本サービス上でお知らせします。変更後も継続利用した場合、変更に同意したものとみなします。',
      },
      {
        heading: '第10条（準拠法）',
        body: '本規約は日本法に準拠して解釈されます。',
      },
    ],
    effectiveDate: '制定日：2026年2月10日　最終改訂：2026年3月20日',
  },
  en: {
    title: 'Terms of Service',
    sections: [
      {
        heading: 'Article 1 (Application)',
        body: 'These Terms govern the use of "K-POP Formation Viewer" (the "Service"), a fan-made tool operated by an individual K-POP fan. Please read these Terms before use.',
      },
      {
        heading: 'Article 2 (Nature of the Service)',
        body: 'The Service is a fan tool for creating and viewing dance formation position data. It does not host or distribute video content — videos are displayed through the official YouTube IFrame API only. All rights to K-POP artists\' videos, music, and choreography remain with their respective rights holders. This Service is intended purely as a learning and enjoyment tool.',
      },
      {
        heading: 'Article 3 (YouTube Content)',
        body: 'The Service uses the YouTube IFrame API by Google LLC. YouTube\'s Terms of Service and Google\'s Privacy Policy apply. The Service does not copy, download, or redistribute videos. Videos removed or restricted on YouTube will not be available through the Service.',
      },
      {
        heading: 'Article 4 (User-Generated Content)',
        body: 'Copyright in formation data (coordinates, timing information, etc.) created and submitted by users belongs to those users. However, users grant the operator a royalty-free license to use such data for operating, improving, and promoting the Service. The operator may delete content without prior notice if required by law or upon a legitimate removal request from a rights holder.',
      },
      {
        heading: 'Article 5 (Intellectual Property and Copyright Consideration)',
        body: 'All rights to K-POP artists\' music, videos, and choreography belong to their respective labels, artists, and rights holders. This Service is operated as a fan tool with no intention of infringing those rights. The operator will respond in good faith to any claims from rights holders.',
      },
      {
        heading: 'Article 6 (Prohibited Activities)',
        body: 'Users shall not engage in the following activities:',
        list: [
          'Violating laws or public order and morals',
          'Interfering with the operation of the Service',
          'Infringing the rights or privacy of other users or third parties',
          'Unauthorized access or attacks on the Service',
          'Any other activities deemed inappropriate by the operator',
        ],
      },
      {
        heading: 'Article 7 (Disclaimer)',
        body: 'This Service is a personal hobby project provided "as is." The operator makes no guarantees regarding uptime or accuracy, and the Service may be changed or discontinued without notice. The operator is not liable for any damages arising from use of the Service.',
      },
      {
        heading: 'Article 8 (Personal Information)',
        body: 'Access logs and similar data are used solely to improve the Service and will not be shared with third parties.',
      },
      {
        heading: 'Article 9 (Changes to Terms)',
        body: 'These Terms may be updated as needed. Significant changes will be announced on the Service. Continued use after changes constitutes acceptance of the revised Terms.',
      },
      {
        heading: 'Article 10 (Governing Law)',
        body: 'These Terms are governed by the laws of Japan.',
      },
    ],
    effectiveDate: 'Established: February 10, 2026 / Last Revised: March 20, 2026',
  },
}

export default function TermsPage() {
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
