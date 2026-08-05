# DailyNotes

基于 VuePress 与 vuepress-theme-hope 构建的个人技术随笔。

- [在线阅读](https://233official.github.io/dailynotes/)
- [关于这份随笔](https://233official.github.io/dailynotes/about/)
- [Atom 订阅](https://233official.github.io/dailynotes/atom.xml)

---

## 本地开发

环境要求：

- Node.js `>=20.19.0`
- pnpm `9.15.0`

安装依赖并启动本地站点：

```bash
pnpm install --frozen-lockfile
pnpm docs:dev
```

站点默认运行在 `http://127.0.0.1:9211/dailynotes/`。

需要清理 VuePress 缓存时运行：

```bash
pnpm docs:clean-dev
```

---

## 构建验证

```bash
pnpm docs:build
```

默认构建产物位于 `docs/.vuepress/dist/`。

---

## 目录说明

- `docs/`：随笔正文与站点首页
- `docs/about/`：面向读者的站点说明
- `docs/.vuepress/`：主题、导航、插件、组件与布局配置
- `.github/workflows/`：GitHub Pages 部署与 GitLab 同步流程

---

## 部署

推送到 `main` 分支后，GitHub Actions 会构建并发布 GitHub Pages，同时将仓库同步至 GitLab。

---

## License

[MIT](LICENSE)
