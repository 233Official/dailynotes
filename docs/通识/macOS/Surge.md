# Surge

> [我有特别的 Surge 配置和使用技巧-Sukka](https://blog.skk.moe/post/i-have-my-unique-surge-setup/)
>
> [Surge 官方中文指引：理解 Surge 原理](https://manual.nssurge.com/book/understanding-surge/cn/)
>
> [Surge Knowledge Base](https://kb.nssurge.com/surge-knowledge-base/zh)

---

- [Surge](#surge)
  - [配置文件](#配置文件)
    - [规则](#规则)
    - [规则集](#规则集)
    - [配置分离](#配置分离)
  - [脚本（TODO）](#脚本todo)

---

## 配置文件

> [参考配置文件](https://github.com/yuhangrao/Surge/blob/master/General.conf)
>
> [IOS Rule Script](https://github.com/blackmatrix7/ios_rule_script)

可以参考上述超链接配置文件中的注释

---

### 规则

> [Surge 规则系统 / Conners Hua](https://divineengine.net/article/surge-rule-system/)

---

### 规则集

> [规则集 / Surge 使用手册](https://surge.mitsea.com/rule/ruleset)

---

### 配置分离

> [Surge Knowledge Base / 配置分离](https://kb.nssurge.com/surge-knowledge-base/zh/guidelines/detached-profile)

为了满足各种使用场景的复杂性，Surge 支持将配置的一个段分离至另一个或多个文件中。该功能在 UI 层面又被叫做关联配置。

样例：

```yaml
[General]
loglevel = notify

[Proxy]
#!include Proxy1.dconf, Proxy2.dconf

[Proxy Group]
#!include Group.dconf

[Rule]
#!include Rule.dconf
```

其中所引用的另一个文件，必须包含对应段的 [] 声明。因此，该文件既可以是一个只包含部分段的文件（一个或多个），也可以是一个完整的配置。

使用该功能，你可以：

1. 只引用服务商托管配置的 [Proxy] 和 [Proxy Group] 段，自行编写其他段。
2. 在多个配置间共享某几个段的内容。

请注意：

- 在通过 UI 修改配置后，会按照 include 的声明将配置写入对应的分离配置段文件。但是如果一个段中引用了多个分离配置段文件，那么该段的相关内容无法在 UI 中进行编辑。
- 如果引用的是一个托管配置，则和该段相关的配置不可被编辑，但是不影响其他段的调整。
- 文件名的后缀并没有要求，如果是一个完整配置可继续使用 conf 后缀，如果并非一个完整配置建议使用 dconf，dconf 文件在 Surge iOS 里可在列表中显示，并可以使用文本编辑。
- 引用的文件不可以再次去引用另一个文件。

---

- 使用配置分离加规则集可以在机场配置的基础上再拓充公司内网代理之类的策略， 可以用规则集的方式整个需要走公司内网代理的节点

---

## Surge+MacMini作为家庭网关

> [使用 Surge && Mac mini 构建家庭网关 / YaoYao's Blog](https://yaoyao.io/posts/create-home-gateway-with-surge-and-mac-mini)

> TODO: 考虑过阵子再整个二手mini当网管用， 这里 mark 一下参考文章先



---

## 脚本（TODO）

> nobyda
>
> - [巴哈姆特自动签到脚本（适配/开发实例）/ nobyda.github.io](https://nobyda.github.io/2021/07/24/Bahamut_daily_bonus_js_example/)
> - 记录一次Surge & QuantumultX 脚本开发过程 / nobyda.github.io ](https://nobyda.github.io/2021/07/16/BilibiliManga_Js_example/)
> - [Surge & Loon & QX 脚本收集 / nobyda](https://t.me/s/NobyDa)
>
> [Surge 开启脚本功能后，京东自动签到总结](https://www.cnblogs.com/66350-96/p/12316470.html)
>
> [写了个 surge 脚本， hifini 自动定时签到 / V2EX / 分享创造](https://www.v2ex.com/t/1040243)
>
> [Surge自用配置以及模块和脚本 / Rabbit-Spec / 2.3K Star](https://github.com/Rabbit-Spec/Surge)
>
> [有没有实用的 surge 模块和脚本啊 / V2EX / Surge](https://www.v2ex.com/t/964737)

