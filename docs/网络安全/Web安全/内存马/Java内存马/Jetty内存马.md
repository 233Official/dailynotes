# Jetty内存马

Eclipse Jetty 是一个轻量级、高度可扩展、基于 Java 的 Web 服务器和 Servlet 引擎。Jetty 的目标是以高容量、低延迟的方式支持 Web 协议（HTTP/1、HTTP/2、HTTP/3、WebSocket 等），从而提供最高性能，同时保持易用性和与多年 Servlet 开发的兼容性。

Jetty 是一种现代的完全异步 Web 服务器，作为面向组件的技术有着悠久的历史，可以轻松嵌入到应用程序中，同时仍然为 Web 应用程序部署提供可靠的传统发行版。

---

## 基本信息收集

### 查看版本号

- Web侧的话

  - 响应标头中可能会有 Jetty 版本信息, 例如:

    ![image-20240918162938756](http://cdn.ayusummer233.top/DailyNotes/202409181629820.png)

  - Wappalyzer 应该也是用的上面这种方案获取的版本信息:

    ![image-20240918163003019](http://cdn.ayusummer233.top/DailyNotes/202409181630064.png)

- 主机侧的话

  - 可以在 JavaWeb 项目的 `pom.xml` 中看到 jetty 的版本号

    ![image-20240918162309589](http://cdn.ayusummer233.top/DailyNotes/202409181623686.png)

  - 直接 `find / | grep jetty` 也可能看到相应路径信息中显示的 jetty 版本信息:

    ![image-20240918162417425](http://cdn.ayusummer233.top/DailyNotes/202409181624482.png)

    ---

    ## 构造可用的 Servlet

    Jetty 9.2.x 提供了更加安全且可维护的方式来处理 `Servlet` 的动态注册

    可以通过 `ServletHandler` 和 `ServletHolder` 来动态注册 `Servlet`，并设置 URL 映射。这不再需要反射访问私有字段

    > TODO: 搞不出来, 看了下 `web.xml` 里也没有配置 servlet mapping 之类的, 遂放弃

    ----

    

    

    ---

    ## 构造内存马

    > [Jetty 内存马注入分析 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/12182?time__1311=GqGxRDniiQQ0526Dy7D97rTnikxuYoD#toc-3)
    >
    > [memShell/src/main/java/com/memshell/jetty/FilterBasedWithoutRequest.java at master · feihong-cs/memShell (github.com)](https://github.com/feihong-cs/memShell/blob/master/src/main/java/com/memshell/jetty/FilterBasedWithoutRequest.java)
    >
    > [3gstudent-Blog](https://3gstudent.github.io/)
    >
    > [Java利用技巧——Jetty Servlet型内存马 (3gstudent.github.io)](https://3gstudent.github.io/Java利用技巧-Jetty-Servlet型内存马)

    

    

    





