---
category:
  - 通识
tags:
  - 通识
  - RSS
excerpt: RSS/Atom 订阅格式、FreshRSS 部署、各平台订阅源及 RSSHub 常用 API 整理。
---

# 订阅更新

- [订阅更新](#订阅更新)
  - [Atom 订阅格式](#atom-订阅格式)
  - [FreshRSS](#freshrss)
    - [部署](#部署)
      - [通过Docker部署FreshRSS](#通过docker部署freshrss)
        - [QuickStart](#quickstart)
  - [各平台自带订阅源](#各平台自带订阅源)
    - [Github Repo](#github-repo)
    - [Gitlab Repo](#gitlab-repo)
    - [少数派](#少数派)
    - [V2EX](#v2ex)
  - [RSSHub](#rsshub)
    - [常用API](#常用api)
      - [Bilibili](#bilibili)
      - [Github](#github)
- [一些RSS整理](#一些rss整理)

---

`RSS`(Really Simple Syndication) 是一种用于发布网站更新的 XML 标准化格式

`RSS1.0` 也称为RDF Site Summary或RSS/RDF，使用RDF(Resource Description Framework) 作为基础。强调元数据和描述性信息，但没有在广泛应用中取得与RSS 2.0相当的成功。

`RSS2.0` 相对于RSS 1.0更易于使用, 提供标题、链接和描述等基本元素，广泛应用于博客和新闻网站。

`Atom` 是一种用于网站更新和内容订阅的XML标准，设计更为灵活。提供结构清晰的标准，旨在解决一些RSS的局限性，并提供更多的扩展性和规范性。

`JSON Feed` 使用JSON格式，比传统的XML格式更易于解析和处理。 提供类似于RSS和Atom的内容订阅功能，但使用JSON作为数据交换格式，适应了现代Web应用的需求。

---

## Atom 订阅格式

> [Atom 订阅源格式 - IBM 文档](https://www.ibm.com/docs/zh/integration-designer/8.5.6?topic=formats-atom-feed-format)

创建一个 xml 文件, 顶部包含 XML 声明, 例如:

```xml
<?xml version="1.0" encoding="UTF-8"?>
```

\*\*定义Atom `<feed>` 元素包含有关订阅源的基本信息，如标题、链接和描述, 例如：

```xml
<feed xmlns="http://www.w3.org/2005/Atom">
    <title>Your Feed Title</title>
    <link href="http://www.yourwebsite.com/feed" rel="self"/>
    <id>urn:uuid:unique-identifier</id>
    <updated>2024-03-05T12:00:00Z</updated>
    <author>
        <name>Your Name</name>
    </author>
    <entry>
        <!-- Add entries for each update -->
    </entry>
</feed>

```

在 `<feed>` 元素下，为每一篇更新添加一个 `<entry>` 元素。包括标题、链接、唯一标识、发布日期等信息。例如：

```xml
<entry>
    <title>Update Title</title>
    <link href="http://www.yourwebsite.com/update1" />
    <id>urn:uuid:unique-identifier-for-update1</id>
    <updated>2024-03-05T12:00:00Z</updated>
    <summary>A brief summary of the update.</summary>
</entry>
```

---

## FreshRSS

### 部署

#### 通过Docker部署FreshRSS

##### QuickStart

```powershell
docker run -d --restart unless-stopped --log-opt max-size=10m \
  -p 8083:80 \
  -e TZ=Asia/Shanghai \
  -e 'CRON_MIN=1,31' \
  -v freshrss_data:/var/www/FreshRSS/data \
  -v freshrss_extensions:/var/www/FreshRSS/extensions \
  -name freshrss \
  freshrss/freshrss
```

```powershell
docker run -d --restart unless-stopped --log-opt max-size=10m -p 8083:80 -e TZ=Asia/Shanghai -e 'CRON_MIN=1,31' -v freshrss_data:/var/www/FreshRSS/data -v freshrss_extensions:/var/www/FreshRSS/extensions --name freshrss freshrss/freshrss

```

- `-d` 后台运行

- `--restart unless-stopped` 容器退出时重新启动

- `--log-opt max-size=10m` 日志文件大小限制

- `-p 8080:80` 映射端口: 宿主机端口:容器端口

  > 找个不在用的主机端口

- `-e TZ=Asia/Shanghai` 设置时区

- `-e 'CRON_MIN=1,31'` 设置定时任务 - 每小时的1分和31分执行

- `-v freshrss_data:/var/www/FreshRSS/data` 挂载数据卷

- `-v freshrss_extensions:/var/www/FreshRSS/extensions` 挂载数据卷

- `--name freshrss` 容器名称

- `freshrss/freshrss` 镜像名称

![image-20240306005845566](http://cdn.ayusummer233.top/DailyNotes/202403060058603.png)

访问本地对应端口web服务跟着初始化即可

![image-20240306005940677](http://cdn.ayusummer233.top/DailyNotes/202403060059715.png)

---

## 各平台自带订阅源

> [RSS订阅源 / hypc's blog](https://hypc.github.io/2021/04/10/rss-source/)

---

### Github Repo

- Repo Releases: `https://github.com/{owner}/{repo}/releases.atom`
- Repo Commits: `https://github.com/{owner}/{repo}/commits.atom`
- Repo Tags: `https://github.com/{user}/{repo}/tags.atom`
- User Activity: `https://github.com/{user}.atom`

---

### Gitlab Repo

> [how can I get a global rss feed on Gitlab? / stack overflow](https://stackoverflow.com/questions/23878941/how-can-i-get-a-global-rss-feed-on-gitlab)

- Commits: `http://git.domain.name/userName/projectName/commits/master.atom?private_token=xxxxxxxxxxxxx`

---

### 少数派

- `https://sspai.com/feed`

---

### V2EX

- 全站: `https://www.v2ex.com/index.xml`
- 单独节点: `https://www.v2ex.com/feed/{节点名}.xml`

_Examples:_

- <https://www.v2ex.com/?tab=tech> –> <https://www.v2ex.com/feed/tech.xml>
- <https://www.v2ex.com/go/python> –> <https://www.v2ex.com/feed/python.xml>

---

## RSSHub

[RSSHub](https://docs.rsshub.app/)是一个开源、简单易用、易于扩展的RSS生成器，可以给任何奇奇怪怪的内容生成RSS订阅源。

---

### 常用API

#### Bilibili

- [up主动态](https://docs.rsshub.app/routes/social-media#up-%E4%B8%BB%E5%8A%A8%E6%80%81)

  Example: `https://rsshub.app/bilibili/user/dynamic/2267573`

  🛎️ Route:`/bilibili/user/dynamic/:uid/:routeParams?`

  🔗 Parameters:

  - ```
    uid
    ```

    - **Required**
    - **Description:** 用户 id, 可在 UP 主主页中找到

  - ```
    routeParams
    ```

    - **Optional**

    - Description:

      | 键         | 含义                              | 接受的值       | 默认值 |
      | :--------- | :-------------------------------- | :------------- | :----- |
      | showEmoji  | 显示或隐藏表情图片                | 0/1/true/false | false  |
      | embed      | 默认开启内嵌视频                  | 0/1/true/false | true   |
      | useAvid    | 视频链接使用 AV 号 (默认为 BV 号) | 0/1/true/false | false  |
      | directLink | 使用内容直链                      | 0/1/true/false | false  |
      | hideGoods  | 隐藏带货动态                      | 0/1/true/false | false  |

      用例：`/bilibili/user/dynamic/2267573/showEmoji=1&embed=0&useAvid=1`

  ⚙️ Deployment Configs:
  - `BILIBILI_COOKIE_*`, optional - 如果没有此配置，那么必须开启 puppeteer 支持；BILIBILI*COOKIE*{uid}: 用于用户关注动态系列路由，对应 uid 的 b 站用户登录后的 Cookie 值，`{uid}` 替换为 uid，如 `BILIBILI_COOKIE_2267573`，获取方式： 1. 打开 <https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=0&type=8> 2. 打开控制台，切换到 Network 面板，刷新 3. 点击 dynamic_new 请求，找到 Cookie 4. 视频和专栏，UP 主粉丝及关注只要求 `SESSDATA` 字段，动态需复制整段 Cookie

---

- [up主图文](https://docs.rsshub.app/routes/social-media#up-%E4%B8%BB%E5%9B%BE%E6%96%87)

  Example: `https://rsshub.app/bilibili/user/article/334958638`

  🛎️ Route:`/bilibili/user/article/:uid`

  🔗 Parameters:

  - ```
    uid
    ```

    - **Required**
    - **Description:** 用户 id, 可在 UP 主主页中找到

---

- [用户追漫更新](https://docs.rsshub.app/routes/social-media#%E7%94%A8%E6%88%B7%E8%BF%BD%E6%BC%AB%E6%9B%B4%E6%96%B0)

  Example: <https://rsshub.app/bilibili/manga/followings/26009>

  🛎️ Route:`/bilibili/manga/followings/:uid/:limits?`

  🔗 Parameters:

  - ```
    uid
    ```

    - **Required**
    - **Description:** 用户 id

  - ```
    limits
    ```

    - **Optional**
    - **Description:** 抓取最近更新前多少本漫画，默认为10

  ⚙️ Deployment Configs:
  - `BILIBILI_COOKIE_*`, required - BILIBILI*COOKIE*{uid}: 用于用户关注动态系列路由，对应 uid 的 b 站用户登录后的 Cookie 值，`{uid}` 替换为 uid，如 `BILIBILI_COOKIE_2267573`，获取方式： 1. 打开 <https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=0&type=8> 2. 打开控制台，切换到 Network 面板，刷新 3. 点击 dynamic_new 请求，找到 Cookie 4. 视频和专栏，UP 主粉丝及关注只要求 `SESSDATA` 字段，动态需复制整段 Cookie

---

#### Github

- [Trending](https://docs.rsshub.app/zh/routes/popular#trending)

  💡 Example: <https://rsshub.app/github/trending/daily/javascript/en>

  🛎️ Route:`/github/trending/:since/:language/:spoken_language?`

  🔗 Parameters:

  - ```
    since
    ```

    - **Required**
    - **Options:**
      - daily: Today
      - weekly: This week
      - monthly: This month
    - **Description:** time range

  - ```
    language
    ```

    - **Required**
    - **Default:** any
    - **Description:** the feed language, available in [Trending page](https://github.com/trending/javascript?since=monthly) 's URL, don't filter option is `any`

  - ```
    spoken_language
    ```

    - **Optional**
    - **Description:** natural language, available in [Trending page](https://github.com/trending/javascript?since=monthly) 's URL

  ⚙️ Deployment Configs:
  - `GITHUB_ACCESS_TOKEN`, required -

---

# 一些RSS整理

- [完整公众号列表 / Wehcat2RSS](https://wechat2rss.xlab.app/list/all.html)

---
