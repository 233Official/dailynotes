# Java Web

- [Java Web](#java-web)
  - [Servlet容器](#servlet容器)
    - [Tomcat](#tomcat)
      - [Tomcat安装](#tomcat安装)
      - [Tomcat配置](#tomcat配置)
      - [通过Docker快速搭建与使用Tomcat环境](#通过docker快速搭建与使用tomcat环境)
      - [日志](#日志)
    - [Jetty](#jetty)
  - [SpringMVC](#springmvc)

---

## Servlet容器


---

### Tomcat

> [Apache Tomcat® - 欢迎！ --- Apache Tomcat® - Welcome!](https://tomcat.apache.org/)
>

Apache Tomcat® 是 [Jakarta Servlet](https://projects.eclipse.org/projects/ee4j.servlet)、[Jakarta Pages](https://projects.eclipse.org/projects/ee4j.jsp)、[Jakarta Expression Language](https://projects.eclipse.org/projects/ee4j.el)、[Jakarta WebSocket](https://projects.eclipse.org/projects/ee4j.websocket)、[Jakarta Annotations](https://projects.eclipse.org/projects/ee4j.ca) 和 [Jakarta Authentication](https://projects.eclipse.org/projects/ee4j.authentication) 规范的开源实现。这些规范是 [Jakarta EE 平台](https://projects.eclipse.org/projects/ee4j.jakartaee-platform)的一部分。

> Jakarta EE 平台是 Java EE 平台的演变。Tomcat 10 及更高版本实现了作为 Jakarta EE 的一部分开发的规范。Tomcat 9 及更早版本实现了作为 Java EE 的一部分开发的规范。

**特点**：

- 是一个较为成熟且广泛使用的 Java Servlet 容器。
- 提供对 Java EE 规范中 Servlets 和 JSP 的完整支持。
- 支持大多数 Java Web 应用程序的运行，适合中小型应用。
- 配置相对灵活，功能丰富，包括集成了 JNDI、WebSocket、JSP 编译等功能。
- 适合需要一个稳定且功能强大的 Java Web 服务器的应用场景。

**使用场景**：大多数企业级 Web 应用的开发和部署，特别是中小型项目。

---

#### Tomcat安装

> [Apache Tomcat® - Apache Tomcat 8 Software Downloads --- Apache Tomcat® - Apache Tomcat 8 软件下载](https://tomcat.apache.org/download-80.cgi)

![image-20230613111231319](http://cdn.ayusummer233.top/DailyNotes/202306131112390.png)

---

:::tabs

@tab:active Windows

Windows 下直接下 Installer 版本即可

![image-20230613111315190](http://cdn.ayusummer233.top/DailyNotes/202306131113262.png)

安装时会默认 `Server Shutdown Port ` 为 `-1`, 意味着关闭了监听 shutdown 命令的端口, 后续启停可以在 Windows 服务(`services.msc`)中进行操作

![image-20240911113034865](http://cdn.ayusummer233.top/DailyNotes/202409111130092.png)

![image-20240911113602199](http://cdn.ayusummer233.top/DailyNotes/202409111136271.png)

![image-20240911113638114](http://cdn.ayusummer233.top/DailyNotes/202409111136185.png)

安装完成会自动启动:

![image-20240911141212043](http://cdn.ayusummer233.top/DailyNotes/202409111412187.png)

![image-20240911141233887](http://cdn.ayusummer233.top/DailyNotes/202409111412947.png)

也可以使用 Tomcat 安装目录中的 `bin/startup.bat` 启动 Tomcat

可以访问 `http://localhost:8080/` 如果显示如下页面则表明 Tomcat 安装成功

![image-20240911142749708](http://cdn.ayusummer233.top/DailyNotes/202409111427788.png)

---

@tab Linux(Debian)(未成功,归档)

> [如何在 Debian 11 上安装 Apache Tomcat ? - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000043079401#item-2)
>
> [Apache Tomcat® - Apache Tomcat 9 Software Downloads](https://tomcat.apache.org/download-90.cgi)

下载如下压缩包:

![image-20240911153916523](http://cdn.ayusummer233.top/DailyNotes/202409111539652.png)

```bash
wget https://dlcdn.apache.org/tomcat/tomcat-9/v9.0.94/bin/apache-tomcat-9.0.94.tar.gz
```

```bash
# 在 /opt 目录中新建一个目录(/opt 目录通常用于存放“可选”或第三方的软件包)
mkdir /opt/tomcat
# 在 /opt/tomcat 路径中使用 tar 命令提取二进制文件
sudo tar -xvf apache-tomcat-9.0.94.tar.gz -C /opt/tomcat --strip-components=1
```

- `--strip-components=1`：

  - 这个选项用于删除归档文件路径中的前 N 层目录。`1` 表示删除路径中的第一层目录。

  - 压缩包中的文件路径为 `apache-tomcat-9.0.94/bin/`, `apache-tomcat-9.0.94/conf/` 等

    使用 `--strip-components=1` 之后解压到 `/opt/tomcat` 时，这些文件会直接解压到 `/opt/tomcat/bin/`，`/opt/tomcat/conf/`，去掉了最外层的 `apache-tomcat-9.0.94` 目录

---

为 Tomcat 创建一个新的用户组

```bash
# 创建一个名为 tomcat 的组
sudo groupadd tomcat
# 创建 tomcat 用户，并将用户添加到 tomcat 组中，以 /opt /tomcat 作为主目录
sudo useradd -s /bin/false -g tomcat -d /opt/tomcat tomcat
```

- `-s /bin/false`: 设置用户的登录 shell 为 `/bin/false`，这意味着该用户无法登录到系统
- `-g tomcat`: 将该用户加入到已有的 `tomcat` 组中
- `-d /opt/tomcat`: 设置用户的主目录为 `/opt/tomcat`
- `tomcat`: 要创建的新用户的用户名

---

配置用户权限:

使用 Chown 和 Chomd 命令给 /opt /tomcat 目录设置用户和权限

```bash
sudo chown -R tomcat: /opt/tomcat
sudo sh -c 'chmod +x /opt/tomcat/bin/*.sh'
```

- `chown`: 用于更改文件或目录的所有者
  - `-R`: 表示递归操作，将更改应用于目录下的所有子目录和文件。
  - `tomcat:`: 指定新的文件或目录的拥有者为 `tomcat` 用户。后面的冒号表示没有指定组名，默认使用 `tomcat` 用户的主组。
  - `/opt/tomcat` 目标目录，即要更改拥有者的目录。
- `sh -c`: 使用 `sh` shell 执行后面引号中的命令。`-c` 表示执行字符串中的命令
  - `chmod +x`: 改变文件模式命令，使文件具有可执行权限 (`+x`)
  - `/opt/tomcat/bin/*.sh`: 目标是 `/opt/tomcat/bin/` 目录中的所有 `.sh` 脚本文件（`*.sh` 是匹配所有 `.sh` 文件的通配符）

---

我们需要使 Apache Tomcat 作为一个可以启动、停止和启用的系统服务在后台运行

默认情况下，Tomcat 不附带 systemd 单元文件，因此，我们将手动创建它，如下所示

```bash
sudo vi /etc/systemd/system/tomcat.service
# 有 VSCode 之类的编辑器编辑的话可以直接 touch 空文件
touch /etc/systemd/system/tomcat.service
```

填入如下内容:

```properties
[Unit]
Description=Tomcat webs servlet container
After=network.target
[Service]
Type=forking
User=tomcat
Group=tomcat
RestartSec=10
Restart=always
Environment="JAVA_HOME=/usr/lib/jvm/java-1.11.0-openjdk-amd64"
Environment="JAVA_OPTS=-Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom"
Environment="CATALINA_BASE=/opt/tomcat"
Environment="CATALINA_HOME=/opt/tomcat"
Environment="CATALINA_PID=/opt/tomcat/temp/tomcat.pid"
Environment="CATALINA_OPTS=-Xms512M -Xmx1024M -server -XX:+UseParallelGC"
ExecStart=/opt/tomcat/bin/startup.sh
ExecStop=/opt/tomcat/bin/shutdown.sh
[Install]
WantedBy=multi-user.target
```

> 上述 Java 路径可以按照需要自行配置, 使用如下命令可以查看当前 Java 路径:
>
> ```bash
> update-java-alternatives -l
> # 或者:
> update-alternatives --config java
> ```
>
> ![image-20240911161009846](http://cdn.ayusummer233.top/DailyNotes/202409111610955.png)

保存更改并退出文件，然后重新运行 systemd 生成器并重新加载所有单元文件。

```bash
$ sudo systemctl daemon-reload
```

---

启用并启动 Tomcat 守护进程

准备好 Tomcat 的 systemd 文件后，启动 Apache Tomcat 守护进程，并使其在系统启动时启动

```bash
$ sudo systemctl daemon-reload
$ sudo systemctl start tomcat
# systemctl start tomcat 总是失败的话可以直接运行如下启动脚本启动
/opt/tomcat/bin/startup.sh

$ sudo systemctl enable tomcat
```

---

添加 Tomcat Admin 用户并配置角色

我们需要配置一个管理用户来访问 Tomcat web 页面上的服务器状态、主机管理器和管理器应用程序部分。否则，我们将在浏览器上遇到错误。

为此，我们将编辑 Tomcat 用户配置文件

```bash
$ sudo vi /opt/tomcat/conf/tomcat-users.xml
```

在 `</tomcat-users>` 标签之前粘贴以下代码行。随意指定自己的用户名和密码值。

```xml
<role rolename="admin"/>
<role rolename="admin-gui"/>
<role rolename="manager"/>
<role rolename="manager-gui"/>
<user username="linuxtechi" password="<enetr-password-here>" roles="admin,admin-gui,manager,manager-gui"/>
```

---

管理 Apache Tomcat 的远程访问

默认情况下，只能从主机系统访问 Tomcat 的 web 界面。因此，我们需要通过手动编辑 context.xml 配置文件来配置对 Tomcat Manager 的远程访问。

```bash
$ sudo vi /opt/tomcat/webapps/manager/META-INF/context.xml
```

向下滚动并注释这些行

![image-20240911163823180](http://cdn.ayusummer233.top/DailyNotes/202409111638279.png)

保存文件并退出。接下来，我们需要允许远程访问 Host Manager。因此，编辑主机管理器的 context.xml 文件。

```bash
$ sudo vi /opt/tomcat/webapps/host-manager/META-INF/context.xml
```

![image-20240911163925729](http://cdn.ayusummer233.top/DailyNotes/202409111639817.png)

---

保存更改并退出配置文件。要应用所做的所有更改，请重新启动 Tomcat。

```bash
$ sudo systemctl restart tomcat
# 或者使用脚本来停止与启动
/opt/tomcat/bin/shutdown.sh
/opt/tomcat/bin/startup.sh
```

---

:::

---

#### Tomcat配置

> [Apache Tomcat 9 （9.0.94） - 简介 --- Apache Tomcat 9 (9.0.94) - Introduction](https://tomcat.apache.org/tomcat-9.0-doc/introduction.html)

安装完 Tomcat 后可以配置下环境变量, 系统变量中添加 `CATALINA_HOME`  指向 Tomcat 目录

![image-20240911142434113](http://cdn.ayusummer233.top/DailyNotes/202409111424166.png)

---

#### 通过Docker快速搭建与使用Tomcat环境

可以直接使用 Tomcat 官方的 Docker 容器快速构建 Tomcat 环境:

```bash
# 拉取镜像
docker pull tomcat:7
docker pull tomcat:8
docker pull tomcat:9

# 运行容器 -d(后台运行) --name(给容器命名,后续可以使用此容器名称操作容器而不需要去查询与复制容器ID)
docker run -d --name tomcat8 -p 9908:8080 tomcat:8
```

![image-20240925104307502](http://cdn.ayusummer233.top/DailyNotes/202409251043734.png)

![image-20240925104345950](http://cdn.ayusummer233.top/DailyNotes/202409251043034.png)

![image-20240925104355226](http://cdn.ayusummer233.top/DailyNotes/202409251043301.png)

![image-20240925105516976](http://cdn.ayusummer233.top/DailyNotes/202409251055067.png)

可以直接使用 VSCode 的 RemoteDevelopment 扩展与容器交互操作容器

![image-20240925105614760](http://cdn.ayusummer233.top/DailyNotes/202409251056853.png)

![image-20240925105701601](http://cdn.ayusummer233.top/DailyNotes/202409251057684.png)

![image-20240925110011109](http://cdn.ayusummer233.top/DailyNotes/202409251100222.png)

在 `/usr/local/tomcat` 目录下有 `webapps` 和 `webapps.dist`

- `webapps`: Tomcat 默认的 Web 应用程序目录, 实际部署的应用放置于此 
- `webapps.dist`: Webapps 的备份/示例文件副本, 包含一些默认的应用程序结构及配置文件

webapps 目录下有一些子目录:

- **`docs`**：包含 Tomcat 的文档和相关示例，帮助用户理解 Tomcat 的使用和配置方法。通常包括用户手册、API 文档等。

- **`examples`**：提供了多种示例 Web 应用，展示了如何使用 Servlet、JSP 和其他 Java EE 技术。

  这些示例应用有助于开发者快速了解如何构建和部署 Java Web 应用。

- **`host-manager`**：Tomcat 的虚拟主机管理应用，允许用户通过 Web 界面管理和配置虚拟主机

  通过该界面，可以添加、删除和配置虚拟主机的相关设置。

  Tomcat 的虚拟主机管理应用是一个用于管理多个虚拟主机的工具，允许在同一 Tomcat 实例上托管多个网站或 Web 应用, 用户可以在同一服务器上托管多个不同的域名（例如 `example1.com` 和 `example2.com`），每个域名可以指向不同的 Web 应用。

- **`manager`**：Tomcat 的管理应用，用于管理部署的 Web 应用，包括启动、停止、重新加载和查看应用的状态

  它提供了一个 Web 界面，方便用户管理 Tomcat 实例中的所有应用。

- **`ROOT`**：Tomcat 的根应用目录，通常用于部署默认的 Web 应用。

  如果将一个应用放在 `ROOT` 目录下，它将会在根 URL（例如 `http://localhost:8080/`）下访问。

---

这里要快速部署一个示例 Web 应用的话可以直接把 ROOT 目录整个拷贝到 webapps 里来:

![image-20240925112247021](http://cdn.ayusummer233.top/DailyNotes/202409251122135.png)

---

#### 日志

在 Tomcat 的 log 目录下通常可以看到如下这些日志文件

![image-20240925162136447](http://cdn.ayusummer233.top/DailyNotes/202409251621572.png)

1. **catalina.2024-09-25.log**：Catalina（Tomcat的核心组件）的主日志文件，记录了Tomcat服务器的启动、停止和运行过程中发生的各种事件和错误。
2. **host-manager.2024-09-25.log**：Host Manager应用的日志文件，记录了通过Host Manager进行的操作和事件。
3. **localhost.2024-09-25.log**：localhost主机的日志文件，记录了在localhost主机上部署的所有Web应用程序的事件和错误。
4. **localhost_access_log.2024-09-25.txt**：这是访问日志文件，记录了所有对localhost主机的HTTP请求，包括请求的时间、IP地址、请求的资源、响应状态等信息。
5. **manager.2024-09-25.log**：这是Manager应用的日志文件，记录了通过Manager进行的操作和事件。

---

### Jetty

> [The Eclipse Jetty Project :: Eclipse Jetty](https://jetty.org/index.html)
>
> [jetty/jetty.project: Eclipse Jetty® - Web Container & Clients - supports HTTP/2, HTTP/1.1, HTTP/1.0, websocket, servlets, and more (github.com)](https://github.com/jetty/jetty.project)

Eclipse Jetty 提供了一个高度可扩展且内存高效的 Web 服务器和 servlet 容器，支持许多协议，如 HTTP/3、2、1 和 WebSocket。此外，该项目还提供了与许多其他技术的集成，例如 OSGi、JMX、JNDI、JAAS 等。这些组件是开源的，可在 EPL2 和 Apache2 许可证下免费用于商业用途和分发。

Eclipse Jetty 是一个轻量级、高度可扩展、基于 Java 的 Web 服务器和 Servlet 引擎。Jetty 的目标是以高容量、低延迟的方式支持 Web 协议（HTTP/1、HTTP/2、HTTP/3、WebSocket 等），从而提供最高性能，同时保持易用性和与多年 Servlet 开发的兼容性。Jetty 是一种现代的完全异步 Web 服务器，作为面向组件的技术有着悠久的历史，可以轻松嵌入到应用程序中，同时仍然为 Web 应用程序部署提供可靠的传统发行版。

**特点**：

- 轻量级、高性能，启动速度快，占用内存少。
- 支持嵌入式使用，适合与其他应用或框架集成，很多微服务框架（如 Spring Boot）默认使用 Jetty 作为其嵌入式服务器。
- 更适合高并发、低资源占用的场景。
- 相比 Tomcat，Jetty 的默认配置较少，更灵活，可以根据需求定制和扩展。

**使用场景**：特别适用于需要轻量级、嵌入式服务器的场景，如微服务架构中的服务实例。

---

## SpringMVC

> [Spring基础 - SpringMVC请求流程和案例 | Java 全栈知识体系](https://pdai.tech/md/spring/spring-x-framework-springmvc.html)
>
> [MoreThanJava/java-web/springMVC/Spring-MVC【入门】就这一篇！.md at master · wmyskxz/MoreThanJava · GitHub](https://github.com/wmyskxz/MoreThanJava/blob/master/java-web/springMVC/Spring-MVC【入门】就这一篇！.md)











