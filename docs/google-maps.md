# Google Maps API 配置

图库使用 Google Maps JavaScript API。API key 不写入源码，本地通过 Vite 环境变量配置，部署时通过 GitHub Actions Secret 注入。

## 1. 申请 API key

1. 打开 [Google Cloud Console](https://console.cloud.google.com/) 并创建或选择一个项目。
2. 为项目关联结算账号。Maps JavaScript API 的正式使用需要启用结算。
3. 进入 **APIs & Services → Library**，搜索并启用 **Maps JavaScript API**。
4. 进入 **APIs & Services → Credentials**，选择 **Create credentials → API key**。

Google 的完整说明见 [Set up the Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/get-api-key)。

## 2. 限制 API key

浏览器端 key 会出现在构建后的 JavaScript 和网络请求中，这是 Maps JavaScript API 的正常工作方式。安全性依赖 key 限制，而不是隐藏字符串。

在 key 的编辑页面设置：

### Application restrictions

选择 **Websites (HTTP referrers)**，添加实际使用的来源：

```text
http://localhost
http://localhost/*
http://127.0.0.1
http://127.0.0.1/*
https://imanity.github.io
https://imanity.github.io/*
```

未写端口时可匹配该主机的任意端口，适合 Vite 自动选择开发端口。若以后使用自定义域名，也要添加该域名及其 `/*` 形式。

### API restrictions

选择 **Restrict key**，只允许：

```text
Maps JavaScript API
```

不要把同一个 key 用于服务端接口或其他项目。Google 的安全建议见 [Google Maps Platform security guidance](https://developers.google.com/maps/api-security-best-practices)。

## 3. 本地配置

在 `imanity.github.io` 目录中复制示例文件：

```powershell
Copy-Item .env.example .env.local
```

编辑 `.env.local`：

```dotenv
VITE_GOOGLE_MAPS_API_KEY=你的浏览器端API_KEY
```

然后重新启动开发服务器：

```powershell
npm run dev
```

`.env.local` 已被 `.gitignore` 的 `*.local` 规则排除，不应提交。

## 4. GitHub Pages 配置

在 `imanity.github.io` 的 GitHub 仓库中：

1. 打开 **Settings → Secrets and variables → Actions**。
2. 选择 **New repository secret**。
3. 名称填写 `GOOGLE_MAPS_API_KEY`，值填写同一个受限的浏览器端 key。
4. 重新运行 Deploy GitHub Pages 工作流。

部署工作流会在构建时把 Secret 映射为：

```text
VITE_GOOGLE_MAPS_API_KEY
```

Vite 会将该值写入前端构建产物，因此必须保留网站来源限制和 Maps JavaScript API 限制。

## 5. 常见问题

- 页面显示“地图尚未配置”：环境变量没有设置，或修改后没有重启 Vite。
- `RefererNotAllowedMapError`：当前域名或本地来源没有加入 Websites 限制。
- `ApiNotActivatedMapError`：项目没有启用 Maps JavaScript API。
- `BillingNotEnabledMapError`：项目没有关联有效的结算账号。
- 地图显示开发用途水印：通常是 key、API 启用状态或结算配置有误。

可对照 [Google Maps JavaScript API troubleshooting](https://developers.google.com/maps/documentation/javascript/troubleshooting) 检查浏览器控制台错误。
