---
category:
    - 网络安全
    - 信息收集
tags:
    - Carseat
    - 安全审计
    - TODO
---

# carseat

> [Carseat : A Python Implementation Of Seatbelt](https://kalilinuxtutorials.com/carseat/)

Carseat 是一个基于 Python 的工具，旨在复制知名安全审计工具 Seatbelt 的功能。它专注于远程执行能力，并包含了 Seatbelt 的几乎所有模块。Carseat 专为网络安全专业人员设计，特别适用于在目标主机上收集系统信息和评估安全配置。该工具依赖于两个非标准的 Python 库：`impacket` 和 `pefile`，并且通常需要特权访问才能有效执行其模块。Carseat 提供了灵活的命令执行方式，支持单命令、多命令、分组命令以及带参数的命令。它还支持通过密码、NTLM 哈希或 Kerberos 票据进行身份验证。Carseat 的模块涵盖了安全配置、系统信息、事件日志、浏览器数据和凭证分析等多个方面。尽管 Carseat 继承了 Seatbelt 的功能，但它专注于支持远程执行的模块，并通过 `-group remote` 标志确保所有模块都能远程执行。Carseat 的开发者还借鉴了 Iwan Timmer 的 *tivan* 项目，增强了事件日志解析功能。总体而言，Carseat 是一个强大的安全审计和侦察工具，特别适用于远程环境，同时保持了与现有 Seatbelt 工作流的兼容性。

---

关于上述你提到的方法2使用poetry进行管理，我不是很理解为什么 poetry install后倒入函数就不会出问题了

---

如果我的 modules 并不在当前项目根目录而是在磁盘的另一个位置， 比如 `/Users/summery233/Documents/Repo/Self/DailyNotesCode/Python/summer_modules` ，那么我应该如何在项目中引入这个模块中的函数呢？

