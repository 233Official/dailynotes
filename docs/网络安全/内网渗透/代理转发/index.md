---
date: 2023-03-04
---

# 代理转发

> [内网渗透之代理转发 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/web/256415.html)
>
> [HackNotes/Proxy代理/Proxy代理.md at main · Stick-of-WuKong/HackNotes · GitHub](https://github.com/Stick-of-WuKong/HackNotes/blob/main/Proxy代理/Proxy代理.md)

当拿到一个主机的权限之后可以通过该主机向内网进行渗透, 不过由于该主机上不一定有渗透需要的工具以及若是直接远程连接到主机的话会留下明显的痕迹, 因此通过本地操作然后内网转发流量是比较稳妥的做法

---

- [代理转发](#代理转发)
  - [正向代理与反向代理](#正向代理与反向代理)
    - [正向代理(Forward Proxy)](#正向代理forward-proxy)
    - [反向代理(Reverse Proxy)](#反向代理reverse-proxy)
  - [代理协议](#代理协议)
    - [Socks 协议](#socks-协议)
  - [端口转发](#端口转发)
    - [使用 netsh 设置端口转发](#使用-netsh-设置端口转发)
    - [Linux-iptables设置端口转发](#linux-iptables设置端口转发)
    - [SSH隧道(端口转发)](#ssh隧道端口转发)
  - [代理服务器](#代理服务器)
    - [Clash](#clash)
    - [squid](#squid)
      - [安装](#安装)
      - [配置](#配置)
    - [使用 SSH 创建动态端口转发作 socks 代理服务器](#使用-ssh-创建动态端口转发作-socks-代理服务器)
        - [BurpSuit 挂内网主机的 socks 代理拦截本地 http 流量访问内网其他的服务](#burpsuit-挂内网主机的-socks-代理拦截本地-http-流量访问内网其他的服务)
    - [snail007/goproxy](#snail007goproxy)
  - [代理客户端](#代理客户端)
    - [命令行设置HTTP代理](#命令行设置http代理)
    - [Proxychains](#proxychains)
      - [安装](#安装-1)
      - [使用](#使用)
    - [TODOLIST](#todolist)

---

## 正向代理与反向代理

- 正向代理中，Proxy和Client同属一个区域，对Server是透明的； 
- 反向代理中，Proxy和Server同属一个区域，对Client透明。

正向代理与反相代理都是用于代替收发请求与响应, 从拓扑上来看大致如下:

```mermaid
flowchart TB
  subgraph 正向代理
    subgraph LAN0
    c00[Client] --> p0[Proxy] 
    c01[Client] --> p0
    c02[Client] --> p0
    end
    p0 --> s0[Server]
  end
  subgraph 反向代理
    subgraph LAN1
    p1[Proxy] --> s10[Server]
    p1 --> s11[Server]
    p1 --> s12[Server]
    end
    c10[Client] --> p1
    c11[Client] --> p1
    c12[Client] --> p1
  end
```

---

### 正向代理(Forward Proxy)

```mermaid
flowchart TB
  subgraph 正向代理
    subgraph LAN0
    c00[Client] --> p0[Proxy] 
    c01[Client] --> p0
    c02[Client] --> p0
    end
    p0 --> s0[Server]
  end
```

Client 为了访问到 Server, 想 Proxy 发送了一个请求并指定目标位 Server, 然后由 Proxy 转发请求并将获得的内容返回给 Client

正向代理，也称为普通代理，是客户端向代理服务器发送请求，代理服务器再将请求发送给目标服务器，然后将目标服务器返回的数据返回给客户端。正向代理的代理对象是客户端, 帮助客户端访问其无法访问的服务器资源

正向代理是代理服务器向服务器发送请求，代表客户端请求数据, 一般是由客户端架设的

正向代理中, 服务器不知道真正的客户端是谁

---

### 反向代理(Reverse Proxy)

```mermaid
flowchart TB
  subgraph 反向代理
    subgraph LAN1
    p1[Proxy] --> s10[Server]
    p1 --> s11[Server]
    p1 --> s12[Server]
    end
    c10[Client] --> p1
    c11[Client] --> p1
    c12[Client] --> p1
  end
```

反向代理，是客户端向反向代理服务器发送请求，反向代理服务器根据请求的内容将请求转发到内部的服务器集群中的某一台服务器上，将处理结果返回给客户端。反向代理的代理对象是服务器, 帮助服务器做负载均衡, 安全防护等

反向代理是代理服务器接收客户端请求，向服务器发送请求，代表服务器提供服务, 一般是由服务端架设的

反向代理中, 客户端不知道真正的服务器是谁

---

## 代理协议

> [白话 OSI 七层网络模型 (freecodecamp.org)](https://www.freecodecamp.org/chinese/news/osi-model-networking-layers/)

- HTTP(s)
- Socks
- FTP
- SMTP
- DNS
- WebSocket

上述协议除了 Socks 工作在会话层外, 其他协议都工作在应用层

---

### Socks 协议

代理是一种网络服务, 可以让客户端通过一个中间服务器来访问目标服务器, Socks 协议是一种代理协议, 可以支持任何类型的网络流量

Socks(Socket Secure)协议是一种网络协议，用于在客户端和服务器之间进行通信，常被代理服务器使用。Socks协议与HTTP代理不同，它不解析数据包，而是将其原封不动地发送给代理目标。因此，Socks协议可以更高效地处理网络流量，但也会带来一些安全风险。

Socks 工作在第五层(会话层), 使用 TCP 协议传输数据, 不提供如 ICMP 信息之类的网络层相关服务

![img](http://cdn.ayusummer233.top/DailyNotes/202302271331853.jpeg)

Socks 目前有 SOCKS4 和 SOCKS5 两个版本

- SOCKS4支持TELNET, FTP, HTTP等TCP协议；
- SOCKS5支持TCP与UDP，并支持安全认证方案。

> - 认证方式：Socks4 不支持认证机制，而 Socks5 支持多种认证方式，包括用户名密码认证、GSS-API 认证等。
> - 支持的协议：Socks4只支持TCP协议，而Socks5支持TCP和UDP协议。
> - DNS解析：Socks4代理不支持DNS解析，它只接受IP地址作为参数。而Socks5代理支持DNS解析，可以将域名解析为IP地址。
> - Socks5 支持 IPv6, Socks4只支持IPv4地址，而Socks5支持IPv4和IPv6地址。

常见的转发工具有

- reGeorg
- SSH 端口转发
- iptables
- Netsh
- LCX
- EarthWorm(支持多种系统)
- Socks(Linux)
- Netcat

常见的代理链工具:

- Proxychains(Linux)
- Proxifier(Windows)
- Sockscap64(Windows)

---

## 端口转发

---

### 使用 netsh 设置端口转发

`netsh(Network Shell)` 是 Windows 用于查看和修改本地计算机或远程计算机网络配置的命令行脚本工具, 被广泛应用于配置网络接口, 防火墙规则, IP地址, 路由规则等多种网络相关的设置

可以使用 netsh 来配置端口转发, 结合如下场景演示:

```mermaid
graph TB
    subgraph 本地主机
        A((Local Host-连接))
    end

    subgraph 本地主机可以访问到的一台Windows主机
        B((Transport Host<br>转发本地listenprot到<br>Remote Host connectport))
    end

    subgraph Transport Host 可以访问到的目标远程Linux主机
        C((Remote Host<br>connectport上有SSH服务))
    end
	
	A -->|SSH Connection <br>-> listenport| B --> C

```

```powershell
netsh interface portproxy add v4tov4 listenport=[本地端口] listenaddress=0.0.0.0 connectport=[远程端口] connectaddress=[内网Linux设备的IP]
```

这样就可以在 Local Host 上直接 SSH 到 Transport Host 的 listenport 来连接 Remote Host 上的 SSH 服务了

---

相应的, 要通过 RDP 本机的 listenport 转发到目标 Windows 的 3389 端口也可以远程登录目标机器, 例如:

```powershell
netsh interface portproxy add v4tov4 listenport=9100 listenaddress=0.0.0.0 connectport=3389 connectaddress=192.168.1.21
# 删除上述规则:
netsh interface portproxy delete v4tov4 listenport=9100 listenaddress=0.0.0.0
# 查看所有转发规则
netsh interface portproxy show all
```

然后就可以 RDP 到本机的 9100 端口来远程 192.168.1.21 了, 例如

![](http://cdn.ayusummer233.top/DailyNotes/202312011346591.png)

---

### Linux-iptables设置端口转发

> TODO: 还是有些问题

启用 ip 转发

```bash
sudo sysctl -w net.ipv4.ip_forward=1
```

设置 iptables 端口转发规则：

```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport <外部端口> -j DNAT --to-destination <目标IP>:<目标端口>
sudo iptables -t nat -A POSTROUTING -j MASQUERADE
```

保存 iptables 规则：

```bash
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```



---

### SSH隧道(端口转发)

**SSH 隧道是 SSH 中的一种机制**，它能够将其他 TCP 端口的网络数据通过 SSH 连接来转发，并且自动提供了相应的加密及解密服务。因为 SSH 为其他 TCP 链接提供了一个安全的通道来进行传输，因此这一过程也被叫做“隧道”（tunneling）。

SSH 端口转发分为本地转发, 远程转发以及动态转发三类; 请参阅 [SSH隧道](./SSH隧道.md)

---

## 代理服务器

这里主要讲的是正向代理服务器, 反代暂时每没碰到需求, 有需求的话再加

除了下面提到的这些可以用于正向代理服务器外, 如下这些也可以, 不过这里就不展开讲了

- Nginx
  - [Nginx 正向代理 http、https（openEuler）-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/2399761)
  - [Nginx-正向代理实现 - 别来无恙- - 博客园 (cnblogs.com)](https://www.cnblogs.com/yanjieli/p/15229907.html)
- Apache HTTP Server
  - [Apache httpd Server 配置正向代理 - luojiahu - 博客园 (cnblogs.com)](https://www.cnblogs.com/luojiahu/p/9425535.html)

---

### Clash

> PS: Clash 既可以作为代理服务器也可以作为代理客户端使用

---

作为服务器使用可以让本地挂 Clash 指定端口上的 HTTP(S) OCKS 代理

![image-20240530132925193](http://cdn.ayusummer233.top/DailyNotes/202405301329390.png)

要在局域网内其他机器使用这台机器上的 Clash 代理的话则需要打开 `Allow LAN`


---

### squid

> [squid代理及常见的代理上网 - SSgeek - 博客园 (cnblogs.com)](https://www.cnblogs.com/ssgeek/p/12302135.html)
>
> [squid : Optimising Web Delivery (squid-cache.org)](https://www.squid-cache.org/Doc/)
>
> [Binary Packages for Squid | Squid Web Cache wiki (squid-cache.org)](https://wiki.squid-cache.org/SquidFaq/BinaryPackages)
>
> ---
>
> [如何在Ubuntu 20.04上安装和配置Squid Proxy-域风网 (yfname.com)](https://www.yfname.com/help/detail/288)

---

#### 安装

可以在 [Binary Packages for Squid | Squid Web Cache wiki (squid-cache.org)](https://wiki.squid-cache.org/SquidFaq/BinaryPackages) 下载适用于各个系统的 squid 二进制文件

![image-20240806142639206](http://cdn.ayusummer233.top/DailyNotes/202408061426422.png)

---

:::tabs

@tab:active Ubuntu

在 [Squid on Ubuntu | Squid Web Cache wiki (squid-cache.org)](https://wiki.squid-cache.org/KnowledgeBase/Ubuntu) 可以看到, 直接使用如下命令安装即可

```bash
aptitude install squid
```

> `aptitude` 是 `apt` 的一个前端，提供了一个交互式的界面和一些额外的功能，通常用于更复杂的包管理操作。

![image-20240806151400428](http://cdn.ayusummer233.top/DailyNotes/202408061514581.png)

```bash
# 验证下 squid 的状态
systemctl status squid
```

![image-20240806151541768](http://cdn.ayusummer233.top/DailyNotes/202408061515881.png)

:::

---

#### 配置

备份与编辑 `/etc/squid/squid.conf` 以修改 squid 配置

如下图所示, squid 默认监听在所有网卡的 `3128` 端口上

![image-20240806151806978](http://cdn.ayusummer233.top/DailyNotes/202408061518091.png)

---

默认情况下只允许本地连接

![image-20240806152235600](http://cdn.ayusummer233.top/DailyNotes/202408061522677.png)

可以在前面加一行

```properties
http_access allow all
```

来允许所有连接

如果需要精确配置需要哪些IP网段连接的话可以参阅配置文件注释以及 [如何在Ubuntu 20.04上安装和配置Squid Proxy-域风网 (yfname.com)](https://www.yfname.com/help/detail/288)  

---

修改完配置后可以重启 squid 服务以加载配置

```bash
# 重启 squid 服务
systemctl restart squid.service
# 设置开机自启动
systemctl enable squid.service
```

然后就可以正常作为 HTTP 代理服务器使用了, 例如:

![image-20240806153247993](http://cdn.ayusummer233.top/DailyNotes/202408061532084.png)

![image-20240806153312004](http://cdn.ayusummer233.top/DailyNotes/202408061533117.png)

---

### 使用 SSH 创建动态端口转发作 socks 代理服务器

> [用ssh做firefox的代理_空空法师的博客-CSDN博客](https://blog.csdn.net/snleo/article/details/4792523)


```bash
ssh -fND localhost:12345 -i [私钥路径] root@192.168.1.96
```

- `-f` 表示在后台运行 ssh 命令, 不占用终端
- `-N` 表示不执行远程命令,只做端口转发
- `-D localhost:12345` 表示创建一个动态端口转发, 将本地主机 `localhost` 的 12345 端口作为 socks 代理
- `-i [私钥路径]` 表示使用指定私钥文件进行身份验证
- `root@192.168.1.96` 表示以 root 用户登录远程主机 192.168.1.96

这个命令可以使得通过 ssh 隧道访问远程主机上的网络服务, 或者使用远程主机作为代理访问其他网站

![image-20230330173345557](http://cdn.ayusummer233.top/DailyNotes/202304041354643.png)

挂上后命令行会卡在这里
然后 Firefox 配置 socks 5 代理

![image-20230330180127369](http://cdn.ayusummer233.top/DailyNotes/202304041354163.png)

如此这般就可以从本地的 Firefox 挂 96 的代理访问内网其他的服务了

----

##### BurpSuit 挂内网主机的 socks 代理拦截本地 http 流量访问内网其他的服务

首先还是 SSH 连接并转发端口

```bash
ssh -fND localhost:12345 -i [私钥路径] root@192.168.1.96
```

配置 BurpSuit Socks 代理:

`BurpSuit -> Proxy Setting -> Network->Connections->Socks proxy`

![image-20230331113331780](http://cdn.ayusummer233.top/DailyNotes/202304041354182.png)

配置 BurpSuit http 代理监听:

![image-20230331112806555](http://cdn.ayusummer233.top/DailyNotes/202304041354730.png)

配置 Firefox http 代理

![image-20230331141034822](http://cdn.ayusummer233.top/DailyNotes/202304041354257.png)

---

### snail007/goproxy

> [goproxy/README_ZH.md at master · snail007/goproxy · GitHub](https://github.com/snail007/goproxy/blob/master/README_ZH.md)

```bash
# linux - 免费版 - 安装命令
bash -c "$(curl -s -L https://mirrors.goproxyauth.com/https://github.com/snail007/goproxy/blob/master/install_auto.sh)" @ cn  
```

![image-20240805180728693](http://cdn.ayusummer233.top/DailyNotes/202408051807836.png)

```bash
# 安装管理面板
curl -L https://mirrors.host900.com/https://github.com/snail007/proxy_admin_free/blob/master/install_auto.sh | bash  
```

> stash: 上面的命令可能会失败, 多试几次, 或者可以尝试如下命令
>
> ```bash
> bash -c "$(curl -L https://mirrors.host900.com/https://github.com/snail007/proxy_admin_free/blob/master/install_auto.sh)" @ cn 
> ```
>
> ---
>
> 上述脚本的实际内容如下
>
> ```bash
> #!/bin/bash
> #!/bin/bash
> if [ "$1" == "cn" ]; then
>   MIRROR="https://mirrors.goproxyauth.com/"
> fi
> F="proxy-admin_linux-amd64.tar.gz"
> set -e
> if [ -e /tmp/proxy ]; then
>     rm -rf /tmp/proxy
> fi
> mkdir /tmp/proxy
> cd /tmp/proxy
> echo -e "\n>>> downloading ... $F\n"
> 
> manual="https://snail.gitee.io/proxy/manual/zh/"
> LAST_VERSION=$(curl --silent "${MIRROR}https://api.github.com/repos/snail007/proxy_admin_free/releases/latest" | grep -Po '"tag_name": *"\K.*?(?=")')
> wget  -t 1 "${MIRROR}https://github.com/snail007/proxy_admin_free/releases/download/${LAST_VERSION}/$F"
> 
> echo -e ">>> installing ... \n"
> #install proxy-admin
> tar zxvf $F >/dev/null 2>&1
> rm -rf $F
> chmod +x proxy-admin
> mkdir -p /usr/local/bin/
> cp -f proxy-admin /usr/local/bin/
> set +e
> cd /usr/local/bin/
> ./proxy-admin uninstall >/dev/null 2>&1
> cp -f /tmp/proxy/proxy-admin /usr/local/bin/
> set -e
> ./proxy-admin install
> ./proxy-admin start
> set +e
> systemctl status proxyadmin &
> set -e
> sleep 2
> echo  -e "\n>>> install done, thanks for using snail007/proxy-admin\n"
> echo  -e ">>> install path /usr/local/bin/proxy-admin\n"
> echo  -e ">>> configuration path /etc/gpa\n"
> echo  -e ">>> uninstall just exec : /usr/local/bin/proxy-admin uninstall && rm /etc/gpa\n"
> echo  -e ">>> please visit : http://YOUR_IP:32080/ username: root, password: 123\n"
> echo  -e ">>> How to using? Please visit : $manual\n"
> ```

执行完命令后会自动拉起 `proxy-admin`(`line32`)

访问该主机的 `32080` 端口的 HTTP 服务即可看到登录页, 使用默认账密 `root/123` 登录并修改密码即可

![image-20240806101237356](http://cdn.ayusummer233.top/DailyNotes/202408061012504.png)

然后在 `HTTP代理->HTTP代理管理` 处可以尝试新增 HTTP 代理

![image-20240806103919675](http://cdn.ayusummer233.top/DailyNotes/202408061039776.png)

如下框选的部分为基本配置, 按照自己的设定填写即可

> WS密码随便填就行, 用于底层传输, 对用户无感
>
> 如果还有上级代理的话也可以手动配置一下

![image-20240806104002577](http://cdn.ayusummer233.top/DailyNotes/202408061040646.png)

之后便可以像正常 HTTP 代理一样使用了, 例如:

![image-20240806104746891](http://cdn.ayusummer233.top/DailyNotes/202408061047971.png)

> PS: 不过这个有点重, 适用于需要完整解决方案的场景, 不会作为轻量代理服务器使用


---

## 代理客户端

常见的 Clash, V2RayN 都算是代理客户端, 主要用于代理与混淆网络流量, 不过他们也可以为本地或局域网提供代理服务当代理服务器用

---

### 命令行设置HTTP代理

:::tabs

@tab:active powershell

```powershell
$env:http_proxy = "http://your_proxy_address:port"
# 使用用户名和密码身份验证的代理服务器:
$env:http_proxy = "http://username:password@proxy.example.com:8080"

# 例如:
$env:http_proxy = "http://127.0.0.1:7890"
$env:https_proxy = "http://127.0.0.1:7890"
```

@tab Linux

```bash
export http_proxy="http://your_proxy_address:port"
# 使用用户名和密码身份验证的代理服务器:
export http_proxy="http://username:password@proxy.example.com:8080"

# 例如:
export http_proxy="http://127.0.0.1:7890"
export https_proxy="http://127.0.0.1:7890"
```

:::

---


### Proxychains

#### 安装

```bash
sudo apt update
sudo apt install proxychains
```

---

#### 使用

编辑 `/etc/proxychains.conf`

![image-20240412105517854](http://cdn.ayusummer233.top/DailyNotes/202404121055235.png)

然后就可以在需要代理的命令前加 `proxychains`  来使用了, 例如:

```bash
proxychains wget http://example.com
```

---

### TODOLIST

- 暂时不太常单独配置

  - [ ] Clash

- 商业软件, 需要付费而且价格比较高

  - [ ] Proxifier

    Proxifier 主要用于将应用程序的流量通过代理服务器进行转发，它支持HTTP、SOCKS v4和SOCKS v5代理

    Proxifier能为那些不原生支持代理的应用程序提供代理服务。它的界面较为简洁，用户可以为单个程序或整个系统设置代理规则。

  - [ ] ProxyCap

    ProxyCap 除了具备Proxifier的功能外，还支持 VPN 连接的流量代理以及使用SSH协议进行代理设置
  
- 已停止更新于维护

  - Sockscap64

    > [SocksCap64官方首页 - SocksCap64](https://www.sockscap64.com/sockscap64-official-homepage-chinese/)

    SSTap和SocksCap64已于2017年11月19日停止开发及维护和下载.


---

























