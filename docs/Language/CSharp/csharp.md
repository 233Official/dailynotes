---

---

# csharp

## visual studio 2022 安装net旧版本(net framework4.0)

> [visual studio 2022 安装net旧版本(net framework4.0和4.5) / 海岛Sharp / CSDN](https://blog.csdn.net/qq_39427511/article/details/128071790)

---

尝试编译 BadPotato 时发现当前 VS2022 中缺少 .NETFramwork 4.0 开发者工具包，报错提示可以去 [适用于 Visual Studio 的 .NET SDK / donet.microsoft.com](https://dotnet.microsoft.com/zh-cn/download/visual-studio-sdks?cid=msbuild-developerpacks) 下载相应版本的开发者工具包

不过其中 4.0 没有提供开发者工具包的下载

![image-20241211114319174](http://cdn.ayusummer233.top/DailyNotes/202412111143359.png)

查阅资料，在 [visual studio 2022 安装net旧版本(net framework4.0和4.5) / 海岛Sharp / CSDN](https://blog.csdn.net/qq_39427511/article/details/128071790) 找到了解决方案：通过nuget 下载 4.0 安装包

访问 [Microsoft.NETFramework.ReferenceAssemblies.net40 / nuget](https://www.nuget.org/packages/Microsoft.NETFramework.ReferenceAssemblies.net40#supportedframeworks-body-tab) 并 [Download Package](https://www.nuget.org/api/v2/package/Microsoft.NETFramework.ReferenceAssemblies.net40/1.0.3)

![image-20241211134058238](http://cdn.ayusummer233.top/DailyNotes/202412111340388.png)

解压：

![image-20241211134217483](http://cdn.ayusummer233.top/DailyNotes/202412111342542.png)

找到如下目录：

![image-20241211134326614](http://cdn.ayusummer233.top/DailyNotes/202412111343693.png)

将其拷贝到 `C:\Program Files (x86)\Reference Assemblies\Microsoft\Framework\.NETFramework` 目录下：

![image-20241211134413170](http://cdn.ayusummer233.top/DailyNotes/202412111344256.png)

> 最后一级 `.NETFramework` 可能不存在，此时手动创建即可

然后重启 VisualStudio 即可

> 有了开发者工具包后就可以正常编译 BadPotato 了：
>
> ![image-20241211134517678](http://cdn.ayusummer233.top/DailyNotes/202412111345726.png)

---

