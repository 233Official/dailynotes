# Windows 本地提权

## Pytmipe

PYTMIPE 是一个通过令牌篡改和伪造实现提权的 Python3 库， 支持在 Windows 系统中实现令牌篡改和模拟，最终实现权限提升

TMIPE 是一个 Python3 客户端，主要使用的就是 pytmipe 库

---

### Main features

|                            Method                            |                    Required Privilege(s)                     | OS (no exhaustive) <br>操作系统（不详尽） | Direct target (max) <br>直接目标（最大）  |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :---------------------------------------: | :---------------------------------------: |
|      Token creation & impersonation <br>令牌创建和模拟       |                     username & password                      |                    All                    |            local administrator            |
|           Token Impersonation/Theft 令牌冒充/盗窃            |                       SeDebugPrivilege                       |                    All                    |            nt authority\system            |
| Parent PID spoofing (handle inheritance)<br> 父PID欺骗（句柄继承） |                       SeDebugPrivilege                       |                 >= Vista                  |            nt authority\system            |
|                        Service (SCM)                         | Local administrator (and high integrity level if UAC enabled) |                    All                    | nt authority\system or <br>domain account |
|                          WMI Event                           | Local administrator (and high integrity level if UAC enabled) |                    All                    |            nt authority\system            |
|                     « Printer Bug » LPE                      |          *SeImpersonatePrivilege* (Service account)          | Windows 8.1, 10 & Server 2012R2/2016/2019 |            nt authority\system            |
|                      RPCSS Service LPE                       |          *SeImpersonatePrivilege* (Service account)          |       Windows 10 & Server 2016/2019       |            nt authority\system            |

---

### 功能

以下列表简略地显示了 `pytmipe` 库中实现的一些功能：

- 令牌和权限管理：
  - 获取、启用或禁用当前或远程线程的令牌特权
  - 获取本地或远程令牌信息
  - 获取当前线程的有效令牌（模拟或主令牌）
- 获取有关所选 token 的许多信息：
  - elevation type, impersonation type, Linked token with details, SID, ACLs, default groups, primary group, owner, privileges, source
    提升类型、模拟类型、包含详细信息的链接令牌、SID、ACL、默认组、主要组、所有者、权限、源
  - etc
- 列出当前线程可访问的所有令牌（主令牌和模拟令牌）：
  - 2 different methods implemented: "thread" method and **"handle"** method (favorite)
  - check if token can be impersonated
    检查token是否可以被冒充
  - get information about each token (elevation type, impersonation type, Linked token, SID, etc)
    获取有关每个令牌的信息（提升类型、模拟类型、链接令牌、SID 等）
  - get all tokens which are accessible by account name (SID)
    获取可通过帐户名（SID）访问的所有令牌
- Impersonate a token or user（模拟令牌或用户）：
  - Make Token and Impersonate (requires credentials of user)
    制作令牌并模拟（需要用户凭据）
  - Token impersonation/theft (specific privileges are required): impersonate a chosen token
    令牌模拟/盗窃（需要特定权限）：模拟所选令牌
  - Create Process with a token (specific privileges are required): impersonate a chosen token and create new process
    使用令牌创建进程（需要特定权限）：模拟所选令牌并创建新进程
  - **Impersonate first \*nt authority\system\* token** found
    **模拟找到的第一个\*nt 权限\系统\*令牌**
  - impersonate primary token of remote process with pid
    使用 pid 模拟远程进程的主令牌
- Escalation methods:
  - **Parent PID Spoofing** - Handle Inheritance
    **父 PID 欺骗**- 处理继承
  - Service Manager via direct command or named pipe impersonation: local administrator to *nt authority\system* (or orther privileged account)
    通过直接命令或命名管道模拟的服务管理器：本地管理员到*nt权限\系统*（或其他特权帐户）
  - Task scheduler via direct command or named pipe impersonation: local administrator to *nt authority\system*
    通过直接命令或命名管道模拟的任务调度程序：本地管理员到*nt权限\系统*
  - WMI job via direct command or named pipe impersonation: local administrator to *nt authority\system*
    通过直接命令或命名管道模拟进行 WMI 作业：本地管理员到*nt 权限\系统*
  - **Printer Bug**: *SeImpersonatePrivilege* to *nt authority\system*
    **打印机错误**： *SeImpersonatePrivilege*为*nt 权限\系统*
  - **RPCSS**: *SeImpersonatePrivilege* to *nt authority\system*
    **RPCSS** ：对*nt 权限\系统的**SeImpersonatePrivilege*
  - **Re enable privileges** via task scheduling and named pipe impersonation
    通过任务调度和命名管道模拟**重新启用权限**

---

### 依赖

*ctypes* is used a maximum of time. Many features of *pywin32* have been re developped in pytmipe to avoid the use of *pywin32* for better portability. However, Task Scheduler module still uses *pywin32* (more precisely *pythoncom*) by lack of time. All other modules uses ctypes only.
ctypes 被使用得最多。pywin32 的许多功能已在 pytmipe 中重新开发，以避免使用 pywin32，以实现更好的可移植性。然而，由于时间不足，任务计划程序模块仍然使用 pywin32（更准确地说，是 pythoncom）。所有其他模块仅使用 ctypes。

---

### 使用方法

#### For **python client** (named tmipe)

```bash
python.exe tmipe.py -h
usage: tmipe.py [-h] [--version]
                {cangetadmin,printalltokens,printalltokensbyname,printalltokensbypid,printsystemtokens,searchimpfirstsystem,imppid,imptoken,printerbug,rpcss,spoof,impuser,runas,scm}
                ...

                      **
    888888  8b    d8  88  88""Yb  888888
      88    88b  d88  88  88__dP  88__
      88    88YbdP88  88  88"""   88""
      88    88 YY 88  88  88      888888
-------------------------------------------
Token Manipulation, Impersonation and
     Privilege Escalation (Tool)
-------------------------------------------
By Quentin HARDY (quentin.hardy@protonmail.com)

positional arguments:
  {cangetadmin,printalltokens,printalltokensbyname,printalltokensbypid,printsystemtokens,searchimpfirstsystem,imppid,imptoken,printerbug,rpcss,spoof,impuser,runas,scm}

                         Choose a main command
    cangetadmin          Check if user can get admin access
    printalltokens       Print all tokens accessible from current thread
    printalltokensbyname
                         Print all tokens accessible from current thread by account name
    printalltokensbypid  Print all tokens accessible from current thread by pid
    printsystemtokens    Print all system tokens accessible from current
    searchimpfirstsystem
                         search and impersonate first system token
    imppid               impersonate primary token of selected pid and try to spawn cmd.exe
    imptoken             impersonate primary or impersonation token of selected pid/handle and try to spawn cmd.exe
    printerbug           exploit the "printer bug" for getting system shell
    rpcss                exploit "rpcss" for getting system shell
    spoof                parent PID Spoofing ("handle inheritance)"
    impuser              create process with creds with impersonation
    runas                create process with creds as runas
    scm                  create process with Service Control Manager

optional arguments:
  -h, --help             show this help message and exit
  --version              show program's version number and exit
```

---

#### For python library (named pytmipe)

请参阅源代码和示例。通常，作者已经很好地记录了源代码... 大多数函数都有文档说明。

---

#### For pyinstaller **examples** and standalones

请参阅 [src/examples/文件夹 ](https://github.com/quentinhardy/pytmipe/tree/master/src/examples)中的文件

---

### 示例

如果您想了解如何使用*pytimpe*库，请参阅  [src/examples/文件夹 ](https://github.com/quentinhardy/pytmipe/tree/master/src/examples)中的示例

---

#### 示例1-获取 nt authority\system

For impersonating(模拟) the first system token and get a cmd.exe prompt as system from python client (*tmipe*):

```bash
python.exe tmipe.py searchimpfirstsystem -vv
```

要直接通过*pytmipe*库执行相同的操作，请参阅 `src/examples/searchAndImpersonateFirstSystemToken.py`：

```python
from impersonate import Impersonate
from utils import configureLogging

configureLogging()
imp = Impersonate()
imp.searchAndImpersonateFirstSystemToken(targetPID=None, printAllTokens=False)
```

​    如果当前 Windows 用户具有所需的权限(local administrator)，它将以系统身份打开 cmd.exe 提示符。

> 当然，从这个源代码中，您可以使用 pyinstaller 创建一个独立的 exe。

---

## CVE

### TODO:CVE-2024-35250

> [Nicolas Krassas：“PoC Exploit Release for Windows Kernel-Mode Driver Elevation of Privilege Flaw (CVE-2024-35250) https://t.co/M9KxbLlyIh” / X](https://x.com/Dinosn/status/1846016677042929864)
>
> [GitHub - varwara/CVE-2024-35250: PoC for the Untrusted Pointer Dereference in the ks.sys driver](https://github.com/varwara/CVE-2024-35250)[GitHub - varwara/CVE-2024-35250: PoC for the Untrusted Pointer Dereference in the ks.sys driver](https://github.com/varwara/CVE-2024-35250)
>
> [Windows 内核态驱动本地权限提升漏洞（CVE-2024-35250） - 知道创宇 Seebug 漏洞平台](https://www.seebug.org/vuldb/ssvid-99884)
>
> [CVE-2024-35250 - 安全更新程序指南 - Microsoft - Windows 内核模式驱动程序特权提升漏洞](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-35250)

- 影响范围: Windows Server 2012, Windows Server 2008, Windows Server 2016, Windows 10 , Windows Server 2022,Windows 11

  > 详见 [CVE-2024-35250 - 安全更新程序指南 - Microsoft - Windows 内核模式驱动程序特权提升漏洞](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-35250)

---

#### 程序编译

参考 [GitHub - varwara/CVE-2024-35250: PoC for the Untrusted Pointer Dereference in the ks.sys driver](https://github.com/varwara/CVE-2024-35250) 上的源码使用 VisualStudio 构建项目

如果没装 Windows SDK 的话记得把它装上:

![image-20241017160205047](http://cdn.ayusummer233.top/DailyNotes/202410171602104.png)

- **Windows 10 SDK (10.0.20348.0)** 对应 **Windows 10, version 21H2（Windows Server 2022）**

  包含了一些较新的 API 和功能更新，支持开发针对较新 Windows 版本的应用程序和驱动程序

- **Windows 10 SDK (10.0.19041.0)** 对应 **Windows 10, version 2004（20H1）**

  这是一个较为通用的 SDK 版本，许多开发者选择它来保证与较广泛的 Windows 10 设备兼容

- **Windows 10 SDK (10.0.18362.0)** 对应 **Windows 10, version 1903**

  包含更少的新特性，适合针对稍旧版本的 Windows 10 进行开发

---

除了 Windows SDK 还需要安装 WDK(Windows 驱动程序开发工具包)

可以在 [Download the Windows Driver Kit (WDK) - Windows drivers | Microsoft Learn](https://learn.microsoft.com/en-us/windows-hardware/drivers/download-the-wdk) 找到安装教程

因为注意到上述页面提供的 WDK 是最近发布的, 漏洞是在 6 月份发布的, 因此从 [以前的 WDK 版本和其他下载 - Windows 驱动程序 |微软学习 --- Previous WDK versions and other downloads - Windows drivers | Microsoft Learn](https://learn.microsoft.com/en-us/windows-hardware/drivers/other-wdk-downloads) 换了 Win10 2004 版本的 WDK 安装

> PS: 这里我也不清楚下载最新版本是否一定会影响程序运行, 所以下了老版本

![image-20241017164840686](http://cdn.ayusummer233.top/DailyNotes/202410171648869.png)

![image-20241017164910349](http://cdn.ayusummer233.top/DailyNotes/202410171649385.png)

![image-20241017165037522](http://cdn.ayusummer233.top/DailyNotes/202410171650580.png)

![image-20241017165151103](http://cdn.ayusummer233.top/DailyNotes/202410171651147.png)

> 这里提醒没安装合适的 Windows SDK, 是因为前面装的 SDK 是最新的, 这里的 WDK 老了一个版本 , 待会儿会把对应的 WIndows SDK 也装了
>
> ![image-20241017165339249](http://cdn.ayusummer233.top/DailyNotes/202410171653313.png)

![image-20241017165252602](http://cdn.ayusummer233.top/DailyNotes/202410171652651.png)

---

![image-20241017155857674](http://cdn.ayusummer233.top/DailyNotes/202410171558894.png)

---

> TODO: 最后编译通过了但是运行一直报错
>
> ![image-20241017175834721](http://cdn.ayusummer233.top/DailyNotes/202410171758846.png)
>
> 不是很了解内核驱动开发, 暂且搁置

---

















