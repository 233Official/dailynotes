import{_ as h}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as d,a as n,d as k,e as a,r as p,o,f as s,b as i}from"./app-UtrSPjFB.js";const c={};function g(u,e){const r=p("Tabs");return o(),d("div",null,[e[4]||(e[4]=n('<h1 id="redis" tabindex="-1"><a class="header-anchor" href="#redis"><span>Redis</span></a></h1><blockquote><p><a href="https://redis.io/" target="_blank" rel="noopener noreferrer">Redis</a></p><p><a href="https://www.runoob.com/redis/redis-tutorial.html" target="_blank" rel="noopener noreferrer">Redis 教程 | 菜鸟教程 (runoob.com)</a></p></blockquote><hr><p>REmote DIctionary Server(Redis) 是一个由 Salvatore Sanfilippo 写的 key-value 存储系统，是跨平台的非关系型数据库。</p><p>Redis 是一个开源的使用 ANSI C 语言编写、遵守 BSD 协议、支持网络、可基于内存、分布式、可选持久性的键值对(Key-Value)存储数据库，并提供多种语言的 API。</p><p>Redis 通常被称为数据结构服务器，因为值(value) 可以是字符串(String)、哈希(Hash)、列表(list)、集合(sets)和有序集合(sorted sets)等类型。</p><blockquote><p>Redis is an open source (BSD licensed), in-memory <strong>data structure store</strong> used as a database, cache, message broker, and streaming engine.</p></blockquote><ul><li><a href="#redis">Redis</a><ul><li><a href="#%E5%AE%89%E8%A3%85">安装</a><ul><li><a href="#ubuntudebian">Ubuntu/Debian</a></li></ul></li><li><a href="#%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4">常用命令</a></li></ul></li></ul><hr><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装"><span>安装</span></a></h2>',10)),k(r,{id:"56",data:[{id:"Ubuntu/Debian"},{id:"windows"}],active:0},{title0:a(({value:t,isActive:l})=>e[0]||(e[0]=[s("Ubuntu/Debian")])),title1:a(({value:t,isActive:l})=>e[1]||(e[1]=[s("windows")])),tab0:a(({value:t,isActive:l})=>e[2]||(e[2]=[i("div",{class:"language-bash line-numbers-mode","data-highlighter":"shiki","data-ext":"bash","data-title":"bash",style:{"--shiki-light":"#383A42","--shiki-dark":"#abb2bf","--shiki-light-bg":"#FAFAFA","--shiki-dark-bg":"#282c34"}},[i("pre",{class:"shiki shiki-themes one-light one-dark-pro vp-code"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#4078F2","--shiki-dark":"#61AFEF"}},"sudo"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," apt"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," install"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," lsb-release")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#A0A1A7","--shiki-light-font-style":"italic","--shiki-dark":"#7F848E","--shiki-dark-font-style":"italic"}},"# 将仓库加入到 apt index, 并更新以及安装 redis")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#4078F2","--shiki-dark":"#61AFEF"}},"curl"),i("span",{style:{"--shiki-light":"#986801","--shiki-dark":"#D19A66"}}," -fsSL"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," https://packages.redis.io/gpg"),i("span",{style:{"--shiki-light":"#383A42","--shiki-dark":"#ABB2BF"}}," | "),i("span",{style:{"--shiki-light":"#4078F2","--shiki-dark":"#61AFEF"}},"sudo"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," gpg"),i("span",{style:{"--shiki-light":"#986801","--shiki-dark":"#D19A66"}}," --dearmor"),i("span",{style:{"--shiki-light":"#986801","--shiki-dark":"#D19A66"}}," -o"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," /usr/share/keyrings/redis-archive-keyring.gpg")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#0184BC","--shiki-dark":"#56B6C2"}},"echo"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}},' "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $('),i("span",{style:{"--shiki-light":"#4078F2","--shiki-dark":"#61AFEF"}},"lsb_release"),i("span",{style:{"--shiki-light":"#986801","--shiki-dark":"#D19A66"}}," -cs"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}},') main"'),i("span",{style:{"--shiki-light":"#383A42","--shiki-dark":"#ABB2BF"}}," | "),i("span",{style:{"--shiki-light":"#4078F2","--shiki-dark":"#61AFEF"}},"sudo"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," tee"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," /etc/apt/sources.list.d/redis.list")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#4078F2","--shiki-dark":"#61AFEF"}},"sudo"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," apt-get"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," update")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#4078F2","--shiki-dark":"#61AFEF"}},"sudo"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," apt-get"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," install"),i("span",{style:{"--shiki-light":"#50A14F","--shiki-dark":"#98C379"}}," redis")])])]),i("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"}),i("div",{class:"line-number"})])],-1),i("hr",null,null,-1)])),tab1:a(({value:t,isActive:l})=>e[3]||(e[3]=[i("p",null,[s("到 "),i("a",{href:"https://github.com/tporadowski/redis/releases",target:"_blank",rel:"noopener noreferrer"},"Releases · tporadowski/redis --- 发布 · tporadowski/redis (github.com)"),s(" 下载 "),i("code",null,"msi"),s(" 文件进行安装即可")],-1),i("p",null,[s("进入 redis 安装目录, 以管理员方式运行 "),i("code",null,"redis-server.exe"),s(" 即可")],-1)])),_:1}),e[5]||(e[5]=n(`<hr><h2 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令"><span>常用命令</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">ps</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -ef</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">grep</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> redis</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"> # 查看redis服务器进程</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> kill</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -9</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> pid</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"> # 杀死redis服务器</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> killall</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -9</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> redis-server</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"> # 杀死redis服务器</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> redis-server</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> /etc/redis/redis.conf</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"> # 指定加载的配置文件</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">netstat</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -nlt</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">grep</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 6372</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"> # 我们检查Redis的网络监听端口</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>启动与停止</code></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" data-title="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">/etc/init.d/redis-server</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> stop</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">/etc/init.d/redis-server</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> start</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">/etc/init.d/redis-server</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> restart</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="安全相关" tabindex="-1"><a class="header-anchor" href="#安全相关"><span>安全相关</span></a></h2><h3 id="未授权访问" tabindex="-1"><a class="header-anchor" href="#未授权访问"><span>未授权访问</span></a></h3><p>低版本 Redis 默认配置下没有密码并绑定在 <code>0.0.0.0</code>, 因此可以直接被远程连接登入达成未授权访问 Redis 以及读取 Redis 的数据。</p><p>需要注意的是, 使用官网下载的 <code>redis.exe</code> 安装后是挂在 Windows 服务中的, 对应的配置文件是 <code>redis.windows-service.conf</code> 而非 <code>redis.windows</code></p><p>攻击者在未授权访问 Redis 的情况下，利用 Redis 自身的提供的config 命令，可以进行写文件操作</p><ul><li>如果目标服务器为 Linux 设备, 那么攻击者可以将自己的ssh公钥写入目标服务器的 <code>/root/.ssh</code> 文件夹的 <code>authotrized_keys</code> 文件中，进而可以使用对应私钥直接使用ssh服务登录目标服务器。</li><li>如果目标服务器为 Windows 设备 <ul><li>如果其上有 Web 服务的话, 通过暴破目录或者站点上有 php探针啥的页面获取到服务器上的 Web 目录后则可以尝试向其中写 webshell</li></ul></li></ul><hr>`,13))])}const A=h(c,[["render",g],["__file","Redis.html.vue"]]),b=JSON.parse('{"path":"/%E5%90%8E%E7%AB%AF/%E6%95%B0%E6%8D%AE%E5%BA%93/Redis.html","title":"Redis","lang":"zh-CN","frontmatter":{"description":"Redis Redis Redis 教程 | 菜鸟教程 (runoob.com) REmote DIctionary Server(Redis) 是一个由 Salvatore Sanfilippo 写的 key-value 存储系统，是跨平台的非关系型数据库。 Redis 是一个开源的使用 ANSI C 语言编写、遵守 BSD 协议、支持网络、可基于内...","head":[["meta",{"property":"og:url","content":"https://233official.github.io/dailynotes/dailynotes/%E5%90%8E%E7%AB%AF/%E6%95%B0%E6%8D%AE%E5%BA%93/Redis.html"}],["meta",{"property":"og:site_name","content":"DailyNotes"}],["meta",{"property":"og:title","content":"Redis"}],["meta",{"property":"og:description","content":"Redis Redis Redis 教程 | 菜鸟教程 (runoob.com) REmote DIctionary Server(Redis) 是一个由 Salvatore Sanfilippo 写的 key-value 存储系统，是跨平台的非关系型数据库。 Redis 是一个开源的使用 ANSI C 语言编写、遵守 BSD 协议、支持网络、可基于内..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-11-08T10:51:27.000Z"}],["meta",{"property":"article:modified_time","content":"2024-11-08T10:51:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Redis\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-11-08T10:51:27.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"233\\",\\"url\\":\\"https://233official.github.io/dailynotes/\\"}]}"]],"date":"2022-09-14T10:18:16.000Z"},"headers":[{"level":2,"title":"安装","slug":"安装","link":"#安装","children":[]},{"level":2,"title":"常用命令","slug":"常用命令","link":"#常用命令","children":[]},{"level":2,"title":"安全相关","slug":"安全相关","link":"#安全相关","children":[{"level":3,"title":"未授权访问","slug":"未授权访问","link":"#未授权访问","children":[]}]}],"git":{"createdTime":1663150696000,"updatedTime":1731063087000,"contributors":[{"name":"233","username":"233","email":"ayusummer233@vip.qq.com","commits":1,"url":"https://github.com/233"},{"name":"Ayusummer","username":"Ayusummer","email":"ayusummer233@gmail.com","commits":1,"url":"https://github.com/Ayusummer"},{"name":"233Official","username":"233Official","email":"ayusummr233@gmail.com","commits":1,"url":"https://github.com/233Official"},{"name":"咸鱼型233","username":"咸鱼型233","email":"ayusummer233@qq.com","commits":2,"url":"https://github.com/咸鱼型233"},{"name":"233Official","username":"233Official","email":"ayusummer233@qq.com","commits":2,"url":"https://github.com/233Official"}]},"readingTime":{"minutes":2.09,"words":626},"filePathRelative":"后端/数据库/Redis.md","localizedDate":"2022年9月14日","excerpt":"","autoDesc":true}');export{A as comp,b as data};