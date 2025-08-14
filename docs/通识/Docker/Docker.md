---
category: 通识
tags:
  - Docker
excerpt: Docker 是一个开源的应用容器引擎，允许开发者打包应用及其依赖到一个可移植的容器中，并且可以在任何流行的 Linux 机器上运行。
---

# Docker

- [Docker](#docker)
  - [安装](#安装)
  - [换源](#换源)
    - [Docker-hub 换源](#docker-hub-换源)
  - [代理](#代理)
    - [Daemon configuration(守护进程配置)](#daemon-configuration守护进程配置)
  - [镜像](#镜像)
    - [常用指令](#常用指令)
    - [构建镜像](#构建镜像)
    - [删除镜像](#删除镜像)
      - [删除两个 id 相同的镜像](#删除两个-id-相同的镜像)
    - [镜像导出与导入](#镜像导出与导入)
    - [将镜像跑为容器](#将镜像跑为容器)
    - [推送到 Habor](#推送到-habor)
    - [将镜像保存为 tar 文件](#将镜像保存为-tar-文件)
  - [容器](#容器)
    - [常用指令](#常用指令-1)
    - [从容器中复制文件到本地(docker cp)](#从容器中复制文件到本地docker-cp)
    - [将容器重新打包成镜像](#将容器重新打包成镜像)
  - [常见问题](#常见问题)
    - [ERROR: could not find an available, non-overlapping IPv4 address pool among the defaults to assign to the network](#error-could-not-find-an-available-non-overlapping-ipv4-address-pool-among-the-defaults-to-assign-to-the-network)
    - [unable to connect to deb.debian.org:http](#unable-to-connect-to-debdebianorghttp)
    - [There is no public key](#there-is-no-public-key)
    - [debconf: delaying package configuration, since apt-utils is not installed](#debconf-delaying-package-configuration-since-apt-utils-is-not-installed)
    - [安装插件失败 - failed to extract plugin \[/usr/share/elasticsearch/plugins/head.zip\]: ZipException\[zip file is empty\]](#安装插件失败---failed-to-extract-plugin-usrshareelasticsearchpluginsheadzip-zipexceptionzip-file-is-empty)
    - [colima](#colima)
      - [ERROR: failed to solve: rpc error: code = Unknown desc = write /xxx/xxx: no space left on device](#error-failed-to-solve-rpc-error-code--unknown-desc--write-xxxxxx-no-space-left-on-device)

---

## 安装

> [Get Docker | Docker Docs](https://docs.docker.com/get-started/get-docker/)

Windows 直接去 [Docker Desktop: The #1 Containerization Tool for Developers | Docker](https://www.docker.com/products/docker-desktop/) 下载 Docker Desktop 即可

Linux 可以参阅如下方案进行安装

---

:::tabs

@tab:active 通过官方脚本安装(推荐)

Linux 建议使用如下官方安装脚本来安装 docker:

```bash
# Install the latest version docker
curl -s https://get.docker.com/ | sh

# Run docker service
systemctl start docker
```

---

如果使用的是 kali 的话如此安装可能会报错:

![image-20241011140431470](http://cdn.ayusummer233.top/DailyNotes/202410111404586.png)

可能是 Docker 不专门对 Kali 提供相应的 Docker 版本

Kali Rolling 是基于 Debian 的 Testing 分支，而不是 Debian 的稳定版。Debian 的 Testing 分支是用于开发和测试即将发布为稳定版的新功能和软件包的地方。因此，虽然 Kali Rolling 会包含许多最新的软件包，但这些软件包可能还在测试中，可能不如 Debian 稳定版稳定。

一般可以认为 kali rolling 基于 Debian 的最新版本, 比如当前的 Debian12 bookworm

> [Index of linux/debian/dists/ (docker.com)](https://download.docker.com/linux/debian/dists/)
>
> ![image-20241011140543292](http://cdn.ayusummer233.top/DailyNotes/202410111441468.png)

那么需要对应修改一下脚本:

```bash
# 找个合适的路径执行如下命令先将官方安装脚本下载下来
curl -fsSL https://get.docker.com -o get-docker.sh
```

> - **`-f`**：表示 "fail silently"（静默失败）。如果发生 HTTP 请求错误（例如 404 错误），`curl` 将不会输出错误信息，而是直接返回一个非零状态码
> - **`-s`**：表示 "silent"（静默模式），使得 `curl` 不显示进度条或错误信息，提供一个干净的输
> - **`-S`**：与 `-s` 一起使用，表示在出现错误时显示错误信息。这样，如果请求失败，你将能够看到错误的原因。
> - **`-L`**：表示 "location"。当请求的 URL 被重定向时，`curl` 将自动跟随重定向。这样，可以确保最终获得目标文件，即使它的 URL 被更改

![image-20241011144243624](http://cdn.ayusummer233.top/DailyNotes/202410111442939.png)

在 `check_forked` 这行后面手动指定 `dist_version="bookworm"`

在执行修改后的脚本前先看看你的 `/etc/apt/sources.list.d/docker.list` 文件, 如果你上面执行官方脚本报错了, 那么它大概率是这样的:

![image-20241011144631751](http://cdn.ayusummer233.top/DailyNotes/202410111446991.png)

即使我们执行了修改后的脚本也不会发生变化, 因此我们可以直接把这个文件内容清空, 然后运行修改后的脚本

```bash
rm -rf /etc/apt/sources.list.d/docker.list
sh get-docker.sh
```

---


@tab macOS-Colima

> [Colima - 只需最少设置即可在 macOS（和 Linux）上运行容器 / colima Github Repo](https://github.com/abiosoft/colima)

mac 的硬件资源比较金贵，我刚好买的也是低配的 mac Mini，Docker Desktop 守护进程常驻后台对我来说开销过大了，所以需要一个轻量级的替代方案，[Colima](https://github.com/abiosoft/colima) 就是一个可行方案

---

**安装Colima**:

```bash
brew install colima
```

![image-20250519114222353](http://cdn.ayusummer233.top/DailyNotes/202505191142688.png)

查看当前 colima 版本：

```bash
colima version
```

![image-20250519140602696](http://cdn.ayusummer233.top/DailyNotes/202505191406840.png)

---

在外置固态上新建一个目录用于存放 colima 相关文件

![image-20250519165001827](http://cdn.ayusummer233.top/DailyNotes/202505191650977.png)

迁移配置到当前目录：

```bash
mv ~/.colima /Volumes/SummerDocs/AppContents/colima
```

![image-20250519165132562](http://cdn.ayusummer233.top/DailyNotes/202505191651681.png)

![image-20250519165140929](http://cdn.ayusummer233.top/DailyNotes/202505191651985.png)

创建软连接

```bash
ln -s /Volumes/SummerDocs/AppContents/colima/.colima ~/.colima
```

![image-20250519170240109](http://cdn.ayusummer233.top/DailyNotes/202505191702181.png)

![image-20250519170223801](http://cdn.ayusummer233.top/DailyNotes/202505191702898.png)

---

安装 docker CLI

```bash
brew install docker
# 检查版本
docker version
```

![image-20250519180156592](http://cdn.ayusummer233.top/DailyNotes/202505191801775.png)

----

我需要在外置硬盘上设置 colima，需要先设置全局 `COLIMA_HOME`, 由于我的默认 shell 都是 zsh ，所以在 `~/.zshrc` 中进行设置：

```bash
export COLIMA_HOME=/Volumes/SummerDocs/AppContents/colima/.colima
```

![image-20250520095818386](http://cdn.ayusummer233.top/DailyNotes/202505200958579.png)

这样每次打开 zsh 都会自动设置 colima home

---

在外置硬盘启动一个 colima 实例：

```bash
COLIMA_HOME=/Volumes/SummerDocs/AppContents/colima/.colima colima start ext --cpu 2 --memory 2 --disk 30
# 如果上一步设置了 colima home 这里前半段就可以省略了
colima start ext --cpu 2 --memory 2 --disk 30
```

- `ext` 实例名称(配置文件)
- `--cpu 2` 分配2个CPU
- `--memory 2` 分配2GB内存
- `--disk 30` 分配30GB磁盘空间

![image-20250519182731093](http://cdn.ayusummer233.top/DailyNotes/202505191827292.png)

> PS：上图里的路径是早先设置错的路径，后来迁移了，这里仅作为创建示意图效果参考
>
> `colima status` 在不带参数时默认查询名为 "default" 的实例状态, 由于系统中并没有 "default" 实例，所以返回 "colima is not running" 
>
> 即使系统中只有一个实例，Colima 也不会自动将其视为默认实例。除非明确使用 `colima use ext` 将其设置为活跃实例，否则不带参数的命令会继续尝试操作不存在的 "default" 实例。

![image-20250519182913777](http://cdn.ayusummer233.top/DailyNotes/202505191829894.png)

检查运行状态

```bash
colima status ext
```

![image-20250519194243229](http://cdn.ayusummer233.top/DailyNotes/202505191942336.png)

这里暂时只需要这一个实例，可以全局在 `~/.zshrc` 设置 colima profile：

```bash
alias colima='colima --profile ext'
```

![image-20250519200003487](http://cdn.ayusummer233.top/DailyNotes/202505192000645.png)

![image-20250519200134854](http://cdn.ayusummer233.top/DailyNotes/202505192001942.png)

---

`colima start` 后，可以在 macOS 上使用 `docker` 客户端，无需进行其他设置。

![image-20250519200904711](http://cdn.ayusummer233.top/DailyNotes/202505192009904.png)

---

如果后续有需要挂载卷的需求, 那么需要修改 `.colima/ext/colima.yaml` 添加

```yaml
mounts:
  - location: 外置磁盘目录
    writable: true
```

---

@tab Debian

> [在 Debian 上安装 Docker 引擎 | Docker 文档 --- Install Docker Engine on Debian | Docker Docs](https://docs.docker.com/engine/install/debian/#install-using-the-repository)
>
> [Index of linux/debian/dists/ (docker.com)](https://download.docker.com/linux/debian/dists/)

1. 设置 Docker 的 `apt` 存储库

   ```bash
   # Add Docker's official GPG key:
   sudo apt-get update
   sudo apt-get install ca-certificates curl
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
   sudo chmod a+r /etc/apt/keyrings/docker.asc
   
   # Add the repository to Apt sources:
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   sudo apt-get update
   ```

   > 如果用的是 kali 的话
   >
   > ![image-20240418141046018](http://cdn.ayusummer233.top/DailyNotes/image-20240418141046018.png)
   >
   > ![image-20240418141104580](http://cdn.ayusummer233.top/DailyNotes/image-20240418141104580.png)
   >
   > 需要把 kali-rolling 换成其他版本
   >
   > Kali Rolling 是基于 Debian 的 Testing 分支，而不是 Debian 的稳定版。Debian 的 Testing 分支是用于开发和测试即将发布为稳定版的新功能和软件包的地方。因此，虽然 Kali Rolling 会包含许多最新的软件包，但这些软件包可能还在测试中，可能不如 Debian 稳定版稳定。
   >
   > 一般可以认为 kali rolling 基于 Debian 的最新版本, 比如当前的  Debian12 bookworm
   >
   > ![image-20240418143331741](http://cdn.ayusummer233.top/DailyNotes/image-20240418143331741.png)
   >
   > > [Index of linux/debian/dists/ (docker.com)](https://download.docker.com/linux/debian/dists/)
   >
   > 可以手动改下文件
   >
   > ![image-20240418143351329](http://cdn.ayusummer233.top/DailyNotes/image-20240418143351329.png)

2. 安装 Docker packages

   ```bash
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

3. 通过运行 `hello-world` image 验证安装是否成功

   ```bash
   sudo docker run hello-world
   ```

   ![image-20240418143748673](http://cdn.ayusummer233.top/DailyNotes/image-20240418143748673.png)

   如图所示, 可以看到已经安装成功了

@tab wsl2

> [docker wsl2启动不了_win10利用WSL2安装docker的2种方式_weixin_39786155的博客-CSDN博客](https://blog.csdn.net/weixin_39786155/article/details/110363154)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo service docker start
```

> wsl2-kali 是不支持以此种方式安装的, 可以在 Windows 上装 Docker Desktop 并启用 WSL2 访问
>
> ![image-20221120235620604](http://cdn.ayusummer233.top/img/202211202356631.png)
>
> ![image-20221121000717073](http://cdn.ayusummer233.top/img/202211210007112.png)

---


@tab Ubuntu(Deprecated)

> [ubuntu安装docker详细步骤 - 腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1854430)
>
> [Docker 入门指南：如何在 Ubuntu 上安装和使用 Docker - 卡拉云 (kalacloud.com)](https://kalacloud.com/blog/how-to-install-and-use-docker-on-ubuntu/)
>
> ---

旧版安装指令:


```bash
# 更新现有的软件包列表
apt update
# 安装所需工具包
sudo apt install apt-transport-https ca-certificates curl gnupg-agent  software-properties-common
# 然后将官方 Docker 版本库的 GPG 密钥添加到系统中：
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
# 将 Docker 版本库添加到APT源：
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
# 用新添加的 Docker 软件包来进行升级更新。
sudo apt update
# 确保要从 Docker 版本库，而不是默认的 Ubuntu 版本库进行安装：
apt-cache policy docker-ce
# 安装 Docker ：
sudo apt install docker-ce
# 现在 Docker 已经安装完毕。我们启动守护程序。检查 Docker 是否正在运行：
sudo systemctl status docker
# 设置 docker 开机自动启动
sudo systemctl enable docker.service
```

@tab Debian(Deprecated)

> [在Kali Linux版本中安装Docker(Docker CE社区版) 和Docker Compose_Linux教程_云网牛站 (ywnz.com)](https://ywnz.com/linuxjc/6543.html)
>
> ---

```bash
# 更新现有的软件包列表
sudo apt update
# 安装所需工具包
sudo apt -y install curl gnupg2 apt-transport-https software-properties-common ca-certificates
# 导入用于签署Docker软件包的Docker GPG密钥：
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
# 添加包含Docker CE最新稳定版本的Docker存储库：
echo "deb [arch=amd64] https://download.docker.com/linux/debian buster stable" | sudo tee  /etc/apt/sources.list.d/docker.list
# 更新apt包索引
sudo apt update
# 在Kali Linux上安装Docker CE
sudo apt install docker-ce docker-ce-cli containerd.io
# 检查安装的Docker版本
docker version
```

---

:::

---

## 换源

### Docker-hub 换源

> [国内的 Docker Hub 镜像加速器，由国内教育机构与各大云服务商提供的镜像加速服务 | Dockerized 实践 https://github.com/y0ngb1n/dockerized](https://gist.github.com/y0ngb1n/7e8f16af3242c7815e7ca2f0833d3ea6)

打开 `/etc/docker/daemon.json` 并输入

```json
{
    "registry-mirrors": [
      "https://hub-mirror.c.163.com",
      "https://ustc-edu-cn.mirror.aliyuncs.com"
      ]
}

```

然后重启 docker

```bash
service docker restart
```

> PS: (编辑于2024.11.19) 公共镜像基本处于不可用的状态, 建议除了与服务器自己有专用镜像的情况外直接上代理
>
> > 云服务器自己的专用镜像也不一定全, 可能会出现 pull 一个镜像报错官方源超时的问题, 可能是云服务器镜像中没有这个 image 然后走官方源又超时
> >
> > 云服务器出现这种问题时可以考虑走 [SSH 远程端口转发](../../网络安全/内网渗透/代理转发/SSH隧道.md#远程端口转发应用场景-断网主机联网)把本地的代理给云服务器用

---

一些当前已知的云服务器专用镜像:

- 阿里云ECS

  > [阿里云-镜像工具-官方镜像加速](https://help.aliyun.com/zh/acr/user-guide/accelerate-the-pulls-of-docker-official-images)

  ```
  https://urnsehle.mirror.aliyuncs.com
  ```

---

## 代理

> [守护程序代理配置 |Docker 文档 --- Daemon proxy configuration | Docker Docs](https://docs.docker.com/engine/daemon/proxy/#httphttps-proxy)
>
> [国内的 Docker Hub 镜像加速器，由国内教育机构与各大云服务商提供的镜像加速服务 | Dockerized 实践 https://github.com/y0ngb1n/dockerized · GitHub](https://gist.github.com/y0ngb1n/7e8f16af3242c7815e7ca2f0833d3ea6)

有两种方案可以配置 Docker 代理

- 通过配置文件或 CLI 标志[配置守护程序](https://docs.docker.com/engine/daemon/proxy/#daemon-configuration)
- 在系统上设置[环境变量](https://docs.docker.com/engine/daemon/proxy/#environment-variables)

直接配置守护进程优先于环境变量

> 环境变量配置就是指在命令行中配置 http(s) 代理

---

### Daemon configuration(守护进程配置)

> [Daemon configuration 守护进程配置](https://docs.docker.com/engine/daemon/proxy/#daemon-configuration)

可以在 `daemon.json` 文件中为 `daemon` 配置代理, 或者为 `dockerd` 命令使用 `--http-proxy` 或 `--https-proxy` 标志的 CLI 标志

> 建议使用`/etc/docker/daemon.json` 进行配置

```json
{
  "proxies": {
    "http-proxy": "http://proxy.example.com:3128",
    "https-proxy": "https://proxy.example.com:3129",
    "no-proxy": "*.test.example.com,.example.org,127.0.0.0/8"
  }
}
```

> 配置备份:
>
> ```json
> {
>   "proxies": {
>     "http-proxy": "http://127.0.0.1:7890",
>     "https-proxy": "http://127.0.0.1:7890",
>     "no-proxy": "*.test.example.com,.example.org,127.0.0.0/8"
>   }
> }
> ```

更改配置文件后，重启守护进程，代理配置才能生效：

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

测试下速度:

```bash
docker rmi node:latest
time docker pull node:latest
```

> ![image-20241011150324983](http://cdn.ayusummer233.top/DailyNotes/202410111503086.png)

---

## 镜像

> [关于docker容器和镜像的区别 - jason.bai - 博客园 (cnblogs.com)](https://www.cnblogs.com/baizhanshi/p/9655102.html)

![image-20220923175753464](http://cdn.ayusummer233.top/img/202209231758602.png)


---

### 常用指令

- 拉取镜像

  ```bash
  # docker pull [镜像名]
  # vuldocker/lamp映像包括(php＋apache+MySQL) ，只需要下载dvwa源码即可
  docker pull vuldocker/lamp   
  ```

  > `docker pull` 下来的镜像默认存在 `/var/lib/docker/` 目录下
  >
  > ![image-20221109102750973](http://cdn.ayusummer233.top/img/202211091029761.png)
  >
  > ---

- 查看当前镜像列表

  ```bash
  docker images
  ```

- 修改镜像 Tag

  ```bash
  # docker tag [镜像ID] [镜像名称]:[tag版本信息]
  docker tag 8ef375298394 MySQL:v5.7
  
  # docker tag [原tag][新tag]
  docker tag MySQL:v5.7 http://100.1.1.111:8080/MySQL:v5.7
  ```

---

### 构建镜像

```bash
# 通过 dockerfile 构建镜像
docker build -t [镜像名称:标签] [dockerfile文件所在目录]
# 例如 docker build -t my_image:latest .
```

更好的方案是使用 `docker buildx` 来构建镜像, `docker buildx` 是 docker 较新版本中引入的增强构建命令，基于 BuildKit，是 Docker 提供的下一代构建引擎。

> [buildx Github Repo URL](https://github.com/docker/buildx)

相比于 `docker build` 构建 image, `docker buildx` 支持多平台构建, 以及更好的缓存机制

|          **功能**           |           docker build           |            docker buildx             |
| :-------------------------: | :------------------------------: | :----------------------------------: |
|  多平台构建（multi-arch）   |             ❌ 不支持             |                ✅ 支持                |
|     使用 BuildKit 引擎      | 可选（需设置 DOCKER_BUILDKIT=1） |               默认使用               |
|        并行构建阶段         |                ❌                 |         ✅ 支持并行多阶段构建         |
|      构建缓存导入/导出      |                ❌                 | ✅ （支持 --cache-from / --cache-to） |
|   镜像直接推送至 Registry   |       ❌ 需先 build 再 push       |         ✅ 可一并执行 --push          |
|   输出为本地文件夹或 tar    |                ❌                 |        ✅ 可通过 --output 实现        |
|    构建上下文来源多样化     |         ⛔（仅本地目录）          |    ✅ 支持本地、Git、HTTP 等上下文    |
| 构建前配置多个 builder 实例 |                ❌                 |  ✅ 支持（如 docker buildx create）   |

安装 Docker Buildx:

:::tabs

@tab:active macOS

```bash
# 创建插件目录（如果不存在）
mkdir -p ~/.docker/cli-plugins

# 下载 buildx 插件(看一下 https://github.com/docker/buildx/releases 有哪些版本)(对于 Apple Silicon Mac, 需要下载 drawin-arm64 版本, 对于 Intel Mac, 需要下载 darwin-amd64 版本)
curl -sSL https://github.com/docker/buildx/releases/download/v0.24.0/buildx-v0.24.0.darwin-arm64 -o ~/.docker/cli-plugins/docker-buildx

# 添加执行权限
chmod +x ~/.docker/cli-plugins/docker-buildx

# 验证安装是否成功
docker buildx version
```

![image-20250613095814809](http://cdn.ayusummer233.top/DailyNotes/202506130958041.png)

如果是 colima + docker-cli 的模式的话使用 docker buildx 还有如下问题需要解决:

![image-20250613101434017](http://cdn.ayusummer233.top/DailyNotes/202506131014152.png)

从输出可以看到：

1. 当前已经有两个 buildx 构建器：
   - `colima-ext`
   - `default*` (当前活动构建器)
2. 但两者都使用的是 `docker` 驱动，而不是 `docker-container` 驱动
3. 错误信息明确指出：**多平台构建不支持 docker 驱动程序**

这种情况在 Colima 环境中很常见，因为它默认配置了 `docker` 驱动的构建器，但没有为多平台构建配置正确的驱动程序。

- `docker` 驱动：直接使用本地 Docker 守护进程，不支持多平台构建
- `docker-container` 驱动：在容器内运行 BuildKit，支持跨架构编译

要解决这个问题需要创建一个使用 `docker-container` 驱动的构建器：

```bash
# 创建新的构建器
docker buildx create --name multiplatform-builder --driver docker-container --use

# 检查新构建器状态
docker buildx inspect --bootstrap

# 现在可以进行多平台构建
docker buildx build --platform linux/amd64,linux/arm64 -t my_image:latest --push .
```

> 对于推送目标为 HTTP 协议而非 HTTPS 协议的情况时可以通过创建带有配置文件的构建器来解决
>
> ![image-20250613104224174](http://cdn.ayusummer233.top/DailyNotes/202506131042322.png)
>
> ```bash
> # 1. 创建buildkit配置文件
> cat > ~/.docker/buildkitd.toml << EOF
> [registry."[ip]:5000"]
>   http = true
>   insecure = true
> EOF
> 
> # 2. 删除现有构建器
> docker buildx rm multiplatform-builder
> 
> # 3. 创建带配置的新构建器
> docker buildx create --name multiplatform-builder \
>   --driver docker-container \
>   --config ~/.docker/buildkitd.toml \
>   --use
> 
> # 4. 初始化构建器
> docker buildx inspect --bootstrap
> ```
>
> ---
>
> 或者使用临时解决的方案:
>
> ```bash
> # 直接指定 HTTP 协议
> docker buildx build --platform linux/amd64,linux/arm64 \
>   -t http://[ip]:5000/library/my_image:version \
>   --push .
> ```
>
> ```bash
> # 为新容器设置运行时选项
> docker buildx build --platform linux/amd64,linux/arm64 \
>   --allow-insecure-entitlement security.insecure \
>   -t [ip]:5000/library/my_image:version \
>   --push .
> ```

执行上述命令会有如下影响:

1. **新建构建器实例**

   - 创建名为 `multiplatform-builder` 的新构建器
   - 这个构建器会作为一个容器运行在系统中, 占用少量系统资源（CPU、内存）

   ![image-20250613102450992](http://cdn.ayusummer233.top/DailyNotes/202506131024113.png)

2. **更改默认构建器**

   - `--use` 参数会将新构建器设置为默认构建器
   - 后续的 `docker buildx build` 命令默认会使用这个构建器
   - 可以通过 `docker buildx ls` 看到 `multiplatform-builder` 旁边有 `*` 标记

3. **启动 BuildKit 容器**

   - `docker-container` 驱动会启动一个专用的 BuildKit 容器
   - 这个容器在构建过程中会一直运行

![image-20250613102414313](http://cdn.ayusummer233.top/DailyNotes/202506131024434.png)

:::

---

使用 buildx 构建多平台 image:

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t [镜像名称:标签] --push [dockerfile所在目录]
# 例如: 
## docker buildx build --platform linux/amd64,linux/arm64 -t my_image:latest --push .
```
- `--platform` 指定要构建的目标平台
  - `linux/amd64` 表示构建适用于 AMD64 架构的镜像
  - `linux/arm64` 表示构建适用于 ARM64 架构的镜像
  
  一般情况下这两个平台已经能覆盖大部分常见的 CPU 架构了, 当然遇到特殊需求时也可以根据需要添加其他平台

- `-t` 指定镜像名称和标签
- `--push` 表示构建完成后将镜像推送到 Docker Registry（如 Docker Hub 或私有仓库）
- `[dockerfile所在目录]` 指定 Dockerfile 文件所在的目录

> 注意: `docker buildx` 构建的镜像会被推送到 Docker Registry, 如果不想推送可以使用 `--load` 选项将镜像加载到本地 Docker 中, 这样就可以在本地的 image 列表中看到构建的镜像了

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t [镜像名称:标签] --load [dockerfile所在目录]
# 例如:
docker buildx build --platform linux/amd64,linux/arm64 -t my_image:latest --load .
```

除了加载到本地 Docker 中外, 还可以将构建的镜像保存为 tar 文件:

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t [镜像名称:标签] --output type=tar,dest=[保存路径] [dockerfile所在目录]
# 例如:
docker buildx build --platform linux/amd64,linux/arm64 -t my_image:latest --output type=tar,dest=my_image.tar .
```

---

### 删除镜像

```bash
# 根据 镜像名称 来删除镜像
docker rmi centos 
# 根据 镜像:标签名称 来删除镜像
docker rmi centos:v2
# 根据 镜像ID 来删除镜像，
docker rmi 7e6257c9f8d8 
```

#### 删除两个 id 相同的镜像

> [Docker - 两个id相同的镜像怎么删除_Joker_Wangx的博客-CSDN博客_docker 镜像重复](https://blog.csdn.net/wx940627/article/details/106821002)

通过 `docker rmi [镜像:tag]` 来删除对应标签的镜像, 实际上


---

### 镜像导出与导入

> [docker容器导出，并将导出镜像在另外一台设备上运行起来_hx_long的博客-CSDN博客_docker 容器导出](https://blog.csdn.net/hx_long/article/details/122705151)

---

### 将镜像跑为容器

> [Docker run 命令 | 菜鸟教程 (runoob.com)](https://www.runoob.com/docker/docker-run-command.html)
>
> ---

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

- `-a stdin`: 指定标准输入输出内容类型，可选 STDIN/STDOUT/STDERR 三项；
- `-d`: 后台运行容器，并返回容器ID；
- `-i`: 以交互模式运行容器，通常与 -t 同时使用；
- `-P`: 随机端口映射，容器内部端口**随机**映射到主机的端口
- `-p`: 指定端口映射，格式为：**主机(宿主)端口:容器端口**
- `-t`: 为容器重新分配一个伪输入终端，通常与 -i 同时使用；
- `--name="nginx-lb"`: 为容器指定一个名称；
- `--dns 8.8.8.8`: 指定容器使用的DNS服务器，默认和宿主一致；
- `--dns-search example.com`: 指定容器DNS搜索域名，默认和宿主一致；
- `-h "mars"`: 指定容器的hostname；
- `-e username="ritchie"`: 设置环境变量；
- `--env-file=[]`: 从指定文件读入环境变量；
- `--cpuset="0-2" or --cpuset="0,1,2"`: 绑定容器到指定CPU运行；
- `-m`: 设置容器使用内存最大值；
- `--net="bridge"`: 指定容器的网络连接类型，支持 bridge/host/none/container: 四种类型；
- `--link=[]`: 添加链接到另一个容器；
- `--expose=[]`: 开放一个端口或一组端口；
- `--volume , -v`: 绑定一个卷
- `--restart=always`: 容器设置自动启动

  - `no`: 不自动重启容器. (默认value)
  - `on-failure`: 容器发生 error 
  - 而退出(容器退出状态不为0)重启容器
  - `unless-stopped`: 在容器已经 stop 掉或 `Docker stoped/restarted` 的时候才重启容器
  - `always`: 在容器已经 stop 掉或 `Docker stoped/restarted` 的时候才重启容器

  如果创建时未指定 `--restart=always` ,可通过update 命令

  ```
  docker update --restart=always [container-id]
  ```

---


```
docker run -it -d --name dvwa -p 8008:80 vuldocker/lamp
```

> 设置名字为dvwa，映射端口为8008 
>
> -i: 交互式操作。
>
> -t: 终端(一般与i一起) 
>
>  -d：后台运行。

从图中可以看到在执行

```
docker run -it -d --name dvwa -p 8008:80 vuldocker/lamp
```

指令时出现了问题，说已经有container使用了dvwa这个名字( `The container name "/dvwa" is already in use by container "6e3fc590b41c9c6cf6c0d81de14730c127240edecb6a2a5e3debf1565eb3fe6b"`) ，但是从图中也可以看到docker ps指令执行后没有正在运行的container,可以执行

---

### 推送到 Habor

**因为是在只有http  sql apach服务的镜像上跑的容器，在容器里配置了dvwa(并没有改变镜像) **

**此时将原来的镜像推送还是只有http  sql apach服务的镜像，没有自己在容器里的所有配置  需要将容器保存为镜像再去推送才行**

在本地docker客户端--靶机进行如下配置：

```bash
touch /etc/docker/daemon.json
vim /etc/docker/daemon.json
```

文件中如下配置

```properties
{
	"insecure-registries": ["habor-hostip:端口"]
}
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
# 登录 Habor (登录成功会提示 Login Succeeded)
docker login [HaborHostip:端口]
# 将本地的image新建1个新的tag
docker tag SOURCE_IMAGE[:TAG] [HaborHostip]:[端口]/[目标路径][:TAG]
# 推送镜像
docker push [HaborHostip]:[端口]/[目标路径][:TAG]
```

后续可以通过 `docker pull` 命令拉取镜像

```bash
docker pull [HaborHostip]:[端口]/[目标路径][:TAG]
```

---

### 将镜像保存为 tar 文件

```bash
# 将镜像保存为 tar 文件
docker save -o <文件名>.tar <镜像名称:标签>
## 例如:
docker save -o my_image.tar my_image:latest
## .tar 是打包格式，不做任何压缩，可以压缩一层缩小包体
docker save <镜像名称:标签> | gzip > xxx.tar.gz
### -si 从标准输入读取数据
docker save <镜像名称:标签> | 7z a -si xxx.tar.7z
```

![592de30eee153e34c0dab2caa0411766](http://cdn.ayusummer233.top/DailyNotes/202412161954167.png)

```bash
# 加载 tar 镜像:
docker load -i [tar路径]
## 例如:
docker load -i my_image.tar
## 加载 gzip 镜像
docker load -i xxx.tar.gz
### 加载 7z 镜像(-so 将 .7z 解压后的内容直接输出到标准输出)
7z x xxx.tar.7z -so | docker load
```

![image-20241216202218520](http://cdn.ayusummer233.top/DailyNotes/202412162022592.png)


---


## 容器

> [容器Docker进入的四种方法 - 指尖上的代码go - 博客园 (cnblogs.com)](https://www.cnblogs.com/cqqfboy/p/15209635.html)

---

### 常用指令

[将镜像跑为容器](#将镜像跑为容器)

```bash
# 进入容器(使用 bash 或者 sh 均可)
docker container exec -it [容器id] /bin/bash
docker container exec -it [容器id] /bin/sh

# 强制删除容器 docker rm -f [容器 id]
# 删除所有容器
docker rm -f $(docker ps -a -q)   

# 显示当前正在运行的容器
docker ps  

# 查看容器日志
docker logs [容器ID]
```


---

### 从容器中复制文件到本地(docker cp)

例：从容器中复制一个`test.db`文件到本地`data`目录。

```python
# 假设存在一个镜像名为 kitty，标签为0.1，创建一个名为 koko的容器

# 1. create a container first
docker run -itd --name koko kitty:0.1 /bin/bash
# 2. copy test.db from koko tmp directory to local data directory.
docker cp koko:/tmp/test.db ./data/test.db
# 3. rm container koko
docker rm -f koko
```

------

`docker cp`也可以从本地copy文件到容器中：

```python
# 以上面的代码为例，把容器路径和本地路径颠倒即可.
docker cp ./data/test.db koko:/tmp/test.db
```

在docker中，LAMP是指Linux(操作系统) 、Apache HTTP服务器、MySQL(MariaDB等数据库软件) 和PHP(Perl或Python) 的组合方案，一般用来建立Web服务器环境。

> [docker中的lamp是什么-Docker-PHP中文网](https://www.php.cn/docker/488591.html)

---

### 将容器重新打包成镜像

> [Docker 使用-将容器打成镜像_谈谈1974的博客-CSDN博客_容器打包成镜像](https://blog.csdn.net/weixin_45505313/article/details/125020076)
>
> ---

在使用 `docker-compose build` 命令时, 在有些镜像 build 完启动后发现其环境是并不完整的, 缺少了一些东西

> 比如在复现 CVE-2015-3337 时需要安装一个 `elasticsearch-head` 的插件, 发现用 vulhub 仓库里的 dockerfile
>
> `docker-compose build` 构建进行时插件实际上并没有安装成功,  但是镜像成功 build 了

进入启动的容器进行排错, 最终修复了问题后可以将目前用拥有完整环境的容器重新打包成镜像

Docker 提供了 `commit` 命令支持将容器重新打成镜像文件，其命令格式如下所示

```bash
 docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
```

| Option |              功能              |
| :----: | :----------------------------: |
|   -a   |         指定新镜像作者         |
|   -c   | 使用 Dockerfile 指令来创建镜像 |
|   -m   |     提交生成镜像的说明信息     |
|   -p   |    在 commit 时，将容器暂停    |

可以先查看下当前运行容器的 id

```bash
docker ps -a | grep [容器相关标识, 比如 cve-2015-3337 之类]
```

```bash
# 添加描述信息并将容器打包成新的镜像(给个新tag)
docker commit -m "add elasticsearch-head" 10f2daf4ead5 cve-2015-3337_es:v0
```

---

## 常见问题

### ERROR: could not find an available, non-overlapping IPv4 address pool among the defaults to assign to the network

> [[openvpn\] ERROR: could not find an available, non-overlapping IPv4 address pool among the defaults to assign to the network · Issue #418 · docker/for-linux (github.com)](https://github.com/docker/for-linux/issues/418)

```bash
docker network prune
```

---

### unable to connect to deb.debian.org:http

![image-20220919202703896](http://cdn.ayusummer233.top/img/202209192027036.png)

>  [Docker failed to fetch http://deb.debian.org/debian/dists/jessie/InRelease - Stack Overflow](https://stackoverflow.com/questions/44080220/docker-failed-to-fetch-http-deb-debian-org-debian-dists-jessie-inrelease)

![image-20220919202953164](http://cdn.ayusummer233.top/img/202209192029288.png)

![image-20220919203028392](http://cdn.ayusummer233.top/img/202209192030522.png)

---

### There is no public key

> [使用apt-get时出现 “no public key available” 的解决方法-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/533899)

```BASH
sudo apt-key adv --recv-keys --keyserver keyserver.ubuntu.com [报错缺失的public key]
```

---

### debconf: delaying package configuration, since apt-utils is not installed

> [[16.04\] debconf: delaying package configuration, since apt-utils is not installed · Issue #319 · phusion/baseimage-docker (github.com)](https://github.com/phusion/baseimage-docker/issues/319)

```BASH
apt-get update && apt-get install -y --no-install-recommends apt-utils
```

---

### 安装插件失败 - failed to extract plugin [/usr/share/elasticsearch/plugins/head.zip]: ZipException[zip file is empty]

在使用 `docker-compose build` 时发现有些时候虽然 build 成功了但是实际上环境是不完整的, 比如在复现 `CVE-2015-3337` 时需要安装一个插件

发现 vulhub 该 cve 目录下 `docker-compose build`  拉取了一个空的插件安装包并且解压==失败了==, 但是却成功 `build` 了

![image-20221208103255765](http://cdn.ayusummer233.top/DailyNotes/202212081036240.png)

观察上图中的输出信息可以看到在安装插件时向 ` http://download.elasticsearch.org/mobz/elasticsearch-head/elasticsearch-head-1.x.zip.` 请求了 zip 资源, 尝试在本地电脑上访问此链接发现下载不下来, 那么可以假定是指向链接出了问题, 那么现在就需要找到一个可用的插件安装链接

在使用 `docker-compose up -d` 后进入该容器然后尝试为拉取插件配置一个不可用的代理

```bash
plugin -DproxyHost=192.168.1.33 -DproxyPort=7890 --install mobz/elasticsearch-head/1.x
```

此时会尝试从各个可能的地址拉取插件

![image-20221208104125668](http://cdn.ayusummer233.top/DailyNotes/202212081041520.png)

在本地机器上尝试这些链接, 最终找到可用链接 `https://codeload.github.com/mobz/elasticsearch-head/zip/refs/heads/1.x`

于是可以使用该链接安装插件

```bash
bin/plugin --install mobz/elasticsearch-head/1.x -u https://codeload.github.com/mobz/elasticsearch-head/zip/refs/heads/1.x
```

![image-20221208095040475](http://cdn.ayusummer233.top/DailyNotes/202212081038831.png)

验证插件是否安装成功:

![image-20221208104020031](http://cdn.ayusummer233.top/DailyNotes/202212081046976.png)

可以看到已经成功安装上了

然后 [将容器重新打包成镜像](#将容器重新打包成镜像) 以便后续使用

---

### colima

#### ERROR: failed to solve: rpc error: code = Unknown desc = write /xxx/xxx: no space left on device

这个错误是因为 Colima 虚拟机内部的磁盘空间已经耗尽，而非物理磁盘空间不足。

Colima 创建的虚拟机默认只分配了有限的磁盘空间

---

- 问题原因
  - **Colima 虚拟机空间限制**：Colima 为 Docker 创建了一个独立的虚拟机，该虚拟机有自己的磁盘空间上限
  - **Docker 镜像和缓存积累**：构建过程中产生的临时文件、缓存层和未完全清理的镜像占用了空间
  - **特别是 buildx 使用的构建缓存**：多平台构建会占用更多空间

---

**解决方案**:

检查 Colima 状态和磁盘使用情况:

```bash
colima status
colima ssh
df -h  # 在 Colima VM 内查看磁盘使用情况
```

![image-20250814152739535](http://cdn.ayusummer233.top/DailyNotes/202508141527840.png)

---

清理 Docker 资源:

```bash
# 清理未使用的 Docker 资源
docker system prune -a --volumes

# 查看 Docker 磁盘使用情况
docker system df
```

![image-20250814152950569](http://cdn.ayusummer233.top/DailyNotes/202508141529768.png)

---

![image-20250814153353517](http://cdn.ayusummer233.top/DailyNotes/202508141533674.png)

---

一般来说到这里就可以解决问题了

 如果想给 Colima 扩容的话可以如此操作:

```bash
# 停止 Colima
colima stop

# 使用更大的磁盘空间重新启动
colima start --disk 100 --memory 8
```

---











