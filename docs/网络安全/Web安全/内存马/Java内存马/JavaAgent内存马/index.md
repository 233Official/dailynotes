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

## 概述

> [Agent 内存马的攻防之道 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/13110?time__1311=GqmhqUxfxRxIx05DKYYKehxjxo5D8C3WjeD&u_atoken=a8289602f4cac1b80c44ce039236b0bc&u_asig=0a472f9117303430519708908e0044)
>
> [rzte/agentcrack: 不那么一样的 Java Agent 内存马 (github.com)](https://github.com/rzte/agentcrack/)

一般来说，java 内存马主要可以分为两种形式：

- 创建如 controller、servlet、filter、valve 等 java web 组件，并通过如反射等形式进行注册或替换
- 通过 java agent 技术，修改一些关键类 （如 servlet） 的代码

这两种方式可以说各有优劣，对于第一种方式来说，虽然利用起来更为简单，但是需要依赖于具体组件，且由于注入的类位置比较明确且没有实体文件，所以比较容易检测出来。

而 Agent 型内存马，其真正修改的类位置并不固定，且被修改的类并不是纯粹的“内存”类，相对来说检测起来会更复杂一些。而这方面的技术也越来越多，从一开始的落地 Jar 命令执行命令注入，到 Self Attach，再到无文件落地，借助 shellcode 的 Agent 注入。相关的技术实现也越来越精彩。

---

我们用 java agent 的目标就是修改一些关键类, 正常情况下，java agent 在 JVM 中有两种加载形式:

- [Agent_OnLoad](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/jdk/src/share/instrument/InvocationAdapter.c#L144)：相当于 java 运行时，通过 `-javaagent` 参数加载指定的 `agent`。
- [Agent_OnAttach](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/jdk/src/share/instrument/InvocationAdapter.c#L294)：通过 `VM.attach` 方法，向指定的 java 进程中，注入 `agent`。

分析其代码会看到处理逻辑大同小异，主要流程就是创建 [JPLISAgent](https://github.com/openjdk/jdk8u/blob/master/jdk/src/share/instrument/JPLISAgent.h#L96) 以及 `java.lang.instrument.Instrumentation` 实例。然后调用 `agentMain` 或者 `preMain` 进行处理。

我们注入的 `agent` 代码中所能拿到的 `InstrumentationImpl` 就是在上面的逻辑中创建的。

而作为攻击方，我们往往会使用 `redefineClasses` 或者 `addTransform + retransform` 的方式，去修改类。要了解这两种方式分别是怎样修改的需要分析 jvm 中类的加载流程。了解了底层逻辑，才能在攻防之中占据主动地位。

---

## JVM 类加载流程

> [Agent 内存马的攻防之道 - JVM 类加载流程 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/13110?time__1311=GqmhqUxfxRxIx05DKYYKehxjxo5D8C3WjeD&u_atoken=a8289602f4cac1b80c44ce039236b0bc&u_asig=0a472f9117303430519708908e0044)

关于类的加载流程，可以从三个方面去入手：

- 正常的类加载流程
- 被 `redefineClasses` 后的类的加载流程
- 被 `retransformClasses` 后的类的加载流程

如下是 java 类的加载流程图（若图中有不准确的地方，欢迎指正），可结合图下面的文字阐述进行理解。

![28012dcd30eb64bd04a065c04dd43200](http://cdn.ayusummer233.top/DailyNotes/202411041744623.png)

- 在 JVM（Java Virtual Machine）中，每个加载的 Java 类在内存中以 [InstanceKlass](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/hotspot/src/share/vm/oops/instanceKlass.hpp#L43) 的形式存在。

  - `InstanceKlass` 是 HotSpot JVM 的内部类，用于表示一个具体的 Java 类。
  - 它包含了类的所有元数据信息，如类的名称、父类、实现的接口、字段（变量）、方法等。
  - `InstanceKlass` 使 JVM 能够在运行时有效地管理和操作类，例如进行方法调用、字段访问、继承关系检查等

- Java Agent 是一种允许在类加载过程中对类字节码进行修改的技术，常用于性能监控、日志记录、代码注入等。

  - 通过实现 `java.lang.instrument.ClassFileTransformer` 接口，可以拦截并修改类的字节码。

    不过需要注意的是，虽然我们可以在 `ClassFileTransformer.transform` 中能拿到并修改指定类的字修改后的字节码会被 JVM 使用, 但内存中默认情况下其实是不会保存 java 类的原始字节码的。

    > JVM 在加载类时，会将字节码转换为内部的 `InstanceKlass` 结构，并不保留原始的字节码数据。
    >
    > 这意味着一旦类被加载，原始的字节码信息不会存在于内存中，只存在于 `InstanceKlass` 中的元数据

- 正常的 java 类加载时，会从指定位置（一般也就是本地的 jar 包中）获取到类字节码，然后会经过 [JvmtiClassFileLoadHookPoster](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/hotspot/src/share/vm/prims/jvmtiExport.cpp#L511) 的转换后，得到最终的字节码。然后编译优化为对应的 `InstanceKlass`

  - `JvmtiClassFileLoadHookPoster` 中维护着一个 [JvmtiEnv 链](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/hotspot/src/share/vm/prims/jvmtiExport.cpp#L574C12-L574C20) ，我们所用到的 `java agent` 技术中，当 agent 加载时，其实就是在这个 `JvmtiEnv` 链上添加一个 `JvmtiEnv`节点，从而修改类的字节码，如 [post_all_envs()](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/hotspot/src/share/vm/prims/jvmtiExport.cpp#L569) 中所示。

    ![image-20241105111341554](http://cdn.ayusummer233.top/DailyNotes/202411051113745.png)

  - `JvmtiEnv` 实例中有个关键的变量: [`_env_local_storage`](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/hotspot/src/share/vm/prims/jvmtiEnvBase.hpp#L97)，这个变量所对应的类型是[`_JPLISEnvironment`](https://github.com/openjdk/jdk8u/blob/master/jdk/src/share/instrument/JPLISAgent.h#L90)，从中我们可以看到与之关联的 `JPLISAgent`。

    而这个 `JPLISAgent` 就是 `InstrumentationImpl` 构造方法中的 `mNativeAgent`。

    从这个 `_JPLISAgent`中我们也可找到对应的 [instrumentation 实例](https://github.com/openjdk/jdk8u/blob/master/jdk/src/share/instrument/JPLISAgent.h#L100)，以及其要执行的方法: [mTransform](https://github.com/openjdk/jdk8u/blob/master/jdk/src/share/instrument/JPLISAgent.h#L103C1-L103C1)，也就是 `InstrumentationImpl` 类中的 [transform](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/jdk/src/share/classes/sun/instrument/InstrumentationImpl.java#L415) 方法。

  - 对于 `JvmtiEnv` 节点来说，具体的转换流程便是通过 [callback](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/hotspot/src/share/vm/prims/jvmtiExport.cpp#L607) 而实现的，具体的 `callback` 方法便是[eventHandlerClassFileLoadHook](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/jdk/src/share/instrument/InvocationAdapter.c#L476)，从中我们可以看到这个回调函数便是在 [transformClassFile](https://github.com/openjdk/jdk8u/blob/master/jdk/src/share/instrument/JPLISAgent.c#L833) 方法中调用的 `InstrumentationImpl` 对象的 `transform` 方法，这样便回到了我们熟知的 `java` 代码中。

    ![image-20241105111000999](http://cdn.ayusummer233.top/DailyNotes/202411051110325.png)

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
>
> [Agent 内存马的攻防之道 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/13110?time__1311=GqmhqUxfxRxIx05DKYYKehxjxo5D8C3WjeD&u_atoken=a8289602f4cac1b80c44ce039236b0bc&u_asig=0a472f9117303430519708908e0044)
>
> [Java Agent 内存马 - X1r0z Blog (exp10it.io)](https://exp10it.io/2023/01/java-agent-内存马/#利用-java-agent-注入内存马)

Java Agent(JVMTIAgent) 技术总体来说就是可以使用 Instrumentation 提供的 retransform 或 redefine 来动态修改 JVM 中 class 的一种字节码增强技术，可以直接理解为，这是 JVM 层面的一个拦截器。

![image-20241105112605477](http://cdn.ayusummer233.top/DailyNotes/202411051126759.png)

- `redefineClasses`，顾名思义，重定义一个类，与普通的类加载流程相比，这里主要就是将类的来源更换为指定的字节码。具体的类加载流程并无太大差别。

- 当 java 类要被 `retransformClasses`转换时，会根据 `InstanceKlass` [重新生成一份对应的类字节码](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/hotspot/src/share/vm/prims/jvmtiEnv.cpp#L257)，并存入缓存中[`InstanceKlass._cached_class_file`](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/hotspot/src/share/vm/oops/instanceKlass.hpp#L258)，**下次再被`retransformClasses`时将直接使用缓存中的类字节码**。

  > 与正常的类加载流程相比，被 `retransformClasses` 所重新加载的类，不会再经过 `no retransformable jvmti` 链的处理。

- java agent 在被加载时（[onLoad](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/jdk/src/share/instrument/InvocationAdapter.c#L144) / [onAttach](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/jdk/src/share/instrument/InvocationAdapter.c#L294)），jvm 将创建一个 `jvmtiEnv` 实例，对应了上图中的 `no retransformable jvmti 链`。
  - 当第一次添加 `retransformer`（也就是在 `addTransformer` 时指定 `canRetransform` 为 `true`）时，会**通过 [setHasRetransformableTransformers](https://github.com/openjdk/jdk8u/blob/9499e54ebbab17b0f5e48be27c0c7f90806a3c40/jdk/src/share/instrument/JPLISAgent.c#L1061) 方法在 jvmti 链上追加一个新的节点**，也就是上图中的 `retransformable jvmti 链`。
  - 关于图中的 `no retransformable jvmti` 链 与 `retransformable jvmti` 链，其实都是在一条链表上，只不过在使用时根据 [`env->is_retransformable()`](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/hotspot/src/share/vm/prims/jvmtiExport.cpp#L569) 而分为两批使用。在类加载或是被重定义时，对我们在 `java agent` 中添加的 `transformer` 来说，普通的 `transformer` 永远在 `canRetransform` 为 true 的 `transformer` 之前执行。

---

我们知道Java是一种静态强类型语言，在运行之前必须将其编译成`.class`字节码，然后再交给JVM处理运行。Java Agent 就是一种能在不影响正常编译的前提下，修改 Java 字节码，进而动态地修改已加载或未加载的类、属性和方法的技术。

实际上，平时较为常见的技术如热部署、一些诊断工具等都是基于Java Agent技术来实现的。

就Java Agent技术的具体实现而言, 对于 Agent（代理）来讲，其大致可以分为两种

- 一种是在 JVM 启动前通过 `-javaagent` 参数指定加载的`premain-Agent`, 从而在 JVM 启动之前修改 class 内容 (自 JDK 1.5)
- 另一种是 JVM 启动之后通过 `VirtualMachine.attach()` 方法加载的 `agentmain-Agent`,  将 agent 附加在启动后的 JVM 进程中, 进而动态修改 class 内容 (自 JDK 1.6)

两种方式分别需要实现 premain 和 agentmain 方法, 而这些方法又有如下四种签名:

```java
public static void agentmain(String agentArgs, Instrumentation inst);
public static void agentmain(String agentArgs);
public static void premain(String agentArgs, Instrumentation inst);
public static void premain(String agentArgs);
```

> 其中带有 `Instrumentation inst` 参数的方法优先级更高, 会优先被调用

这里我们可以将其理解成一种特殊的 Interceptor（拦截器），如下图:

- `Premain-Agent`

  ![img](http://cdn.ayusummer233.top/DailyNotes/202410231612836.png)

- `agentmain-Agent`:

  ![img](http://cdn.ayusummer233.top/DailyNotes/202410231612975.png)

---

## Java Agent 实例

> [Java Agent 内存马学习 | Drunkbaby's Blog (drun1baby.top)](https://drun1baby.top/2023/12/07/Java-Agent-内存马学习/#几种-Java-Agent-实例)

---

### premain-Agent

![img](http://cdn.ayusummer233.top/DailyNotes/202410240956503.png)

Java 规定 Java Agent 程序必须要打包成 jar 格式,同时需要提供一个 `MANIFEST.MF` 文件来配置 Java Agent 的相关参数

从官方文档中可知晓，首先我们必须实现 premain 方法，同时我们 jar 文件的清单（mainfest）中必须要含有 Premain-Class 属性; 

我们可在命令行利用 **-javaagent** 来实现启动时加载。

---

premain 方法顾名思义，会在我们运行 main 方法之前进行调用，即在运行 main 方法之前会先去调用我们 jar 包中 Premain-Class 类中的 premain 方法

我们首先来实现一个简单的 `premain-Agent`，创建一个 Maven 项目

![image-20241028113637734](http://cdn.ayusummer233.top/DailyNotes/202410281136810.png)

编写一个简单的 `premain-Agent`，创建的类需要实现 premain 方法

```java
package com.summery233;
 
import java.lang.instrument.Instrumentation;
 
public class JavaAgentPremain {
    public static void premain(String args, Instrumentation inst) {
        System.out.println("调用了premain-Agent!");
        System.err.println("传入参数：" + args);
    }
}
```

编辑 `pom.xml` 指定 `Permain-Class`:

```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.2.0</version>
                <configuration>
                    <archive>
                        <manifestEntries>
                            <Premain-Class>com.summery233.JavaAgentPremain</Premain-Class>
                        </manifestEntries>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

> `MANIFEST.MF` 文件是 JAR 文件中的一个特殊文件，用于存储有关 JAR 文件的元数据。它位于 JAR 文件的 `META-INF` 目录中。`MANIFEST.MF` 文件可以包含各种属性，这些属性定义了 JAR 文件的行为和内容。
>
> `常见属性`:
>
> - `Manifest-Version`：清单文件的版本。
> - `Created-By`：创建 JAR 文件的工具和版本。
> - `Main-Class`：指定 JAR 文件的主类（用于可执行 JAR 文件）。
> - `Premain-Class`：指定 Java 代理的预处理类（用于 Java 代理）

然后 `mvn clean package` 编译项目得到一个 jar 包, 可以先将其移出来:

![image-20241028170521142](http://cdn.ayusummer233.top/DailyNotes/202410281705468.png)

---

接着创建一个目标类

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

![image-20241030175744864](http://cdn.ayusummer233.top/DailyNotes/202410301757115.png)

 `mvn clean package` 编译项目得到一个 jar 包, 可以先将其移出来

---

接下来我们只需要在 `java -jar` 中添加 `-javaagent:agent.jar` 即可在启动时优先加载 agent , 而且可利用如下方式获取传入我们的 agentArgs 参数

```bash
java -javaagent:.\permain-agent-demo-agent-0.1.jar=InputArgHello -jar .\permain-agent-demo-main-0.1.jar
```

- `.\permain-agent-demo-agent-0.1.jar=InputArgHello`：指定要加载的 Java 代理 JAR 文件为当前目录下的 `permain-agent-demo-agent-0.1.jar`，并传递参数 `InputArgHello` 给代理。
  - `permain-agent-demo-agent-0.1.jar`：包含代理类的 JAR 文件。	
  - `=InputArgHello`：传递给代理的参数，可以在代理的 premain 方法中使用。
- `-jar .\permain-agent-demo-main-0.1.jar`：指定要运行的 Java 应用程序 JAR 文件为当前目录下的 `permain-agent-demo-main-0.1.jar` 

![image-20241030180227677](http://cdn.ayusummer233.top/DailyNotes/202410301802733.png)

---

或者直接编在一起也行, 毕竟入口点不一样:

![image-20241030180658022](http://cdn.ayusummer233.top/DailyNotes/202410301806101.png)

```powershell
java -javaagent:permain-agent-demo-0.1.jar=InputArgHello -jar permain-agent-demo-0.1.jar
```

![image-20241030180823268](http://cdn.ayusummer233.top/DailyNotes/202410301808322.png)

---

### agentmain-Agent

> [Java Agent 内存马学习 - 几种 Java Agent 实例 - agentmain-Agent | Drunkbaby's Blog (drun1baby.top)](https://drun1baby.top/2023/12/07/Java-Agent-内存马学习/#agentmain-Agent)

相较于 premain-Agent 只能在 JVM 启动前加载，agentmain-Agent 能够在JVM启动之后加载并实现相应的修改字节码功能。

下面我们来了解一下和 JVM 有关的两个类。

---

#### VirtualMachine类

> [Java Agent 内存马学习 - 几种 Java Agent 实例 - agentmain-Agent - VirtualMachine类 | Drunkbaby's Blog (drun1baby.top)](https://drun1baby.top/2023/12/07/Java-Agent-内存马学习/#VirtualMachine类)

`com.sun.tools.attach.VirtualMachine`类可以实现获取JVM信息，内存dump、现成dump、类信息统计（例如JVM加载的类）等功能。

该类允许我们通过给 attach 方法传入一个 JVM 的 PID，来远程连接到该 JVM 上 ，之后我们就可以对连接的 JVM 进行各种操作，如注入 Agent。下面是该类的主要方法

```java
//允许我们传入一个JVM的PID，然后远程连接到该JVM上
VirtualMachine.attach()
 
//向JVM注册一个代理程序agent，在该agent的代理程序中会得到一个Instrumentation实例，该实例可以 在class加载前改变class的字节码，也可以在class加载后重新加载。在调用Instrumentation实例的方法时，这些方法会使用ClassFileTransformer接口中提供的方法进行处理
VirtualMachine.loadAgent()
 
//获得当前所有的JVM列表
VirtualMachine.list()
 
//解除与特定JVM的连接
VirtualMachine.detach()
```

---

每次执行一个 JAR 包时，都会启动一个独立的 Java 进程，每个进程对应一个独立的 JVM 实例。这意味着每个运行的 JAR 文件都有自己独立的内存空间和运行环境。

这里先编译一个可以一直保持运行状态的 jar 包

![image-20241031112957303](http://cdn.ayusummer233.top/DailyNotes/202410311129567.png)

使用 jps 列出当前正在运行的 Java 虚拟机（JVM）进程

![image-20241031151421423](http://cdn.ayusummer233.top/DailyNotes/202410311514627.png)

记下 `16272` 这个 PID

---

然后编写一个 `Agent.jar` 

![image-20241031144730660](http://cdn.ayusummer233.top/DailyNotes/202410311447909.png)

```java
// Agent.java
import java.lang.instrument.Instrumentation;

public class Agent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        System.out.println("Agent 已加载");
        // 添加你的代理逻辑
    }

    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("Agent 已启动");
        // 添加你的代理逻辑
    }
}
```

```properties
# MANIFEST.MF
Manifest-Version: 1.0
Premain-Class: Agent
Agent-Class: Agent
Can-Redefine-Classes: true
Can-Retransform-Classes: true
```

- `Can-Redefine-Classes: true`: 允许代理在运行时重新定义已加载的类

  通过 `Instrumentation` 接口，代理可以修改类的字节码，从而改变类的行为。这在调试、监控或热修复代码时非常有用

- `Can-Retransform-Classes: true`: 允许代理在运行时重新转换已加载的类

  除了重新定义类，代理还可以添加或移除类文件的转换逻辑。这对于实现更复杂的字节码修改和动态功能增强非常有帮助。

```bash
# 编译 Agent 类
javac Agent.java
# 创建 JAR 文件
jar cmf MANIFEST.MF agent.jar Agent.class
```

---

编写 agent 加载代码:

![image-20241031150008374](http://cdn.ayusummer233.top/DailyNotes/202410311500560.png)

```java
import com.sun.tools.attach.VirtualMachine;
import com.sun.tools.attach.AttachNotSupportedException;
import com.sun.tools.attach.AgentLoadException;
import com.sun.tools.attach.AgentInitializationException;
import java.io.IOException;

public class VirtualMachineExample {
    public static void main(String[] args) {
        if (args.length != 2) {
            System.out.println("用法: java VirtualMachineExample <PID> <AgentJarPath>");
            return;
        }
        String pid = args[0];
        String agentJarPath = args[1];
        try {
            // 连接到目标JVM
            VirtualMachine vm = VirtualMachine.attach(pid);

            // 加载Agent
            vm.loadAgent(agentJarPath);

            // 分离
            vm.detach();
            System.out.println("Agent 加载成功");
        } catch (AttachNotSupportedException | IOException | AgentLoadException | AgentInitializationException e) {
            e.printStackTrace();
        }
    }
}
```

编译与执行程序

```powershell
# 编译代码
javac VirtualMachineExample.java
#  使用目标 JVM 的 PID 和 Agent JAR 的路径运行程序
java VirtualMachineExample <PID> <Agent.jar的绝对路径>
```

![image-20241031152140014](http://cdn.ayusummer233.top/DailyNotes/202410311521107.png)

---

#### VirtualMachineDescriptor 类

`com.sun.tools.attach.VirtualMachineDescriptor`类是一个用来描述特定虚拟机的类，其方法可以获取虚拟机的各种信息如PID、虚拟机名称等。下面是一个获取特定虚拟机PID的示例

```java
import com.sun.tools.attach.VirtualMachine;  
import com.sun.tools.attach.VirtualMachineDescriptor;  

import java.util.List;  

public class GetPID {  
    public static void main(String[] args) {  
        if (args.length != 1) {  
            System.out.println("请提供目标 JVM 名称作为参数。");  
            return;  
        }  

        String targetName = args[0];  
        List<VirtualMachineDescriptor> list = VirtualMachine.list();  
        boolean found = false;

        for (VirtualMachineDescriptor vmd : list){  
            if(vmd.displayName().equals(targetName)) {  
                System.out.println("PID: " + vmd.id());  
                found = true;
                break;
            }  
        }  

        if (!found) {
            System.out.println("未找到名称为 " + targetName + " 的 JVM。");
        }
    }  
}
```

先用 `jps -l` 命令看下各个 JVM 进程 PID 和完整的主类或 JAR 文件路径

![image-20241031155217213](http://cdn.ayusummer233.top/DailyNotes/202410311552633.png)

| 参数     | 显示内容                        | 示例输出                                         |
| -------- | ------------------------------- | ------------------------------------------------ |
| `jps`    | PID 和简短的主类名称            | `16272 pending-hello-1.0-SNAPSHOT.jar`           |
| `jps -l` | PID 和完整的主类或 JAR 文件路径 | `16152 c:\Users\Win10Pro\.vscode\extensions\...` |

JVM 的名称指的就是启动 JVM 时指定的主类的完全限定名或所运行的 JAR 文件的完整路径。这些名称用于区分不同的 Java 进程并识别它们所运行的应用程序, 所以需要用 `-l` 参数给出完整输出而不能用 jps 给出的简短名称

![image-20241031155412281](http://cdn.ayusummer233.top/DailyNotes/202410311554380.png)

---

### 动态修改字节码 Instrumentation

> [Java Agent 内存马学习 - 几种 Java Agent 实例 - 动态修改字节码 Instrumentation | Drunkbaby's Blog (drun1baby.top)](https://drun1baby.top/2023/12/07/Java-Agent-内存马学习/#动态修改字节码-Instrumentation)
>
> [Java Agent 内存马|Java Agent|Instrumentation修改字节码 - X1r0z Blog (exp10it.io)](https://exp10it.io/2023/01/java-agent-内存马/#instrumentation-修改字节码)

Instrumentation 是 Java Agent 提供给我们的用于修改 class 字节码的 API, 它的的具体使用可参考官方文档 [java.instrument (Java SE 9 & JDK 9 ) (oracle.com)](https://docs.oracle.com/javase/9/docs/api/java.instrument-summary.html)

如下是几个常用的方法:

```java
// 获取已被 JVM 加载的所有 class
Class[] getAllLoadedClasses();

// 添加 transformer 用于拦截即将被加载或重加载的 class, canRetransform 参数用于指定能否利用该 transformer 重加载某个 class
void addTransformer(ClassFileTransformer transformer, boolean canRetransform);

// 重加载某个 class, 注意在重加载 class 的过程中, 之前设置的 transformer 会拦截该 class
void retransformClasses(Class<?>... classes);
```

添加的 transformer 必须要实现 ClassFileTransformer 接口:

```java
public interface ClassFileTransformer {
    byte[]
    transform(  ClassLoader         loader,
                String              className,
                Class<?>            classBeingRedefined,
                ProtectionDomain    protectionDomain,
                byte[]              classfileBuffer)
        throws IllegalClassFormatException;
}
```

> className 是 JVM 形式的 class name, 例如 `java.util.HashMap` 在 JVM 中的形式为 `java/util/HashMap` (`.` 被替换成了 `/`)
>
> classfileBuffer 是原始的 class 字节码, 如果我们不想修改某个 class 就需要把这个变量原样返回
>
> 剩下的参数一般用不到

---

在实现 premain 的时候，我们除了能获取到 agentArgs 参数，还可以获取 Instrumentation 实例，那么 Instrumentation 实例是什么，在聊这个之前要先简单了解一下 Javassist

---

#### Javassist

Java 字节码以二进制的形式存储在 .class 文件中，每一个.class文件包含一个Java类或接口。Javaassist 就是一个用来处理Java字节码的类库。它可以在一个已经编译好的类中添加新的方法，或者是修改已有的方法，并且不需要对字节码方面有深入的了解。同时也可以通过手动的方式去生成一个新的类对象。其使用方式类似于反射。

---

##### Javassist 示例-Intrumentation-Transformer-agentmain

开一个 maven 项目写一个主类一个目标类

```java
// TargetClass.java
package com.example.target;

public class TargetClass {
    public void targetMethod() {
        System.out.println("原始方法执行");
    }
}
```

---

```java
// Main.java
package com.example.target;

public class Main {
    public static void main(String[] args) {
        TargetClass tc = new TargetClass();
        tc.targetMethod();
    }
}
```

---

```xml
<!-- pom.xml -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0     http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>target-app</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <build>
        <plugins>
            <!-- Maven Shade Plugin，用于打包可执行的 JAR -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.2.4</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <createDependencyReducedPom>false</createDependencyReducedPom>
                            <transformers>
                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>com.example.target.Main</mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

----

然后开一个 maven 项目写 Agent

```java
// Agent.java
package com.summery233.agent;

import java.lang.instrument.Instrumentation;

public class Agent {
    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("Agent 启动");
        inst.addTransformer(new MyTransformer());
    }
}
```

---

```java
// MyTransformer.java
package com.summery233.agent;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.security.ProtectionDomain;

import javassist.*;
import java.io.IOException;

public class MyTransformer implements ClassFileTransformer {

    @Override
    public byte[] transform(ClassLoader loader, String className, Class<?> classBeingRedefined,
            ProtectionDomain protectionDomain, byte[] classfileBuffer)
            throws IllegalClassFormatException {
        // 转换类名格式：com/example/target/TargetClass -> com.example.target.TargetClass
        String transformedClassName = className.replace('/', '.');
        String targetClassName = "com.example.target.TargetClass";

        if (transformedClassName.equals(targetClassName)) {
            try {
                // 获取默认的 ClassPool
                ClassPool classPool = ClassPool.getDefault();
                // 绑定当前线程的类加载器
                classPool.appendClassPath(new LoaderClassPath(loader));

                // 获取目标类
                CtClass ctClass = classPool.get(targetClassName);

                // 获取目标方法
                CtMethod ctMethod = ctClass.getDeclaredMethod("targetMethod");

                // 在方法开头插入代码
                ctMethod.insertBefore("{ System.out.println(\"方法开始执行\"); }");

                // 返回字节码
                byte[] byteCode = ctClass.toBytecode();
                ctClass.detach();
                return byteCode;
            } catch (NotFoundException | CannotCompileException | IOException e) {
                e.printStackTrace();
            }
        }
        // 返回 null 不修改字节码
        return null;
    }
}
```

---

```xml
<!-- pom.xml -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0     http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.summery233</groupId>
    <artifactId>agent</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <dependencies>
        <!-- 引入 Javassist 库 -->
        <dependency>
            <groupId>org.javassist</groupId>
            <artifactId>javassist</artifactId>
            <version>3.29.0-GA</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Maven Shade Plugin，用于打包所有依赖并生成正确的 MANIFEST.MF -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.2.4</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <!-- 打包所有依赖 -->
                            <createDependencyReducedPom>false</createDependencyReducedPom>
                            <transformers>
                                <!-- 指定 Premain-Class -->
                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <manifestEntries>
                                        <Premain-Class>com.summery233.agent.Agent</Premain-Class>
                                    </manifestEntries>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

---

分别打包两个 maven 项目得到两个 jar

![image-20241104095443587](http://cdn.ayusummer233.top/DailyNotes/202411040954942.png)

```powershell
java -javaagent:".\agent-1.0-SNAPSHOT.jar" -jar ".\target-app-1.0-SNAPSHOT.jar"
```

![image-20241104095748443](http://cdn.ayusummer233.top/DailyNotes/202411040957556.png)

---

##### CtClass

`CtClass` 是 Javassist 库中的一个类，表示 Java 类的字节码结构, 可以从 `ClassPool.get(ClassName)`中获取。它允许在运行时动态修改类的结构，例如添加或修改方法和字段。通过 `CtClass`，开发者可以实现类的增强和字节码操作。

例如:

```java
import javassist.*;

public class Example {
    public static void main(String[] args) throws Exception {
        ClassPool pool = ClassPool.getDefault();
        CtClass cc = pool.get("com.example.MyClass");
        
        // 添加一个新方法
        CtMethod newMethod = CtNewMethod.make(
            "public void newMethod() { System.out.println(\"新方法\"); }",
            cc
        );
        cc.addMethod(newMethod);
        
        // 加载修改后的类
        Class<?> clazz = cc.toClass();
        Object obj = clazz.newInstance();
        clazz.getMethod("newMethod").invoke(obj);
    }
}
```

在上面的示例中，`CtClass` 用于加载 `com.example.MyClass` 类，添加一个新方法 `newMethod`，然后将修改后的类加载到 JVM 中并调用该方法。

---

##### ClassPool

`ClassPool`是`CtClass`对象的容器。`CtClass`对象必须从该对象获得。如果`get()`在此对象上调用，则它将搜索表示的各种源`ClassPath` 以查找类文件，然后创建一个`CtClass`表示该类文件的对象。创建的对象将返回给调用者。可以将其理解为一个存放`CtClass`对象的容器。

获得方法： 

```java
ClassPool cp = ClassPool.getDefault();
```

通过 `ClassPool.getDefault()` 获取的 `ClassPool` 使用 JVM 的类搜索路径。

**如果程序运行在 JBoss 或者 Tomcat 等 Web 服务器上，ClassPool 可能无法找到用户的类**，因为Web服务器使用多个类加载器作为系统类加载器。在这种情况下，**ClassPool 必须添加额外的类搜索路径**。

```java
cp.insertClassPath(new ClassClassPath(<Class>));
```

-----

##### CtMethod

同理，可以理解成加强版的`Method`对象。可通过`CtClass.getDeclaredMethod(MethodName)`获取，该类提供了一些方法以便我们能够直接修改方法体

```java
public final class CtMethod extends CtBehavior {
    // 主要的内容都在父类 CtBehavior 中
}
 
// 父类 CtBehavior
public abstract class CtBehavior extends CtMember {
    // 设置方法体
    public void setBody(String src);
 
    // 插入在方法体最前面
    public void insertBefore(String src);
 
    // 插入在方法体最后面
    public void insertAfter(String src);
 
    // 在方法体的某一行插入内容
    public int insertAt(int lineNum, String src);
 
}
```

传递给方法 `insertBefore()` ，`insertAfter()` 和 `insertAt()` 的 String 对象**是由`Javassist` 的编译器编译的**。 由于编译器支持语言扩展，以 $ 开头的几个标识符有特殊的含义：

![img](http://cdn.ayusummer233.top/DailyNotes/202411041105314.png)

---

##### javassist示例-生成与写入类字节码

```java
package com.summery233;

import java.lang.reflect.Modifier;

import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtConstructor;
import javassist.CtField;
import javassist.CtMethod;
import javassist.CtNewMethod;

import java.nio.file.Path;
import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world!");
        try {
            Create_Person();
        } catch (Exception e) {
            System.out.println("使用javassist创建类失败,报错如下:");
            e.printStackTrace();
        }
    }

    public static void Create_Person() throws Exception {

        // 获取 CtClass 对象的容器 ClassPool
        ClassPool classPool = ClassPool.getDefault();

        // 创建一个新类 Javassist.Learning.Person
        CtClass ctClass = classPool.makeClass("javassist.Person");

        // 创建一个类属性 name
        CtField ctField1 = new CtField(classPool.get("java.lang.String"), "name", ctClass);
        // 设置属性访问符
        ctField1.setModifiers(Modifier.PRIVATE);
        // 将 name 属性添加进 Person 中，并设置初始值为 Drunkbaby
        ctClass.addField(ctField1, CtField.Initializer.constant("Drunkbaby"));

        // 向 Person 类中添加 setter 和 getter
        ctClass.addMethod(CtNewMethod.setter("setName", ctField1));
        ctClass.addMethod(CtNewMethod.getter("getName", ctField1));

        // 创建一个无参构造
        CtConstructor ctConstructor = new CtConstructor(new CtClass[] {}, ctClass);
        // 设置方法体
        ctConstructor.setBody("{name = \"Drunkbaby\";}");
        // 向Person类中添加无参构造
        ctClass.addConstructor(ctConstructor);

        // 创建一个类方法printName
        CtMethod ctMethod = new CtMethod(CtClass.voidType, "printName", new CtClass[] {}, ctClass);
        // 设置方法访问符
        ctMethod.setModifiers(Modifier.PRIVATE);
        // 设置方法体
        ctMethod.setBody("{System.out.println(name);}");
        // 将该方法添加进Person中
        ctClass.addMethod(ctMethod);

        ctClass.writeFile("out"); 
    }

}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.summery233</groupId>
    <artifactId>javassist-create-class</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.javassist</groupId>
            <artifactId>javassist</artifactId>
            <version>3.27.0-GA</version>
        </dependency>
    </dependencies>
</project>
```

运行程序会在当前项目目录下生成 `out/javassist`

![image-20241104151530154](http://cdn.ayusummer233.top/DailyNotes/202411041515500.png)

---

##### 使用 javassist 生成恶意 class

在如下场景中, 我们的恶意类需要继承`AbstractTranslet`类，并重写两个`transform()`方法。否则编译无法通过，无法生成`.class`文件。

- `AbstractTranslet` 是 Apache Xalan 库中的一个抽象类，Xalan 是一个用于处理 XSLT 转换的库。改类提供了一些基础设施，用于在 XSLT 转换过程中执行特定的操作。
- 在生成恶意类时，重写 `transform()` 方法可以插入恶意代码，使得在调用这些方法时执行攻击者指定的恶意操作。
- 如果不重写这些方法，编译器会认为类没有实现抽象方法，从而导致编译错误，无法生成有效的 `.class` 文件。

```java
import com.sun.org.apache.xalan.internal.xsltc.DOM;
import com.sun.org.apache.xalan.internal.xsltc.TransletException;
import com.sun.org.apache.xalan.internal.xsltc.runtime.AbstractTranslet;
import com.sun.org.apache.xml.internal.dtm.DTMAxisIterator;
import com.sun.org.apache.xml.internal.serializer.SerializationHandler;
import java.io.IOException;
 
public class shell extends AbstractTranslet {
    public void transform(DOM document, SerializationHandler[] handlers) throws TransletException {
    }
 
    public void transform(DOM document, DTMAxisIterator iterator, SerializationHandler handler) throws TransletException {
    }
 
    public shell() throws IOException {
        try {
            Runtime.getRuntime().exec("calc");
        } catch (Exception var2) {
            var2.printStackTrace();
        }
    }
}
```

但是该恶意类在执行过程中并没有用到重写的方法，所以我们可以直接使用Javassist从字节码层面来生成恶意class，跳过恶意类的编译过程。代码如下。

```java
package javassist;  
  
import java.io.File;  
import java.io.FileOutputStream;  
  
public class EvilPayload {  
  
    public static byte[] getTemplatesImpl(String cmd) {  
        try {  
            ClassPool pool = ClassPool.getDefault();  
            CtClass ctClass = pool.makeClass("Evil");  
            CtClass superClass = pool.get("com.sun.org.apache.xalan.internal.xsltc.runtime.AbstractTranslet");  
            ctClass.setSuperclass(superClass);  
            CtConstructor constructor = ctClass.makeClassInitializer();  
            constructor.setBody(" try {\n" +  
                    " Runtime.getRuntime().exec(\"" + cmd +  
                    "\");\n" +  
                    " } catch (Exception ignored) {\n" +  
                    " }");  
            byte[] bytes = ctClass.toBytecode();  
            ctClass.defrost();  
            return bytes;  
        } catch (Exception e) {  
            e.printStackTrace();  
            return new byte[]{};  
        }  
    }  
  
  
    public static void writeShell() throws Exception {  
        byte[] shell = EvilPayload.getTemplatesImpl("Calc");  
        FileOutputStream fileOutputStream = new FileOutputStream(new File("S"));  
        fileOutputStream.write(shell);  
    }  
  
    public static void main(String[] args) throws Exception {  
        writeShell();  
    }  
}
```

生成的恶意文件被我们输出到了 `S` 这个文件中，其实很多反序列化在用的时候，是没有把这个字节码提取保存出来，本质上还是可以保存的。

保存出来的文件代码如下

```java
//  
// Source code recreated from a .class file by IntelliJ IDEA  
// (powered by FernFlower decompiler)  
//  
  
import com.sun.org.apache.xalan.internal.xsltc.runtime.AbstractTranslet;  
  
public class Evil extends AbstractTranslet {  
    static {  
        try {  
            Runtime.getRuntime().exec("Calc");  
        } catch (Exception var1) {  
        }  
  
    }  
  
    public Evil() {  
    }  
}
```

---

#### Instrumentation

Instrumentation 是 JVMTIAgent（JVM Tool Interface Agent）的一部分，Java agent 通过这个类和目标 JVM 进行交互，从而达到修改数据的效果。

其在 Java 中是一个接口，常用方法如下

```java
public interface Instrumentation {
    
    //增加一个Class 文件的转换器，转换器用于改变 Class 二进制流的数据，参数 canRetransform 设置是否允许重新转换。
    void addTransformer(ClassFileTransformer transformer, boolean canRetransform);
 
    //在类加载之前，重新定义 Class 文件，ClassDefinition 表示对一个类新的定义，如果在类加载之后，需要使用 retransformClasses 方法重新定义。addTransformer方法配置之后，后续的类加载都会被Transformer拦截。对于已经加载过的类，可以执行retransformClasses来重新触发这个Transformer的拦截。类加载的字节码被修改后，除非再次被retransform，否则不会恢复。
    void addTransformer(ClassFileTransformer transformer);
 
    //删除一个类转换器
    boolean removeTransformer(ClassFileTransformer transformer);
 
 
    //在类加载之后，重新定义 Class。这个很重要，该方法是1.6 之后加入的，事实上，该方法是 update 了一个类。
    void retransformClasses(Class<?>... classes) throws UnmodifiableClassException;
 
 
 
    //判断一个类是否被修改
    boolean isModifiableClass(Class<?> theClass);
 
    // 获取目标已经加载的类。
    @SuppressWarnings("rawtypes")
    Class[] getAllLoadedClasses();
 
    //获取一个对象的大小
    long getObjectSize(Object objectToSize);
 
}
```

----

##### ClassFileTransformer

转换类文件，该接口下只有一个方法：transform，重写该方法即可转换任意类文件，并返回新的被取代的类文件，在 java agent 内存马中便是在该方法下重写恶意代码，从而修改原有类文件代码逻辑，与 addTransformer 搭配使用。

```java
//增加一个Class 文件的转换器，转换器用于改变 Class 二进制流的数据，参数 canRetransform 设置是否允许重新转换。  
void addTransformer(ClassFileTransformer transformer, boolean canRetransform);
```

---

### Instrumentation的局限性

> [Java Agent 内存马学习-几种Java Agent 实例-Instrumentation的局限性 | Drunkbaby's Blog (drun1baby.top)](https://drun1baby.top/2023/12/07/Java-Agent-内存马学习/#Instrumentation-的局限性)

大多数情况下，我们使用 Instrumentation 都是使用其字节码插桩的功能，简单来说就是类重定义功能（Class Redefine），但是有以下局限性：

- `	premain 和 agentmain 两种方式**修改字节码**的时机都是类文件加载之后，也就是说必须要带有 Class 类型的参数，不能通过字节码文件和自定义的类名重新定义一个本来不存在的类。

- 类的字节码修改称为类转换 (Class Transform)，类转换其实最终都回归到类重定义 `Instrumentation#redefineClasses` 方法，此方法有以下限制：
  - 新类和老类的父类必须相同
  - 新类和老类实现的接口数也要相同，并且是相同的接口
  - 新类和老类访问符必须一致。 新类和老类字段数和字段名要一致
  - 新类和老类新增或删除的方法必须是 private static/final 修饰的
  - 可以修改方法体

---

## Agent 内存马实现思路

> [Agent 内存马的攻防之道|攻防博弈|攻击方 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/13110?time__1311=GqmhqUxfxRxIx05DKYYKehxjxo5D8C3WjeD&u_atoken=a8289602f4cac1b80c44ce039236b0bc&u_asig=0a472f9117303430519708908e0044#toc-4)

---

对于 agent 型内存马来说，其主要目的就是修改一些关键类的字节码。总的来说有两种方式：

- 借助 [redefineClasses](https://github.com/openjdk/jdk8u/blob/9499e54ebbab17b0f5e48be27c0c7f90806a3c40/jdk/src/share/classes/sun/instrument/InstrumentationImpl.java#L153) 方法去重定义指定的类。参考类转换流程图中的 `Redefine Class`路线。
- 借助 [retransformClasses](https://github.com/openjdk/jdk8u/blob/9499e54ebbab17b0f5e48be27c0c7f90806a3c40/jdk/src/share/classes/sun/instrument/InstrumentationImpl.java#L139)方法，让指定的类重新转换，当然在执行此方法前，需要先用 `addTransform` 方法添加一个 "reTransformer"，从而在对应类重新转换时，用自己刚才添加的 `transformer` 修改对应的类。参考类转换流程图中的 `RetransformClasses` 路线。

当然，具体到实现上，有最基础的，上传一个 `agent.jar` 到受害者服务器，然后再 `loadAgent`从而获取 `Instrumentation` 对象。之后便可以通过 `redefineClasses`或者`retransformClasses`修改关键类。

也有比较复杂的，如 冰蝎的 借助 shellcode 组装出一个 `JPLISAgent`，从而构造出 `Instrumentation`对象。再通过 `redefineClasses` 修改 `javax.servlet.http.HttpServlet`。参考: [论如何优雅的注入 Java Agent 内存马](https://paper.seebug.org/1945/#jplisagent)。

这两者之间更多的体现在`Instrumentation`对象的构造方式不同，冰蝎的这种方式不依赖于 `jvm attach` 也不需要在本地上传 `jar` 包，会更加隐蔽。不过单从修改类的方式来说，都可以归为这两种方式: `redefineClasses` 以及 `retransformClasses`。

---

## Java Agent 内存马实现

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

## Agent 内存马检测思路

> [Agent 内存马的攻防之道|攻防博弈|防守方 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/13110?time__1311=GqmhqUxfxRxIx05DKYYKehxjxo5D8C3WjeD&u_atoken=a8289602f4cac1b80c44ce039236b0bc&u_asig=0a472f9117303430519708908e0044#toc-5)

想要检测某些关键类是否被修改，必须要设法从内存中获取到对应的类。一般来说，能走的也只有两条路：

- 直接解析 jvm 内存，从中 dump 出一些关键类，参考 [CLSHDB](https://github.com/openjdk/jdk8u/blob/9499e54ebbab17b0f5e48be27c0c7f90806a3c40/hotspot/agent/src/share/classes/sun/jvm/hotspot/CLHSDB.java)。不过这种方式非常复杂，类字节码并不是原原本本的存在内存中的，而是经过了编译 优化，且不同版本的 jdk 实现细节也不一样，内存中相关区域也可能会经常更新，所以很少有人会选择使用这种方式
- 同样的借助 java agent 技术，添加自己的 "reTransformer"，并在关键类加载（或是主动对其`retransformClasses`）时，拿到该类真实的字节码进行检测。

就 `java agent`技术来说，防守方有两种使用方式：

- 防护模式：在 java 应用运行时，便加载一个 `java agent`，并添加自己的检测 `reTransformer`，每当关键类加载（或重新加载）时，可以检测该类的字节码是否有异常

  > 在“防护模式”下，防守方占据了先手，可以做到更多，比如监控 `addTransformer` 、监控 `retransformClasses`、监控 `redefineClasses`方法等。

- 临时检测模式：对于正常运行的可能被植入内存马的 java 应用，通过如 [VirtualMachine.attach](https://github.com/openjdk/jdk8u/blob/9499e54ebbab17b0f5e48be27c0c7f90806a3c40/jdk/src/share/classes/com/sun/tools/attach/VirtualMachine.java#L195) 的方式，加载自己的 `java agent`，添加一个临时的 `reTransformer`，进而获取到指定类字节码。

在攻击者占据先手的情况下，攻击者也可能会采用一些方式来阻止防御方 Agent 的加载。例如通过删除 `/tmp/.java_pid<pid>` 文件，来阻止 JVM 进程通信，从而使防御方的 Agent 无法加载; 通过阻止后续 `ClassFileTransformer` 加载的方式，避免被后续的 `Java Agent` 检测等。不过**这些方式在阻止了防御方 Agent 加载的同时，基本上也可以认为正式的暴露了自己**。

---

### 防护模式

> [Agent 内存马的攻防之道|攻防博弈|博弈|防护模式 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/13110?time__1311=GqmhqUxfxRxIx05DKYYKehxjxo5D8C3WjeD&u_atoken=a8289602f4cac1b80c44ce039236b0bc&u_asig=0a472f9117303430519708908e0044#toc-6)

![image-20241105164435801](http://cdn.ayusummer233.top/DailyNotes/202411051644188.png)

防护模式下，相当于防守方在 `retransforrmable jvmti` 链上添加了自己的“检测模块”，每当类重新定义时，检测模块可检测类的字节码是否被恶意修改。

当攻击者通过 `redefineClasses` 修改关键类时，如下图中的红色路径所示，**被重新定义的类会经过防守方的“检测模块”，从而被检测到该类被植入恶意代码**。

![企业微信截图_17307965012497](http://cdn.ayusummer233.top/DailyNotes/202411051648148.png)

---

当攻击者先添加自己的 `reTransfomer`后，再通过 `retransformClasses`修改指定类时，如下图所示，因为攻击者的 `agent` 是在防御者之后注入的，所以其修改类字节码的逻辑（攻击模块）在防御者的“检测模块”之后加载。这种情况下，**虽然防守方可以感知到类被重新加载了，但是却无法拿到被攻击者修改之后的类字节码**。

![5b2f10bf304704b13460d84089f820e9](http://cdn.ayusummer233.top/DailyNotes/202411051655316.png)

---

除了这些外，在防护模式下，只要有类被重定义或是重新转换，都可以被防护模式自己的 agent 感知到，正如 [transform](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/jdk/src/share/classes/java/lang/instrument/ClassFileTransformer.java#L182) 方法中的 `classBeingRedefined` 参数，而在一个正常运行的应用中，几乎不会有这种情况。**所以说，即便防御方事前不知道攻击者将要修改的类，也可以通过这种方式发现某个类被修改了，进而去检测**。

---

### 临时检测模式

这种情况下，往往是攻击方先植入内存马，防御方需要检测关键类是否被修改的情况。

当攻击者选择添加一个 `reTransformer`，然后再 `retransformClasses`使指定的类重新加载时，可以参考上面”防护模式“中的第二张图,只不过这次攻守易位，”检测模块“会在”攻击模块“之后加载，所以**可正常检测到对应的类被攻击者修改。**

![image-20241105165724682](http://cdn.ayusummer233.top/DailyNotes/202411051657812.png)

---

但当攻击者使用 `redefineClasses` 重定义类时，而防御方再检测时，会变的有些不一样。

回到原来的图，可以看到 `retransformClasses`的转换路线中，有个非常关键的概念：“缓存字节码”，也就是 [`_cached_class_file`](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/hotspot/src/share/vm/oops/instanceKlass.hpp#L258)。这是个东西有什么用呢？

![1c559785916a7d106a8d26c8b6ccfd2c](http://cdn.ayusummer233.top/DailyNotes/202411051658357.png)

当防御方通过 `retransformClasses` 重新加载类时，JVM 会先判断对应类是否有缓存，若没有缓存，则会根据当前类生成对应的类字节码，而**这个类字节码其实就是攻击者通过 `redefineClasseses` 所传入的恶意类字节码**。也就是，这种情况下，**防御方是可以检测到关键类被攻击者修改了**。

但是，如果此时该类是缓存的，则会直接使用缓存字节码，而缓存字节码是在**第一次**被`reTransformer`修改时，才会生成（注意，这里“修改”的意思是，只要在 `transform` 方法中，没有返回 `null` ，就认为该类被转换为新类），这里可参考关键代码 [parseClassFile.cpp](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/hotspot/src/share/vm/classfile/classFileParser.cpp#L3757-L3761) 以及 [jvmtiExport.cpp](https://github.com/openjdk/jdk8u/blob/jdk8u121-b13/hotspot/src/share/vm/prims/jvmtiExport.cpp#L616-L633)。所以，如果在攻击者用 `redefineClasses` 重定义关键类之前，对应的类已经有了缓存字节码，此时，防御者再用 `retransformClasses`时，**会直接使攻击者的修改失效**，达到“清除内存马”的效果。但是，这也就意味着，**此时防御者也就无法知道这个类之前是被攻击者修改过的了**。

> TODO: [Agent 内存马的攻防之道 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/13110?time__1311=GqmhqUxfxRxIx05DKYYKehxjxo5D8C3WjeD&u_atoken=a8289602f4cac1b80c44ce039236b0bc&u_asig=0a472f9117303430519708908e0044#toc-6) 作者研究的比较深入, 我没能完全吃完, 重点还是放在内存马的实现上, 后续再回来看攻防对抗

---

## TODOLIST

- [OneTab - Shared tabs (one-tab.com)](https://www.one-tab.com/page/K2Av-humTrKqGh6Y2QLoUQ)
- [OneTab - Shared tabs (one-tab.com)](https://www.one-tab.com/page/Gk-1RtX6TY-HXIDxT-u7RA)
- [03.Java Agent 内存马 · d4m1ts 知识库 (gm7.org)](https://blog.gm7.org/个人知识库/02.代码审计/01.java安全/05.内存马/03.Java Agent 内存马.html)
  - Spring Java Agent 内存马
    - [Java Agent 内存马学习 | Drunkbaby's Blog (drun1baby.top)](https://drun1baby.top/2023/12/07/Java-Agent-内存马学习/#Agent-内存马实战)
- [论如何优雅的注入Java Agent内存马 (qq.com)](https://mp.weixin.qq.com/s/xxaOsJdRE5OoRkMLkIj3Lg)


---

















