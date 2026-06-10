---
category:
  - 网络安全
tags:
  - 网络安全
excerpt: 网络安全领域索引页，汇总从业者生态报告、威胁情报（2023-2024）及常见安全概念（POC/EXP/CVE/0DAY）说明。
---

# 网络安全

---

## 从业者生态报告

> [中国信息安全从业人员现状调研报告(2018-2019年度)-P020190906557330247920.pdf (itsec.gov.cn)](http://www.itsec.gov.cn/zxxw/201909/P020190906557330247920.pdf)
>
> [2024年网络安全产业人才发展报告-安恒 (dbappsecurity.com.cn)](https://www.dbappsecurity.com.cn/content/details2166_25391.html)
>
> [中国网络安全产业分析报告(2023)-20231108115447_3689.pdf (china-cia.org.cn)](https://www.china-cia.org.cn/AQLMWebManage/Resources/kindeditor/attached/file/20231108/20231108115447_3689.pdf)
>
> [网络安全产业人才发展报告（2023年版）工业和信息化部人才交流中心 (miitec.cn)](https://www.miitec.cn/home/index/detail?id=3310)

---

## 威胁报告

> [2024 Threat Report: Observations, Metrics, Trends & Forecast (deepwatch.com)](<https://www.deepwatch.com/2024-ati-threat-report/?utm_campaign=2024> Threat Report&utm_source=google-ads&utm_medium=paid-search&utm_feeditemid=&utm_device=c&utm_term=cyber security report&utm_source=google&utm_medium=ppc&utm_campaign=Threat+Intel+Report+2023&hsa_cam=21030171028&hsa_grp=164193647012&hsa_mt=p&hsa_src=g&hsa_ad=691011968289&hsa_acc=8842859135&hsa_net=adwords&hsa_kw=cyber security report&hsa_tgt=kwd-10030405005&hsa_ver=3&gad_source=1&gclid=CjwKCAjw0t63BhAUEiwA5xP54ZP6bH0rs8twazv5GPE_CWqiNGWpgPN3Kqqrx6aK0QSSrTluWK2heRoCevkQAvD_BwE)

---

## 常见概念

> [计算机漏洞安全相关的概念 POC 、EXP 、VUL 、CVE 、0DAY_www.xpshuai.cn 的博客-CSDN 博客\_poc 漏洞 什么意思](https://blog.csdn.net/qq_37622608/article/details/88048847)

---

- `POC`: `Proof Of Concept`，中文意思是“`观点证明`”。这个短语会在漏洞报告中使用，漏洞报告中的 POC 则是 **一段说明** 或者 **一个攻击的样例**，使得读者能够确认这个漏洞是真实存在的。

- `EXP`: `Exploit`，中文意思是“`漏洞利用`”。意思是一段对漏洞 **如何利用的详细说明或者一个演示的漏洞攻击代码**，可以使得读者完全了解漏洞的机理以及利用的方法。

- `VUL`: `Vulnerability` 的缩写，泛指`漏洞`。

- `CVE漏洞编号`: `Common Vulnerabilities & Exposures`
  - 公共漏洞和暴露，例如 `CVE-2015-0057`、`CVE-1999-0001` 等等。CVE 就好像是一个字典表，为广泛认同的信息安全漏洞或者已经暴露出来的弱点给出一个公共的名称。如果在一个漏洞报告中指明的一个漏洞，如果有 CVE 名称，你就可以快速地在任何其它 CVE 兼容的数据库中找到相应修补的信息，解决安全问题。
  - 可以在 [CVE - CVE (mitre.org)](https://cve.mitre.org/) 网站根据漏洞的 CVE 编号搜索该漏洞的介绍。

- `0DAY`
  - 在计算机领域中，零日漏洞或零时差漏洞(``Zero-day exploit`) 通常是指还没有补丁的安全漏洞，而零日攻击或零时差攻击(`Zero-day attack`) 则是指利用这种漏洞进行的攻击。提供该漏洞细节或者利用程序的人通常是该漏洞的发现者。零日漏洞的利用程序对网络安全具有巨大威胁，因此零日漏洞不但是黑客的最爱，掌握多少零日漏洞也成为评价黑客技术水平的一个重要参数。
  - 零日漏洞及其利用代码不仅对犯罪黑客而言，具有极高的利用价值，一些国家间谍和网军部队，例如美国国家安全局和美国网战司令部也非常重视这些信息。据路透社报告称美国政府是零日漏洞黑市的最大买家。

- `CAN`: CAN 和 CVE 的唯一区别是前者代表了候选条目，还未经 CVE 编辑委员会认可，而后者则是经过认可的条目。 然后，两种类型的条目都对公众可见，条目的编号不会随着认可而改变—仅仅是“CAN”前缀替换成了“CVE”。

- `BUGTRAQ`: 一个完整的对计算机安全漏洞(它们是什么，如何利用它们，以及如何修补它们) 的公告及详细论述进行适度披露的邮件列表

- `CNCVE`: 中国(CN) 的 CVE ，是 `CNCERT/CC(国家计算机网络应急处理协调中心)`为漏洞进行编号的一个自己的标准。 CNCVE 不但包含漏洞的描述予以统一定义，还将包括漏洞的补丁、验证等措施，更方便、有用。

- `CNVD`: 国家信息安全漏洞共享平台。是由国家计算机网络应急技术处理协调中心(简称 CNCERT) 联合国内重要信息系统单位、基础电信运营商、网络安全厂商、软件厂商和互联网企业建立的信息安全漏洞信息共享知识库。

- `CNNVD`: 中国国家信息安全漏洞库。是中国信息安全测评中心为切实履行漏洞分析和风险评估的职能，负责建设运维的国家信息安全漏洞库，为我国信息安全保障提供基础服务

- `CVSS`: `(Common Vulnerability Scoring System)` 通用漏洞评分系统，行业公开标准，用来评测漏洞的严重程度，0-10 分值越高越严重,美国国家漏洞数据库官网：[NVD - Search and Statistics (nist.gov)](https://nvd.nist.gov/vuln/search) 可查询 CVE 对应 CVSS 分值

  > _PS：评分会受时间和空间影响，如随着时间推移，漏洞相关补丁越多，可被利用性越低；漏洞存在不同的环境，也会影响漏洞的威胁程度_

- `CPE`: `(Common Platform Enumeration)` 以标准化方式为软件应用程序、操作系统及硬件命名的方法

---

### CVSS

**CVSS（Common Vulnerability Scoring System，通用漏洞评分系统）** 是由 **FIRST（Forum of Incident Response and Security Teams）** 维护的**开源漏洞评分框架**，旨在通过标准化方法评估漏洞的严重性。

- **核心目标**是帮助组织量化漏洞风险，优先修复高危漏洞。

---

- **版本演进**
  - **CVSS v2**（2007年）：首次广泛采用，但存在评分模糊性（例如“High”覆盖7.0-10.0）。

  - **CVSS v3.0/v3.1**（2015/2019年）：细化评分维度，引入“Critical”等级（9.0-10.0），更贴近实际威胁。

  **当前标准**：**CVSS v3.1** 是行业主流，NVD（美国国家漏洞数据库）等权威机构均基于此版本评分。

---

- **合规要求**：PCI DSS、ISO 27001等标准要求优先处理CVSS ≥7.0的漏洞。
  - **PCI DSS（Payment Card Industry Data Security Standard）**是由 **PCI SSC（支付卡行业安全标准委员会）** 制定的强制性安全标准，适用于所有处理信用卡数据的组织（银行、电商、支付网关等）。
    - **行业强制力**：Visa、Mastercard等卡组织要求合规，未通过认证的企业可能被罚款或禁止处理信用卡交易。
    - **技术细节**：明确要求对CVSS≥7.0的漏洞在30天内修复（PCI DSS v4.0 Requirement 6.3.1）。
    - 漏洞管理要求：定期扫描漏洞（ASV扫描），高风险漏洞必须优先处理。
      - 示例：若电商平台存在SQL注入漏洞（CVSS 8.6），需立即修复否则面临审计失败。

- **威胁情报**：CISA KEV（已知被利用漏洞目录）中90%的漏洞CVSS ≥7.0。

---

#### CVSS评分系统

**1. 评分构成**

CVSS v3.1 由三组指标组成，最终得分由 **Base Score（基础评分）** 决定，可选 **Temporal Score（时间评分）** 和 **Environmental Score（环境评分）** 调整：

- **Base Metrics（必选）**：漏洞固有特性，包括：
  - **Exploitability Metrics**：攻击复杂度（如是否需要用户交互）。
  - **Impact Metrics**：对机密性（C）、完整性（I）、可用性（A）的影响。
- **Temporal Metrics**（可选）：漏洞随时间变化的特性（如是否有公开EXP）。
- **Environmental Metrics**（可选）：漏洞在特定环境中的实际影响（如业务关键性）。

---

**2. 基础评分公式**

- $Base Score = Roundup(Min(Impact Sub-Score + Exploitability Sub-Score, 10))$
  - $Impact Sub-Score = 6.42 × Impact$
  - $Exploitability Sub-Score = 8.22 × Attack Vector × Attack Complexity × Privileges Required × User Interaction$
- **最终得分范围**：0.0 ~ 10.0。

---

**3. 严重性等级划分（CVSS v3.1）**

|   评分区间   |   等级   |                     典型特征                      |
| :----------: | :------: | :-----------------------------------------------: |
| **9.0-10.0** | Critical | 远程利用、无需用户交互、可完全控制系统（如Log4j） |
| **7.0-8.9**  |   High   |    远程利用但需特定条件（如Apache Struts RCE）    |
| **4.0-6.9**  |  Medium  |        本地攻击或需用户配合（如客户端XSS）        |
| **0.1-3.9**  |   Low    |   影响有限或难以利用（如信息泄露无直接利用链）    |

---

## 常见端口梳理

> [De Facto Ports (matt-rickard.com)](https://matt-rickard.com/de-facto-ports)

大多数应用程序通过 TCP 或 UDP 端口进行通信。端口 0-1023 通常具有特权，需要管理员或超级用户访问权限才能将网络套接字绑定到具有相应端口的 IP

不过 1024 及以上的端口则是可以自由分配的, 在 [De Facto Ports (matt-rickard.com)](https://matt-rickard.com/de-facto-ports) 中, 作者汇总了 2023 年生产环境中常见的默认端口, 发现了一些有趣的现象:

- 奇数且易于记忆的端口常用于开发服务器; 3000, 5000, 9000 在一体式 Web 框架中比较常见
- 具有相关特权应用程序端口(如 SMTP, DNS) 的应用程序有时会使用重复的字符串(例如 多播DNS 为 5353, SMTP 为 3535, Web 服务器为 8080)
- 除此以外, 似乎趋势上会选择一个低熵数字(例如 Jupyter 的 8888) 或一个完全随机的不太可能引起冲突的数字 (例如 Minecraft 的 25365) 来作为端口号使用

常见的还有

| 端口号 |                                                                                          应用                                                                                           |
| :----: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  1080  |                                                                                       SOCK Proxy                                                                                        |
|  2049  |                                                                        Network File System (NFS)(网络文件系统 )                                                                         |
|  2181  |                                                                                    Apache ZooKeeper                                                                                     |
|  2375  |                                                                                 Docker REST API (HTTP)                                                                                  |
|  2376  |                                                                                 Docker REST API (HTTPS)                                                                                 |
|  3000  | 开发框架的常用端口<br>Ruby on Rails 使用端口 3000 作为其 Web 服务器的默认开发端口<br>Node 框架也常使用此端口(例如 Express.js、Meteor、Create React App、NextJS、SvelteJS、Astro、Remix) |
|  3306  |                                                                                          MySQL                                                                                          |
|  3478  |                                                                               STUN, TURN (NAT Traversal)                                                                                |
|  4000  |                                                      Phoenix, Jekyll<br>(二者都是网站生成器, 后者还可以直接部署在 Github Pages 上)                                                      |
|  4001  |                                                                                          etcd                                                                                           |
|  4200  |                                                                                        AngularJS                                                                                        |
|  4567  |                                                                                         Sinatra                                                                                         |
|  5000  |                                               也是开发框架的常见端口<br>Flask (Python) 使用 5000 作为默认开发端口。 ASP.NET Core 也是如此                                               |
|  5222  |                                          XMPP (Extensible Messaging and Presence Protocol)(XMPP (Extensible Messaging and Presence Protocol))                                           |
|  5349  |                                                                                   STUN, TURN over TLS                                                                                   |
|  5353  |                                          Multicast DNS(多播DNS) --- 遵循与 SMTP 相同的模式, 偶尔在端口 3535 上运行. 复制特权端口(DNS 使用 53)                                           |
|  5432  |                                                                                       PostgreSQL                                                                                        |
|  5900  |                                                                                           VNC                                                                                           |
|  6000  |                                                                                           X11                                                                                           |
|  6379  |                                                                                          6379                                                                                           |
|  6660  |                                                                                IRC (Internet Relay Chat)                                                                                |
|  6881  |                                                                                       BitTorrent                                                                                        |
|  8000  |                                                            Python 开发框架常用端口<br>包括 Django 和 Python3 的 http.server                                                             |
|  8080  |                                                                                 HTTP Web 服务器常用端口                                                                                 |
|  8333  |                                                                                         Bitcoin                                                                                         |
|  8888  |                                                                                    Jupyter Notebook                                                                                     |
|  8983  |                                                                                       Apache Solr                                                                                       |
|  9000  |                                                                 被各种应用程序使用，但没有中心主题或非常知名的应用程序                                                                  |
| 25565  |                                                                                        Minecraft                                                                                        |
| 27017  |                                                                                         MongoDB                                                                                         |
| 51820  |                                                                                        WireGuard                                                                                        |

---

## 环境搭建

---

### CommandoVM

> [mandiant/commando-vm: Complete Mandiant Offensive VM (Commando VM), a fully customizable Windows-based pentesting virtual machine distribution. commandovm@mandiant.com --- mandiant/commando-vm：完整的Mandiant进攻性VM(Commando VM) ，一个完全可定制的基于Windows的渗透测试虚拟机发行版。 commandovm@mandiant.com (github.com)](https://github.com/mandiant/commando-vm)

Complete Mandiant Offective VM(“CommandoVM”) 是一个全面的、可定制的、基于 Windows 的安全发行版，用于渗透测试和红队。 CommandoVM 附带了 Kali Linux 中未包含的各种攻击工具，这些工具突出了 Windows 作为攻击平台的有效性。

> 这里只是捋一下这套环境搭建的步骤

首先准备一台虚拟机, 配置如下:

- Windows 10 22H2
- 200 GB 硬盘
- 4+ GB 内存
- 2 个网络适配器

---

关闭 Windows 的病毒防护, 可以参考 [端点安全 - 永久关闭 Windows 实时防护 | DailyNotes (ayusummer.github.io)](https://ayusummer.github.io/DailyNotes/网络安全/端点安全/#永久关闭-windows-实时防护)

![image-20230905223516662](http://cdn.ayusummer233.top/DailyNotes/202309052235748.png)

然后重启虚拟机

---

下载并解压 [mandiant/commando-vm: Complete Mandiant Offensive VM (Commando VM), a fully customizable Windows-based pentesting virtual machine distribution. commandovm@mandiant.com --- mandiant/commando-vm：完整的Mandiant进攻性VM(Commando VM) ，一个完全可定制的基于Windows的渗透测试虚拟机发行版。 commandovm@mandiant.com (github.com)](https://github.com/mandiant/commando-vm)

![image-20230905223838127](http://cdn.ayusummer233.top/DailyNotes/202309052238160.png)

---

以管理员权限运行 powershell 然后把脚本限制解了:

```powershell
Set-ExecutionPolicy Unrestricted -force
```

切到上图中的解压后的仓库根目录

```powershell
cd xxxxx
# 解锁所有项目文件
Get-ChildItem .\ -Recurse | Unblock-File
```

- `Get-ChildItem .\ -Recurse`: 获取当前目录及其子目录下的所有文件
- `|` 管道符, 将前一个命令的输出传递给下一个命令
- `Unlock-File`: 用于解除文件的 "已阻止" 属性。
  "已阻止" 属性通常与从不受信任的来源下载的文件相关联，以确保文件不会在打开时执行潜在的危险操作。
  通过运行 `Unblock-File` 命令可以解除这个属性，在这里由于要下载大量的工具因此需要接触禁止从不信任来源下载文件的限制

---

==准备一个梯子覆盖系统代理, 后续安装脚本会走系统代理==

---

把系统默认输入法改成英文, 或者把默认模式改成英语:

![image-20230905231137787](http://cdn.ayusummer233.top/DailyNotes/202309052311817.png)

这是因为后续有些软件会有安装界面, 脚本会模拟键盘把路径输进去, 用中文的话会缺一个回车导致路径打不出来而引起中断, 效果如下:

![image-20230905231517073](http://cdn.ayusummer233.top/DailyNotes/202309052315099.png)

由于没有回车， 导致这些字符实际上并没有成功输入完, 也就会引起异常

---

```powershell
# 运行安装脚本
.\install.ps1
```

![image-20230905230656842](http://cdn.ayusummer233.top/DailyNotes/202309052306869.png)

![image-20230905230709829](http://cdn.ayusummer233.top/DailyNotes/202309052307855.png)

![image-20230905230807396](http://cdn.ayusummer233.top/DailyNotes/202309052308455.png)

这里我选择全部安装, 需要点进 Configure Profile 来自定义

![image-20230905230900392](http://cdn.ayusummer233.top/DailyNotes/202309052309421.png)

> 点击上图中的 `<<` 将可选的包全选上以便后续来安装
>
> 需要注意的是其实里面有些工具比较久或者不兼容系统, 可以在出现问题时考量是否舍弃

---

点击 `Install` 后会提示输入电脑的开机密码, 这里输入解锁屏幕的密码即可, 后面整个安装过程后会有多次重启电脑的操作

![image-20230905231601787](http://cdn.ayusummer233.top/DailyNotes/202309052316819.png)

---

安装过程可能会比较漫长, 需要一些耐心等待以及排错, 下面即为一些遇到的错误及解决方案:

---

有一些包需要通过 `choco` 安装, 不过也许是存的 hash 比较旧, 或者说真的拉下来的包不对劲, 总之 hash 对不上便不会继续安装, 此时则需要手动翻找下载源然后校对是否安全来决定是否安装

![image-20230905231813525](http://cdn.ayusummer233.top/DailyNotes/202309052318567.png)

![image-20230905231751771](http://cdn.ayusummer233.top/DailyNotes/202309052317810.png)

```powershell
 Get-FileHash -Path [文件路径] -Algorithm SHA256
```

![image-20230906000517652](http://cdn.ayusummer233.top/DailyNotes/202309060005690.png)

![image-20230906000314527](http://cdn.ayusummer233.top/DailyNotes/202309060003554.png)

![image-20230906000558144](http://cdn.ayusummer233.top/DailyNotes/202309060005176.png)

手动去官网下载下然后对一下哈希,能对上, 说明是存的哈希旧了, 可以使用如下命令忽略校验强制安装

```powershell
choco install --ignore-checksums -y [包名]
```

![image-20230906002518106](http://cdn.ayusummer233.top/DailyNotes/202309060025137.png)

---

### vulhub

> [vulhub/README.zh-cn.md at master · vulhub/vulhub · GitHub](https://github.com/vulhub/vulhub)

---

在 Ubuntu2204 上安装 Docker

```bash
# Install the latest version docker
curl -s https://get.docker.com/ | sh

# Run docker service
systemctl start docker
```

然后拉取 vulhub 仓库按照相应漏洞中的 README 文件操作即可

---

#### vulhub 捉虫

- `elasticsearch/CVE-2015-3337/Dockerfile`

  ```dockerfile
  FROM vulhub/elasticsearch:1.4.4

  LABEL maintainer="phithon <root@leavesongs.com>"

  RUN set -ex \
      && plugin --install mobz/elasticsearch-head/1.x -u https://codeload.github.com/mobz/elasticsearch-head/zip/refs/heads/1.x
  ```

  原来是如下这样, 是无法成功拉取的

  ```dockerfile
  RUN set -ex \
      && plugin -install mobz/elasticsearch-head/1.x
  ```

  官方的解决方案:

  ```dockerfile
  RUN set -ex \
      && plugin -install mobz/elasticsearch-head
  ```

---

---

### VULFOCUS

> [fofapro/vulfocus: 🚀Vulfocus 是一个漏洞集成平台，将漏洞环境 docker 镜像，放入即可使用，开箱即用。 (github.com)](https://github.com/fofapro/vulfocus)
>
> [安装 (fofapro.github.io)](https://fofapro.github.io/vulfocus/#/INSTALL)

#### 使用 docker-compose 安装 VULFCOUS

```bash
git clone https://github.com/fofapro/vulfocus.git
cd vulfocus
```

将 `docker-compose.yaml` 中如下的两个 `VUL_IP` 改成本机 IP 即可

![image-20230328005609764](http://cdn.ayusummer233.top/DailyNotes/202303280056842.png)

```bash
# 启动并后台运行 VULFOCUS 容器
docker compose up -d
```

![image-20230328010058301](http://cdn.ayusummer233.top/DailyNotes/202303280100357.png)

![image-20230328010131947](http://cdn.ayusummer233.top/DailyNotes/202303280101984.png)

访问默认的 80 端口服务即可看到 VULFOCUS 登录页

![image-20230328010326881](http://cdn.ayusummer233.top/DailyNotes/202303280103017.png)

默认账密 `admin/admin`

---

## 使用 OpenSSL 创建自签名 SSL 证书

> [如何创建自签名 SSL 证书 | myfreax](https://www.myfreax.com/creating-a-self-signed-ssl-certificate/)

> 最近有给站点上 HTTPS 的需求, 且在内网使用, 所以有了自签名证书的需求

自签名 SSL 证书是由创建它的人而不是受信任的证书颁发机构签名的证书。自签名证书可以与受信任的 CA 签名 SSL 证书具有相同的加密级别。

在浏览器中访问自签名证书的 HTTPS 站点时会提示不安全的链接

自签名证书常用于测试以及内部使用, 不应当用于正式的生产环境

---

### 安装 openssl

这里使用 openssl 工具包生成自签名证书, 可以使用 `openssl version` 命令检查系统是否安装了 openssl, 如果未安装则可以使用如下命令安装

:::tabs

@tab:active Ubuntu/Debian

```bash
sudo apt install openssl
```

@tab Centos/Fedora

```bash
sudo yum install openssl
```

:::

### 创建自签名 SSL 证书

可以使用 `openssl req`创建自签名 SSL 证书

```bash
openssl req -newkey rsa:4096 \
            -x509 \
            -sha256 \
            -days 3650 \
            -nodes \
            -out example.crt \
            -keyout example.key
```

- `-newkey rsa:4096`-创建新的证书请求和 4096 位 RSA 密钥。默认值为 2048 位。
- `-x509` -创建 X.509 证书。
- `-sha256` -使用 265 位 SHA(安全哈希算法) 。
- `-days 3650` -认证证书的天数。 3650 是 10 年。您可以使用任何正整数。
- `-nodes` -创建没有密码的密钥。
- `-out example.crt` -指定将新创建的证书写入的文件名。您可以指定任何文件名。
- `-keyout example.key` -指定要写入新创建的私钥的文件名。您可以指定任何文件名。

> 有关`openssl req`命令选项的更多信息，请访问[OpenSSL req 文档页面。](https://www.openssl.org/docs/manmaster/man1/openssl-req.html)

回车后可以看到如下回显:

> ![image-20230106103502248](http://cdn.ayusummer233.top/DailyNotes/202301061035592.png)

输入相应信息后会在当前目录生成证书与私钥

> ![image-20230106104219369](http://cdn.ayusummer233.top/DailyNotes/202301061042234.png)

---

## 材料

- [红队防猝死手册](https://github.com/zhutougg/RedteamStandard)
- [GitHub - tib36/PhishingBook: 红蓝对抗：钓鱼演练资源汇总&备忘录](https://github.com/tib36/PhishingBook?tab=readme-ov-file)
- [GitHub - biggerduck/RedTeamNotes: 红队笔记](https://github.com/biggerduck/RedTeamNotes)
- [GitHub - Threekiii/Awesome-Redteam: 一个攻防知识仓库 Red Teaming and Offensive Security](https://github.com/Threekiii/Awesome-Redteam?tab=readme-ov-file)

---

## 站点导航

> [推荐一些网络安全的网站和论坛\_网络安全论坛-CSDN博客](https://blog.csdn.net/m0_60571990/article/details/127187373)

- 整合类站点
  - [渗透师 网络安全从业者安全导航 (shentoushi.top)](https://www.shentoushi.top/secworld)
- 安全门户
  - [FreeBuf网络安全行业门户](https://www.freebuf.com/)
  - [FreeBuf - 安全内参 | 决策者的网络安全知识库 (secrss.com)](https://www.secrss.com/articles?author=FreeBuf)
  - [安全牛 - aqniu.com](https://www.aqniu.com/)
  - [SecWiki-安全维基,汇集国内外优秀安全资讯、工具和网站 (sec-wiki.com)](https://www.sec-wiki.com/)
- 交流社区
  - [技术文章 - 先知社区 (aliyun.com)](https://xz.aliyun.com/tab/1)
  - [SegmentFault 思否](https://segmentfault.com/)
  - [V2EX](https://www.v2ex.com/)
  - [i春秋论坛|白帽黑客论坛|网络渗透技术|网站安全|移动安全|通信安全 - Powered by Discuz! (ichunqiu.com)](https://bbs.ichunqiu.com/portal.php)
- 漏洞知识库 / POC/EXP 收集
  - [github.com/Threekiii/Vulnerability-Wiki](https://github.com/Threekiii/Vulnerability-Wiki)
  - [github.com/Threekiii/Awesome-POC](https://github.com/Threekiii/Awesome-POC)
  - [github.com/ybdt/exp-hub](https://github.com/ybdt/exp-hub)
  - [github.com/su18/POC](https://github.com/su18/POC)
  - [github.com/khulnasoft-lab/awesome-security](https://github.com/khulnasoft-lab/awesome-security)
  - [github.com/cisagov/vulnrichment](https://github.com/cisagov/vulnrichment)

    A repo to conduct vulnerability enrichment

  - [github.com/Threekiii/CVE](https://github.com/Threekiii/CVE)

    一个CVE漏洞预警知识库 no exp/poc

  - [github.com/Y5neKO/Y5_VulnHub](https://github.com/Y5neKO/Y5_VulnHub)

    个人漏洞收集项目，包括复现环境、POC、EXP等

  - [github.com/DarkFunct/TK-CVE-Repo](https://github.com/DarkFunct/TK-CVE-Repo)

---
