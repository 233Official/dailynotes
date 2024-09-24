# Linux服务器

- [Linux服务器](#linux服务器)
  - [远程连接服务器](#远程连接服务器)
    - [remote-SSH](#remote-ssh)
  - [文件下载](#文件下载)
  - [腾讯云轻量](#腾讯云轻量)
    - [内网 DNS](#内网-dns)
    - [使用密钥登录到 root 账户](#使用密钥登录到-root-账户)
  - [探针](#探针)

---

## 远程连接服务器

---

### remote-SSH

先在控制台生成并绑定密钥(本地密钥妥善保管), 然后再重置 `root` 密码

> ![20211122113415](http://cdn.ayusummer233.top/img/20211122113415.png) > ![20211122113543](http://cdn.ayusummer233.top/img/20211122113543.png)

> [轻量应用服务器 重置密码 - 操作指南 - 文档中心 - 腾讯云 (tencent.com)](https://cloud.tencent.com/document/product/1207/44575)

打开 VSCode Remote-SSH 插件配置项

```shell
Host Ubuntu
    HostName 公网ip
    User ubuntu
    IdentityFile "本地密钥路径"

Host CentOS
    HostName 公网ip
    User root
    IdentityFile "本地密钥路径"
```

- 腾讯云轻量的 ubuntu 默认禁用 root 用户名通过密码方式登录实例, 如需开启请参考 [Ubuntu 系统如何使用 root 用户登录实例？](https://cloud.tencent.com/document/product/1207/44569#ubuntu-.E7.B3.BB.E7.BB.9F.E5.A6.82.E4.BD.95.E4.BD.BF.E7.94.A8-root-.E7.94.A8.E6.88.B7.E7.99.BB.E5.BD.95.E5.AE.9E.E4.BE.8B.EF.BC.9F)
  - 腾讯云启用 root 密码登录后将 `remote-ssh` 配置项中对应 `User` 改为 `root` 后进行远程连接即可使用 `root 密码` 登录到服务器
  - `CentOS` 的话直接使用 `root` 和 `密钥` 的配置就可以自动登录到 `root 账户`
  - 由于`腾讯云(ubuntu)`绑定密钥默认绑定在 `ubuntu` 用户下, 因此腾讯云使用 `root + 密钥` 的形式登录 `root` 账户需要将密钥拷贝到 `root` 账户配置下即可:
    ```shell
    cat /home/ubuntu/.ssh/authorized_keys > /root/.ssh/authorized_keys
    ```
    > [腾讯云 密钥直接登录 root_Xav Pun 的博客-CSDN 博客](https://blog.csdn.net/weixin_39591031/article/details/118700963)
- `阿里云` 和 `UCLOUD` 默认是支持 `root +  密钥`登录的

> [每天一个 linux 命令(10) ：cat 命令 - peida - 博客园 (cnblogs.com)](https://www.cnblogs.com/peida/archive/2012/10/30/2746968.html)
>
> - 显示文件内容 `cat [filename]`
>
>   ![image-20211123110321948](http://cdn.ayusummer233.top/img/202111231103098.png)
>
> - 创建一个文件 `cat > [filename]`
>
>   ![image-20211123111154541](http://cdn.ayusummer233.top/img/202111231111636.png)
>
> - 将若干个文件合并为一个文件: `cat file1 file2 > file`
>
>   ![image-20211123111347216](http://cdn.ayusummer233.top/img/202111231113303.png)

---

## 文件下载

- `VSCode` 连接到服务器确实可以在左栏 `资源管理器` 处选择文件(夹)右键下载, 不过服务器带宽小的话很容易断连
- `Xshell + Xftp` 正版要付费且没必要为了下载个文件就多装一个软件专门做这件事
- 所以考虑直接使用 `Linux scp 命令` 进行下载

`scp` 命令无法识别 `Windows 目录`, 所以要采用一些方式来将 `Windows 目录` 转化成 `Linux 目录`,`WSL` 可以做到这点

`Windows + X` 打开 `Windows 终端`, 随便选择安装了的一个 `ubuntu 发行版` 进入后可以看到当前命令行所在目录 `/mnt/c/Users/233`, 对应 `Windows` 的 `C:/Users/233 目录`

![image-20211101103247697](http://cdn.ayusummer233.top/img/202111011032910.png)

然后使用如下命令将服务器文件下载到本地:

```shell
scp [user]@[ip]:[Linux 服务器上目标文件的路径] [指定下载到windows本地的路径]
```

![image-20211101104310152](http://cdn.ayusummer233.top/img/202111011043258.png)

![image-20211101104334687](http://cdn.ayusummer233.top/img/202111011043774.png)

下载文件夹:

```shell
scp -r [user]@[ip]:[Linux 服务器上目标文件的路径] [指定下载到windows本地的路径]
```

![image-20211101104510504](http://cdn.ayusummer233.top/img/202111011045617.png)

![image-20211101104630367](http://cdn.ayusummer233.top/img/202111011046461.png)

> [一说 git bash 可以](https://blog.csdn.net/fakerswe/article/details/103178542), 不过我拿 `git bash` 用 `ssh 命令` 连接服务器总是被拒绝连接

---

## 腾讯云轻量

---

[云产品首单秒杀*云服务器秒杀*云数据库秒杀 - 腾讯云 (tencent.com)](https://cloud.tencent.com/act/new?from=14615)[PS: 2C4G 轻量首年 74]

---

### 内网 DNS

- yum 命令报错: `Could not resolve host: mirrors.tencentyun.com; Unknown error`

  [Could not resolve host: mirrors.tencentyun.com_user2025 的博客-CSDN 博客](https://blog.csdn.net/user2025/article/details/107733068)

  原因：腾讯云服务器内网 yum 源的域名 mirrors.tencentyun.com 需要有内网的 DNS 才能访问，但是实际情况下，我们会根据需要修改 DNS，为了使用腾讯云内网快速稳定的内网源，我们需要把 DNS 恢复为内网 DNS，下面为各地区服务器 DNS 地址
  解决办法：
  (1) 修改服务器的 DNS 配置文件：`/etc/resolv.conf` ，请参阅如下文档添加对应地区的内网 DNS 服务器

  [云服务器 内网服务 - 产品简介 - 文档中心 - 腾讯云 (tencent.com)](https://cloud.tencent.com/document/product/213/5225)

  > 我用的上海地域的轻量, 配上海或者上海金融的 DNS 都不对, 最后无奈重置实例才发现原来应该配最后一个所有地域的那个 DNS
  >
  > ![image-20210916203841882](http://cdn.ayusummer233.top/img/202109162038974.png)

  (2) 重启网络服务

  ```shell
  # 重启方式1：
  /etc/init.d/network restart
  #重启方式2：
  systemctl restart network
  ```

---

### 使用密钥登录到 root 账户

> [腾讯云 密钥直接登录 root_Xav Pun 的博客-CSDN 博客](https://blog.csdn.net/weixin_39591031/article/details/118700963)

- 腾讯云的 `ubuntu` 系统, 生成密钥后绑定服务器默认会绑定在 `ubuntu` 用户下, 若要通过密钥登录到 `root` 用户则需要将 `ubuntu` 用户下的密钥复制到 `root` 用户下:
  ```sh
  cat /home/ubuntu/.ssh/authorized_keys > /root/.ssh/authorized_keys
  ```
  然后就可以使用密钥登录到 `root` 用户了

---

## 探针

> [cokemine/ServerStatus-Hotaru: 云探针、多服务器探针、云监控、多服务器云监控 (github.com)](https://github.com/CokeMine/ServerStatus-Hotaru)

在连不上 GitHub 时使用方式

> Coding 目前好像是需要登录才能下载, 仓库提供的默认脚本使用 coding 会拉不下来仓库, 所以还是用 github
>
> 将源仓库中的 github 相关链接换成了 GitHub Proxy 对应链接, 于是有了下文中的脚本

- 服务端

  ```bash
  # 源仓库的 shell(由于有时服务器不一定可以连上 github 所以修改了其中的部分链接便有了下面第二个自己修改的 shell)
  # wget https://cokemine.coding.net/p/hotarunet/d/ServerStatus-Hotaru/git/raw/master/status.sh
  wget https://cdn.ayusummer233.top/shell/status.sh
  ```

  ```bash
  bash status.sh s
  ```

  > - `选择 GitHub / Coding.net`: 保持默认(Github)(1)
  > - `选择监听端口`: 保持默认(35601) 或者自己填个未被使用且已放通的端口
  > - `自动部署`: 保持默认(y)
  > - `输入本机域名或ip`: 没有域名就直接输入本机 ip
  > - `输入 ServerStatus 服务端中网站要设置的 域名/IP 的端口`: 随便输个未被使用且已放通的端口, 这个端口用于访问 Web 页面
  >
  > ![image-20220913174443396](http://cdn.ayusummer233.top/img/202209131744795.png)
  >
  > ![image-20220913174525133](http://cdn.ayusummer233.top/img/202209131745321.png)
  >
  > ![image-20220913174857476](http://cdn.ayusummer233.top/img/202209131748700.png)
  >
  > ![image-20220913174920330](http://cdn.ayusummer233.top/img/202209131749559.png)

- 客户端

  首先在服务端添加一个节点配置, 用于与客户端配置对接

  ```bash
  bash status.sh s
  ```

  - 进入 7-服务端配置
  - 1 - 节点配置
  - 设置节点账密(自定义, 之后客户端通过此项配置进行连接)以及基本信息

> ![image-20220913175404031](http://cdn.ayusummer233.top/img/202209131754161.png)
>
> ![image-20220913175713057](http://cdn.ayusummer233.top/img/202209131757271.png)

在客户端进行相应配置(与服务端刚才设置的节点信息一致即可)

```bash
# 源仓库的 shell(由于有时服务器不一定可以连上 github 所以修改了其中的部分链接便有了下面第二个自己修改的 shell)
# wget https://cokemine.coding.net/p/hotarunet/d/ServerStatus-Hotaru/git/raw/master/status.sh
wget https://cdn.ayusummer233.top/shell/status.sh
bash status.sh c
```

> ![image-20220913175901782](http://cdn.ayusummer233.top/img/202209131759040.png)

---

若客户端为 windows 则需要手动用 Python 跑下

```bash
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py # 若未安装pip
python get-pip.py
# 可以换下源, 不换也行
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/
pip install psutil
# 修改 status-psutil.py(在主仓库的 clients 目录中)
# https://github.com/cokemine/ServerStatus-Hotaru/blob/master/clients/status-psutil.py
# 运行程序, 也可以将这句写成个 bat 文件然后双击运行
python status-psutil.py
```

> cmd 在快速编辑模式下运行命令时, 若用户鼠标点击到窗口区域可能会引起程序阻塞, 可以将其点掉
>
> ![image-20220928100730680](http://cdn.ayusummer233.top/img/202209281007350.png)
>
> > 快速编辑模式是一种很便捷的操作方式：左键选中，右键复制以及右键从剪贴板粘贴内容等  
> > 如果鼠标选中控制台界面上的内容，控制台就被阻塞了  
> > 在 Windows Server 2012 及 Windowns 8 以上，控制台窗口的程序默认是打开“快速编辑模式”的开关的。

---
