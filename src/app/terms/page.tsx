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
        body: '本規約は、運営者が提供するウェブサービス「K-POP Formation Viewer」（以下「本サービス」）の利用条件を定めるものです。本サービスを利用した時点で、ユーザーは本規約に同意したものとみなします。未成年のユーザーは、保護者の同意を得た上でご利用ください。',
      },
      {
        heading: '第2条（サービスの性質）',
        body: '本サービスは、ダンスフォーメーションの位置情報（座標データ）を作成・閲覧するためのツールです。本サービスは動画コンテンツを保有・配信するものではなく、YouTube IFrame APIを通じて公式に埋め込んだ動画を表示します。本サービスが提供するのはあくまで「フォーメーション可視化ツール」であり、K-POPアーティストの映像・楽曲・振付の権利は各権利者に帰属します。',
      },
      {
        heading: '第3条（YouTubeコンテンツについて）',
        body: '本サービスはGoogle LLCが提供するYouTube IFrame APIを利用しており、YouTube利用規約（https://www.youtube.com/t/terms）およびGoogleプライバシーポリシーが適用されます。本サービスは動画の複製・ダウンロード・再配布を一切行いません。YouTube上で権利者によって削除・制限された動画は本サービス上でも表示されません。',
      },
      {
        heading: '第4条（ユーザー投稿コンテンツ）',
        body: 'ユーザーが本サービス上で作成・投稿するフォーメーションデータ（座標・タイミング情報等）の著作権は、当該ユーザーに帰属します。ただし、ユーザーは運営者に対し、本サービスの運営・改善・宣伝のために当該データを無償で利用する権利を許諾するものとします。運営者は、法令に基づく場合または権利者からの正当な削除要請がある場合、事前通知なくコンテンツを削除できるものとします。',
      },
      {
        heading: '第5条（知的財産権と著作権への配慮）',
        body: 'K-POPアーティストの楽曲・映像・振付に関する著作権は、各レーベル・アーティスト・権利者に帰属します。本サービスはファン活動支援を目的としたツールですが、運営者はこれらの権利を侵害する意図を持たず、権利者からの申し立てがあった場合は誠実に対応します。著作権侵害の申告は、本ページ下部の連絡先までお知らせください。',
      },
      {
        heading: '第6条（禁止事項）',
        body: 'ユーザーは以下の行為を行ってはなりません。',
        list: [
          '法令または公序良俗に違反する行為',
          '本サービスの運営・システムを妨害する行為',
          '他のユーザーまたは第三者の権利・名誉・プライバシーを侵害する行為',
          '不正アクセスやリバースエンジニアリング等の行為',
          '虚偽の情報を投稿する行為',
          '権利者に無断でK-POPコンテンツを商業利用する行為',
          'その他、運営者が不適切と判断する行為',
        ],
      },
      {
        heading: '第7条（有料サービスについて）',
        body: '本サービスは現在無料で提供していますが、将来的に一部機能を有料化する場合があります。有料サービスの内容・料金・決済方法については、導入時に別途告知します。有料サービスの利用にあたっては、追加の利用規約が適用される場合があります。',
      },
      {
        heading: '第8条（免責事項）',
        body: '本サービスは現状有姿で提供されます。運営者は、本サービスの正確性・継続性・安全性について保証しません。本サービスの利用によって生じた損害（権利者からの申し立てを含む）について、運営者は故意または重大な過失がある場合を除き、責任を負いません。本サービスは予告なく変更・中断・終了する場合があります。',
      },
      {
        heading: '第9条（個人情報の取り扱い）',
        body: '運営者は、本サービスの利用に際して取得した情報（アクセスログ等）を、サービス改善および統計分析の目的で利用します。第三者への販売・提供は行いません。詳細はプライバシーポリシーをご確認ください。',
      },
      {
        heading: '第10条（規約の変更）',
        body: '運営者は、必要に応じて本規約を変更できます。重要な変更については、本サービス上での告知または登録メールアドレスへの通知を行います。変更後も本サービスを継続利用した場合、変更後の規約に同意したものとみなします。',
      },
      {
        heading: '第11条（準拠法・管轄）',
        body: '本規約は日本法に準拠して解釈されます。本サービスに関する紛争については、運営者の所在地を管轄する裁判所を専属的合意管轄裁判所とします。',
      },
    ],
    effectiveDate: '制定日：2026年2月10日　最終改訂：2026年3月19日',
  },
  en: {
    title: 'Terms of Service',
    sections: [
      {
        heading: 'Article 1 (Application)',
        body: 'These Terms of Service govern the use of "K-POP Formation Viewer" (the "Service") operated by the operator. By using the Service, users are deemed to have agreed to these Terms. Minors must obtain consent from a parent or guardian before use.',
      },
      {
        heading: 'Article 2 (Nature of the Service)',
        body: 'The Service is a tool for creating and viewing dance formation position data (coordinate data). The Service does not host or distribute video content. Videos are displayed solely through the official YouTube IFrame API. The Service provides a "formation visualization tool" only; all rights to K-POP artists\' videos, music, and choreography remain with their respective rights holders.',
      },
      {
        heading: 'Article 3 (YouTube Content)',
        body: 'The Service uses the YouTube IFrame API provided by Google LLC. YouTube\'s Terms of Service (https://www.youtube.com/t/terms) and Google\'s Privacy Policy apply. The Service does not copy, download, or redistribute any videos. Videos removed or restricted by rights holders on YouTube will not be accessible through the Service.',
      },
      {
        heading: 'Article 4 (User-Generated Content)',
        body: 'Copyright in formation data (coordinates, timing information, etc.) created and submitted by users belongs to those users. However, users grant the operator a royalty-free license to use such data for operating, improving, and promoting the Service. The operator may delete content without prior notice if required by law or upon a legitimate removal request from a rights holder.',
      },
      {
        heading: 'Article 5 (Intellectual Property and Copyright Consideration)',
        body: 'Copyrights in K-POP artists\' music, videos, and choreography belong to the respective labels, artists, and rights holders. The Service is a fan-support tool and the operator has no intention of infringing any such rights. The operator will respond in good faith to any claims from rights holders. Copyright infringement notices may be sent to the contact information at the bottom of this page.',
      },
      {
        heading: 'Article 6 (Prohibited Activities)',
        body: 'Users shall not engage in the following activities:',
        list: [
          'Violating laws or public order and morals',
          'Interfering with the operation or systems of the Service',
          'Infringing the rights, reputation, or privacy of other users or third parties',
          'Unauthorized access, reverse engineering, or similar acts',
          'Submitting false or misleading information',
          'Commercially exploiting K-POP content without authorization from rights holders',
          'Any other activities deemed inappropriate by the operator',
        ],
      },
      {
        heading: 'Article 7 (Paid Services)',
        body: 'The Service is currently free of charge. However, the operator may introduce paid features in the future. Details regarding pricing, payment methods, and the scope of paid features will be announced separately at the time of introduction. Additional terms may apply to paid services.',
      },
      {
        heading: 'Article 8 (Disclaimer)',
        body: 'The Service is provided "as is." The operator makes no warranties regarding its accuracy, continuity, or security. The operator shall not be liable for any damages arising from use of the Service (including claims from rights holders) except in cases of willful misconduct or gross negligence. The Service may be modified, suspended, or terminated without prior notice.',
      },
      {
        heading: 'Article 9 (Personal Information)',
        body: 'The operator uses information obtained through the Service (such as access logs) solely for improving the Service and statistical analysis. Such information will not be sold or provided to third parties. Please refer to the Privacy Policy for details.',
      },
      {
        heading: 'Article 10 (Changes to Terms)',
        body: 'The operator may revise these Terms as necessary. For significant changes, notice will be provided through the Service or by email to registered users. Continued use of the Service after changes constitutes acceptance of the revised Terms.',
      },
      {
        heading: 'Article 11 (Governing Law and Jurisdiction)',
        body: 'These Terms shall be governed by and construed in accordance with the laws of Japan. Any disputes relating to the Service shall be subject to the exclusive jurisdiction of the court having jurisdiction over the location of the operator.',
      },
    ],
    effectiveDate: 'Established: February 10, 2026 / Last Revised: March 19, 2026',
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
