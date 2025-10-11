---
date: 2025-10-09
category: NoteTools
tags:
  - NoteTools
  - VuePress
excerpt: VuePress 是一个以 Vue 为基础的静态网站生成器，适用于技术文档和博客等场景。本文档记录了 VuePress 的安装、配置、主题使用以及常见问题的解决方法。
---

# VuePress

- [VuePress](#vuepress)
  - [pnpm,Github Actions, Github/Gitlab Pages 自动化部署文档](#pnpmgithub-actions-githubgitlab-pages-自动化部署文档)
  - [配合 vuepress\_theme\_hope 食用](#配合-vuepress_theme_hope-食用)
    - [搜索](#搜索)
    - [sitemap](#sitemap)
    - [SEO](#seo)
    - [Feed](#feed)
    - [案例](#案例)
  - [报错收集](#报错收集)
    - [`Vuepress Error: ENOSPC: System limit for number of file watchers reach`](#vuepress-error-enospc-system-limit-for-number-of-file-watchers-reach)
    - [Package katex is not installed](#package-katex-is-not-installed)
  - [调试](#调试)
    - [依赖调试](#依赖调试)
  - [服务器上部署运行](#服务器上部署运行)
  - [配置备份](#配置备份)
    - [vuepress-theme-hope-2.0.0-beta.222](#vuepress-theme-hope-200-beta222)
    - [vuepress-theme-hope-2.0.0-rc.27](#vuepress-theme-hope-200-rc27)

## pnpm,Github Actions, Github/Gitlab Pages 自动化部署文档

> [快速上手 | VuePress (vuejs.org)](https://v2.vuepress.vuejs.org/zh/guide/getting-started.html)
>
> ---

- 使用 [pnpm](https://pnpm.io/zh/) 时，需要安装 `vue` 和 `@vuepress/client` 作为 peer-dependencies ，即 

  ````sh
  pnpm add -D vue @vuepress/client@next
  ````

- 然后将 VuePress 安装为本地依赖

  ```sh
  pnpm install -D vuepress@next
  ```

- 在 `package.json` 中添加一些 [scripts](https://classic.yarnpkg.com/zh-Hans/docs/package-json#toc-scripts)

  ```json
  {
    "scripts": {
      "docs:dev": "vuepress dev docs",
      "docs:build": "vuepress build docs"
    }
  }
  ```

- 编辑 `.gitignore` 文件, 添加临时目录和缓存目录以及 `dist` 目录

  ```properties
  node_modules
  .temp
  .cache
  docs/.vuepress/dist
  ```

- 在根目录下创建 `docs` 目录然后新建一个 `README.md` 文件并随便输入些文字
- 可以先在本地尝试运行和打包下

  ```sh
  pnpm run docs:dev
  pnpm run dos:build
  ```

- 在 `docs/.vuepress` 目录下创建 `config.js`

  > [配置 | VuePress (vuejs.org)](https://v2.vuepress.vuejs.org/zh/reference/config.html)

  ```js
  module.exports = {
      // 站点的标题
      title: "VuePressTest",
      // 站点的描述
      description: "This is a blog.",
      // 站点配置, 设置为 /[仓库名]/
      base: '/VuePressTest/',
  }
  ```

> 需要注意的是, 这里的 base 务必配置好, 否则之后部署完后可能会出现引入资源找不到的情况
>
> > 因为默认 base 是 `/`, 所以如果将站点部署到具体到仓库的子路径的话, 构建的 html 文档中的资源引入链接仍然指向了根目录, 就会 404
>
> > [React/Vue 项目在 GitHub Pages 上部署时资源的路径问题_mob60475707634e的技术博客_51CTO博客](https://blog.51cto.com/u_15127702/4680048)
> >
> > [部署 | VuePress (vuejs.org)](https://v2.vuepress.vuejs.org/zh/guide/deployment.html)
>
> > PS: 如果是部署在 Gitlab 上的话则需要注意这里的 `base` 要全小写
> >
> > ![image-20240529150819180](http://cdn.ayusummer233.top/DailyNotes/202405291508285.png)
> >
> > ![image-20240529150854945](http://cdn.ayusummer233.top/DailyNotes/202405291508064.png)
> >
> > 以及 Gitlab Pages 如此设置:
> >
> > ![image-20240529150940058](http://cdn.ayusummer233.top/DailyNotes/202405291509212.png)

---

- (对于Github)在根目录下新建 `.github/workflows/docs.yml`'

```yaml
name: Deploy Docs

on:
  push:
    branches:
      # make sure this is the branch you are using
      - main

jobs:
  deploy-gh-pages:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
          # if your docs needs submodules, uncomment the following line
          # submodules: true

      - name: Setup Node.js environment
        uses: actions/setup-node@v3.5.1
        with:
          # 选择要使用的 node 版本
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2.2.4
        with: 
          version: 6.0.2


      - name: Install Deps
        run: pnpm install

      - name: Build Docs
        env:
          NODE_OPTIONS: --max_old_space_size=8192
        # 需要注意的是 github pages的jekyll模版会忽略下划线开头的文件
        # 所以要禁用jekyll才能正确加载带下划线的资源  
        # 可以通过在项目根目录下创建一个名为 .nojekyll 的空文件来禁用jekyll
        # 关于 -run 和 run | 的区别可参阅:  
        # https://stackoverflow.com/questions/59529042/difference-between-run-and-multiple-runs-in-github-actions
        run: |-
          pnpm run docs:build
          echo > docs/.vuepress/dist/.nojekyll


      # 查看 workflow 的文档来获取更多信息
      # @see https://github.com/crazy-max/ghaction-github-pages
      - name: GitHub Pages
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with: 
          # 部署到 gh-pages 分支
          target_branch: gh-pages
          # 部署目录为 VuePress 的默认输出目录
          build_dir: docs/.vuepress/dist
        env:
          # @see https://docs.github.com/cn/actions/reference/authentication-in-a-workflow#about-the-github_token-secret
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- (对于 Gitlab)在项目根目录下新建 `.gitlab-ci.yml`, 内容如下

  ```yaml
  # choose a docker image to use
  image: node:18-buster
  
  pages:
    # trigger deployment on every push to main branch
    only:
      - main
  
    # cache node_modules
    cache:
      key:
        files:
          - pnpm-lock.yaml
      paths:
        - .pnpm-store
  
    # Install pnpm
    before_script:
      - export SHELL=/bin/bash
      - curl -fsSL https://get.pnpm.io/install.sh | SHELL=bash sh -
      - source /root/.bashrc
      - pnpm add -g pnpm@8.15.4  # 安装指定版本的pnpm(PS:这里根据实际项目根目录下的 package.json 中的 packageManager 字段指定的版本决定)
      - pnpm config set store-dir .pnpm-store
  
    # install dependencies and run build script
    script:
      - pnpm i --frozen-lockfile
      - pnpm docs:build --dest public # 与 Github 不同, Gitlab 这里需要指定到 public 部署到 Pages 才能保证资源寻址不出错
      - echo > .nojekyll # 这行本来是针对 Github 的, Gitlab 这里可能不需要这行, 不过我没验证, 感兴趣的话可以自行验证一下~
  
    artifacts:
      paths:
        - public
  
  ```

---

- 提交并推送你的修改, 然后可以在 Github 仓库的 Actions 中查看下运行状态

> ![image-20221107011741954](http://cdn.ayusummer233.top/img/202211070117032.png)
>
> ---
>
> Gitlab 则可以在构建作业中查看状态
>
> ![image-20240529151612953](http://cdn.ayusummer233.top/DailyNotes/202405291516240.png)
>
> 而且到这里作业运行成功就可以到 Pages 上的网址里查看了, 不出意外的话已经部署好了

---

- 打开仓库的 `Settings->Pages` 将 `BUild and deployment->source` 修改为 `Deploy from a branch`(默认值就是这个), 然后选择 `gh-pages->/root` 并 `Save`

> ![image-20221107013516165](http://cdn.ayusummer233.top/img/202211070135213.png)

- 然后就可以在 `Actions` 界面看到多了一个 Action

> ![image-20221107013604098](http://cdn.ayusummer233.top/img/202211070136126.png)
>
> ![image-20221107013613106](http://cdn.ayusummer233.top/img/202211070136148.png)

- 仓库主页右下角也会多一个 Environment, 在上一步的 Actions 中可以看到部署链接, 亦可以在此处看到部署链接

> ![image-20221107013756939](http://cdn.ayusummer233.top/img/202211070137988.png)
>
> ![image-20221107013848612](http://cdn.ayusummer233.top/img/202211070138645.png)

![image-20221107013913233](http://cdn.ayusummer233.top/img/202211070139287.png)

---

## 配合 vuepress_theme_hope 食用

> [主页 | vuepress-theme-hope (vuejs.press)](https://theme-hope.vuejs.press/zh/)
>
> > 直接看官方文档即可, 下面部分的笔记仅适用于个人更新依赖的时候瞄一眼需要更新的模块
>

```bash
# 使用 vuepress_theme_hope 初始化一个 vuepress 项目
pnpm create vuepress-theme-hope@next [dir]

# 获取为当前项目添加 vuepress_theme_hope 支持
pnpm install -D vuepress-theme-hope@next
```

> 这里的 `[dir]` 是一个参数，你需要使用真实的文件夹名称替换它，例如 `docs`、`src` 或其他你喜欢的名称。

---

### 搜索

> [搜索 | vuepress-theme-hope (vuejs.press)](https://theme-hope.vuejs.press/zh/guide/feature/search.html#使用-vuepress-plugin-search-pro)
>
> [搜索插件配置 | vuepress-theme-hope (vuejs.press)](https://theme-hope.vuejs.press/zh/config/plugins/search.html)

```bash
pnpm add -D vuepress-plugin-search-pro@next
```

---

### sitemap

> [主页 | Sitemap 生成器 (vuejs.press)](https://plugin-sitemap2.vuejs.press/zh/)
>
> [选项 | Sitemap 生成器 (vuejs.press)](https://plugin-sitemap2.vuejs.press/zh/config.html)

```bash
pnpm add -D vuepress-plugin-sitemap2
```

> PS: 抄配置时需要配下 hostname 这个必填项, 填入域名即可

---

### SEO

> [主页 | SEO 增强 (vuejs.press)](https://plugin-seo2.vuejs.press/zh/)
>
> [选项 | SEO 增强 (vuejs.press)](https://plugin-seo2.vuejs.press/zh/config.html)

```bash
pnpm add -D vuepress-plugin-seo2
```

> PS: 抄配置时需要配下 hostname 这个必填项, 填入域名即可

---

### Feed

> [Feed 支持 | vuepress-theme-hope (vuejs.press)](https://theme-hope.vuejs.press/zh/guide/advanced/feed.html)
>
> [插件配置 | VuePress 生态系统 (vuejs.press)](https://ecosystem.vuejs.press/zh/plugins/feed/config.html)

```powershell
pnpm add -D @vuepress/plugin-feed@2.0.0-rc.18
```

![image-20240306004451712](http://cdn.ayusummer233.top/DailyNotes/202403060044776.png)

![image-20240306004612356](http://cdn.ayusummer233.top/DailyNotes/202403060046408.png)

> PS: 不用管VSCode给的类型提示报错

---

### 案例

> [案例 | vuepress-theme-hope (vuejs.press)](https://theme-hope.vuejs.press/zh/demo/)

案例可以用来作为配置项的参考

![image-20240305235337110](http://cdn.ayusummer233.top/DailyNotes/202403052353175.png)

---

## 报错收集

### `Vuepress Error: ENOSPC: System limit for number of file watchers reach`

> [Error: ENOSPC: System limit for number of file watchers reached - Get Help - Vue Forum (vuejs.org)](https://forum.vuejs.org/t/error-enospc-system-limit-for-number-of-file-watchers-reached/107904/3)
>
> ---

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

---

### Package katex is not installed

```powershell
vuepress-plugin-md-enhance:  ✖ Package katex is not installed, please install it manually!
vuepress-plugin-md-enhance:  ✖ Package mermaid is not installed, please install it manually!
vuepress-theme-hope:  ✖ You are not allowed to use plugin "@vuepress/plugin-sitemap" yourself in vuepress config file. Set "plugins.sitemap" in theme options to customize it.
vuepress-theme-hope:  ✖ You are not allowed to use plugin "vuepress-plugin-search-pro" yourself in vuepress config file. Set "plugins.searchPro" in theme options to customize it.
```

![image-20240305232605836](http://cdn.ayusummer233.top/DailyNotes/202403052326887.png)





----

## 调试

### 依赖调试

项目依赖每次更新都很折磨, 要不断调整依赖适配版本

首先是升级主题和 VuePress 版本，请执行以下命令:

:::tbas

@tab:active pnpm

```bash
pnpm dlx vp-update
```

:::

----

对于类似如下告警

```bash
devDependencies:
 WARN  Issues with peer dependencies found
.
└─┬ vuepress-vite 2.0.0-rc.0
 WARN  Issues with peer dependencies found
.
└─┬ vuepress-vite 2.0.0-rc.0
  └── ✕ unmet peer @vuepress/client@2.0.0-rc.0: found 2.0.0-rc.8
```

可以看到相应包的支持版本

```bash
pnpm view vuepress-vite versions
```

![image-20240305224533572](http://cdn.ayusummer233.top/DailyNotes/202403052245615.png)

或者可以直接参考下案例:  [vuepress-theme-hope-starter (forked) - StackBlitz](https://stackblitz.com/edit/vuepress-theme-hope-umqczj?file=package.json) 的配置

---

## 服务器上部署运行

服务器上安装 nginx:

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable --now nginx
```

- 关闭版本号
  编辑 `/etc/nginx/nginx.conf`，在 `http { }` 块内部加入或修改为 `server_tokens off;`

  ```properties
  # ...existing code...
  http {
      # 可能已有：include /etc/nginx/mime.types;
      server_tokens off;
  
      # 其余保持不动
      include /etc/nginx/conf.d/*.conf;
      include /etc/nginx/sites-enabled/*;
  }
  # ...existing code...
  ```

- 自定义错误页（避免默认错误页再出现 “nginx” 字样）
   编辑你的站点文件 `/etc/nginx/sites-available/default`，在 `server { }` 内添加：

   ```properties
   # ...existing code...
   server {
       # ...existing code...
   
       error_page 404 /custom_404.html;
       location = /custom_404.html { internal; }
   
       error_page 500 502 503 504 /custom_50x.html;
       location = /custom_50x.html { internal; }
   }
   # ...existing code...
   ```

- 放置自定义错误文件（简单文本即可）

   ```bash
   echo 'Not Found' | sudo tee /var/www/html/custom_404.html
   echo 'Server Error' | sudo tee /var/www/html/custom_50x.html
   ```

- 移除默认欢迎页（若还在）

   ```bash
   sudo rm -f /var/www/html/index.nginx-debian.html
   ```

- 检查并重载

   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

- 验证

   ```bash
   curl -I http://你的域名 | grep -i server:
   ```

   应显示：Server: nginx（无版本号）。若访问不存在页面，返回的是你自定义的错误内容，不出现 “nginx version”。

---

将 `config.ts` 中的 `base` 改为 `/`, 然后本地编译产物:

```bash
pnpm docs:build
```

将 dist 中的产物拷贝到 `/var/www/html` 目录下即可

----

## 配置备份

### vuepress-theme-hope-2.0.0-beta.222

```json
{
  "name": "ayusummer-dailyNotes",
  "description": "233 daily notes",
  "repository": {
    "type": "git",
    "url": "git@github.com:Ayusummer/DailyNotes.git"
  },
  "license": "MIT",
  "private": true,
  "packageManager": "pnpm@8.6.0",
  "scripts": {
    "docs:clean-dev": "vuepress dev docs --clean-cache",
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  },
  "devDependencies": {
    "@vuepress/client": "2.0.0-beta.62",
    "nodejs-jieba": "0.0.2",
    "vue": "3.3.4",
    "vuepress": "2.0.0-beta.62",
    "vuepress-plugin-search-pro": "2.0.0-beta.222",
    "vuepress-plugin-seo2": "2.0.0-beta.222",
    "vuepress-plugin-sitemap2": "2.0.0-beta.222",
    "vuepress-theme-hope": "2.0.0-beta.222",
    "vuepress-vite": "2.0.0-beta.62",
    "vuepress-webpack": "2.0.0-beta.62"
  }
}
```

---

### vuepress-theme-hope-2.0.0-rc.27

`package.json`

```json
{
  "name": "ayusummer-dailyNotes",
  "description": "233 daily notes",
  "repository": {
    "type": "git",
    "url": "git@github.com:Ayusummer/DailyNotes.git"
  },
  "license": "MIT",
  "private": true,
  "packageManager": "pnpm@8.15.4",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "docs:clean-dev": "vuepress dev docs --clean-cache",
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  },
  "devDependencies": {
    "@vuepress/bundler-vite": "2.0.0-rc.8",
    "@vuepress/plugin-seo": "2.0.0-rc.18",
    "@vuepress/plugin-sitemap": "2.0.0-rc.18",
    "katex": "^0.16.9",
    "mermaid": "^10.8.0",
    "vue": "^3.4.21",
    "vuepress": "2.0.0-rc.8",
    "vuepress-plugin-search-pro": "2.0.0-rc.27",
    "vuepress-theme-hope": "2.0.0-rc.27"
  }
}

```

`config.ts`

```ts
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import theme from "./theme";
import { sitemapPlugin } from "@vuepress/plugin-sitemap";
import { searchProPlugin } from "vuepress-plugin-search-pro";

export default defineUserConfig({
  lang: "zh-CN",
  // 站点的标题
  title: "DailyNotes",
  // 站点的描述
  description: "233的日常学习记录",
  // 站点配置, 设置为 /[仓库名]/
  base: "/DailyNotes/",

  // plugins: [
  //   searchProPlugin({
  //     // 配置选项
  //   }),
  //   sitemapPlugin({
  //     // 配置选项
  //     hostname: "ayusummer.github.io",
  //   }),
  // ],
  bundler: viteBundler(),
  // 主题配置
  theme,
});

```

`theme.ts`

```ts
import { hopeTheme } from "vuepress-theme-hope";
import { createRequire } from "node:module";
import { fs, theme } from "docs-shared";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

export default hopeTheme({
  // logo
  logo: "/logo.svg",

  // 主题色选择器
  themeColor: true,

  // 导航栏
  navbar: Navbar,
  // 侧边栏
  sidebar: Sidebar,

  // 仓库链接
  repo: "Ayusummer/DailyNotes",
  // 文档仓库地址，默认同主题选项中的 repo
  docsRepo: "Ayusummer/DailyNotes",
  // 文档在仓库中的目录，默认为根目录
  docsDir: "docs",
  // 文档存放的分值，默认为 "main"
  docsBranch: "main",

  // 全屏
  fullscreen: true,

  // 插件相关
  plugins: {
    seo: true,
    // markdown 增强
    mdEnhance: {
      tabs: true,
      mermaid: true,
      // 使用 KaTeX 启用 TeX 支持
      katex: true,
      // 与选项卡功能相同，但它是专门为代码块构建的。
      // 代码选项卡只会渲染 @tab 标记后的代码块，其他 Markdown 内容将被忽略
      codetabs: true,
      // 文件支持任务列表
      tasklist: true,
      // 支持标记 使用 == == 进行标记。请注意两边需要有空格
      mark: true,
    },
    searchPro: {
      indexContent: true,
    },
    sitemap: {},
  },
});

```









