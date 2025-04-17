---

---

# CH8.Goroutines和Channels

- [CH8.Goroutines和Channels](#ch8goroutines和channels)
  - [简介](#简介)
  - [8.1.Goroutines](#81goroutines)
  - [8.2. 示例: 并发的Clock服务](#82-示例-并发的clock服务)


---

## 简介

Go语言中的并发程序可以用两种手段来实现。Goroutine 和 Channel

Goroutine 和 Channel 是 Go 语言并发编程的核心概念。它们提供了一种高效且易于使用的方式来处理并发任务。

Goroutine 和 Channel 支持 `顺序通信进程”（communicating sequential processes）` 或被简称为CSP。CSP是一种现代的并发编程模型，在这种编程模型中值会在不同的运行实例（goroutine）中传递，尽管大多数情况下仍然是被限制在单一实例中。

​	第9章覆盖更为传统的并发模型：多线程共享内存，如果你在其它的主流语言中写过并发程序的话可能会更熟悉一些。第9章也会深入介绍一些并发程序带来的风险和陷阱。

尽管Go对并发的支持是众多强力特性之一，但跟踪调试并发程序还是很困难，在线性程序中形成的直觉往往还会使我们误入歧途。如果这是读者第一次接触并发，推荐稍微多花一些时间来思考这两个章节中的样例。

---

**Goroutines**是Go语言中的轻量级线程。它们由Go运行时管理，具有以下特点：

1. **轻量级**：相比于传统的线程，Goroutines消耗的资源非常少，一个Goroutine只占用几个KB的内存。

2. **简单启动**：使用`go`关键字很容易启动一个新的Goroutine。例如：

   ```go
   func sayHello() {
       fmt.Println("Hello, World!")
   }
   
   func main() {
       go sayHello()
       fmt.Println("main function")
   }
   ```

   这段代码将并发执行`sayHello`函数和`main`函数。

   > 执行后会出现三种输出情况
   >
   > - ![image-20240618105324208](http://cdn.ayusummer233.top/DailyNotes/image-20240618105324208.png)
   > - ![image-20240618111048440](http://cdn.ayusummer233.top/DailyNotes/image-20240618111048440.png)
   > - ![image-20240618111114045](http://cdn.ayusummer233.top/DailyNotes/image-20240618111114045.png)

3. **并发执行**：Goroutines可以并发执行，这意味着它们可以在“同一时间”执行不同的任务。

4. **调度管理**：Goroutines由Go运行时调度，因此程序员无需手动管理线程的创建和销毁。

---

**Channels**是Go语言中用于Goroutines之间通信的机制。它们允许Goroutines安全地交换数据，有以下特点：

1. **类型化**：Channels是类型化的，这意味着它们只能传递一种特定类型的数据。例如，一个`chan int`类型的Channel只能传递整数。
2. **同步**：默认情况下，发送和接收操作是同步的。这意味着发送操作会等待接收操作完成，反之亦然。
3. **缓冲区**：Channels可以是有缓冲区的，这允许一定数量的数据可以在没有接收者的情况下被发送。

示例代码：

```go
func main() {
    // 创建一个 string 类型的 Channel
    messages := make(chan string)
	// 启动一个 Goroutine，向 Channel 发送数据
    go func() {
        messages <- "ping"
        fmt.Println("test")
    }()
    sleep(2)
    msg := <-messages
    fmt.Println(msg)
}
```

在这个例子中，`main`函数创建了一个Channel `messages`，然后启动一个新的Goroutine向该Channel发送一个字符串`"ping"`。`main`函数随后接收并打印该字符串。

这是一个无缓冲区的 Channel 示例，从运行过程上看具体来说:

- 主 Goroutine 运行到 `msg := <-messages` 并阻塞，等待数据。
- Goroutine 运行到 `messages <- "ping"` 并阻塞，等待接收者。
- 当主 Goroutine 和 Goroutine 都准备好时，数据 `"ping"` 从 Goroutine 发送到主 Goroutine，两个操作都完成。
- 主 Goroutine 接收到数据，继续执行并打印 `"ping"`。

---

有缓冲区的 Channel 示例

```go
// 有缓冲区的 Channel 示例
func channelWithBufferExample() {
	// 创建一个有缓冲的字符串类型的 Channel，缓冲区大小为2
	messages := make(chan string, 2)

	// 启动一个 Goroutine，向 Channel 发送数据
	go func() {
		messages <- "Hello, Goroutines!"
		fmt.Println("Message sent from Goroutine")
	}()

	// 从 Channel 接收数据并打印
	msg := <-messages
	fmt.Println("Received message:", msg)
}
```

![image-20240618114009866](http://cdn.ayusummer233.top/DailyNotes/image-20240618114009866.png)

运行过程如下：

- **主 Goroutine 创建 Channel**：创建一个带有缓冲区大小为2的字符串类型的 Channel `messages`。

- **启动 Goroutine**：Goroutine 启动并尝试向 Channel `messages` 发送数据 `"Hello, Goroutines!"`。

- **Goroutine 发送数据到 Channel**：由于 `messages` Channel 有缓冲区且当前缓冲区为空，发送操作不会阻塞，数据被放入缓冲区，Goroutine 继续执行并打印 `"Message sent from Goroutine"`。

- **主 Goroutine 从 Channel 接收数据**：主 Goroutine 尝试从 `messages` Channel 接收数据。

  如果此时缓冲区中已经有数据 `"Hello, Goroutines!"`，接收操作不会阻塞，主 Goroutine 立即接收到数据并打印 `"Received message: Hello, Goroutines!"`。如果没有则阻塞等到 Channel 准备好数据则接收。

---

## 8.1.Goroutines

> [Goroutines - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch8/ch8-01.html)

在Go语言中，每一个并发的执行单元叫作一个goroutine。

设想这里的一个程序有两个函数，一个函数做计算，另一个输出结果，假设两个函数没有相互之间的调用关系。一个线性的程序会先调用其中的一个函数，然后再调用另一个。如果程序中包含多个goroutine，对两个函数的调用则可能发生在同一时刻。马上就会看到这样的一个程序。

如果你使用过操作系统或者其它语言提供的线程，那么你可以简单地把goroutine类比作一个线程，这样你就可以写出一些正确的程序了。goroutine和线程的本质区别会在9.8节中讲。

当一个程序启动时，其主函数即在一个单独的goroutine中运行，我们叫它main goroutine。新的goroutine会用go语句来创建。在语法上，go语句是一个普通的函数或方法调用前加上关键字go。go语句会使其语句中的函数在一个新创建的goroutine中运行。而go语句本身会迅速地完成。

```go
f()    // call f(); wait for it to return
go f() // create a new goroutine that calls f(); don't wait
```

---

## 8.2. 示例: 并发的Clock服务

> [示例: 并发的Clock服务 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch8/ch8-02.html)

网络编程是并发大显身手的一个领域，由于服务器是最典型的需要同时处理很多连接的程序，这些连接一般来自于彼此独立的客户端。

在本小节中，我们会讲解go语言的net包，这个包提供编写一个网络客户端或者服务器程序的基本组件，无论两者间通信是使用TCP、UDP或者Unix domain sockets。

在第一章中我们使用过的net/http包里的方法，也算是net包的一部分。

我们的第一个例子是一个顺序执行的时钟服务器，它会每隔一秒钟将当前时间写到客户端：

`gopl.io/ch8/clock1`

```go
// Clock1 is a TCP server that periodically writes the time.
package main

import (
    "io"
    "log"
    "net"
    "time"
)

func main() {
    listener, err := net.Listen("tcp", "localhost:8000")
    if err != nil {
        log.Fatal(err)
    }

    for {
        conn, err := listener.Accept()
        if err != nil {
            log.Print(err) // e.g., connection aborted
            continue
        }
        handleConn(conn) // handle one connection at a time
    }
}

func handleConn(c net.Conn) {
    defer c.Close()
    for {
        _, err := io.WriteString(c, time.Now().Format("15:04:05\n"))
        if err != nil {
            return // e.g., client disconnected
        }
        time.Sleep(1 * time.Second)
    }
}
```

- Listen函数创建了一个 `net.Listener` 的对象，这个对象会监听一个网络端口上到来的连接，在这个例子里我们用的是TCP的 `localhost:8000`端口。listener对象的Accept方法会直接阻塞，直到一个新的连接被创建，然后会返回一个net.Conn对象来表示这个连接。

- handleConn函数会处理一个完整的客户端连接。在一个for死循环中，用time.Now()获取当前时刻，然后写到客户端。由于net.Conn实现了io.Writer接口，我们可以直接向其写入内容。这个死循环会一直执行，直到写入失败。最可能的原因是客户端主动断开连接。这种情况下handleConn函数会用defer调用关闭服务器侧的连接，然后返回到主函数，继续等待下一个连接请求。

- `time.Time.Format` 方法提供了一种格式化日期和时间信息的方式。它的参数是一个格式化模板，标识如何来格式化时间，而这个格式化模板限定为 `Mon Jan 2 03:04:05PM 2006 UTC-0700`。有8个部分（周几、月份、一个月的第几天……）。可以以任意的形式来组合前面这个模板；出现在模板中的部分会作为参考来对时间格式进行输出。

  在上面的例子中我们只用到了小时、分钟和秒。time包里定义了很多标准时间格式，比如 `time.RFC1123`。

  在进行格式化的逆向操作 `time.Parse` 时，也会用到同样的策略。（译注：这是go语言和其它语言相比比较奇葩的一个地方。你需要记住格式化字符串是1月2日下午3点4分5秒零六年UTC-0700，而不像其它语言那样 `Y-m-d H:i:s` 一样，当然了这里可以用1234567的方式来记忆，倒是也不麻烦。）

为了连接例子里的服务器，我们需要一个客户端程序，比如netcat这个工具（nc命令），这个工具可以用来执行网络连接操作。

```
$ go build gopl.io/ch8/clock1
$ ./clock1 &
$ nc localhost 8000
13:58:54
13:58:55
13:58:56
13:58:57
^C
```

![image-20240618163750385](http://cdn.ayusummer233.top/DailyNotes/image-20240618163750385.png)

客户端将服务器发来的时间显示了出来，我们用Control+C来中断客户端的执行，在Unix系统上，你会看到^C这样的响应。如果你的系统没有装nc这个工具，你可以用telnet来实现同样的效果，或者也可以用我们下面的这个用go写的简单的telnet程序，用net.Dial就可以简单地创建一个TCP连接：

`gopl.io/ch8/netcat1`

```go
// Netcat1 is a read-only TCP client.
package main

import (
    "io"
    "log"
    "net"
    "os"
)

func main() {
    conn, err := net.Dial("tcp", "localhost:8000")
    if err != nil {
        log.Fatal(err)
    }
    defer conn.Close()
    mustCopy(os.Stdout, conn)
}

func mustCopy(dst io.Writer, src io.Reader) {
    if _, err := io.Copy(dst, src); err != nil {
        log.Fatal(err)
    }
}
```

这个程序会从连接中读取数据，并将读到的内容写到标准输出中，直到遇到end of file的条件或者发生错误。mustCopy这个函数我们在本节的几个例子中都会用到。让我们同时运行两个客户端来进行一个测试，这里可以开两个终端窗口，下面左边的是其中的一个的输出，右边的是另一个的输出：

```
$ go build gopl.io/ch8/netcat1
$ ./netcat1
13:58:54                               $ ./netcat1
13:58:55
13:58:56
^C
                                       13:58:57
                                       13:58:58
                                       13:58:59
                                       ^C
$ killall clock1
```

killall命令是一个Unix命令行工具，可以用给定的进程名来杀掉所有名字匹配的进程。

第二个客户端必须等待第一个客户端完成工作，这样服务端才能继续向后执行；因为我们这里的服务器程序同一时间只能处理一个客户端连接。我们这里对服务端程序做一点小改动，使其支持并发：在handleConn函数调用的地方增加go关键字，让每一次handleConn的调用都进入一个独立的goroutine。

*gopl.io/ch8/clock2*

```go
for {
    conn, err := listener.Accept()
    if err != nil {
        log.Print(err) // e.g., connection aborted
        continue
    }
    go handleConn(conn) // handle connections concurrently
}
```

现在多个客户端可以同时接收到时间了：

```
$ go build gopl.io/ch8/clock2
$ ./clock2 &
$ go build gopl.io/ch8/netcat1
$ ./netcat1
14:02:54                               $ ./netcat1
14:02:55                               14:02:55
14:02:56                               14:02:56
14:02:57                               ^C
14:02:58
14:02:59                               $ ./netcat1
14:03:00                               14:03:00
14:03:01                               14:03:01
^C                                     14:03:02
                                       ^C
$ killall clock2
```

![image-20240618164234113](http://cdn.ayusummer233.top/DailyNotes/image-20240618164234113.png)

![image-20240618164329406](http://cdn.ayusummer233.top/DailyNotes/image-20240618164329406.png)

---

**练习 8.1：** 修改clock2来支持传入参数作为端口号，然后写一个clockwall的程序，这个程序可以同时与多个clock服务器通信，从多个服务器中读取时间，并且在一个表格中一次显示所有服务器传回的结果，类似于你在某些办公室里看到的时钟墙。如果你有地理学上分布式的服务器可以用的话，让这些服务器跑在不同的机器上面；或者在同一台机器上跑多个不同的实例，这些实例监听不同的端口，假装自己在不同的时区。像下面这样：

```bash
$ TZ=US/Eastern    ./clock2 -port 8010 &
$ TZ=Asia/Tokyo    ./clock2 -port 8020 &
$ TZ=Europe/London ./clock2 -port 8030 &
$ clockwall NewYork=localhost:8010 Tokyo=localhost:8020 London=localhost:8030
```



![image-20240618165157657](http://cdn.ayusummer233.top/DailyNotes/image-20240618165157657.png)

![image-20240618165336246](http://cdn.ayusummer233.top/DailyNotes/image-20240618165336246.png)

---



**练习 8.2：** 实现一个并发FTP服务器。服务器应该解析客户端发来的一些命令，比如cd命令来切换目录，ls来列出目录内文件，get和send来传输文件，close来关闭连接。你可以用标准的ftp命令来作为客户端，或者也可以自己实现一个。











---

QA: 关于只读和只写CHannel的描述