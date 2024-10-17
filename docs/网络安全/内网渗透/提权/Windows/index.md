# Windows提权

## CVE

### TODO:CVE-2024-35250

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