# CentOS

## 配置阿里镜像源

由于 CentOS 7 已经在 2024 年 6 月 30 日彻底结束了生命周期（EOL）。官方的 `mirrorlist.centos.org` 服务器已经被关停或移除，默认的 Yum 源已经变成了一堆“死链接”。

![image-20260313132756032](http://cdn.ayusummer233.top/DailyNotes/202603131328896.png)

要继续用 yum 的话得把失效的官方源替换为国内的阿里云镜像源

```bash
# 下载阿里云基础源：
curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo

# 清理旧缓存并生成新缓存：
yum clean all
yum makecache
```

![image-20260313132923355](http://cdn.ayusummer233.top/DailyNotes/202603131329631.png)

这两步做完之后，Yum 就可以正常工作了。

> 上图中间那一大串刺眼的 `FAILED` 和 `Connection timed out` 红字报错不是严重问题
>
> 这是因为用 `curl` 下载的那个阿里云 `Centos-7.repo` 配置文件里，其实为每一个软件库都配置了两个地址：
>
> - **公网地址**（`mirrors.aliyun.com`）：给所有人用的。
> - **内网地址**（`mirrors.aliyuncs.com` 或 `cloud.aliyuncs.com`）：专门给阿里云自家的 ECS 云服务器走内网专线用的。
>
> 如果虚拟机不是阿里云的云服务器，自然无法访问这些内网地址。Yum 在尝试连接这些内网地址时卡住了，傻等了 30 秒超时（30000 milliseconds）后，才自动切换到公网地址，并最终成功下载了元数据。
>
> ---
>
> 虽然现在 Yum 能用，但如果不处理，以后每次执行 `yum install` 都会被这些内网地址卡上几十秒。
>
> 可以用 `sed` 命令一键把配置文件里所有阿里云的内网地址全部删掉，只保留公网地址：
>
> ```bash
> sed -i -e '/mirrors.cloud.aliyuncs.com/d' -e '/mirrors.aliyuncs.com/d' /etc/yum.repos.d/CentOS-Base.repo
> ```

`EPEL(Extra Packages for Enterprise Linu)` **源** 是一个非常常见、基本必装的额外软件仓库。它由 **Fedora Project** 维护，为 **Enterprise Linux（企业级 Linux）** 系列系统提供额外软件包，包括：

- **CentOS**
- **Red Hat Enterprise Linux**（RHEL）
- **Rocky Linux**
- **AlmaLinux**

CentOS 默认仓库的软件 **比较少**，很多常用工具都没有，比如：

- htop
- neofetch
- ansible（旧版系统）
- jq
- fail2ban
- nginx（更高版本）

**EPEL 就是用来补足这些缺失的软件的。**

---

接下俩把 EPEL 源也直接换成阿里云的镜像：

```bash
curl -o /etc/yum.repos.d/epel.repo https://mirrors.aliyun.com/repo/epel-7.repo
```

刷新下缓存：

```bash
yum clean all
yum makecache
```

![image-20260313133752593](http://cdn.ayusummer233.top/DailyNotes/202603131337877.png)

---

接下来可以尝试安装个 Nginx 试试

我们可以先看看 Yum 源里到底以什么格式记录着这个版本。运行以下命令列出所有可用的 Nginx 版本：

```bash
yum --showduplicates list nginx
```

![image-20260313134358198](http://cdn.ayusummer233.top/DailyNotes/202603131343453.png)

这里面的 `1:1.20.1-10.el7` 就是我们需要的精准版本后缀（其中 `1.20.1` 是主版本，`-10.el7` 是针对 CentOS 7 的打包修订号）。

拿到具体的版本号后就可以通过在软件名后加连字符 `-` 来指定安装了。可以只精确到主版本，也可以精确到完整的修订号：

```bash
yum install nginx-1.20.1 -y
yum install nginx-1.20.1-10.el7 -y
```

![image-20260313134548574](http://cdn.ayusummer233.top/DailyNotes/202603131345670.png)

![image-20260313134631277](http://cdn.ayusummer233.top/DailyNotes/202603131346895.png)

---
