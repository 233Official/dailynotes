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

maven(3.9.3) 

> 实测 Maven 3.9.9也可以, 一般小版本号变动不大, 应该不会出大问题

```bash
mvn package assembly:single
```

- **`mvn package`**: 执行项目的编译、测试，并生成 `.jar` 或 `.war` 文件（具体取决于项目的类型和配置）

  `package` 阶段会根据 `pom.xml` 文件中的配置生成二进制文件。

- `assembly:single`: 使用 Maven 的 `maven-assembly-plugin` 插件将项目和它的依赖打包到一个单独的归档文件中（比如一个“胖” JAR 或者 ZIP 文件）,方便在其他地方运行时不用再手动配置依赖。

> `pom.xml`:
>
> ```xml
> <project xmlns="http://maven.apache.org/POM/4.0.0"
>     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
>     <modelVersion>4.0.0</modelVersion>
>     <!-- 指定了项目的组织或归类，比如这个项目的 groupId 是 jmg，表示这是 jmg 组织或团队的项目 -->
>     <groupId>jmg</groupId>
>     <!-- 项目的唯一标识符 -->
>     <artifactId>java-memshell-generator</artifactId>
>     <!-- pom 表示这是一个父项目的 POM 文件，用于管理多个子模块，而不会直接生成可执行的二进制文件 -->
>     <packaging>pom</packaging>
>     <version>1.0.8</version>
>     <!-- 子模块定义 -->
>     <!-- 这是一个多模块项目，列出了所有子模块。每个 <module> 元素对应一个子项目。这些模块是独立的子项目，但共享父 POM 的依赖和配置 -->
>     <modules>
>         <module>jmg-antsword</module>
>         <module>jmg-behinder</module>
>         <module>jmg-core</module>
>         <module>jmg-custom</module>
>         <module>jmg-godzilla</module>
>         <module>jmg-gui</module>
>         <module>jmg-neoregeorg</module>
>         <module>jmg-suo5</module>
>         <module>jmg-extender</module>
>         <module>jmg-woodpecker</module>
>         <module>jmg-sdk</module>
>         <module>jmg-cli</module>
>         <module>jmg-all</module>
>     </modules>
> 
>     <!-- 项目属性配置 -->
>     <properties>
>         <!-- 项目的源文件编码格式为 UTF-8 -->
>         <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
>         <!-- 编译时使用的 Java 版本为 8(这里只是指定编译时的规范, 实际编译时不强制需要jdk8) -->
>         <maven.compiler.source>8</maven.compiler.source>
>         <!-- 项目源码的编译目标是 Java 8 -->
>         <maven.compiler.target>8</maven.compiler.target>
>     </properties>
> 
>     <!-- 项目的依赖库 -->
>     <!-- 每个 <dependency> 元素定义了项目需要的库及其版本 -->
>     <dependencies>
>         <dependency>
>             <groupId>me.gv7.woodpecker</groupId>
>             <artifactId>woodpecker-bcel</artifactId>
>             <version>0.1.0</version>
>         </dependency>
>         <dependency>
>             <groupId>me.gv7.woodpecker</groupId>
>             <artifactId>woodpecker-tools</artifactId>
>             <version>0.1.1</version>
>         </dependency>
>         <dependency>
>             <groupId>me.gv7.woodpecker</groupId>
>             <artifactId>woodpecker-sdk</artifactId>
>             <version>0.3.0</version>
>         </dependency>
>         <!-- Java Servlet 的 API 库 -->
>         <dependency>
>             <groupId>javax.servlet</groupId>
>             <artifactId>javax.servlet-api</artifactId>
>             <version>4.0.1</version>
>         </dependency>
>         <!-- 字节码操作库 -->
>         <dependency>
>             <groupId>org.javassist</groupId>
>             <artifactId>javassist</artifactId>
>             <version>3.20.0-GA</version>
>         </dependency>
>     </dependencies>
> 
>     <!-- 构建配置 -->
>     <build>
>         <!-- plugins 定义了项目构建时要使用的插件 -->
>         <plugins>
>             <!-- 用于将项目及其所有依赖打包成一个可执行的“胖 JAR”文件。配置中的 jar-with-dependencies 说明了这个 JAR 包会包含所有依赖库 -->
>             <plugin>
>                 <groupId>org.apache.maven.plugins</groupId>
>                 <artifactId>maven-assembly-plugin</artifactId>
>                 <version>3.6.0</version>
>                 <configuration>
>                     <descriptorRefs>
>                         <descriptorRef>jar-with-dependencies</descriptorRef>
>                     </descriptorRefs>
>                 </configuration>
>                 <executions>
>                     <!-- <id> 为 make-assembly 的任务将在 Maven 构建的 package 阶段执 -->
>                     <execution>
>                         <id>make-assembly</id>
>                         <phase>package</phase>
>                         <goals>
>                             <!-- <goal> 为 single，表示只生成一个包含依赖的 JAR 文件 -->
>                             <goal>single</goal>
>                         </goals>
>                     </execution>
>                 </executions>
>             </plugin>
>         </plugins>
>     </build>
> </project>
> ```

> “胖 JAR”（Fat JAR 或 Uber JAR）文件是一种包含了应用程序**所有依赖库**的可执行 JAR 文件。与普通的 JAR 文件不同，胖 JAR 文件不仅打包了应用程序的代码，还打包了项目运行所需的所有外部依赖（如第三方库）。这样，生成的 JAR 文件是一个**独立的可执行文件**，可以在没有外部依赖的情况下运行。

---





