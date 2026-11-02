# Leaflet + OpenStreetMap 地图配置

图库使用 Leaflet 交互地图，默认通过 OpenStreetMap 公共栅格瓦片显示底图。
本地开发和 GitHub Pages 部署都不需要 API key、Google Cloud 结算账号或地图相关 Secret。

## 默认使用

地图由 `@imanity/tabi-gallery` 提供，本站已加载其样式。直接使用组件即可：

```tsx
<PhotoMapFilter
  photos={photos}
  selectedPhotoIds={search.selectedPhotoIds}
  onSelectPhotos={selectMapPhotos}
  onClear={clearMapSelection}
/>

<PhotoDetail photo={photo} />
```

默认瓦片地址为 `https://tile.openstreetmap.org/{z}/{x}/{y}.png`，最大缩放级别为 19。
地图支持鼠标拖动、滚轮缩放、缩放按钮、双击和触摸缩放。
地点圆圈支持点击和键盘 Enter / 空格选中，地图下方不再显示地点检索列表。
桌面侧栏加宽至 300–360px，地图高度随视口在 300–400px 之间变化。
标签位于地图下方且默认折叠，折叠时展示完整图库中照片数最多的前 5 个标签，数量相同时按名称排序；点击标题可展开全部标签。折叠时仍可选择热门标签，并显示已选标签数量和清除按钮。两块面板只保留 MAP / TAGS 标题，去掉说明副标题。
折叠且还有标签隐藏时，在可见标签末尾显示虚线边框的省略号按钮，点击即可展开，不显示文字提示；全部标签均已可见或暂无标签时不显示。

## 地点聚类与选择

- 所有红点使用相同的固定 24px 尺寸，不随放大、聚类层级或选中增大；选中时只改变颜色。
- 红点包含多张照片时在内部显示照片数；只有一张时改用相机图标，不显示数字。
- 缩放时保留已有标记，拆分地点从原聚合点平滑展开，合并时向聚合点收拢并淡出；系统设置减少动态效果时立即更新。
- 地点按精确经纬度生成，同名不同坐标保持独立，相同坐标的照片共享一个地点。
- 0–3 级每个已知国家显示一个聚合点，使用照片现有的 `location.country` 字段，位置取该国照片地点的地理中心。
- 中间缩放级别使用 Supercluster 按坐标距离聚类；继续放大会逐步拆分，最大级别显示精确地点。
- 悬停显示国家或地点名称，横向排版，长名称自然换行；仅包含一张照片的标记会在名称下方展示缩略图，聚合多张照片时仍只显示名称。预览图在悬停时才加载，按地图可用宽度缩放且保留完整画面；加载失败时保留地点文字。提示箭头与红点边缘留约 6px 空隙。多个地点最多预览三个名称，不显示照片数或地点数。缺少国家信息时按距离聚类，不调用外部地址解析服务。
- 点击标记显示它包含的照片；点击另一个标记会替换选择，再次点击已选标记或使用地图清除按钮会取消地图筛选。标签等其他筛选继续生效。

地图通过 `selectedPhotoIds` / `onSelectPhotos` 传递照片 ID，`usePhotoSearch`
对应提供 `selectMapPhotos` / `clearMapSelection`。原有按地点文本选择的
`selectedLocations` / `onToggleLocation` / `toggleLocation` / `clearLocations` 已移除。

## 自定义底图

`PhotoMap`、`PhotoMapFilter`、`PhotoDetail` 和 `PhotoExplorer` 均支持可选的
`mapOptions`，类型为图库导出的 `PhotoMapOptions`：

```tsx
const mapOptions = {
  tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}

<PhotoMapFilter
  mapOptions={mapOptions}
  photos={photos}
  selectedPhotoIds={search.selectedPhotoIds}
  onSelectPhotos={selectMapPhotos}
  onClear={clearMapSelection}
/>

<PhotoDetail mapOptions={mapOptions} photo={photo} />
```

更换服务商或使用自建栅格瓦片时，同时更新瓦片 URL、服务商要求的署名 HTML 和缩放上限。
如果服务商要求浏览器端 token，按其文档设置，并了解该 token 会出现在公开的网络请求中。
栅格底图中的道路、POI 和公交标签已包含在图片内；需要调整标签时应选择相应样式的底图。

## OSM 公共瓦片服务

使用公共服务时应遵守 [OSM Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)：

- 地图始终保留可见的 `© OpenStreetMap contributors` 署名与链接。
- 右下角署名使用 10px 字号和 70% 不透明度，鼠标悬浮或键盘聚焦时恢复完整不透明度；Leaflet 使用纯文字链接，不显示国旗。
- 使用 HTTPS 标准瓦片地址，保留浏览器正常的 Referer 与 HTTP 缓存行为。
- 不批量下载、离线抓取或预取地图瓦片。
- 公共服务不提供可用性保证；流量增长或需要服务保证时，通过 `mapOptions` 切换服务商或自建瓦片。

Leaflet 使用随视口加载的瓦片和浏览器缓存；本站没有实现瓦片离线下载或批量预取。

## 从 Google Maps 迁移

本站和图库已移除 Google Maps SDK 与类型依赖，并删除组件上的 `apiKey` /
`mapApiKey` / `googleMapsApiKey` 参数。照片 JSON 的经纬度字段不变，地图使用上述坐标聚类与单选照片逻辑。

原有 `.env.local` 中的 `VITE_GOOGLE_MAPS_API_KEY` 和 GitHub Actions 的
`GOOGLE_MAPS_API_KEY` Secret 不再被读取，可自行清理；部署工作流已不再注入该变量。

## 排查加载问题

- 地图出现加载失败提示：检查网络连接和瓦片 URL；如自定义底图，还需检查其 token、来源限制及缩放范围。
- 底图可见但没有地点：确认照片具有有效的 `location.latitude` / `location.longitude`。
- 地图样式或控件错位：确认已引入 `@imanity/tabi-gallery/style.css`，并检查全局 CSS 是否覆盖 Leaflet 样式。

Leaflet API 详见 [1.9.4 官方参考](https://leafletjs.com/reference-1.9.4.html)。
