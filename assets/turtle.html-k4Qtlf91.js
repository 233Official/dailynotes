import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,a as l,o as s}from"./app-UtrSPjFB.js";const a={};function r(n,e){return s(),i("div",null,e[0]||(e[0]=[l(`<h1 id="目录" tabindex="-1"><a class="header-anchor" href="#目录"><span>目录</span></a></h1><ul><li><a href="#%E7%9B%AE%E5%BD%95">目录</a></li><li><a href="#turtle">turtle</a><ul><li><a href="#%E9%87%8D%E7%BD%AE">重置</a></li><li><a href="#%E7%94%BB%E5%9C%86">画圆</a></li><li><a href="#turtlespeedspeednone">turtle.speed(speed=None)</a></li><li><a href="#turtlecircleradius-extentnone-stepsnone">turtle.circle(radius, extent=None, steps=None)</a></li><li><a href="#turtlecolormode255">turtle.colormode(255)</a></li><li><a href="#%E7%BB%98%E5%9B%BE%E5%AE%8C%E6%88%90%E5%90%8E%E4%B8%8D%E8%87%AA%E5%8A%A8%E9%80%80%E5%87%BA">绘图完成后不自动退出</a></li><li><a href="#%E9%A2%9C%E8%89%B2%E5%A1%AB%E5%85%85">颜色填充</a></li></ul></li></ul><hr><h1 id="turtle" tabindex="-1"><a class="header-anchor" href="#turtle"><span>turtle</span></a></h1><ul><li>基本上都是照抄<a href="https://docs.python.org/zh-cn/3.9/library/turtle.html#module-turtle" target="_blank" rel="noopener noreferrer">官方文档</a>的</li></ul><hr><h2 id="重置" tabindex="-1"><a class="header-anchor" href="#重置"><span>重置</span></a></h2><ul><li>观感上讲调用此函数之前的海龟绘图在调用该函数后都消失了(清屏)</li><li><code>turtle.reset()</code></li><li><code>turtle.resetscreen()</code></li><li>重置屏幕上的所有海龟为其初始状态。</li></ul><blockquote><p>注解 此 TurtleScreen 方法作为全局函数时只有一个名字 resetscreen。全局函数 reset 所对应的是 Turtle 方法 reset。</p></blockquote><hr><h2 id="画圆" tabindex="-1"><a class="header-anchor" href="#画圆"><span>画圆</span></a></h2><ul><li>画圆之前要搞清楚海龟的朝向,画圆时圆心在海龟正左方距离为 radius 处</li><li><code>turtle.setheading(to_angle)</code></li><li><code>turtle.seth(to_angle)</code></li><li><code>to_angle</code> -- 一个数值 (整型或浮点型)</li><li>设置海龟的朝向为 to_angle。以下是以角度表示的几个常用方向： <img src="http://cdn.ayusummer233.top/img/20210523134615.png" alt="20210523134615"></li></ul><div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" data-title="python" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&gt;&gt;&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> turtle.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">setheading</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">90</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&gt;&gt;&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> turtle.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">heading</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">90.0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><hr><h2 id="turtle-speed-speed-none" tabindex="-1"><a class="header-anchor" href="#turtle-speed-speed-none"><span>turtle.speed(speed=None)</span></a></h2><ul><li><p><code>speed</code> : 一个 [0,10] 范围内的整型数或速度字符串</p><ul><li><code>fastest</code>: 0 最快</li><li><code>fast</code>: 10 快</li><li><code>normal</code>: 6 正常</li><li><code>slow</code>: 3 慢</li><li><code>slowest</code>: 1 最慢</li></ul></li><li><p>此外,隐藏海龟可以显著提升绘制速度</p><ul><li><code>turtle.hideturtle()</code></li><li><code>turtle.ht()</code></li></ul></li></ul><hr><h2 id="turtle-circle-radius-extent-none-steps-none" tabindex="-1"><a class="header-anchor" href="#turtle-circle-radius-extent-none-steps-none"><span>turtle.circle(radius, extent=None, steps=None)</span></a></h2><ul><li><p><code>radius</code> : 一个数值</p></li><li><p><code>extent</code> : 一个数值 (或 None)</p></li><li><p><code>steps</code> : 一个整型数 (或 None)</p><hr></li><li><p>绘制一个 radius 指定半径的圆。圆心在海龟左边 radius 个单位；extent 为一个夹角，用来决定绘制圆的一部分。如未指定 extent*则绘制整个圆。如果 *extent 不是完整圆周，则以当前画笔位置为一个端点绘制圆弧。如果 radius 为正值则朝逆时针方向绘制圆弧，否则朝顺时针方向。最终海龟的朝向会依据 extent 的值而改变。</p></li><li><p>圆实际是以其内切正多边形来近似表示的，其边的数量由 steps 指定。如果未指定边数则会自动确定。此方法也可用来绘制正多边形。</p></li></ul><blockquote><ul><li>要注意的是,画笔起始点位置并非圆心,而是圆心垂线与下圆弧的交点 <img src="https://cdn.ayusummer233.top/image/c4x4voXmXM.gif" alt=""></li></ul></blockquote><hr><h2 id="turtle-colormode-255" tabindex="-1"><a class="header-anchor" href="#turtle-colormode-255"><span>turtle.colormode(255)</span></a></h2><ul><li>turtle色彩模式切换为RGB模式<div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" data-title="python" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">turtle.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">colormode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">255</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li>后面就可以用<code>turtle.color(RGB元组)</code>来给画笔上色了</li></ul><hr><h2 id="绘图完成后不自动退出" tabindex="-1"><a class="header-anchor" href="#绘图完成后不自动退出"><span>绘图完成后不自动退出</span></a></h2><ul><li><code>turtle.exitonclick()</code><br> 绘图完成后点一下绘图界面则绘图窗口关闭</li><li>程序<strong>结尾</strong>加上:<code>turtle.done()</code> 或 <code>turtle.mainloop()</code> 绘图结束,需手动关闭窗口</li></ul><hr><h2 id="颜色填充" tabindex="-1"><a class="header-anchor" href="#颜色填充"><span>颜色填充</span></a></h2><ul><li>绘制图形前调用<div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" data-title="python" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">turtle.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">begin_fill</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li>绘图结束后调用<div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" data-title="python" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">turtle.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">end_fill</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li>即可在绘制的图形中填充绘制时的画笔颜色</li></ul><hr>`,31)]))}const h=t(a,[["render",r],["__file","turtle.html.vue"]]),c=JSON.parse('{"path":"/Language/Python/libs/turtle/turtle.html","title":"目录","lang":"zh-CN","frontmatter":{"description":"目录 目录 turtle 重置 画圆 turtle.speed(speed=None) turtle.circle(radius, extent=None, steps=None) turtle.colormode(255) 绘图完成后不自动退出 颜色填充 turtle 基本上都是照抄官方文档的 重置 观感上讲调用此函数之前的海龟绘图在调用该函数后都消...","head":[["meta",{"property":"og:url","content":"https://233official.github.io/dailynotes/dailynotes/Language/Python/libs/turtle/turtle.html"}],["meta",{"property":"og:site_name","content":"DailyNotes"}],["meta",{"property":"og:title","content":"目录"}],["meta",{"property":"og:description","content":"目录 目录 turtle 重置 画圆 turtle.speed(speed=None) turtle.circle(radius, extent=None, steps=None) turtle.colormode(255) 绘图完成后不自动退出 颜色填充 turtle 基本上都是照抄官方文档的 重置 观感上讲调用此函数之前的海龟绘图在调用该函数后都消..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"http://cdn.ayusummer233.top/img/20210523134615.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-09-15T06:52:40.000Z"}],["meta",{"property":"article:modified_time","content":"2023-09-15T06:52:40.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"目录\\",\\"image\\":[\\"http://cdn.ayusummer233.top/img/20210523134615.png\\",\\"https://cdn.ayusummer233.top/image/c4x4voXmXM.gif\\"],\\"dateModified\\":\\"2023-09-15T06:52:40.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"233\\",\\"url\\":\\"https://233official.github.io/dailynotes/\\"}]}"]],"date":"2022-05-26T02:52:59.000Z"},"headers":[{"level":2,"title":"重置","slug":"重置","link":"#重置","children":[]},{"level":2,"title":"画圆","slug":"画圆","link":"#画圆","children":[]},{"level":2,"title":"turtle.speed(speed=None)","slug":"turtle-speed-speed-none","link":"#turtle-speed-speed-none","children":[]},{"level":2,"title":"turtle.circle(radius, extent=None, steps=None)","slug":"turtle-circle-radius-extent-none-steps-none","link":"#turtle-circle-radius-extent-none-steps-none","children":[]},{"level":2,"title":"turtle.colormode(255)","slug":"turtle-colormode-255","link":"#turtle-colormode-255","children":[]},{"level":2,"title":"绘图完成后不自动退出","slug":"绘图完成后不自动退出","link":"#绘图完成后不自动退出","children":[]},{"level":2,"title":"颜色填充","slug":"颜色填充","link":"#颜色填充","children":[]}],"git":{"createdTime":1653533579000,"updatedTime":1694760760000,"contributors":[{"name":"233Official","username":"233Official","email":"ayusummr233@gmail.com","commits":1,"url":"https://github.com/233Official"},{"name":"233Official","username":"233Official","email":"ayusummer233@qq.com","commits":2,"url":"https://github.com/233Official"},{"name":"Ayusummer","username":"Ayusummer","email":"ayusummer233@qq.com","commits":1,"url":"https://github.com/Ayusummer"}]},"readingTime":{"minutes":2.16,"words":647},"filePathRelative":"Language/Python/libs/turtle/turtle.md","localizedDate":"2022年5月26日","excerpt":"","autoDesc":true}');export{h as comp,c as data};