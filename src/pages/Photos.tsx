import { PhotoExplorer } from '@imanity/tabi-gallery'
import { PageHeader } from '../components/ui/PageHeader'
import { photos } from '../content/photos'

export function Photos() {
  return (
    <section className="page-stack">
      <PageHeader
        eyebrow="Photos"
        title="照片"
        description=""
      />
      <PhotoExplorer photos={photos} />
    </section>
  )
}
