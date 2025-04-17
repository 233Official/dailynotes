---

---

# go-cqhttp

> [go-cqhttp 帮助中心](https://docs.go-cqhttp.org/)
>
> [Mrs4s/go-cqhttp: cqhttp的golang实现，轻量、原生跨平台. (github.com)](https://github.com/Mrs4s/go-cqhttp)

---

## QuickStart

:::tabs

@tab:active ubuntu

在 [Releases · Mrs4s/go-cqhttp (github.com)](https://github.com/Mrs4s/go-cqhttp/releases) 获取系统对应版本的 release

解压:

```bash
tar -xf go-cqhttp_linux_amd64.tar.gz 
```

给 `go-cqhttp` 文件的所有者以执行权限

```bash
chmod u+x go-cqhttp
```

首次运行 `go-cqhttp` 生成配置文件

```bash
./go-cqhttp
```

![image-20220523134826512](http://cdn.ayusummer233.top/img/202205231348243.png)

修改完配置后再次运行即可

---

@tab Windows

在 [Releases · Mrs4s/go-cqhttp (github.com)](https://github.com/Mrs4s/go-cqhttp/releases) 获取系统对应版本的 release 或者自行从源码构建了可执行程序后在命令行中执行 `go-cqhttp_*.exe`, 根据提示生成运行脚本

![image-20241029010234165](http://cdn.ayusummer233.top/DailyNotes/202410290102216.png)

:::

---

## 从源码构建

> [开始-进阶指南-如何自己构建 | go-cqhttp 帮助中心](https://docs.go-cqhttp.org/guide/quick_start.html#如何自己构建)

---

选择一个合适的目录拉取 go-cqhttp 源码

```bash
git clone https://github.com/Mrs4s/go-cqhttp.git
```

在 [All releases - The Go Programming Language](https://golang.google.cn/dl/) 下载并安装或者[自己构建golang](https://golang.google.cn/doc/install/source)

CD 到项目目录中执行如下编译命令

```bash
go build -ldflags "-s -w -extldflags '-static'"
```

- `-ldflags`: 传递给链接器的标志
  - `-s`：去掉符号表信息，减小可执行文件的大小
  - `-w`：去掉 DWARF 调试信息，进一步减小可执行文件的大小
  - `-extldflags '-static'`：告诉链接器进行静态链接，生成一个不依赖于动态库的可执行文件

> *注：可以使用* `go env -w GOPROXY=https://goproxy.cn,direct` *来加速国内依赖安装速度*

![image-20241029003424501](http://cdn.ayusummer233.top/DailyNotes/202410290034539.png)

---

## QA

### 安装ffmpeg

> [开始-进阶指南-安装ffmpeg | go-cqhttp 帮助中心](https://docs.go-cqhttp.org/guide/quick_start.html#安装-ffmpeg)

为了支持任意格式的语音发送, 你需要安装 ffmpeg 

---

:::tabs

@tab:active Windows

从 [这里](https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-full.7z) 下载 并解压, 并为 `bin` 这个文件夹添加环境变量。

![image-20241029003232750](http://cdn.ayusummer233.top/DailyNotes/202410290032781.png)

![image-20241029003335954](http://cdn.ayusummer233.top/DailyNotes/202410290033990.png)

:::

---

### 正在登陆的设备存在风险

> [Bug: 登录协议崩了 · Issue #1469 · Mrs4s/go-cqhttp (github.com)](https://github.com/Mrs4s/go-cqhttp/issues/1469)

![image-20220519201708016](http://cdn.ayusummer233.top/img/202205192017385.png)

解决方案: 

在本地运行 go-cqhttp, 登陆成功会生成 `session.token` 文件, 将其拷贝到服务器相应位置即可

![image-20220523142442098](http://cdn.ayusummer233.top/DailyNotes/202410290014657.png)
