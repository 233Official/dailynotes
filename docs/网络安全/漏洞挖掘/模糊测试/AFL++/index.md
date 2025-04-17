---

---

# AFL++

> [AFL++安装与使用 | Closure (zh-closure.github.io)](https://zh-closure.github.io/2022/03/20/AFL++-安装与使用/#使用：)
>
> [AFLplusplus/AFLplusplus: The fuzzer afl++ is afl with community patches, qemu 5.1 upgrade, collision-free coverage, enhanced laf-intel & redqueen, AFLfast++ power schedules, MOpt mutators, unicorn_mode, and a lot more! (github.com)](https://github.com/AFLplusplus/AFLplusplus)

---

- [AFL++](#afl)
  - [简介](#简介)
  - [安装](#安装)
  - [使用示例-Fuzz一个PDF解析器](#使用示例-fuzz一个pdf解析器)
    - [安装与使用 xpdf](#安装与使用-xpdf)
    - [使用 AFL++ 开始 FUZZ](#使用-afl-开始-fuzz)
    - [复现崩溃](#复现崩溃)
    - [尝试 FUZZ 一下最新版本的 xpdf](#尝试-fuzz-一下最新版本的-xpdf)

---

## 简介

AFL++（American Fuzzy Lop Plus Plus）是一种高级的模糊测试工具，广泛用于安全性研究和漏洞挖掘。

AFL++模糊测试框架包括：

- 一个具有许多变异器和配置的模糊器：afl-fuzz
- 不同的源代码检测模块：LLVM模式，afl-as，GCC插件
- 不同的二进制代码检测模块：QEMU模式，Unicorn模式，QBDI模式
- 用于测试用例/语料库最小化的实用程序：afl-tmin，afl-cmin
- 辅助库：libtokencap，libdislocator，libcompcov

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

## 参数

> [Fuzzing software: common challenges and potential solutions (Part 1) | GitHub Security Lab](https://securitylab.github.com/resources/fuzzing-challenges-solutions-1/)



---

## 使用示例-Fuzz一个PDF解析器

> [AFL++初探-手把手Fuzz一个PDF解析器 - unr4v31 - 博客园 (cnblogs.com)](https://www.cnblogs.com/unr4v31/p/15237728.html)

---

### 安装与使用 xpdf

> [XpdfReader](https://www.xpdfreader.com/)
>
> [Download Xpdf and XpdfReader](https://www.xpdfreader.com/download.html)

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
>   - `count coverage`: 覆盖的基本块或路径的计数平均值，当前是 `4.16 bits/tuple`，越高表示 AFL++ 覆盖了更多的执行路径。
>
> ---
>
> ![image-20241012094843616](http://cdn.ayusummer233.top/DailyNotes/202410120948788.png)
>
> - **Stage Progress (阶段进度)**：
>
>   - **now trying**: 当前模糊测试正在使用的策略阶段
>     - **bitflip (位翻转)**
>       - **bitflip 1/1, 1/2, 1/4**: 按照一位、一对或一组4位的方式翻转输入文件中的位。例如，将一个字节的某个位（bit）由 `0` 翻转为 `1`，或反过来。
>       - **目的**：通过微小的位级别变化，尝试引发程序在处理二进制或位级别数据时的错误。
>     - **arithmetics (算术运算)**
>       - **arith 8/16/32**: 尝试对输入中的数据做算术操作（加减）。这个策略通常用于修改特定字段中的数字或变量，如 8 位、16 位或 32 位的整数值。
>       - **目的**：尝试引发目标程序在处理整数运算时的溢出或其他异常情况。
>     - **known ints (已知整数)**
>       - AFL++ 插入一些已知有用的整数值，如 `0`、`-1`、`255`、`32767` 等。这些值通常会在某些程序操作中导致特殊行为或边界条件。
>       - **目的**：通过插入常见边界值，尝试引发程序在处理极限或异常值时的漏洞。
>     - **dictionary (字典替换)**
>       - 如果 AFL++ 提供了字典文件（一个包含关键字符串或输入片段的文件），它会使用字典中的内容替换输入中的部分内容。这种策略通常用于处理文本或结构化输入（如 XML、JSON 等）。
>       - **目的**：利用已知有害或边界值的字符串，触发特定的解析或处理漏洞。
>     - **havoc (混乱变异)**
>       - **havoc** 是 AFL++ 中最为广泛使用的变异策略，它随机对输入应用一系列小幅度的变异操作，如位翻转、字节翻转、整数替换、算术运算等。
>       - **目的**：随机性极强，适用于一般的模糊测试阶段，以探索程序的整体脆弱性。
>     - **splice (拼接变异)**
>       - **splice** 阶段将两个输入文件进行拼接，形成一个新的输入样本。这种变异策略通过结合已有的样本特征，生成新的可能有用的输入。
>       - **目的**：通过拼接不同输入的部分，触发目标程序在处理复杂组合输入时的潜在漏洞。
>     - **extras/user extras (额外变异)**
>       - AFL++ 可以利用用户提供的额外数据（extras）作为输入片段插入到测试样本中。例如，用户可以提供一组关键字、标志或输入片段，AFL++ 会随机选择并插入这些片段。
>       - **目的**：通过插入额外的片段，尝试覆盖更多代码路径或触发特定的解析逻辑。
>     - **trim (修剪)**
>       - **trim** 阶段尝试通过删除输入样本中的某些不必要的部分，来简化输入文件，同时保持其有效性。这个过程旨在缩小样本大小，简化后续的变异过程。
>       - **目的**：减少输入文件的冗余部分，以便更快、更高效地进行变异。
>     - **cmp-log (比较日志)**
>       - **cmp-log** 是 AFL++ 的高级变异阶段之一，它通过分析目标程序在处理输入时的比较操作（如 `==`, `!=` 等），生成有针对性的输入，目的是绕过这些条件判断。
>       - **目的**：通过生成符合比较条件的输入，引导程序进入之前无法达到的代码路径。
>     - **rare edge (稀有路径边缘变异)**
>       - **rare edge** 是 AFL++ 针对那些稀有路径的变异阶段，即那些较少被执行或难以覆盖的路径。AFL++ 会优先对这些稀有路径的输入进行更多的变异。
>       - **目的**：增加覆盖稀有路径的概率，提升模糊测试的效果。
>
>   ---
>
>   ![image-20241012095517995](http://cdn.ayusummer233.top/DailyNotes/202410120955069.png)
>
>   - **stage execs**: 当前阶段执行的次数，显示为 `4236/38.4k(11.03%)`，表示 AFL++ 在当前阶段已经执行了 4236 次，约完成了 11.03%。
>   - **total execs**: 模糊测试从开始以来的总执行次数
>   - **exec speed**: 执行速度，当前为 `154.8/sec`，表示每秒执行 154.8 次测试用例。
>
> - **Findings in Depth (深入发现)**：
>
>   - **favored items**: 当前阶段中被标记为 "优选" 的输入数量。优选项是 AFL++ 认为最有潜力发现新路径的输入。
>
>   - **new edges on**: AFL++ 通过新输入发现的新的代码路径或基本块数量，显示为 `432(15.7%)`，表示 AFL++ 在 `15.7%` 的输入中发现了新路径。
>
>   - **total crashes**: 总的崩溃次数
>
>     可以在 ``fuzzing_xpdf/out/`目录中找到这些崩溃文件。一旦发现第一个崩溃，就可以使用`control+c`停止 fuzzer。
>
>   - **total timeouts**: 总的超时次数
>
> - **Fuzzing Strategy Yields (模糊测试策略结果)**：
>
>   - **bit flips / byte flips**: 用 AFL++ 的“位翻转”和“字节翻转”策略进行模糊测试时找到的新路径或变异的数量。例如， `bit flips : 37/5248` 表示总共尝试了 5248 次位翻转变异，并成功发现了 37 个新路径。
>   - **arithmetics**: 使用算术运算来变异输入的测试，例如 `48/44.3k`，表示 AFL++ 通过算术变异发现了 48 个有用的变异。
>   - **known ints**: 使用已知整数值进行变异的结果，例如  `2/5487`，表示 AFL++ 在 5487 次已知整数变异中发现了 2 个新的路径。
>
> - **Item Geometry (输入几何）**：
>
>   - **levels**: 当前语料库中的输入深度层次，例如 `2`，表示 AFL++ 使用了两层递归或嵌套的输入结构。
>   - **pending**: 仍在等待 AFL++ 处理的输入数量
>   - **pend fav**: 优先处理的输入数量
>   - **own finds**: AFL++ 自己发现的有效输入数量
>   - **imported**: 从外部导入的输入数量
>   - **stability**: 测试程序的稳定性，当前是 `100.00%`，表示 AFL++ 的每次执行都能保持稳定的运行状态，没有检测到崩溃或挂起的输入对程序造成了不一致的影响。
>
> - **Strategy**:
>
>   - **strategy**: 当前使用的模糊测试策略是 `explore`，表示 AFL++ 正在探索新的路径，试图通过生成变异输入来发现新的代码执行路径。
>   - **state**: AFL++ 的当前状态;  `in progress`，表示 AFL++ 正在进行模糊测试。

可以参考`cycles done` 的数字颜色，依次会出现洋葱红色，黄色，蓝色，绿色，变成绿色时就很难产生新的crash文件了。

---

### 复现崩溃

在`fuzzing_xpdf/out/`目录中找到崩溃对应的文件。文件名类似于`id:000000,sig:11,src:001504+000002,time:924544,op:splice,rep:16`

![image-20241012103347102](http://cdn.ayusummer233.top/DailyNotes/202410121033167.png)

将此文件作为输入传递给 pdftotext 二进制文件（如果提示无法打开文件，将文件名称改为xxx.pdf再尝试）

```bash
fuzzing_xpdf/install/bin/pdftotext 'fuzzing_xpdf/out/default/crashes/<your_filename>' fuzzing_xpdf/output
```

它会导致分段错误并导致程序崩溃：

![image-20241012103906021](http://cdn.ayusummer233.top/DailyNotes/202410121039090.png)

![image-20241012104049281](http://cdn.ayusummer233.top/DailyNotes/202410121040345.png)

----

















