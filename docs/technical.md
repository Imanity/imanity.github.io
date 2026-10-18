# 技术说明

> 本文描述当前代码结构与运行方式，更新于 2026-10-19。

## 项目定位

`imanity.github.io` 是部署到 GitHub Pages 的个人主页，负责页面、个人资料、项目资料和照片数据。照片展示能力由同级项目 `@imanity/tabi-gallery` 提供，本站不重复实现图库逻辑。

## 技术栈

- React 19 + TypeScript 6
- Vite 8
- Lucide React 图标
- Google Maps JavaScript API
- GitHub Pages + GitHub Actions
- Git LFS 管理照片等二进制资源

## 代码结构

```text
src/
├─ app/          路由表与应用入口组件
├─ components/   站点布局和通用 UI
├─ content/      个人资料与项目数据
├─ gallery/      图库 JSON 加载、校验与共享状态
├─ pages/        首页、照片、项目、简介和 404 页面
└─ styles/       全站样式
public/
├─ assets/       照片等静态资源
├─ data/         图库清单、照片配置与 i18n 词表
└─ 404.html      GitHub Pages 的单页应用回退
```

## 运行方式

1. `src/main.tsx` 加载全站样式并挂载 React 应用。
2. `src/app/App.tsx` 根据 `window.location.pathname` 匹配路由。
3. 站内链接通过 History API 切换页面，浏览器前进/后退由 `popstate` 同步。
4. 普通内容从 `src/content` 读取；`GalleryProvider` 在运行时读取 `public/data/galleries/index.json`、标签/国家词表及其中登记的图库配置。
5. 照片页从共享图库状态中取得照片，再独立组装瀑布流、排序、标签筛选和地图筛选组件；默认随机顺序在当前页面生命周期内保持稳定，也可按拍摄时间正序或倒序排列。缺少或无法识别拍摄时间的照片始终位于有效时间照片之后。

照片详情使用 `/photos/:photoId` 动态路径。照片卡片链接到对应详情；详情页支持全屏原图、可跳转标签、格式化拍摄时间、Google 地图地点，以及带缩略图的上一张/下一张导航。标签跳转采用 `/photos?tag=<标签>`，照片列表会用该参数初始化筛选状态。

项目没有引入专用路由库。新增页面时，需要同时新增页面组件并更新 `src/app/routes.ts`。

### GitHub Pages 路由回退

GitHub Pages 直接访问 `/photos` 等路径时会先返回 `public/404.html`。该文件把原路径放入 `redirect` 查询参数并跳回根路径，`src/main.tsx` 再恢复原地址，随后由前端路由渲染对应页面。

## 内容维护

- 个人资料：`src/content/profile.ts`
- 项目列表：`src/content/projects.ts`
- 图库清单：`public/data/galleries/index.json`
- 照片配置：`public/data/galleries/*.json`
- 标签和国家词表：`public/data/gallery-taxonomy.json`
- 照片文件：`public/assets/photos/<gallery-id>/`

每份图库 JSON 包含 `version`、`id`、`title` 和 `photos`。照片中的 `tags` 和 `location.country` 保存稳定 ID；保存时，国家会同步为第一个 tag，切换国家则替换旧的国家 tag。词表以 locale 为键保存显示名称和旧值别名。站点根据 HTML `lang` 选择翻译，并兼容尚未迁移的旧中文值。加载时会验证配置结构、坐标、图片尺寸和跨图库照片 ID；图片路径以站点公开根目录为基准。

图片导入和元数据编辑复用 `tabi-gallery/tools`：

```powershell
npm run tools:images -- --input D:\Photos\raw --output .\public\assets\photos\travel --config .\public\data\galleries\travel.json --gallery travel --title "Travel"
npm run tools:gallery -- --open
```

图片导入默认追加到已有配置，继续现有编号，并按原图内容哈希跳过重复照片。每个图库使用独立配置和照片目录；只有显式传入 `--mode replace` 才会替换照片列表。

可视化管理器可维护 locale、标签、国家及翻译，并在照片编辑区通过复选框和下拉框引用词表。标签或国家仍被图库使用时，后端会拒绝删除对应词条。

地图 key 通过 `VITE_GOOGLE_MAPS_API_KEY` 注入。申请、限制以及本地和 GitHub Pages 配置见 [Google Maps API 配置](google-maps.md)。

## 本地依赖关系

当前 `package.json` 通过 `file:../tabi-gallery` 依赖图库包，Vite 又将包入口直接映射到相邻仓库源码：

```text
D:\Projects\
├─ imanity.github.io\
└─ tabi-gallery\
```

因此本地开发和 CI 都需要这两个项目。`react` 与 `react-dom` 在 Vite 中做了去重，避免站点与图库加载两份 React。

## 常用命令

```powershell
npm install          # 安装依赖
npm run dev          # 启动开发服务器
npm run typecheck    # TypeScript 检查
npm run build        # 类型检查并生成 dist/
npm run preview      # 预览生产构建
```

## 部署

`.github/workflows/deploy.yml` 在 `main` 分支更新时执行：

1. 拉取本站（包含 Git LFS 文件）和 `tabi-gallery`；
2. 检查照片目录中没有残留 LFS 指针文件；
3. 使用 Node.js 24 安装依赖并构建；
4. 上传 `dist/` 并部署到 GitHub Pages。

私有的 `tabi-gallery` 仓库需要配置 `TABI_GALLERY_TOKEN`；公开仓库可使用默认的 GitHub token。

## 当前技术边界

- 站点是纯静态前端，没有服务端、数据库或登录系统。
- 个人与项目内容维护在 TypeScript 中，照片配置维护在公开 JSON 中；没有 CMS。
- 地图使用 Google Maps JavaScript API，支持底图、缩放和地点筛选；大量地点的标记聚合尚未实现。
- 自动化仅覆盖构建部署，尚无单元测试、端到端测试和 lint 命令。
- 图库发布到 npm 前，本站不能脱离相邻的 `tabi-gallery` 仓库独立构建。
