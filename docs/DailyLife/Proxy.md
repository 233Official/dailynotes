---
date: 2025-10-09

---

# 代理

- [代理](#代理)
  - [ClashForWindows(CFW)](#clashforwindowscfw)
    - [pip 报错 `ValueError: check_hostname requires server_hostname`](#pip-报错-valueerror-check_hostname-requires-server_hostname)
    - [TUN Mode](#tun-mode)
    - [Mixin](#mixin)
    - [Bypass](#bypass)
    - [内网断网主机出网流量走另一台联网主机](#内网断网主机出网流量走另一台联网主机)
  - [clash-verge-rev](#clash-verge-rev)
    - [图标卡死](#图标卡死)
  - [Proxifier](#proxifier)

---

## ClashForWindows(CFW)

> [Github/Dreamacro/clash](https://github.com/Dreamacro/clash)  
> [Github/Dreamacro/clash-dashboard](https://github.com/Dreamacro/clash-dashboard)
> [alvinkwok/clashForLinux安装配置](https://www.alvinkwok.cn/2022/01/29/2022/01/Clash%20For%20Linux%20Install%20Guide/)
>
> ---
>
> [正确配置Clash For Windows的TUN、TAP、系统代理三种模式？ | 来去之间 (clashdingyue.tk)](https://clashdingyue.tk/2022/06/正确配置Clash-For-Windows/)
>
> [clash 中的 minxin 使用教程 - cornradio的技术博客](https://cornradio.github.io/hugo/posts/4minxin-howtouse/)
>
> [steam如何绕过clash的全局代理 - cornradio的技术博客](https://cornradio.github.io/hugo/posts/让steam绕过clash系统代理/)
>
> ---

> [Clash for windows RCE 漏洞 - FreeBuf网络安全行业门户](https://www.freebuf.com/vuls/323348.html)

**`Clash Version <= V0.19.8`  存在 RCE 漏洞**, 建议升级到 `V0.19.10` 及以上版本

---

Windows 端的配置比较方便, Linux 端主要需要注意普通用户和root用户的区别以及需要多配置一个 dashboard 来管理

下面主要记录下 ubuntu 上使用 clash 的随笔

需要注意的是, 使用不同的用户进行操作生成的配置文件会在对应用户的 `.config` 目录下, 如下记录的是使用 root 用户登录时进行的操作(SSH 链接的 ubuntu 设备, 习惯了 root; 相应的桌面端的话一般是普通用户)

在 `/root/.config/` 目录下新建一个 `clash` 目录

在 [Releases · Dreamacro/clash (github.com)](https://github.com/Dreamacro/clash/releases) 下载对应的安装包, 这里我选择的是 [clash-linux-amd64-v1.13.0.gz](https://github.com/Dreamacro/clash/releases/download/v1.13.0/clash-linux-amd64-v1.13.0.gz) 

```bash
# 解压该 gz 包得到一个文件, 给该文件加上执行权限
gunzip clash-linux-amd64-v1.13.0.gz
chmod u+x clash-linux-amd64-v1.13.0
```

clone dashboard 仓库并切换到 gh-pages 分支:

```bash
git clone https://github.com/Dreamacro/clash-dashboard.git
cd clash-dashboard
git checkout -b gh-pages origin/gh-pages
```

> 尝试过使用镜像 clone, 但是在  `git checkout -b gh-pages origin/gh-pages` 这步会报错找不到 `origin/gh-pages` 分支, 由于裸连能 clone 下来所以没再处理

下载配置信息

```bash
sudo wget -O config.yaml [订阅链接]
sudo wget -O Country.mmdb https://www.sub-speeder.com/client-download/Country.mmdb
```

编辑 `config.yaml` 的如下三个属性, 分别对应页面端口, 访问密钥以及页面所在目录

```yaml
external-controller: '0.0.0.0:9090'
secret: 'xxxxxxx'
external-ui: '/root/.config/clash/clash-dashboard'
```

尝试运行 clash

```bash
screen -S clash
./clash-linux-amd64-v1.13.0
```

访问 `[ip]:[port]/ui` 输入密钥登入

到这里没问题的话就可以配置下系统代理了

![image-20230201151825066](http://cdn.ayusummer233.top/DailyNotes/202302011518116.png)

有些程序不走系统代理，需要单独配置，比如 git, 需要单独进行配置

```bash
git config --global http.proxy "http://127.0.0.1:7890"
```

---

### pip 报错 `ValueError: check_hostname requires server_hostname`

![image-20230718235830248](http://cdn.ayusummer233.top/DailyNotes/202307182358348.png)

![image-20230718235900189](http://cdn.ayusummer233.top/DailyNotes/202307182359232.png)

解决方案: 打开该项配置:

![image-20230719000029091](http://cdn.ayusummer233.top/DailyNotes/202307190000154.png)

> [bpo-42627: Fix wrong parsing of Windows registry proxy settings by CrazyBoyFeng · Pull Request #26307 · python/cpython · GitHub](https://github.com/python/cpython/pull/26307)

开了之后就正常了:

![image-20230719000057721](http://cdn.ayusummer233.top/DailyNotes/202307190000747.png)

---



---

### TUN Mode

> [TUN 模式 | Clash for Windows (lbyczf.com)](https://docs.cfw.lbyczf.com/contents/tun.html)
>
> [正确配置Clash For Windows的TUN、TAP、系统代理三种模式？ | 来去之间 (clashdingyue.tk)](https://clashdingyue.tk/2022/06/正确配置Clash-For-Windows/)
>
> [Clash for Windows 优雅地使用 TUN 模式接管系统流量 · Dejavu's Blog](https://blog.dejavu.moe/posts/cfw-tun/)

Clash 有三种代理模式

- 系统代理模式

  - 最简单的一种模式，只需要开启系统代理的开关即可。
  - 但是有些软件不走系统代理，因此这种模式适合普通用户，平常用浏览器进行科学上网的。

- Clash Tap Device模式

  - Clash Tap 虚拟网卡模式，让所有的流量走虚拟网卡，实现真正的全局翻墙模式，实现所有软件代理。

  - **TAP** 是 `二层设备`，模拟一个物理以太网设备，操作第二层数据包如以太网数据帧

    > 对于不遵循系统代理的软件，TUN 和 TAP 模式都可以接管系统流量并交由 CFW 处理，但是 TUN 模式在 Windows 下拥有比 TAP 模式更好的性能，

- Clash TUN Mode模式

  - **TUN** 是 `三层设备` ，模拟一个网络层设备，操作 **第三层** 数据包比如 IP 数据包，TUN 虚拟网卡实现 IP 层隧道

    Tun 模式通过新建一个 Tun 虚拟网卡接受操作系统的三层浏览流量，从而拓展 Clash 入口(inbound) 转发能力，Tun 模式可以提升 Clash 处理 UDP 流量的能力，可以劫持任何三层流量，实现 DNS 劫持也是轻而易举，并且它与部分操作系统的网络栈结合也非常好，可以提升利用 iptables 等组件的能力

  - 对于不遵循系统代理的软件，TUN 模式可以接管其流量并交由 CFW 处理，在 Windows 中，TUN 模式性能比 TAP 模式好

  > `注意`: 近期大部分浏览器默认已经开启“**安全 DNS**”功能，此功能会影响 TUN 模式劫持 DNS 请求导致反推域名失败，请在浏览器设置中关闭此功能以保证 TUN 模式正常运行

- 什么情况下需要开启TAP/TUN ？

  - 在使用一些游戏软件需要加速，或者一些不遵循系统代理的软件时，需要开启 TAP/TUN 模式。
  - 专业用户，例如IT、开发人员，需要经常操作终端，使用开发软件，用到Linux子系统的建议使用TUN模式。
  - 其实大部分软件都走系统代理，例如浏览器，但是有些不走系统代理，例如某些游戏，Git等。平时使用浏览器翻墙，比如访问google网站，或者使用一些遵循系统代理的软件时，不需要开启 TAP/TUN 模式。建议直接使用系统代理模式。
  - Windows 中的 UWP 应用是无法走这个代理的，因为 UWP 应用网络隔离的‘沙箱’特性，因此我们还需要使用 `UWP Loopback` 中的轻量 `Fiddler Web Debuger` 来解锁 UWP 应用的网络隔离，后续新安装的 UWP 应用也要按照上面步骤进行添加，否则 UWP 应用就会无法联网；此外，像 Git、npm、yarn 这些是无法走系统代理的，需要 [手动设置代理](https://blog.dejavu.moe/posts/git-npm-yarn-proxy/)，而且一些不支持设置代理但又无法在天朝直连国际互联网的软件/应用 Fuxk GFW 也是个难题，而绝佳的 CFW(Clash For Windows) 提供了 TUN/TAP 模式就很好的解决了这个问题
  - ==在使用局域网VPN时==, 如果同时启用了 TUN Mode 可能会导致网络异常, 此时建议使用 System Proxy

- 启用 TUN Mode(`0.19.27`以上版本)

  - 点击`General`中`Service Mode`右边`Manage`，在打开窗口中安装服务模式，安装完成应用会自动重启，Service Mode 右边地球图标变为`绿色`即安装成功(无法安装参考：[这里](https://docs.cfw.lbyczf.com/contents/questions.html#service-mode-无法安装-windows)) 

    > [Service Mode 作用是啥？为什么要开启这个模式 · Issue #2839 · Fndroid/clash_for_windows_pkg (github.com)](https://github.com/Fndroid/clash_for_windows_pkg/issues/2839)

    ![image-20230719003009188](http://cdn.ayusummer233.top/DailyNotes/202307190030213.png)

    ![image-20230719003029472](http://cdn.ayusummer233.top/DailyNotes/202307190030538.png)

  - 点击`General`中`TUN Mode`右边开关启动 TUN 模式

    相应的需要关闭 `System Proxy`, 如果装了 Tap Server 也需要相应 `uninstall`, 因为三种模式之间可能会冲突

    ![image-20230719003133662](http://cdn.ayusummer233.top/DailyNotes/202307190031691.png)

    > 如果使用`system`作为 TUN stack，需要同时在系统防火墙中将 clash core 放行，方法如下：
    >
    > 在`0.19.27`及以上版本中，点击 Clash Core 版本号前的图标，并在 UAC 弹窗(若有) 中允许运行，CFW 将自动配置对应的防火墙规则。
    >
    > 成功配置防火墙规则后该图标作为指示灯亮起。
    >
    > ![img](http://cdn.ayusummer233.top/DailyNotes/202307190042513.png)

---

### Mixin

> [Mixin | Clash for Windows (lbyczf.com)](https://docs.cfw.lbyczf.com/contents/mixin.html)
>
> [clash 中的 minxin 使用教程 - cornradio的技术博客](https://cornradio.github.io/hugo/posts/4clash-minxin-howtouse/)

简单说，mixin是一种混合配置的方式，你可以把自己的配置注入到“配置文件”中，这样就可以在一定程度上的自定义配置了，比如加入一些你自己的规则之类的。

![image-20230719004524193](http://cdn.ayusummer233.top/DailyNotes/202307190045224.png)

例如：在配置文件中统一添加`dns`字段，操作如下：

1. 进入 Settings 页面

2. 滚动至 Profile Mixin 栏

3. 点击 YAML 右边 Edit 小字打开编辑界面

4. 在修改编辑界面内容为：

   ```yaml
   mixin: # 注意下面缩进
     dns:
       enable: true
       listen: :53
       nameserver:
         - 8.8.8.8
   ```

5. 点击编辑器右下角保存

在启动或切换配置时，上面内容将会替换到原有配置文件中进行覆盖

> **TIP**
>
> 配置文件内容不会被修改，混合行为只会发生在内存中
>
> 可以通过任务栏图标菜单开关这个行为

---

### Bypass

> [绕过系统代理 | Clash for Windows (lbyczf.com)](https://docs.cfw.lbyczf.com/contents/bypass.html)
>
> [0.16.2 版，Steam 商店、社区无法加载 · Issue #2035 · Fndroid/clash_for_windows_pkg (github.com)](https://github.com/Fndroid/clash_for_windows_pkg/issues/2035)
>
> [steam如何绕过clash的全局代理 - cornradio的技术博客](https://cornradio.github.io/hugo/posts/让steam绕过clash系统代理/)

可以自定义系统代理需要绕过的域名或 IP, 常用于配置局域网域名不使用代理或是其他指定的不想使用代理的域名(例如Steam游戏下载)

![image-20230719005351367](http://cdn.ayusummer233.top/DailyNotes/202307190053433.png)

一般情况下后台基本都会挂着 Clash, 然而当需要登 Steam 下游戏时, 如果当前代理的配置中相应域名走了 Proxy 那就比较耗流量且较慢(毕竟 Steam 下载设置中是可以设置国内地区的)

此时则可以修改 

```yaml
bypass:
# Steam中国大陆地区游戏下载
  - "steampipe.steamcontent.tnkjmec.com" #华为云
  - "st.dl.eccdnx.com" #白山云
  - "st.dl.bscstorage.net"
  - "st.dl.pinyuncloud.com"
  - "dl.steam.clngaa.com" #金山云
  - "cdn.mileweb.cs.steampowered.com.8686c.com" #网宿云
  - "cdn-ws.content.steamchina.com"
  - "cdn-qc.content.steamchina.com" #腾讯云
  - "cdn-ali.content.steamchina.com" #阿里云
# Steam非中国大陆地区游戏下载/社区实况直播
  - "*.steamcontent.com"
# Steam国际创意工坊下载CDN
  - "steamusercontent-a.akamaihd.net" #CDN-Akamai
# Origin游戏下载
  - "ssl-lvlt.cdn.ea.com" #CDN-Level3
  - "origin-a.akamaihd.net" #CDN-Akamai
# Battle.net战网中国大陆地区游戏下载
  - "client05.pdl.wow.battlenet.com.cn" #华为云
  - "client02.pdl.wow.battlenet.com.cn" #网宿云
# Battle.net战网非中国大陆地区游戏下载
  - "level3.blizzard.com" #CDN-Level3
  - "blzddist1-a.akamaihd.net" #CDN-Akamai
  - "blzddistkr1-a.akamaihd.net"
  - "kr.cdn.blizzard.com" #CDN-Blizzard
  - "us.cdn.blizzard.com"
  - "eu.cdn.blizzard.com"
# Epic Games中国大陆地区游戏下载
  - "epicgames-download1-1251447533.file.myqcloud.com"
# Epic Games非中国大陆地区游戏下载
  - "epicgames-download1.akamaized.net" #CDN-Akamai
  - "download.epicgames.com" #CDN-Amazon
  - "download2.epicgames.com"
  - "download3.epicgames.com"
  - "download4.epicgames.com"
# Rockstar Launcher客户端更新/游戏更新/游戏下载
  - "gamedownloads-rockstargames-com.akamaized.net"
# GOG中国大陆游戏下载/客户端更新
  - "gog.qtlglb.com"
# GOG非中国大陆游戏下载/客户端更新
  - "cdn.gog.com"
  - "galaxy-client-update.gog.com"
```

---

### 内网断网主机出网流量走另一台联网主机

写 `config.yml`

```yml
mixed-port: [此项配置需要绑定的本地端口]
allow-lan: false # 是否 allow lan 后续也可以直接在 UI 上改
external-controller: 127.0.0.1:xxxx
secret: xxx

proxies:
  - name: "LAN Proxy"
    type: socks5
    server: [联网主机ip]
    port: [联网主机代理端口]
rules:
  - DOMAIN-SET,*,LAN Proxy
  - FINAL, LAN Proxy  # 默认流量也走 LAN Proxy
```

> 例如:
>
> ```yaml
> mixed-port: 7890
> allow-lan: false
> external-controller: 127.0.0.1:49897
> secret: a1054823-f243-4256-ac5b-a858457a02e
> 
> proxies:
>   - name: "LAN Proxy"
>     type: socks5
>     server: 192.168.1.21
>     port: 7890
> rules:
>   - DOMAIN-SET,*,LAN Proxy
>   - FINAL, LAN Proxy  # 默认流量也走 LAN Proxy
>  
> ```
>
> ![image-20241008162444574](http://cdn.ayusummer233.top/DailyNotes/202410081624764.png)

断网主机所有流量走联网主机直接开 Clash 的 TUN 模式

![image-20241008162912731](http://cdn.ayusummer233.top/DailyNotes/202410081629798.png)

![image-20241008162944425](http://cdn.ayusummer233.top/DailyNotes/202410081629511.png)

> 代理前断网主机 maven 不会走系统代理, 也不会走手动设置的当前 powershell 命令行 http 代理
>
> ![image-20241008163233365](http://cdn.ayusummer233.top/DailyNotes/202410081632443.png)
>
> 设置代理开了 TUN 后所有流量走虚拟网卡就正常了:
>
> ![image-20241008163259410](http://cdn.ayusummer233.top/DailyNotes/202410081632501.png)

---

## clash-verge-rev

> [常见名词 - Clash Verge Rev Docs (clash-verge-rev.github.io)](https://clash-verge-rev.github.io/guide/term.html)
>
> [[Feature\]如何设置特定软件进程不走代理呢？ · Issue #420 · clash-verge-rev/clash-verge-rev · GitHub](https://github.com/clash-verge-rev/clash-verge-rev/issues/420)

### 图标卡死

> [Issues · clash-verge-rev/clash-verge-rev · GitHub](https://github.com/clash-verge-rev/clash-verge-rev/issues?q=is%3Aissue+is%3Aopen+卡)
>
> [[BUG\] 客户端会无故卡死。 · Issue #1110 · clash-verge-rev/clash-verge-rev · GitHub](https://github.com/clash-verge-rev/clash-verge-rev/issues/1110)

Clash Verge Rev 和其他代理无法共存, 如果需要使用它清关闭其他代理软件

![image-20240725135512096](http://cdn.ayusummer233.top/DailyNotes/image-20240725135512096.png)

> 具体原因我也没找到, 不过因为这个原因我应该暂时用不到 Clash Verge Rev

---

## Proxifier

> [Proxifier - The Most Advanced Proxy Client](https://www.proxifier.com/)



---
