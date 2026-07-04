import { PageHeader } from '../components/ui/PageHeader'

export function NotFound() {
  return (
    <section className="page-stack">
      <PageHeader
        eyebrow="404"
        title="页面不存在"
        description="这个地址暂时没有内容，可以通过顶部导航回到已有页面。"
      />
    </section>
  )
}
