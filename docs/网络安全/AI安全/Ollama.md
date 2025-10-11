---
date: 2025-10-09

categories:
  - 网络安全
  - AI安全
tags:
    - Ollama
---

# Ollama

> [Ollama](https://ollama.com/)
>
> [ollama/ollama: Get up and running with Llama 3.2, Mistral, Gemma 2, and other large language models. (github.com)](https://github.com/ollama/ollama)

Ollama 是一个开源应用程序，允许用户在 Windows、Linux 和 macOS 设备上本地部署和操作大型语言模型 （LLM）。

---

## 报告

### Ollama AI模型发现六大漏洞，能导致DoS攻击、模型中毒 - FreeBuf网络安全行业门

> [Ollama AI模型发现六大漏洞，能导致DoS攻击、模型中毒 - FreeBuf网络安全行业门户](https://www.freebuf.com/news/414559.html)
>
> [Ollama AI 框架的严重缺陷可能导致 DoS、模型盗窃和中毒 --- Critical Flaws in Ollama AI Framework Could Enable DoS, Model Theft, and Poisoning (thehackernews.com)](https://thehackernews.com/2024/11/critical-flaws-in-ollama-ai-framework.html)
>
> [更多模型，更多 ProbLLM：Ollama 中的新漏洞 --- More Models, More ProbLLMs: New Vulnerabilities in Ollama | Oligo Security](https://www.oligo.security/blog/more-models-more-probllms)

研究员在 [更多模型，更多 ProbLLM：Ollama 中的新漏洞 --- More Models, More ProbLLMs: New Vulnerabilities in Ollama | Oligo Security](https://www.oligo.security/blog/more-models-more-probllms) 中指出，这些漏洞可能允许攻击者通过单个 HTTP 请求执行广泛的恶意操作，包括拒绝服务 （DoS） 攻击、模型中毒、模型盗窃等。

这 6 个漏洞的简要描述如下 -

- **CVE-2024-39719**（CVSS 评分：7.5）：攻击者可以使用 `/api/create` 端点利用该漏洞来确定服务器中是否存在文件（已在版本 0.1.47 中修复）
- **CVE-2024-39720**（CVSS 评分：8.2）：越界读取漏洞，可通过 `/api/create` 端点导致应用程序崩溃，从而导致 DoS 情况（已在 0.1.46 版本中修复）
- **CVE-2024-39721**（CVSS 分数：7.5）：在将文件 `/dev/random` 作为输入传递时，重复调用 `/api/create` 端点时，会导致资源耗尽并最终导致 DoS 的漏洞（已在 0.1.34 版本中修复）
- **CVE-2024-39722**（CVSS 分数：7.5） ：`api/push` 端点中的路径遍历漏洞，暴露了服务器上存在的文件以及部署 Ollama 的整个目录结构（已在 0.1.46 版本修复）
- 无 CVE 标识符，未修补 漏洞：可通过来自不受信任的来源的 `/api/pull` 终端节点导致模型中毒
- 无 CVE 标识符，未修补 漏洞： 可能导致通过 `/api/push` 终端节点向不受信任的目标进行模型盗窃

对于上述两个未解决的漏洞，Ollama 的维护者建议用户通过代理或 Web 应用程序防火墙过滤哪些端点暴露在了互联网上。

另外，云安全公司Wiz在四个多月前披露了一个影响Ollama的严重漏洞（CVE-2024-37032），该漏洞可被利用来实现远程代码执行。

研究人员表示，因为Ollama 可以上传文件，并具有模型拉取和推送功能，因此将未经授权的Ollama暴露在互联网上，就相当于将Docker套接字暴露在公共互联网上，从而容易被攻击者利用。

---







