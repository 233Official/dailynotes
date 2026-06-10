---
category:
  - 网络安全
  - 钓鱼
tags:
  - 网络安全
  - 钓鱼
  - 钓鱼附件
  - Office
excerpt: Office 钓鱼附件相关技术汇总，包括 OLE/OpenXML 文件格式简介与各类 Office 漏洞利用方式。
---

# Office

> [[原创\]office病毒分析资料整理-软件逆向-看雪-安全社区|安全招聘|kanxue.com](https://bbs.kanxue.com/thread-268255-1.htm)
>
> [恶意代码分析中一些常见的非PE样本分析\_office (sohu.com)](https://www.sohu.com/a/357951009_120054144)

---

## Office文件格式

> [[原创\]office病毒分析资料整理-软件逆向-看雪-安全社区|安全招聘|kanxue.com](https://bbs.kanxue.com/thread-268255-1.htm)

office文件格式根据版本可以分为Office2007之前的版本和Office2007之后的版本。
Office2007之前的版本为OLE复合格式: `doc,dot,xls,xlt,pot,ppt`
Office2007之后的版本为OpenXML格式: `docx,docm,dotx,xlsx,xlsm,xltx,potx`

---

## 相关利用

- [GitHub - SecWiki/office-exploits: office-exploits Office漏洞集合 https://www.sec-wiki.com](https://github.com/SecWiki/office-exploits)
- [GitHub - houjingyi233/office-exploit-case-study](https://github.com/houjingyi233/office-exploit-case-study)

---
