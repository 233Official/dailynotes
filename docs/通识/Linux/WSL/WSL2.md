# WSL2

- [WSL2](#wsl2)
  - [安装](#安装)
  - [卸载](#卸载)
  - [VSCode-ssh-remote](#vscode-ssh-remote)
  - [端口映射](#端口映射)
  - [WSL2 DNS 服务异常](#wsl2-dns-服务异常)
  - [报错收集](#报错收集)
    - [ssh 拒绝](#ssh-拒绝)
    - [ping 的通 ip , ping 不通域名](#ping-的通-ip--ping-不通域名)

---

## 安装

> [安装 WSL | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/install)
>
> [旧版 WSL 的手动安装步骤 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual#step-3---enable-virtual-machine-feature)
>
> [win10 WSL2 问题解决 WslRegisterDistribution failed with error: 0x800701bc_first_Dance 的博客-CSDN 博客](https://blog.csdn.net/qq_18625805/article/details/109732122)
>
> ---

安装 WSL 2 之前，必须启用“虚拟机平台”可选功能。 计算机需要[虚拟化功能](https://learn.microsoft.com/zh-cn/windows/wsl/troubleshooting#error-0x80370102-the-virtual-machine-could-not-be-started-because-a-required-feature-is-not-installed)才能使用此功能。

以管理员身份打开 PowerShell 并运行：

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

**重新启动**计算机，以完成 WSL 安装并更新到 WSL 2。

---

下载 Linux 内核更新包并安装

- [适用于 x64 计算机的 WSL2 Linux 内核更新包](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

  > 如果使用的是 ARM64 计算机，请下载 [ARM64 包](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_arm64.msi)。 如果不确定自己计算机的类型，请打开命令提示符或 PowerShell，并输入：`systeminfo | find "System Type"`。 **Caveat：** 在非英文版 Windows 上，你可能必须修改搜索文本，对“System Type”字符串进行翻译。 你可能还需要对引号进行转义来用于 find 命令。 例如，在德语版中使用 `systeminfo | find '"Systemtyp"'`。

---

`Windows+X` 选择以管理员模式打开 Powershell, 执行如下命令安装 wsl2

```powershell
# 该命令默认安装 wsl2
wsl --install
```

![image-20221120231039275](http://cdn.ayusummer233.top/img/202211202310305.png)

```powershell
wsl --install -d kali-linux
```

按照提示新建账户密码即可

---

## 卸载

> [WSL 发行版卸载 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/487091950)
>
> ---

```powershell
wslconfig /u kali-linux
```

---

## VSCode-ssh-remote

使用 SSH-remote 插件连上 WSL 后如果不是以 root 用户登入的话,会在一些系统目录(如 `/etc`, `/dev`, `/root` 等)被限制编辑与增删, 不过在用户目录(如 `/ubuntu`, `/mnt`)的权限是足够的

如果想要登入后可以编辑系统目录文件的话就要使用 `root` 用户登录, 但是 remote-ssh 虽然对于 `SSH Targets` 有配置文件可以编辑登入用户, 但是没有关于 `WSL Targets` 的配置, 那么这就需要在更高的层级编辑默认以 `root` 身份登入 `WSL`

> [Change vscode user in remote-WSL · Issue #3631 · microsoft/vscode-remote-release (github.com)](https://github.com/microsoft/vscode-remote-release/issues/3631)
>
> [Manage Linux Distributions - Change the default user for a distribution | Microsoft Docs](https://docs.microsoft.com/en-us/windows/wsl/wsl-config#change-the-default-user-for-a-distribution)
>
> [Ubuntu : 无法将“Ubuntu”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径 正确，然后再试一次。 - z_zhiro - 博客园 (cnblogs.com)](https://www.cnblogs.com/Hiro666/p/14119763.html)

- 首先查看下当前出问题的 `WSL Distribution` 版本  
  `win+x` 打开 `Windows Terminal`, 输入如下命令查看所有的 `WSL Distribution`:

  ```shell
  wsl --list --all
  ```

  ![image-20210921163044694](http://cdn.ayusummer233.top/img/202109211630793.png)

  其实在 `Remote-ssh - WSL Targets` 目录下就可以看到当前的 `WSL Distribution`

  ![image-20210921163322476](http://cdn.ayusummer233.top/img/202109211633562.png)

- 确认当前的 `WSL Distribution` 后在 `Windows Terminal` 中输入

  ```shell
  <DistributionName> config --default-user <Username>
  ```

  就可以将 `WSL Distribution` 为 `DistributionName` 的 `WSL` 的默认登录用户切换为 `Username`, 如:

  ![image-20210921163536793](http://cdn.ayusummer233.top/img/202109211635853.png)

  > 需要注意的是, 虽然看到的 `Distribution` 为 `Ubuntu-20.04`, 但是输入命令时要写成 `ubuntu2004`
  >
  > 相应的看到的是 `kali-linux`, 但是输入命令时要用 `kali`

- 再打开相应 `WSL` 时就可以看到用户已经切换到相应设置的用户了

  ![image-20210921163927558](http://cdn.ayusummer233.top/img/202109211639773.png)

  再用 VSCode-SSH-remote 连接 WSL 时可以看到登入用户已经切换成刚才配置的用户了, 当切换的是 root 用户时, 此时就可以使用 VSCode 新建及编辑系统目录下的文件了

  ![image-20210921164444924](http://cdn.ayusummer233.top/img/202109211644088.png)

  ***

## 端口映射

正常情况下直接从本机 telnet wsl2 的端口是不通的, 需要映射 wsl2 端口到本机

> [wsl2 设置端口映射\_压码路的博客-CSDN 博客\_wsl 端口映射](https://blog.csdn.net/keyiis_sh/article/details/113819244)

```powershell
# 获取 wsl ip 地址
wsl -- ifconfig eth0
```

> ![image-20220806160015420](http://cdn.ayusummer233.top/img/202208061600558.png)

```powershell
# 随便看看本机端口有没有占用(比如9225)
netstat -aon | findstr "9225"
```

> ![image-20220806160222828](http://cdn.ayusummer233.top/img/202208061602939.png)

```powershell
# 将ip地址的对应的端口映射到宿主win10对应的端口
# 需要管理员权限
# netsh interface portproxy add v4tov4 listenport=[win10端口] listenaddress=0.0.0.0 connectport=[虚拟机的端口] connectaddress=[虚拟机的ip]
netsh interface portproxy add v4tov4 listenport=9225 listenaddress=0.0.0.0 connectport=69 connectaddress=172.29.61.202
```

> ![image-20220806160340771](http://cdn.ayusummer233.top/img/202208061603880.png)

```powershell
# 检测是否设置成功
netsh interface portproxy show all
```

> ![image-20220806160442677](http://cdn.ayusummer233.top/img/202208061604773.png)
>
> ```powershell
> # 删除端口转发
> netsh interface portproxy delete v4tov4 listenport=9225 listenaddress=0.0.0.0
> ```

---

## WSL2 DNS 服务异常

无法正确解析域名, 直接 ping ip 可以 ping 通, 排查了一圈发现主网也 ping 不通

> 解决方案: [WSL 2 自定义安装目录和网络配置\_daihaoxin 的专栏-CSDN 博客\_wsl2 目录](https://blog.csdn.net/daihaoxin/article/details/115978662)

![20211218213224](http://cdn.ayusummer233.top/img/20211218213224.png)

- 网络: 172.22.0.0, 20 位掩码

配置主网防火墙入站规则

- 规则类型: 自定义
- 程序: 所有程序
- 协议和端口: 默认值不做改动
- 作用域: 此规则适用于哪些本地 IP 地址?: 下列 IP 地址 -> 添加 -> 此 ip 地址或子网: `172.22.0.0/20`
- 操作: 允许连接
- 配置文件: 全选
- 名称自定义

然后在 WSL2 里重新 ping 主网又能 ping 通了, DNS 也正常了, 可以 ping 同其他域名了

> 缺点在于计算机重启后 WSL2 主网地址可能会变(  
> 需要再配下防火墙  
> 挺秃然的, 没有完全搞清楚原理, 无法一劳永逸地解决这个问题

---

## 报错收集

> [WSL2 踩坑分享 – xiabee](https://xiabee.cn/coding/wsl2/)
>
> [WSL2 网络异常排查 [ping 不通、网络地址异常、缺少默认路由、被宿主机防火墙拦截\] - 简书 (jianshu.com)](https://www.jianshu.com/p/ba2cf239ebe0)

---

### ssh 拒绝

`ssh: connect to host localhost port 22: Connection refused`

> [wsl 的 ssh server 无法启动 (ssh localhost 时报错 ssh: connect to host localhost port 22: Connection refused) \_hxc2101 的博客-CSDN 博客](https://blog.csdn.net/hxc2101/article/details/113617870)

打开 `/etc/ssh/sshd_config` 将监听地址 localhost 取消注释:

![image-20211026214222894](http://cdn.ayusummer233.top/img/202110262142078.png)

然后重启 `ssh 服务`

```shell
service ssh restart
```

**mark 下这句 ssh 服务重启指令**, ssh localhost 能够正常运行后如果 WSL2 关闭重启了再 `ssh localhost` 可能还会 `Connection refused`, 这时只要再 `service ssh restart` 然后 `ssh localhost` 就可以了

![image-20211026214857109](http://cdn.ayusummer233.top/img/202110262148965.png)

---

### ping 的通 ip , ping 不通域名

dns 解析错误

修改 `/etc/resolv.conf` 文件

```conf
nameserver 8.8.8.8
```

---
