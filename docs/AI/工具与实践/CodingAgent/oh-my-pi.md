# oh-my-pi

oh-my-pi（OMP） 是一款开源、终端优先（Terminal-first）的 AI Coding Agent（AI 编程智能体），由 Can Bölük 基于 Mario Zechner 的 Pi 项目扩展开发。

它将大语言模型与代码编辑、文件搜索、终端命令执行、语言服务器（LSP）、调试器（DAP）等开发工具深度集成，使 AI 能够自主分析代码、修改项目、运行测试并协助完成复杂的软件开发任务。

相较于原版 Pi 强调极简和可扩展的设计理念，oh-my-pi 更注重开箱即用的完整开发体验，同时保留高度可配置和可扩展的架构。

## 核心特点

- 多模型支持：兼容多种 LLM 服务商及模型，可灵活切换。
- IDE 级代码理解：集成 LSP 和 DAP，支持符号分析、重构及程序调试。
- 智能工具调用：提供文件读写、搜索、Shell 执行、Python、浏览器等工具。
- Agent Harness：内置 Agent Loop、工具编排、会话管理及上下文管理机制。
- 扩展能力：支持 Skills、MCP、Subagents 和 TypeScript 扩展。
- 多种运行方式：支持终端交互、一次性命令、RPC、ACP 及 SDK 集成。

---

## 快捷键

- 临时切换模型

  - Win - **Alt+P**
  - Mac -  **Option + P**

- 切换当前模型思考深度 - **Shift + Tab** - 循环切换思考档位，圆圈图标随之变化：

  ![image-20261010132628946](http://cdn.ayusummer233.top/DailyNotes/202610101326970.png)

  官方默认 Unicode 图标映射 - 图标定义：[symbols.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/tui/src/theme/symbols.ts#L565-L572):

  | 图标 | 思考档位                |
  | ---- | ----------------------- |
  | ○    | minimal                 |
  | ◔    | low                     |
  | ◑    | medium                  |
  | ◒    | high                    |
  | ◕    | xhigh                   |
  | ◉    | max                     |
  | ⟳    | auto 尚未解析出具体档位 |

- 在 `smol` `default` `slow` 之间切换模型角色 - **Ctrl+P**

  | 角色    | 定位           | 实际效果                                |
  | ------- | -------------- | --------------------------------------- |
  | smol    | 轻量、快速任务 | 使用 config.yml 中分配给 smol 的模型    |
  | default | 日常主模型     | 使用 config.yml 中分配给 default 的模型 |
  | slow    | 复杂、深入任务 | 使用 config.yml 中分配给 slow 的模型    |

---
