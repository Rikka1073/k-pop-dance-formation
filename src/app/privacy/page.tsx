'use client'

import { Header } from '@/components/layout'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">プライバシーポリシー</h1>

        <div className="prose prose-invert prose-pink max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. はじめに</h2>
            <p className="text-gray-300 leading-relaxed">
              本プライバシーポリシーは、本サービス「K-POP Formation Viewer」におけるユーザー情報の取り扱いについて説明します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. 収集する情報</h2>
            <p className="text-gray-300 leading-relaxed mb-3">本サービスでは以下の情報を収集する場合があります。</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時）</li>
              <li>ユーザーが作成したフォーメーションデータ</li>
              <li>Cookieによる利用状況データ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. 情報の利用目的</h2>
            <p className="text-gray-300 leading-relaxed mb-3">収集した情報は以下の目的で利用します。</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>サービスの提供・改善</li>
              <li>利用状況の分析</li>
              <li>不正利用の防止</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. 第三者サービス</h2>
            <p className="text-gray-300 leading-relaxed mb-3">本サービスは以下の第三者サービスを利用しています。</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <span className="text-white">YouTube IFrame API</span>
                <span className="text-gray-400">（動画の埋め込み表示）</span>
                <br />
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 text-sm"
                >
                  Google プライバシーポリシー
                </a>
              </li>
              <li>
                <span className="text-white">Vercel</span>
                <span className="text-gray-400">（ホスティング）</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Cookieの使用</h2>
            <p className="text-gray-300 leading-relaxed">
              本サービスはCookieを使用する場合があります。
              ブラウザの設定によりCookieを無効にすることができますが、一部機能が制限される場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. データの保護</h2>
            <p className="text-gray-300 leading-relaxed">
              ユーザー情報の保護のため、適切なセキュリティ対策を講じています。
              ただし、インターネット上での完全なセキュリティを保証するものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. ポリシーの変更</h2>
            <p className="text-gray-300 leading-relaxed">
              本ポリシーは予告なく変更される場合があります。
              変更後のポリシーは、本サービス上に掲載した時点で効力を生じます。
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
