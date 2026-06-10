---
category:
  - 通识
  - macOS
tags:
  - 通识
  - macOS
excerpt: macOS 常用知识集合：Homebrew 安装与包版本覆盖、压缩工具、软硬链接、路由操作、SSH 密钥生成、代理软件对比、跨屏协同与磁盘空间清理。
~category:
  - 通识
  - macOS
---

# macOS

- [macOS](#macos)
  - [命令行](#命令行)
    - [Homebrew](#homebrew)
      - [安装](#安装)
    - [压缩与解压](#压缩与解压)
      - [解压7z压缩包](#解压7z压缩包)
      - [ZSTD](#zstd)
    - [软硬链接](#软硬链接)
  - [Apps](#apps)
    - [卸载应用](#卸载应用)
      - [删除登录项后台残留](#删除登录项后台残留)
    - [代理选择-ClashVergeRev/Surge](#代理选择-clashvergerevsurge)
    - [RSS](#rss)
    - [跨屏协同](#跨屏协同)
    - [磁盘空间可视化](#磁盘空间可视化)
      - [baobab](#baobab)
      - [grandperspectiv](#grandperspectiv)
    - [清理空间](#清理空间)
    - [QQ](#qq)
      - [QQ聊天记录占用系统存储空间太大的解决方案](#qq聊天记录占用系统存储空间太大的解决方案)
        - [以下作废，权当记录，暂时解决不了权限问题，最终解决方案是定期备份清理（](#以下作废权当记录暂时解决不了权限问题最终解决方案是定期备份清理)
  - [Refs](#refs)

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

> | **文件**  | **加载时机**                                                                                                        | **主要用途**                                                                                           |
> | --------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
> | .zshrc    | 仅在 **交互式 Shell** 启动时加载。交互式 Shell 指的是直接在终端中打开的会话，用于用户交互（如运行命令）。           | 用于配置交互式会话的内容，例如别名、函数、快捷键绑定、Shell 提示符等。适合用于提升终端的日常操作效率。 |
> | .zprofile | 仅在 **登录 Shell** 启动时加载。登录 Shell 通常指通过远程登录（如 SSH）或登录系统时启动的 Shell，会话初始化更完整。 | 用于配置与会话初始化有关的内容，例如设置环境变量（PATH、JAVA_HOME）、运行需要的初始化脚本等。          |

![image-20241125012651582](http://cdn.ayusummer233.top/DailyNotes/202411250126639.png)

> ![image-20241125012806241](http://cdn.ayusummer233.top/DailyNotes/202411250128295.png)

---

### 🛠️ Homebrew 包版本滞后：手动升级覆盖指南

**适用场景：**
当你发现某个软件（如 `cliproxyapi`）在 GitHub 上已经发布了最新版本（Release），但由于 Homebrew 官方源审核延迟，导致运行 `brew upgrade` 始终显示旧版本时，可通过此方法进行“无损”的手动强制覆盖。

**核心优势：**

- **即刻生效**：无需等待官方合并 PR 即可用上最新代码。
- **安全无损**：不会破坏 Homebrew 的依赖树，未来官方源更新后，依然可以正常使用 `brew upgrade` 覆盖回来。

---

#### 📝 操作步骤（以 `cliproxyapi` 为例）

> 这里仅做示例说明，但是 cliproxyapi 不能用这种方式更新， 因为他是前后端一体上传到 brew 的，下面这种方式不能更新前端，用后端替换了前后端整合包， 是不可用的

1. 确认系统架构与下载最新包

   前往该开源项目的 GitHub Releases 页面，下载最新的二进制压缩包。
   - **Apple Silicon (M1/M2/M3/M4) 用户：** 下载带有 `arm64` 或 `aarch64` 字样的包（例如：`CLIProxyAPI_darwin_arm64.tar.gz`）。

   - **Intel Mac 用户：** 下载带有 `amd64` 或 `x86_64` 字样的包（例如：`CLIProxyAPI_darwin_amd64.tar.gz`）。

2. 暂停当前服务

   在覆盖文件之前，必须先停掉正在运行的旧版本后台服务，防止文件被系统占用。

   ```bash
   brew services stop cliproxyapi
   ```

3. 解压并准备替换

   双击下载好的 `.tar.gz` 文件进行解压。通常解压后会得到一个名为 `cliproxyapi` 的无后缀可执行文件。

4. 暴力覆盖 Homebrew 目录文件

   打开终端，使用 `cp` 命令将新文件复制并覆盖掉 Homebrew 的旧文件。

   _(注：以下命令假设你下载的文件在默认的 `Downloads` 文件夹中。)_

   **对于 M 系列芯片 Mac (路径为 `/opt/homebrew`)：**

   ```bash
   cp ~/Downloads/cliproxyapi /opt/homebrew/bin/cliproxyapi
   ```

   对于 Intel 芯片 Mac (路径为 `/usr/local`)：

   ```bash
   cp ~/Downloads/cliproxyapi /usr/local/bin/cliproxyapi
   ```

5. 重启服务与验证

   重启后台服务，让新版本接管工作：

   ```bash
   brew services start cliproxyapi
   ```

   验证当前实际运行的版本是否已经是最新版（如果该软件支持版本查询命令）：

   ```bash
   cliproxyapi --version
   ```

---

#### 💡 常见问题 (FAQ)

**Q：覆盖后，如果明天 Homebrew 官方也更新了这个版本，会冲突吗？**

A：完全不会。当你下次运行 `brew upgrade cliproxyapi` 时，Homebrew 会像往常一样，用官方编译的最新包再次把这个路径下的文件覆盖掉。这个手动操作只是一个完美的临时“替身”。

**Q：运行覆盖命令时提示 `Permission denied` 怎么办？**

A：说明文件权限不足，可以在 `cp` 命令前加上 `sudo` 提权执行，例如：`sudo cp ~/Downloads/cliproxyapi /opt/homebrew/bin/cliproxyapi`。

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

#### ZSTD

zstd (Zstandard) 是一种快速无损压缩算法，由 Facebook 开发，提供高压缩比和快速的压缩/解压缩速度。

`基本用法`:

```bash
zstd [选项] 文件名 [-o 输出文件名]
```

`常用参数`:

- **基本压缩**：`zstd 文件名`
  - 默认生成同名的 `.zst` 文件
- **指定输出文件**：`zstd 文件名 -o 输出文件名`
  - 例如：`zstd input.txt -o compressed.zst`
- **压缩级别**：`zstd -[级别] 文件名`
  - 级别范围：1-19
  - 1：最快压缩速度，压缩比较低
  - 19：最高压缩率，但压缩速度较慢
  - 默认级别：3
- **解压缩**：`zstd -d 文件名.zst` 或 `unzstd 文件名.zst`

- **多线程压缩**：`zstd -T0 文件名` (使用所有可用CPU核心)

  **`-T1`**：单线程模式（默认行为）

  **`-T4`**：指定使用4个线程

- **递归压缩目录**：`zstd -r 目录名`

- **保留原文件**：默认行为

- **删除原文件**：`zstd --rm 文件名`

- **查看压缩文件信息**：`zstd -l 文件名.zst`

---

要压缩整个目录可以采用先压 tar 再压 zstd 的形式:

```bash
tar -cf - [dir_path] | zstd -19 -T0 -o output.tar.zst
```

---

### 软硬链接

> - [Windows软硬链接](../Windows.md#软链接与硬链接)
> - [Linux软硬链接](../Linux/index.md#软硬链接)

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

### 路由操作

```bash
# 添加临时路由
sudo route -n add -net 192.168.2.0/24 192.168.2.1
# 删除临时路由
sudo route -n delete 192.168.2.0/24
# 查看是否添加成功
netstat -rn | grep 192.168.2
# 查看实际使用路径，比如寻址到 192.168.2.114
route -n get 192.168.2.114
# 看网关是否可达
arp -a | grep 192.168.2.1
ping 192.168.2.1
```

```bash
# 列出所有网卡
networksetup -listallnetworkservices
# 查看指定网卡上的附加路由
networksetup -getadditionalroutes "Wi-Fi"

# 为指定网卡添加附加路由
# 格式：networksetup -setadditionalroutes "网卡名" 目的网段 掩码 网关
sudo networksetup -setadditionalroutes "Wi-Fi" 192.168.2.0 255.255.255.0 192.168.2.1

# 删除指定网卡上的指定路由
sudo networksetup -setadditionalroutes "Wi-Fi" 192.168.2.0 255.255.255.0 192.168.2.1

# 清除指定网卡上的所有附加路由
sudo networksetup -setadditionalroutes "Wi-Fi"
```

---

### 生成秘钥

```bash
ssh-keygen -t ed25519 -C "summery233_mac"
```

- **RSA：** 诞生于 1977 年。它的数学基础是**“大整数分解难题”**（把两个极大的质数相乘很容易，但要把乘积反向推导回那两个质数极其困难）。

- **Ed25519：** 诞生于 2011 年。它是基于**“椭圆曲线密码学 (ECC)”**的一种特定算法（使用了 Twisted Edwards 曲线）。它的数学基础是“椭圆曲线离散对数难题”。

- 秘钥长度上
  - **RSA：** 为了保证安全性不被现代计算机破解，目前的 RSA 密钥长度最低要求是 2048 位，通常推荐 **3072 位或 4096 位**。生成的公钥和私钥是一大坨密密麻麻的字符串，复制粘贴时非常容易漏掉头尾，放在 `authorized_keys` 文件里极其占地方。

  - **Ed25519：** 它只需要 **256 位**的密钥长度，就能提供与 RSA 3000 位同等甚至更高的安全级别。

    它的公钥只有短短的一行，大概 68 个字符（例如：`ssh-ed25519 AAAAC3NzaC1... user@host`）。

- 性能与速度上
  - **RSA：** 验证签名很快，但是**生成签名和生成密钥的速度非常慢**。而且随着密钥长度增加到 4096 位，它对 CPU 和内存的消耗呈指数级上升。
  - **Ed25519：** 性能很强。它的签名生成、签名验证和密钥生成速度都极快（比 RSA 签名快十几倍）。在处理大量并发 SSH 连接的服务器上，或者在性能较弱的嵌入式设备/软路由上，Ed25519 能显著降低 CPU 负载。

- 在安全圈，算法的理论安全是一回事，代码实现的“物理安全”是另一回事。
  - RSA 在运算时，计算时间会受到输入数据的影响。黑客可以通过测量服务器响应时间的微小差异（Timing Attacks，计时攻击），反向推导出私钥。历史上开发者为了修补 RSA 的这类漏洞，打补丁打得焦头烂额。
  - **Ed25519 的创造者（密码学大神 Daniel J. Bernstein）在设计之初，就从数学层面做到了**恒定时间运算 (Constant-time)\*\*。这意味着无论输入什么数据，它计算签名的时间都是固定的，直接从物理维度免疫了计时攻击。并且它生成签名不依赖随机数发生器，避免了因为系统随机数不够“随机”而导致私钥泄露的风险。

- Ed25519 唯一的短板大概是兼容性
  - **RSA：** 地球上任何一台支持 SSH 的上古路由器、十年前的 CentOS 6 老服务器，都认 RSA。

  - **Ed25519：** OpenSSH 从 6.5 版本（2014 年发布）开始支持。

    这意味着，除非你在维护十几年没升级过系统的老旧政企项目，否则在如今的现代 IT 环境（GitHub, GitLab, AWS, 阿里云, 现代 Linux）中，Ed25519 的支持率已经是 100% 了。

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
   > ***
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
>
> PS; 后续全面转 Follow 了, 可以便捷地找到更多订阅

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

需要设备在同局域网下，可以输入ip连接就很不错， 不像 Logi Options+ Flow 只能程序自动搜索还搜索不到

需要注意的是这是一个商业软件， 付款方案如下：

![image-20241205203300331](http://cdn.ayusummer233.top/DailyNotes/202412052033391.png)

也可以考虑其上游开源项目 [Deskflow](https://github.com/deskflow/deskflow)

![image-20241205203435405](http://cdn.ayusummer233.top/DailyNotes/202412052034447.png)

---

### 磁盘空间可视化

#### baobab

```bash
brew install baobab
baobab
```

![image-20250121202356404](http://cdn.ayusummer233.top/DailyNotes/202501212023660.png)

---

#### grandperspectiv

> [GrandPerspective](https://grandperspectiv.sourceforge.net/)

![image-20250306110718782](http://cdn.ayusummer233.top/DailyNotes/202503061107854.png)

---

### 清理空间

[写了一个 Mac 清理工具 Mole，看看你能清理出多少 GB？/ V2EX / 分享创造](https://www.v2ex.com/t/1163304)

[mac 系统数据 100 多 G，应该如何清理？/ V2EX / macOS](https://www.v2ex.com/t/1163403#reply9)

---

### QQ

#### QQ聊天记录占用系统存储空间太大的解决方案

macOS 上的 QQ 无法设置聊天记录的存储位置

![image-20250320202855449](http://cdn.ayusummer233.top/DailyNotes/202503202028754.png)

时间长了就会变的严重占用 Mac 的存储空间

![image-20250320202909403](http://cdn.ayusummer233.top/DailyNotes/202503202029459.png)

对于苹果的“金子存储”而言这是无法忍受的， 尤其是当买的Mac存储空间比较小时更是如此

![image-20250320203048758](http://cdn.ayusummer233.top/DailyNotes/202503202030820.png)

macOS 上 QQ 默认将聊天记录存储在用户的 `~/Library/Containers/com.tencent.qq/Data/Library/Application Support/QQ`

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

理论上可以通过 `「设置」 >「隐私与安全性」 > 「文件与文件夹」` 来修改 QQ 的文件访问属性，但是可惜在此选项中我并没有找到 QQ， 并且在这里只能删除应用对文件/文件夹的访问权限而不能增加

![image-20250320210814297](http://cdn.ayusummer233.top/DailyNotes/202503202108376.png)

因此需要退而求其次，授予QQ `完全磁盘访问权限`，在 `「设置」 >「隐私与安全性」 > 「完全磁盘访问权限」` 中点击 `+` 进行设置

![image-20250320210959048](http://cdn.ayusummer233.top/DailyNotes/202503202109081.png)

![image-20250320211115023](http://cdn.ayusummer233.top/DailyNotes/202503202111120.png)

授予权限后重启QQ，仍然报错：

![image-20250320211129998](http://cdn.ayusummer233.top/DailyNotes/202503202111043.png)

那么只能尝试先手动创建 log 目录了

---

## 存储空间分析

![image-20260311100337084](http://cdn.ayusummer233.top/DailyNotes/202603111003472.png)

丐版 Mac 最容易遇到这种 macOS + 系统数据占据数据绝大头的问题，即便把能迁移的数据全都迁移到可移动磁盘依旧因为应用沙盒机制会占用主盘空间，尤其是国产聊天软件

使用如下命令来扫描电脑里所有主要目录（包括用户目录、系统目录、挂载的硬盘等）的大小，并按从大到小排列：

```bash
sudo du -sh /Users/* /Library /System /Volumes/* | sort -rh
```

![image-20260311112134410](http://cdn.ayusummer233.top/DailyNotes/202603111121767.png)

可以看到主盘最占空间的是这俩目录

- `/Users/summery233` summery233 用户资源目录
- `/Library` 系统资源目录

---

### 用户资源目录

```bash
du -sh ~/* | sort -rh | head -n 10
```

![image-20260311112846675](http://cdn.ayusummer233.top/DailyNotes/202603111138293.png)

可以看到用户资源目录里大头还是 `~/Library`, 其次就是图库 `~/Pictures`, 不过图库可以迁移到外置磁盘

---

#### 图库迁移到外置磁盘

![image-20260311133712918](http://cdn.ayusummer233.top/DailyNotes/202603111337122.png)

找到图示图库，准备一个外置磁盘目录然后将其拖过去：

![image-20260311133810271](http://cdn.ayusummer233.top/DailyNotes/202603111338325.png)

复制完成后确认下 `照片` App 是否打开， 打开了的话退出一下

![image-20260311134213295](http://cdn.ayusummer233.top/DailyNotes/202603111342340.png)

接下来**按住键盘上的 `Option` (⌥) 键不放**，然后点击打开“照片”App。

> 如果不是原生 Mac 键盘而是那种带 Win Mac 模式互转的键盘的话 Option 键通常是键盘上的 Win 键

![image-20260311134520425](http://cdn.ayusummer233.top/DailyNotes/202603111345475.png)

选择我们拷贝过去的图库：

![image-20260311134603939](http://cdn.ayusummer233.top/DailyNotes/202603111346993.png)

打开后确认图片没缺失即可

一般来说图库都是 ICloud 自动同步的， 所以还要做额外设置，在打开 `照片`App 的情况下，点击屏幕左上角的 `照片->设置` :

![image-20260311135049545](http://cdn.ayusummer233.top/DailyNotes/202603111350639.png)

在 `通用` 页面下找到并点击 `用作系统照片图库`：

![image-20260311135125301](http://cdn.ayusummer233.top/DailyNotes/202603111351375.png)

![image-20260311135216245](http://cdn.ayusummer233.top/DailyNotes/202603111352324.png)

点击 `好` 之后可能会卡顿一会，鼠标指针开始转圈，等待一会儿后就好了：

![image-20260311135924571](http://cdn.ayusummer233.top/DailyNotes/202603111359809.png)

然后退出 `照片` App 再重新打开， 会显示：

![image-20260311140039670](http://cdn.ayusummer233.top/DailyNotes/202603111400749.png)

再确认下 `照片->设置` 中的图库位置无误后就可以把 `~/Pictures` 中的图库删了

![image-20260311140108258](http://cdn.ayusummer233.top/DailyNotes/202603111401363.png)

![image-20260311140159591](http://cdn.ayusummer233.top/DailyNotes/202603111401655.png)

然后倾倒下废纸篓就行了：

![image-20260311140227985](http://cdn.ayusummer233.top/DailyNotes/202603111402044.png)

这样就有一块空余空间了：

![image-20260311140403900](http://cdn.ayusummer233.top/DailyNotes/202603111404978.png)

---

#### ~/Library

```bash
du -sh ~/Library/* | sort -rh | head -n 10
```

![image-20260311113049309](http://cdn.ayusummer233.top/DailyNotes/202603111130444.png)

---

看看 Application Support 里啥占用了 27G 的空间：

```bash
du -sh ~/Library/Application\ Support/* | sort -rh | head -n 10
```

![image-20260311140707496](http://cdn.ayusummer233.top/DailyNotes/202603111407583.png)

看上去大都是开发工具占用的空间，这部分空间可以一点点进去排查是啥占用的空间判断能不能缩减

比如我这里 VSCode 是 CodeQL 占用了大半空间，CodeQL 不怎么用，删除就行了

![image-20260311164153441](http://cdn.ayusummer233.top/DailyNotes/202603111641517.png)

---

看看 Containers 里啥占用了 25G 空间：

```bash
du -sh ~/Library/Containers/* | sort -rh | head -n 10
```

![image-20260311154758294](http://cdn.ayusummer233.top/DailyNotes/202603111547608.png)

基本都是国产聊天软件占用的空间，这些空间无法通过软链接的方式链接到外置硬盘使用，否则启动应用会有权限报错，QQ 自带的清理也不太好用，只有定期膨胀到一定程度卸载重装QQ来解决了

---

看下 Caches 里啥占用了 14G 空间：

```bash
du -sh ~/Library/Caches/* | sort -rh | head -n 10
```

![image-20260311164446728](http://cdn.ayusummer233.top/DailyNotes/202603111644805.png)

这些缓存可以随便清理

```bash
rm -rf ~/Library/Caches/*
```

![image-20260311165054486](http://cdn.ayusummer233.top/DailyNotes/202603111650761.png)

顺手清理下 HomeBrew:

```bash
brew cleanup
```

---

### 系统资源目录

```bash
du -sh /Users/summery233/Documents/* | sort -rh | head -n 10
```

![image-20260311112919340](http://cdn.ayusummer233.top/DailyNotes/202603111129451.png)

---

## Refs

- NAS
  - [Mac mini 全功能 NAS 配置指南 / 进阶家庭服务器 / mac linux 子系统 / casaOS / 飞牛OS 虚 / bilibili / GearsNomad](https://www.bilibili.com/video/BV1paC5Y8EtT)
  - [买了个 mac mini 来做 nas，可行吗？ / V2EX / NAS](https://www.v2ex.com/t/1103466)
