# CH7.接口

---

- [CH7.接口](#ch7接口)
  - [CH7.6.sort.Interface接口](#ch76sortinterface接口)
  - [CH7.7.http.Handler接口](#ch77httphandler接口)
  - [CH7.8.error接口](#ch78error接口)
  - [CH7.9.示例.表达式求值](#ch79示例表达式求值)
  - [CH7.10.类型断言](#ch710类型断言)

---

## CH7.6.sort.Interface接口

> [sort.Interface接口 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch7/ch7-06.html)

排序操作和字符串格式化一样是很多程序经常使用的操作。Go语言的sort.Sort函数不会对具体的序列和它的元素做任何假设。相反，它使用了一个接口类型sort.Interface来指定通用的排序算法和可能被排序到的序列类型之间的约定。这

个接口的实现由序列的具体表示和它希望排序的元素决定，序列的表示经常是一个切片。

一个内置的排序算法需要知道三个东西：序列的长度，表示两个元素比较的结果，一种交换两个元素的方式；这就是sort.Interface的三个方法：

```go
package sort

type Interface interface {
    Len() int
    Less(i, j int) bool // i, j are indices of sequence elements
    Swap(i, j int)
}
```

- `Len() int`：返回切片的长度
- `Less(i, j int) bool`：比较切片中索引 `i` 和 `j` 的两个元素，如果 `i` 的元素应该排在 `j` 的元素之前，则返回 `true`，否则返回 `false`
- `Swap(i, j int)`：交换切片中索引 `i` 和 `j` 的两个元素

例如按照字典序排序字符串数组:

```go
package main

import (
	"fmt"
	"sort"
)

type StringSlice []string

func (p StringSlice) Len() int           { return len(p) }
func (p StringSlice) Less(i, j int) bool { return p[i] < p[j] }
func (p StringSlice) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }

func main() {
	names := StringSlice{"Go", "Python", "Java", "C++", "Rust"}
	sort.Sort(names)

	fmt.Println("Sorted names:")
	for _, name := range names {
		fmt.Println(name)
	}
}

```

> TODO: 习题感觉没必要做, 后续要实现再做, 因为这一节已经具体到具体接口应用了

---

## CH7.7.http.Handler接口

> [http.Handler接口 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch7/ch7-07.html)

这个接口是Go标准库 `net/http` 包中用于构建HTTP服务器的基础; 任何实现了 `http.Handler` 接口的类型都可以作为一个HTTP服务器的处理程序; 

```go
package http

type Handler interface {
    ServeHTTP(w ResponseWriter, r *Request)
}

func ListenAndServe(address string, h Handler) error

```

- `ServeHTTP(ResponseWriter, *Request)`

  - `ResponseWriter`：用于向客户端发送HTTP响应

    通过这个接口可以设置响应的状态码、头部信息和响应体

  - `*Request`：指向 `http.Request` 类型的指针; 包含了客户端发送的HTTP请求的所有信息，如请求方法、URL、头部信息和请求体等

任何类型只要实现了 `ServeHTTP` 方法，就可以被注册到HTTP路由中，用于处理特定的HTTP请求

```go
package main

import (
    "net/http"
    "fmt"
)

type MyHandler struct{}

func (h *MyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    handler := MyHandler{}
    http.Handle("/", &handler)
    http.ListenAndServe(":8080", nil)
}
```

> 这节的习题是聚焦具体场景的 handler 实现,没必要做

---

## CH7.8.error接口

`error` 是一个内置的接口类型，用于表示程序中的错误状态

`error` 接口定义了错误处理的标准方式，使得错误可以被创建、传递和检查

```go
type error interface {
    Error() string
}
```

- `Error() string` 返回一个描述错误信息的字符串。

创建 error 有如下几种方式

- **`errors.New`**: 返回一个包含给定错误信息的 `error` 类型的新实例

  ```go
  import "errors"
  
  err := errors.New("这是一个错误信息")
  ```

- **`fmt.Errorf`**: 根据格式化字符串创建一个错误

  ```go
  import "fmt"
  
  err := fmt.Errorf("发生了错误：%s", "具体错误信息")
  ```

- **`errors.Errorf`**: 与 `fmt.Errorf` 类似，但专门用于创建错误

  ```go
  import "github.com/pkg/errors"
  
  err := errors.Errorf("发生了错误：%s", "具体错误信息")
  ```

- **自定义错误类型**:

  定义一个新的类型，并实现 `error` 接口的 `Error` 方法，从而创建一个自定义的错误类型

  ```go
  type MyError struct {
      Message string
  }
  
  func (e *MyError) Error() string {
      return e.Message
  }
  
  err := &MyError{Message: "这是一个自定义错误"}
  ```

---

## CH7.9.示例.表达式求值

场景化的示例, 可以略过

---

## CH7.10.类型断言









