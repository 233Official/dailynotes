---

---

# CodeQL

> [CodeQL documentation (github.com)](https://codeql.github.com/docs/)
>
> [ASTTeam/CodeQL: 《深入理解CodeQL》Finding vulnerabilities with CodeQL. (github.com)](https://github.com/ASTTeam/CodeQL)

CodeQL 是一套 Github 在2019 开源且免费的静态扫描代码工具，让你能在产品release 前及早发现潜藏的漏洞并提供相对应改善的方法。

---

- [CodeQL](#codeql)
  - [使用 CodeQL 识别代码库中的安全漏洞](#使用-codeql-识别代码库中的安全漏洞)
    - [为 CodeQL 准备数据库](#为-codeql-准备数据库)
      - [设置 CLI](#设置-cli)
      - [验证 CLI 设置](#验证-cli-设置)
      - [创建数据库](#创建数据库)
      - [Extractors（提取程序）](#extractors提取程序)
      - [CodeQL 数据库中的数据](#codeql-数据库中的数据)
      - [CodeQL 潜在的不足](#codeql-潜在的不足)
      - [VSCode Extension](#vscode-extension)
    - [在数据库中运行 CodeQL](#在数据库中运行-codeql)
      - [简单的 CodeQL 查询](#简单的-codeql-查询)
      - [查询元数据](#查询元数据)
      - [QL 语法](#ql-语法)
      - [Path queries 路径查询](#path-queries-路径查询)
  - [CodeQL CTF : Go and don't return](#codeql-ctf--go-and-dont-return)
    - [漏洞介绍](#漏洞介绍)
    - [需要解决的问题](#需要解决的问题)
    - [环境准备](#环境准备)
    - [Step1-Let's catch the bug](#step1-lets-catch-the-bug)
      - [Step 1.1: Finding references to `ErrNone`](#step-11-finding-references-to-errnone)
      - [Step 1.2: Finding equality tests against `ErrNone`](#step-12-finding-equality-tests-against-errnone)
      - [Step 1.3: Finding if-blocks making such a test](#step-13-finding-if-blocks-making-such-a-test)
      - [Step 1.4: Finding return statements](#step-14-finding-return-statements)
      - [Step 1.5: Finding if-blocks without return statements](#step-15-finding-if-blocks-without-return-statements)
      - [Step 1.6: Putting it all together](#step-16-putting-it-all-together)
    - [Step2:Improving the precision - 提高精度](#step2improving-the-precision---提高精度)
      - [Step 2.1: Find conditionals that are fed from calls to `isReqAuthenticated`](#step-21-find-conditionals-that-are-fed-from-calls-to-isreqauthenticated)
  - [学习材料](#学习材料)


---

## 使用 CodeQL 识别代码库中的安全漏洞

> [使用 CodeQL 识别代码库中的安全漏洞 / Microsoft Learn / Github 高级安全](https://learn.microsoft.com/zh-cn/training/modules/codebase-representation-codeql/)
>
> [[CodeQL] 1. 初探CodeQL 静态分析 神器-哔哩哔哩]( https://b23.tv/NR5n8mF)

假设你是一名拥有 GitHub 存储库管理员权限的开发人员。 你想自动执行安全检查。 以下步骤将帮助你分析发布中是否有漏洞。

如果当前组织已购买 GitHub Advanced Security。 借助 GitHub Advanced Security 许可证，你可以使用 CodeQL 完成这些任务。

CodeQL 工具可以分析 GitHub 存储库中的代码并识别安全漏洞。 它可用于组织拥有的公共存储库和专用存储库。 CodeQL 可以分析多种语言，包括 C/C++、Java 和 Python。

---

### 为 CodeQL 准备数据库

CodeQL 将代码视为数据。 通过使用从代码库中提取的可查询数据创建数据库。 然后，可以在此数据库上运行 CodeQL 查询以识别安全漏洞、bug 和其他错误。 可以编写自己的查询或运行由 GitHub 研究人员和社区参与者编写的标准 CodeQL 查询。

- 在分析代码之前需要创建一个 CodeQL 数据库，其中包含对代码运行查询所需的所有数据。
- CodeQL 分析依赖于从代码中提取关系数据并使用该数据来生成 CodeQL 数据库。 这些数据库包含有关代码库的所有重要信息。

可以使用 CodeQL CLI 独立产品来分析代码并生成代码库的数据库表示形式。 数据库准备就绪后，就可以查询数据库，或运行一组查询以生成一组 `静态分析结果交换格式 (SARIF) `的结果。

-----

在生成 CodeQL 数据库之前，需要安装和设置 CodeQL CLI。 然后，需要查看要分析的代码库版本。

对于已编译语言，目录应已准备好生成，并且所有依赖项均已安装。 CodeQL 首先提取代码库中每个源文件的单个关系表示形式以创建数据库。 你将使用此数据库分析代码。

对于解释型语言，提取程序直接在源代码上运行。 此功能可提供代码库的准确表示形式并解决任何依赖项问题。

通过监视已编译语言的正常生成过程，可从代码库中提取源文件。 每次调用编译器来处理源文件时，CodeQL 都会创建源文件的副本。 它将收集每个源文件的源代码的所有相关信息。

---

#### 设置 CLI

建议通过下载捆绑包来安装 CodeQL CLI 和查询。 与分别下载 CLI 和查询相比，此方法有助于确保兼容性并提高性能。

CodeQL CLI 下载包是一个 .zip 存档，其中包含工具、脚本和各种 CodeQL 特定文件。 捆绑包中包括 CodeQL CLI、CodeQL GitHub 存储库中查询和库的兼容版本，以及所含查询的预编译版本。

1. 转到 [CodeQL 公共存储库的“发布”页](https://github.com/github/codeql-action/releases)。

   ![image-20250114145426075](http://cdn.ayusummer233.top/DailyNotes/202501141454349.png)

2. 下载“资产”下特定于平台的捆绑包, 或者下载 `codeql-bundle.tar.zst` ，其中包含适用于所有受支持平台的 CLI。

   ![image-20250114145620322](http://cdn.ayusummer233.top/DailyNotes/202501141456396.png)

   > tar.gz 和 tar.zst 是两种常见的压缩归档格式，主要区别在于它们使用的压缩算法不同
   >
   > - tar.gz 使用了 gzip（GNU zip）算法进行压缩。
   > - tar.zst 使用了 zstd（Zstandard）算法进行压缩。
   >
   > |     特性     |         gzip (`.gz`)         |              zstd (`.zst`)               |
   > | :----------: | :--------------------------: | :--------------------------------------: |
   > |  **压缩率**  |         中等（较小）         |         高压缩率，通常优于 gzip          |
   > | **压缩速度** |              快              |       非常快（默认级别下性能优秀）       |
   > | **解压速度** |              快              |         极快，通常比 gzip 快得多         |
   > | **压缩级别** |      1 到 9（默认为 6）      |           1 到 19（默认为 3）            |
   > | **适用场景** | 传统场景，广泛兼容，使用率高 | 新一代算法，高压缩率和速度，适合现代应用 |
   >
   > 解压 `.tar.gz`:
   >
   > ```bash
   > tar -czf file.tar.gz file/
   > tar -xzf file.tar.gz
   > ```
   >
   > 解压 `.tar.zst`
   >
   > ```bash
   > tar --zstd -cf file.tar.zst file/
   > tar --zstd -xf file.tar.zst
   > ```
   >
   > 下载完后需要校验一下对应的 sha256 hash, 一致即可
   >
   > ```bash
   > shasum -a 256 codeql-bundle-osx64.tar.zst
   > ```
   >
   > ![image-20250114150404635](http://cdn.ayusummer233.top/DailyNotes/202501141504743.png)
   >
   > ---
   >
   > 报错解压 `.tar.zst` 时遇到 ` unable to run program "zstd -d -qq"` 的话需要装一下 zstd
   >
   > 对于 macOS：
   >
   > ```bash
   > brew install zstd
   > ```
   >
   > ![image-20250114151451175](http://cdn.ayusummer233.top/DailyNotes/202501141514312.png)
   >
   > ![image-20250114151533975](http://cdn.ayusummer233.top/DailyNotes/202501141515116.png)
   >
   > ---
   >
   > 

在 `Releases` 页上，还可以查看版本的更改日志，以及 CodeQL 捆绑包先前版本的下载。 如有必要，可以下载 `codeql-bundle.tar.gz`，其中包含所有受支持平台的 CLI。

---

解压完成后可以在 `codeql` 目录下找到 `codeql` 可执行程序

![image-20250114151834879](http://cdn.ayusummer233.top/DailyNotes/202501141518934.png)

可以将目录添加到 PATH，这样在其他地方也可以直接使用 `codeql` 命令行程序

![image-20250114152228375](http://cdn.ayusummer233.top/DailyNotes/202501141522433.png)

---

#### 验证 CLI 设置

建议先将 codeql 程序所在目录添加到 PATH，要么就直接用 codeql 程序的绝对路径来进行调用

可以运行 CodeQL CLI 子命令来验证是否正确设置了 CLI 并且可以分析数据库：

- 运行 `codeql resolve qlpacks` 以显示 CLI 可以找到哪些 CodeQL 包

  此命令显示 CodeQL CLI 捆绑包中包含的 CodeQL 包的名称

  如果 CodeQL CLI 找不到所需语言的 CodeQL 包，请检查是否已下载 CodeQL 捆绑包，而不是 CodeQL CLI 的独立副本。

  ![image-20250114152553389](http://cdn.ayusummer233.top/DailyNotes/202501141525453.png)

  - 运行 `codeql resolve languages` 以显示 CodeQL CLI 包``默认支持哪些语言。


  ![image-20250114152611154](http://cdn.ayusummer233.top/DailyNotes/202501141526202.png)

  > CodeQL 并没有单独的 C 解析器，而是将 C/C++ 统一到 “cpp” 下，所以输出里只显示 cpp 而没有 c。
  >
  > TODO: CSV


---

#### 创建数据库

> [[CodeQL] 1. 初探CodeQL 静态分析 神器-哔哩哔哩]( https://b23.tv/NR5n8mF)

当我们有了一个需要分析的目标项目并且了解其编译执行方法后就可以为其创建 CodeQL 数据库以便后续查询

例如如下[示例 c 程序](https://github.com/cradiator/codeql-example/blob/main/video_1/size_of_ptr.c)

```
-----------------
 |- size_of_ptr.c
 -- Makefile
```

```c
// size_of_ptr.c
#include <stdlib.h>
struct S {
    int a;
    int b;
    int c;
    int d;
};

void init_s(struct S* s) {}

struct S* bad_new_S() {
    struct S* result;
    result = malloc(sizeof(result));
    init_s(result);
    return result;
}

struct S* good_new_S() {
    struct S* result;
    result = malloc(sizeof(*result));
    init_s(result);
    return result;
}
```

> ```c
> result = malloc(sizeof(result));
> ```
>
> - 缓冲区是程序中预留的一块内存空间，malloc 的作用是在堆(heap)上动态分配一块连续的内存空间，参数是需要分配的字节数，返回指向这块内存的指针。通过 malloc 分配的内存需要手动释放(使用free)，分配的内存内容是未初始化的，如果分配失败则返回NULL
> - `sizeof(result)` 计算的是指针的大小（在32位系统上是4字节，64位系统上是8字节），而不是结构体 `struct S` 的实际大小（应该是 4个int = 16字节）
>
> 程序实际需要16字节来存储结构体，但 `malloc(sizeof(result))`只分配了4/8字节的内存空间会导致内存分配不足。当写入完整的结构体数据时，会导致缓冲区溢出，破坏相邻内存区域从而导致程序不稳定，产生不可预期的行为，造成内存损坏，程序崩溃

```makefile
# Makefile
size_of_ptr.o: size_of_ptr.c
	clang -c -o size_of_ptr.o size_of_ptr.c

clean:
	-rm -rf *.o output_db

db: clean
	codeql database create --language=cpp --command=make output_db
```

> - `clang -c -o size_of_ptr.o size_of_ptr.c`
>
>   - `-c`：“编译”模式。告诉编译器只进行编译阶段，而不进行链接（linking）阶段。编译器会将源文件 .c 编译成目标文件（.o 文件），而不会生成最终的可执行文件。通常用于将源代码编译成目标文件，然后在后续的链接阶段生成可执行文件。
>   - `-o size_of_ptr.o`：指定输出文件的名称
>   - `size_of_ptr.c`：输入的源代码文件。编译器会将这个 C 文件编译成目标文件。
>
>   ---
>
> - `size_of_ptr.o`: 编译目标文件
>
>   依赖: `size_of_ptr.c`
>
> - `clean`: 清理目标
>
> - `db`: 创建 CodeQL 数据库
>
>   依赖: `clean`
>
> ```bash
> make           # 默认执行第一个目标 size_of_ptr.o
> make clean     # 执行清理
> make db        # 先执行 clean，再创建数据库
> ```

---

通过从项目的签出根目录运行以下命令来创建 CodeQL 数据库（对应上述 Makefile 中的 db 段）：

```bash
codeql database create <database> --language=<language-identifier>
```

在命令中：

- 将 `<database>` 替换为要创建的新数据库的路径。
- 将 `<language-identifier>` 替换为用于创建数据库的语言的标识符。 可以将此标识符与 `--db-cluster` 一起使用以接受逗号分隔的列表，也可以多次指定它。

还可以指定以下选项。 这些选项取决于源文件的位置、代码是否需要编译或者是否要为多种语言创建 CodeQL 数据库。

- 使用 `--source-root` 来标识用于创建数据库的主要源文件的根文件夹。
- 如果要为多种语言创建数据库，请将 `--db-cluster` 用于多语言代码库。
- 如果要为一种或多种已编译语言创建数据库，则使用 `--command`。 如果仅使用 Python 和 JavaScript，则不需要此选项。
- 将 `--no-run-unnecessary-builds` 与 `--db-cluster` 一起使用，以禁用 CodeQL CLI 不需要监视生成的语言的生成命令。

成功创建数据库后，命令中指定的路径下会显示一个新目录。 如果使用 `--db-cluster` 选项创建多个数据库，则会为每种语言创建一个子目录。

每个 CodeQL 数据库目录都包含多个子目录，其中包括用于分析和源存档的关系数据。 源存档是创建数据库时创建的源文件的副本。 CodeQL 使用它来显示分析结果。

> 例如对于 python 项目：
>
> ```bash
> codeql database create cve-monitor-wxworkbot-codeql-database --language=python
> ```
>
> ![image-20250114161738974](http://cdn.ayusummer233.top/DailyNotes/202501141617179.png)
>
> ![image-20250114161920687](http://cdn.ayusummer233.top/DailyNotes/202501141619776.png)

对于上述 C 程序可以使用

```bash
codeql database create --language=cpp --command=make output_db
```

> ![image-20250120152200912](http://cdn.ayusummer233.top/DailyNotes/202501201522999.png)
>
> > PS: 如果之前编译了项目的话，由于 make 增量更新的特性，直接运行上述命令会导致没有实际编译，所以一般 codeql 用到 make 时要先 make clean 下

---

#### Extractors（提取程序）

Extractors 是为每个输入文件生成关系数据和源引用的工具，可据此构建 CodeQL 数据库。 CodeQL 支持的每种语言都有一个 Extractor。 这种结构可确保提取过程尽可能准确。

每个 Extractor 都定义了自己的一组配置选项。 输入 `codeql resolve extractor --format=betterjson` 可以看到如下所示格式的数据

这条命令的含义是识别系统中已安装的CodeQL提取器，以更易读的JSON格式输出显示这些提取器的详细信息

由于我们没有手动编写 extractor，这里读取的就是默认的 extractor

```json
{
    "extractor_root" : "/home/user/codeql/java",
    "extractor_options" : {
        "option1" : {
            "title" : "Java extractor option 1",
            "description" : "An example string option for the Java extractor.",
            "type" : "string",
            "pattern" : "[a-z]+"
        },
        "group1" : {
            "title" : "Java extractor group 1",
            "description" : "An example option group for the Java extractor.",
            "type" : "object",
            "properties" : {
                "option2" : {
                    "title" : "Java extractor option 2",
                    "description" : "An example array option for the Java extractor",
                    "type" : "array",
                    "pattern" : "[1-9][0-9]*"
                }
            }
        }
    }
}
```

![image-20250114162317064](http://cdn.ayusummer233.top/DailyNotes/202501201750569.png)

![image-20250120165101889](http://cdn.ayusummer233.top/DailyNotes/202501201651059.png)

- `extractor_root`: 指示了 CodeQL 提取器(codeql 可执行程序)的根目录位置

- `extractor_options`: 可配置的提取器选项，用于定制 CodeQL 如何解析和提取 C++ 代码

  - `scale_timeouts`: 控制提取器在尝试确定源代码所用的编译器时，如何调整编译器探测过程中的超时时间。某些系统在高负载下可能无法在默认的超时时间内返回结果，因此可以使用此选项来调整超时时间。

    **类型**：string，且必须符合正则表达式 [0-9]+，即一个数字字符串。

    **使用示例**：

    ```bash
    codeql resolve extractor --format=betterjson --language=cpp --extractor-options=scale_timeouts=30
    ```

    这样，提取器在尝试探测编译器时会将超时时间延长到 30 秒，而不是默认的 10 或 15 秒。

  - `log_verbosity`: 控制提取器的日志输出级别。通过调整这个选项，可以改变提取过程中的日志详细程度。其可选值包括：

    - `0（quiet）`：不输出日志或仅输出最基本的信息。
    - `1（normal）`：默认的日志级别，提供适量的日志。
    - `2（chatty）`：提供更多的调试信息。
    - `3（noisy）`：输出非常详细的日志信息，适用于调试。

    **类型**：string，符合正则表达式 [0-3]，即 0 到 3 之间的数字。

    **使用示例**：

    ```bash
    codeql resolve extractor --format=betterjson --language=cpp --extractor-options=log_verbosity=3
    ```

---

若要了解语言提取程序可用的选项，请输入 `codeql resolve languages --format=betterjson`（显示完整的所有语言的 extractor 可配置项信息） 或 `codeql resolve extractor --format=betterjson`。 `betterjson` 输出格式还提供提取程序的根和其他特定于语言的选项。

![image-20250120175136985](http://cdn.ayusummer233.top/DailyNotes/202501201751049.png)

---

#### CodeQL 数据库中的数据

CodeQL 数据库是包含分析所需的所有数据的单个目录。 此数据包括关系数据、复制的源文件和特定语言的数据库架构，该架构指定数据中的相互关系。 CodeQL 在提取后导入此数据。

CodeQL 数据库提供已从代码库中提取的特定语言的可查询数据的快照。 此数据是代码的完整分层表示形式。 它包括抽象语法树（abstract syntax tree）、数据流图（data-flow graph）和控制流图（control-flow graph）的表示形式。

对于多语言代码库，数据库一次生成一种语言。 每种语言都有自己唯一的数据库架构。 在提取过程中，该架构在初始词法分析和通过 CodeQL 进行的复杂分析之间提供了一个接口。

CodeQL 数据库包括两个主表：

- `expressions` 表包含在生成过程中 CodeQL 分析的源代码中的每个表达式对应的行。
- `statements` 表包含在生成过程中 CodeQL 分析的源代码中的每个语句对应的行。

CodeQL 库定义类，用于在其中每个表上提供一个抽象层。 此层包括相关的辅助表 `Expr` 和 `Stmt`。

---

#### CodeQL 潜在的不足

在代码扫描工作流程中创建数据库存在一些潜在的缺陷。本节专门讨论使用 GitHub CodeQL 操作所潜在的缺陷。

您需要为 `autobuild` 使用语言矩阵来构建矩阵中列出的每种编译语言。您可以使用一个矩阵为一种编程语言、操作系统或工具的多个受支持版本创建任务。

如果您不使用矩阵， `autobuild` 会尝试使用存储库中源文件最多的受支持编译语言进行构建。除了 Go 语言之外，对编译语言的分析通常会失败，除非您在执行分析步骤之前提供明确的命令来构建代码。

[文档](https://learn.microsoft.com/en-us/training/modules/codebase-representation-codeql/2-how-prepare-database-codeql)建议在代码扫描工作流文件中配置一个在分析前运行的构建步骤，而不是让 `autobuild` 尝试构建编译语言。这样，工作流文件将根据您的系统和项目的构建要求进行定制，以实现更可靠的扫描。

可以在 [CodeQL autobuild documentation](https://docs.github.com/code-security/code-scanning/creating-an-advanced-setup-for-code-scanning/codeql-code-scanning-for-compiled-languages#about-autobuild-for-codeql) 中阅读有关特定语言和 `autobuild` 步骤的更多内容。

---

#### VSCode Extension

![image-20250120181727787](http://cdn.ayusummer233.top/DailyNotes/202501201817010.png)

![image-20250120181802034](http://cdn.ayusummer233.top/DailyNotes/202501201818098.png)

该扩展会使用在 `PATH` 中找到的已安装的命令行界面（CLI）（如果可用）。如果不可用，该扩展会自动为您管理对 CLI 可执行文件的访问。自动管理可确保 CLI 与 CodeQL 扩展兼容。

---

### 在数据库中运行 CodeQL

> [在数据库中运行 CodeQL](https://learn.microsoft.com/en-us/training/modules/codebase-representation-codeql/3-run-codeql-database)

将代码提取到数据库之后，接下来可使用 CodeQL 查询对其进行分析。 GitHub 专家、安全研究人员和社区参与者编写和维护默认 CodeQL 查询。 你也可以编写自己的查询。

可在代码扫描分析中使用 CodeQL 查询来查找源代码中的问题以及潜在的安全漏洞。 还可编写自定义查询来识别在源代码中使用的每种语言的问题。

有两种重要的查询类型：

- `Alert queries(警报查询)`  突出显示代码特定位置的问题。
- `Path queries(路径查询)` 描述代码中 source 和 sink 之间的信息流。

----

#### 简单的 CodeQL 查询

基本 CodeQL 查询结构包含文件扩展名 `.ql` 和 `select` 子句。 下面是一个示例查询结构：

```sql
/**
 *
 * Query metadata
 *
 */
import /* ... CodeQL libraries or modules ... */
/* ... Optional, define CodeQL classes and predicates ... */
from /* ... variable declarations ... /
where / ... logical formula ... /
select / ... expressions ... */
```

> 例如使用 VSCode 的 CodeQL 扩展的话选择 codeql 数据库后新建查询语句会有一个查询示例：
>
> ![image-20250114163523767](http://cdn.ayusummer233.top/DailyNotes/202501141635941.png)
>
> 这个查询会从 CodeQL 数据库中获取所有的 File 对象，并对每个 File 输出 "Hello, world!"，从而确认数据库中有哪些文件被收集
>
> 由于前面数据库是指定了语言为 python 创建的，相应的这里会显示所有的 py 文件

在 VSCode 的 CodeQL 扩展中倒入数据库：

![image-20250120203420269](http://cdn.ayusummer233.top/DailyNotes/202501202034411.png)

![image-20250120203500134](http://cdn.ayusummer233.top/DailyNotes/202501202035208.png)

导入数据库完成后开始新建查询：

![image-20250120203558219](http://cdn.ayusummer233.top/DailyNotes/202501202035267.png)

![image-20250120203609951](http://cdn.ayusummer233.top/DailyNotes/202501202036029.png)

路径直接选择当前项目根目录即可：

![image-20250120203746946](http://cdn.ayusummer233.top/DailyNotes/202501202037998.png)

自带一个默认的文件查询，确认哪些文件被收集了

![image-20250120203848552](http://cdn.ayusummer233.top/DailyNotes/202501202038600.png)

---

#### 查询元数据

使用 CodeQL 进行代码扫描时，会以一种突出显示当前查询所要查找的潜在问题点的方式生成结果。

这些 queries 包含的 `metadata properties(元数据属性)`指示了结果是如何被解释的。

可以使用这些  metadata 来：

- 在将你自定义的 queries 添加到 GitHub 存储库时辨识他们
- 提供有关查询用途的信息。

元数据信息可以包括查询的说明、唯一 ID 及其问题类型（alert or path）。 元数据还指定解释和显示查询结果的方式。

GitHub 有一个推荐的 query metadata 样式指南。 可以在 [CodeQL 文档](https://github.com/github/codeql/blob/main/docs/query-metadata-style-guide.md)中找到它。

这是一个标准 Java 查询之的 metadata 示例：

![显示查询元数据的屏幕截图。](http://cdn.ayusummer233.top/DailyNotes/202501141638812.png)

> - `@name Type mismatch on container modification`
>
>   当用户运行此 query 时，这个名称会作为结果的标题，告诉用户问题的具体类型。
>
>   这个 query 检测的是**容器修改中的类型不匹配问题**。
>
> - `@description Calling container modification methods such as 'Collection.remove'
>   or 'Map.remove' with an object of a type that is incompatible with
>   the corresponding container element type is unlikely to have any effect.`
>
>   详细描述查询的检测内容和问题场景, 帮助用户理解查询的目标和问题的潜在影响。
>
>   描述指出，当调用容器修改方法（如 Collection.remove 或 Map.remove）时，如果传入的对象类型与容器元素类型不兼容，该调用可能不会起到预期效果。
>
>   这种问题通常是由于开发者对容器的类型或传递的对象类型理解不清导致的，可能会导致程序逻辑错误。
>
> - `@kind problem`
>
>   查询的类别。告诉 CodeQL 和用户，这个 query 检测的问题类型。
>
>   problem 表示这个 query 检测的是一种代码中的问题
>
> - `@problem.severity error`
>
>   定义检测到的问题的严重性。帮助用户根据严重程度排序和优先处理问题。
>
>   error 表示这是一个严重的问题，可能会导致程序运行时出错或逻辑异常。
>
> - `@precision very-high`
>
>   查询的准确性。帮助用户理解查询的可靠性。
>
>   very-high 表示此查询非常精确，几乎不会出现误报（false positive）。
>
>   用户可以放心地处理查询结果，而不用担心错误标记无害的代码。
>
> - `@id java/type-mismatch-modification`
>
>   为此 query 分配的唯一标识符。便于引用或管理查询（如运行单个查询或排除某个查询）。
>
>   - `java`：表示这是针对 Java 代码的查询。
>   - `type-mismatch-modification`：表示它检测的是类型不匹配问题，尤其是容器修改相关的类型不匹配。
>
> - ```
>   @tags reliability
>          correctness
>          logic
>   ```
>
>   定义查询的标签，以标记查询的主题或检测的主要问题类型。帮助用户根据标签分类或过滤查询。
>
>   - `reliability`：这个查询关注代码的可靠性问题。
>   - `correctness`：表明这个查询关注代码的正确性。
>   - `logic`：这个查询与程序逻辑相关。

CodeQL 不会解释没有元数据的查询。它会将这些结果显示为表格，而不会在源代码中显示它们。

对于没有 metadata 的 query

- CodeQL 不会将查询的结果与具体的代码上下文关联，也不会在源代码的相关位置高亮显示这些问题。

  取而代之，它会将查询的结果显示为一个简单的**表格**，其中列出了查询找到的所有匹配项（如文件路径、行号、表达式等）。

- 这种结果形式缺乏友好的可视化支持（如直接跳转到源代码中的问题），因为 CodeQL 无法根据缺少的元数据理解查询结果的背景信息。

----

#### QL 语法

QL 是一种声明性、面向对象的查询语言。 它经过优化，可实现对分层数据结构（尤其是表示软件项目的数据库）的高效分析。

QL 的语法类似于 SQL，但 QL 的语义基于 Datalog。 Datalog 是一种声明性逻辑编程语言，通常用于查询语言。 由于 QL 主要作为一种逻辑语言使用，因此 QL 中的所有操作都是逻辑操作。 QL 还从 Datalog 继承了递归谓词。 QL 增加了对聚合的支持，使复杂的查询简洁明了。

QL 语言由逻辑公式组成。 它使用常见的逻辑连接，如 `and`、`or` 和 `not`，以及 `forall` 和 `exists` 等限定符。 由于 QL 继承递归谓词，因此还可以使用简单的 QL 语法和聚合（如 `count`、`sum` 和 `average`）来编写复杂的递归查询。

有关 QL 语言的详细信息，请参阅 [CodeQL 文档](https://codeql.github.com/docs/ql-language-reference/about-the-ql-language/)。

---

还是从上面的示例 c 程序出发

```c
#include <stdlib.h>
struct S {
    int a;
    int b;
    int c;
    int d;
};、

void init_s(struct S* s) {}

struct S* bad_new_S() {
    struct S* result;
    result = malloc(sizeof(result));
    init_s(result);
    return result;
}

struct S* good_new_S() {
    struct S* result;
    result = malloc(sizeof(*result));
    init_s(result);
    return result;
}
```

我们要匹配的是 malloc 函数的参数是 sizeof 表达式，且 sizeof 表达式的参数类型为指针的情况

那么需要一层层来匹配

首先 malloc 是函数，我们先来看下所有的函数以及函数调用的匹配方式：

```sql
from FunctionCall call
select call, "获取所有的函数调用"
```

![image-20250121142716777](http://cdn.ayusummer233.top/DailyNotes/202501211427088.png)

![image-20250121142739941](http://cdn.ayusummer233.top/DailyNotes/202501211427061.png)

> TODO: 为什么内层函数调用没有

---

```ql
from Function func
select func, "获取所有的函数"
```

![image-20250121142920533](http://cdn.ayusummer233.top/DailyNotes/202501211429593.png)

![image-20250121143042785](http://cdn.ayusummer233.top/DailyNotes/202501211430865.png)

---

然后可以将函数与函数调用关联起来，只查找被调用了的函数

```sql
from FunctionCall call, Function func
where call.getTarget() = func
select call, "函数调用：" + call, func, "调用目标函数：" + func
```

![image-20250121143257839](http://cdn.ayusummer233.top/DailyNotes/202501211432921.png)

![image-20250121143312841](http://cdn.ayusummer233.top/DailyNotes/202501211433949.png)

----

接下来我们可以将被调用的函数限定为 malloc 函数：

```sql
from FunctionCall call, Function func
where call.getTarget() = func and func.getName() = "malloc"
select call, "函数调用：" + call, func, "调用目标函数：" + func
```

![image-20250121143513058](http://cdn.ayusummer233.top/DailyNotes/202501211435201.png)

---

然后进一步查找 malloc 的参数是 sizeof 表达式的情况：

```sql
from FunctionCall call, Function func, SizeofOperator sizeof
where 
	call.getTarget() = func and 
	func.getName() = "malloc" and 
	call.getArgument(0) = sizeof
select call, "函数调用：" + call, func, "调用目标函数：" + func, sizeof, "sizeof 表达式：" + sizeof
```

![image-20250121144125315](http://cdn.ayusummer233.top/DailyNotes/202501211441407.png)

在 CodeQL 的 cpp 库中，有两种 sizeof 相关的类：

`SizeofOperator`: 

- 代表所有 sizeof 操作符的使用
- 包括对类型和表达式的sizeof操作
- 例如：`sizeof(int)` 和 `sizeof(x)` 都包含

`SizeofExprOperator`:

- 是 SizeofOperator 的子类
- 仅代表对表达式的sizeof操作
- 只匹配 `sizeof(expression)` 形式
- 例如：`sizeof(x)`，但不包括 `sizeof(int)`

> TODO:  SizeofExprOperator expression, weishenme 热塑两天 是个表达式

---

接下来需要进一步查看 sizeof 表达式的参数为指针类型的情况，那么先要获取到 sizeof 表达式的参数：

这里需要使用到 `SizeofExprOperator` 的 `getExprOperand` 函数来获取 sizeof 表达式中包含的表达式

![image-20250121145012495](http://cdn.ayusummer233.top/DailyNotes/202501211450643.png)

---

接下来需要继续匹配这个 sizeof 的表达式，单独把指针类型的拎出来

可以先看看获取到的这俩表达式的类型，这就需要使用到 CodeQL 中所有对象都有的 `getPrimaryQlClasses()` 来获取到对象类型

```sql
from FunctionCall call, Function func, SizeofExprOperator sizeof, Expr expr
where 
	call.getTarget() = func and 
	func.getName() = "malloc" and 
	call.getArgument(0) = sizeof and
	sizeof.getExprOperand() = expr
select call, func, sizeof, expr, expr.getPrimaryQlClasses()
```

![image-20250121145411198](http://cdn.ayusummer233.top/DailyNotes/202501211454259.png)

**VariableAccess**

- 表示对变量的直接访问
- 例如：`result`

**PointerDereferenceExpr**

- 表示对指针的解引用操作
- 例如：`*result`

---

接下来匹配 sizeof 的参数是 VariableAccess 的情况, 然后顺便看看怎么具体限定这个 ViriableAccess 是指针类型

```sql
from FunctionCall call, Function func, SizeofExprOperator sizeof, VariableAccess va
where 
	call.getTarget() = func and 
	func.getName() = "malloc" and 
	call.getArgument(0) = sizeof and
	sizeof.getExprOperand() = va
select call, func, sizeof, va, va.getType(), va.getTarget(), va.getTarget().getType(), va.getTarget().getType().getPrimaryQlClasses()
```

![image-20250121153457931](http://cdn.ayusummer233.top/DailyNotes/202501211534093.png)

> 可以看到后续对于变量没有标题了，所以前面用 `"描述" + xxx` 的形式在这里可以用

- **va.getType()**：获取变量访问表达式的类型 - `struct S*`（指针类型）
- **va.getTarget()**：获取被访问的变量声明 - 指向 `struct S* result` 这个声明
- **va.getTarget().getType()**：获取变量声明的类型，同样是 `struct S*`
- **va.getTarget().getType().getPrimaryQlClasses()**：获取类型在 CodeQL 中的主要类别 - 返回 "PointerType" 因为是指针类型

---

然后就是通过 PointerType 来具体限定出问题点了

```sql
from
    FunctionCall call,
    Function func,
    SizeofExprOperator sizeof,
    VariableAccess va
where
    call.getTarget() = func and
    func.getName() = "malloc" and
    call.getArgument(0) = sizeof and
    sizeof.getExprOperand() = va and
    va.getTarget().getType() instanceof PointerType
select sizeof, "此 malloc 调用的参数是指针类型的 sizeof 表达式"
```

![image-20250121154000268](http://cdn.ayusummer233.top/DailyNotes/202501211540350.png)

![image-20250121154134717](http://cdn.ayusummer233.top/DailyNotes/202501211541870.png)

----

#### Path queries 路径查询

信息在程序中流动的方式很重要。 看似正常的数据可能以意外的方式流动，从而导致其被恶意使用。

创建路径查询有助于直观显示通过代码库的信息流。 查询可以跟踪数据从其可能起点 (`source`) 到其可能终结点 (`sink`) 的路径。 要对路径建模，查询必须提供有关 source 和 sink 的信息，以及链接它们的数据流步骤。

要开始编写自己的路径查询，最简单的方法是使用现有查询之一作为模板。 若要获取支持语言的这些查询，请参阅 [CodeQL 文档](https://codeql.github.com/codeql-query-help/)。

路径查询将需要某些元数据、查询谓词和 `select` 语句结构。 CodeQL 中的许多内置路径查询都遵循简单的结构。 这些结构取决于 CodeQL 对要分析的语言所采用的建模方式。

以下是路径查询的示例模板：

```bash
/**
 * ...
 * @kind path-problem
 * ...
 */

import <language>
// For some languages (Java/C++/Python/Swift), you need to explicitly import the data-flow library, such as
// import semmle.code.java.dataflow.DataFlow or import codeql.swift.dataflow.DataFlow
...

module Flow = DataFlow::Global<MyConfiguration>;
import Flow::PathGraph

from Flow::PathNode source, Flow::PathNode sink
where Flow::flowPath(source, sink)
select sink.getNode(), source, sink, "<message>"
```

在该模板中：

- `MyConfiguration` 是一个模块其中包含定义数据如何在 `source` 和 `sink` 之间流动的谓词。
- `Flow` 是基于 `MyConfiguration` 的数据流计算的结果。
- `Flow::Pathgraph` 是需要导入的结果数据流图形模块，以便在查询中包含路径说明。
- `source` 和 `sink` 是配置中定义的图形中的节点，`Flow::PathNode` 是它们的类型。
- `DataFlow::Global<..>` 是数据流的调用。 可以改用 `TaintTracking::Global<..>` 来包含一组默认的其他污点步骤。

-----

## CodeQL CTF : Go and don't return

> [CodeQL CTF : Go and don't return / Github Security Lab](https://securitylab.github.com/ctf/go-and-dont-return/)
>
> [vscode-codeql-starter](https://github.com/github/vscode-codeql-starter)

寻找对象存储中最近发现的一个漏洞。此身份验证绕过漏洞使攻击者能够在不知道管理员密钥的情况下执行管理员 API 操作。

使用 CodeQL，您将学习如何检测此漏洞，以及如何将您的查询进行泛化以捕获各种相关漏洞。

学习材料

- [the CodeQL tutorials](https://codeql.github.com/docs/writing-codeql-queries/ql-tutorials/#ql-tutorials)
- [CodeQL training examples for Go](https://codeql.github.com/docs/codeql-language-guides/codeql-for-go/).

---

### 漏洞介绍

MinIO 是一个与亚马逊 S3 兼容的对象存储。2020 年 4 月，开发人员收到警报，发现一个严重的安全问题：MinIO 管理 API 中存在一个身份验证绕过问题。如果有管理员访问密钥，就有可能在不知道管理员秘密密钥的情况下执行管理 API 操作（例如，为现有访问密钥创建新的服务账户）。

这个权限检查错误被分配为 `CVE-2020-11012`，并通过此提交进行了修复。MinIO 发布了一个 GitHub 安全公告，以通知开源生态系统并要求他们进行升级，

----

### 需要解决的问题

正如您在 [fix commit](https://github.com/minio/minio/commit/4cd6ca02c7957aeb2de3eede08b0754332a77923) 中所看到的，问题是在一个 `if s3Err != ErrNone {` 块中缺少 `return` 。然后，函数 `validateAdminSignature` 未能向上游返回验证的结果。这是一个在代码审查期间很容易未被发现的简单错误，所以让我们尝试使用 CodeQL 来自动检测这种错误，然后完善我们的查询，只找到那些真正重要的错误。

![image-20250121154458605](http://cdn.ayusummer233.top/DailyNotes/202501211544756.png)

-----

### 环境准备

Clone 

```bash
git clone https://github.com/github/vscode-codeql-starter.git
git submodule update --init --remote
```

打开

![image-20250114165659412](http://cdn.ayusummer233.top/DailyNotes/202501141656524.png)

![image-20250121155339557](http://cdn.ayusummer233.top/DailyNotes/202501211553712.png)

- `ql` 文件夹包含了针对 C/C++、C#、Go、Java、JavaScript/Typescript、Python 和 Ruby 的开源代码 QL 标准库。它跟踪了 https://github.com/github/codeql 中标记为 `codeql-cli/latest` 的分支。你可以从这里运行标准查询，并浏览这些库。
-  `codeql-custom-queries-<language>` 的文件夹已准备好，供您开始为每种语言开发自定义查询，同时使用标准库。相应的每个目录里都有一示例查询，如上图所示。

选择从 Archive 打开 database，然后打开从 [this CodeQL database of MinIO](https://github.com/github/securitylab/releases/download/ctf-go-and-dont-return/minio-db-2020-11012-broken.zip) 下载的 zip 文件

![image-20250121155949504](http://cdn.ayusummer233.top/DailyNotes/202501211559561.png)

然后可以尝试运行位于 `codeql-custom-queries-go` 文件夹中的 `example.ql` 查询进行测试。

![image-20250121160102797](http://cdn.ayusummer233.top/DailyNotes/202501211601945.png)

![image-20250121160134681](http://cdn.ayusummer233.top/DailyNotes/202501211601758.png)

```sql
from BlockStmt b
where b.getNumStmt() = 0
select b, "This is an empty block."
```

这个查询可以帮助找到代码中所有空的代码块（不包含任何语句的代码块）

-  `BlockStmt`（代码块语句）

  `BlockStmt`：表示Go语言中的代码块，通常由花括号`{}`包围

-  `b.getNumStmt() = 0`（代码块中语句数量为0）

  `getNumStmt()`：方法返回代码块中包含的语句数量

---

### Step1-Let's catch the bug

首先，让我们构建一个查询来查找存在问题的代码块。我们正在寻找那些测试变量与 `ErrNone` 进行比较且不包含返回语句的 `if` 块。我们将逐步进行此搜索，以帮助您熟悉概念和 CodeQL Go 库。

---

#### Step 1.1: Finding references to `ErrNone`

在这一步中，您将在代码中找到所有对 `ErrNone` 的引用。

您的查询应类似于 `codeql-custom-queries-go` 文件夹中可用的 `example.ql` 查询。第一行应为 `import go` ，用于导入 CodeQL Go 库，查询的主体是

```sql
from <variable_type> <variable_name> // this is the declaration
    where <filter>
    select <variable_name>
```

编写查询以查找所有名为 `ErrNone` 的 `identifiers`(标识符)。您可以在 [documentation](https://codeql.github.com/docs/codeql-language-guides/codeql-library-for-go/#expressions) 中找到要查询的相关对象类型。您的查询应返回 231 个结果。

---

- `Ident` 是 Go CodeQL 库中表示标识符的类

- `getName()` 方法获取标识符的名称

```sql
import go

from Ident i
where i.getName() = "ErrNone"
select i
```

![image-20250121161429739](http://cdn.ayusummer233.top/DailyNotes/202501211614915.png)

---

#### Step 1.2: Finding equality tests against `ErrNone`

在下一步中，编写一个查询以查找所有其中一个操作数是名为 `ErrNone` 的标识符的相等测试表达式。您的查询应返回 158 个结果。

> Tip: 在 [documentation](https://codeql.github.com/docs/ql-language-reference/expressions/#casts) 中可以了解更多关于如何将表达式的类型限制为特定类型的信息。

---

- `EqualityTestExpr` 是 Go CodeQL 库中表示相等测试表达式的类

  ```sql
  from EqualityTestExpr e
  select e.getAnOperand()
  ```

  ![image-20250121162130512](http://cdn.ayusummer233.top/DailyNotes/202501211621654.png)

- `getAnOperand()` 方法获取相等测试表达式的一个操作数

- `Ident` 是 Go CodeQL 库中表示标识符的类

- `getName()` 方法获取标识符的名称

- `e.getAnOperand().(Ident)` 将表达式的类型限制为 `Ident`


```sql
from EqualityTestExpr e
where e.getAnOperand().(Ident).getName() = "ErrNone"
select e
```

![image-20250121162331188](http://cdn.ayusummer233.top/DailyNotes/202501211623267.png)

---

#### Step 1.3: Finding if-blocks making such a test

查找进行此类测试的 if 块

编写一个查询，查找所有条件类似于步骤 1.2 中的相等测试的 if 语句。您的查询应返回 133 个结果。

> **Tip**: Search the [documentation](https://codeql.github.com/docs/codeql-language-guides/codeql-library-for-go/#statements) for the relevant statement type.

---

- `IfStmt` 是 Go CodeQL 库中表示 if 语句的类
- `getCond()` 方法获取 if 语句的条件表达式
- `EqualityTestExpr` 是 Go CodeQL 库中表示相等测试表达式的类

```sql
from IfStmt s
where s.getCond().(EqualityTestExpr).getAnOperand().(Ident).getName() = "ErrNone"
select s
```

![image-20250121162652654](http://cdn.ayusummer233.top/DailyNotes/202501211626725.png)

---

#### Step 1.4: Finding return statements

查找返回语句

编写一个查询以查找所有返回语句。您的查询应返回 10,651 个结果。

---

- `ReturnStmt` 是 Go CodeQL 库中表示返回语句的类

```sql
from ReturnStmt r
select r, r.getReturnValue()
```

![image-20250121162924643](http://cdn.ayusummer233.top/DailyNotes/202501211629696.png)

---

#### Step 1.5: Finding if-blocks without return statements

查找没有返回语句的 if 块

编写一个查询，查找所有在其 `then` 分支中不包含返回语句的 if 块。您的查询应返回 3541 个结果。记住，我们正在逐步进行！我们现在只关心 `then` 分支！

> **Tip**: You can perform a type check of your variable with [`instanceof`](https://codeql.github.com/docs/ql-language-reference/formulas/#type-checks).

----

- `IfStmt` 是 Go CodeQL 库中表示 if 语句的类
- `getThen()` 方法获取 if 语句的 `then` 分支
- `getAStmt()` 方法获取 if 语句的 `then` 分支的语句
- `ReturnStmt` 是 Go CodeQL 库中表示返回语句的类

```sql
from IfStmt i
where not i.getThen().getAStmt() instanceof ReturnStmt
select i
```

![image-20250121163247340](http://cdn.ayusummer233.top/DailyNotes/202501211632397.png)

---

#### Step 1.6: Putting it all together

将所有内容整合在一起

结合步骤 1.5 和 1.3，编写一个查询，查找测试等于 `ErrNone` 且没有返回的 if 块。

你应该总共得到 7 个结果。确认我们要找的 bug 是其中之一。

> 干得好！你编写了一个检测该漏洞的查询！我们希望你喜欢这次 CodeQL 的热身，因为接下来我们将继续探讨更复杂的概念。

----

- `IfStmt` 是 Go CodeQL 库中表示 if 语句的类
- `getCond()` 方法获取 if 语句的条件表达式
- `EqualityTestExpr` 是 Go CodeQL 库中表示相等测试表达式的类
- `getAnOperand()` 方法获取相等测试表达式的一个操作数
- `Ident` 是 Go CodeQL 库中表示标识符的类
- `getName()` 方法获取标识符的名称
- `ReturnStmt` 是 Go CodeQL 库中表示返回语句的类
- `getThen()` 方法获取 if 语句的 `then` 分支
- `getAStmt()`获取语句

```sql
from IfStmt i
where
i.getCond().(EqualityTestExpr).getAnOperand().(Ident).getName() = "ErrNone"
and not i.getThen().getAStmt() instanceof ReturnStmt
select i
```

![image-20250121163541346](http://cdn.ayusummer233.top/DailyNotes/202501211635420.png)

---

### Step2:Improving the precision - 提高精度

所以我们找到了这个错误，但我们也看到了一些误报：一些故意忽略的非致命错误，一些直接使用 `writeErrorResponseJSON` 和相关函数报告的失败，以及一些直接响应、跳出循环或使用其他模式来响应错误的情况。能够检测到真正的错误是好的，但如果结果过于嘈杂，你可能会错过它们。

也就是说，如果太多的警报是误报的话，那么就会导致真正的问题被忽略，所以需要进一步优化查询

我们可以更精确的一种方法是仅检查来自 `isReqAuthenticated` 的返回代码，这些代码当然不应被忽略。我们可以使用 CodeQL 的 `data flow`(数据流) 功能来实现这一点。

> 我们建议您阅读更多关于 [data flow analysis in CodeQL](https://codeql.github.com/docs/writing-codeql-queries/about-data-flow-analysis/#about-data-flow-analysis)，以及如何在 Go 中编写数据流查询的内容：[local data flow](https://codeql.github.com/docs/codeql-language-guides/codeql-library-for-go/#data-flow) and [global data flow](https://codeql.github.com/docs/codeql-language-guides/codeql-library-for-go/#global-data-flow-and-taint-tracking).

---

#### Step 2.1: Find conditionals that are fed from calls to `isReqAuthenticated`

查找从 `isReqAuthenticated` 调用馈送的条件语句

编写一个 [data flow configuration](https://codeql.github.com/docs/codeql-language-guides/codeql-library-for-go/#global-data-flow-and-taint-tracking)(数据流配置)，用于跟踪从任何对 `isReqAuthenticated` 的调用流向任何相等测试操作数的数据。您的查询必须选择所有相等测试——类型： `DataFlow::EqualityTestNode` ——其中操作数是上述配置的 `sink` 。

这为我们提供了 64 个潜在有趣的条件语句以供调查。需要注意的是，其中许多并非直接调用 `isReqAuthenticated` ，而是测试某些中间函数的结果，这些中间函数进而调用 `isReqAuthenticated` 。CodeQL 的全局数据流分析功能使我们能够检测到这些情况。

> **Tip**: Learn about the [`any`](https://codeql.github.com/docs/ql-language-reference/expressions/#any) aggregate.

---

```sql
class AuthTestConfig extends DataFlow::Configuration {

  AuthTestConfig() { this = "auth-test-config" }

  override predicate isSource(DataFlow::Node source) {
    source = any(DataFlow::CallNode cn |
      cn.getTarget().hasQualifiedName("github.com/minio/minio/cmd", "isReqAuthenticated")
    ).getResult()
  }

  override predicate isSink(DataFlow::Node sink) {
    sink = any(DataFlow::EqualityTestNode n).getAnOperand()
  }

}

from AuthTestConfig config, DataFlow::Node sink, DataFlow::EqualityTestNode comparison
where config.hasFlow(_, sink) and comparison.getAnOperand() = sink
select comparison
```

- `class AuthTestConfig extends DataFlow::Configuration` 自定义了一个数据流配置。

---

## 学习材料

- [CodeQL documentation](https://codeql.github.com/docs/)
- [the CodeQL tutorials](https://codeql.github.com/docs/writing-codeql-queries/ql-tutorials/#ql-tutorials)
- [CodeQL training examples for Go](https://codeql.github.com/docs/codeql-language-guides/codeql-for-go/).
- [《深入理解CodeQL》](https://github.com/ASTTeam/CodeQL)

---



















