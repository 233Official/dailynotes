# CH9-基于共享变量的并发

> [基于共享变量的并发 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch9/ch9.html)

前一章我们介绍了一些使用 goroutine 和 channel 这样直接而自然的方式来实现并发的方法。然而这样做我们实际上回避了在写并发代码时必须处理的一些重要而且细微的问题。

在本章中，我们会细致地了解并发机制。尤其是在多 goroutine 之间的共享变量，并发问题的分析手段，以及解决这些问题的基本模式。最后我们会解释 goroutine 和操作系统线程之间的技术上的一些区别。

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
  }
  
  ```

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

基于共享变量的并发在一定程度上与传统的多线程编程类似，需要小心处理共享资源以避免竞态条件（race conditions）。

然而，Go语言推荐使用通道（channels）进行goroutine之间的通信，因为通道的设计可以更自然地避免数据竞争问题，并且更容易编写和理解并发代码。

---