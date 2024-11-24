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



