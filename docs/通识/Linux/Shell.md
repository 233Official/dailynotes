---

---

# Linux Shell

- [Linux Shell](#linux-shell)
  - [概述](#概述)
  - [获取系统信息](#获取系统信息)
  - [类清屏](#类清屏)
  - [历史记录](#历史记录)
  - [修改时区和时间](#修改时区和时间)
  - [用户管理](#用户管理)
  - [echo](#echo)
  - [防火墙相关](#防火墙相关)
  - [网络相关](#网络相关)
    - [ss(socket statistics)](#sssocket-statistics)
  - [进程相关](#进程相关)
    - [ps(Process Status)](#psprocess-status)
  - [systemctl](#systemctl)
  - [Cron 表达式](#cron-表达式)
    - [各字段含义](#各字段含义)
    - [常用 Cron 表达式](#常用-cron-表达式)
  - [排查服务是怎么起的](#排查服务是怎么起的)
    - [已知端口](#已知端口)

---

## 概述

> [Bash 编程入门-1：Shell 与 Bash - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/56532223)

shell 是运行在终端中的文本互动程序，bash(GNU Bourne-Again Shell) 是最常用的一种 shell。是当前大多数 Linux 发行版的默认 Shell。

其他的 shell 还有：sh、bash、ksh、rsh、csh 等。Ubuntu 系统常用的是 bash，Bio-linux 系统是基于 ubuntu 定制的，但是却使用了 zsh。

sh 的全名是 Bourne Shell。名字中的玻恩就是这个 Shell 的作者。

而 bash 的全名是 Bourne Again Shell。最开始在 Unix 系统中流行的是 sh，而 bash 作为 sh 的改进版本，提供了更加丰富的功能。一般来说，都推荐使用 bash 作为默认的 Shell。

查看当前系统中 shell 的类型:

```shell
echo $SHELL
```

![20211219065045](http://cdn.ayusummer233.top/img/20211219065045.png)

---

## 获取系统信息

`uname` 命令可用于显示系统信息

- `-a`：显示所有信息
- `-s`：显示内核名称
- `-n`：显示网络节点主机名
- `-v`：显示内核版本
- `-m`：显示机器硬件名称
- `-p`：显示处理器类型
- `-i`：显示硬件平台
- `-r`: 显示内核版本号

---

## 类清屏

```bash
# 清屏
clear
# 指针移到行尾
Ctrl+L
```

---

## 历史记录

> [谁动了我的 Linux？原来 history 可以这么强大！ - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/371739269)

使用 history 命令可以查看当前用户执行的历史命令

```bash
history
```

![image-20230725143721312](http://cdn.ayusummer233.top/DailyNotes/202307251437125.png)

此外, 每个用户根目录下还都有一个 `.bash_history` 文件, 也存储了 bash 历史记录:

![image-20230725144046356](http://cdn.ayusummer233.top/DailyNotes/202307251500784.png)

不过这样看到的历史命令没有时间的, 需要时间的话还需要

```bash
export HISTTIMEFORMAT="%Y-%m-%d %T"
```

或者写到 `/root/.bashrc` 中然后 `source /root/.bashrc`

```bash
# 先写个空字符加换行进去
echo '' >> /root/.bashrc
echo 'export HISTTIMEFORMAT="%Y-%m-%d %T"' >> /root/.bashrc
source /root/.bashrc
```

这样再 history 就能看到带时间的日志了, 不过稍早一些的日志已经无可考证时间了, 毕竟当时执行的时候没保存时间戳

![image-20230725150042919](http://cdn.ayusummer233.top/DailyNotes/202307251500923.png)

此外 `.bash_history` 并非实时操作的, 正常退出 shell (`Ctrl+D`, `exit`)时, shell 进程会把历史记录缓冲区的内容写到 `.bash_history` 中

---

## 修改时区和时间

```bash
# 修改时区
apt update
apt install -y tzdata
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
dpkg-reconfigure -f noninteractive tzdata
```

![image-20240925235331225](http://cdn.ayusummer233.top/DailyNotes/202409252353297.png)

---

```bash
# 修改日期
sudo date +%Y%m%d -s "20240119"
# 修改时间
sudo date +%T -s "11:20:00"
# 修改日期时间
sudo date +%Y%m%d%H%M.%S -s "202401191120.00"
```

![image-20240119112242251](http://cdn.ayusummer233.top/DailyNotes/202401191124984.png)

---

## 用户管理

```bash
# 查看当前登录用户
who
# 查看最近登录的用户
last
# 查看所用用户
cat /etc/passwd
```

- 新建用户

  ```bash
  sudo adduser newusername
  ```

---

## echo

> [How to use Echo Command in Linux (With Examples) (phoenixnap.com)](https://phoenixnap.com/kb/echo-command-linux)

```bash
# 帮助文档
/bin/echo --help
```

```bash
# 语法
echo [option] [string]
```

---

## 防火墙相关

> [Debian/Ubuntu/Centos 防火墙放行指定端口 - SunPma'Blog](https://sunpma.com/555.html)
>
> [ubuntu 的 ufw 如何开放特定端口?\_justheretobe 的博客-CSDN 博客\_ufw 开放端口](https://blog.csdn.net/justheretobe/article/details/51843178)

---

## 网络相关

### ss(socket statistics)

`ss` 是用来查看网络连接和套接字信息的工具，比老的 netstat 更快、更现代。

```bash
ss -h
```

![image-20260211140128984](http://cdn.ayusummer233.top/DailyNotes/202602111401502.png)

常用参数：

- 连接/套接字类型
  - `-t`：TCP
  - `-u`：UDP
  - `-w`：RAW
  - `-x`：UNIX domain sockets
  - `-a`：全部（包含 `LISTEN` / 非 `LISTEN`）
  - `-l`：只看监听（LISTEN）
- 显示内容
  - `-n`：不做 DNS/服务名解析（更快，输出纯数字 IP/端口）
  - `-p`：显示关联进程（需要权限时用 `sudo`）
  - `-e`：扩展信息（如 uid、inode 等）
  - `-i`：更详细的 TCP 内部信息（cwnd、rtt 等，排障常用）
  - `-o`：显示定时器信息
  - `-m`：显示 socket 内存信息（skmem）
  - `-s`：汇总统计（各类连接数等）
- 协议族/输出格式
  - `-4` / `-6`：仅 IPv4 / 仅 IPv6
  - `-H`：不输出表头（便于脚本处理）
- 状态过滤（最常用的“查询条件”）
  - `state LISTEN` / `state ESTABLISHED` / `state TIME-WAIT` 等（状态名可用 `ss -h`/`man ss` 查全）

常用组合示例：

```bash
# 1) 查看监听端口（TCP），并显示进程, 可以用于溯源端口进程
ss -lntp
```

![image-20260211140837199](http://cdn.ayusummer233.top/DailyNotes/202602111408497.png)

- `-l`：只显示监听（LISTEN）的 socket
- `-n`：用数字显示地址/端口（不做解析）
- `-t`：只看 TCP
- `-p`：显示占用该端口的进程（程序名/PID/FD 等，可能需要 sudo 才完整）

---

```bash
# 2) 查看所有 TCP 连接（不解析），并关注状态
ss -ant
ss -ant state established
ss -ant state time-wait
```

![image-20260211144026146](http://cdn.ayusummer233.top/DailyNotes/202602111440512.png)

![image-20260211144308550](http://cdn.ayusummer233.top/DailyNotes/202602111443833.png)

- `-a`：全部（包含 `LISTEN` / 非 `LISTEN`）
- `-n`：不做 DNS/服务名解析（更快，输出纯数字 IP/端口）
- `-t`：只看 TCP

---

```bash
# 3) 按端口过滤（dport=目标端口，sport=源端口）
ss -ant '( dport = :443 or sport = :443 )'
ss -lntp 'sport = :22'
```

![image-20260211144601926](http://cdn.ayusummer233.top/DailyNotes/202602111446349.png)

常用过滤表达式（写在最后一个参数里，建议用引号包起来）：

- `src <ip>` / `dst <ip>`：按源/目的 IP
- `sport = :<port>` / `dport = :<port>`：按源/目的端口
- `net <cidr>`：按网段，如 `net 10.0.0.0/8`
- 支持 `and` / `or` / `not` 与括号组合：`( ... )`

---

```bash
# 4) 查看 UDP（常用看 DNS/QUIC 等）
ss -uanp
```

![image-20260211144723166](http://cdn.ayusummer233.top/DailyNotes/202602111447390.png)

- `-u`：UDP
- `-a`：全部（包含 `LISTEN` / 非 `LISTEN`）
- `-n`：不做 DNS/服务名解析（更快，输出纯数字 IP/端口）
- `-p`：显示占用该端口的进程（程序名/PID/FD 等，可能需要 sudo 才完整）

---

## 进程相关

### ps(Process Status)

`ps` (Process Status) 是 Linux/Unix 系统中用于报告当前进程快照的标准工具。

```bash
ps --help
```

![image-20260211150322427](http://cdn.ayusummer233.top/DailyNotes/202602111503664.png)

> `ps` 的参数风格有几种（历史原因），一般会同时看到：
>
> - UNIX 风格：`ps -ef`、`ps -e -o ...`
> - BSD 风格：`ps aux`
> - GNU 长参数：`ps --sort=-%cpu -eo ...`

常用参数梳理：

- 选择进程（选哪些行）
  - `-e`：所有进程（all processes）
  - `-A`：同 `-e`
  - `-p <pid>`：按 PID 选择（可逗号分隔，如 `-p 1,1234`）
  - `-C <comm>`：按命令名选择（如 `-C nginx`）
- 输出格式（输出哪些列）
  - `-f`：full-format（更详细的默认列）
  - `-o <format>`：自定义列（最常用），如 `-o pid,ppid,user,%cpu,%mem,etime,cmd`
  - `-F`：extra full format（不同发行版可能略有差异）
- 排序/头部（GNU/procps 常见）
  - `--sort <key>`：排序（如 `--sort=-%cpu`、`--sort=etime`）
  - `--no-headers`：不输出表头（便于脚本处理）

常用组合示例：

```bash
# 1) 看所有进程（两种常见写法）
ps -ef
ps aux

# 1.1) 以树形展示（父子关系）
ps -ef --forest

# 2) 按 PID 查看，并自定义列（排障最常用）
ps -p 1 -o pid,ppid,user,stat,lstart,etime,cmd

# 3) 找某个服务/进程（比 grep 更稳：不会把 grep 自己匹配进去）
ps -C nginx -o pid,ppid,%cpu,%mem,etime,cmd

# 4) 按 CPU/内存排序，取前 10 个
ps -eo pid,user,%cpu,%mem,etime,cmd --sort=-%cpu | head
ps -eo pid,user,%cpu,%mem,etime,cmd --sort=-%mem | head

# 5) 快速看父子关系（更直观通常用 pstree -ap）
ps -eo pid,ppid,cmd --sort=ppid
```

![image-20260211150736199](http://cdn.ayusummer233.top/DailyNotes/202602111507442.png)

常用输出字段速查（`-o` 常用）：

- `pid` / `ppid`：进程 ID / 父进程 ID
- `user`：所属用户
- `%cpu` / `%mem`：CPU/内存占用比例（采样口径依实现而异，用来相对比较更靠谱）
- `vsz` / `rss`：虚拟内存 / 常驻内存（KB）
- `lstart`：进程启动的完整时间
- `etime`：运行时长（elapsed time）
- `cmd`：完整命令（含参数）
- `comm`：命令名（不含参数）
- `stat`：进程状态（常见：`R` 运行、`S` 可中断睡眠、`D` 不可中断睡眠、`T` 停止/跟踪、`Z` 僵尸；后缀如 `+` 表示前台进程组）

---

## systemctl

在 Linux 中，`systemctl` 是管理 `systemd`（绝大多数现代 Linux 发行版的初始化系统）的核心工具。

常用入口：

```bash
systemctl --help
man systemctl
man systemd.unit
```

要看懂命令输出需要了解如下基本概念：

- unit：systemd 管理的对象统称（服务/套接字/定时器/挂载点等）
  - `*.service`：服务
  - `*.socket`：socket 激活
  - `*.timer`：定时器（类似 cron，但更系统化）
  - `*.target`：目标（类似“运行级别”）
- system / user 两套实例
  - 默认操作系统级（system）服务
  - `--user`：操作当前用户的 systemd（常见于桌面环境/用户守护进程）

---

常用命令梳理（按使用频率）：

- 看状态/排障（最常用）
  - `systemctl status <unit>`：查看状态（含最近日志摘要）
  - `systemctl is-active <unit>`：是否正在运行（脚本友好，返回码有意义）
  - `systemctl is-enabled <unit>`：是否开机自启
  - `systemctl show <unit> -p <key>`：查看某个属性（如 `MainPID`、`ExecStart`）
  - `systemctl cat <unit>`：查看生效的 unit 文件内容（含 drop-in）
- 启停与重载
  - `systemctl start <unit>` / `stop <unit>`：启动/停止
  - `systemctl restart <unit>`：重启
  - `systemctl reload <unit>`：通知服务 reload（前提是 unit 支持）
  - `systemctl try-restart <unit>`：仅当已运行时才重启
- 开机自启/禁用
  - `systemctl enable <unit>` / `disable <unit>`：启用/禁用自启（通常是创建/删除软链）
  - `systemctl mask <unit>` / `unmask <unit>`：更强的禁止（防止被依赖拉起）
- 列表/搜索
  - `systemctl list-units --type=service --all`：列出（已加载的）服务 unit
  - `systemctl list-unit-files --type=service`：列出（已安装的）unit 文件及 enable 状态
- unit 文件变更后
  - `systemctl daemon-reload`：重新加载 unit 定义（改了 unit 文件必做）
  - `systemctl restart <unit>`：让变更生效（对 running 的服务）

常用组合示例：

```bash
# 1) 查看服务状态（服务名通常省略 .service 也可以）
systemctl status nginx

# 2) 启动/停止/重启/重载
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx

# 3) 设置开机自启，并立即启动
sudo systemctl enable --now nginx

# 4) 取消开机自启，并立即停止
sudo systemctl disable --now nginx

# 5) 列出失败的服务（排障入口）
systemctl --failed

# 6) 看 unit 的关键信息（脚本友好）
systemctl show nginx -p MainPID -p ActiveState -p SubState -p ExecStart
```

- `systemctl show`：输出 unit 的“属性”（key=value），适合脚本与精确定位问题

  ```bash
  # 看全部属性（输出很长）
  systemctl show nginx

  # 只看关心的属性（推荐）
  systemctl show nginx -p FragmentPath -p DropInPaths -p UnitFileState
  systemctl show nginx -p MainPID -p ExecMainPID -p ExecMainStatus
  systemctl show nginx -p ActiveState -p SubState -p Result

  # 只输出 value（便于脚本）
  systemctl show nginx -p MainPID --value
  ```

- `systemctl cat`：输出“生效的 unit 文件内容”（包含 drop-in 覆盖），比直接 `cat /lib/systemd/system/*.service` 更接近真实配置

  ```bash
  systemctl cat nginx
  systemctl cat nginx.service
  ```

unit 文件位置与覆盖：

- 发行版自带/包管理安装：`/lib/systemd/system/`（有的发行版是 `/usr/lib/systemd/system/`）
- 管理员自定义：`/etc/systemd/system/`（优先级更高）
- drop-in 覆盖目录：`/etc/systemd/system/<unit>.d/*.conf`

常用覆盖/改配置姿势：

```bash
# 打开一个 drop-in 覆盖文件（推荐做法，不直接改 /lib/...）
sudo systemctl edit nginx

# 如果你确实想“完整覆盖”原 unit 文件（一般不推荐）
sudo systemctl edit --full nginx

# 修改后
sudo systemctl daemon-reload
sudo systemctl restart nginx
```

日志查看常和 `journalctl` 配合：

```bash
journalctl -u nginx -e
journalctl -u nginx -f
```

---

## Cron 表达式

> [cron 表达式详解 - 腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1674682)

Cron 是类 Unix 操作系统中一个基于时间的工作调度器, Cron 表达式使用字符串标识, 定义了一个 Cron 工作的运行时间, 由 6 个或 7 个字段组成, 各字段按照先后顺序分别标识 `分钟  小时  月份中的天(1-31)  月份  星期几 年份(可选)`

例如如下表达式表示在每天 `0:00` 运行任务: `0 0 * * *`

---

### 各字段含义

|       字段       |                允许值                 |  允许的特殊字符   |
| :--------------: | :-----------------------------------: | :---------------: |
|   秒(Seconds)    |              0~59 的整数              |     `, - * /`     |
|   分(Minutes)    |              0~59 的整数              |     `, - * /`     |
|   小时(Hours)    |              0~23 的整数              |     `, - * /`     |
| 日期(DayofMonth) | 1~31 的整数(但是你需要考虑你月的天数) | `,- * ? / L W C`  |
|   月份(Month)    |        1~12 的整数或者 JAN-DEC        |     `, - * /`     |
| 星期(DayofWeek)  |    1~7 的整数或者 SUN-SAT (1=SUN)     | `, - * ? / L C #` |
|  年(可选)(Year)  |               1970~2099               |     `, - * /`     |

> 由于调度作业通常不需要秒字段, 因此很多情况下 5 个字段的 cron 表达式就足够表示需要的时间了, 当一个 cron 表达式只有 5 个字段时, 其等效于秒字段为 0 其他字段与其相同的 cron 表达式

- `:` 匹配任意值, 即在每个当前域的每个时间单位都触发一次, 比如用在 `分` 内则表示每分钟触发一次

- `?` 只能用在 `日期(DayofMonth)` 和 `星期(DayofWeek)` 两个域, 含义与 `*` 相似但不同, 比如

- `-` 表示范围, 如 `时` 字段为 `9-17` 表示 `[9时, 17时]`

- `/` 表示起始时间每隔固定时间触发一次, 比如 `时` 字段为 `9-17/2` 表示 `[9时, 17时]` 间每 2h 触发一次

- `,` 表示枚举, 比如 `时` 字段为 `9,17` 表示在 9 时与 17 时分别触发一次

- `L` 表示最后, 只能用在 `日期(DayofMonth)` 和 `星期(DayofWeek)` 两个域; 如果在 DayofWeek 域使用 5L,意味着在最后的一个星期四触发。

- `W` 表示有效工作日(周一到周五),只能出现在 DayofMonth 域，系统将在离指定日期的最近的有效工作日触发事件。例如：在 DayofMonth 使用 5W

  - 如果 5 日是星期六，则将在最近的工作日：星期五，即 4 日触发。
  - 如果 5 日是星期天，则在 6 日(周一)触发；
  - 如果 5 日在星期一到星期五中的一天，则就在 5 日触发

  > - W 的最近寻找不会跨过月份
  > - LW 这两个字符可以连用，表示在某个月最后一个工作日，即最后一个星期五。

- `#` 用于确定每个月第几个星期几，只能出现在 DayofWeek 域。例如在 4#2，表示某月的第二个星期三

---

### 常用 Cron 表达式

|                   含义                   |    Cron 表达式     |
| :--------------------------------------: | :----------------: |
|            周一到周五九点触发            |   `0 9 * * 1-5`    |
| 每个工作日的 9-19 点之间的每两个小时触发 | `0 9-19/2 * * 1-5` |
|                                          |                    |

---

## 排查服务是怎么起的

> [Why is this running? / github.com/pranshuparmar/witr](https://github.com/pranshuparmar/witr)

---

### 已知端口

先用 `ss` 查端口对应服务 PID， 然后查 PID 对应进程及其 PPID 捋到根进程, 例如：

```bash
ss -lntp | grep ':8080\b'
```

- `-l`：只显示监听（LISTEN）的 socket

- `-n`：用数字显示地址/端口（不做解析）

- `-t`：只看 TCP

- `-p`：显示占用该端口的进程（程序名/PID/FD 等，可能需要 sudo 才完整）

- `| grep ':8080\b'`

  - 管道把 ss 输出交给 grep 过滤

  - `\b` 是一个**正则边界符**。它的作用是确保匹配到此为止。

    > 在正则表达式中，单词字符（Word Characters）通常指：
    >
    > - **字母** (`a-z`, `A-Z`)
    > - **数字** (`0-9`)
    > - **下划线** (`_`)
    >
    > 除此之外的所有字符（空格、标点符号、换行符、冒号、甚至是特殊符号）都被视为“非单词字符”。
    >
    > `\b` 就像是一个哨兵，它守在两个字符的中间。只有当一侧是“数字/字母”，另一侧是“空格/标点/开头/结尾”时，它才允许匹配。


```bash
pid=<上一步看到的PID>
ps -o pid,ppid,user,stime,etime,cmd -p "$pid"
tr '\0' ' ' < /proc/"$pid"/cmdline; echo
```

`ps` `-o` 参数允许你**自定义输出列**。只有你指定的字段会被显示：

| **字段**    | **全称**          | **含义**                                                     |
| ----------- | ----------------- | ------------------------------------------------------------ |
| **`pid`**   | Process ID        | **进程 ID**：进程的唯一数字标识。                            |
| **`ppid`**  | Parent Process ID | **父进程 ID**：启动该进程的进程 ID。                         |
| **`user`**  | User Name         | **运行用户**：拥有该进程的用户名称。                         |
| **`stime`** | Start Time        | **启动时间**：进程开始运行的具体时刻（如 `14:30`）。         |
| **`etime`** | Elapsed Time      | **持续时间**：进程自启动以来运行的总时长，格式通常为 `[[DD-]hh:]mm:ss`。 |
| **`cmd`**   | Command           | **命令行**：启动该进程时使用的完整命令及其参数。             |

`-p`: 告诉 `ps` 只关注特定的进程 ID。

---

Linux 内核在 `/proc/[pid]/cmdline` 文件中存储数据的方式比较特别。

在 Linux 系统中，`/proc/"$pid"/cmdline` 包含了进程启动时的完整命令行参数。但为了方便程序解析，内核使用 **空字符 (Null Character, `\0`)** 而不是空格来分隔各个参数。

如果直接执行 `cat /proc/"$pid"/cmdline`，所有的参数会连在一起，或者在某些终端里完全无法显示。

- `tr '\0' ' '`: 将输入流中所有的空字符替换成空格，从而让原本挤在一起的参数变得易于阅读。

  - **`tr`**: 字符转换工具（translate）。

  - **`'\0'`**: 代表空字符（Null）。

  - **`' '`**: 代表标准的空格。

- `< /proc/"$pid"/cmdline`

  **`<`** 是输入重定向。它告诉 `tr` 命令不要等待键盘输入，而是从后面这个文件中读取内容。

- `; echo`

  - **`;`**: 命令分隔符，表示前一个命令执行完后，接着执行下一个。
  - **`echo`**: 在最后输出一个**换行符**。因为 `cmdline` 文件结尾通常没有换行符，如果不加这一句，终端提示符会紧跟在输出结果的末尾，看起来很乱。

---







