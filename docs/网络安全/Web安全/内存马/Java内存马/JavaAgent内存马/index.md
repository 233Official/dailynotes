# Java Agent 内存马

> [Java Instrumentation | 素十八 (su18.org)](https://su18.org/post/irP0RsYK1/)
>
> [JavaWeb 内存马一周目通关攻略 | 素十八 (su18.org)](https://su18.org/post/memory-shell/#基于字节码修改的字节码)

---

- [Java Agent 内存马](#java-agent-内存马)
  - [Java Instrumentation](#java-instrumentation)
  - [Java Agent](#java-agent)
  - [实现](#实现)
  - [TODOLIST](#todolist)

---

## Java Instrumentation

> [Java Instrumentation | 素十八 (su18.org)](https://su18.org/post/irP0RsYK1/)
>
> [RASP技术 · 攻击Java Web应用-Java Web安全(javasec.org)](https://www.javasec.org/java-rasp/)
>
> [Java Instrumentation - i野老i - 博客园 (cnblogs.com)](https://www.cnblogs.com/yelao/p/9841810.html)
>
> [Java Agent介绍_agentmain重载部分类-CSDN博客](https://blog.csdn.net/warren288/article/details/82828989)

---

JDK 1.5 开始，Java新增了 Instrumentation ( Java Agent API )和 JVMTI ( JVM Tool Interface )功能，允许JVM在加载某个 class 文件之前对其字节码进行修改，同时也支持对已加载的 class (类字节码)进行重新加载( Retransform )。

开发者可以在一个普通 Java 程序（带有 main 函数的 Java 类）运行时，通过 –javaagent 参数指定一个特定的 jar 文件（包含 Instrumentation 代理）来启动 Instrumentation 的代理程序。在类的字节码载入 jvm 前会调用 ClassFileTransformer 的 transform 方法，从而实现修改原类方法的功能，实现 AOP 。

在字节码加载前进行注入，一般有两种写法，重写 ClassLoader 或利用 Instrumentation，而如果重写 ClassLoader，仍然对现有代码进行了修改，而 Instrumentation 则可以做到完全无侵入，利用这种特性，衍生出了诸多新型技术和产品，RASP(Runtime Application Self-Protection) 就是其中之一。

---

instrument 的底层实现依赖于 JVMTI ，也就是 JVM Tool Interface ，它是 JVM 暴露出来的一些供用户扩展的接口集合， JVMTI 是基于事件驱动的， JVM 每执行到一定的逻辑就会调用一些事件的回调接口（如果有的话），这些接口可以供开发者去扩展自己的逻辑。 

JVMTIAgent 是一个利用 JVMTI 暴露出来的接口提供了代理启动时加载(agent on load)、代理通过 attach 形式加载(agent on attach)和代理卸载(agent on unload)功能的动态库。

而 instrument agent 可以理解为一类 JVMTIAgent 动态库，别名是 JPLISAgent (Java Programming Language Instrumentation Services Agent)，也就是专门为 Java 语言编写的插桩服务提供支持的代理。

---

## Java Agent

> [Java Agent 内存马学习 | Drunkbaby's Blog (drun1baby.top)](https://drun1baby.top/2023/12/07/Java-Agent-内存马学习/)

Java Agent(JVMTIAgent) 技术总体来说就是可以使用 Instrumentation 提供的 retransform 或 redefine 来动态修改 JVM 中 class 的一种字节码增强技术，可以直接理解为，这是 JVM 层面的一个拦截器。

我们知道Java是一种静态强类型语言，在运行之前必须将其编译成`.class`字节码，然后再交给JVM处理运行。Java Agent 就是一种能在不影响正常编译的前提下，修改 Java 字节码，进而动态地修改已加载或未加载的类、属性和方法的技术。

实际上，平时较为常见的技术如热部署、一些诊断工具等都是基于Java Agent技术来实现的。

就Java Agent技术的具体实现而言, 对于 Agent（代理）来讲，其大致可以分为两种

- 一种是在 JVM 启动前加载的`premain-Agent`
- 另一种是 JVM 启动之后加载的 `agentmain-Agent`

这里我们可以将其理解成一种特殊的 Interceptor（拦截器），如下图:

- `Premain-Agent`

  ![img](http://cdn.ayusummer233.top/DailyNotes/202410231612836.png)

- `agentmain-Agent`:

  ![img](http://cdn.ayusummer233.top/DailyNotes/202410231612975.png)

---



---

## 实现

> [JavaWeb 内存马一周目通关攻略 | 素十八 (su18.org)](https://su18.org/post/memory-shell/#基于字节码修改的字节码)

这里直接来看一下内存马的实现。

> 需要注意的是, 和之前做的 Tomcat Servlet/Listener/Filter 这些内存马不同, Agent 内存马主要是获取到目标主机权限后做权限维持用的

首先是冰蝎作者 rebeyond 师傅，[他的项目](https://github.com/rebeyond/memShell) [rebeyond/memShell: a webshell resides in the memory of java web server (github.com)](https://github.com/rebeyond/memShell) 提出了这种想法，在这个项目中，他 hook 了 Tomcat 的 ApplicationFilterChain 的 `internalDoFilter`方法。

![img](http://cdn.ayusummer233.top/DailyNotes/202410231004788.png)

使用 javassist 在其中插入了自己的判断逻辑，也就是项目的 ReadMe 中 usage 中提供的一些逻辑，

![img](http://cdn.ayusummer233.top/DailyNotes/202410231005600.png)

也就是说在 Tomcat 调用 ApplicationFilterChain 对请求调用 filter 链处理之前加入恶意逻辑。

![img](http://cdn.ayusummer233.top/DailyNotes/202410231006718.png)

agent 端在 `net/rebeyond/behinder/resource/tools` 中，应该是根据不同的类型会上传不同的注入包。

![img](http://cdn.ayusummer233.top/DailyNotes/202410231007882.png)

但是这次不再 Hook Tomcat 的方法，而是选择 Hook 了 Servlet-API 中更具有通用性的 `javax.servlet.http.HttpServlet` 的 `service` 方法，如果检测出是 Weblogic，则选择 Hook `weblogic.servlet.internal.ServletStubImpl` 方法。

![img](http://cdn.ayusummer233.top/DailyNotes/202410231009519.png)

使用插桩技术的 RASP(Runtime Application Self-Protection)、IAST(Interactive Application Security Testing) 的使用者一下就可以明白：如果都能做到这一步了，能玩的就太多了。能下的 Hook 点太多，能玩的姿势也太多了。

---

比如，在 memshell-inject 项目中，su18 师傅模仿冰蝎的实现方式，hook 了 HttpServletRequest 实现类的 `getQueryString` 方法，在方法返回时修改返回内容进行测试。

> TODO: 这部分没有完全看懂， 没复现成功

---

## TODOLIST

- [OneTab - Shared tabs (one-tab.com)](https://www.one-tab.com/page/K2Av-humTrKqGh6Y2QLoUQ)
- [OneTab - Shared tabs (one-tab.com)](https://www.one-tab.com/page/Gk-1RtX6TY-HXIDxT-u7RA)

---

















