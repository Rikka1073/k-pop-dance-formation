'use client'

import { Header } from '@/components/layout'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">利用規約</h1>

        <div className="prose prose-invert prose-pink max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">第1条（適用）</h2>
            <p className="text-gray-300 leading-relaxed">
              本規約は、本サービス「K-POP Formation Viewer」（以下「本サービス」）の利用に関する条件を定めるものです。
              ユーザーは本規約に同意した上で本サービスを利用するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">第2条（サービス内容）</h2>
            <p className="text-gray-300 leading-relaxed">
              本サービスは、K-POPダンスのフォーメーションをYouTube動画と同期して可視化するツールを提供します。
              本サービスはYouTube IFrame APIを使用しており、YouTube利用規約が適用されます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">第3条（禁止事項）</h2>
            <p className="text-gray-300 leading-relaxed mb-3">ユーザーは以下の行為を行ってはなりません。</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>法令または公序良俗に違反する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>他のユーザーまたは第三者の権利を侵害する行為</li>
              <li>不正アクセスまたはそれに類する行為</li>
              <li>本サービスを商業目的で無断利用する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">第4条（知的財産権）</h2>
            <p className="text-gray-300 leading-relaxed">
              本サービス上で表示される動画コンテンツの著作権は、各権利者に帰属します。
              本サービスはYouTubeの公式APIを通じて動画を埋め込み表示しており、動画の複製・ダウンロードは行いません。
              ユーザーが作成したフォーメーションデータの著作権は、当該ユーザーに帰属します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">第5条（免責事項）</h2>
            <p className="text-gray-300 leading-relaxed">
              本サービスは現状有姿で提供され、運営者は本サービスの完全性、正確性、有用性について保証しません。
              本サービスの利用により生じた損害について、運営者は一切の責任を負いません。
              本サービスは予告なく変更、中断、終了する場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">第6条（規約の変更）</h2>
            <p className="text-gray-300 leading-relaxed">
              運営者は、必要に応じて本規約を変更することができます。
              変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <p className="text-gray-500 text-sm pt-8 border-t border-gray-800">
            制定日：2025年2月10日
          </p>
        </div>
      </main>
    </div>
  )
}
