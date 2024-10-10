# java-memshell-generator

> [pen4uin/java-memshell-generator: 一款支持自定义的 Java 内存马生成工具｜A customizable Java in-memory webshell generation tool. (github.com)](https://github.com/pen4uin/java-memshell-generator)

-----

## 概述

这是一款支持自定义的 Java 内存马生成工具｜A customizable Java in-memory webshell generation tool.

---

GUI 预览:

![img](http://cdn.ayusummer233.top/DailyNotes/202410101733465.png)

---

### 功能

|  中间件   |     框架      |                       工具 (测试版本)                        |  内存马类型   |  输出格式  |    辅助模块    |
| :-------: | :-----------: | :----------------------------------------------------------: | :-----------: | :--------: | :------------: |
|  Tomcat   |   SpringMVC   | [AntSword](https://github.com/AntSwordProject/antSword) (2.1.15) |   Listener    |   BASE64   |  专项漏洞封装  |
|   Resin   | SpringWebFlux |   [Behinder](https://github.com/rebeyond/Behinder) (4.0.7)   |    Filter     |    BCEL    | 表达式语句封装 |
| WebLogic  |               | [Godzilla](https://github.com/BeichenDream/Godzilla) (4.0.1) |  Interceptor  | BIGINTEGER |                |
|   Jetty   |               | [Neo-reGeorg](https://github.com/L-codes/Neo-reGeorg) (5.1.0) | HandlerMethod |   CLASS    |                |
| WebSphere |               |        [Suo5](https://github.com/zema1/suo5) (0.9.0)         |  TomcatValve  |    JAR     |                |
| Undertow  |               |                            Custom                            |               | JAR_AGENT  |                |
| GlassFish |               |                                                              |               |     JS     |                |
|           |               |                                                              |               |    JSP     |                |

---

### 编译





