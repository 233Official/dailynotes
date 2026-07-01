---
category:
  - AI
  - 工具与实践
tags:
  - AI
  - 绘图
  - infinite-canvas
  - Next.js
  - Docker
  - Canvas-Agent
excerpt: infinite-canvas (v0.4.0) 是一个开源的 AI 无限画布工作台，集成画布编排、AI 生图、参考图编辑、视频生成、Agent 智能助手等功能。本文介绍项目概况与部署方法。
---

# infinite-canvas

> [GitHub - basketikun/infinite-canvas](https://github.com/basketikun/infinite-canvas)
> 当前版本 **v0.4.0**（2026-06-16 发布），AGPL-3.0 协议

## 项目简介

[infinite-canvas](https://canvas.best) 是一个面向图片创作的开源工作台，把画布编排、AI 图片生成、参考图编辑、对话助手、提示词库和素材沉淀放在同一个界面里，适合用来探索视觉方案并连续迭代图片结果。

### 核心功能

- **无限画布**：多画布项目、节点拖拽缩放、连线、小地图、撤销重做、导入导出
- **AI 创作**：浏览器前台直连 OpenAI 兼容接口，支持文生图、图生图、参考图编辑、文本问答、音频和视频生成；Seedance 2.0 可通过火山方舟 Agent Plan 接入
- **画布助手**：围绕选中节点和上游节点对话、生图，并把结果插回画布
- **Canvas Agent**：通过本机 Agent 连接 Codex / Claude Code，让 Agent 通过 MCP 操作当前画布；提供 Codex App 插件
- **提示词库**：Next.js route 抓取多个 GitHub 开源项目，缓存在运行实例内存中

> 自 v0.4.0 起移除了后端服务，项目定位为**个人画布工具**，AI API Key 和素材默认保存在浏览器本地。

---

### 技术栈

| 层次 | 技术 |
|------|------|
| 框架 | Next.js 16.2 (App Router)、React 19.2 |
| 语言 | TypeScript 5 |
| UI | Ant Design 6、Tailwind CSS 4、lucide-react |
| 状态管理 | Zustand 5、TanStack Query 5 |
| 存储 | localforage（浏览器本地持久化） |
| 构建 | Bun |
| 样式工具 | class-variance-authority、tailwind-merge |
| Canvas Agent | 独立包 `@basketikun/canvas-agent`（MCP 协议） |

---

## 部署

### Vercel（推荐）

项目根目录已提供 `vercel.json`，直接导入仓库即可部署，构建产物为 `web/`：

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new)

首次打开后进入右上角配置，填入 OpenAI 兼容的 `Base URL` 和 `API Key`。

### Docker

#### 构建

项目使用多阶段构建（bun build → node:22-bookworm-slim），产物为 Next.js standalone 模式：

```bash
docker build -t infinite-canvas .
```

##### `useSearchParams()` 的 Suspense 边界

Next.js 16 生产构建会在预渲染阶段检查 App Router 页面中的客户端导航 hooks。`useSearchParams()` 会触发 CSR bailout，如果不在 `Suspense` 边界内，构建会报错：

```text
useSearchParams() should be wrapped in a suspense boundary at page "/canvas"
Error occurred prerendering page "/canvas"
Export encountered an error on /(user)/canvas/page: /canvas
```

> [useSearchParams | Next.js](https://nextjs.org/docs/app/api-reference/functions/use-search-params)

修复方式：在路由页面外层用 `Suspense` 包裹使用了 `useSearchParams` 的组件：

```tsx
import { Suspense } from "react";

export default function CanvasPage() {
  return (
    <Suspense fallback={<main>正在加载画布...</main>}>
      <CanvasClientPage />
    </Suspense>
  );
}
```

通常只需改动路由页面（`page.tsx`），不需要逐个修改子组件。

#### 运行

```bash
docker run --rm -p 3000:3000 infinite-canvas
```

也可用项目自带的 docker-compose（使用 ghcr.io 预构建镜像）：

```bash
docker compose up -d
```

> 注意：如果构建时使用了自定义镜像名（如 `-t infinite-canvas-debug`），运行时必须使用同一名称，或重新打 tag。`pull access denied` 不一定是网络/权限问题，本地镜像名不匹配也是一个常见原因。

#### 端口映射

`-p` 格式为 `宿主机端口:容器内端口`，如 `-p 62233:3000` 表示外部访问服务器 `62233` → 转发到容器内部 `3000`。

如果容器运行正常但外部仍无法访问，逐层排查：

```bash
docker ps                 # 确认容器运行状态
ss -lntp | grep <端口>    # 确认端口监听
```

以及云服务器安全组是否放行对应 TCP 端口。

---

## Canvas Agent

Canvas Agent 是一个独立的本地 MCP 服务，用来连接画布网页和本机的 Codex / Claude Code：

```bash
npx -y @basketikun/canvas-agent
```

启动后输出本机地址和 token，在画布右上角点击 `Agent` 填入即可连接。详情见 [canvas-agent/README.md](https://github.com/basketikun/infinite-canvas/blob/main/canvas-agent/README.md)。

---

## 相关链接

- [在线站点](https://canvas.best)
- [功能介绍](https://github.com/basketikun/infinite-canvas/blob/main/docs/content/docs/overview/features.mdx)
- [Docker 部署文档](https://github.com/basketikun/infinite-canvas/blob/main/docs/content/docs/overview/docker.mdx)
- [Render 部署](https://github.com/basketikun/infinite-canvas/blob/main/docs/content/docs/overview/render.mdx)
