# Java

---

- [Java](#java)
  - [Java 环境配置](#java-环境配置)
    - [安装 jdk](#安装-jdk)
    - [IDEA](#idea)
      - [ubuntu 安装 IDEA](#ubuntu-安装-idea)
  - [Tomcat](#tomcat)
    - [Tomcat安装](#tomcat安装)
    - [Tomcat配置](#tomcat配置)
  - [Java 反射](#java-反射)
    - [得到 Class 的三种方式](#得到-class-的三种方式)
  - [命令执行](#命令执行)

---

## Java 环境配置

### 安装 jdk

:::tabs

@tab:active Windows

安装完后需要配置环境变量

```
JAVA_HOME
jdk安装目录
```

```
CLASSPATH
.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar
```

```
Path
%JAVA_HOME%\bin
%JAVA_HOME%\jre\bin
```

配完后

```bash
java
javac
```

看下有正常回显即可

---

@tab Ubuntu/Debian

> [OpenJDK: Download and install](https://openjdk.org/install/)
>
> [[环境搭建\] Kali 下多版本JDK 共存 - 2022 年11 月1 日更新 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/399295670)
>
> ---

- 安装 openjdk8

  ```bash
  sudo apt-get install openjdk-8-jre
  sudo apt-get install openjdk-8-jdk
  ```

  安装完后可以 `java -version` 看下
  
  > ![image-20220923112443274](http://cdn.ayusummer233.top/img/202209231124375.png)

---

或者下载 `tar.gz` 包然后解压, 解压后在 `bin` 目录下有 `java` 和 `javac`

多版本 jdk 注册:

```bash
# 注册 java
update-alternatives --install /usr/bin/java java [解压后bin目录下的java文件绝对路径] [优先级数字]
update-alternatives --set java [解压后bin目录下的java文件绝对路径]

# 注册 javac
update-alternatives --install /usr/bin/javac javac [解压后bin目录下的javac文件绝对路径] [优先级数字]
update-alternatives --set javac [解压后bin目录下的javac文件绝对路径]
```

> 例如:
>
> ```bash
> update-alternatives --install /usr/bin/java java /home/ajest/tools/java/jdk1.8.0_351/bin/java 18351
> update-alternatives --set java /home/ajest/tools/java/jdk1.8.0_351/bin/java
> update-alternatives --install /usr/bin/javac javac /home/ajest/tools/java/jdk1.8.0_351/bin/javac 18351
> update-alternatives --set javac /home/ajest/tools/java/jdk1.8.0_351/bin/javac
> 
> update-alternatives --install /usr/bin/java java /home/ajest/tools/java/jdk-11.0.17/bin/java 11017
> update-alternatives --set java /home/ajest/tools/java/jdk-11.0.17/bin/java
> update-alternatives --install /usr/bin/javac javac /home/ajest/tools/java/jdk-11.0.17/bin/javac 11017
> update-alternatives --set javac /home/ajest/tools/java/jdk-11.0.17/bin/javac
> 
> update-alternatives --install /usr/bin/java java /home/ajest/tools/java/jdk-17.0.5/bin/java 1705
> update-alternatives --set java /home/ajest/tools/java/jdk-17.0.5/bin/java
> update-alternatives --install /usr/bin/javac javac /home/ajest/tools/java/jdk-17.0.5/bin/javac 1705
> update-alternatives --set javac /home/ajest/tools/java/jdk-17.0.5/bin/javac
> 
> 
> update-alternatives --install /usr/bin/java java /home/ajest/tools/java/jdk-19.0.1/bin/java 1901
> update-alternatives --set java /home/ajest/tools/java/jdk-19.0.1/bin/java
> update-alternatives --install /usr/bin/javac javac /home/ajest/tools/java/jdk-19.0.1/bin/javac 1901
> update-alternatives --set javac /home/ajest/tools/java/jdk-19.0.1/bin/javac
> ```

多版本 JDK 管理

```bash
update-alternatives --config java
update-alternatives --config javac
```

:::

---

### IDEA

#### ubuntu 安装 IDEA

直接远程连接安装即可

![image-20220923185210262](http://cdn.ayusummer233.top/img/202209231852362.png)

---

## Tomcat

> [Apache Tomcat® - Apache Tomcat 8 Software Downloads --- Apache Tomcat® - Apache Tomcat 8 软件下载](https://tomcat.apache.org/download-80.cgi)

![image-20230613111231319](http://cdn.ayusummer233.top/DailyNotes/202306131112390.png)

---

### Tomcat安装

> [如何在 Debian 11 上安装 Apache Tomcat ? - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000043079401#item-2)

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

@tab Linux(Debian)

[Apache Tomcat® - Apache Tomcat 9 Software Downloads](https://tomcat.apache.org/download-90.cgi)

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

## Java 反射

> [Java 反射详解 - YSOcean - 博客园 (cnblogs.com)](https://www.cnblogs.com/ysocean/p/6516248.html)
>
> ---

Java反射就是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意方法和属性；并且能改变它的属性。而这也是Java被视为(准)动态语言的一个关键性质

> 为啥要说是准动态，因为一般而言的动态语言定义是程序运行时，允许改变程序结构或变量类型，这种语言称为动态语言。从这个观点看，Perl，Python，Ruby是动态语言，C++，Java，C#不是动态语言。

反射机制允许程序在运行时取得任何一个已知名称的class的内部信息，包括包括其modifiers(修饰符)，fields(属性)，methods(方法)等，并可于运行时改变fields内容或调用methods。那么我们便可以更灵活的编写代码，代码可以在运行时装配，无需在组件之间进行源代码链接，降低代码的耦合度；还有动态代理的实现等等；

> 但是需要注意的是反射使用不当会造成很高的资源消耗！

---

### 得到 Class 的三种方式

比如新建一个 Person 类

```java
package reflect;

public class Person {
    private String name = "Jacob";
    public int age = 20;
    public Person(){
        System.out.println("Person()");
    }
    private void say(){
        System.out.println("Hello World!");
    }
    public void work(){
        System.out.println("I'm working!");
    }
}

```

![image-20221207152138868](http://cdn.ayusummer233.top/DailyNotes/202212071556647.png)

现在要在其他类中获取一个 Person 对象的 class 可以使用如下三种方式:

```java
package reflect;

public class reflect {
    // 1. 通过对象调用 getClass() 方法获取 Person 的 Class;
    // 通常用于传入一个 Object 对象, 但是不知道具体是什么类, 通过 getClass() 方法获取 Class 对象;
    public void by_getClass() {
        System.out.println("1. 通过对象调用 getClass() 方法获取 Person 的 Class;");
        Person person1 = new Person();
        Class c1 = person1.getClass();
        System.out.println(c1.getName());
    }

    // 2.直接通过 类名.class 的方式得到,该方法最为安全可靠，程序性能更高
    // 这说明每个类都有一个隐含的静态成员变量 class
    public void by_class() {
        System.out.println("2.直接通过 类名.class 的方式得到,该方法最为安全可靠，程序性能更高");
        Class c2 = Person.class;
        System.out.println(c2.getName());
    }

    // 3.通过 Class 类的静态方法 forName(String className) 得到
    // 该方法将类的全名(包括包名) 作为参数，返回对应的 Class 对象
    // 用的最多, 但可能抛出 ClassNotFoundException 异常
    public void by_forName() throws ClassNotFoundException {
        System.out.println("3.通过 Class 类的静态方法 forName(String className) 得到");
        Class c3 = Class.forName("reflect.Person");
        System.out.println(c3.getName());
    }

}

```

```java
import reflect.reflect;

public class test {
    public static void main(String[] args) {
        System.out.println("Hello World!");
        reflect r = new reflect();
        r.by_getClass();
        r.by_class();
        try {
            r.by_forName();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

![image-20221207155641124](http://cdn.ayusummer233.top/DailyNotes/202212071556151.png)

---

## 命令执行

正常写法

```java
java.lang.Runtime.getRuntime().exec("calc");
```

---

反射写法:

```java
try {
    Class<?> cls = Class.forName("java.lang.Runtime");
    Method method = cls.getMethod("getRuntime");
    Runtime runtime = (Runtime) method.invoke(null);
    runtime.exec("calc");
} catch (Exception e) {
    e.printStackTrace();
}
```

- `line3` 的 `Method` 指的是 `java.lang.reflect.Method` 类, 在 Java 中，`java.lang.reflect.Method` 类提供了关于类或接口上单个方法的信息和访问权限。可以使用 `java.lang.reflect.Method` 类的实例来获取方法的信息(如返回类型、参数类型、访问修饰符等) 或者对它进行调用。
- `line3` 的 `getMethod` 方法被用来获取名为 `getRuntime` 的方法(这是 `java.lang.Runtime` 类的一个静态方法)。然后，`invoke` 方法被用来调用这个获取到的方法。
- 因为 `getRuntime` 是一个无参数的方法，所以 `invoke` 方法被调用时只传入了一个 `null` 参数，这个 `null` 参数表示当前正在调用的是一个不需要实例对象的方法(即静态方法)。

---

将反射写法写为一行:

```java
((Runtime) Class.forName("java.lang.Runtime").getMethod("getRuntime").invoke(null)).exec("calc");
```

需要注意的是 `Class.getMethod` 的返回类型是 `java.lang.reflect.Method`，而 `Method.invoke()` 的返回类型是 `java.lang.Object`。

因此，当你试图在返回的 Object 类型上调用 `exec` 方法时，编译器无法找到 `exec` 方法，因为 `java.lang.Object` 类没有定义 `exec` 方法。

所以这里用的 `(Runtime)` 来将 `invoke` 的返回值强制类型转换为 `Runtime` 类型，因为 `exec` 是 `Runtime` 类的方法

---

不加强制类型转换的话可以这样写:

```java
Class.forName("java.lang.Runtime").getMethod("exec", String.class).invoke(
        Class.forName("java.lang.Runtime").getMethod("getRuntime").invoke(null),
        "calc"
);
```

首先获取 `exec` 方法的 `Method` 对象，然后再调用 `invoke` 方法，其第一个参数传递了 `exec` 方法的调用者(`Runtime` 对象) ，第二个参数传递了 `exec` 方法的参数(`calc`) 。

或者通过 `String对象.getClass()` 来获取 `Class` 也可以:

```java
"va".getClass().forName("java.lang.Runtime").getMethod("exec", String.class).invoke(
        "va".getClass().forName("java.lang.Runtime").getMethod("getRuntime").invoke(null),
        "calc"
);
```

以及这里的字符串是可以拆分再拼接的, 下面这种写法也是可以正确执行的:

```java
Class.forName("java"+".lang.Runtime").getMethod("exec", String.class).invoke(
        Class.forName("java.la"+"ng.Runtime").getMethod("getRuntime").invoke(null),
        "calc"
);
```

```java
"va".getClass().forName("java.lan"+"g.Runtime").getMethod("exec", String.class).invoke(
        "va".getClass().forName("java.l"+"ang.Runtime").getMethod("getRuntime").invoke(null),
        "calc"
);`
```

---











