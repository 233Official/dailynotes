# AFL++

> [AFL++安装与使用 | Closure (zh-closure.github.io)](https://zh-closure.github.io/2022/03/20/AFL++-安装与使用/#使用：)
>
> [AFLplusplus/AFLplusplus: The fuzzer afl++ is afl with community patches, qemu 5.1 upgrade, collision-free coverage, enhanced laf-intel & redqueen, AFLfast++ power schedules, MOpt mutators, unicorn_mode, and a lot more! (github.com)](https://github.com/AFLplusplus/AFLplusplus)

---

## 简介

AFL++（American Fuzzy Lop Plus Plus）是一种高级的模糊测试工具，广泛用于安全性研究和漏洞挖掘。

AFL++模糊测试框架包括：

1、一个具有许多变异器和配置的模糊器：afl-fuzz

2、不同的源代码检测模块：LLVM模式，afl-as，GCC插件

3、不同的二进制代码检测模块：QEMU模式，Unicorn模式，QBDI模式

4、用于测试用例/语料库最小化的实用程序：afl-tmin，afl-cmin

5、辅助库：libtokencap，libdislocator，libcompcov

----

## 安装

:::tabs

@tab:active 通过Docker安装

> [AFLplusplus/AFLplusplus: The fuzzer afl++ is afl with community patches, qemu 5.1 upgrade, collision-free coverage, enhanced laf-intel & redqueen, AFLfast++ power schedules, MOpt mutators, unicorn_mode, and a lot more! (github.com)](https://github.com/AFLplusplus/AFLplusplus?tab=readme-ov-file#building-and-installing-afl)

```bash
docker pull aflplusplus/aflplusplus:latest
docker run -ti -v /location/of/your/target:/src aflplusplus/aflplusplus
```

> - `-t`：分配一个伪终端（TTY），使你能够与容器进行交互。
> - `-i`：保持标准输入（STDIN）打开，这样你可以在容器中进行交互操作。
>
> - **挂载卷**：`-v /location/of/your/target:/src`
>
>   - 这个选项用于将主机上的一个目录挂载到容器内部。
>
>   - `/location/of/your/target` 是你主机上要挂载的目录的路径。
>
>   - `/src` 是容器内的挂载点。你可以在容器中访问该路径来读取或写入主机上的文件。
>
> ---
>
> 直接 docker run 启动容器, 后续直接拿 VSCode  Remote Container 进容器操作也行
>
> ![image-20241011154019196](http://cdn.ayusummer233.top/DailyNotes/202410111540370.png)
>
> ![image-20241011154428837](http://cdn.ayusummer233.top/DailyNotes/202410111544962.png)

---

@tab 手动安装

> [AFLplusplus/docs/INSTALL.md 稳定版 · AFLplusplus/AFLplusplus --- AFLplusplus/docs/INSTALL.md at stable · AFLplusplus/AFLplusplus (github.com)](https://github.com/AFLplusplus/AFLplusplus/blob/stable/docs/INSTALL.md)

如果你要手动安装, 可以参考 [AFL++安装与使用 | Closure (zh-closure.github.io)](https://zh-closure.github.io/2022/03/20/AFL++-安装与使用/#使用：)

要参考这个文档的话建议新开一个 ubuntu20.04 版本的机子安装, 因为其中使用的一些软件包的版本比较旧, 使用新版本系统安装可能会存在官方源已经移除了这些版本的包的问题, 所以最方便的做法还是建议使用 Docker 进行安装(不过官方建议是手动装, 有能力的以及有自定义需求的话手动装更合适一些)

或者直接去看官方文档的手动安装方案: [AFLplusplus/docs/INSTALL.md 稳定版 · AFLplusplus/AFLplusplus --- AFLplusplus/docs/INSTALL.md at stable · AFLplusplus/AFLplusplus (github.com)](https://github.com/AFLplusplus/AFLplusplus/blob/stable/docs/INSTALL.md)

:::

---

## 使用示例-Fuzz一个PDF解析器

> [AFL++初探-手把手Fuzz一个PDF解析器 - unr4v31 - 博客园 (cnblogs.com)](https://www.cnblogs.com/unr4v31/p/15237728.html)

---

### 安装与使用 xpdf

首先为Fuzz目标创建一个新目录, 例如

```bash
cd $HOME
mkdir fuzzing_xpdf && cd fuzzing_xpdf/
```

> ![image-20241011162042139](http://cdn.ayusummer233.top/DailyNotes/202410111620201.png)

安装 make 和 gcc:

```bash
sudo apt update
sudo apt install build-essential
```

> ![image-20241011163810166](http://cdn.ayusummer233.top/DailyNotes/202410111638209.png)

下载 Xpdf 3.02:

```bash
wget https://dl.xpdfreader.com/old/xpdf-3.02.tar.gz
tar -xvzf xpdf-3.02.tar.gz
```

> ![image-20241011163850415](http://cdn.ayusummer233.top/DailyNotes/202410111638520.png)
>
> ![image-20241011163914772](http://cdn.ayusummer233.top/DailyNotes/202410111639900.png)

构建 Xpdf:

```bash
cd xpdf-3.02
sudo apt update && sudo apt install -y build-essential gcc
# 对应改一下目录
./configure --prefix="$HOME/fuzzing_xpdf/install/"
#./configure --prefix="/233/fuzz_test/fuzzing_xpdf/install/"
make
make install
```

> ![image-20241011164024358](http://cdn.ayusummer233.top/DailyNotes/202410111640465.png)
>
> ![image-20241011164042239](http://cdn.ayusummer233.top/DailyNotes/202410111640384.png)
>
> ![image-20241011164244032](http://cdn.ayusummer233.top/DailyNotes/202410111642208.png)
>
> ![image-20241011164304454](http://cdn.ayusummer233.top/DailyNotes/202410111643607.png)
>
> ![image-20241011165818240](http://cdn.ayusummer233.top/DailyNotes/202410111658297.png)

现在可以开始测试Xpdf。首先，需要下载一些 PDF 示例：

```bash
cd $HOME/fuzzing_xpdf
# cd /233/fuzz_test/fuzzing_xpdf
mkdir pdf_examples && cd pdf_examples
wget https://github.com/mozilla/pdf.js-sample-files/raw/master/helloworld.pdf
wget http://www.africau.edu/images/default/sample.pdf
wget https://www.melbpc.org.au/wp-content/uploads/2017/10/small-example-pdf-file.pdf
```

> 其中可能会有文档已经不存在了:
>
> ![image-20241011164623636](http://cdn.ayusummer233.top/DailyNotes/202410111646741.png)

可以使用以下命令测试 pdfinfo 二进制文件：

```bash
$HOME/fuzzing_xpdf/install/bin/pdfinfo -box -meta $HOME/fuzzing_xpdf/pdf_examples/helloworld.pdf

#/233/fuzz_test/fuzzing_xpdf/install/bin/pdfinfo -box -meta /233/fuzz_test/fuzzing_xpdf/pdf_examples/helloworld.pdf
```

- `-box`：显示 PDF 文件中每一页的边框信息，包括 MediaBox、CropBox、BleedBox、TrimBox 和 ArtBox。
- `-meta`：显示 PDF 文件的元数据信息。

> ![image-20241011170459369](http://cdn.ayusummer233.top/DailyNotes/202410111704430.png)

---

### 使用 AFL++ 开始 FUZZ

插桩是一种代码分析技术，AFL 使用它来跟踪程序的执行路径。

在 AFL 的插桩过程中，编译时会在每个**基本块**的开头插入特殊的代码（通常是函数调用）。这些插入的代码让 AFL 能够监控程序的执行状态，收集关于程序在处理不同输入时的行为数据。

> **基本块**：在计算机程序中，基本块（Basic Block）是指一组连续的指令，这些指令只有一个入口和一个出口。常见的基本块包括函数、循环以及条件判断的分支部分等。

---

AFL的检测机制

- 当源代码可用时，AFL 能够通过插入检测代码（通过 AFL 编译器进行插桩），在程序执行过程中收集有关其执行路径的信息。
- 这些检测数据让 AFL 能够了解程序对不同输入的响应，从而指导模糊测试，找出导致程序崩溃或不正常行为的输入。

---

AFL 编译器的作用

- AFL 通过其定制的编译器来实现插桩，具体来说，是通过使用 AFL 提供的编译器（如 `afl-gcc` 或 `afl-clang-fast`）来编译目标应用程序。
- 这些 AFL 编译器不仅执行常规的编译任务，还会在编译过程中为每个基本块插入 AFL 所需的检测代码。只有通过 AFL 编译器编译的程序，才能够被 AFL 有效地模糊测试，因为它们携带了 AFL 所需的检测信息。

---

首先，清理所有以前编译的目标文件和可执行文件：

```bash
rm -r $HOME/fuzzing_xpdf/install
# rm -r /233/fuzz_test/fuzzing_xpdf/install
cd $HOME/fuzzing_xpdf/xpdf-3.02/
# cd /233/fuzz_test/fuzzing_xpdf/xpdf-3.02/
make clean
```

---

现在将使用afl-clang-fast编译器构建 xpdf ：

```bash
export LLVM_CONFIG="llvm-config-11"
# 根据你的 AFLplusplus 所在位置调整如下命令
CC=$HOME/AFLplusplus/afl-clang-fast CXX=$HOME/AFLplusplus/afl-clang-fast++ ./configure --prefix="$HOME/fuzzing_xpdf/install/"
# CC=/AFLplusplus/afl-clang-fast CXX=/AFLplusplus/afl-clang-fast++ ./configure --prefix="/233/fuzz_test/fuzzing_xpdf/install/"
make
make install
```

> ![image-20241011172917713](http://cdn.ayusummer233.top/DailyNotes/202410111729769.png)

现在可以使用以下命令运行Fuzz：

```bash
afl-fuzz -i $HOME/fuzzing_xpdf/pdf_examples/ -o $HOME/fuzzing_xpdf/out/ -s 123 -- $HOME/fuzzing_xpdf/install/bin/pdftotext @@ $HOME/fuzzing_xpdf/output
# afl-fuzz -i /233/fuzz_test/fuzzing_xpdf/pdf_examples/ -o /233/fuzz_test/fuzzing_xpdf/out/ -s 123 -- /233/fuzz_test/fuzzing_xpdf/install/bin/pdftotext @@ /233/fuzz_test/fuzzing_xpdf/output
## cd /233/fuzz_test/fuzzing_xpdf
## afl-fuzz -i pdf_examples/ -o out/ -s 123 -- install/bin/pdftotext @@ output
```

- `afl-fuzz` 是 AFL++ 的核心命令，用于对目标程序进行模糊测试（fuzzing）。它通过生成不同的输入数据并监控程序的行为来发现漏洞或异常行为。

- `-i` 指定 AFL++ 的**输入目录**，即模糊测试用例的初始输入文件所在的目录。

  AFL 会从这个目录中读取输入文件，并基于这些输入生成新的测试用例。

- `-o` 指定 AFL++ 的**输出目录**，AFL 会将测试结果（如测试用例、日志、崩溃数据等）写入这个目录。

  所有模糊测试的结果和发现都会保存在这里。

- `-s` 用于指定 AFL++ 的**随机种子**。这个参数让模糊测试的输入生成过程基于相同的种子值，生成一致的输入数据，方便结果复现。

  `123` 是这里指定的随机种子。如果你希望 AFL 每次生成不同的输入数据，可以不指定这个选项。

- `--` 表示 AFL++ 的选项部分已经结束，后面跟的是目标程序及其参数。

  `--` 之后的内容是目标程序以及其运行时需要的参数

- **`/233/fuzz_test/fuzzing_xpdf/install/bin/pdftotext`** 是目标程序的路径

  `pdftotext` 是一个将 PDF 文件转换为文本文件的工具。

- `@@` 是 AFL++ 的占位符，表示 AFL 会将生成的测试用例（如变异后的输入文件）替换到这里。在每次运行目标程序时，AFL 会将测试用的 PDF 文件作为参数传递给 `pdftotext`。

  `@@` 将被 AFL 动态替换为每次生成的测试用例文件路径。

-  **`/233/fuzz_test/fuzzing_xpdf/output`** 是目标程序 `pdftotext` 的另一个参数

  它指定了 `pdftotext` 的输出文件夹或输出文件路径，即转换后的文本文件将会保存到 `/233/fuzz_test/fuzzing_xpdf/output` 目录下。

这条命令的作用是运行 AFL++ 对 `pdftotext` 程序进行模糊测试，使用 `/233/fuzz_test/fuzzing_xpdf/pdf_examples/` 目录中的 PDF 文件作为初始输入，将生成的测试用例保存在 `/233/fuzz_test/fuzzing_xpdf/out/` 目录下。`pdftotext` 的输入为 AFL 生成的测试用例文件，输出转换后的文本文件保存到 `/233/fuzz_test/fuzzing_xpdf/output`。

> ![image-20241011174536331](http://cdn.ayusummer233.top/DailyNotes/202410111745391.png)
>
> - `Process Timing(进程计时)`
>   - `run time`: 模糊测试运行的时间
>   - `last new find`: 最近发现一个新的输入时的时间
>   - `last saved crash`: 最近一次保存崩溃输入的时间
>   - `last saved hang`: 最近一次保存挂起输入的时间
>
> - `Overall Results(整体结果)`
>
>   - `cycles done`: 已完成的模糊测试周期数
>
>     模糊测试周期（**fuzzing cycle**）指的是 AFL++ 等模糊测试工具在模糊测试过程中对所有输入样本为**初始语料库**（或称**种子**, 也即 `pdf_examples` 目录中的文件）进行完整处理的一轮测试。在一个周期中，工具会对语料库中的每个输入样本执行以下操作：
>
>     - **变异操作**：AFL++ 会对每个输入样本进行多种不同形式的变异（如位翻转、字节翻转、算术操作等），以生成新的测试用例。这些变异的输入旨在覆盖更多的程序执行路径，暴露潜在的漏洞或问题。
>
>     - **执行和监控**：AFL++ 会将变异后的输入发送到目标程序进行执行，监控其运行状态。如果目标程序崩溃、挂起或有新的代码路径被覆盖，AFL++ 会记录这些信息。
>
>     - **结果处理**：
>
>       - **保存崩溃**：如果 AFL++ 发现程序在处理某个变异输入时发生了崩溃，它会将这个输入保存为崩溃样本。
>
>       - **保存挂起**：如果程序因某个输入挂起或超时，AFL++ 也会记录这个输入。
>
>       - **更新语料库**：如果变异后的输入能够触发新的代码路径或执行新的基本块，AFL++ 会将其加入语料库，以便在后续周期中进一步测试。
>
>         结束一个周期后，AFL++ 会检查新的语料库状态。如果在本周期中 AFL++ 发现了新的有效输入（如发现了新的代码路径或程序崩溃），这些输入会被添加到语料库，进入下一个周期的处理
>
>   - `corpus count`: 当前语料库中有效输入的数量
>
>   - `saved crashes`: 保存的崩溃数量
>
>   - `saved hangs`: 保存的挂起数量
>
> ---
>
> ![image-20241011175838471](http://cdn.ayusummer233.top/DailyNotes/202410111758617.png)
>
> - `Cycle Progress (周期进度)`：
>
>   - `now processing`: 当前处理的输入在整个语料库中的进度
>   - `runs timed out`: 超时次数，当前是 `0`，表示没有发生超时的测试用例。
>
> - `Map Coverage (覆盖率)`：
>
>   - `map density`: 覆盖率的密度，当前是 `6.35% / 10.09%`。这表示程序的代码路径覆盖率为 6.35%，但 AFL++ 估计最大可能的覆盖率为 10.09%。
>
>     当前是 `6.35% / 10.09%`。这表示程序的代码路径覆盖率为 6.35%，但 AFL++ 估计最大可能的覆盖率为 10.09%。
>
>   - **count coverage**: 覆盖的基本块或路径的计数平均值，当前是 `2.69 bits/tuple`，越高表示 AFL++ 覆盖了更多的执行路径。





---













