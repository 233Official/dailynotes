# SSH 隧道

---

- [SSH 隧道](#ssh-隧道)
  - [本地端口转发(Local Port Forwarding)](#本地端口转发local-port-forwarding)
  - [远程端口转发(Remote Port Forwarding)](#远程端口转发remote-port-forwarding)
    - [应用场景-断网主机联网](#应用场景-断网主机联网)
  - [动态端口转发(Dynamic Port Forwarding)](#动态端口转发dynamic-port-forwarding)

---

> [什么是SSH隧道_SSH隧道介绍-华为云 (huaweicloud.com)](https://www.huaweicloud.com/zhishi/cph5.html)
>
> [SSH 隧道简明教程 - (lixueduan.com)](https://www.lixueduan.com/posts/linux/07-ssh-tunnel/)

**SSH 隧道是 SSH 中的一种机制**，它能够将其他 TCP 端口的网络数据通过 SSH 连接来转发，并且自动提供了相应的加密及解密服务。因为 SSH 为其他 TCP 链接提供了一个安全的通道来进行传输，因此这一过程也被叫做“隧道”（tunneling）。

SSH隧道即SSH端口转发，在SSH客户端与SSH服务端之间建立一个隧道，将网络数据通过该隧道转发至指定端口，从而进行网络通信。SSH隧道自动提供了相应的加密及解密服务，保证了数据传输的安全性。

SSH 隧道能够提供两大功能：

- 加密 SSH Client 端至 SSH Server 端之间的通讯数据。
- 突破防火墙的限制完成一些之前无法建立的 TCP 连接。

SSH隧道有三种端口转发模式：

- 本地端口转发（Local Port Forwarding）
- 远程端口转发（Remote Port Forwarding）
- 动态端口转发（Dynamic Port Forwarding）

---

## 本地端口转发(Local Port Forwarding)

对于本地/远程端口转发，两者的方向恰好相反。

本地端口转发，是将发送到本地端口的请求，转发到目标端口，这样就可以通过访问本地端口，来访问目标端口的服务。使用-L选项，就可以指定需要转发的端口，语法如下：

```bash
ssh -L 本地端口:目标地址:目标端口
```

```bash
# 例如
ssh -NL 9302:100.1.1.131:9303 -i "xxx" root@100.1.1.131
```

- `-f`: 表示在后台运行 ssh 命令, 不占用终端
- `-N` 表示不执行远程命令,只做端口转发
- `-i [私钥路径]` 表示使用指定私钥文件进行身份验证
- `root@100.1.1.131` 表示以 root 用户登录远程主机`100.1.1.131`

![image-20240805152149061](http://cdn.ayusummer233.top/DailyNotes/202408051521099.png)

在远程主机 `100.1.1.131` 的 `9303` 端口起一个 http 服务

```bash
python -m http.server 9303
```

![image-20240805151017184](http://cdn.ayusummer233.top/DailyNotes/202408051510284.png)

![image-20240805152327461](http://cdn.ayusummer233.top/DailyNotes/202408051523511.png)

---

比如 VSCode Remote-SSH 连上服务器后, 在服务器上执行服务占用的端口会自动进行本地端口转发:

![image-20240805105728544](http://cdn.ayusummer233.top/DailyNotes/202408051057532.png)

![image-20240805105816384](SSH隧道.assets/image-20240805105816384.png)

---

## 远程端口转发(Remote Port Forwarding)

与本地端口转发相对应, 远程端口转发允许你将远程服务器上的一个端口转发到本地计算机上的另一个端口

这样就可以在远程服务器上访问对应的端口以访问本地服务

```bash
# 远程端口转发
ssh -R 远程端口:本地计算机地址:本地端口
```

> 转发都是源端口`port` + 目的地址 `ip:port` 的形式
>
> ```bash
> # 本地端口转发
> ssh -L 本地端口:远程计算机地址:远程端口
> ```

---

例如在本地的 9302 端口起个 SimpeHTTPServer, 然后转发远程 `100.1.1.131` 机器的 `9303` 端口到本地 `127.0.0.1:9302` 

```bash
ssh -R 9303:127.0.0.1:9302 root@100.1.1.131
```

> PS: 这里的 `127.0.0.1` 也可以是本地任意一张网卡的 ip 地址, 因为后面我们起的 SimpleHTTPServer 默认挂在 `0.0.0.0` 上的, 所以任意网卡地址都可以访问

![image-20240805162323134](http://cdn.ayusummer233.top/DailyNotes/202408051623196.png)

```bash
# 本地 9302 端口起 SimpleHTTP 服务
python -m http.server 9302
```

![image-20240805162456569](http://cdn.ayusummer233.top/DailyNotes/202408051624629.png)

![image-20240805162446497](http://cdn.ayusummer233.top/DailyNotes/202408051624534.png)

---

然后就可以在远程机器访问其 **本地回环地址** 的 `9303` 端口来访问到本地的 `9302` 端口上的

![image-20240805163113970](http://cdn.ayusummer233.top/DailyNotes/202408051631013.png)

![image-20240805163217723](http://cdn.ayusummer233.top/DailyNotes/202408051632758.png)

> 相应的如果前面端口转发转发到本地其他网卡上的 `9302` 端口, 那么在远程主机上访问 `9303` 端口时, 本地 log 上看到的是对应网卡上的请求
>
> ![image-20240805163442899](http://cdn.ayusummer233.top/DailyNotes/202408051634961.png)

---

### 应用场景-断网主机联网

本地机器可以上网, 内网远程主机无法上网, 可以通过转发远程端口到本地 HTTP 代理服务器挂载的地址来实现远程主机通过远程端口访问本地HTTP代理上网

例如本地 `7890` 端口存在一个使用 Clash 起的 HTTP 代理服务, 则可以使用如下命令

```bash
ssh -fNR 7890:localhost:7890 -i [ssh私钥绝对路径] [用户名]@[服务器IP]
```

- `-f` 后台运行
- `-N` 不执行远程命令, 仅做端口转发
- `-R` 远程端口转发

如此一来就可以在服务器上使用本地的 Clash 代理了

- `http代理`: `http://localhost:7890`
- `socks5代理`: `socks5://localhost:7890`

在打内网时可以由此实现断网主机联网的效果

---

## 动态端口转发(Dynamic Port Forwarding)

动态端口转发允许你通过SSH创建一个SOCKS代理，从而动态地将流量转发到多个不同的目标地址和端口。

```bash
ssh -fND localhost:12345 -i [私钥路径] root@192.168.1.96
```

- `-f` 表示在后台运行 ssh 命令, 不占用终端

- `-N` 表示不执行远程命令,只做端口转发

- `-D localhost:12345` 表示创建一个动态端口转发, 将本地主机的 12345 端口作为 socks 代理

  > 这里是可以指定本地任一 IP 地址的, 也可以是 `0.0.0.0` 绑定本地任意 IP 地址

- `-i [私钥路径]` 表示使用指定私钥文件进行身份验证

- `root@192.168.1.96` 表示以 root 用户登录远程主机 192.168.1.96

这个命令可以使得通过 ssh 隧道访问远程主机上的网络服务, 或者使用远程主机作为代理访问其他网站

![image-20230330173345557](http://cdn.ayusummer233.top/DailyNotes/202408051708245.png)

挂上后命令行会卡在这里 然后 Firefox 配置 socks 5 代理

![image-20230330180127369](http://cdn.ayusummer233.top/DailyNotes/202408051708754.png)

如此这般就可以从本地的 Firefox 挂 96 的代理访问内网其他的服务了

除此以外还可以再套一层 Burpsuit: `BurpSuit -> Proxy Setting -> Network->Connections->Socks proxy`

![](http://cdn.ayusummer233.top/DailyNotes/202408051708883.png)

配置 BurpSuit http 代理监听:

![](http://cdn.ayusummer233.top/DailyNotes/202408051708044.png)

配置 Firefox http 代理

![](http://cdn.ayusummer233.top/DailyNotes/202408051708623.png)

---

