# Mac

- [Mac](#mac)
  - [Homebrew](#homebrew)
    - [安装](#安装)
  - [解压7z压缩包](#解压7z压缩包)

---

## Homebrew

**Homebrew** 是 macOS 和 Linux 上的一种流行的包管理工具，它的核心作用是帮助用户更轻松地安装、更新、卸载和管理各种软件和工具包。它被称为 macOS 的“缺失的软件包管理器”。

---

Homebrew 将所有下载的软件和库安装在 `/usr/local` 目录下（Linux 系统为 `/home/linuxbrew`）。

它使用 Git 来管理自己的核心代码和包公式（Formula），并通过这些公式定义如何构建和安装软件。

---

### 安装

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

## 解压7z压缩包

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

## 代理选择-ClashVergeRev

> [hadowrocket/Quantumult X/Surge/Loon代理软件那个好？哪个更适合iOS系统 / sites.google.com/site/besttopvps](https://sites.google.com/site/besttopvps/which-one-is-more-suitable-for-ios)

> 当前配置：16 + 256 的 MacMini

按照时间顺序叙述使用体验：

1. `shadowrocket`: 可以直接在 AppStore 里下载使用 iPhone/iPad 版的 shadowrocket，正常浏览网页使用设备啥的是没问题的，使用很丝滑，直到 pip 报错开始寻找 mac 的解决方案

2. `Quantumult X`: 同上可以在 AppStore 中下载使用 iPhone/iPad 版的，用起来还不错，不过移动端上 shadowrocket 基本就足够了，Quantumult X 用的不多，也不是很熟悉，保留作为备选方案，继续寻找桌面端解决方案

   > [Quantumult X 新手入门教程](https://github.com/kjfx/QuantumultX?tab=readme-ov-file)

3. `Surge`: 界面很美观，功能很强大，不过对于丐版 macMini 来说负担有点重，跑起来很卡，尤其是顶部的图标菜单，尤其卡顿，最终没选择购入

   > PS：没有找到便捷的扩充机场订阅的规则的方法，用起来不是很顺手
   >
   > PS: 可以很方便地查看指定APP的网络活动，这放面比Fiddler便宜方便，可以结合ClashVergeRev扩展规则使用，准备蹲个车

   > [我有特别的 Surge 配置和使用技巧-Sukka](https://blog.skk.moe/post/i-have-my-unique-surge-setup/)

4. `ClashX(Pro)`: 对比 Win 上的 Clash 感觉有些简陋，功能也没多少，跳过

5. `shadowrocketX-NG`: 无法启动，跳过

6. `ClashVergeRev`: 使用体验可以无缝衔接 Win Clash 的使用，加分；可以很方便地扩展机场订阅的规则(`右键订阅文件->编辑规则`，添加前置或后置规则)，加分；最终选择了这款作为当前设备的解决方案；

---

## 删除登录项后台残留

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

## RSS

> [Mac 上的 RSS 阅读工具，你有这些好看实用的选择 / 少数派](https://sspai.com/post/55050)

选了 Reeder，iPhone/iPad/Mac 都用了这个，不过 Mac 需要单独买，不能直接用移动端的

![image-20241128173426712](http://cdn.ayusummer233.top/DailyNotes/202411281734849.png)

---



