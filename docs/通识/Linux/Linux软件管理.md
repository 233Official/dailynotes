
# Linux 软件管理

- [Linux 软件管理](#linux-软件管理)
  - [命令行安装](#命令行安装)
  - [查看软件安装位置](#查看软件安装位置)
  - [软件包](#软件包)
  - [Firefox](#firefox)
  - [微信](#微信)

---

## 命令行安装

如下三个命令是 Linux 系统中比较常见的用于安装软件的命令:

- **`apt-get`**：传统工具，稳定且功能强大，适合高级用户和脚本。
- **`apt`**：现代化的工具，推荐日常使用，特别是对于普通用户。
- **`aptitude`**：提供更高级的功能和图形界面，适合复杂包管理操作和依赖解决。

---

`apt-get`

- **简介**：`apt-get` 是较老的命令行工具，用于处理软件包的安装、更新和删除。
- **功能**：功能强大且稳定，是很多高级用户和脚本中的首选。
- **用户体验**：输出较为简洁，默认情况下没有启用进度条和颜色。
- 常用命令
  - `apt-get update`：更新包列表。
  - `apt-get upgrade`：升级已安装的包。
  - `apt-get install <package>`：安装包。
  - `apt-get remove <package>`：卸载包。
  - `apt-get dist-upgrade`：智能升级系统，处理依赖关系的变化。
  - `apt-get autoremove`：自动移除不再需要的包。

- `apt`
  - **简介**：`apt` 是 `apt-get` 和其他 `apt-*` 工具（如 `apt-cache`）的统一前端，旨在简化和统一命令行包管理。
  - **功能**：结合了 `apt-get` 和 `apt-cache` 的功能，提供简洁的命令。
  - **用户体验**：更人性化，输出更友好，默认启用一些高级功能（如进度条和颜色）。
  - 常用命令
    - `apt update`：更新包列表。
    - `apt upgrade`：升级已安装的包。
    - `apt install <package>`：安装包。
    - `apt remove <package>`：卸载包。
    - `apt search <package>`：搜索包。
    - `apt list`：列出包。
- `aptitude`
  - **简介**：`aptitude` 是 `apt-get` 的高级替代品，提供了图形界面和命令行界面，用于软件包管理。
  - **功能**：提供更高级的功能和更好的依赖管理，允许用户选择不同的解决方案来处理依赖冲突。
  - **用户体验**：交互式的图形界面（在终端内运行），适合需要更细致控制的用户。
  - 常用命令
    - `aptitude update`：更新包列表。
    - `aptitude upgrade`：升级已安装的包。
    - `aptitude install <package>`：安装包。
    - `aptitude remove <package>`：卸载包。
    - `aptitude search <package>`：搜索包。
    - `aptitude safe-upgrade`：安全升级包，避免删除或安装新的包。

---

## 查看软件安装位置

> [Ubuntu 中查看软件的安装位置及安装文件 - Macrored - 博客园 (cnblogs.com)](https://www.cnblogs.com/macrored/p/11757888.html)

```bash
whereis
which
```


---

## 软件包

类似于 Windows 上的 exe, msi, zip,  Linux 上得到软件包分发也有几种常见格式

- `tar`

  - `简介`: tar` 包（通常扩展名为 `.tar.gz` 或 `.tar.bz2`）是一种压缩归档文件，类似于 Windows 的 ZIP 文件。

    它通常用于分发源代码或其他文件集合。

  - 使用方法

    - 解压缩文件

      ```bash
      tar -xzvf filename.tar.gz  # 使用 gzip 压缩的 tar 包
      tar -xjvf filename.tar.bz2  # 使用 bzip2 压缩的 tar 包
      ```

    - 通常需要进入解压后的目录并根据包含的 `README` 或 `INSTALL` 文件的指示进行安装。一般情况下，使用以下命令：

      ```bash
      ./configure
      make
      sudo make install
      ```

- `deb`

  - `特点`: `deb` 包是 Debian 系列（包括 Ubuntu 等）的包管理格式。

    这种包通常包含二进制文件和依赖信息，安装时会自动解决依赖关系。

  - 使用方法

    安装 deb 包

    ```bash
    sudo dpkg -i filename.deb
    ```

    如果有依赖问题，可以使用以下命令来解决

    ```bash
    sudo apt-get install -f
    ```

- `AppImage` 

  - `特点`: `AppImage` 是一种便携的 Linux 应用程序格式。它包含应用程序的所有依赖项，可以在大多数现代 Linux 发行版上运行，而无需安装。

  - `使用方法`:

    - 赋予可执行权限

      ```bash
      chmod +x filename.AppImage
      ```

    - 运行应用程序

      ```bash
      ./filename.AppImage
      ```

---

## Firefox

> [在 Linux 中安装 Firefox | Firefox 帮助 (mozilla.org)](https://support.mozilla.org/zh-CN/kb/linux-firefox#w_cong-fa-xing-ban-ti-gong-de-bao-an-zhuang-tui-jian)
>
> ---

1. 从 [Firefox 下载页面](https://www.mozilla.org/firefox/linux/?utm_medium=referral&utm_source=support.mozilla.org) 并点击 {button 立即下载} 按钮。

2. 打开一个**终端**，转到下载 Firefox 的目录，比如

- `cd ~/Downloads`

3. 将下载文件的内容解压缩：

- `tar xjf firefox-\*.tar.bz2`

以下命令必须以 root 身份执行，或以 `sudo` 开头。

4. 将解压的 Firefox 目录移到 _/opt_:

- `mv firefox /opt`

5. 创建一个指向 Firefox 可执行文件的 symlink:

- `ln -s /opt/firefox/firefox /usr/local/bin/firefox`

6. 下载一个 desktop 文件：

- `wget https://ghproxy.com/https://raw.githubusercontent.com/mozilla/sumo-kb/main/install-firefox-linux/firefox.desktop -P /usr/local/share/applications`

如果，没有安装 `wget`，那么你可以右击以上链接，打开弹出菜单并选择 另存为。下载好文件之后，把它放到 _/usr/local/share/applications_。

你可以打开 [排障信息](https://support.mozilla.org/zh-CN/kb/使用故障排除信息页面来帮助解决Firefox的问题) 页面来验证安装是否成功。在 _应用基础_ 部分，Application Binary 应该是 `/opt/firefox/firefox-bin`。

---

## 微信

> [Ubuntu 下如何使用微信 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/413646220)
>
> [Ubuntu 安装微信，三步到位\_辞与不羡的博客-CSDN 博客\_ubuntu 安装微信](https://blog.csdn.net/m0_50502579/article/details/126096484)
>
> ---

安装 kylin.wine 封装版的微信

与 deepin 一样，ubuntukylin(优麒麟) 系统也第三方封装的 ubuntu。

```bash
# 下载Wine环境包：
wget http://archive.ubuntukylin.com/software/pool/partner/ukylin-wine_70.6.3.25_amd64.deb
# 下载微信(wine) 包：
wget http://archive.ubuntukylin.com/software/pool/partner/ukylin-wechat_3.0.0_amd64.deb
# 安装
sudo apt-get install -f -y ./ukylin-wine_70.6.3.25_amd64.deb
sudo apt-get install -f -y ./ukylin-wechat_3.0.0_amd64.deb
```

然后就可以在应用程序页面最后看到微信的图标了

---
