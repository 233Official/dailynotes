---
category:
  - AI
  - 工具与实践
tags:
  - AI
  - Codex CLI
  - model_instructions_file
  - 配置注入
excerpt: Codex CLI 配置注入方法论——利用 model_instructions_file 合法配置接口注入自定义 system prompt，而非二进制破解或网络劫持。
---

# Codex CLI 配置注入

Codex CLI 的 `config.toml` 提供了一个合法配置入口 `model_instructions_file`，可以指定一个本地 `.md` 文件作为模型的 system prompt。

```toml
model_instructions_file = "./my-instruction.md"
```

这意味着：**不需要修改二进制、不需要劫持网络、不需要 hook 进程**——只需一行配置。这与其他方案有本质区别：

| 方案 | 做法 | 代价 |
|---|---|---|
| **配置注入** | 利用官方配置接口 | 零侵入，可审计 |
| 二进制修补 | 修改二进制 | 高门槛，每次更新需重做 |
| MITM 劫持 | 拦截网络流量 | 需常驻进程 |

## 参考

- [codex-keysmith](https://github.com/Jia-Ethan/codex-keysmith) — 配置注入思路的一个具体实现

  [GPT-5.5 破甲提示词](../../网络安全/AI安全/AI安全破甲技术.md) — 该工具内置的示例指令文件
- [OpenAI Codex CLI](https://github.com/openai/codex)

---

