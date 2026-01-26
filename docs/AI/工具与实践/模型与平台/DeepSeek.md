---
category:
    - AI
    - 大模型
tags:
    - DeepSeek
---
# DeepSeek

> [DeepSeek](https://chat.deepseek.com/)

---

## 使用

- 网页使用
  - [DeepSeek](https://chat.deepseek.com/)
  - [硅基流动](https://cloud.siliconflow.cn/models)
- API 使用
  - NextChat + Deepseek: [[Feature Request\]: 请教怎样在NextChat中使用Deepseek V2的API · Issue #4643 · ChatGPTNextWeb/ChatGPT-Next-Web · GitHub](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/issues/4643)

- 实用集成

  [awesome-deepseek-integration/README_cn.md at main · deepseek-ai/awesome-deepseek-integration · GitHub](https://github.com/deepseek-ai/awesome-deepseek-integration/blob/main/README_cn.md)

  - 结合 VSCode 使用: [awesome-deepseek-integration/docs/continue/README_cn.md at main · deepseek-ai/awesome-deepseek-integration · GitHub](https://github.com/deepseek-ai/awesome-deepseek-integration/blob/main/docs/continue/README_cn.md)
  - 本地 Ollama + DeepSeek: [使用Ollama搭建本地的 AI Copilot 编程助手 - By烟花易冷 (zzfly.net)](https://www.zzfly.net/ollama-deepseek-copilot/)

---

![image-20250304103952175](http://cdn.ayusummer233.top/DailyNotes/202503041039330.png)

- `System Prompt`: 对话开始时给模型的“初始指令”，用于定义模型的角色、回答风格或任务目标

  例如：“你是一个专业翻译，请将中文翻译成英文”或“用简单易懂的语言解释概念”。

  需要避免开放式指令，否则模型可能偏离预期。

- `Max Tokens（最大生成长度）`: 限制模型单次生成的最大文本长度（1 Token ≈ 1个英文单词或3-4个中文字）。

  不同模型有总Token上限（输入+输出），例如：

  - GPT-3.5：通常为 `4096 Tokens`
  - GPT-4：可达 `8192 Tokens` 或更高

  设置建议

  - 短回答（快速回复）：`100-300` tokens
  - 长文本（文章/故事）：`500-1000+` tokens
  - 注意：过长可能导致回答冗余，过短可能截断内容。

- `Temperature（温度）`: 控制输出的随机性。值越高，回答越多样/有创意；值越低，回答越保守/稳定。

  设置建议

  - 严谨场景（如代码、翻译）：`0.2-0.5`
  - 创意场景（如写诗、故事）：`0.7-1.0`
  - 极端随机：`>1.0`（可能导致语句不通）

- `Top-P（核采样）`: 从累积概率超过阈值P的词中选择候选词（动态调整候选词数量）

  设置建议

  - 平衡多样性和质量：`0.7-0.9`
  - 高确定性回答：`0.3-0.5`
  - 通常与Temperature配合使用。

- `Top-K（前K个候选）`: 仅从概率最高的前K个词中选择，限制候选词数量

  设置建议

  - 限制输出范围：`50-100`（常用）
  - 严格筛选：`10-20`（可能过于机械）
  - 与Top-P二选一，通常优先用Top-P。

- `Frequency Penalty（频率惩罚）`: 控制模型生成重复词汇的惩罚力度。值越高，模型越倾向于避免重复使用已生成的词汇；值越低，允许的重复度越高

  通过降低已出现词汇的概率权重，减少重复（例如避免“很好很好很好”这类冗余表达）。

  **取值范围**通常为 `0.0~2.0`（不同平台可能略有差异），默认值为 `0`（无惩罚）。

**参数搭配建议**：

|   **场景**   | Temperature | Top-P | Max Tokens |
| :----------: | :---------: | :---: | :--------: |
| 技术文档生成 |     0.3     |  0.5  |    500     |
| 创意故事写作 |     0.8     |  0.9  |    800     |
|   客服问答   |     0.2     |  0.3  |    200     |
|  开放域闲聊  |     0.7     |  0.8  |    300     |

---

## 本地部署 DeepSeek

> [本地部署deepseek模型保姆级教程](https://blog.lovefc.cn/archives/start.html)

> TODO: 本文详细介绍了如何在本地部署DeepSeek模型，特别是针对Windows系统的用户。文章首先强调了显卡的重要性，并提供了推荐的硬件配置。接着，文章逐步指导用户如何下载并运行Ollama，设置环境变量以避免C盘空间不足的问题。随后，文章介绍了如何通过Ollama下载和运行DeepSeek模型，并提供了不同模型对显存的需求和推荐显卡。最后，文章推荐了几种可视化AI工具，如Chatbox和Next.js Ollama LLM UI，以便用户更方便地使用本地模型。整个教程旨在帮助用户快速、简单地在本地搭建和使用DeepSeek模型。
>
> 目前直接使用联网API或者Web页面聊天的体验都不错，自己本地部署也不是满血，也没有业务需求，暂时没有部署的理由，暂且搁置，后续有需求了再看看

> [使用Ollama搭建本地的 AI Copilot 编程助手 - By烟花易冷 (zzfly.net)](https://www.zzfly.net/ollama-deepseek-copilot/)
>
> [Mac本地部署DeepSeek(简洁版)](https://www.cnblogs.com/NBeveryday/p/18742347/ollama)

---
