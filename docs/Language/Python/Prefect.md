---
category: Python
tags:
  - Prefect
excerpt: Prefect是一个用Python写的开源的工作流编排工具
---
# Prefect

> [Prefect Github Repo](https://github.com/PrefectHQ/prefect)

Prefect 是一个用 **Python** 写的开源「**工作流编排（workflow orchestration）工具**」。

简单来说 **Prefect = 用 Python 写的聪明版定时器 + 流程管理器。**

它可以实现如下需求：

- **定义任务（tasks）**：比如下载数据、处理数据、训练模型。
- **安排任务顺序（flows）**：比如「先下载数据 → 再处理 → 再训练」。
- **监控任务运行情况**：可以看成功了没，失败了可以重试，卡住了能报警。
- **定时调度**：比如每天凌晨2点自动跑一遍。
- **处理失败和重试**：任务失败可以自动重试、跳过、或者发送通知。

---

**和传统的调度器（比如 cron）相比，Prefect 更强的地方在于：**

- **可以用纯 Python 来写流程**，不用写 YAML 或 JSON。
- **任务之间可以有依赖关系**，而且可以很灵活地控制条件。
- **支持本地跑、服务器跑，也可以配合 Prefect Cloud 做大规模管理**。
- **内建状态追踪、日志记录**，出错了容易查问题。

---

## 安装

### 本体安装

可以使用 Python 安装 Prefect，Prefect 的子依赖很多，不建议安装到全局 python 库中，建议使用虚拟环境进行管理，这里选择使用 Poetry 管理依赖版本

> ![image-20250428165950234](http://cdn.ayusummer233.top/DailyNotes/202504281659313.png)

本地安装 Prefect：

```bash
poetry add prefect -vvv
prefect version
```

![image-20250428165852687](http://cdn.ayusummer233.top/DailyNotes/202504281658956.png)

---

### 配置 PREFECT_HOME

当在 Python 虚拟环境中安装了 Prefect 后，虽然 Prefect 安装在了虚拟环境中，但 Prefect 的配置文件会默认放在 `～/.prefect` 目录下，而且 `.prefect` 目录下不只有配置文件，还有数据库相关的文件与配置，且由于不同版本的 Prefect 之间的数据库格式和配置文件格式会有不兼容的情况，所以建议设置 `PREFECT_HOME` 环境变量来指定 Prefect 的配置文件目录。

```bash
# 设置 PREFECT_HOME 环境变量
export PREFECT_HOME=xxx
# 创建 Prefect 的配置文件目录
mkdir -p $PREFECT_HOME
```

> [Prefect 一键设置项目根目录下的 `.prefect` 目录为 `PREFECT_HOME`](https://github.com/233Official/DailyNotesCode/tree/main/Python/PrefectDemo/.activate-hooks)
>
> ```bash
> python .activate-hooks/.activate-hooks.py
> ```
>
> ![image-20250428173347388](http://cdn.ayusummer233.top/DailyNotes/202504281733564.png)

---

## Agent连接Server

### 远程模式

连接到 Prefect Server：

```bash
# 进入虚拟环境
poetry shel

# 创建新的远程配置文件
prefect profile create remote

# 切换到新创建的远程配置
prefect profile use remote
# 设置 API_URL
prefect config set PREFECT_API_URL="http://xxx.xxx.xxx.xxx:4200/api" 
# 设置认证字符串
# prefect config set PREFECT_API_AUTH_STRING="xxx"
# 如果服务器需要认证，还需设置 API 密钥
# prefect config set PREFECT_API_KEY="your-api-key-here"

# 切换到新创建的远程配置
prefect profile use remote
# 验证远程连接
prefect config view
```

或者直接改 `$PREFECT_HOME/.prefect/profiles.toml`

> 如果没有手动修改 PREFECT_HOME 的话默认是在 `~/.prefect`, 不过为了完全隔离 prefect 版本，我一般选择自定义 PREFECT_HOME

```toml
[profiles.remote]
PREFECT_API_URL = "http://xxx.xxx.xxx.xxx:4200/api"
PREFECT_API_AUTH_STRING = "xxxxxxxxx"
```

---

### 本地模式

创建或切换到本地配置文件：

```bash
# 进入虚拟环境
poetry shel

# 新建一个窗口启动本地 prefect server
prefect server start

# 创建并使用本地配置文件
prefect profile create local

# 切换到本地配置
prefect profile use local
prefect config set PREFECT_API_URL="http://127.0.0.1:4200/api" 

# 再次运行验证连通性
prefect profile use local
```

![image-20250428173515647](http://cdn.ayusummer233.top/DailyNotes/202504281735718.png)

![image-20250428174917634](http://cdn.ayusummer233.top/DailyNotes/202504281749720.png)

![image-20250428173641532](http://cdn.ayusummer233.top/DailyNotes/202504281736610.png)

---

## 核心概念

- **Flow**: 工作流定义
- **Task**: 工作流中的单个步骤
- **Deployment**: 将flow部署到生产环境的配置
- **Work Queue**: 工作队列，将工作分发给agents
- **Agent**: 监听工作队列并执行工作的进程

---

### Flow

Flow 是 Prefect 的核心概念，表示一个完整的工作流程，通过 `@flow` 装饰器定义。

**基础流程示例**:

```python
@flow(name="基础数据处理流程", description="生成、处理并保存数据的简单流程")
def basic_data_flow(rows: int = 500, output_path: str = "output.csv"):
    # 任务链：生成 -> 处理 -> 保存
    data = generate_data(rows)
    processed = process_data(data)
    result_path = save_results(processed, output_path)
    return result_path
```

Flow 的特点：

- 可以有名称和描述
- 可以接收参数
- 可以包含多个任务
- 可以包含子流程（见 [advanced_flow.py](https://github.com/233Official/DailyNotesCode/blob/ae8fa3e22f6fa017f3d9fabde199e30b173eeb36/Python/PrefectDemo/flows/advanced_flow.py) 中的 [process_partition](https://github.com/233Official/DailyNotesCode/blob/ae8fa3e22f6fa017f3d9fabde199e30b173eeb36/Python/PrefectDemo/flows/advanced_flow.py#L41)）
- 可以进行部署和调度

```bash
python flows/basic_flow.py
```

![image-20250429104257037](http://cdn.ayusummer233.top/DailyNotes/202504291042299.png)

![image-20250429110013437](http://cdn.ayusummer233.top/DailyNotes/202504291100652.png)

![image-20250429110034612](http://cdn.ayusummer233.top/DailyNotes/202504291100739.png)

![image-20250429110229837](http://cdn.ayusummer233.top/DailyNotes/202504291102933.png)

---

### Task

Task是Flow中的单个执行单元，通常执行独立、可重用的功能。

![image-20250429112459433](http://cdn.ayusummer233.top/DailyNotes/202504291124591.png)

![image-20250429112559562](http://cdn.ayusummer233.top/DailyNotes/202504291125659.png)

---

### Deployment

Deployment将 Flow 打包并注册到Prefect服务器，使其可以远程执行或按计划执行。

Deployment 向 Prefect Server 注册一个调度计划（指定Flow的可执行配置包），接下来可以选择自动调度或者手动触发的模式通过 Deployment 执行这个指定的 Flow

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│              │        │              │        │              │
│  编写工作流   │───────▶│ 创建工作池     │───────▶│  创建部署配置  │
│              │        │              │        │              │
└──────────────┘        └──────────────┘        └──────┬───────┘
                                                       │
                                                       ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│              │        │              │        │              │
│  工作流执行   │◀───────│ Worker 启动  │◀───────│ 注册部署到      │
│              │        │              │        │   Server     │
└──────────────┘        └──────────────┘        └──────────────┘
```

---

对于 Prefect 3.x 而言有如下三种部署方案：

- `flow.serve()` - 一体化的开发环境部署方式，单行代码同时创建部署并启动worker
- `flow.deploy()` - 代码式部署配置，灵活性高，可编程定义部署参数
- `YAML部署` - 声明式配置，将部署定义与代码分离，适合团队协作和生产环境

|        特性        |       flow.serve()       |     flow.deploy()     |            YAML部署             |
| :----------------: | :----------------------: | :-------------------: | :-----------------------------: |
|    **配置方式**    |         代码参数         |     代码方法参数      |         声明式YAML文件          |
|   **工作池处理**   |    自动创建临时工作池    |    使用指定工作池     |         使用指定工作池          |
|   **Worker启动**   |         自动启动         |      需单独启动       |           需单独启动            |
|    **执行模式**    |     阻塞式(前台运行)     |       非阻塞式        |            非阻塞式             |
| **代码与配置分离** |            低            |          中           |               高                |
|    **适用场景**    |    开发测试、快速原型    | 程序化部署、CI/CD集成 |       生产环境、团队协作        |
| **版本控制友好度** |            低            |          中           |               高                |
|   **配置复杂度**   |        低(最简单)        |          中           |             中到高              |
|   **自动化潜力**   |            低            |          高           |               高                |
|    **示例用途**    |       本地开发测试       |   动态生成多个部署    |       生产环境标准化部署        |
|    **典型命令**    | `flow.serve(name="dev")` |  `flow.deploy(...)`   | `prefect deploy -f deploy.yaml` |

---

#### flow.serve

![image-20250429181805933](http://cdn.ayusummer233.top/DailyNotes/202504291818224.png)

![image-20250429181833166](http://cdn.ayusummer233.top/DailyNotes/202504291818263.png)

`Ctrl+C` 停止效果如下：

![image-20250429182323888](http://cdn.ayusummer233.top/DailyNotes/202504291823987.png)

![image-20250429182500856](http://cdn.ayusummer233.top/DailyNotes/202504291825967.png)

---

时间触发一小时不好看效果，改成 1min 看看效果：

![image-20250429185525320](http://cdn.ayusummer233.top/DailyNotes/202504291855895.png)

![image-20250429191116108](http://cdn.ayusummer233.top/DailyNotes/202504291911313.png)

---

#### flow.deploy

与 `flow.serve()` 不同，`flow.deploy()` 提供了更灵活的部署方式，但也需要更多手动配置。

1. **预先创建WorkPool（工作池）**： `flow.deploy()` 不会自动创建临时工作池，因此必须先创建工作池

   可通过 UI 或 CLI 创建: `prefect work-pool create --type docker my-work-pool-docker-flow-deploy`

   > ![image-20250429200048588](http://cdn.ayusummer233.top/DailyNotes/202504292000829.png)
   >
   > ![image-20250429201859181](http://cdn.ayusummer233.top/DailyNotes/202504292018283.png)
   >
   > ---
   >
   > 需要注意的是，这里有一个陷阱，那就是在使用 `flow.deploy` 部署 flow 时不要创建 Process 类型的 Work Pool，因为不兼容，`flow.deploy` 函数必须传入一个镜像，Process 类型的 Work Pool 是给 `flow.serve` 用的:
   >
   > ![image-20250430081047767](http://cdn.ayusummer233.top/DailyNotes/202504300821566.png)
   >
   > 建议创建 docker 类型的 WorkPool
   >
   > ---
   >
   > 关于 Work Pool 的部分可跳转 [Work Pool](#Work Pool) 阅读

2. **编写部署脚本**

   设置 `push=False` 以跳过将镜像推送到镜像仓库的步骤

   需要注意的是运行此模块式机子环境需要能连通 docker hub(就算不推送image也需要), 否则会报错如下:

   ![image-20250430082058942](http://cdn.ayusummer233.top/DailyNotes/202504300821802.png)

   运行此部署模块会先构建 image:

   ![image-20250430081626376](http://cdn.ayusummer233.top/DailyNotes/202504300821022.png)

   ![image-20250430082247647](http://cdn.ayusummer233.top/DailyNotes/202504300824248.png)

   ![image-20250430082403624](http://cdn.ayusummer233.top/DailyNotes/202504300824686.png)

3. **触发运行**

   现在我们已经部署了流程，我们可以通过 Prefect CLI 或 UI 触发运行。

   首先，我们需要启动一个 Worker 来运行我们的流程：

   ```bash
   prefect worker start --pool my-work-pool-docker-flow-deploy
   ```

   首次运行会提示安装相关 docker lib:

   ![image-20250430082855814](http://cdn.ayusummer233.top/DailyNotes/202504300828872.png)

   ![image-20250430083000935](http://cdn.ayusummer233.top/DailyNotes/202504300830056.png)

   ![image-20250430083849660](http://cdn.ayusummer233.top/DailyNotes/202504300838721.png)

   ![image-20250430083858286](http://cdn.ayusummer233.top/DailyNotes/202504300838352.png)

   ![image-20250430084035621](http://cdn.ayusummer233.top/DailyNotes/202504300840676.png)

   然后，我们可以使用 Prefect CLI 触发流程的运行：

   ```bash
   prefect deployment run '基础数据处理流程/deployment-docker-flow-deploy'
   ```

   ![image-20250430084125035](http://cdn.ayusummer233.top/DailyNotes/202504300841097.png)

   windows上运行会有报错:

   ![image-20250430085128175](http://cdn.ayusummer233.top/DailyNotes/202504300851250.png)





- `schedule=IntervalSchedule(interval=3600)`
  - **含义**：定义自动执行的调度计划
  - **作用**：每隔3600秒（1小时）自动触发一次流程执行
  - **选项**
    - `IntervalSchedule` - 固定间隔执行
    - `CronSchedule` - 使用 cron 表达式定义复杂调度（这里的 `CronSchedule(cron="0 3 * * *")`表示每天凌晨3点）
    - 不设置 - 仅支持手动触发（如示例中的 "高级流程-手动"）
- `work_queue_name="demo-queue"`
  - **含义**：指定此部署的执行请求应放入哪个工作队列
  - **作用**：允许根据不同队列划分执行资源
  - 实际应用
    - 可以为不同环境（开发、测试、生产）创建不同队列
    - 可以为高优先级任务创建专用队列
    - 需要有 Agent 监听这个队列（`prefect work-queue start "demo-queue"`）
- `tags=["demo", "basic"]`
  - **含义**：为部署添加标签
  - **作用**：用于分类、过滤和组织部署
  - 用途
    - 在 UI 中根据标签筛选部署
    - Agent 可以配置为只处理特定标签的任务
    - 便于大型项目中的部署管理

代码中的 `basic_deployment.apply()` 将这些配置提交到 Prefect 服务器，使其成为一个可执行的部署。之后：

- 如果设置了调度，Prefect 调度器会按计划触发执行
- 可以通过 CLI 手动触发：`prefect deployment run "基础数据处理流程/基础流程-每小时"`
- 监听 `demo-queue` 的 Agent 将拉取并执行这些流程

---

```bash
# 创建部署
python -m deployments.deploy_flow
```









```bash
# 查看已创建的部署
prefect deployment ls
```





```bash
# 手动触发部署
prefect deployment run "基础数据处理流程/基础流程-每小时"
```





**在Prefect UI中管理部署**:

1. 访问"Deployments"选项卡
2. 可以:
   - 查看所有部署
   - 手动触发流程运行
   - 编辑部署设置
   - 修改参数值
   - 查看运行历史





---

### Work Queue & Agent

Work Queue和Agent紧密相关，一起工作：

- Work Queue是任务分配的队列
- Agent是监听队列并执行任务的进程

```bash
# 查看现有工作队列
prefect work-queue ls

# 创建工作队列
prefect work-queue create demo-queue --tag demo

# 启动一个工作队列agent
prefect worker start -q demo-queue
```



---

### Work Pool

Work Pool 是 Prefect 3.x 中引入的关键概念，用于定义和管理 Flow 的执行环境。

在运行 `flow.deploy` 操作前需要先创建 Work Pool

Work Pool 是一个执行环境的抽象，它定义了：

- **在哪里**执行你的流程（本地、容器、云环境等）
- **如何**执行你的流程（资源分配、环境配置等）
- **何时**处理特定工作（优先级、并发限制等）

Prefect 3.x 支持多种类型的 Work Pool，每种适用于不同场景，主要有：

| Work Pool 类型 |             说明             |             适用场景             |
| :------------: | :--------------------------: | :------------------------------: |
|  **Process**   |  在本地机器的进程中执行流程  |  开发环境、简单部署、单机工作流  |
|   **Docker**   |   在 Docker 容器中执行流程   |  隔离环境、依赖管理、可复制执行  |
| **Kubernetes** | 在 Kubernetes 集群中执行流程 | 企业级部署、大规模计算、资源弹性 |

在 Prefect Server UI 上可以创建 Work Pool：

![image-20250429165730082](http://cdn.ayusummer233.top/DailyNotes/202504291657262.png)

选择 Work Pool 类型：

![image-20250429165804777](http://cdn.ayusummer233.top/DailyNotes/202504291658891.png)

输入 Work Pool 基本信息：

![image-20250429165856972](http://cdn.ayusummer233.top/DailyNotes/202504291658051.png)

> `Name` 这里就是程序中传入 `flow.deploy` 的 `work_pool_name` 需要对应的名称

配置 Work Pool 的默认配置（可选）：

![image-20250429165953099](http://cdn.ayusummer233.top/DailyNotes/202504291659206.png)

创建成功：

![image-20250429170440242](http://cdn.ayusummer233.top/DailyNotes/202504291704386.png)





---

### Block

Block 可以理解为可以在 Prefect Server 上配置和管理的配置项，目前来看我认为最重要的是对于密钥这类配置项可以不用手动在每个终端都配置了，直接在 Prefect Server 上配置后程序直接连接 Server 读取即可

例如这个 Secret Block：

![image-20250429154823478](http://cdn.ayusummer233.top/DailyNotes/202504291548570.png)

![image-20250429154506705](http://cdn.ayusummer233.top/DailyNotes/202504291545485.png)

Prefect Server UI 上配置完后会显示程序调用方法并掩码展示 Secret

![image-20250429154734198](http://cdn.ayusummer233.top/DailyNotes/202504291547292.png)

