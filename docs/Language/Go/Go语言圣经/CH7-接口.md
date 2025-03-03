---
date: 2024-06-05
---

# CH7.接口

---

- [CH7.接口](#ch7接口)
  - [CH7.6.sort.Interface接口](#ch76sortinterface接口)
  - [CH7.7.http.Handler接口](#ch77httphandler接口)
  - [CH7.8.error接口](#ch78error接口)
  - [CH7.9.示例.表达式求值](#ch79示例表达式求值)
  - [CH7.10.类型断言](#ch710类型断言)
  - [CH7.11.基于类型断言区别错误类型](#ch711基于类型断言区别错误类型)
  - [CH7.12.通过类型断言询问行为](#ch712通过类型断言询问行为)
  - [CH7.13.类型分支](#ch713类型分支)
  - [CH7.14.示例.基于标记的XML解码](#ch714示例基于标记的xml解码)
  - [CH7.15.补充几点](#ch715补充几点)

---

## CH7.1.接口是合约

接口类型是一种抽象的类型。它不会暴露出它所代表的对象的内部值的结构和这个对象支持的基础操作的集合；它们只会表现出它们自己的方法。

也就是说当你有看到一个接口类型的值时，你不知道它是什么，唯一知道的就是可以通过它的方法来做什么。

例如 `io.Writer` 就是一个接口类型

```go
package io

// Writer is the interface that wraps the basic Write method.
type Writer interface {
    // Write writes len(p) bytes from p to the underlying data stream.
    // It returns the number of bytes written from p (0 <= n <= len(p))
    // and any error encountered that caused the write to stop early.
    // Write must return a non-nil error if it returns n < len(p).
    // Write must not modify the slice data, even temporarily.
    //
    // Implementations must not retain p.
    Write(p []byte) (n int, err error)
}
```

---

### EX7.1.实现针对单词和行数的计数器

**练习 7.1：** 使用来自ByteCounter的思路，实现一个针对单词和行数的计数器。你会发现bufio.ScanWords非常的有用。

```go
package main

import (
	"bufio"
	"fmt"
	"strings"
)

type WordCounter int
type LineCounter int

// 写入时统计单词数
func (c *WordCounter) Write(p []byte) (int, error) {
	scanner := bufio.NewScanner(strings.NewReader(string(p)))
	scanner.Split(bufio.ScanWords)
	count := 0
	for scanner.Scan() {
		count++
	}
	*c += WordCounter(count)
	return len(p), nil
}

// 写入时统计行数
func (c *LineCounter) Write(p []byte) (int, error) {
	scanner := bufio.NewScanner(strings.NewReader(string(p)))
	count := 0
	for scanner.Scan() {
		count++
	}
	*c += LineCounter(count)
	return len(p), nil
}

func main() {
	// 测试 WordCounter 统计单词数
	var wc WordCounter
	wc.Write([]byte("hello world"))
	fmt.Println(wc) // 2个单词

	wc = 0 // 重置计数器
	var sentence = "hello, Dolly. How are you?"
	fmt.Fprintf(&wc, "hello, %s", sentence)
	fmt.Println(wc) // 6个单词

	// 测试 LineCounter
	var lc LineCounter
	lc.Write([]byte("hello world\nhello Go\n"))
	fmt.Println(lc) // 2行

	lc = 0 // 重置计数器
	var text = "hello, Dolly.\nHow are you?\nI am fine."
	fmt.Fprintf(&lc, "hello, %s", text)
	fmt.Println(lc) // 3行

}

```

![image-20240611023946095](http://cdn.ayusummer233.top/DailyNotes/202406110239140.png)

- `scanner := bufio.NewScanner(strings.NewReader(string(p)))`

  - `string(p)`：将字节切片 `p` 转换为字符串
  - `strings.NewReader`：创建一个 `strings.Reader` 读取字符串的数据
  - `bufio.NewScanner`：创建一个新的 `Scanner` 用于扫描 `strings.Reader` 提供的输入数据

  `scanner` 是一个 `bufio.Scanner` 类型的实例，读取由 `strings.NewReader` 提供的输入数据

- `scanner.Split(bufio.ScanWords)`: 用于设置 `bufio.Scanner` 的分割函数，使其在扫描输入数据时按单词进行分割

  > 默认情况下，`bufio.Scanner` 使用 `bufio.ScanLines` 作为分割函数，逐行读取输入数据

---

## CH7.2.接口类型

同上~ 上一节和这节内容区别不大~

---

## CH7.3.实现接口的条件

一个类型如果拥有一个接口需要的所有方法，那么这个类型就实现了这个接口

---

## CH7.4.flag.Value接口

前面练习有做过的的命令行参数相关内容

flag.Value接口的类型

```go
package flag

// Value is the interface to the value stored in a flag.
type Value interface {
    String() string
    Set(string) error
}

```

---

- `fmt.Sscanf(s, "%f%s", &value, &unit)` 用来从字符串 `s` 中解析出格式化数据
  - `%f`：匹配一个浮点数，并将其存储到 `value` 变量中
  - `%s`：匹配一个字符串，并将其存储到 `unit` 变量中

---

```go
func CelsiusFlag(name string, value Celsius, usage string) *Celsius {
	f := celsiusFlag{value}
	flag.CommandLine.Var(&f, name, usage)
	return &f.Celsius
}
```

- `flag.CommandLine.Var(&f, name, usage)`
  - `flag.CommandLine` 是标准命令行标志集，`Var` 方法将 `f` 注册为一个命令行标志
  - `&f` 是 `celsiusFlag` 类型的指针，它实现了 `flag.Value` 接口，所以可以被 `Var` 方法接受
    - `func (f *celsiusFlag) Set(s string) error `
    - `type *celsiusFlag* struct{ *Celsius* }`
      - `func (c Celsius) String() string`
  - `name` 是标志的名称
  - `usage` 是标志的描述，用于生成帮助信息

---

### EX7.6.为tempFlag加入支持开尔文温度

**练习 7.6：** 对tempFlag加入支持开尔文温度

**练习 7.7：** 解释为什么帮助信息在它的默认值是20.0没有包含°C的情况下输出了°C

```go
// Kelvin to Celsius 转换
func KToC(k Kelvin) Celsius {
	return Celsius(k - 273.15)
}

// Kelvin 类型定义
type Kelvin float64

func (k Kelvin) String() string {
	return fmt.Sprintf("%gK", k)
}

func (f *celsiusFlag) Set(s string) error {
	var unit string
	var value float64
	fmt.Sscanf(s, "%f%s", &value, &unit) // no error check needed
	switch unit {
	case "C", "°C":
		f.Celsius = Celsius(value)
		return nil
	case "F", "°F":
		f.Celsius = FToC(Fahrenheit(value))
		return nil
	case "K":
		f.Celsius = KToC(Kelvin(value))
		return nil
	}
	return fmt.Errorf("invalid temperature %q", s)
}
```

![image-20240611035324848](http://cdn.ayusummer233.top/DailyNotes/202406110353893.png)

---

## CH7.5.接口值

接口值是指任何实现了该接口的具体类型的实例。

概念上讲一个接口的值，接口值，由两个部分组成，一个具体的类型和那个类型的值。

它们被称为接口的动态类型和动态值。

对于像Go语言这种静态类型的语言，类型是编译期的概念；因此一个类型不是一个值。

在我们的概念模型中，一些提供每个类型信息的值被称为类型描述符，比如类型的名称和方法。

在一个接口值中，类型部分代表与之相关类型的描述符。

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

在Go语言中，类型断言（Type Assertion）是一种用于将接口类型的变量转换为具体类型的机制

它的语法形式为`x.(T)`，其中`x`是一个接口类型的变量，`T`是希望将`x`转换成的具体类型

类型断言有两种使用形式：

1. **单值形式**：这种形式用于断言`x`为具体类型`T`

   如果断言失败（即`x`不是类型`T`），会触发运行时错误（panic）

   ```go
   // 声明一个变量 i，类型为空接口类型
   var i interface{} = "hello"
   s := i.(string) // 将s断言为string类型(s现在是string类型，值为"hello")
   fmt.Println(s) // hello
   ```

   ![image-20240606011751149](http://cdn.ayusummer233.top/DailyNotes/202406060117222.png)

   ![image-20240606012001956](http://cdn.ayusummer233.top/DailyNotes/202406060120985.png)

2. **双值形式**：这种形式除了返回断言后的具体类型，还返回一个布尔值，指示断言是否成功

   如果断言失败，不会触发运行时错误，而是返回`false`

   ```go
   var i interface{} = "hello"
   s, ok := i.(string)
   if ok {
       fmt.Println(s) // s是string类型，值为"hello"
   } else {
       fmt.Println("类型断言失败")
   }
   ```

   ![image-20240606012207601](http://cdn.ayusummer233.top/DailyNotes/202406060122643.png)

   PS: 这里断言失败时 s 是断言类型的初始值, 也即 string 类型的初始值-空字符串

   ![image-20240606013510117](http://cdn.ayusummer233.top/DailyNotes/202406060135191.png)

类型断言主要用于以下场景：

- 从接口类型中提取具体类型，以访问具体类型的方法或字段
- 检查接口类型变量的具体类型，以实现类型安全的操作

---

## CH7.11.基于类型断言区别错误类型

`error`接口的定义:

```go
type error interface {
    Error() string
}
```

何实现了`Error`方法的类型都实现了`error`接口。因此，我们可以定义不同的错误类型, 然后后续在出现错误， 进行错误处理时，可以挨个自定义的错误类型进行断言然后判断具体是哪个错误

通过这种方式，我们可以在处理错误时根据具体的错误类型执行不同的操作，使得错误处理更加灵活和细致

例如定义两个自定义错误类型：`MyError`和`AnotherError`。然后使用类型断言来区别错误的具体类型，并根据不同的错误类型执行不同的处理逻辑：

```go
package main

import (
    "fmt"
)

// 自定义错误类型
type MyError struct {
    Msg string
}

func (e *MyError) Error() string {
    return e.Msg
}

// 另一种自定义错误类型
type AnotherError struct {
    Code int
    Msg  string
}

func (e *AnotherError) Error() string {
    return fmt.Sprintf("Code: %d, Msg: %s", e.Code, e.Msg)
}

func main() {
    var err error

    // 赋值一个MyError类型的错误(在变量 err 中存储一个 MyError 类型的指针，该指针指向一个包含消息 "this is a MyError" 的 MyError 实例)
    err = &MyError{Msg: "this is a MyError"}

    // 基于类型断言处理错误
    if myErr, ok := err.(*MyError); ok {
        fmt.Println("这是一个MyError:", myErr.Msg)
    } else if anotherErr, ok := err.(*AnotherError); ok {
        fmt.Println("这是另一个错误类型:", anotherErr.Msg)
    } else {
        fmt.Println("这是一个普通错误:", err)
    }

    // 赋值一个AnotherError类型的错误
    err = &AnotherError{Code: 404, Msg: "not found"}

    // 基于类型断言处理错误
    if myErr, ok := err.(*MyError); ok {
        fmt.Println("这是一个MyError:", myErr.Msg)
    } else if anotherErr, ok := err.(*AnotherError); ok {
        fmt.Println("这是另一个错误类型:", anotherErr.Code, anotherErr.Msg)
    } else {
        fmt.Println("这是一个普通错误:", err)
    }
}

```

> PS: `if ... else ...` 太多层的话可以考虑用 `switch ... case ...`

![image-20240606013706209](http://cdn.ayusummer233.top/DailyNotes/202406060137243.png)

---

## CH7.12.通过类型断言询问行为

和上一章关于类型断言的使用性质基本一致, 区别只是=这里不是断言错误然后具体错误具体处理了, 而是用于其他类型进行断言和具体处理

> 本章没有习题

---

## CH7.13.类型分支

这一节讲的就是这个:

![image-20240606014729944](http://cdn.ayusummer233.top/DailyNotes/202406060147989.png)

例如:

```go
package main

import (
	"fmt"
)

func main() {
	// 定义一个接口切片，包含不同的类型
	var data = []interface{}{42, "hello", true, 3.14}

	for _, v := range data {
		// 使用类型分支处理不同的类型
		switch value := v.(type) {
		case int:
			fmt.Printf("整数: %d\n", value)
		case string:
			fmt.Printf("字符串: %s\n", value)
		case bool:
			fmt.Printf("布尔值: %t\n", value)
		case float64:
			fmt.Printf("浮点数: %f\n", value)
		default:
			fmt.Println("未知类型")
		}
	}
}

```

![image-20240606015822864](http://cdn.ayusummer233.top/DailyNotes/202406060158939.png)

---

## CH7.14.示例.基于标记的XML解码

具体场景示例, 可以不看

---

CH7.10~CH7.14总的来说就是讲了类型断言及其分支处理, 因此完全可以基于 `类型分支` 来出个习题, 例如:

假设你正在编写一个简单的图形处理程序，程序中有几种不同的图形类型：`Circle`、`Rectangle` 和 `Triangle`。每个图形类型都有一个方法 `Area` 来计算其面积。请你编写一个函数 `PrintArea`，该函数接收一个空接口 `shape`，并使用类型分支来判断图形的具体类型，并打印其面积。

具体要求：

1. 定义 `Circle`、`Rectangle` 和 `Triangle` 三种类型，并为每种类型实现 `Area` 方法。
2. 实现 `PrintArea` 函数，接收一个空接口 `shape` 参数，并使用类型分支打印相应图形的面积。
3. 在 `main` 函数中，创建几个不同类型的图形实例，并调用 `PrintArea` 函数来测试你的实现。

```go
package main

import (
	"fmt"
	"math"
)

// 定义 Circle 类型
type Circle struct {
	Radius float64
}

// 定义 Rectangle 类型
type Rectangle struct {
	Width, Height float64
}

// 定义 Triangle 类型
type Triangle struct {
	Base, Height float64
}

// 为 Circle 实现 Area 方法
func (c Circle) Area() float64 {
	return math.Pi * c.Radius * c.Radius
}

// 为 Rectangle 实现 Area 方法
func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

// 为 Triangle 实现 Area 方法
func (t Triangle) Area() float64 {
	return 0.5 * t.Base * t.Height
}

// PrintArea 函数，使用类型分支判断图形类型并打印面积
func PrintArea(shape interface{}) {
	switch s := shape.(type) {
	case Circle:
		fmt.Printf("Circle Area: %.2f\n", s.Area())
	case Rectangle:
		fmt.Printf("Rectangle Area: %.2f\n", s.Area())
	case Triangle:
		fmt.Printf("Triangle Area: %.2f\n", s.Area())
	default:
		fmt.Println("Unknown shape")
	}
}

func main() {
	// 创建不同类型的图形实例
	c := Circle{Radius: 5}
	r := Rectangle{Width: 4, Height: 6}
	t := Triangle{Base: 3, Height: 4}

	// 调用 PrintArea 函数打印图形的面积
	PrintArea(c)
	PrintArea(r)
	PrintArea(t)
}

```

![image-20240611035732473](http://cdn.ayusummer233.top/DailyNotes/202406110357534.png)

----

## CH7.15.补充几点

> [补充几点 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch7/ch7-15.html)

- 接口只有当有两个或两个以上的具体类型必须以相同的方式进行处理时才需要

  > 当设计一个新的包时，新手Go程序员总是先创建一套接口，然后再定义一些满足它们的具体类型。这种方式的结果就是有很多的接口，它们中的每一个仅只有一个实现。
  >
  > 不要再这么做了。这种接口是不必要的抽象；它们也有一个运行时损耗。
  >
  > 你可以使用导出机制（§6.6）来限制一个类型的方法或一个结构体的字段是否在包外可见

- 当一个接口只被一个单一的具体类型实现时有一个例外，就是由于它的依赖，这个具体类型不能和这个接口存在在一个相同的包中。这种情况下，一个接口是解耦这两个包的一个好方式。

  > 假设我们有两个包：`packageA` 和 `packageB`。`packageA` 依赖于 `packageB`，并且 `packageB` 中的一个具体类型需要实现 `packageA` 中的一个接口。如果接口和具体类型放在同一个包中，就会导致循环依赖问题。
  >
  > 为了解耦这两个包，可以将接口放在一个独立的包中，而具体类型依旧放在其原来的包中。这样可以通过接口来解耦这两个包。

- 因为在Go语言中通常只有当两个或更多的类型实现一个接口时才使用接口，它们必定会从任意特定的实现细节中抽象出来。结果就是有更少和更简单方法的更小的接口（经常和io.Writer或 fmt.Stringer一样只有一个）。当新的类型出现时，小的接口更容易满足。对于接口设计的一个好的标准就是 ask only for what you need（只考虑你需要的东西）

-----























