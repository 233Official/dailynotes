---
date: 2024-06-20
---

# CH9-基于共享变量的并发

> [基于共享变量的并发 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch9/ch9.html)

前一章我们介绍了一些使用 goroutine 和 channel 这样直接而自然的方式来实现并发的方法。然而这样做我们实际上回避了在写并发代码时必须处理的一些重要而且细微的问题。

在本章中，我们会细致地了解并发机制。尤其是在多 goroutine 之间的共享变量，并发问题的分析手段，以及解决这些问题的基本模式。最后我们会解释 goroutine 和操作系统线程之间的技术上的一些区别。

---

- [CH9-基于共享变量的并发](#ch9-基于共享变量的并发)
  - [简介](#简介)
  - [CH9.1.竞争条件](#ch91竞争条件)
    - [EX9.1.取款函数](#ex91取款函数)
  - [CH9.2.sync.Mutex互斥锁](#ch92syncmutex互斥锁)
  - [CH9.3.读写锁](#ch93读写锁)
  - [CH9.4.内存同步](#ch94内存同步)
  - [CH9.5.sync.Once惰性初始化](#ch95synconce惰性初始化)
  - [Ch9.6.竞争条件检测](#ch96竞争条件检测)
  - [CH9.7.示例:并发的非阻塞缓存](#ch97示例并发的非阻塞缓存)
  - [CH9.8.Goroutines和线程](#ch98goroutines和线程)

---

## 简介

基于共享变量的并发（concurrency based on shared variables）是指通过共享内存中的变量来实现多个goroutine之间的通信和协作。

与此相对的是基于消息传递的并发（concurrency based on message passing），即通过通道（channel）来传递消息，从而避免直接共享内存。(对应上一章 CH8 的内容)

---

基于共享变量的并发通常通过如下方式实现

- 互斥锁(Mutex)

  Go语言的`sync`包提供了`Mutex`类型，用于在多个goroutine之间保护共享变量，确保同一时间只有一个goroutine能够访问共享变量。

  ```go
  package main
  
  import (
      "fmt"
      "sync"
  )
  
  var (
      counter int
      mu      sync.Mutex
  )
  
  func increment(wg *sync.WaitGroup) {
      defer wg.Done()
      mu.Lock()
      counter++
      mu.Unlock()
  }
  
  func main() {
      var wg sync.WaitGroup
      for i := 0; i < 10; i++ {
          wg.Add(1)
          go increment(&wg)
      }
      wg.Wait()
      fmt.Println("Final counter:", counter)
  }
  
  ```

  ![image-20240621104252470](http://cdn.ayusummer233.top/DailyNotes/202406211042873.png)

  - `sync.WaitGroup`是一个用于等待一组goroutine完成的同步原语。它主要用于协调多个goroutine的执行，确保在主goroutine继续执行或程序退出之前，所有的goroutine都已经完成。

    其有三个主要方法:

    - `Add(delta int)`: 增加（或减少）WaitGroup的计数器。参数`delta`可以是正数也可以是负数。
    - `Done()`: 等价于`Add(-1)`，表示一个goroutine已经完成。
    - `Wait()`: 阻塞直到WaitGroup的计数器为0。

  - `mu.Lock()` 和 `mu.Unlock()` 之间的代码片段(临界区)是受保护的, 同时只能有一个 goroutine 执行临界区内的代码, 其内的变量是受保护的, 同时只能有一个 goroutine 访问这些变量

- 读写锁(RWMutex)

  `sync`包提供了`RWMutex`类型，它允许多个goroutine同时读取共享变量，但同一时间只有一个goroutine能够写入共享变量。

  ```go
  package main
  
  import (
  	"fmt"
  	"sync"
  )
  
  var (
  	counter int
  	rwMu    sync.RWMutex
  )
  
      func readCounter(wg *sync.WaitGroup) {
  	defer wg.Done()
  	rwMu.RLock()
  	fmt.Println("Counter value:", counter)
  	rwMu.RUnlock()
  }
  
  func writeCounter(wg *sync.WaitGroup) {
  	defer wg.Done()
  	rwMu.Lock()
  	counter++
  	rwMu.Unlock()
  }
  
  func main() {
  	var wg sync.WaitGroup
  	for i := 0; i < 5; i++ {
  		wg.Add(1)
  		go readCounter(&wg)
  	}
  	for i := 0; i < 5; i++ {
  		wg.Add(1)
  		go writeCounter(&wg)
  	}
  	wg.Wait()
  	fmt.Println("程序末尾-Counter value:", counter)
  }
  
  ```

  ![image-20240621111256108](http://cdn.ayusummer233.top/DailyNotes/202406211112199.png)

  读写锁扩充了单一锁的概念, 他们具有如下特性:

  - 读锁和写锁是互斥的, 任一 goroutine 持有读/写锁期间其他 goroutine 不能获取 写/读 锁
  - 多个 goroutine 可以同时持有读锁，这样可以并发读取共享资源。
  - 在一个 goroutine 持有写锁期间，其他任何 goroutine 不能持有读锁或写锁。写锁是排他的，确保写操作的独占性。

- 原子操作(Atomic Operations)

  `sync/atomic`包提供了一些原子操作函数，可以在不使用锁的情况下对整数类型的变量进行原子操作，从而实现并发安全。

  ```go
  package main
  
  import (
      "fmt"
      "sync"
      "sync/atomic"
  )
  
  var counter int64
  
  func increment(wg *sync.WaitGroup) {
      defer wg.Done()
      atomic.AddInt64(&counter, 1)
  }
  
  func main() {
      var wg sync.WaitGroup
      for i := 0; i < 10; i++ {
          wg.Add(1)
          go increment(&wg)
      }
      wg.Wait()
      fmt.Println("Final counter:", counter)
  }
  
  ```

  ![image-20240621112527866](http://cdn.ayusummer233.top/DailyNotes/202406211125049.png)

  原子操作(atomic)有如下特点

  - `atomic.AddInt64` 是一个原子操作，它确保对 `counter` 的增加操作是线程安全的。

  - 原子操作避免了使用互斥锁（如 `sync.Mutex` 或 `sync.RWMutex`），从而提高了性能，特别是在读写频繁的情况下。因为它们是硬件级别的操作，不需要上下文切换。

  - 代码更简洁，因为不需要显式地获取和释放锁。

  - `工作原理`: 原子操作是由硬件保证的单个不可分割的操作。它们直接在底层 CPU 指令集上实现，确保多个线程或 goroutine 在执行这些操作时不会产生竞争条件。

    `atomic` 操作不会阻塞其他 goroutine 对共享变量的访问。它通过确保每次对变量的操作都是原子的，保证了线程安全性。这使得 `atomic` 操作非常适合高并发场景，尤其是需要频繁读写共享变量的情况下。使用 `atomic` 操作可以避免锁竞争，提高并发性能和程序的整体效率。

  - `限制`

    - **单一变量**：`atomic` 操作只能对单一变量执行原子操作。它无法在多个变量之间建立原子关系，也无法保证多个变量的操作是不可分割的。例如，无法在一个原子操作中同时增加两个不同的变量。
    - **特定类型**：`sync/atomic` 包的操作仅支持特定类型的变量，包括 `int32`、`int64`、`uint32`、`uint64`、`uintptr` 和 `unsafe.Pointer`。其他类型的变量需要转换为这些类型之一才能使用原子操作。

基于共享变量的并发在一定程度上与传统的多线程编程类似，需要小心处理共享资源以避免竞态条件（race conditions）。

然而，Go语言推荐使用通道（channels）进行goroutine之间的通信，因为通道的设计可以更自然地避免数据竞争问题，并且更容易编写和理解并发代码。

---

## CH9.1.竞争条件

> [竞争条件 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch9/ch9-01.html)

“竞争条件”（Race Condition）指的是两个或多个并发操作试图同时访问共享资源，并且这些操作的执行顺序不确定，从而可能导致程序的不正确行为。竞争条件通常发生在以下情况下：

1. **多个线程或 goroutine** 同时访问和修改同一个共享变量。
2. 访问和修改的顺序影响程序的结果。

竞争条件是并发编程中的一个常见问题，需要通过适当的同步机制来避免，例如使用互斥锁、读写锁或原子操作等。(例如上面一节中讲到的几个操作)

一个典型的竞争条件的例子可以想下现实生活中遇到的高并发的场景, 例如春运车票

或者经典并发编程案例-存取款

---

数据竞争会在两个以上的goroutine并发访问相同的变量且至少其中一个为写操作时发生。

> 当操作数据结构比较复杂时，例如操作一个包含多个属性的结构体， 假设有两个 Goroutine 一个负责读一个负责写，那么可能会出现没有完全完成写入操作时读取结构体导致数据异常的现象

根据上述定义，有三种方式可以避免数据竞争：

- 第一种方法是不要去写变量。考虑一下下面的map，会被“懒”填充，也就是说在每个key被第一次请求到的时候才会去填值。

  如果Icon是被顺序调用的话，这个程序会工作很正常，但如果Icon被并发调用，那么对于这个map来说就会存在数据竞争。

  ```go
  var icons = make(map[string]image.Image)
  func loadIcon(name string) image.Image
  
  // NOTE: not concurrency-safe!
  func Icon(name string) image.Image {
      icon, ok := icons[name]
      if !ok {
          icon = loadIcon(name)
          icons[name] = icon
      }
      return icon
  }
  
  ```

  反之，如果我们在创建goroutine之前的初始化阶段，就初始化了map中的所有条目并且再也不去修改它们，那么任意数量的goroutine并发访问Icon都是安全的，因为每一个goroutine都只是去读取而已。

  ```go
  var icons = map[string]image.Image{
      "spades.png":   loadIcon("spades.png"),
      "hearts.png":   loadIcon("hearts.png"),
      "diamonds.png": loadIcon("diamonds.png"),
      "clubs.png":    loadIcon("clubs.png"),
  }
  
  // Concurrency-safe.
  func Icon(name string) image.Image { return icons[name] }
  ```

- 第二种避免数据竞争的方法是，避免从多个goroutine访问变量。这也是前一章中大多数程序所采用的方法。例如前面的并发web爬虫（§8.6）的main goroutine是唯一一个能够访问seen map的goroutine，而聊天服务器（§8.10）中的broadcaster goroutine是唯一一个能够访问clients map的goroutine。这些变量都被限定在了一个单独的goroutine中。

  由于其它的goroutine不能够直接访问变量，它们只能使用一个channel来发送请求给指定的goroutine来查询更新变量。一个提供对一个指定的变量通过channel来请求的goroutine叫做这个变量的monitor（监控）goroutine。例如broadcaster goroutine会监控clients map的全部访问。

  下面是一个重写了的银行的例子，这个例子中balance变量被限制在了monitor goroutine中，名为teller：

  ```go
  // Package bank provides a concurrency-safe bank with one account.
  package main
  
  import "fmt"
  
  var deposits = make(chan int) // send amount to deposit
  var balances = make(chan int) // receive balance
  
  func Deposit(amount int) { deposits <- amount }
  func Balance() int       { return <-balances }
  
  func teller() {
  	var balance int // balance is confined to teller goroutine
  	for {
  		select {
  		case amount := <-deposits:
  			balance += amount
  		case balances <- balance:
  		}
  	}
  }
  
  func init() {
  	go teller() // start the monitor goroutine
  }
  
  func main() {
  	for i := 0; i < 10; i++ {
  		Deposit(200)
  		fmt.Println(Balance())
  	}
  }
  
  ```

  - `for`：无限循环，确保代码持续运行并处理来自channel的请求。
  - `select`：`select`语句用于在多个channel操作上进行选择。当`select`中的某个case准备好时，执行对应的代码块。用于处理多路channel通信。

  ![image-20240625144018225](http://cdn.ayusummer233.top/DailyNotes/image-20240625144018225.png)

- 第三种避免数据竞争的方法是允许很多goroutine去访问变量，但是在同一个时刻最多只有一个goroutine在访问。这种方式被称为“互斥”，在下一节来讨论这个主题。

---

### EX9.1.取款函数

**练习 9.1：** 给gopl.io/ch9/bank1程序添加一个Withdraw(amount int)取款函数。其返回结果应该要表明事务是成功了还是因为没有足够资金失败了。这条消息会被发送给monitor的goroutine，且消息需要包含取款的额度和一个新的channel，这个新channel会被monitor goroutine来把boolean结果发回给Withdraw。

本题考查对 Channel 的理解，将取款和结果分别交替等待然后存入一个结构体中回显

```go
// Package bank provides a concurrency-safe bank with one account.
package main

import "fmt"

var deposits = make(chan int) // send amount to deposit
var balances = make(chan int) // receive balance

type Withdrawal struct {
	Amount int
	Result chan bool
}

var withdrawals = make(chan Withdrawal) // send amount to withdraw

func Deposit(amount int) {
	deposits <- amount
}

func Balance() int {
	return <-balances
}

func Withdraw(amount int) bool {
	result := make(chan bool)
	withdrawals <- Withdrawal{Amount: amount, Result: result}
	return <-result
}

func teller() {
	var balance int // balance is confined to teller goroutine
	for {
		select {
		case amount := <-deposits:
			balance += amount
		case balances <- balance:
		case withdrawal := <-withdrawals:
			if balance >= withdrawal.Amount {
				balance -= withdrawal.Amount
				withdrawal.Result <- true
			} else {
				withdrawal.Result <- false
			}
		}
	}
}

func init() {
	go teller() // start the monitor goroutine
}

func main() {

	Deposit(100)
	fmt.Println("Balance:", Balance()) // Output: Balance: 100

	if Withdraw(50) {
		fmt.Println("Withdraw 50: Success")
	} else {
		fmt.Println("Withdraw 50: Failed")
	}
	fmt.Println("Balance:", Balance()) // Output: Balance: 50

	if Withdraw(100) {
		fmt.Println("Withdraw 100: Success")
	} else {
		fmt.Println("Withdraw 100: Failed")
	}
	fmt.Println("Balance:", Balance()) // Output: Balance: 50
}

```

![image-20240625151041785](http://cdn.ayusummer233.top/DailyNotes/image-20240625151041785.png)

---

也可以用互斥锁或者读写锁实现，这里只涉及存取款操作一个数据我就不专门写验证了，把存取款和余额展示写在一起了，这样读写锁和互斥锁的写法是一样的

```go
package main

import (
	"fmt"
	"sync"
)

var (
	balance int
	rwMu    sync.RWMutex
)

// Deposit function for adding to balance
func Deposit(amount int, wg *sync.WaitGroup) {
	defer wg.Done()
	rwMu.Lock() // Acquire write lock
	balance += amount
	rwMu.Unlock() // Release write lock
	fmt.Println("Deposit", amount, "Balance:", balance)
}

// Withdraw function for withdrawing from balance
func Withdraw(amount int, wg *sync.WaitGroup) {
	defer wg.Done()
	rwMu.Lock()

	if balance >= amount {
		balance -= amount
		fmt.Println("Withdraw", amount, "Balance:", balance)
	} else {
		fmt.Println("Withdraw", amount, "failed", "Balance:", balance)
	}

	rwMu.Unlock()
}

func main() {
	var wg sync.WaitGroup
	wg.Add(3)
	go Deposit(100, &wg)
	go Withdraw(50, &wg)
	go Withdraw(100, &wg)

	wg.Wait()
}

```

![image-20240625154005606](http://cdn.ayusummer233.top/DailyNotes/image-20240625154005606.png)



---

## CH9.2.sync.Mutex互斥锁

> [sync.RWMutex读写锁 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch9/ch9-03.html)

互斥锁(Mutex)

Go语言的`sync`包提供了`Mutex`类型，用于在多个goroutine之间保护共享变量，确保同一时间只有一个goroutine能够访问共享变量。

```go
package main

import (
    "fmt"
    "sync"
)

var (
    counter int
    mu      sync.Mutex
)

func increment(wg *sync.WaitGroup) {
    defer wg.Done()
    mu.Lock()
    counter++
    mu.Unlock()
}

func main() {
    var wg sync.WaitGroup
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go increment(&wg)
    }
    wg.Wait()
    fmt.Println("Final counter:", counter)
}

```

![image-20240621104252470](http://cdn.ayusummer233.top/DailyNotes/202406211042873.png)

- `sync.WaitGroup`是一个用于等待一组goroutine完成的同步原语。它主要用于协调多个goroutine的执行，确保在主goroutine继续执行或程序退出之前，所有的goroutine都已经完成。

  其有三个主要方法:

  - `Add(delta int)`: 增加（或减少）WaitGroup的计数器。参数`delta`可以是正数也可以是负数。
  - `Done()`: 等价于`Add(-1)`，表示一个goroutine已经完成。
  - `Wait()`: 阻塞直到WaitGroup的计数器为0。

- `mu.Lock()` 和 `mu.Unlock()` 之间的代码片段(临界区)是受保护的, 同时只能有一个 goroutine 执行临界区内的代码, 其内的变量是受保护的, 同时只能有一个 goroutine 访问这些变量

---

## CH9.3.读写锁

> [sync.RWMutex读写锁 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch9/ch9-03.html)

读写锁(RWMutex)

`sync`包提供了`RWMutex`类型，它允许多个goroutine同时读取共享变量，但同一时间只有一个goroutine能够写入共享变量。

```go
package main

import (
	"fmt"
	"sync"
)

var (
	counter int
	rwMu    sync.RWMutex
)

    func readCounter(wg *sync.WaitGroup) {
	defer wg.Done()
	rwMu.RLock()
	fmt.Println("Counter value:", counter)
	rwMu.RUnlock()
}

func writeCounter(wg *sync.WaitGroup) {
	defer wg.Done()
	rwMu.Lock()
	counter++
	rwMu.Unlock()
}

func main() {
	var wg sync.WaitGroup
	for i := 0; i < 5; i++ {
		wg.Add(1)
		go readCounter(&wg)
	}
	for i := 0; i < 5; i++ {
		wg.Add(1)
		go writeCounter(&wg)
	}
	wg.Wait()
	fmt.Println("程序末尾-Counter value:", counter)
}

```

![image-20240621111256108](http://cdn.ayusummer233.top/DailyNotes/202406211112199.png)

读写锁扩充了单一锁的概念, 他们具有如下特性:

- 读锁和写锁是互斥的, 任一 goroutine 持有读/写锁期间其他 goroutine 不能获取 写/读 锁
- 多个 goroutine 可以同时持有读锁，这样可以并发读取共享资源。
- 在一个 goroutine 持有写锁期间，其他任何 goroutine 不能持有读锁或写锁。写锁是排他的，确保写操作的独占性。

---

## CH9.4.内存同步

> [内存同步 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch9/ch9-04.html)

在并发编程中，"内存同步"（Memory Synchronization）是指在多个线程或 goroutine 之间协调对共享内存的访问，以确保数据的一致性和正确性。内存同步的关键在于确保一个线程对共享变量的修改能够被其他线程及时地看到，并且这些修改按照预期的顺序进行。

在 Go 语言中内存同步主要通过 `互斥锁`, `读写锁`, `原子操作`，`Channels` 实现。

---

## CH9.5.sync.Once惰性初始化

> [sync.Once惰性初始化 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch9/ch9-05.html)

`sync.Once` 是一个用于确保某些操作只执行一次的机制

惰性初始化（Lazy Initialization）是一种设计模式，它允许某个对象或变量在第一次使用时才被初始化，而不是在程序启动时就立即初始化。这种模式在需要延迟加载、资源密集型初始化、并发安全等场景下非常有用。

- `sync.Once` 的作用

  `sync.Once` 保证函数只执行一次，不管有多少个 goroutine 调用这个函数，`sync.Once` 都会确保函数只执行一次，即使是并发调用。典型的使用场景包括单例模式（Singleton Pattern）、资源初始化、配置加载等。

- `sync.Once` 使用示例

  ```go
  package main
  
  import (
      "fmt"
      "sync"
  )
  
  var once sync.Once
  var config string
  
  func loadConfig() {
      fmt.Println("Loading config...")
      config = "Config data"
  }
  
  func main() {
      var wg sync.WaitGroup
  
      for i := 0; i < 5; i++ {
          wg.Add(1)
          go func() {
              defer wg.Done()
              once.Do(loadConfig)
              fmt.Println("Config:", config)
          }()
      }
  
      wg.Wait()
  }
  
  ```

  ![image-20240621135940648](http://cdn.ayusummer233.top/DailyNotes/202406211359843.png)

- `sync.Once` 实现原理

  `sync.Once` 的核心是通过一个布尔变量和互斥锁（Mutex）来实现的：

  - 布尔变量用来记录是否已经执行过。
  - 互斥锁用来确保对布尔变量的并发访问是安全的。

  当 `Do` 方法被调用时，它首先检查布尔变量

  - 如果变量已经被设置为 `true`，表示初始化操作已经执行过，直接返回。
  - 如果变量为 `false`，则获取锁并再次检查变量状态，确保只执行一次初始化代码，然后将变量设置为 `true`，最后释放锁。

- 惰性初始化的优点
  - **提高性能**：在需要时才进行初始化，避免不必要的开销。
  - **节省资源**：只有在实际需要时才分配资源，避免不必要的资源占用。
  - **并发安全**：通过 `sync.Once` 确保初始化操作的线程安全性，避免并发问题。
- 惰性初始化的典型应用
  - **单例模式（Singleton Pattern）**：确保某个对象在程序运行期间只被创建一次。
  - **资源加载**：如数据库连接、配置文件加载等，只有在需要时才进行加载。
  - **延迟计算**：如某些计算结果只有在需要时才进行计算。

---







---

## Ch9.6.竞争条件检测

> [竞争条件检测 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch9/ch9-06.html)

Go 语言中的竞争条件检测是通过一个名为 `race detector（竞争检测器）` 的工具实现的，它能够帮助开发者发现程序中的数据竞争问题。

这个工具在 Go 1.1 中引入，并且自 Go 1.2 版本开始就成为了 Go 工具链的一部分。

---

- 使用

  可以使用 `-race` 标志来启用竞争条件检测。这个标志可以在 `go run`、`go build` 和 `go test` 命令中使用。例如：

  ```bash
  go run -race main.go
  go build -race -o myprogram main.go
  go test -race ./...
  ```

  例如以下是一个存在竞争条件的简单示例

  ```go
  package main
  
  import (
      "fmt"
      "sync"
  )
  
  var counter int
  
  func increment(wg *sync.WaitGroup) {
      defer wg.Done()
      for i := 0; i < 1000; i++ {
          counter++
      }
  }
  
  func main() {
      var wg sync.WaitGroup
      for i := 0; i < 10; i++ {
          wg.Add(1)
          go increment(&wg)
      }
      wg.Wait()
      fmt.Println("Final counter:", counter)
  }
  
  ```

  在这个示例中，多个 goroutine 并发地修改 `counter` 变量，导致竞争条件。

  先来看下直接运行的结果:

  ![image-20240621142734444](http://cdn.ayusummer233.top/DailyNotes/202406211427586.png)

  可以看到, 如果没有竞争的话最终 counter 的值应当是  10000

  使用 `-race` 标志运行这个程序可以检测到这个问题：

  ```bash
  go run -race main.go
  ```

  ![image-20240621143934524](http://cdn.ayusummer233.top/DailyNotes/202406211439743.png)

  ![image-20240621144521418](http://cdn.ayusummer233.top/DailyNotes/202406211445564.png)
  
  > sync.Once() 是否是新开了一个线程

---

## CH9.7.示例:并发的非阻塞缓存

> [示例: 并发的非阻塞缓存 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch9/ch9-07.html)





---

## CH9.8.Goroutines和线程

> [Goroutines和线程 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch9/ch9-08.html)

goroutine 是一种轻量级的线程，它与传统的操作系统线程有许多相似之处，但也存在显著的差异。了解 goroutine 和线程的关系以及它们之间的区别，对于编写高效并发程序非常重要。

- goroutine 和线程的关系

  - **Goroutine 是 Go 语言的并发模型**：Goroutine 是由 Go 运行时管理的并发执行单元，类似于其他编程语言中的线程。

  - **轻量级**：Goroutine 比操作系统线程更加轻量级，启动一个 goroutine 的开销非常小，通常只有几个 KB 的内存，而启动一个操作系统线程的开销则要大得多。

  - M 调度模型

    Go 运行时使用 M 调度模型，将多个 goroutine 映射到更少的操作系统线程上，从而实现高效的并发执行。

    M 调度模型意味着 M 个 goroutine 由 N 个操作系统线程调度和执行。

> M 调度模型是并发编程中的一种调度模型，用于将M个用户级线程（如goroutine）映射到N个内核线程（操作系统线程）上执行。
>
> Go语言的运行时系统使用这种模型来管理goroutine的调度，从而实现高效的并发执行。
>
> ---
>
> 在 M 调度模型中
>
> - M表示用户级线程的数量（例如，Go语言中的goroutine）。
>
> - N表示内核线程的数量（由操作系统管理的线程）。
>
> M个用户级线程通过N个内核线程进行调度和执行。这个模型的主要目的是提高并发性能和资源利用率，同时减少线程管理的开销。
>
> ---
>
> 在Go语言中，M 调度模型是通过以下组件实现的：
>
> - **G（Goroutine）**：表示一个goroutine，即一个用户级线程。每个goroutine都有自己的栈和上下文。
> - **M（Machine）**：表示一个内核线程。M是由操作系统管理的线程，用于实际执行goroutine的代码。
> - **P（Processor）**：表示一个逻辑处理器。P负责调度G到M上执行。每个P有一个本地队列，用于存储等待执行的goroutine。
>
> ---
>
> **调度器的工作原理**
>
> Go调度器通过以下步骤实现M 调度
>
> 1. **初始化**：程序启动时，会创建一些初始的P（默认等于CPU核心数）。每个P都有一个本地队列用于存储goroutine。
> 2. **创建goroutine**：当使用`go`关键字启动一个新goroutine时，调度器会将其添加到某个P的本地队列中。
> 3. **调度循环**：
>    - 每个P会在其本地队列中取出一个goroutine，并将其分配给一个M（内核线程）执行。
>    - 如果一个P的本地队列为空，它会从全局队列或其他P的本地队列中窃取goroutine。
>    - 当一个goroutine进行阻塞操作（如I/O操作）时，M会被释放以执行其他goroutine，阻塞的goroutine会被放回到队列中等待调度。
> 4. **抢占式调度**：为了防止一个goroutine长期占用CPU，Go调度器会定期检查正在运行的goroutine，并在必要时进行抢占，以确保其他goroutine也能得到执行机会。

- goroutine 和线程的区别
  - **创建和管理开销**：
    - **Goroutine**：创建 goroutine 的开销很小，可以在短时间内创建数千甚至数百万个 goroutine。Go 运行时会自动管理 goroutine 的调度和生命周期。
    - **线程**：创建操作系统线程的开销较大，通常需要更多的内存和时间。操作系统线程的数量有限，过多的线程可能会导致系统资源耗尽。
  - **调度**：
    - **Goroutine**：由 Go 运行时调度，使用协作式调度模型。当 goroutine 需要等待（例如 I/O 操作），Go 运行时会自动切换到其他 goroutine，确保高效利用 CPU。
    - **线程**：由操作系统调度，使用抢占式调度模型。操作系统会定期中断线程并切换上下文，以确保所有线程都能得到执行机会。
  - **栈大小**：
    - **Goroutine**：初始栈大小很小，通常为几个 KB，并且可以动态增长和收缩。这样可以在不浪费内存的情况下处理大量的并发任务。
    - **线程**：初始栈大小较大，通常为 1 MB 或更多，不能动态调整。这可能会导致大量内存被浪费，特别是在处理大量并发任务时。
  - **同步机制**：
    - **Goroutine**：Go 提供了丰富的同步原语，如通道（channel）、互斥锁（sync.Mutex）、等待组（sync.WaitGroup）等，便于 goroutine 之间的通信和同步。
    - **线程**：操作系统线程通常使用锁、条件变量和信号量等同步原语进行通信和同步。

---















