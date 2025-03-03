---
date: 2024-06-03
---

# NTFS文件流隐藏的可执行文件

> [利用NTFS交换数据流隐藏文件_ntfs ads separator in file-CSDN博客](https://blog.csdn.net/Hexuefu_Bayonet/article/details/107237309)

`NTFS备用数据流（Alternate Data Streams, ADS）`: NTFS文件系统的一种特性，允许文件包含多个数据流。每个文件默认有一个主要数据流，用于存储文件的主要内容，但它也可以附加一个或多个备用数据流。

这些备用数据流不影响文件的主要内容或文件大小的显示，通常在传统的文件操作中也是隐藏的。

---

可以利用 type 命令将要写入备用数据流的信息写入到目标文件的目标流中, 例如将 `msedge.exe` 写入到 `readme.txt` 的 `test` 流中

```cmd
type msedge.exe >> readme.txt:test
```

需要注意的是这样写入备用数据流的可执行文件对于 `WinXP` 和 `Win7` 之后的 Windows 版本在 NTFS 备用数据流的不同体现在对寄生的可执行文件的运行管理上

XP可以用 start 直接运行寄生的可执行程序, 例如运行上面写入到 `readme.txt` 的 `test` 流中可执行程序

```cmd
start readme.txt:test
```

Win7之后的版本需要手动创建一个连接文件, 通过这个链接文件才能运行这个寄生的可执行交换数据流文件:

```cmd
mklink test.exe readme.txt:test
test.exe
```

---

