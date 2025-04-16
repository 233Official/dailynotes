---
category: Python
tags:
  - Python Module
  - tldextract
excerpt: tldextract 是一个专门用于解析域名结构的Python库
---

# tldextract

```bash
poetry add tldextract -vvv
```

`tldextract` 是一个专门用于解析域名结构的Python库

这个库的优势在于它能够正确处理复杂的域名结构，特别是对于国际化域名和多段式顶级域名的支持

例如

```python
import tldextract

# 解析普通域名
extracted = tldextract.extract("www.example.com")
print(f"子域名: {extracted.subdomain}")  # 输出: 子域名: www
print(f"主域名: {extracted.domain}")     # 输出: 主域名: example
print(f"顶级域: {extracted.suffix}")     # 输出: 顶级域: com

# 解析多段式顶级域名
extracted = tldextract.extract("blog.example.co.uk")
print(f"子域名: {extracted.subdomain}")  # 输出: 子域名: blog
print(f"主域名: {extracted.domain}")     # 输出: 主域名: example
print(f"顶级域: {extracted.suffix}")     # 输出: 顶级域: co.uk
```

![image-20250416175054656](http://cdn.ayusummer233.top/DailyNotes/202504161750778.png)

