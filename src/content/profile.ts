export type ProfileExperience = {
  title: string
  organization: string
  period: string
  location?: string
  summary: string[]
  highlights: string[]
}

export const profile = {
  name: 'Tang RJ',
  role: 'Tang RJ',
  location: '现居日本',
  intro:
    '1997.2 生于天津，后学习&工作于北京，现居日本东京。主要从事软件开发相关工作，爱好摄影旅拍。',
  focus: [],
  experiences: [
    {
      title: '株式会社ロボトラック',
      organization: '自动驾驶系统开发工程师 (全栈)',
      period: '2025.8 - Present',
      location: '东京, 日本',
      summary: [
        '参与司内新一代自动驾驶数据可视化平台、路测平台开发。',
        '基于 React、Three.js、WebSocket 等完成自驾场景渲染、传感器数据可视化平台搭建。',
        '基于 Go、React 完成路测工具平台开发。',
      ],
      highlights: ['React + Three.js 前端开发', 'Go 后端开发'],
    },
    {
      title: '快手',
      organization: '特效研发工程师 (技术美术)',
      period: '2021.7 - 2025.2',
      location: '北京, 中国',
      summary: [
        '使用及维护司内自研图形引擎，针对业务涉及模型制作、骨骼动画、图形渲染等常见场景提供技术支持。',
        '完成水体渲染、辉光后处理等复杂渲染效果开发。',
        '使用司内机器学习模型对特效数据进行挖掘，搭建线上服务指导性能优化。',
      ],
      highlights: ['计算机图形学', '技术美术', 'OpenGL', 'Lua'],
    },
    {
      title: '清华大学 硕士研究生',
      organization: '软件学院 计算机辅助设计图形学与可视化研究所',
      period: '2018.9 - 2021.7',
      location: '北京, 中国',
      summary: [
        '研究通过传统数学方法及深度学习方法实现三维 CT 图像与三维 MRI / 二维 DSA 等不同模态医学图像之间配准。',
      ],
      highlights: ['医学图像处理', '计算机图形学'],
    },
    {
      title: '清华大学 本科',
      organization: '软件学院',
      period: '2014.9 - 2018.7',
      location: '北京, 中国',
      summary: [],
      highlights: [],
    }
  ] satisfies ProfileExperience[],
}
