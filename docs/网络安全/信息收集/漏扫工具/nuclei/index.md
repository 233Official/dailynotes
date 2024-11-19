# nuclei

> [projectdiscovery/nuclei：Nuclei 是一款快速、可定制的漏洞扫描器，由全球安全社区提供支持，并构建在简单的基于 YAML 的 DSL 上，支持协作解决互联网上的趋势漏洞。它可以帮助您查找应用程序、API、网络、DNS 和云配置中的漏洞。 --- projectdiscovery/nuclei: Nuclei is a fast, customizable vulnerability scanner powered by the global security community and built on a simple YAML-based DSL, enabling collaboration to tackle trending vulnerabilities on the internet. It helps you find vulnerabilities in your applications, APIs, networks, DNS, and cloud configurations.](https://github.com/projectdiscovery/nuclei)

Nuclei 是一款现代的高性能漏洞扫描器，它利用简单的基于 YAML 的模板。它使您能够设计模仿现实世界条件的自定义漏洞检测场景，从而实现零误报。

- 使用简单 YAML 格式用于创建和自定义漏洞模板
- 由数千名安全专业人员贡献，以解决热门漏洞
- 通过模拟真实世界的步骤来验证漏洞从而降低误报
- 超快并行扫描处理和请求聚类
- 集成到 CI/CD 管道中进行漏洞检测和回归测试
- 支持多种协议，如 TCP、DNS、HTTP、SSL、WHOIS JavaScript、代码等
- 集成 Jira、Splunk、GitHub、Elastic、GitLab。

---

官方推荐将 nuclei 作为独立命令行工具使用而非作为服务运行, 否则可能存在安全风险

---

## 安装

:::tabs

@tab:active Go

```bash
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
```

> - 成功安装 Nuclei 需要最新的 GO 版本
> - 这条命令会触发拉取很多依赖库, 时间可能会比较长

---

@tab 二进制文件

直接在 `https://github.com/projectdiscovery/nuclei/releases` 下载对应的可执行程序

![image-20241119112516136](http://cdn.ayusummer233.top/DailyNotes/202411191125297.png)

![image-20241119142714714](http://cdn.ayusummer233.top/DailyNotes/202411191427019.png)

![image-20241119142743183](http://cdn.ayusummer233.top/DailyNotes/202411191427294.png)

![image-20241119142816477](http://cdn.ayusummer233.top/DailyNotes/202411191428521.png)

![image-20241119142847834](http://cdn.ayusummer233.top/DailyNotes/202411191428890.png)

可以给程序目录加个 PATH:

![image-20241119153635903](http://cdn.ayusummer233.top/DailyNotes/202411191536008.png)

:::











