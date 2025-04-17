---
category: 
  - Python
  - Python库
tags:
  - graphviz
excerpt: Graphviz 是一个开源的图形可视化软件，广泛用于绘制流程图、网络图、决策树等。它提供了一种简单的文本语言（DOT）来描述图形结构，并能够自动布局和渲染图形。
---

# graphviz

## 安装

### 1. 安装系统级 Graphviz 软件包

- Windows 

  - 通过官网下载安装

    1. 访问 [Graphviz 官方下载页面](vscode-file://vscode-app/c:/Users/SummerPC/AppData/Local/Programs/Microsoft VS Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)
    2. 下载适合你 Windows 版本的安装程序
    3. 运行安装程序，按照向导完成安装
    4. 将 Graphviz 的 bin 目录添加到系统 PATH 环境变量

  - 通过 Chocolatey 包管理器安装

    ```powershell
    choco install graphviz
    ```

  - 通过 Windows Subsystem for Linux (WSL) 安装

    ```bash
    sudo apt-get install graphviz # 对于基于 Debian/Ubuntu 的 WSL
    ```

---

### 2. 安装 Python graphviz 包装器

```powershell
pip install graphviz
```

---

### 3.验证安装

创建一个简单的测试脚本来验证安装是否成功：

```python
import graphviz
from pathlib import Path
import platform

CURRENT_DIR = Path(__file__).parent

# 根据操作系统选择合适的中文字体
system = platform.system()
if system == 'Windows':
    chinese_font = 'SimHei'  # Windows 的黑体
elif system == 'Darwin':
    chinese_font = 'Heiti SC'  # macOS 的黑体
else:
    chinese_font = 'WenQuanYi Zen Hei'  # Linux 的文泉驿正黑

# 创建一个简单的图形
dot = graphviz.Digraph(comment='测试图形', format='svg')

# 设置全局字体
dot.attr(fontname=chinese_font)
dot.attr('node', fontname=chinese_font, shape='box')
dot.attr('edge', fontname=chinese_font)

# 添加节点和边
dot.node('A', '节点A')
dot.node('B', '节点B')
dot.edge('A', 'B', label='连接')

# 渲染并查看图形
dot.render(CURRENT_DIR / 'test_graph', cleanup=True)

print(f"图形已保存到: {CURRENT_DIR / 'test_graph.png'}")
```

![image-20250418073832701](http://cdn.ayusummer233.top/DailyNotes/202504180755780.png)