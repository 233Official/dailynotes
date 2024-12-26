# Linux SSH

- [Linux SSH](#linux-ssh)
  - [概述](#概述)
  - [VSCode: Remote-SSH](#vscode-remote-ssh)
  - [MobaXterm](#mobaxterm)
  - [WindTerm](#windterm)
  - [Terminus](#terminus)
  - [远程图形化界面的本地显示](#远程图形化界面的本地显示)
    - [一些软件命令行启动的命令](#一些软件命令行启动的命令)
  - [使用 SSH 做端口转发让服务器用本地的 clash 代理](#使用-ssh-做端口转发让服务器用本地的-clash-代理)

---

## 概述

> [如何在 Ubuntu 20.04 启用 SSH-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/763505)
>
> ---

首先需要确认自己的机子是否有 SSH 服务, 如果 SSH 不能连上本机的话那么需要装下 openssh

```bash
# 刚装好系统需要配置下 root 密码, 输入如下命令然后输入当前账户密码后设置 root 密码即可
sudo passwd root

# 更新源
apt update
# 安装 openssh-server
apt install openssh-server
```

安装完成后 SSH 服务会自动启动

```bash
# 验证 SSH 是否在运行
systemctl status ssh
```

> 按 `q` 返回命令行

需要注意的是 ubuntu 自带一个配置 iptables 防火墙的工具 UFW(`Uncomplicated Firewall`), 如果系统防火墙已经启用那么请确保打开了 SSH 端口

```bash
ufw allow ssh
```

到此为止就可以使用普通账户 ssh 登录了, 但是还不能用 root 来 ssh 连接, 还需要再配置下

```bash
# 安装 vim
apt install vim

# 打开 sshd_config 文件
vim /etc/ssh/sshd_config
# 按下 i 切换到编辑模式进行文本编辑
# 编辑完成后 esc 后输入 :wq 并回车即可保存并退出 vim
```

将 `#Authentication` 项目下的 `PermitRootLogin` 设置为 `yes`, `PasswordAuthentication` 项也设置为 `yes`

> 如果后者没有就新建一个

> ![image-20221110002027202](http://cdn.ayusummer233.top/img/202211100020293.png)  
> ![image-20221110002039422](http://cdn.ayusummer233.top/img/202211100020468.png)

```bash
# 重启 ssh 服务
service ssh restart
# 添加开机启动
update-rc.d ssh enable
```

然后就可以使用 root 账户 ssh 该设备了

---

## VSCode: Remote-SSH

VSCode 安装 Remote-SSH

> ![image-20221110003106144](http://cdn.ayusummer233.top/img/202211100031215.png)

打开 Remote-SSH 配置项

> ![image-20221110003320756](http://cdn.ayusummer233.top/img/202211100033780.png)

填入

```properties
Host [为该主机随便起个有辨识度的名字]
    HostName [主机ip]
    User [登入用户, 可以填 root]
```

连接到远程然后根据提示选择 Linux, 输入密码即可

---

在本地打开命令行执行生成密钥命令:

```bash
ssh-keygen -t rsa -C "youremail@example.com"
```

- ``-C(comment) `随便填, 有辨识度就行

根据提示完成密钥生成步骤(可以什么都不输入一路回车到完成)

完成后会生成一个私钥(`id_rsa`)一个公钥(`id_rsa_pub`)

将**本地公钥**复制到远程主机的 `/root/.ssh` 目录下然后在终端中 cd 到该目录执行(如果该目录不存在则先创建此目录)

```bash
cat id_rsa_ubuntu1.pub >> authorized_keys
sudo chmod 600 authorized_keys	# 修改文件权限
sudo chmod 700 ~/.ssh	# 修改目录权限
```

然后打开 remote-ssh 配置文件, 在原来配置项的基础上加上一个 `IdentityFile` 字段, 填写上==本地私钥==路径即可

```properties
Host [为该主机随便起个有辨识度的名字]
    HostName [主机ip]
    User [root]
    IdentityFile "[本地私钥路径]"
```

然后重新连接远程主机, 就不需要输入密码了

> PS：本地私钥也要是 600 的权限，只有所有者有读写权限，否则也会报错 too open；一个典型场景是，win上发给mac的私钥文件落地后权限是 644，连接服务器会报错，此时需要 `chmod 600 [私钥路径]` 来指定权限，之后便可正常使用
>
> ![image-20241226192021867](http://cdn.ayusummer233.top/DailyNotes/202412261920045.png)

---

## MobaXterm

> [【MobaXterm】设置保持 SSH 连接\_hitrjj 的博客-CSDN 博客\_mobaeterm keepalive](https://blog.csdn.net/u014636245/article/details/83855860)

---

## WindTerm

---

## Terminus

---

## 远程图形化界面的本地显示

> [ssh 链接远程服务器 及 远程图形化界面的本地显示 - 掘金 (juejin.cn)](https://juejin.cn/post/7109647016086470669)
>
> [本地显示远程图形化界面、服务器配置图形化界面 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/260189540)
>
> [Installing and running an X Server on Windows — Aalto scientific computing](https://scicomp.aalto.fi/triton/quickstart/installxonwindows/)
>
> ---

编辑 `/etc/ssh/sshd_config`

![image-20221201165743295](http://cdn.ayusummer233.top/img/202212011718395.png)

修改如下三条配置:

```properties
X11Forwarding yes
#X11DisplayOffset 10
X11UseLocalhost no
#PermitTTY yes
PrintMotd no
#PrintLastLog yes
#TCPKeepAlive yes
```

```bash
# 重启 ssh
service ssh reload
# 安装 x11-apps
sudo apt install x11-apps
```

到这里 MobaXterm 就可以在本地显示远程应用的 UI 了

![image-20221201170353587](http://cdn.ayusummer233.top/img/202212011718703.png)

但是 VSCode 没有 DISPLAY 环境变量, 需要在 MobaXterm 里执行下

```bash
env | grep DISPLAY
```

> ![image-20221201170530202](http://cdn.ayusummer233.top/img/202212011718613.png)

对应得将如下配置添加到 `/root/.bashrc` 中:

```properties
export DISPLAY=localhost:11.0
```

![image-20221201170804190](http://cdn.ayusummer233.top/img/202212011718410.png)

> PS: 这个 IDSPLAY 变量的值是会变的, 貌似是每次 MobaXterm SSH 连接设备都会变
>
> ![image-20221202133848680](http://cdn.ayusummer233.top/img/202212021823466.png)
>
> > [xorg - What is the $DISPLAY environment variable? - Ask Ubuntu](https://askubuntu.com/questions/432255/what-is-the-display-environment-variable)
> >
> > [使用 WSL2 + X11 转发 - 在 Windows10 中打造 GNU/Linux 学习生产环境 - Steins;Lab (steinslab.io)](https://steinslab.io/archives/2082#3_X11_Forwarding)
>
> 折腾了一圈最后感觉还是开个 MobaXterm 然后用 VSCode 比较方便

---

### 一些软件命令行启动的命令

```bash
# 火狐浏览器直接在命令行里输入 firefox 并回车会在远程启动默认用户配置的 Firefox 窗口, 并不会在本地启动
firefox
# 如果要在本地启动的话需要用如下配置调起火狐用户配置, 然后新建一个用户配置并启动, 此时在本地就可以看到火狐的窗口了
firefox -profilemanager
```

![image-20221201191455296](http://cdn.ayusummer233.top/img/202212021823418.png)

> 不过远程启动火狐后使用体验不是很好, 比较卡, 找到的一篇相关文章也并没有复现成功, 于是就继续远程 windows 用浏览器了
>
> [为什么 Firefox 在 SSH 上这么慢？ - rebeca8 - 博客园 (cnblogs.com)](https://www.cnblogs.com/zafu/p/9392498.html)
>
> ---
>
> 从个人实际需求出发之后发现了一个比较好的替代方案
>
> 因为个人希望打开远程浏览器主要是为了访问局域网里的靶场, 然后通过 burp 拦截请求
>
> 那么可以用 VSCode 的端口转发功能, 将 BurpSuit 代理的端口(比如 8080) 转发到本机, 然后在本机的 firefox 设置 localhost 8080 代理, 之后就可以在本机 firefox 中访问局域网靶场以及使用 burp 拦截请求了
>
> > PS: 单独设置 VSCode 的端口转发以及 FireFox 的代理并不能使 Firefox 访问局域网站点, 需要用 burp 也代理相同端口才能正常访问局域网站点
>
> ![image-20221202183951903](http://cdn.ayusummer233.top/img/202212021839812.png)
>
> ![image-20221202184032013](http://cdn.ayusummer233.top/img/202212021907976.png)
>
> ![image-20221202184101762](http://cdn.ayusummer233.top/img/202212021907666.png)
>
> ![image-20221202190638055](http://cdn.ayusummer233.top/img/202212021908693.png)
>
> ![image-20221202190726334](http://cdn.ayusummer233.top/img/202212021908052.png)

---

```bash
java -jar [burpsuitxxx.jar绝对路径]
```

> ![image-20221202093238590](http://cdn.ayusummer233.top/img/202212021823179.png)
>
> 就是分辨率有点奇怪, 可以在 `~/.bashrc` 加上 `GDK_SCALE` 参数来放大 [GDK_SCALE] 倍(只能是整数倍)
>
> ```bash
> export GDK_SCALE=2
> export GDK_DPI_SCALE=1
> ```

---

## 使用 SSH 做端口转发让服务器用本地的 clash 代理

首先在本地将 Clash 的 `Allow Lan` 打开

使用 SSH 创建端口转发

```bash
ssh -fNR 7890:localhost:7890 -i [ssh私钥绝对路径] [用户名]@[服务器IP]
```

- `-f` 后台运行
- `-N` 不执行远程命令, 仅做端口转发
- `-R` 远程端口转发

如此一来就可以在服务器上使用本地的 Clash 代理了

- `http代理`: `http://localhost:7890`
- `socks5代理`: `socks5://localhost:7890`


---
