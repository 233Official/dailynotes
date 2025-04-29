---
category: Python
tags:
  - Python Module
  - igraph
excerpt: Python igraph 是一个高效的图论（网络）分析库，专门用于处理和分析大规模复杂网络
---

# python-igraph

`igraph` 是一个高效的图论（网络）分析库，专门用于处理和分析大规模复杂网络

`cairocffi` 是用于绘制图形的依赖库, `pycairo` 是Cairo的官方Python绑定, 前者在 win 上安装的话需要额外到官网装一下本体, 后者则无需考量此问题，对于 macOS 而言安装 pycairo 需要注意用 brew 额外安装 pkg-config 域 cairo

```bash
poetry add python-igraph pycairo -vvv
# for mac 需要额外步骤
## 安装 pkg-config（关键工具，用于定位库文件）
brew install pkg-config
## 确认 cairo 已安装
brew install cairo
```

例如

```python
import igraph as ig
from pathlib import Path


CURRENT_DIR = Path(__file__).parent.resolve()

# 创建图
g = ig.Graph()

# 添加节点
g.add_vertices(3)

# 添加边
g.add_edges([(0, 1), (1, 2)])

# 设置节点属性
g.vs["name"] = ["example.com", "malicious.net", "suspicious.org"]
g.vs["type"] = ["grey", "black", "grey"]

# 设置边权重
g.es["weight"] = [0.8, 0.5]

# 设置节点颜色(根据类型)
color_dict = {"grey": "yellow", "black": "red"}
g.vs["color"] = [color_dict[type] for type in g.vs["type"]]

# 设置边的宽度(根据权重)
g.es["width"] = [weight * 5 for weight in g.es["weight"]]

# 输出图的基本信息
print(f"图包含 {len(g.vs)} 个节点和 {len(g.es)} 条边")

# 使用igraph自带绘图功能
visual_style = {
 "vertex_size": 45,
 "vertex_label": g.vs["name"],
 "vertex_label_dist": 1.5,
 "vertex_label_size": 12,
 "vertex_color": g.vs["color"],
 "edge_width": g.es["width"],
 "edge_label": [f"{w:.1f}" for w in g.es["weight"]],
 "layout": g.layout("kk"),  # Kamada-Kawai布局算法
 "bbox": (600, 600),
 "margin": 50,
}

# 绘制并保存图像
OUTFILEPATH = CURRENT_DIR / "domain_graph_example.png"
ig.plot(g, OUTFILEPATH, **visual_style)
print("图形已保存为: domain_graph_example.png")
```

![image-20250416174044384](http://cdn.ayusummer233.top/DailyNotes/202504161740642.png)
