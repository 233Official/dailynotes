---

---

# CH6.方法

---

- [CH6.方法](#ch6方法)
	- [CH6.1.方法声明](#ch61方法声明)
	- [CH6.2.基于指针对象的方法](#ch62基于指针对象的方法)
	- [CH6.3.通过嵌入结构体来扩展类型](#ch63通过嵌入结构体来扩展类型)
	- [CH6.4.方法值和方法表达式](#ch64方法值和方法表达式)
	- [CH6.5.示例:Bit数组](#ch65示例bit数组)
	- [CH6.6.封装](#ch66封装)
	- [习题](#习题)

---

## CH6.1.方法声明

> [方法声明 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch6/ch6-01.html)

在Go语言中，方法声明是指在类型上定义的函数。方法是与某种类型相关联的函数，它们可以访问该类型的数据并对其进行操作。方法的声明格式为：

```go
func (receiver ReceiverType) methodName(parameters) returnType {
    // 方法体
}
```

- `receiver` 是方法接收者，可以是任何类型的参数（除了指针、切片、映射、函数等），它可以是结构体、自定义类型等
- `ReceiverType` 是接收者类型，指定了方法所属的类型
- `methodName` 是方法的名称
- `parameters` 是方法的参数列表
- `returnType` 是方法的返回类型

在调用方法时，使用点号`.`将方法附加到具体的实例上。方法调用的一般形式为 `receiver.methodName(parameters)`

方法声明使得我们可以将行为与数据结构关联起来，这样就可以更清晰地组织代码，并且可以通过方法来操作特定类型的数据

---

## CH6.2.基于指针对象的方法

> [基于指针对象的方法 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch6/ch6-02.html)

在Go语言中，可以为一个类型声明方法，这些方法可以基于该类型的实例调用。另外，还可以为指向该类型实例的指针声明方法。这些被称为基于指针对象的方法。

当在Go语言中定义方法时，接收者(receiver)可以是一个值类型或指针类型。基于值类型的方法会在方法调用时复制该值，而基于指针类型的方法则会在方法调用时共享指针所指向的值。

类似于其他语言, 这里方法传指针就是为了能修改原始变量值

例如:

```go
package main

import (
	"fmt"
)

type Point struct {
	X, Y int
}

// 值类型的方法
func (p Point) ValueMethod() {
	p.X = 100 // 这里修改的是方法接收者的副本，不会影响原始实例
}

// 指针类型的方法
func (p *Point) PointerMethod() {
	p.X = 100 // 这里修改的是指针所指向的原始实例
}

func main() {
	p1 := Point{X: 10, Y: 20}

	// 值类型的方法调用
	p1.ValueMethod()
	fmt.Println("After ValueMethod:", p1) // 输出：{10 20}，值类型的方法未修改原始实例

	// 指针类型的方法调用
	p2 := &Point{X: 10, Y: 20}
	p2.PointerMethod()
	fmt.Println("After PointerMethod:", *p2) // 输出：{100 20}，指针类型的方法修改了原始实例
}

```

---

## CH6.3.通过嵌入结构体来扩展类型

> [通过嵌入结构体来扩展类型 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch6/ch6-03.html)

> 类似 CPP 中继承的用法

在Go语言中，通过嵌入结构体来扩展类型是一种组合的方式，允许一个结构体类型（被称为内部类型）被嵌入到另一个结构体类型中（被称为外部类型），从而使得外部类型可以直接访问内部类型的字段和方法

这种嵌入的方式可以看作是一种代码复用的手段，类似于继承，但是不同于传统的继承，Go语言中的嵌入是非侵入式的

> `非侵入式`：内部类型的实现细节对外部类型是透明的，外部类型可以直接使用内部类型的方法和字段，而不需要继承或修改内部类型的定义。

```go
package main

import "fmt"

// 内部类型
type Person struct {
	Name string
	Age  int
}

// 外部类型
type Employee struct {
	Person // 内部类型Person被嵌入到Employee中
	Job    string
}

func main() {
	emp := Employee{
		Person: Person{Name: "Alice", Age: 30},
		Job:    "Software Engineer",
	}

	fmt.Println("Employee Name:", emp.Name) // 直接访问内部类型的字段
	fmt.Println("Employee Age:", emp.Age)   // 直接访问内部类型的字段
	fmt.Println("Employee Job:", emp.Job)   // 访问外部类型的字段
}

```

---

## CH6.4.方法值和方法表达式

> [方法值和方法表达式 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch6/ch6-04.html)

- `方法值(Method Value)`

  方法值是将方法绑定到特定实例上的函数值。通过将接收者作为第一个参数传递给方法，可以创建一个绑定了特定实例的函数。这样的函数可以像普通函数一样被调用，不需要再传递接收者

  ```go
  package main
  
  import "fmt"
  
  type Point struct {
  	X, Y int
  }
  
  func (p Point) Distance() float64 {
  	return float64(p.X*p.X + p.Y*p.Y)
  }
  
  func main() {
  	p := Point{3, 4}
  
  	// 方法值
  	distanceFromP := p.Distance
  	fmt.Println(distanceFromP()) // 输出：25
  }
  
  ```

- `方法表达式(Method Expression)`

  方法表达式是指通过类型来调用方法，而不是通过实例。它是一种函数值，可以像普通函数一样被调用。与方法值不同，方法表达式不需要实例，而是需要显式提供一个接收者参数

  ```go
  package main
  
  import "fmt"
  
  type Point struct {
  	X, Y int
  }
  
  func (p Point) Distance() float64 {
  	return float64(p.X*p.X + p.Y*p.Y)
  }
  
  func main() {
  	// 方法表达式
  	distance := Point.Distance
  	p := Point{3, 4}
  	fmt.Println(distance(p)) // 输出：25
  }
  
  ```

  `Point.Distance` 是一个方法表达式，它将 `Point` 类型的 `Distance` 方法转换为一个普通的函数，该函数接受一个 `Point` 类型的参数

  当调用 `distance(p)` 时, 实际上是在调用 `Point` 类型的 `Distance` 方法, 但是是通过函数调用的形式，而不是通过实例调用的形式

---

## CH6.5.示例:Bit数组

> [示例: Bit数组 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch6/ch6-05.html)
>
> [十二、【数据结构】位图(bitmap)的详解与实现_位图的定义与实现-CSDN博客](https://blog.csdn.net/qq_18108083/article/details/85063072)

这一章讲了位图法通过使用位数组来紧凑地表示整数集合，每个位表示一个整数的存在或不存在。通过计算整数的 `word` 索引和 `bit` 位可以高效地添加、检查和删除集合中的元素。这种方法特别适用于处理稠密的整数集合。

![image-20240604003832202](http://cdn.ayusummer233.top/DailyNotes/202406040038258.png)

```go
package main

import (
	"bytes"
	"fmt"
)

// An IntSet is a set of small non-negative integers.
// Its zero value represents the empty set.
type IntSet struct {
	words []uint64
}

// Has reports whether the set contains the non-negative value x.
func (s *IntSet) Has(x int) bool {
	word, bit := x/64, uint(x%64)
	return word < len(s.words) && s.words[word]&(1<<bit) != 0
}

// Add adds the non-negative value x to the set.
func (s *IntSet) Add(x int) {
	word, bit := x/64, uint(x%64)
	for word >= len(s.words) {
		s.words = append(s.words, 0)
	}
	s.words[word] |= 1 << bit
}

// UnionWith sets s to the union of s and t.
func (s *IntSet) UnionWith(t *IntSet) {
	for i, tword := range t.words {
		if i < len(s.words) {
			s.words[i] |= tword
		} else {
			s.words = append(s.words, tword)
		}
	}
}

// String returns the set as a string of the form "{1 2 3}".
func (s *IntSet) String() string {
	var buf bytes.Buffer
	buf.WriteByte('{')
	for i, word := range s.words {
		if word == 0 {
			continue
		}
		for j := 0; j < 64; j++ {
			if word&(1<<uint(j)) != 0 {
				if buf.Len() > len("{") {
					buf.WriteByte(' ')
				}
				fmt.Fprintf(&buf, "%d", 64*i+j)
			}
		}
	}
	buf.WriteByte('}')
	return buf.String()
}

// ex6_1
// Len returns the number of elements in the set.
func (s *IntSet) Len() int {
	count := 0
	for _, word := range s.words {
		count += popCount(word)
	}
	return count
}

// Remove removes x from the set.
func (s *IntSet) Remove(x int) {
	word, bit := x/64, uint(x%64)
	if word < len(s.words) {
		s.words[word] &^= 1 << bit
	}
}

// Clear removes all elements from the set.
func (s *IntSet) Clear() {
	s.words = nil
}

// Copy returns a copy of the set.
func (s *IntSet) Copy() *IntSet {
	t := &IntSet{}
	t.words = append(t.words, s.words...)
	return t
}

// Helper function to count the number of set bits (1s) in a uint64.
func popCount(x uint64) int {
	count := 0
	for x != 0 {
		x &= x - 1
		count++
	}
	return count
}

func ex6_1() {
	var s IntSet

	// 向集合 s 中添加一些元素
	s.Add(1)
	s.Add(144)
	s.Add(9)

	// 输出集合的长度
	fmt.Println("Set s length:", s.Len()) // 3

	// 从集合中移除元素
	s.Remove(9)
	fmt.Println("Set s contains 9 after removal:", s.Has(9)) // false
	fmt.Println("Set s length after removal:", s.Len())      // 2

	// 复制集合
	t := s.Copy()
	fmt.Println("Copy of set s contains 1:", t.Has(1))     // true
	fmt.Println("Copy of set s contains 144:", t.Has(144)) // true

	// 清空集合
	s.Clear()
	fmt.Println("Set s length after clearing:", s.Len())      // 0
	fmt.Println("Set s contains 1 after clearing:", s.Has(1)) // false
}

// ex6_2 AddAll
// AddAll adds a list of non-negative values to the set.
func (s *IntSet) AddAll(values ...int) {
	for _, v := range values {
		s.Add(v)
	}
}

func ex6_2() {
	var s IntSet

	// 使用 AddAll 方法添加一组元素
	s.AddAll(1, 2, 3, 144, 9)

	// 输出集合的长度
	fmt.Println("Set s length:", s.Len()) // 5

	// 检查集合是否包含某些元素
	fmt.Println("Set s contains 1:", s.Has(1))     // true
	fmt.Println("Set s contains 144:", s.Has(144)) // true
	fmt.Println("Set s contains 5:", s.Has(5))     // false
}

// ex6_3 交集 差集 并差集
// IntersectWith sets s to the intersection of s and t.
func (s *IntSet) IntersectWith(t *IntSet) {
	for i := range s.words {
		if i < len(t.words) {
			s.words[i] &= t.words[i]
		} else {
			s.words[i] = 0
		}
	}
}

// DifferenceWith sets s to the difference of s and t.
func (s *IntSet) DifferenceWith(t *IntSet) {
	for i := range s.words {
		if i < len(t.words) {
			s.words[i] &^= t.words[i]
		}
	}
}

// SymmetricDifference sets s to the symmetric difference of s and t.
func (s *IntSet) SymmetricDifference(t *IntSet) {
	for i, tword := range t.words {
		if i < len(s.words) {
			s.words[i] ^= tword
		} else {
			s.words = append(s.words, tword)
		}
	}
}

func ex6_3() {
	// ex6_3 交集 差集 并差集
	var s, t IntSet

	// 向集合 s 和 t 中添加一些元素
	s.AddAll(1, 144, 9)
	t.AddAll(9, 42)

	// 输出集合 s 和 t 的并集
	s.UnionWith(&t)
	fmt.Println("Union of s and t:", s) // [1 9 42 144]

	// 重置 s 和 t
	s.Clear()
	s.AddAll(1, 144, 9)
	t.Clear()
	t.AddAll(9, 42)

	// 输出集合 s 和 t 的交集
	s.IntersectWith(&t)
	fmt.Println("Intersection of s and t:", s) // [9]

	// 重置 s 和 t
	s.Clear()
	s.AddAll(1, 144, 9)
	t.Clear()
	t.AddAll(9, 42)

	// 输出集合 s 和 t 的差集
	s.DifferenceWith(&t)
	fmt.Println("Difference of s and t:", s) // [1 144]

	// 重置 s 和 t
	s.Clear()
	s.AddAll(1, 144, 9)
	t.Clear()
	t.AddAll(9, 42)

	// 输出集合 s 和 t 的并差集
	s.SymmetricDifference(&t)
	fmt.Println("Symmetric difference of s and t:", s) // [1 42 144]
}

// ex6_4 Elems()
// Elems returns all elements in the set as a slice of ints.
func (s *IntSet) Elems() []int {
	var elems []int
	for i, word := range s.words {
		for bit := 0; bit < 64; bit++ {
			if word&(1<<uint(bit)) != 0 {
				elems = append(elems, 64*i+bit)
			}
		}
	}
	return elems
}

func ex6_4() {
	var s IntSet

	// 向集合 s 中添加一些元素
	s.AddAll(1, 144, 9, 42)

	// 使用 Elems 方法获取集合中的所有元素
	elems := s.Elems()
	fmt.Println("Elements in set s:", elems) // [1 9 42 144]

	// 使用 range 遍历集合中的元素
	for _, elem := range elems {
		fmt.Println("Element:", elem)
	}
}

func main() {
	fmt.Println("==========ex6_1==========")
	ex6_1()
	fmt.Println("==========ex6_2==========")
	ex6_2()
	fmt.Println("==========ex6_3==========")
	ex6_3()
	fmt.Println("==========ex6_4==========")
	ex6_4()
}

```

![image-20240604003642522](http://cdn.ayusummer233.top/DailyNotes/202406040036570.png)

- **方法 `Has`**:

  ```go
  func (s *IntSet) Has(x int) bool {
      word, bit := x/64, uint(x%64)
      return word < len(s.words) && s.words[word]&(1<<bit) != 0
  }
  ```

  检查集合中是否包含非负整数 `x`。通过计算 `x` 所在的 `word` 和 `bit`，然后检查对应的位是否为 1

- **方法 `Add`**:

  ```go
  func (s *IntSet) Add(x int) {
      word, bit := x/64, uint(x%64)
      for word >= len(s.words) {
          s.words = append(s.words, 0)
      }
      s.words[word] |= 1 << bit
  }
  ```

  非负整数 `x` 添加到集合中。通过计算 `x` 所在的 `word` 和 `bit`，然后设置对应的位为 1

  如果 `words` 切片不够长，会通过 `append` 扩展

- **方法 `UnionWith`**:

  ```go
  func (s *IntSet) UnionWith(t *IntSet) {
      for i, tword := range t.words {
          if i < len(s.words) {
              s.words[i] |= tword
          } else {
              s.words = append(s.words, tword)
          }
      }
  }
  ```

  将当前集合 `s` 设置为与集合 `t` 的并集。通过遍历 `t.words`，将对应的位或操作应用到 `s.words` 上

  如果 `s.words` 的长度不够，会通过 `append` 扩展

  ---

- **`Len() int`**:

  遍历 `s.words`，对每个 `uint64` 元素，计算其包含的 1 的个数。

  使用 `popCount` 辅助函数，该函数使用 Brian Kernighan 算法来高效地计算一个 `uint64` 中的 1 的个数。

  Brian Kernighan 算法:

  - 初始化一个计数器 `count` 为 0

    如果 `x` 不为 0，进入循环:

    - 将 `count` 加 1
    - 使用 `x & (x - 1)` 操作清除 `x` 中最右边的 1

    重复步骤 2 直到 `x` 为 0

    返回 `count`

- **`Remove(x int)`**

  计算 `x` 在 `words` 中的索引和位偏移。

  如果 `word` 小于 `s.words` 的长度，则将 `words[word]` 中对应的位设置为 0（使用按位清除操作 `&^`）。

- **`Clear()`**: 直接将 `s.words` 设置为 `nil`，清空所有元素

- **`Copy() *IntSet`**

  - 创建一个新的 `IntSet` 实例 `t`
  - 使用 `append` 函数将 `s.words` 中的元素复制到 `t.words`

- **`AddAll(values ...int)`**

  这是一个变参方法，可以接收零个或多个 `int` 类型的参数

  使用 `range` 迭代参数列表，将每个参数通过 `Add` 方法添加到集合中

  ---

- **`IntersectWith(t *IntSet)`**: 交集

  - 对于每个 `word`，取当前集合和参数集合的按位与操作，结果存储在当前集合中
  - 若当前集合比参数集合长，则多出的部分设为 0

- **`DifferenceWith(t *IntSet)`**: 差集

  差集是指在一个集合中存在但在另一个集合中不存在的元素的集合

  - 对于每个 `word`，取当前集合和参数集合的按位与非操作，结果存储在当前集合中

    若当前集合比参数集合长，则多出的部分保持不变

  - 按位与非操作（`&^`）会将一个集合中对应位置上的 1 设置为 0，而这些位置在另一个集合中也有 1

- **`SymmetricDifference(t *IntSet)`**: 对称差

  对称差（Symmetric Difference）是集合论中的一个概念，它表示两个集合中所有不属于它们交集的元素组成的集合。换句话说，对称差包含那些只出现在一个集合中而不出现在两个集合中的元素。

  - 对于每个 `word`，取当前集合和参数集合的按位异或操作，结果存储在当前集合中

    异或操作（`^`）会将两个集合中相应位不相同的地方设置为 1，相同的地方设置为 0

  - 若参数集合比当前集合长，则直接添加多出的部分

  ---

- **`Elems` 方法**：返回集合中的所有元素，用于做一些range之类的遍历操作

  - 遍历 `words` 切片中的每一个 `word`。
  - 对每一个 `word`，检查每一个位（bit）是否被设置（即是否为 1）
  - 如果某个位被设置，则计算其对应的整数值，并将其添加到结果切片 `elems` 中
  - 返回包含所有集合中元素的 `elems` 切片

---

## CH6.6.封装

>[封装 - Go语言圣经 (golang-china.github.io)](https://golang-china.github.io/gopl-zh/ch6/ch6-06.html)

在Go语言中，封装是一种面向对象编程中的概念，指的是将数据和操作数据的方法捆绑在一起，并对外部隐藏对象内部的实现细节。通过封装，我们可以控制对数据的访问和修改，从而提高代码的安全性和可维护性。

在Go语言中，封装是通过大小写字母来实现的：

1. 大写字母开头的标识符（如结构体、函数、方法等）是可导出的，可以被外部包访问。
2. 小写字母开头的标识符是不可导出的，只能在同一个包内部访问。

通过这种方式，我们可以在包内部隐藏实现细节，并且只暴露需要对外部使用的部分，以确保对数据的安全访问

---

## 习题

本章的习题是位图的一些操作, 并不是结合 `方法` 这个主题来出的, 这里只围绕 `方法` 这个主题来出个习题

- 创建一个 `Person` 结构体，包含人的姓名（name）和年龄（age）
- 创建一个 `Employee` 结构体，包含员工的信息，其中包括 `Person` 结构体的嵌入，以及员工的职位(position)
- 实现一个工厂函数 `NewEmployee`，用于创建 `Employee` 实例
- 实现一个公开的方法 `GetAge`，用于获取员工的年龄
- 实现一个公开的方法 `SetAge`，用于设置员工的年龄
- 在主函数中创建一个员工实例，并使用公开的方法获取和设置员工的年龄

```go
package main

import (
	"fmt"
)

// Person 人的信息结构体
type Person struct {
	name string // 可导出的字段
	age  int    // 不可导出的字段
}

// Employee 员工信息结构体，嵌入Person结构体
type Employee struct {
	Person
	position string // 可导出的字段
}

// NewEmployee 创建员工实例的工厂函数
func NewEmployee(name string, age int, position string) *Employee {
	return &Employee{
		Person:   Person{name: name, age: age},
		position: position,
	}
}

// GetAge 获取员工的年龄
func (e *Employee) GetAge() int {
	return e.age
}

// SetAge 设置员工的年龄
func (e *Employee) SetAge(age int) {
	e.age = age
}

func main() {
	// 创建一个员工实例
	employee := NewEmployee("summer", 23, "Software Engineer")

	// 获取员工的年龄并打印
	fmt.Println("Employee's age:", employee.GetAge())

	// 设置员工的年龄并再次获取并打印
	employee.SetAge(24)
	fmt.Println("Employee's age after setting:", employee.GetAge())
}

```

---















