---
date: 2025-10-09
category:
  - 网络安全
  - 漏洞挖掘
tags:
  - 模糊测试
  - AFL++
---


# LibXML2 Fuzzing

> [GNOME / libxml2 · GitLab](https://gitlab.gnome.org/GNOME/libxml2)
>
> [GNOME/libxml2 at v2.13.4 (github.com)](https://github.com/GNOME/libxml2/tree/v2.13.4)
>
> [发布 · GNOME / libxml2 · GitLab](https://gitlab.gnome.org/GNOME/libxml2/-/releases)

---

## Version2.9.4

> [Fuzzing101/练习 5 主要内容·antonio-morales/Fuzzing101 --- Fuzzing101/Exercise 5 at main · antonio-morales/Fuzzing101 (github.com)](https://github.com/antonio-morales/Fuzzing101/tree/main/Exercise 5)

当我们想要模糊复杂的基于文本的文件格式（例如 XML）时，为模糊器提供包含基本语法标记列表的字典非常有用。

就 AFL 而言，这样的字典只是一个由 AFL 用来对当前内存中的文件应用更改的单词或值集合。具体来说，AFL 使用字典中提供的值执行以下更改：

- `Override(覆盖)`: 用 n 个字节替换特定位置，其中 n 是字典条目的长度
- `Insert(插入)`: 在当前文件位置插入字典条目，强制所有字符向下移动 n 个位置，并增加文件大小。

---

### Paralellization 并行化

如果你有一个多核系统，并行化你的模糊测试工作以充分利用您的 CPU 资源是一个不错的选择

---

#### Independent instances 独立实例

这是最简单的并行化策略。在此模式下，我们运行完全独立的 afl-fuzz 实例。

重要的是要记住，AFL 使用的是非确定性测试算法。因此运行多个 AFL 实例可以提高成功的几率

对于此，您只需要在多个终端窗口中运行多个“afl-fuzz”实例，并为每个实例设置不同的“输出文件夹”。

一个简单的方法是运行与系统核心数量相同数量的模糊测试任务。

> 注意：如果使用 -s 标志，记得要为每个实例使用不同的种子

---

#### Shared instances 共享实例

共享实例的使用是并行模糊测试的更好方法。在这种情况下，每个模糊测试实例收集其他模糊测试器找到的任何测试用例。

通常一次只有一个主实例

```bash
./afl-fuzz -i afl_in -o afl_out -M Master -- ./program @@
```

其他子实例:

```bash
./afl-fuzz -i afl_in -o afl_out -S Slave1 -- ./program @@
./afl-fuzz -i afl_in -o afl_out -S Slave2 -- ./program @@
...
./afl-fuzz -i afl_in -o afl_out -S SlaveN -- ./program @@
```

---

### 下载与构建LibXML2

```bash
cd $HOME
mkdir Fuzzing_libxml2 && cd Fuzzing_libxml2
# 下载并解压 libxml2-2.9.4.tar.gz
wget http://xmlsoft.org/download/libxml2-2.9.4.tar.gz
tar xvf libxml2-2.9.4.tar.gz && cd libxml2-2.9.4/
```

![image-20241012153435299](http://cdn.ayusummer233.top/DailyNotes/202410121534410.png)

---

```bash
# 构建并安装 libxml2
sudo apt-get install python-dev
CC=afl-clang-lto CXX=afl-clang-lto++ CFLAGS="-fsanitize=address" CXXFLAGS="-fsanitize=address" LDFLAGS="-fsanitize=address" ./configure --prefix="$HOME/Fuzzing_libxml2/libxml2-2.9.4/install" --disable-shared --without-debug --without-ftp --without-http --without-legacy --without-python LIBS='-ldl'
make -j$(nproc)
make install
```

![image-20241012154014031](http://cdn.ayusummer233.top/DailyNotes/202410121540089.png)

![image-20241012154054568](http://cdn.ayusummer233.top/DailyNotes/202410121540611.png)

> 这里 python-dev 不存在, 看了下本机 python 版本是 python3.10.12 就根据提示装了 `python-dev-is-python3`

![image-20241012153728717](http://cdn.ayusummer233.top/DailyNotes/202410121537774.png)

![image-20241012154205422](http://cdn.ayusummer233.top/DailyNotes/202410121542420.png)

---

![image-20241012154620513](http://cdn.ayusummer233.top/DailyNotes/202410121546557.png)

---

```bash
# 试一下编译完的程序能不能用
./xmllint --memory ./test/wml.xml
```

![image-20241012171951357](http://cdn.ayusummer233.top/DailyNotes/202410121719439.png)

---

### 创建种子语料库

首先，我们需要获取一些 XML 样本。我们将使用此存储库中提供的**SampleInput.xml** ：

```bash
mkdir afl_in && cd afl_in
wget https://raw.githubusercontent.com/antonio-morales/Fuzzing101/main/Exercise%205/SampleInput.xml
cd ..
```

![image-20241012172414514](http://cdn.ayusummer233.top/DailyNotes/202410121724574.png)

---

### 自定义词典

现在需要创建一个 XML 字典。或者也可以使用 AFL++ 提供的 XML 字典：

```bash
mkdir dictionaries && cd dictionaries
wget https://raw.githubusercontent.com/AFLplusplus/AFLplusplus/stable/dictionaries/xml.dict
cd ..
```

![image-20241012172506446](http://cdn.ayusummer233.top/DailyNotes/202410121725500.png)

---

### Fuzzing time

为了捕获该错误，必须启用`--valid`参数。我还使用**-x 标志**设置字典路径，并使用**-D 标志**启用 `deterministic mutations`（仅适用于 `master fuzzer`）：

例如可以使用以下命令运行模糊器:

```bash
afl-fuzz -m none -i ./afl_in -o afl_out -s 123 -x ./dictionaries/xml.dict -D -M master -- ./xmllint --memory --noenc --nocdata --dtdattr --loaddtd --valid --xinclude @@
```

![image-20241012173137443](http://cdn.ayusummer233.top/DailyNotes/202410121731499.png)

---

使用以下命令运行另一个从属实例

```bash
afl-fuzz -m none -i ./afl_in -o afl_out -s 234 -S slave1 -- ./xmllint --memory --noenc --nocdata --dtdattr --loaddtd --valid --xinclude @@
```

![image-20241012173402467](http://cdn.ayusummer233.top/DailyNotes/202410121734521.png)

---











