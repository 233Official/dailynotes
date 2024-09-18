# Java Web

- [Java Web](#java-web)
  - [Tomcat](#tomcat)
    - [Tomcat安装](#tomcat安装)
    - [Tomcat配置](#tomcat配置)


---



## Tomcat

> [Apache Tomcat® - Apache Tomcat 8 Software Downloads --- Apache Tomcat® - Apache Tomcat 8 软件下载](https://tomcat.apache.org/download-80.cgi)

![image-20230613111231319](http://cdn.ayusummer233.top/DailyNotes/202306131112390.png)

---

### Tomcat安装

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

### Tomcat配置

> [Apache Tomcat 9 （9.0.94） - 简介 --- Apache Tomcat 9 (9.0.94) - Introduction](https://tomcat.apache.org/tomcat-9.0-doc/introduction.html)

安装完 Tomcat 后可以配置下环境变量, 系统变量中添加 `CATALINA_HOME`  指向 Tomcat 目录

![image-20240911142434113](http://cdn.ayusummer233.top/DailyNotes/202409111424166.png)

---

