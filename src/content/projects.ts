export type Project = {
  name: string
  summary: string
  status: 'planning' | 'active' | 'archived'
  tags: string[]
}

export const projects: Project[] = [
  {
    name: 'Personal Homepage',
    summary: '个人主页。',
    status: 'active',
    tags: ['React', 'TypeScript'],
  },
  {
    name: 'Tabi Gallery',
    summary: '照片瀑布流、检索和地图组件库。',
    status: 'planning',
    tags: ['React', 'TypeScript'],
  },
]
