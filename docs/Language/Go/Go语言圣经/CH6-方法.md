# CH6.方法

## CH6.1.方法声明

## CH6.2.基于指针对象的方法

## CH6.3.通过嵌入结构体来扩展类型

## CH6.4.方法值和方法表达式

## CH6.5.示例:Bit数组

## CH6.6.封装

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















