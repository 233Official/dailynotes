# CH5-函数

----

## CH5.1.函数声明

## CH5.2.递归

```go
// Findlinks1 prints the links in an HTML document read from standard input.
package main

import (
	"fmt"
	"os"

	"golang.org/x/net/html"
)

func main() {
	doc, err := html.Parse(os.Stdin)
	if err != nil {
		fmt.Fprintf(os.Stderr, "findlinks1: %v\n", err)
		os.Exit(1)
	}
	for _, link := range visit(nil, doc) {
		fmt.Println(link)
	}
}

// visit appends to links each link found in n and returns the result.
func visit(links []string, n *html.Node) []string {
	if n.Type == html.ElementNode && n.Data == "a" {
		for _, a := range n.Attr {
			if a.Key == "href" {
				links = append(links, a.Val)
			}
		}
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		links = visit(links, c)
	}
	return links
}

```

![image-20240528113327462](http://cdn.ayusummer233.top/DailyNotes/image-20240528113327462.png)

- `range` 关键字用于迭代各种数据结构，包括数组、切片、映射（map）、字符串和通道（channel）。在这里，`range` 用于迭代一个切片。

---

### EX5.1.循环改递归

**练习 5.1：** 修改findlinks代码中遍历n.FirstChild链表的部分，将循环调用visit，改成递归调用。

需要修改的代码是 

```go
for c := n.FirstChild; c != nil; c = c.NextSibling {
		links = visit(links, c)
}
```

循环实现的功能是向子节点索引, 为空则向兄弟节点索引

改成递归则需要在函数开头加个节点判空, 然后直接对兄弟和孩子节点调用函数即可

```go
func visit(links []string, n *html.Node) []string {
	if n == nil {
		return links
	}
	if n.Type == html.ElementNode && n.Data == "a" {
		for _, a := range n.Attr {
			if a.Key == "href" {
				links = append(links, a.Val)
			}
		}
	}
	links = visit(links, n.FirstChild)  // 递归调用遍历第一个子节点
	links = visit(links, n.NextSibling) // 递归调用遍历下一个兄弟节点
	return links
}
```

![image-20240528133708086](http://cdn.ayusummer233.top/DailyNotes/image-20240528133708086.png)

---

### EX5.2.记录同名元素次数

**练习 5.2：** 编写函数，记录在HTML树中出现的同名元素的次数。

在遍历的基础上加上一个字典统计元素出现次数即可

```go
package main

import (
	"fmt"
	"os"

	"golang.org/x/net/html"
)

func main() {
	doc, err := html.Parse(os.Stdin)
	if err != nil {
		fmt.Fprintf(os.Stderr, "findelements: %v\n", err)
		os.Exit(1)
	}
	elementsCount := make(map[string]int)
	countElements(elementsCount, doc)
	for element, count := range elementsCount {
		fmt.Printf("%s: %d\n", element, count)
	}
}

// countElements 递归遍历 HTML 树，并记录每种元素的出现次数。
func countElements(elementsCount map[string]int, n *html.Node) {
	if n == nil {
		return
	}
	if n.Type == html.ElementNode {
		elementsCount[n.Data]++
	}
	countElements(elementsCount, n.FirstChild)  // 递归遍历第一个子节点
	countElements(elementsCount, n.NextSibling) // 递归遍历下一个兄弟节点
}

// go build
// ..\findlinks1\CH1-5-GetURL.exe https://golang.org | .\ex5_2.exe

```

![image-20240528134107044](http://cdn.ayusummer233.top/DailyNotes/image-20240528134107044.png)

---

### EX5.3.选择性输出节点内容

**练习 5.3：** 编写函数输出所有text结点的内容。注意不要访问`<script>`和`<style>`元素，因为这些元素对浏览者是不可见的。

用 `n.Type == html.TextNode ` 来判断 text 节点, 用 `n.Type == html.ElementNode && (n.Data == "script" || n.Data == "style")` 来过滤不需要的节点即可

```go
package main

import (
	"fmt"
	"os"

	"golang.org/x/net/html"
)

func main() {
	doc, err := html.Parse(os.Stdin)
	if err != nil {
		fmt.Fprintf(os.Stderr, "findtext: %v\n", err)
		os.Exit(1)
	}
	printTextNodes(doc)
}

// printTextNodes 递归遍历 HTML 树，并输出所有文本节点的内容
func printTextNodes(n *html.Node) {
	if n == nil {
		return
	}
	if n.Type == html.TextNode {
		fmt.Println(n.Data)
	}
	if n.Type == html.ElementNode && (n.Data == "script" || n.Data == "style") {
		// 跳过 <script> 和 <style> 元素
		return
	}
	// 递归处理第一个子节点
	printTextNodes(n.FirstChild)
	// 递归处理下一个兄弟节点
	printTextNodes(n.NextSibling)
}

// go build
// ..\findlinks1\CH1-5-GetURL.exe https://golang.org | .\ex5_3.exe

```

![image-20240528134612457](http://cdn.ayusummer233.top/DailyNotes/image-20240528134612457.png)

---

### EX5.4.处理其他类型节点

**练习 5.4：** 扩展visit函数，使其能够处理其他类型的结点，如images、scripts和style sheets。

- **样式表（style sheets）** 是用来控制网页元素显示样式的文件或代码片段。最常见的样式表类型是 **CSS（Cascading Style Sheets，层叠样式表）**。样式表定义了如何展示 HTML 元素，包括颜色、字体、布局等。

  在 HTML 文件中，可以通过 `<link>` 标签引用这个样式表：

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Page</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <h1>This is a heading</h1>
    <p>This is a paragraph.</p>
  </body>
  </html>
  
  ```

在 `EX5.1` 的基础上多加几个处理类型即可

```go
switch n.Data {
		case "a":
			...
		case "img":
			...
		case "script":
			...
		case "link":
			...
```

```go
package main

import (
	"fmt"
	"os"

	"golang.org/x/net/html"
)

func main() {
	doc, err := html.Parse(os.Stdin)
	if err != nil {
		fmt.Fprintf(os.Stderr, "findelements: %v\n", err)
		os.Exit(1)
	}
	links, images, scripts, styles := visit(nil, nil, nil, nil, doc)
	fmt.Println("Links:")
	for _, link := range links {
		fmt.Println(link)
	}
	fmt.Println("Images:")
	for _, img := range images {
		fmt.Println(img)
	}
	fmt.Println("Scripts:")
	for _, script := range scripts {
		fmt.Println(script)
	}
	fmt.Println("Styles:")
	for _, style := range styles {
		fmt.Println(style)
	}
}

// visit 递归遍历 HTML 树，收集不同类型节点的信息。
func visit(links, images, scripts, styles []string, n *html.Node) ([]string, []string, []string, []string) {
	if n == nil {
		return links, images, scripts, styles
	}
	if n.Type == html.ElementNode {
		switch n.Data {
		case "a":
			for _, a := range n.Attr {
				if a.Key == "href" {
					links = append(links, a.Val)
				}
			}
		case "img":
			for _, a := range n.Attr {
				if a.Key == "src" {
					images = append(images, a.Val)
				}
			}
		case "script":
			for _, a := range n.Attr {
				if a.Key == "src" {
					scripts = append(scripts, a.Val)
				}
			}
		case "link":
			for _, a := range n.Attr {
				if a.Key == "rel" && a.Val == "stylesheet" {
					for _, a := range n.Attr {
						if a.Key == "href" {
							styles = append(styles, a.Val)
						}
					}
				}
			}
		}
	}
	links, images, scripts, styles = visit(links, images, scripts, styles, n.FirstChild)
	links, images, scripts, styles = visit(links, images, scripts, styles, n.NextSibling)
	return links, images, scripts, styles
}

// go build
// ..\findlinks1\CH1-5-GetURL.exe https://golang.org | .\ex5_4.exe

```

![image-20240528135543268](http://cdn.ayusummer233.top/DailyNotes/image-20240528135543268.png)

---

## CH5.3.多返回值

### EX5.5.统计单词和图片的数量

**练习 5.5：** 实现countWordsAndImages

和上一节的练习差不多

```go
package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"golang.org/x/net/html"
)

func main() {
	// 示例：统计指定 URL 的单词和图片数量
	url := "https://golang.org"
	words, images, err := CountWordsAndImages(url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		return
	}
	fmt.Printf("Words: %d, Images: %d\n", words, images)
}

// CountWordsAndImages 统计给定 URL 网页中的单词和图片数量
func CountWordsAndImages(url string) (words, images int, err error) {
	resp, err := http.Get(url)
	if err != nil {
		return
	}
	doc, err := html.Parse(resp.Body)
	resp.Body.Close()
	if err != nil {
		err = fmt.Errorf("parsing HTML: %s", err)
		return
	}
	words, images = countWordsAndImages(doc)
	return
}

// countWordsAndImages 遍历 HTML 文档树，统计单词和图片数量
func countWordsAndImages(n *html.Node) (words, images int) {
	if n == nil {
		return
	}
	if n.Type == html.TextNode {
		words += len(splitWords(n.Data))
	}
	if n.Type == html.ElementNode && n.Data == "img" {
		images++
	}
	wordsChild, imagesChild := countWordsAndImages(n.FirstChild)
	wordsSibling, imagesSibling := countWordsAndImages(n.NextSibling)
	words += wordsChild + wordsSibling
	images += imagesChild + imagesSibling
	return
}

// splitWords 将文本节点内容按空格分割成单词
func splitWords(text string) []string {
	// 可以使用 strings.Fields 函数按空格分割文本
	return strings.Fields(text)
}

```

![image-20240528143156574](http://cdn.ayusummer233.top/DailyNotes/image-20240528143156574.png)

----

### EX5.6.bare return

**练习 5.6：** 修改gopl.io/ch3/surface（§3.2）中的corner函数，将返回值命名，并使用bare return

```go
func corner(i, j int) (sx, sy float64) {
	// 找到网格单元 (i,j) 的角点 (x,y)。
	x := xyrange * (float64(i)/cells - 0.5)
	y := xyrange * (float64(j)/cells - 0.5)

	// 计算表面高度 z。
	z := f(x, y)

	// 将 (x,y,z) 等轴测投影到 2D SVG 画布 (sx,sy) 上。
	sx = width/2 + (x-y)*cos30*xyscale
	sy = height/2 + (x+y)*sin30*xyscale - z*zscale
	return
}

```

---

## CH5.4.错误

## CH5.5.函数值

### EX5.7.通用HTML输出器

**练习 5.7：** 完善startElement和endElement函数，使其成为通用的HTML输出器。要求：输出注释结点，文本结点以及每个元素的属性（< a href='...'>）。使用简略格式输出没有孩子结点的元素（即用`<img/>`代替`<img></img>`）。编写测试，验证程序输出的格式正确。（详见11章）

> 单元测试就不写了, 到11章再看(

```go
package main

import (
	"fmt"
	"net/http"
	"os"

	"golang.org/x/net/html"
)

var depth int

func main() {
	for _, url := range os.Args[1:] {
		err := printHTMLStructure(url)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			continue
		}
	}
}

func printHTMLStructure(url string) error {
	resp, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("getting %s: %v", url, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("getting %s: %s", url, resp.Status)
	}

	doc, err := html.Parse(resp.Body)
	if err != nil {
		return fmt.Errorf("parsing HTML: %v", err)
	}

	forEachNode(doc, startElement, endElement)
	return nil
}

func forEachNode(n *html.Node, pre, post func(n *html.Node)) {
	if pre != nil {
		pre(n)
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		forEachNode(c, pre, post)
	}
	if post != nil {
		post(n)
	}
}

func startElement(n *html.Node) {
	if n.Type == html.ElementNode {
		fmt.Printf("%*s<%s", depth*2, "", n.Data)
		for _, attr := range n.Attr {
			fmt.Printf(" %s='%s'", attr.Key, attr.Val)
		}
		if n.FirstChild == nil {
			fmt.Printf("/>\n")
		} else {
			fmt.Printf(">\n")
			depth++
		}
	} else if n.Type == html.CommentNode {
		fmt.Printf("%*s<!-- %s -->\n", depth*2, "", n.Data)
	} else if n.Type == html.TextNode {
		fmt.Printf("%*s%s\n", depth*2, "", n.Data)
	}
}

func endElement(n *html.Node) {
	if n.Type == html.ElementNode && n.FirstChild != nil {
		depth--
		fmt.Printf("%*s</%s>\n", depth*2, "", n.Data)
	}
}

```

![image-20240528160454600](http://cdn.ayusummer233.top/DailyNotes/image-20240528160454600.png)

---

### EX5.8.查找元素

**练习 5.8：** 修改pre和post函数，使其返回布尔类型的返回值。返回false时，中止forEachNoded的遍历。使用修改后的代码编写ElementByID函数，根据用户输入的id查找第一个拥有该id元素的HTML元素，查找成功后，停止遍历。

```go
package main

import (
	"fmt"
	"net/http"
	"os"

	"golang.org/x/net/html"
)

var depth int

func main() {
	if len(os.Args) < 3 {
		fmt.Println("Usage: go run main.go <url> <id>")
		return
	}

	url := os.Args[1]
	id := os.Args[2]

	node, err := ElementByID(url, id)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		return
	}
	if node != nil {
		fmt.Printf("Found node: \n")
		forEachNode(node, startElement, endElement)
	} else {
		fmt.Printf("Node with id='%s' not found\n", id)
	}
}

func ElementByID(url, id string) (*html.Node, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("getting %s: %v", url, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("getting %s: %s", url, resp.Status)
	}

	doc, err := html.Parse(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("parsing HTML: %v", err)
	}

	var result *html.Node
	forEachNode(doc, func(n *html.Node) bool {
		if n.Type == html.ElementNode {
			for _, attr := range n.Attr {
				if attr.Key == "id" && attr.Val == id {
					result = n
					return false // Stop traversal
				}
			}
		}
		return true // Continue traversal
	}, nil)

	if result != nil {
		return result, nil
	}
	return nil, nil
}

func forEachNode(n *html.Node, pre, post func(n *html.Node) bool) bool {
	if pre != nil {
		if !pre(n) {
			return false
		}
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if !forEachNode(c, pre, post) {
			return false
		}
	}
	if post != nil {
		if !post(n) {
			return false
		}
	}
	return true
}

func startElement(n *html.Node) bool {
	if n.Type == html.ElementNode {
		fmt.Printf("%*s<%s", depth*2, "", n.Data)
		for _, attr := range n.Attr {
			fmt.Printf(" %s='%s'", attr.Key, attr.Val)
		}
		if n.FirstChild == nil {
			fmt.Printf("/>\n")
		} else {
			fmt.Printf(">\n")
			depth++
		}
	} else if n.Type == html.CommentNode {
		fmt.Printf("%*s<!-- %s -->\n", depth*2, "", n.Data)
	} else if n.Type == html.TextNode {
		fmt.Printf("%*s%s\n", depth*2, "", n.Data)
	}
	return true
}

func endElement(n *html.Node) bool {
	if n.Type == html.ElementNode && n.FirstChild != nil {
		depth--
		fmt.Printf("%*s</%s>\n", depth*2, "", n.Data)
	}
	return true
}

//  go run main.go https://golang.org footer-description

```

![image-20240528163204834](http://cdn.ayusummer233.top/DailyNotes/image-20240528163204834.png)

---

### EX5.9.expad

编写函数expand，将s中的"foo"替换为f("foo")的返回值。

```Go
func expand(s string, f func(string) string) string
```

```go
package main

import (
	"fmt"
	"strings"
)

// expand 函数将字符串 s 中的 "foo" 替换为 f("foo") 的返回值
func expand(s string, f func(string) string) string {
	return strings.ReplaceAll(s, "foo", f("foo"))
}

func main() {
	// 示例 f 函数，将 "foo" 替换为 "bar"
	f := func(s string) string {
		return "bar"
	}

	// 测试 expand 函数
	s := "foo foo foo foo foo foo foo foo foo foo foo foo"
	fmt.Println("原始字符串:", s)
	result := expand(s, f)
	fmt.Println("变更字符串:", result)
}

```

![image-20240528163929539](http://cdn.ayusummer233.top/DailyNotes/image-20240528163929539.png)

---









