import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,a as l,o as n}from"./app-UtrSPjFB.js";const o={};function t(s,e){return n(),i("div",null,e[0]||(e[0]=[l(`<h1 id="目录" tabindex="-1"><a class="header-anchor" href="#目录"><span>目录</span></a></h1><ul><li><a href="#%E7%9B%AE%E5%BD%95">目录</a></li><li><a href="#pillow">Pillow</a><ul><li><a href="#image">Image</a><ul><li><a href="#convertmode">convert(mode)</a></li><li><a href="#newmode-size-color0">new(mode, size, color=0)</a></li></ul></li><li><a href="#imagedraw">ImageDraw</a></li></ul></li></ul><hr><h1 id="pillow" tabindex="-1"><a class="header-anchor" href="#pillow"><span>Pillow</span></a></h1><hr><h2 id="image" tabindex="-1"><a class="header-anchor" href="#image"><span>Image</span></a></h2><hr><h3 id="convert-mode" tabindex="-1"><a class="header-anchor" href="#convert-mode"><span>convert(mode)</span></a></h3><ul><li><p><a href="https://blog.csdn.net/qq_32808045/article/details/108855380" target="_blank" rel="noopener noreferrer">[Python] - 图像处理 ------ img.convert()@Exler_yz</a></p><hr></li><li><p>是图像实例对象的一个方法，接受一个 mode 参数，用以指定一种色彩模式</p></li><li><p><code>mode</code></p><ul><li>1: 1位像素，黑白，每字节一个像素存储</li><li>L: 8位像素，黑白</li><li>P: 8位像素，使用调色板映射到任何其他模式</li><li>RGB: 3x8位像素，真彩色</li><li>RGBA: 4x8位像素，带透明度掩模的真彩色</li><li>CMYK: 4x8位像素，分色</li><li>YCbCr: 3x8位像素，彩色视频格式</li><li>I: 32位有符号整数像素</li><li>F: 32位浮点像素</li></ul></li></ul><hr><h3 id="new-mode-size-color-0" tabindex="-1"><a class="header-anchor" href="#new-mode-size-color-0"><span>new(mode, size, color=0)</span></a></h3><div class="language-doc line-numbers-mode" data-highlighter="shiki" data-ext="doc" data-title="doc" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>(function) new: (mode: str, size: _Size, color: str | Tuple[int, ...] | None = ...) -&gt; Image</span></span>
<span class="line"><span>Creates a new image with the given mode and size.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>:param mode: The mode to use for the new image.</span></span>
<span class="line"><span>:param size: A 2-tuple, containing (width, height) in pixels.</span></span>
<span class="line"><span>:param color: What color to use for the image. Default is black.</span></span>
<span class="line"><span>   If given, this should be a single integer or floating point value for single-band modes, and a tuple for multi-band modes (one value per band). When creating RGB images, you can also use color strings as supported by the ImageColor module. If the color is None, the image is not initialised.</span></span>
<span class="line"><span>:returns: An ~PIL.Image.Image object.</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>color 是填充颜色</li></ul><hr><h2 id="imagedraw" tabindex="-1"><a class="header-anchor" href="#imagedraw"><span>ImageDraw</span></a></h2><ul><li>支持 2D 图像, 且与 Image 对象的区别在于 ImageDraw 对象支持绘制</li></ul>`,16)]))}const d=a(o,[["render",t],["__file","Pillow.html.vue"]]),c=JSON.parse('{"path":"/Language/Python/libs/Pillow/Pillow.html","title":"目录","lang":"zh-CN","frontmatter":{"description":"目录 目录 Pillow Image convert(mode) new(mode, size, color=0) ImageDraw Pillow Image convert(mode) [Python] - 图像处理 ------ img.convert()@Exler_yz 是图像实例对象的一个方法，接受一个 mode 参数，用以指定一种色彩模式...","head":[["meta",{"property":"og:url","content":"https://233official.github.io/dailynotes/dailynotes/Language/Python/libs/Pillow/Pillow.html"}],["meta",{"property":"og:site_name","content":"DailyNotes"}],["meta",{"property":"og:title","content":"目录"}],["meta",{"property":"og:description","content":"目录 目录 Pillow Image convert(mode) new(mode, size, color=0) ImageDraw Pillow Image convert(mode) [Python] - 图像处理 ------ img.convert()@Exler_yz 是图像实例对象的一个方法，接受一个 mode 参数，用以指定一种色彩模式..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-09-15T06:52:40.000Z"}],["meta",{"property":"article:modified_time","content":"2023-09-15T06:52:40.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"目录\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-09-15T06:52:40.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"233\\",\\"url\\":\\"https://233official.github.io/dailynotes/\\"}]}"]],"date":"2022-05-26T02:52:59.000Z"},"headers":[{"level":2,"title":"Image","slug":"image","link":"#image","children":[{"level":3,"title":"convert(mode)","slug":"convert-mode","link":"#convert-mode","children":[]},{"level":3,"title":"new(mode, size, color=0)","slug":"new-mode-size-color-0","link":"#new-mode-size-color-0","children":[]}]},{"level":2,"title":"ImageDraw","slug":"imagedraw","link":"#imagedraw","children":[]}],"git":{"createdTime":1653533579000,"updatedTime":1694760760000,"contributors":[{"name":"233Official","username":"233Official","email":"ayusummr233@gmail.com","commits":1,"url":"https://github.com/233Official"},{"name":"Ayusummer","username":"Ayusummer","email":"ayusummer233@qq.com","commits":1,"url":"https://github.com/Ayusummer"}]},"readingTime":{"minutes":1.05,"words":315},"filePathRelative":"Language/Python/libs/Pillow/Pillow.md","localizedDate":"2022年5月26日","excerpt":"","autoDesc":true}');export{d as comp,c as data};