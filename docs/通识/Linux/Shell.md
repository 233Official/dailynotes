---

---

# Linux Shell

- [Linux Shell](#linux-shell)
  - [概述](#概述)
  - [获取系统信息](#获取系统信息)
  - [类清屏](#类清屏)
- [清屏](#清屏)
- [指针移到行尾](#指针移到行尾)
  - [修改时区和时间](#修改时区和时间)
  - [用户管理](#用户管理)
  - [echo](#echo)
  - [防火墙相关](#防火墙相关)
  - [Cron 表达式](#cron-表达式)
    - [各字段含义](#各字段含义)
    - [常用 Cron 表达式](#常用-cron-表达式)

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

- ```bash
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

## Cron 表达式

> [cron 表达式详解 - 腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1674682)

Cron 是类 Unix 操作系统中一个基于时间的工作调度器, Cron 表达式使用字符串标识, 定义了一个 Cron 工作的运行时间, 由 6 个或 7 个字段组成, 各字段按照先后顺序分别标识 `分钟  小时  月份中的天(1-31)  月份  星期几 年份(可选) `

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

- `?` 只能用在 `日期(DayofMonth)` 和 `星期(DayofWeek) ` 两个域, 含义与 `*` 相似但不同, 比如

- `-` 表示范围, 如 `时` 字段为 `9-17` 表示 `[9时, 17时]`

- `/` 表示起始时间每隔固定时间触发一次, 比如 `时` 字段为 `9-17/2` 表示 `[9时, 17时]` 间每 2h 触发一次

- `,` 表示枚举, 比如 `时` 字段为 `9,17` 表示在 9 时与 17 时分别触发一次

- `L` 表示最后, 只能用在 `日期(DayofMonth)` 和 `星期(DayofWeek) ` 两个域; 如果在 DayofWeek 域使用 5L,意味着在最后的一个星期四触发。

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
