# Java

---

- [Java](#java)
  - [Java 环境配置](#java-环境配置)
    - [安装 jdk](#安装-jdk)
    - [IDEA](#idea)
      - [ubuntu 安装 IDEA](#ubuntu-安装-idea)
    - [Maven](#maven)
      - [安装与配置](#安装与配置)
  - [Java 反射](#java-反射)
    - [得到 Class 的三种方式](#得到-class-的三种方式)
  - [命令执行](#命令执行)

---

## Java 环境配置

### 安装 jdk

> [Java 下载 |甲骨文 --- Java Downloads | Oracle](https://www.oracle.com/java/technologies/downloads/?er=221886#jdk21-windows)
>
> [Archived OpenJDK GA Releases (java.net)](https://jdk.java.net/archive/)

:::tabs

@tab:active Windows

可以使用上面 OracleJDK 或者 OracleOpenJDK 的链接下载安装包或者压缩包

安装包下载后执行运行可执行程序即可, 压缩包需要解压到指定目录(JDK一般放在 `C:\Program Files\Java\jdk` 目录下)

安装完/解压到指定目录 后需要配置环境变量

```properties
JAVA_HOME
jdk安装目录(只能有一个,不能有多个)
```

```properties
CLASSPATH
.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar
# tools.jar 可能没有, openjdk中一般就没有, 那就直接:
.;%JAVA_HOME%\lib
```

```properties
Path
%JAVA_HOME%\bin
# Java9之后就不需要下面这个jre目录了
%JAVA_HOME%\jre\bin
```

> 这里配置环境变量时需要注意, 不要像如下这样在最后一个环境变量末尾添加分号:
>
> ![image-20240926142618491](http://cdn.ayusummer233.top/DailyNotes/202409261426707.png)
>
> 否则编辑的时候看不出来:
>
> ![image-20240926142649584](http://cdn.ayusummer233.top/DailyNotes/202409261426636.png)
>
> 但是后续拼接 `PATH(%HOME%\bin)` 时会拼接成 `C:\Program Files\Java\jdk\openjdk-21.0.2;\bin` 导致无法正确定位目录
>
> ---
>
> 以及这里 `JAVA_HOME` 只能配置/生效一个 JDK 安装目录, 要切换 JAVA 版本的话可以用类似如下 Powershell 脚本来快速设置目标环境变量
>
> ```powershell
> # 切换到 JDK 8
> $env:JAVA_HOME = "C:\Program Files\Java\jdk1.8.0_281"
> $env:Path = "$env:JAVA_HOME\bin;$env:Path"
> $env:CLASSPATH = ".;$env:JAVA_HOME\lib"
> Write-Output "Switched to JDK 8"
> ```

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

### Maven

> [Maven配置教程_霍英俊-CSDN博客_maven配置](https://blog.csdn.net/huo920/article/details/82082403)

#### 安装与配置

在 [Maven – Download Apache Maven](https://maven.apache.org/download.cgi) 下载

<img src="http://cdn.ayusummer233.top/img/202201011531250.png" alt="image-20220101153104101" style="zoom: 80%;" />

解压到某个文件夹

![image-20220101153336808](http://cdn.ayusummer233.top/img/202201011533908.png)

配置 Maven 环境变量

```properties
MAVEN_HOME
maven解压目录
```

![image-20220101153540046](http://cdn.ayusummer233.top/img/202201011535134.png)

编辑 PATH 变量

```properties
PATH
%MAVEN_HOME%/bin
```

![image-20220101153734649](http://cdn.ayusummer233.top/img/202201011537762.png)

验证配置: `mvn -v`

<img src="http://cdn.ayusummer233.top/img/202201011543915.png" alt="image-20220101154317795" style="zoom:80%;" />

修改 Maven 配置 `C:\Programming\Java\apache-maven-3.8.4\conf\settings.xml`

> 一般来说不需要修改本地仓库位置, 默认在 `${user.home}/.m2/repository`, 保持默认即可
>
> 如果要修改本地仓库位置的话可以如下配置:
>
> ![image-20220101154858114](http://cdn.ayusummer233.top/img/202201011548230.png)
>
> 如下目录要配置的话需要改一下权限, 因为 `Program Files` 目录需要的权限比较特殊
>
> ![image-20240926030454284](http://cdn.ayusummer233.top/DailyNotes/202409260304334.png)

修改 maven 默认的 JDK 版本

```xml
<profile>     
    <id>JDK-1.8</id>       
    <activation>       
        <activeByDefault>true</activeByDefault>       
        <jdk>1.8</jdk>       
    </activation>       
    <properties>       
        <maven.compiler.source>1.8</maven.compiler.source>       
        <maven.compiler.target>1.8</maven.compiler.target>       
        <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>       
    </properties>       
</profile>
```

![image-20220101155951312](http://cdn.ayusummer233.top/img/202201011559443.png)

> ```xml
>     <profile>
>       <id>jdk-21</id>
> 
>       <activation>
>         <jdk>21</jdk>
>       </activation>
> 
>       <repositories>
>         <repository>
>           <id>jdk21</id>
>           <name>Repository for JDK 21 builds</name>
>           <url>http://www.myhost.com/maven/jdk21</url>
>           <layout>default</layout>
>           <snapshotPolicy>always</snapshotPolicy>
>         </repository>
>       </repositories>
>     </profile>
> ```
>
> ![image-20240926030540366](http://cdn.ayusummer233.top/DailyNotes/202409260305426.png)

添加国内镜像源

> [使用公共仓库加速 Maven 构建，提升效率！ (github.com)](https://gist.github.com/y0ngb1n/324aa1b02ed19d61a521b2d421086bfe)

```xml
 <mirrors>
    <mirror>
      <id>aliyun-maven</id>
      <name>阿里云公共仓库</name>

      <!-- 只镜像中央仓库 -->
      <mirrorOf>central</mirrorOf>
      <url>https://maven.aliyun.com/repository/central</url>

      <!-- 镜像所有仓库 -->
      <!--<mirrorOf>*</mirrorOf>-->
      <!--<url>https://maven.aliyun.com/repository/public</url>-->
    </mirror>
  </mirrors>
```

![image-20240926031258998](http://cdn.ayusummer233.top/DailyNotes/202409260312055.png)

> 这里全局只镜像中央仓库就行, 之后项目需要可以单独为项目配置 maven 镜像
>
> 在项目的 `pom.xml` 中定义镜像即可, 例如:
>
> ```xml
> <project>
>     ...
>     <repositories>
>         <repository>
>             <id>aliyun-public</id>
>             <name>阿里云公共仓库</name>
>             <url>https://maven.aliyun.com/repository/public</url>
>         </repository>
>     </repositories>
>     ...
> </project>
> 
> ```

----

## Java生态调查

> [Java 编程 – 2023 开发者生态系统现状信息图 | JetBrains: Developer Tools for Professionals and Teams](https://www.jetbrains.com/zh-cn/lp/devecosystem-2023/java/)
>
> [Java 8 腰斩！Java 17 暴涨 2300%！-51CTO.COM](https://www.51cto.com/article/754195.html)

![企业微信截图_1727419756866](http://cdn.ayusummer233.top/DailyNotes/202409271500616.png)

![企业微信截图_17274199895108](http://cdn.ayusummer233.top/DailyNotes/202409271500715.png)

![企业微信截图_17274201077136](http://cdn.ayusummer233.top/DailyNotes/202409271500838.png)

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











