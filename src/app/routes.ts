import type { ComponentType } from 'react'
import { Camera, FolderGit2, Home, UserRound } from 'lucide-react'
import { About } from '../pages/About'
import { HomePage } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import { Photos } from '../pages/Photos'
import { Projects } from '../pages/Projects'

export type AppRoute = {
  path: string
  label: string
  title: string
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
  component: ComponentType
}

export const routes: AppRoute[] = [
  {
    path: '/',
    label: '主页',
    title: '主页',
    icon: Home,
    component: HomePage,
  },
  {
    path: '/photos',
    label: '照片',
    title: '照片',
    icon: Camera,
    component: Photos,
  },
  {
    path: '/projects',
    label: '项目',
    title: '项目',
    icon: FolderGit2,
    component: Projects,
  },
  {
    path: '/about',
    label: '简介',
    title: '个人简介',
    icon: UserRound,
    component: About,
  },
]

export const notFoundRoute: AppRoute = {
  path: '*',
  label: '404',
  title: '未找到',
  icon: Home,
  component: NotFound,
}
