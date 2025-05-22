---
category:
  - 通识
  - macOS
excerpt: macOS常用知识随笔
---

# macOS

- [macOS](#macos)
  - [命令行](#命令行)
    - [Homebrew](#homebrew)
      - [安装](#安装)
    - [压缩与解压](#压缩与解压)
      - [解压7z压缩包](#解压7z压缩包)
    - [软硬链接](#软硬链接)
  - [Apps](#apps)
    - [卸载应用](#卸载应用)
      - [删除登录项后台残留](#删除登录项后台残留)
    - [代理选择-ClashVergeRev/Surge](#代理选择-clashvergerevsurge)
    - [RSS](#rss)
    - [跨屏协同](#跨屏协同)
    - [磁盘空间可视化-baobab](#磁盘空间可视化-baobab)
    - [磁盘空间可视化-grandperspectiv](#磁盘空间可视化-grandperspectiv)
    - [QQ](#qq)
      - [QQ聊天记录占用系统存储空间太大的解决方案](#qq聊天记录占用系统存储空间太大的解决方案)
        - [以下作废，权当记录，暂时解决不了权限问题，最终解决方案是定期备份清理（](#以下作废权当记录暂时解决不了权限问题最终解决方案是定期备份清理)

---

## 命令行

### Homebrew

**Homebrew** 是 macOS 和 Linux 上的一种流行的包管理工具，它的核心作用是帮助用户更轻松地安装、更新、卸载和管理各种软件和工具包。它被称为 macOS 的“缺失的软件包管理器”。

---

Homebrew 将所有下载的软件和库安装在 `/usr/local` 目录下（Linux 系统为 `/home/linuxbrew`）。

它使用 Git 来管理自己的核心代码和包公式（Formula），并通过这些公式定义如何构建和安装软件。

---

#### 安装

在终端中运行如下命令

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

> 期间需要密码验证和手动确认

![image-20241125010856109](http://cdn.ayusummer233.top/DailyNotes/202411250108180.png)

接着按照 `Next steps` 中描述的步骤进行操作

```bash
# 如果 .zprofile 不存在，创建一个, 如果存在则追加一行空行
echo >> /Users/summery233/.zprofile
# 将初始化 Homebrew 的命令追加到 .zprofile 文件中
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/summery233/.zprofile
# 初始化 Homebrew
eval "$(/opt/homebrew/bin/brew shellenv)"
# 查看 Homebrew 的信息
brew --version
```

> | **文件**  | **加载时机**                                                 | **主要用途**                                                 |
>| --------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
> | .zshrc    | 仅在 **交互式 Shell** 启动时加载。交互式 Shell 指的是直接在终端中打开的会话，用于用户交互（如运行命令）。 | 用于配置交互式会话的内容，例如别名、函数、快捷键绑定、Shell 提示符等。适合用于提升终端的日常操作效率。 |
>| .zprofile | 仅在 **登录 Shell** 启动时加载。登录 Shell 通常指通过远程登录（如 SSH）或登录系统时启动的 Shell，会话初始化更完整。 | 用于配置与会话初始化有关的内容，例如设置环境变量（PATH、JAVA_HOME）、运行需要的初始化脚本等。 |

![image-20241125012651582](http://cdn.ayusummer233.top/DailyNotes/202411250126639.png)

> ![image-20241125012806241](http://cdn.ayusummer233.top/DailyNotes/202411250128295.png)

---

### 压缩与解压

#### 解压7z压缩包

```bash
# 安装了 Homerew 后使用 Homebrew 安装 p7zip
brew install p7zip
```

> ![image-20241125015102993](http://cdn.ayusummer233.top/DailyNotes/202411250151039.png)

```bash
# 解压 7z 压缩包（不指定解压目录则解压到当前目录）
7z x <filename>.7z
# 解压到指定目录
7z x <filename>.7z -o<output_dir>
```

> ![image-20241125015559356](http://cdn.ayusummer233.top/DailyNotes/202411250155419.png)

---

### 软硬链接

> - [Windows软硬链接](../Windows.md#软链接与硬链接)
> - [Linux软硬链接](../Linux/index.md#软硬链接)
> 

```bash
# 硬链接建立
ln <原始文件> <硬链接路径>
# 删除硬链接
rm <硬链接路径>
```

```bash
# 建立软链接
ln -s <原始文件/目录> <软链接路径>
# 删除软链接
rm <软链接路径>
```

---

## Apps


### 卸载应用

仅仅将应用移动到废纸篓并不能清理掉应用在文件系统里新建的项目，所以需要一个类似 Windows 上 Geek 这样的软件来卸载应用的同时删除残留

找到了 [appcleaner](https://freemacsoft.net/appcleaner/), 将需要卸载的应用拖进去后会查找关联的文件进行删除

![image-20241204154955561](http://cdn.ayusummer233.top/DailyNotes/202412041549790.png)

---

#### 删除登录项后台残留

> [删除登录项后台残留](https://www.cnblogs.com/Flat-White/p/18095629)

在寻找 mac 端代理解决方案的过程中下载/使用/删除(拖曳app到废纸篓)了一些软件，在 `设置-通用-登录项与扩展-允许在后台` 看到了一些残留， 有一些是可以在设置中有个放大镜图标跳转到 Finder 中删除然后重启 mac 就会自动消失，有些则无法便捷地找到位置，查阅资料在 [删除登录项后台残留](https://www.cnblogs.com/Flat-White/p/18095629) 找到了解决方案

```bash
sfltool dumpbtm > ~/Desktop/BTM.json
```

> BTM(Background Task Manager)

如此导出的文件记录了系统中的后台任务和应用程序的相关信息，对着目标项名称查找路径对应删除掉然后重启 mac 就不会再在登录项中看到这些了

> 基本上在下面俩位置：
>
> ![image-20241128110715537](http://cdn.ayusummer233.top/DailyNotes/202411281107607.png)

---

### 代理选择-ClashVergeRev/Surge

> [hadowrocket/Quantumult X/Surge/Loon代理软件那个好？哪个更适合iOS系统 / sites.google.com/site/besttopvps](https://sites.google.com/site/besttopvps/which-one-is-more-suitable-for-ios)

> 当前配置：16 + 256 的 MacMini

按照时间顺序叙述使用体验：

1. `shadowrocket`: 可以直接在 AppStore 里下载使用 iPhone/iPad 版的 shadowrocket，正常浏览网页使用设备啥的是没问题的，使用很丝滑，直到 pip 报错开始寻找 mac 的解决方案

2. `Quantumult X`: 同上可以在 AppStore 中下载使用 iPhone/iPad 版的，用起来还不错，不过移动端上 shadowrocket 基本就足够了，Quantumult X 用的不多，也不是很熟悉，保留作为备选方案，继续寻找桌面端解决方案

   > [Quantumult X 新手入门教程](https://github.com/kjfx/QuantumultX?tab=readme-ov-file)

3. `Surge`: 界面很美观，功能很强大

   > [Surges使用体验](Surge.md)
   >
   > ---
   >
   > PS：可以使用 [分离配置](#分离配置) 来扩展机场配置，不过相对于 ClashVergeRev 直接在机场配置上添加前置/后置规则而言要麻烦一些
   >
   > - PPS: 学会分离配置 + 规则(集) 编写后就变得容易很多了
   >
   > PS: 可以很方便地查看指定APP的网络活动，这方面比Fiddler便宜方便，可以结合ClashVergeRev扩展规则使用，开了个车

4. `ClashX(Pro)`: 对比 Win 上的 Clash 感觉有些简陋，功能也没多少，跳过

5. `shadowrocketX-NG`: 无法启动，跳过

6. `ClashVergeRev`: 使用体验可以无缝衔接 Win Clash 的使用，加分；可以很方便地扩展机场订阅的规则(`右键订阅文件->编辑规则`，添加前置或后置规则)，加分；

---

### RSS

> [Mac 上的 RSS 阅读工具，你有这些好看实用的选择 / 少数派](https://sspai.com/post/55050)
>
> [RSSHub](https://rsshub.netlify.app/zh/)
>
> [RSSHub docs](https://docs.rsshub.app/zh/)

选了 Reeder，iPhone/iPad/Mac 都用了这个，不过 Mac 需要单独买，不能直接用移动端的

![image-20241128173426712](http://cdn.ayusummer233.top/DailyNotes/202411281734849.png)

---

可以配合自建 [RSSHub](https://rsshub.netlify.app/zh/)(如果公共的能满足需求也可以用公共的) 使用，这样可以把一些自身不提供 RSS 的站点的信息也转换成 RSS 整合进来：

![image-20241205200809941](http://cdn.ayusummer233.top/DailyNotes/202412052008074.png)

> RSSHub 作者还有个牵头的新作品： [follow](https://follow.is/)， 界面与 Reeder 比较相似，比较美观，目前处于公测阶段
>
> ![image-20241205203649808](http://cdn.ayusummer233.top/DailyNotes/202412052036849.png)
>
> 不过我更喜欢 Reeder 的交互体验以及内嵌的 Safari 浏览器阅读（follow要读原文的话需要跳转到外部浏览器），以及目前还不清楚 follow 后续的商业化收费方案，如果像其他 RSS 订阅站点一样对基础功能做限制的话我想我还是会继续选择 Reeder

---

### 跨屏协同

> [Synergy](https://symless.com/synergy/download)

由于手头有一个 Logi 的 Master2S 鼠标， 是支持 Logi Options+ 的 Flow 功能来跨屏协同的，所以一开始尝试的是这种方案，结果连了两个点也连不上同一个局域网里的 MateBook 和 macMini

![2c0fbe16cbe601f9ea6cd54be171bd5c](http://cdn.ayusummer233.top/DailyNotes/202412052017379.png)

![d96a3e699fa81c2aaeac1c089ec3c7a4](http://cdn.ayusummer233.top/DailyNotes/202412052017756.png)

甚至在matebook上已经显示mac已经就绪了结果连不上自己（MateBook）（这种情况出现在使用接收器连接mac，使用蓝牙连接Matebook的场景中），各种方法都试了，换着插接收器，连两个蓝牙，重启电脑之类的也都试了，都没能成功连接，很搞心态

> [Logi Support / Mac 的 Flow 网络设置检查](https://support.logi.com/hc/zh-cn/articles/360023196954-Mac-%E7%9A%84-Flow-%E7%BD%91%E7%BB%9C%E8%AE%BE%E7%BD%AE%E6%A3%80%E6%9F%A5)
>
> [修复 Logitech Flow 不起作用的 14 种方法 / 极客指南](https://guid.cam/tech/blogs/fix-logitech-flow-not-working/)

然后在 [一篇知乎的帖子](https://zhuanlan.zhihu.com/p/26603394) 中发现了 [Synergy](https://symless.com/synergy) 可以跨设备(Windows, macOS, Linux) 共享键鼠， 试用下来确实不错

![23663b169eb898f280a1d7c018897b56](http://cdn.ayusummer233.top/DailyNotes/202412052030809.png)

需要设备在同局域网下，可以输入ip连接就很不错， 不像  Logi Options+ Flow 只能程序自动搜索还搜索不到

需要注意的是这是一个商业软件， 付款方案如下：

![image-20241205203300331](http://cdn.ayusummer233.top/DailyNotes/202412052033391.png)

也可以考虑其上游开源项目 [Deskflow](https://github.com/deskflow/deskflow) 

![image-20241205203435405](http://cdn.ayusummer233.top/DailyNotes/202412052034447.png)

---

### 磁盘空间可视化-baobab

```bash
brew install baobab
baobab
```

![image-20250121202356404](http://cdn.ayusummer233.top/DailyNotes/202501212023660.png)

---

### 磁盘空间可视化-grandperspectiv

> [GrandPerspective](https://grandperspectiv.sourceforge.net/)

![image-20250306110718782](http://cdn.ayusummer233.top/DailyNotes/202503061107854.png)

---

### QQ

#### QQ聊天记录占用系统存储空间太大的解决方案

macOS 上的 QQ 无法设置聊天记录的存储位置

![image-20250320202855449](http://cdn.ayusummer233.top/DailyNotes/202503202028754.png)

时间长了就会变的严重占用 Mac 的存储空间

![image-20250320202909403](http://cdn.ayusummer233.top/DailyNotes/202503202029459.png)

对于苹果的“金子存储”而言这是无法忍受的， 尤其是当买的Mac存储空间比较小时更是如此

![image-20250320203048758](http://cdn.ayusummer233.top/DailyNotes/202503202030820.png)

macOS 上 QQ 默认将聊天记录存储在用户的 `~/Library/Containers/com.tencent.qq/Data/Library/Application Support/QQ `

![image-20250320203504419](http://cdn.ayusummer233.top/DailyNotes/202503202035529.png)

![image-20250320203553002](http://cdn.ayusummer233.top/DailyNotes/202503202035051.png)

直接把类似如下样式的目录拷贝到外挂磁盘上然后扬了这个目录即可，每个账号都有一个类似名称的目录

![image-20250320221451486](http://cdn.ayusummer233.top/DailyNotes/202503202214685.png)

---

##### 以下作废，权当记录，暂时解决不了权限问题，最终解决方案是定期备份清理（

在我装了外挂硬盘的情况下，可以使用符号链接的方式将此目录移动到外挂硬盘然后再链回来

首先退出 QQ

然后在命令行中移动该目录到外挂硬盘再链回来：

```bash
mv ~/Library/Containers/com.tencent.qq/Data/Library/Application\ Support/QQ /你的新存储路径
ln -s /你的新存储路径/QQ ~/Library/Containers/com.tencent.qq/Data/Library/Application\ Support/QQ

# 例如
mv ~/Library/Containers/com.tencent.qq/Data/Library/Application\ Support/QQ /Volumes/SummerDocs/AppContents/QQ
ln -s /Volumes/SummerDocs/AppContents/QQ/QQ ~/Library/Containers/com.tencent.qq/Data/Library/Application\ Support/QQ
```

> PS: 务必注意这里的目标目录, mv 的时候会将整个 QQ move 到你的目标目录，在上述示例中也即新的 QQ 路径为 `/Volumes/SummerDocs/AppContents/QQ/QQ` 有两层
>
> 这里我就搞错了, 使用了 `ln -s /Volumes/SummerDocs/AppContents/QQ ~/Library/Containers/com.tencent.qq/Data/Library/Application\ Support/QQ`， 导致后续启动 QQ 出现报错
>
> ![image-20250320205905387](http://cdn.ayusummer233.top/DailyNotes/202503202059443.png)
>
> 我需要先取消链接：
>
> ```bash
> unlink ~/Library/Containers/com.tencent.qq/Data/Library/Application\ Support/QQ
> ```
>
> ![image-20250320211914108](http://cdn.ayusummer233.top/DailyNotes/202503202119238.png)
>
> 然后再重新正确链接
>
> ```bash
> ln -s /Volumes/SummerDocs/AppContents/QQ/QQ ~/Library/Containers/com.tencent.qq/Data/Library/Application\ Support/QQ
> ```
>
> ![image-20250320212043681](http://cdn.ayusummer233.top/DailyNotes/202503202120733.png)

![image-20250320210546501](http://cdn.ayusummer233.top/DailyNotes/202503202105586.png)

![image-20250320205541736](http://cdn.ayusummer233.top/DailyNotes/202503202055917.png)

![image-20250320212140325](http://cdn.ayusummer233.top/DailyNotes/202503202121375.png)

---

完成后再查看存储空间管理：

![image-20250320205724207](http://cdn.ayusummer233.top/DailyNotes/202503202057252.png)

![image-20250320205755712](http://cdn.ayusummer233.top/DailyNotes/202503202057751.png)

舒服多了～

---

不过此时重新打开QQ出现了新的问题：



可以看到是文件写入权限不足

虽然我们看到他尝试在新的 QQ 目录下创建 log 目录， 我们可以手动创建 log 目录， 但是如果后续还有新文件创建的话依旧可能报错，因此我们需要授予QQ对目标目录的访问权限

理论上可以通过 `「设置」 >「隐私与安全性」 > 「文件与文件夹」 ` 来修改 QQ 的文件访问属性，但是可惜在此选项中我并没有找到 QQ， 并且在这里只能删除应用对文件/文件夹的访问权限而不能增加

![image-20250320210814297](http://cdn.ayusummer233.top/DailyNotes/202503202108376.png)

因此需要退而求其次，授予QQ `完全磁盘访问权限`，在 `「设置」 >「隐私与安全性」 > 「完全磁盘访问权限」 ` 中点击 `+` 进行设置

![image-20250320210959048](http://cdn.ayusummer233.top/DailyNotes/202503202109081.png)

![image-20250320211115023](http://cdn.ayusummer233.top/DailyNotes/202503202111120.png)

授予权限后重启QQ，仍然报错：

![image-20250320211129998](http://cdn.ayusummer233.top/DailyNotes/202503202111043.png)

那么只能尝试先手动创建 log 目录了

















