import{_ as l}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as i,o,c,a as n,d as s,b as a,w as r,e as t}from"./app-rrNGl4lL.js";const u={},d=n("h1",{id:"文件名混淆",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#文件名混淆"},[n("span",null,"文件名混淆")])],-1),m=n("h2",{id:"rlo",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#rlo"},[n("span",null,"RLO")])],-1),v={href:"https://yygq.srayu.ws/post/trojansource/",target:"_blank",rel:"noopener noreferrer"},k=n("p",null,"RLO(Right-to-Left Override）是一种用于改变文本显示方向的特殊控制字符",-1),_=n("p",null,"在Unicode标准中，RLO的字符代码是U+202E。其主要作用是将后续文本的显示方向从默认的左到右（LTR）改为从右到左（RTL）",-1),b=n("p",null,"RLO可以用于例如阿拉伯语和希伯来语等本身是从右到左书写的语言的显示",-1),h={href:"https://codepoints.net/U+202C",target:"_blank",rel:"noopener noreferrer"},f=t('<p><img src="http://cdn.ayusummer233.top/DailyNotes/202406051131187.png" alt="image-20240605113053649"></p><p>例如要把上面这个 <code>msedge.exe</code> 显示上看起来像是个 PDF 文件, 可以先改成 <code>msedgefdp.exe</code></p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202406051134342.png" alt="image-20240605113402020"></p><p>然后在 <code>f</code> 前插入 <code>RLO</code></p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202406051135781.png" alt="image-20240605113525917"></p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202406051348121.png" alt="image-20240605113547878"></p><hr><p>可以写个程序批量给 exe 加 RLO 和文档后缀</p>',8),g=t(`<div class="language-Python line-numbers-mode" data-ext="Python" data-title="Python"><pre class="language-Python"><code># 为指定文件批量生成用 RLO +  PDF,DOC,PPT,XLS 等伪造的文件
from pathlib import Path

def add_rlo_suffix(file_path:Path, new_extension_list:list[str])-&gt;None:
    &quot;&quot;&quot;
    Add an RLO character to the file name to spoof its extension.

    :param file_path: 原始文件路径
    :param new_extension_list: 新扩展名列表
    &quot;&quot;&quot;
    # RLO字符
    rlo_char = &#39;\\u202E&#39;

    base_dir, filename = file_path.parent, file_path.name
    filename, current_extension = filename.rsplit(&#39;.&#39;, 1)
    base_dir = base_dir / filename
    base_dir.mkdir(parents=True, exist_ok=True)

    for new_extension in new_extension_list:
        # 生成新的文件名
        spoofed_file_path = base_dir / f&quot;{filename}{rlo_char}{new_extension[::-1]}.{current_extension}&quot;

        # 保存文件到新的路径
        spoofed_file_path.write_bytes(file_path.read_bytes())
    

original_file = &quot;msedge.exe&quot;
original_file_path = Path(__file__).parent / original_file
new_extension_list = [&quot;pdf&quot;, &quot;doc&quot;,&quot;docx&quot;, &quot;ppt&quot;, &quot;pptx&quot;,&quot;xls&quot;, &quot;xlsx&quot;, &quot;txt&quot;]
spoofed_file = add_rlo_suffix(original_file_path, new_extension_list)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="http://cdn.ayusummer233.top/DailyNotes/202406051459543.png" alt="image-20240605145917917"></p><hr><h3 id="rlo-形近字" tabindex="-1"><a class="header-anchor" href="#rlo-形近字"><span>RLO+形近字</span></a></h3>`,4),y={href:"https://xz.aliyun.com/t/14398?time__1311=mqmx9Q0QW4nmD%2FD0Dx2DUEt8DCYmIh3qqx&alichlgref=https%3A%2F%2Fwww.google.com%2F",target:"_blank",rel:"noopener noreferrer"},x=t(`<p>直接 exe + RLO pdf 人容易被标记, 所以就要引入 pdf 这些字符的形近字</p><hr><h2 id="扩展名伪装" tabindex="-1"><a class="header-anchor" href="#扩展名伪装"><span>扩展名伪装</span></a></h2><p>Windows 文件资源管理器默认不会显示后缀名, 因此在文件名末尾, 扩展名之前添加文档扩展名也是一种常用的伪装钓鱼附件程序的方案</p><p>稍微改一下上面的RLO生成程序来批量构造扩展名伪装文件:</p><div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token comment"># 为指定文件批量生成用 RLO +  PDF,DOC,PPT,XLS 伪造的文件</span>
<span class="token keyword">from</span> pathlib <span class="token keyword">import</span> Path

<span class="token keyword">def</span> <span class="token function">add_fake_suffix</span><span class="token punctuation">(</span>file_path<span class="token punctuation">:</span>Path<span class="token punctuation">,</span> new_extension_list<span class="token punctuation">:</span><span class="token builtin">list</span><span class="token punctuation">[</span><span class="token builtin">str</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">-</span><span class="token operator">&gt;</span><span class="token boolean">None</span><span class="token punctuation">:</span>
    <span class="token triple-quoted-string string">&quot;&quot;&quot;
    :param file_path: 原始文件路径
    :param new_extension_list: 新扩展名列表
    &quot;&quot;&quot;</span>

    base_dir<span class="token punctuation">,</span> filename <span class="token operator">=</span> file_path<span class="token punctuation">.</span>parent<span class="token punctuation">,</span> file_path<span class="token punctuation">.</span>name
    filename<span class="token punctuation">,</span> current_extension <span class="token operator">=</span> filename<span class="token punctuation">.</span>rsplit<span class="token punctuation">(</span><span class="token string">&#39;.&#39;</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span>
    base_dir <span class="token operator">=</span> base_dir <span class="token operator">/</span> <span class="token string-interpolation"><span class="token string">f&quot;</span><span class="token interpolation"><span class="token punctuation">{</span>filename<span class="token punctuation">}</span></span><span class="token string">_fake_extension&quot;</span></span>
    base_dir<span class="token punctuation">.</span>mkdir<span class="token punctuation">(</span>parents<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span> exist_ok<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span>

    <span class="token keyword">for</span> new_extension <span class="token keyword">in</span> new_extension_list<span class="token punctuation">:</span>
        <span class="token comment"># 生成新的文件名</span>
        spoofed_file_path <span class="token operator">=</span> base_dir <span class="token operator">/</span> <span class="token string-interpolation"><span class="token string">f&quot;</span><span class="token interpolation"><span class="token punctuation">{</span>filename<span class="token punctuation">}</span></span><span class="token string">.</span><span class="token interpolation"><span class="token punctuation">{</span>new_extension<span class="token punctuation">}</span></span><span class="token string">.</span><span class="token interpolation"><span class="token punctuation">{</span>current_extension<span class="token punctuation">}</span></span><span class="token string">&quot;</span></span>

        <span class="token comment"># 保存文件到新的路径</span>
        spoofed_file_path<span class="token punctuation">.</span>write_bytes<span class="token punctuation">(</span>file_path<span class="token punctuation">.</span>read_bytes<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    

<span class="token comment"># Example usage</span>
original_file <span class="token operator">=</span> <span class="token string">&quot;msedge.exe&quot;</span>
original_file_path <span class="token operator">=</span> Path<span class="token punctuation">(</span>__file__<span class="token punctuation">)</span><span class="token punctuation">.</span>parent <span class="token operator">/</span> original_file
new_extension_list <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&quot;pdf&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;doc&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;docx&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;ppt&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;pptx&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;xls&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;xlsx&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;txt&quot;</span><span class="token punctuation">]</span>
spoofed_file <span class="token operator">=</span> add_fake_suffix<span class="token punctuation">(</span>original_file_path<span class="token punctuation">,</span> new_extension_list<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="http://cdn.ayusummer233.top/DailyNotes/202406061634777.png" alt="image-20240605152002116"></p><hr><h2 id="超长文件名" tabindex="-1"><a class="header-anchor" href="#超长文件名"><span>超长文件名</span></a></h2><p>Windows文件资源管理器的默认列宽还是比较窄的, 所以一个超长的文件名加上图标也可能会让受害者没能注意到当前 &quot;文档&quot; 其实是个可执行程序, 例如如下这些:</p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202407181114745.png" alt="image-20240718111401546"></p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202407181114204.png" alt="image-20240718111450048"></p><p>例如让 Chatgpt 生成一些有吸引力的文档名称:</p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202407181125666.png" alt="image-20240718112541545"></p><p>看上去还不错</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>《2024年度全球经济形势及未来十年趋势预测分析报告——从宏观经济到微观市场的深度剖析与战略布局建议》
《最新科技前沿：人工智能、大数据与区块链技术在各行业的应用现状及未来发展趋势研究报告》
《应对气候变化：全球环境保护政策与可持续发展战略的综合评估与实施指南——从理论到实践的全面解析》
《医疗健康产业的未来：生物技术、基因编辑与精准医学的革命性突破及其对人类健康的深远影响》
《国际贸易格局重塑：中美欧贸易关系的演变与新兴市场国家的崛起——挑战与机遇并存的全球贸易新常态》
《教育的未来：在线教育、虚拟现实与人工智能在教育领域的创新应用及其对传统教育模式的颠覆性影响》
《城市发展与智慧城市建设：从城市规划到智能交通的全面解决方案——构建宜居、绿色与高效的未来城市》
《全球能源转型：可再生能源、核能与储能技术的发展现状与前景分析——迈向低碳经济的关键路径》
《企业管理新思维：从精益管理到敏捷组织的转型升级——提升企业竞争力与创新能力的最佳实践》
《未来社会的工作与生活方式变革：远程办公、共享经济与智能家居的兴起对社会结构与个人生活的深远影响》
《全面解读未来十年全球科技发展趋势及其对各行业的深远影响与战略应对指南——从人工智能到量子计算的全景分析》
《2024年度全球宏观经济分析与预测报告——深入剖析各国经济政策、贸易关系与市场走势》
《全球健康与医疗产业未来发展趋势白皮书——从生物技术到数字医疗的综合评估与前景展望》
《气候变化与可持续发展战略综合研究报告——全球环境保护政策、能源转型与生态系统修复的全面解析》
《现代教育革命：在线学习、虚拟现实与人工智能在教育领域的应用现状及未来前景》
《智慧城市建设与管理解决方案大全——从智能交通到绿色建筑的创新实践与未来展望》
《企业数字化转型实战指南——从传统业务到数字生态的全流程转型策略与成功案例》
《全球能源格局变化与未来趋势分析——可再生能源、核能与储能技术的现状、挑战与机遇》
《未来工作与生活方式变革深度研究——远程办公、共享经济与智能家居的兴起及其社会影响》
《2024年度国际贸易政策与市场动态报告——中美欧贸易关系、新兴市场机遇与全球供应链重塑》
《2024年度企业网络安全防御指南——红蓝对抗实战案例分析与高级威胁情报解析》
《全面解析红蓝对抗中的防御策略与最佳实践——从入侵检测到威胁狩猎的全方位防护体系构建》
《高效网络防御：红蓝对抗实战经验总结与应对高级持续性威胁的战略建议》
《现代企业红蓝对抗演习报告——从攻击路径分析到防御体系优化的全景透视》
《2024年度网络安全态势感知与威胁情报共享报告——红蓝对抗中的先进防御技术与策略分析》
《全面提升企业防御能力：红蓝对抗演习中的防守方最佳实践与案例研究》
《深入解析红蓝对抗中的防御战术——高级威胁检测与响应、漏洞修补与安全加固》
《网络战中的防御策略：红蓝对抗实战案例分析与全局防御体系构建指南》
《企业网络安全运营中心（SOC）红蓝对抗演习报告——从攻击模拟到防御响应的全面优化》
《2024年度企业红蓝对抗演习综合评估报告——防御方策略优化与安全运营提升的实战经验总结》
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后可以写个脚本批量伪装文件名, 比如</p><div class="language-python line-numbers-mode" data-ext="py" data-title="py"><pre class="language-python"><code><span class="token keyword">import</span> shutil
<span class="token keyword">from</span> pathlib <span class="token keyword">import</span> Path

<span class="token keyword">def</span> <span class="token function">copy_and_rename_files</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token comment"># 当前目录</span>
    current_directory <span class="token operator">=</span> Path<span class="token punctuation">(</span>__file__<span class="token punctuation">)</span><span class="token punctuation">.</span>parent
    
    <span class="token comment"># 文件路径</span>
    filename_path <span class="token operator">=</span> current_directory <span class="token operator">/</span> <span class="token string">&#39;filename.txt&#39;</span>
    source_file_path <span class="token operator">=</span> current_directory <span class="token operator">/</span> <span class="token string">&#39;msedge.exe&#39;</span>
    
    <span class="token keyword">try</span><span class="token punctuation">:</span>
        <span class="token keyword">with</span> <span class="token builtin">open</span><span class="token punctuation">(</span>filename_path<span class="token punctuation">,</span> <span class="token string">&#39;r&#39;</span><span class="token punctuation">,</span> encoding<span class="token operator">=</span><span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> filename_file<span class="token punctuation">:</span>
            <span class="token keyword">for</span> line <span class="token keyword">in</span> filename_file<span class="token punctuation">:</span>
                <span class="token comment"># 去除每行的换行符和空白字符</span>
                new_filename <span class="token operator">=</span> line<span class="token punctuation">.</span>strip<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&#39;.exe&#39;</span>
                
                <span class="token comment"># 新文件路径</span>
                new_file_path <span class="token operator">=</span> current_directory <span class="token operator">/</span> new_filename
                
                <span class="token comment"># 复制并重命名文件</span>
                shutil<span class="token punctuation">.</span>copyfile<span class="token punctuation">(</span>source_file_path<span class="token punctuation">,</span> new_file_path<span class="token punctuation">)</span>
                
                <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f&#39;文件已复制并重命名为: </span><span class="token interpolation"><span class="token punctuation">{</span>new_filename<span class="token punctuation">}</span></span><span class="token string">&#39;</span></span><span class="token punctuation">)</span>
                
    <span class="token keyword">except</span> FileNotFoundError <span class="token keyword">as</span> e<span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f&#39;错误: </span><span class="token interpolation"><span class="token punctuation">{</span>e<span class="token punctuation">}</span></span><span class="token string">&#39;</span></span><span class="token punctuation">)</span>
    <span class="token keyword">except</span> Exception <span class="token keyword">as</span> e<span class="token punctuation">:</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f&#39;发生异常: </span><span class="token interpolation"><span class="token punctuation">{</span>e<span class="token punctuation">}</span></span><span class="token string">&#39;</span></span><span class="token punctuation">)</span>

<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">&#39;__main__&#39;</span><span class="token punctuation">:</span>
    copy_and_rename_files<span class="token punctuation">(</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至于批量加图标这里就不写了,前面有写过</p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202407181341938.png" alt="image-20240718133931593"></p><p>可以看到如果添加了PDF或者word的图标的话不拖动列宽确实不容易看到后缀, 不过文件类型那里还是能看到的, 不过想想目标是针对人类的网络钓鱼, 确实可能会有上钩, 运行了的话就会有上线</p><p><img src="http://cdn.ayusummer233.top/DailyNotes/202407181343196.png" alt="image-20240718134323106"></p><p>当然, 除了图标之外也应当嵌入和文档标题相应的文档效果会更好</p><hr><h2 id="相关链接" tabindex="-1"><a class="header-anchor" href="#相关链接"><span>相关链接</span></a></h2>`,25),q={href:"https://www.jianshu.com/p/dcd250593698",target:"_blank",rel:"noopener noreferrer"},E={href:"https://xz.aliyun.com/t/10339?time__1311=Cqjx2QD%3DiteWqGNDQimOgbtDtt0QtDReOYD",target:"_blank",rel:"noopener noreferrer"},w=n("hr",null,null,-1),B=n("hr",null,null,-1);function D(L,R){const e=i("ExternalLinkIcon"),p=i("RouteLink");return o(),c("div",null,[d,m,n("blockquote",null,[n("p",null,[n("a",v,[s("特洛伊代码 - YYGQ site (srayu.ws)"),a(e)])])]),k,_,b,n("p",null,[s("这个显示效果会一直持续到接下来的一个换行符（或者是一些其他更复杂的规则，譬如 "),n("a",h,[s("U+202C PDF"),a(e)]),s("）")]),f,n("blockquote",null,[n("p",null,[s("伪装程序图标可以参阅"),a(p,{to:"/%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8/%E9%92%93%E9%B1%BC/%E9%92%93%E9%B1%BC%E9%99%84%E4%BB%B6/%E5%AE%89%E8%A3%85%E6%89%93%E5%8C%85%E7%A8%8B%E5%BA%8F/%E5%88%A9%E7%94%A8Winrar%E6%8D%86%E7%BB%91%E6%81%B6%E6%84%8F%E7%A8%8B%E5%BA%8F%E4%B8%8E%E5%90%88%E6%B3%95%E7%A8%8B%E5%BA%8F.html"},{default:r(()=>[s("安装打包程序")]),_:1}),s("那节的内容, 这里没做批量构造")])]),g,n("ul",null,[n("li",null,[n("a",y,[s("【翻译】在普通 PDF 或 EXE 中嵌入恶意可执行文件 - 先知社区 (aliyun.com)"),a(e)])])]),x,n("ul",null,[n("li",null,[n("a",q,[s("钓鱼姿势汇总 - 简书 (jianshu.com)"),a(e)])]),n("li",null,[n("a",E,[s("常见钓鱼招式 - 先知社区 (aliyun.com)"),a(e)])])]),w,B])}const A=l(u,[["render",D],["__file","文件名混淆.html.vue"]]),N=JSON.parse('{"path":"/%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8/%E9%92%93%E9%B1%BC/%E9%92%93%E9%B1%BC%E9%99%84%E4%BB%B6/%E5%8F%AF%E6%89%A7%E8%A1%8C%E7%A8%8B%E5%BA%8F/%E6%96%87%E4%BB%B6%E5%90%8D%E6%B7%B7%E6%B7%86.html","title":"文件名混淆","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"RLO","slug":"rlo","link":"#rlo","children":[{"level":3,"title":"RLO+形近字","slug":"rlo-形近字","link":"#rlo-形近字","children":[]}]},{"level":2,"title":"扩展名伪装","slug":"扩展名伪装","link":"#扩展名伪装","children":[]},{"level":2,"title":"超长文件名","slug":"超长文件名","link":"#超长文件名","children":[]},{"level":2,"title":"相关链接","slug":"相关链接","link":"#相关链接","children":[]}],"git":{"createdTime":1721205878000,"updatedTime":1721702671000,"contributors":[{"name":"233","email":"ayusummer233@gmail.com","commits":3}]},"readingTime":{"minutes":7.43,"words":2228},"filePathRelative":"网络安全/钓鱼/钓鱼附件/可执行程序/文件名混淆.md","localizedDate":"2024年7月17日","excerpt":"\\n<h2>RLO</h2>\\n<blockquote>\\n<p><a href=\\"https://yygq.srayu.ws/post/trojansource/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">特洛伊代码 - YYGQ site (srayu.ws)</a></p>\\n</blockquote>\\n<p>RLO(Right-to-Left Override）是一种用于改变文本显示方向的特殊控制字符</p>\\n<p>在Unicode标准中，RLO的字符代码是U+202E。其主要作用是将后续文本的显示方向从默认的左到右（LTR）改为从右到左（RTL）</p>"}');export{A as comp,N as data};
