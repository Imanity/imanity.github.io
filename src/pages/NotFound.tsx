import { ArrowRight } from 'lucide-react'

export function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">Lost in transit</p>
      <h1 aria-label="404 页面不存在" className="not-found-code">
        4<em>0</em>4
      </h1>
      <p>这个地址暂时没有内容，可以回到主页，或者去看看照片。</p>
      <div className="hero-actions">
        <a className="button button-primary" href="/">
          回到主页
          <ArrowRight aria-hidden="true" size={17} strokeWidth={2} />
        </a>
        <a className="button button-ghost" href="/photos">
          浏览照片
        </a>
      </div>
    </section>
  )
}
