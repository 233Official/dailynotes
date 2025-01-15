# CodeQL

> [CodeQL documentation (github.com)](https://codeql.github.com/docs/)
>
> [ASTTeam/CodeQL: 《深入理解CodeQL》Finding vulnerabilities with CodeQL. (github.com)](https://github.com/ASTTeam/CodeQL)

CodeQL 是一套 Github 在2019 开源且免费的静态扫描代码工具，让你能在产品release 前及早发现潜藏的漏洞并提供相对应改善的方法。

---

## 使用 CodeQL 识别代码库中的安全漏洞

> [使用 CodeQL 识别代码库中的安全漏洞 / Microsoft Learn / Github 高级安全](https://learn.microsoft.com/zh-cn/training/modules/codebase-representation-codeql/)

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

- 运行 `codeql resolve languages` 以显示 CodeQL CLI 包默认支持哪些语言。

  ![image-20250114152611154](http://cdn.ayusummer233.top/DailyNotes/202501141526202.png)

---

#### 创建数据库

通过从项目的签出根目录运行以下命令来创建 CodeQL 数据库：

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

> ```bash
> codeql database create cve-monitor-wxworkbot-codeql-database --language=python
> ```
>
> ![image-20250114161738974](http://cdn.ayusummer233.top/DailyNotes/202501141617179.png)
>
> ![image-20250114161920687](http://cdn.ayusummer233.top/DailyNotes/202501141619776.png)

---

成功创建数据库后，命令中指定的路径下会显示一个新目录。 如果使用 `--db-cluster` 选项创建多个数据库，则会为每种语言创建一个子目录。

每个 CodeQL 数据库目录都包含多个子目录，其中包括用于分析和源存档的关系数据。 源存档是创建数据库时创建的源文件的副本。 CodeQL 使用它来显示分析结果。

---

#### Extractors

提取程序是为每个输入文件生成关系数据和源引用的工具，可以从中构建 CodeQL 数据库。 CodeQL 支持的每种语言都有一个提取程序。 此结构可确保提取过程尽可能准确。

每个提取程序都定义了自己的一组配置选项。 输入 `codeql resolve extractor --format=betterjson` 将导致数据格式如以下示例所示：

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

若要了解语言提取程序可用的选项，请输入 `codeql resolve languages --format=betterjson` 或 `codeql resolve extractor --format=betterjson`。 `betterjson` 输出格式还提供提取程序的根和其他特定于语言的选项。

![image-20250114162317064](http://cdn.ayusummer233.top/DailyNotes/202501141623160.png)

---

#### CodeQL 数据库中的数据

CodeQL 数据库是包含分析所需的所有数据的单个目录。 此数据包括关系数据、复制的源文件和特定语言的数据库架构，该架构指定数据中的相互关系。 CodeQL 在提取后导入此数据。

CodeQL 数据库提供已从代码库中提取的特定语言的可查询数据的快照。 此数据是代码的完整分层表示形式。 它包括抽象语法树、数据流图和控制流图的表示形式。

对于多语言代码库，数据库一次生成一种语言。 每种语言都有自己唯一的数据库架构。 在提取过程中，该架构在初始词法分析和通过 CodeQL 进行的复杂分析之间提供了一个接口。

CodeQL 数据库包括两个主表：

- `expressions` 表包含在生成过程中 CodeQL 分析的源代码中的每个表达式对应的行。
- `statements` 表包含在生成过程中 CodeQL 分析的源代码中的每个语句对应的行。

CodeQL 库定义类，用于在其中每个表上提供一个抽象层。 此层包括相关的辅助表 `Expr` 和 `Stmt`。

---

### 在数据库中运行 CodeQL

将代码提取到数据库之后，接下来可使用 CodeQL 查询对其进行分析。 GitHub 专家、安全研究人员和社区参与者编写和维护默认 CodeQL 查询。 你也可以编写自己的查询。

可在代码扫描分析中使用 CodeQL 查询来查找源代码中的问题以及潜在的安全漏洞。 还可编写自定义查询来识别在源代码中使用的每种语言的问题。

有两种重要的查询类型：

- 警报查询 突出显示代码特定位置的问题。
- 路径查询 描述代码中源和接收器之间的信息流。

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

例如使用 VSCode 的 CodeQL 扩展的话选择 codeql 数据库后新建查询语句会有一个查询示例：

![image-20250114163523767](http://cdn.ayusummer233.top/DailyNotes/202501141635941.png)

这个查询会从 CodeQL 数据库中获取所有的 File 对象，并对每个 File 输出 "Hello, world!"，从而确认数据库中有哪些文件被收集

由于前面数据库是指定了语言为 python 创建的，相应的这里会显示所有的 py 文件

---

#### 查询元数据

结合使用 CodeQL 和代码扫描时，可采用一种突出显示查询所要查找的潜在问题的方式来转换结果。 查询包含指示应如何解释结果的元数据属性。 使用查询元数据可以：

- 在将自定义查询添加到 GitHub 存储库时，对其进行识别。
- 提供有关查询用途的信息。

元数据信息可以包括查询的说明、唯一 ID 及其问题类型（警报或路径）。 元数据还指定解释和显示查询结果的方式。

GitHub 具有查询元数据的建议样式指南。 可以在 [CodeQL 文档](https://github.com/github/codeql/blob/main/docs/query-metadata-style-guide.md)中找到它。

这是标准 Java 查询之一的元数据示例：

![显示查询元数据的屏幕截图。](http://cdn.ayusummer233.top/DailyNotes/202501141638812.png)

CodeQL 不解释没有元数据的查询。 它将这些结果显示为表，并且不会在源代码中显示它们。

----

#### QL 语法

QL 是一种声明性、面向对象的查询语言。 它经过优化，可实现对分层数据结构（尤其是表示软件项目的数据库）的高效分析。

QL 的语法类似于 SQL，但 QL 的语义基于 Datalog。 Datalog 是一种声明性逻辑编程语言，通常用于查询语言。 由于 QL 主要作为一种逻辑语言使用，因此 QL 中的所有操作都是逻辑操作。 QL 还从 Datalog 继承了递归谓词。 QL 增加了对聚合的支持，使复杂的查询简洁明了。

QL 语言由逻辑公式组成。 它使用常见的逻辑连接，如 `and`、`or` 和 `not`，以及 `forall` 和 `exists` 等限定符。 由于 QL 继承递归谓词，因此还可以使用简单的 QL 语法和聚合（如 `count`、`sum` 和 `average`）来编写复杂的递归查询。

有关 QL 语言的详细信息，请参阅 [CodeQL 文档](https://codeql.github.com/docs/ql-language-reference/about-the-ql-language/)。

----

#### 路径查询

信息在程序中流动的方式很重要。 看似正常的数据可能以意外的方式流动，从而导致其被恶意使用。

创建路径查询有助于直观显示通过代码库的信息流。 查询可以跟踪数据从其可能起点 (`source`) 到其可能终结点 (`sink`) 的路径。 要对路径建模，查询必须提供有关源和接收器的信息，以及链接它们的数据流步骤。

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

-----

### 环境准备

Clone 

```bash
git clone https://github.com/github/vscode-codeql-starter.git
git submodule update --init --remote
```

打开

![image-20250114165659412](http://cdn.ayusummer233.top/DailyNotes/202501141656524.png)















---

## 学习材料

- [CodeQL documentation](https://codeql.github.com/docs/)
- [the CodeQL tutorials](https://codeql.github.com/docs/writing-codeql-queries/ql-tutorials/#ql-tutorials)
- [CodeQL training examples for Go](https://codeql.github.com/docs/codeql-language-guides/codeql-for-go/).
- [《深入理解CodeQL》](https://github.com/ASTTeam/CodeQL)

---



















