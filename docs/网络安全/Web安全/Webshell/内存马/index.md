# 内存马

> [一文看懂内存马 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/web/274466.html)
>
> [Getshell/Mshell: Memshell-攻防内存马研究 (github.com)](https://github.com/Getshell/Mshell?tab=readme-ov-file)

---

- [内存马](#内存马)
  - [内存马简介](#内存马简介)
    - [WebShell变迁](#webshell变迁)
    - [如何实现Webshell内存马](#如何实现webshell内存马)
    - [内存马分类](#内存马分类)

---

## 内存马简介

### WebShell变迁

> [一文看懂内存马 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/web/274466.html)

```mermaid
graph LR
webshell_classification[Webshell分类]
webshell_classification --- big_shell[大马] --- big_shell_info[体积大,功能全<br>会调用系统的关键函数<br>以代码加密进行隐藏]
webshell_classification --- small_shell[小马] --- simall-shell-info[体积小,只有一个上传/读取功能]
webshell_classification --- one-sentence-shell[一句话木马] --- one-sentence-shell-info[代码短,只有一行代码<br>隐蔽性强,由于代码长度短,可以嵌入到合法网页或脚本中,加以混淆,不容易被发现<br>功能强大,虽然只有一句话,但通过执行外部命令,可以用于进行多种恶意操作]
```

内存马是无文件攻击的一种常用手段; 传统文件上传Webshell会落盘容易被检测到

Webshell内存马在内存中写入恶意后门和木马并执行; 黑客可以利用上传工具或网站漏洞植入木马, 区别在于Webshell内存马是无文件马, 利用中间件的进程执行某些恶意代码, 不会有文件落地

---

### 如何实现Webshell内存马

> [一文看懂内存马 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/web/274466.html)

- 目标: 访问任意URL或者指定URL, 带上命令执行参数, 即可让服务器返回命令执行结果

- 实现: 以Java为例, 客户端发起的web请求会依次经过Listener, Filter, Servlet三个组件

  我们只要在这个请求的过程中做手脚, 在内存中修改已有的组件或者动态注册一个新的组件, 插入恶意的shellcode, 就可以达到我们的目的

```mermaid
graph LR
agent((客户端)) --->|Request| Listener[监听器<br>Listener] --- Filter[过滤器<br>Filter] ---> Servlet[伺服器<br>Servlet] --- Filter ---> Listener --->|Response| agent
```

---

### 内存马分类

根据注入方式, 大致可以将内存马分为如下两类

- `servlet-api` 型

  通过命令执行等方式动态注册一个新的 Listener, Filter 或者 Servlet, 从而实现命令执行等功能

  特定框架, 容器的内存马原理与此类似, 如 Spring 的 controller 内存马, tomcat 的 valve 内存马

- 字节码增强型

  通过 java 的 instrumentation 动态修改已有代码, 进而实现命令执行等功能

---























































