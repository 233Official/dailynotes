import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as s,a as t,o as a}from"./app-UtrSPjFB.js";const l={};function n(p,i){return a(),s("div",null,i[0]||(i[0]=[t(`<h1 id="elementplus" tabindex="-1"><a class="header-anchor" href="#elementplus"><span>ElementPlus</span></a></h1><ul><li><a href="#elementplus">ElementPlus</a><ul><li><a href="#backtop-%E8%B8%A9%E5%9D%91%E8%AE%B0%E5%BD%95">backtop 踩坑记录</a></li><li><a href="#%E8%A1%A8%E5%8D%95">表单</a></li><li><a href="#%E8%A1%A8%E5%8D%95%E6%A0%A1%E9%AA%8C">表单校验</a></li></ul></li></ul><hr><blockquote><p><a href="https://element-plus.gitee.io/zh-CN/component/button.html" target="_blank" rel="noopener noreferrer">Button 按钮 | Element Plus (gitee.io)</a></p></blockquote><ul><li><p><code>安装</code></p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">pnpm</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> install</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> element-plus</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">pnpm</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> i</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> @types/lodash-es@&quot;*&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><code>main.ts</code> 引入</p><div class="language-typescript line-numbers-mode" data-highlighter="shiki" data-ext="typescript" data-title="typescript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> ElementPlus</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;element-plus&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;element-plus/dist/index.css&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><p>使用的时候直接在官网 cpoy 代码使用即可(可能有的组件会要求再装一些库)</p><hr><h2 id="backtop-踩坑记录" tabindex="-1"><a class="header-anchor" href="#backtop-踩坑记录"><span>backtop 踩坑记录</span></a></h2><blockquote><p><a href="https://www.jianshu.com/p/b40d98535c10" target="_blank" rel="noopener noreferrer">Element-ui Backtop 组件使用正确姿势 - 简书 (jianshu.com)</a></p><p><a href="https://element-plus.gitee.io/zh-CN/component/backtop.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%86%85%E5%AE%B9" target="_blank" rel="noopener noreferrer">Backtop 回到顶部 | Element Plus (gitee.io)</a></p><p><a href="https://element.eleme.cn/#/zh-CN/component/backtop" target="_blank" rel="noopener noreferrer">组件-backtop | Element</a></p></blockquote><p><code>ElementPlus</code> 的 <code>backtop</code> 文档和 <code>ELementUI</code> 的<code>backtop</code> 文档有区别</p><p><img src="http://cdn.ayusummer233.top/img/202204062112607.png" alt="image-20220406211225315"></p><p>而恰恰是 <code>ElementPlus</code> 缺的这个 <code>target</code> 在实际使用中容易踩坑</p><p>当外层滚动对象是 <code>el-scrollbar</code> 时, <code>target</code> 除了外层的 <code>el-scrollbar__wrap</code> 外还有个 <code>page-component__scroll</code></p><p><img src="http://cdn.ayusummer233.top/img/202204062116631.png" alt="image-20220406211602331"></p><p><img src="http://cdn.ayusummer233.top/img/202204062115589.gif" alt="msedge_ppd2EOEtd3"></p><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">el-backtop</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">  target</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;.page-component__scroll, .el-scrollbar__wrap&quot;</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">  :right</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;40&quot;</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">  :bottom</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;40&quot;</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">  :visibility-height</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;40&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  &gt;UP&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">el-backtop</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果滚动对象是 <code>div</code> 的话可以将 <code>target</code> 定位到 <code>div</code> 的 <code>class</code></p><p><img src="http://cdn.ayusummer233.top/img/202204062118528.png" alt="image-20220406211804219"></p><div class="language-html line-numbers-mode" data-highlighter="shiki" data-ext="html" data-title="html" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">el-backtop</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> target</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;.box&quot;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> :right</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;40&quot;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> :bottom</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;40&quot;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> :visibility-height</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;1&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  &gt;UP&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">el-backtop</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="http://cdn.ayusummer233.top/img/202204062119433.gif" alt="msedge_b09VxKHBwD"></p><hr><h2 id="表单" tabindex="-1"><a class="header-anchor" href="#表单"><span>表单</span></a></h2><h2 id="表单校验" tabindex="-1"><a class="header-anchor" href="#表单校验"><span>表单校验</span></a></h2><p>先装下 <code>async-validator</code>:</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">pnpm</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> i</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> async-validator</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><hr>`,26)]))}const o=e(l,[["render",n],["__file","ElementPlus.html.vue"]]),d=JSON.parse('{"path":"/%E5%89%8D%E7%AB%AF/VUE/Vue3/ElementPlus.html","title":"ElementPlus","lang":"zh-CN","frontmatter":{"description":"ElementPlus ElementPlus backtop 踩坑记录 表单 表单校验 Button 按钮 | Element Plus (gitee.io) 安装 main.ts 引入 使用的时候直接在官网 cpoy 代码使用即可(可能有的组件会要求再装一些库) backtop 踩坑记录 Element-ui Backtop 组件使用正确姿势 - ...","head":[["meta",{"property":"og:url","content":"https://233official.github.io/dailynotes/dailynotes/%E5%89%8D%E7%AB%AF/VUE/Vue3/ElementPlus.html"}],["meta",{"property":"og:site_name","content":"DailyNotes"}],["meta",{"property":"og:title","content":"ElementPlus"}],["meta",{"property":"og:description","content":"ElementPlus ElementPlus backtop 踩坑记录 表单 表单校验 Button 按钮 | Element Plus (gitee.io) 安装 main.ts 引入 使用的时候直接在官网 cpoy 代码使用即可(可能有的组件会要求再装一些库) backtop 踩坑记录 Element-ui Backtop 组件使用正确姿势 - ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"http://cdn.ayusummer233.top/img/202204062112607.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-04-30T03:40:16.000Z"}],["meta",{"property":"article:modified_time","content":"2024-04-30T03:40:16.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"ElementPlus\\",\\"image\\":[\\"http://cdn.ayusummer233.top/img/202204062112607.png\\",\\"http://cdn.ayusummer233.top/img/202204062116631.png\\",\\"http://cdn.ayusummer233.top/img/202204062115589.gif\\",\\"http://cdn.ayusummer233.top/img/202204062118528.png\\",\\"http://cdn.ayusummer233.top/img/202204062119433.gif\\"],\\"dateModified\\":\\"2024-04-30T03:40:16.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"233\\",\\"url\\":\\"https://233official.github.io/dailynotes/\\"}]}"]],"date":"2024-04-30T03:40:16.000Z"},"headers":[{"level":2,"title":"backtop 踩坑记录","slug":"backtop-踩坑记录","link":"#backtop-踩坑记录","children":[]},{"level":2,"title":"表单","slug":"表单","link":"#表单","children":[]},{"level":2,"title":"表单校验","slug":"表单校验","link":"#表单校验","children":[]}],"git":{"createdTime":1714448416000,"updatedTime":1714448416000,"contributors":[{"name":"233JG","username":"233JG","email":"ayusummer233@gmail.com","commits":1,"url":"https://github.com/233JG"}]},"readingTime":{"minutes":0.94,"words":281},"filePathRelative":"前端/VUE/Vue3/ElementPlus.md","localizedDate":"2024年4月30日","excerpt":"","autoDesc":true}');export{o as comp,d as data};