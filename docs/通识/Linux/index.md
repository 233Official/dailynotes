---

---

# Linux

- [Linux](#linux)
  - [Ubuntu 的 source.list 文件](#ubuntu-的-sourcelist-文件)
    - [换源](#换源)
  - [根目录各目录含义](#根目录各目录含义)
  - [文件操作](#文件操作)
    - [计算文件占用空间](#计算文件占用空间)
    - [查找文件](#查找文件)
    - [计算目录下的文件数量](#计算目录下的文件数量)
  - [压缩与解压](#压缩与解压)
    - [zip](#zip)
    - [gz](#gz)
    - [tar.gz](#targz)
    - [7z](#7z)
  - [使用 root 登入 UI](#使用-root-登入-ui)
  - [软硬链接](#软硬链接)
  - [常见问题](#常见问题)
    - [the root filesystem require a manual fsck](#the-root-filesystem-require-a-manual-fsck)
    - [E: dpkg was interrupted, you must manually run 'dpkg --configure -a' to correct the problem.](#e-dpkg-was-interrupted-you-must-manually-run-dpkg---configure--a-to-correct-the-problem)
    - [E: Sub-process /usr/bin/dpkg returned an error code (1)](#e-sub-process-usrbindpkg-returned-an-error-code-1)
  - [game](#game)
    - [手游相关](#手游相关)

---

## Ubuntu 的 source.list 文件

> [Ubuntu | 对 sources.list 的总结 - 简书 (jianshu.com)](https://www.jianshu.com/p/5400722c369c)
>
> [详解 Ubuntu 的 source.list 文件\_VinQin 的博客-CSDN 博客\_sourcelist](https://blog.csdn.net/u012843189/article/details/80964287)

### 换源

> [vim - Ubuntu 20.04 Desktop 换源的两种方法\_个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000040946515)

换网易源:

打开 `/etc/apt/sources.list` 在文件首部加上如下配置

```
# 镜像
deb http://mirrors.163.com/ubuntu/ focal main restricted
deb http://mirrors.163.com/ubuntu/ focal universe
deb http://mirrors.163.com/ubuntu/ focal multiverse
deb http://mirrors.163.com/ubuntu/ focal-updates main restricted
deb http://mirrors.163.com/ubuntu/ focal-updates universe
deb http://mirrors.163.com/ubuntu/ focal-updates multiverse
deb http://mirrors.163.com/ubuntu/ focal-backports main restricted universe multiverse
```

然后注释掉相应后缀的源本的官方源之后更新下索引即可

```bash
apt update
```

---


## 根目录各目录含义

![image-20230920150853543](http://cdn.ayusummer233.top/DailyNotes/202309201508290.png)

- **/bin**：二进制文件的存储位置。包含了系统启动和修复所需的基本命令，如ls、cp、mv等。
- **/boot**：包含启动Ubuntu Linux所需的内核文件和引导加载程序配置文件。
- **/dev**：设备文件目录。包含系统用于与硬件设备进行通信的特殊文件，如磁盘分区、USB设备、键盘等。
- **/etc**：配置文件的存储位置。包含系统和应用程序的配置文件，用于管理系统和应用程序的设置。
- **/home**：用户的主目录。每个用户通常都有一个子目录，用于存储其个人文件和设置。
- **/lib**：共享库文件的存储位置, 存放着系统最基本的动态链接共享库，类似于 Windows 里的 DLL 文件。几乎所有的应用程序都需要用到这些共享库,包含了用于系统启动和运行的共享库。
- **/media**：可移动媒体设备的挂载点。当插入USB闪存驱动器或CD/DVD时，这些设备通常会在此处挂载。
- **/mnt**：手动挂载其他文件系统的临时挂载点。
- **/opt**：可选软件包的安装位置。某些第三方软件可能安装在此处。
- **/proc**：虚拟文件系统，用于访问有关系统进程和内核状态的信息。
- **/root**：超级用户(root) 的主目录。
- **/run**：在系统启动期间创建的临时运行时文件的存储位置。
- **/sbin**：系统命令的存储位置。包含只能由超级用户执行的系统命令。
- **/srv**：服务数据的存储位置。用于存储系统提供的一些服务的数据。
- **/sys**：用于与Linux内核进行交互的虚拟文件系统。
- **/tmp**：临时文件的存储位置。通常用于存储临时数据，文件在重启后会被清除。
- **/usr**：用户数据的次要存储位置。包含系统的大多数用户级程序和文件，包括可执行文件、库文件、头文件等。
- **/var**：可变数据的存储位置。包括日志文件、数据库文件、邮件和其他可变数据。


---


## 文件操作


---

### 计算文件占用空间

```bash
# 计算当前目录及其子目录占用的空间(mb)
du -hsm .
```

- `du` 是一个用于统计目录或文件的磁盘使用情况的命令，它的全称是 disk usage。
- `-h` 是一个选项，它表示以人类可读的格式显示大小，例如 1K，234M，2G 等。
- `-s` 是一个选项，它表示只显示总和，而不显示每个子目录或文件的大小。
- `-m` 是一个选项，它表示以兆字节(MB) 为单位显示大小。
- `.` 是一个参数，它表示当前目录。

---


---

### 查找文件

- 使用 locate

  > [Difference between locate and mlocate - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/273182/difference-between-locate-and-mlocate)
  >
  > ***

  ```bash
  # 注意是 mlocate 而非 locate, 二者是不一样的
  apt install mlocate
  # 更新数据库
  time updatedb
  # 使用 mlocate 搜索文件(注意这里命令就是 locate 而非 mlocate)
  locate [文件名]
  ```

---

`使用 find` 命令

比如查找 success 文件

```bash
find / -name "success"
```

---

### 计算目录下的文件数量

查看当前目录下有多少文件

```bash
ls -l /path/to/directory | grep ^- | wc -l
```

- `ls -l` 列出指定目录中的所有文件和子目录的详细信息
- `grep ^-` 过滤出所有以`-`开头的行，这些行代表普通文件
- `wc -l` 统计行数，即文件的数量

---

查看当前目录及其子目录中有多少文件

```bash
find /path/to/directory -type f | wc -l
```


---

## 压缩与解压

### zip

```bash
# 解压 zip 文件
unzip [option] [压缩包名]
```

|   option    |                                             含义                                             |
| :---------: | :------------------------------------------------------------------------------------------: |
|  -d 目录名  |                                 将压缩文件解压到指定目录下。                                 |
|     -n      |                                解压时并不覆盖已经存在的文件。                                |
|     -o      |                         解压时覆盖已经存在的文件，并且无需用户确认。                         |
|     -v      | 查看压缩文件的详细信息，包括压缩文件中包含的文件大小、文件名以及压缩比等，但并不做解压操作。 |
|     -t      |                              测试压缩文件有无损坏，但并不解压。                              |
| -x 文件列表 |                           解压文件，但不包含文件列表中指定的文件。                           |

---

### gz

`.gz` 文件是使用 `gzip`(GNU zip) 压缩程序压缩的文件。

```bash
# 解压为 filename 并删除原始压缩文件, -d 可选
gunzip filename.gz
gzip -d filename.gz
# 使用  -k(keep) 以保留原始文件
gunzip -k filename.gz
# 查看压缩文件内容而不解压
zcat filename.gz
```

---

### tar.gz

`.tar.gz` 文件是一种在 Unix 和 Linux 系统中常见的压缩文件格式，它实际上结合了两种不同的技术：`tar` 和 `gzip`。

- **Tar(磁带归档) **：
  - `tar` 是一个用于打包多个文件和目录到单个文件(即归档文件) 的工具。这个过程不涉及压缩，仅仅是将多个文件合并成一个大文件，以便于管理和传输。
  - 由 `tar` 创建的文件通常有 `.tar` 扩展名。
- **Gzip(GNU zip) **：
  - `gzip` 是一个广泛使用的数据压缩程序，它使用 DEFLATE 压缩算法来减小文件大小。
  - `gzip` 通常用于压缩单个文件。压缩后的文件具有 `.gz` 扩展名。
- **结合 Tar 和 Gzip**：
  - 当需要压缩整个目录或多个文件时，首先使用 `tar` 将它们打包成一个 `.tar` 文件，然后使用 `gzip` 压缩这个 `.tar` 文件，生成 `.tar.gz` 或 `.tgz` 文件。
  - 这样做的好处是可以同时实现多个文件的打包和压缩，非常适用于备份、软件分发、日志文件的存储等场景。

```bash
# 创建 .tar.gz 文件
tar -czvf archive.tar.gz /path/to/directory
# 解压 .tar.gz 文件
tar -xzvf archive.tar.gz
```

- `c`: 创建归档文件
- `x`: 解压归档文件
- `z`: 使用 gzip 压缩/解压缩
- `v`: 显示详细信息
- `f`: 指定归档文件名


----

### 7z

如果没安装 `p7zip-full` 的话可以使用如下命令安装

```bash
sudo apt update
sudo apt install p7zip-full
```

---

压缩 `.7z` 文件

```bash
7z a [目标文件路径.7z] [待压缩目录路径]
# 例如:
7z a /home/user/destination/source_dir.7z /home/user/source_dir
```

---

解压 .7z 文件：

```bash
7z x file.7z
```

- `x`: 用于保持原目录结构的方式解压文件。

如果只想查看压缩包中的内容而不解压，可以使用以下命令：

```bash
7z l file.7z
```


---


---

## 使用 root 登入 UI

> [ubuntu20.04 使用 root 用户登录系统\_COCO56(徐可可) 的博客-CSDN 博客\_ubuntu 使用 root 登录](https://blog.csdn.net/COCO56/article/details/107628019)
>
> ---

> 不建议使用特权用户登入系统(一键扬掉系统.jpg)
>
> > [为什么 sudo 存在？为什么不将特权系统访问作为用户权限处理？ | 码农俱乐部 - Golang 中国 - Go 语言中文社区 (mlog.club)](https://mlog.club/article/4094413)
>
> ---

首先设置好 root 密码, 然后改几个文件

- `/usr/share/lightdm/lightdm.conf.d/50-ubuntu.conf`

  在末尾加上

  ```properties
  # 手工输入登录系统的用户名和密码
  greeter-show-manual-login=true
  ```

- `/etc/pam.d/gdm-autologin`

  使用 # 注释第三行的限制 root 登录:

  ```properties
  # auth	required	pam_succeed_if.so user != root quiet_success
  ```

- `/etc/pam.d/gdm-password`

  使用 # 注释第 3 行限制 root 登录的配置项:

  ```properties
  # auth	required	pam_succeed_if.so user != root quiet_success
  ```

- `/root/.profile`

  使用 # 注释掉最后一行然后添加一行

  ```properties
  # mesg n 2> /dev/null || true
  tty -s&&mesg n || true
  ```

- 重启设备然后即可使用 root 账户登入 UI 界面

  ```bash
  reboot
  ```

  > 然后就会看到不推荐使用特权用户登入系统

---

## 软硬链接

> [软连接和硬链接区别 - matengfei - 博客园 (cnblogs.com)](https://www.cnblogs.com/matengfei123/p/12824422.html)
>
> [A mental model for Linux file, hard and soft links](https://bhoot.dev/2024/on-linux-file-and-links/)

---

## 清理空间

建议直接用 baobab

```bash
# 安装
apt update
apt install baobab -y
# 启动
baobab
```

![image-20241122171717733](http://cdn.ayusummer233.top/DailyNotes/202411221717940.png)



---

命令行方式可以参考如下命令:

```bash
# 删除无用的包和缓存
## 删除未使用的依赖包
sudo apt autoremove
## 清理APT缓存(APT缓存存储在/var/cache/apt/archives中)
sudo apt clean
### 清理无用的缓存包，即系统中已经无法安装的旧版本包（通常是被更新替代的包），而保留当前仍可用的缓存包
sudo apt autoclean
```

```bash
# 检查并清理日志文件
## 查看日志占用情况
sudo du -sh /var/log/*
## 清理旧日志文件
sudo journalctl --vacuum-size=100M
### 以上命令将日志文件限制为100MB。如果需要清理超过一定天数的日志：
sudo journalctl --vacuum-time=7d
```

```bash
# 清理垃圾文件
## 清理用户的回收站
rm -rf ~/.local/share/Trash/*
## 清理临时文件
sudo rm -rf /tmp/*
```

```bash
# 查找和删除大文件
## 使用du命令查看目录大小：
sudo du -h --max-depth=1 /
## 或者使用find查找超过一定大小的文件：
sudo find / -type f -size +1G
```

![image-20241122160030558](http://cdn.ayusummer233.top/DailyNotes/202411221600727.png)





---

## 常见问题

### the root filesystem require a manual fsck

> [boot - Root file system requires manual fsck - Ask Ubuntu](https://askubuntu.com/questions/885062/root-file-system-requires-manual-fsck)

![image-20220810092901637](http://cdn.ayusummer233.top/img/202208100929766.png)

```bash
fask -tf /dev/mapper/ubuntu--vg-root
exit
```

> [Linux fsck 命令 command not found fsck 未找到命令 fsck 命令详解 fsck 命令未找到 fsck 命令安装 - CommandNotFound ⚡️ 坑否](https://commandnotfound.cn/linux/1/451/fsck-命令)
>
> - `-y`: 确认所有的 yes/no 选项
> - `-f`: (force) 尽管目录被标记为 clean 也强制检查

---

### E: dpkg was interrupted, you must manually run 'dpkg --configure -a' to correct the problem.

执行 `dpkg --configure -a` 以修复

若执行后出现

```bash
dpkg: error: parsing file '/var/lib/dpkg/updates/0000' near line 0:
 newline in field name '▒v▒▒'
```

则

```bash
sudo rm /var/lib/dpkg/updates/*
```

即可

---

### E: Sub-process /usr/bin/dpkg returned an error code (1)

![image-20220825102350086](http://cdn.ayusummer233.top/img/202208251023257.png)

> [E: Sub-process /usr/bin/dpkg returned an error code (1)解决办法\_Mr.Stick 的博客-CSDN 博客](https://blog.csdn.net/stickmangod/article/details/85316142)

---

## game

### 手游相关

> [搭建 Reroid](https://b.hui.ke/posts/build-redroid/)  
> [remote-android/redroid-doc](https://github.com/remote-android/redroid-doc)

---
