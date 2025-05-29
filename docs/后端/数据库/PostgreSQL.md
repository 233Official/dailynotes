---
category: 后端
tags:
  - 数据库
  - PostgreSQL
excerpt: PostgreSQL 是一个开源的关系型数据库管理系统（RDBMS），功能强大、稳定可靠，被广泛应用于Web开发、数据分析、GIS、金融、电商等各种场景。
---

# PostgreSQL

- [PostgreSQL](#postgresql)
  - [安装](#安装)
  - [设置远程访问](#设置远程访问)
  - [基础操作](#基础操作)
  - [sqlalchemy操作](#sqlalchemy操作)
  - [数据库同步](#数据库同步)
    - [逻辑复制](#逻辑复制)

---

## 安装

:::tabs

@tab:active  Ubuntu

```bash
# 更新软件包列表
sudo apt update
# 安装PostgreSQL
sudo apt install postgresql postgresql-contrib
# 安装完成后，PostgreSQL 服务将自动启动。你可以通过以下命令检查它是否正在运行
sudo systemctl status postgresql
# 安装完成后，默认情况下会创建一个名为postgres的系统用户，该用户拥有对PostgreSQL服务器的超级用户权限。你可以切换到该用户并使用以下命令进入PostgreSQL命令行界面,可以通过 \q 回车退出
sudo -i -u postgres
psql
```

- `postgresql-contrib` 是 PostgreSQL 数据库的一个附加包，包含了一些附加功能和扩展模块，可以增强 PostgreSQL 的功能。这些功能可能包括各种数据类型、函数、插件等，可以用于处理更复杂的数据库需求或提供额外的功能。

![image-20240408164820725](http://cdn.ayusummer233.top/DailyNotes/202404081648820.png)

---

@tab macOS

可以直接使用 [postgresapp官网](https://postgresapp.com/downloads.html) 提供的 macOS 安装包进行安装

打开后左下角新建新的 Server 可以指定 Data Directory，可以指定到外接硬盘上

![image-20250522145812210](http://cdn.ayusummer233.top/DailyNotes/202505221458053.png)

![image-20250522145953466](http://cdn.ayusummer233.top/DailyNotes/202505221459599.png)

然后点击 `Initialize` 初始化：

![image-20250522150013065](http://cdn.ayusummer233.top/DailyNotes/202505221500162.png)

![image-20250522150021912](http://cdn.ayusummer233.top/DailyNotes/202505221500970.png)

安装完成后默认配置如下：

|      Host      |       localhost        |
| :------------: | :--------------------: |
|      Port      |          5432          |
|      User      | your system user name  |
|    Database    |      same as user      |
|    Password    |          none          |
| Connection URL | postgresql://localhost |

---

添加命令行工具到 PATH 方便在 zsh 中使用：

编辑 `~/.zshrc`

```bash
PostgreSQLPath="/Applications/Postgres.app/Contents/Versions/latest/bin"
export PATH=$PATH:$PostgreSQLPath
```

![image-20250522150936023](http://cdn.ayusummer233.top/DailyNotes/202505221509107.png)

查看效果：

```bash
source ～/.zshrc
which psql
psql --version
```

![image-20250522151038948](http://cdn.ayusummer233.top/DailyNotes/202505221510038.png)

---

官网推荐 UI 操作工具

- [postico](https://apps.apple.com/us/app/postico-2/id6446933691?mt=12)
- [pgadmin](https://www.pgadmin.org/)

---

@tab WIndows

在 [PostgreSQL: Windows installers](https://www.postgresql.org/download/windows/) 下载安装包

![image-20250523073450134](http://cdn.ayusummer233.top/DailyNotes/202505230735147.png)

![image-20250523073536166](http://cdn.ayusummer233.top/DailyNotes/202505230735294.png)

运行安装程序进行安装

![image-20250523073907756](http://cdn.ayusummer233.top/DailyNotes/202505230739803.png)

选择安装目录:

![image-20250523074038536](http://cdn.ayusummer233.top/DailyNotes/202505230740574.png)

选择安装组件:

![image-20250523074111219](http://cdn.ayusummer233.top/DailyNotes/202505230741259.png)

- **PostgreSQL Server**: PostgreSQL 数据库的核心组件。它包含了实际的数据库服务器软件，负责存储数据、处理查询请求以及管理数据库的运行。没有这个组件，你就无法创建和使用 PostgreSQL 数据库。

- **pgAdmin 4**: 图形化的 PostgreSQL 管理和开发平台。它提供了一个用户友好的界面，用于连接数据库服务器、执行 SQL 查询、管理数据库对象（如表、视图、用户等）、监控服务器状态以及进行其他管理任务。类似于 Navicat、DBeaver，但它是 PostgreSQL 官方推荐的

- **Stack Builder**: 这是一个可选的工具，用于在 PostgreSQL 安装完成后下载和安装额外的驱动程序、工具和应用程序。例如，你可以用它来安装 PostGIS（地理空间数据扩展）、特定的数据库连接器（如 ODBC 或 JDBC 驱动）或其他有用的 PostgreSQL 相关软件。

- **Command Line Tools**: 这包含了 PostgreSQL 的命令行工具集，其中最常用的是 `psql`。`psql` 是一个交互式的 PostgreSQL 终端，允许你通过命令行连接到数据库、执行 SQL 命令、管理数据库等。

  |     命令     |             用途说明              |
  | :----------: | :-------------------------------: |
  |    `psql`    | PostgreSQL 的命令行客户端，最常用 |
  |  `createdb`  |            创建数据库             |
  |   `dropdb`   |            删除数据库             |
  |  `pg_dump`   |            备份数据库             |
  | `pg_restore` |          恢复数据库备份           |
  |   `pg_ctl`   |  控制 PostgreSQL 服务启动/停止等  |

选择数据目录这里最好还是单独设置,默认会放在系统盘下面:

![image-20250523074245792](http://cdn.ayusummer233.top/DailyNotes/202505230742830.png)

设置 postgres 用户密码:

![image-20250523074323910](http://cdn.ayusummer233.top/DailyNotes/202505230743951.png)

PostgreSQL 监听端口:

![image-20250523074456908](http://cdn.ayusummer233.top/DailyNotes/202505230744950.png)

语言这里不太清楚具体指什么,先保持默认了:

![image-20250523074538224](http://cdn.ayusummer233.top/DailyNotes/202505230745260.png)

安装概述:

![image-20250523074727197](http://cdn.ayusummer233.top/DailyNotes/202505230747237.png)

安装确认:

![image-20250523074752737](http://cdn.ayusummer233.top/DailyNotes/202505230747778.png)

进行安装:

![image-20250523074814767](http://cdn.ayusummer233.top/DailyNotes/202505230748812.png)

安装完成确认:

![image-20250523075208616](http://cdn.ayusummer233.top/DailyNotes/202505230752669.png)

可选项(Stack Builder):

![image-20250523075249747](http://cdn.ayusummer233.top/DailyNotes/202505230752789.png)

看了下没设么特别需要装的, 略过了:

![image-20250523075326457](http://cdn.ayusummer233.top/DailyNotes/202505230753503.png)

|                   类别名称                   |       中文解释       |      适合人群      |                             说明                             |
| :------------------------------------------: | :------------------: | :----------------: | :----------------------------------------------------------: |
|       **Add-ons, tools and utilities**       |  附加组件、实用工具  |  高级用户 / 运维   | 包括性能监控工具、日志分析器、管理脚本等。常见的如：`pgBouncer`（连接池）、`pgAgent`（任务调度器）。 |
|             **Database Drivers**             |      数据库驱动      |       开发者       | 如果你用 Java、ODBC、.NET 等语言访问 PostgreSQL，可以在这里安装对应驱动（如 JDBC、ODBC）。 |
|             **Database Server**              |     数据库服务器     |    特殊部署场景    | 用于安装其他版本或多实例 PostgreSQL，有时也包括一些兼容组件。 |
| **Registration-required and trial products** | 需要注册或试用的产品 |      企业用户      | 这里包括一些商业插件或试用版工具，如备份工具、可视化 BI 工具等。多数不是免费开源的。 |
|            **Spatial Extensions**            |   空间扩展（GIS）    | 地理信息系统开发者 | 例如安装 **PostGIS** —— 这是 PostgreSQL 最有名的插件之一，用于存储和查询地理空间数据（地图、地块等）。 |
|             **Web Development**              |     Web开发插件      |     Web 开发者     | 提供如 Apache/PHP/PostgreSQL 一体化环境等组件，帮助你构建 Web 服务环境。 |

---

PostgreSQL 安装完成后会在 `services.msc` 中看到服务:

![image-20250523075755511](http://cdn.ayusummer233.top/DailyNotes/202505230757559.png)

可以打开 pgAdmin 看看

![image-20250523075925256](http://cdn.ayusummer233.top/DailyNotes/202505230759325.png)

![image-20250523080044921](http://cdn.ayusummer233.top/DailyNotes/202505230800991.png)

接下来需要添加 PostgreSQL 命令行工具目录到系统PATH以便后续在命令行中使用psql等命令:

![image-20250523080404090](http://cdn.ayusummer233.top/DailyNotes/202505230804156.png)

![image-20250523080525552](http://cdn.ayusummer233.top/DailyNotes/202505230805610.png)

重启命令行后可以看到 psql 已经可用了:

![image-20250523080555068](http://cdn.ayusummer233.top/DailyNotes/202505230805112.png)

:::

----

## 设置远程访问

在PostgreSQL服务器上，打开配置文件`postgresql.conf`，通常于`/etc/postgresql/{version}/main/postgresql.conf`

```bash
find /etc | grep postgresql.conf
```



![image-20240408165346376](http://cdn.ayusummer233.top/DailyNotes/202404081653095.png)

![image-20240408165614574](http://cdn.ayusummer233.top/DailyNotes/202404081656674.png)

可以使用 `*` 来匹配所有的 IP, 亦可以指定监听的网卡 IP (本机网卡IP)列表, 例如:

```properties
listen_addresses = 'localhost,192.168.1.100'
```

然后编辑同级目录下的 `pg_hba.conf` 来设置允许连接到此数据库的 IP 段

![image-20240408171001717](http://cdn.ayusummer233.top/DailyNotes/202404081710795.png)

例如

```properties
# IPv4 local connections:
host    all             all             192.168.1.0/24            scram-sha-256
host    all             all             10.0.0.0/24               scram-sha-256
```

查看当前的用户列表:

```bash
sudo -u postgres psql
\du
```

![image-20240408171416256](http://cdn.ayusummer233.top/DailyNotes/202404081714323.png)

可以使用如下命令修改 `postgres` 用户的密码为 `new_password`

```postgresql
ALTER USER postgres PASSWORD 'new_password';
```

![image-20240408171721932](http://cdn.ayusummer233.top/DailyNotes/202404081717005.png)

完成上述配置后重启 Postgres

```bash
sudo systemctl restart postgresql
```

之后就可以正常通过配置的 `listen_address` 以及 Postgres 端口通过允许连接的 host IP 段的主机连接到 Postgres 数据库了

> 不需要考虑 md5 或是  scram-sha-256 的密码加密方案, 在使用数据库管理工具连接 Postgres 的时候会自动协商

![image-20240408174158805](http://cdn.ayusummer233.top/DailyNotes/202404081741964.png)

![image-20240408174213587](http://cdn.ayusummer233.top/DailyNotes/202404081742654.png)

---

## 基础操作

```postgresql
-- 创建数据库 mydatabase
CREATE DATABASE mydatabase;
--- 将 mydatabase 修改为 samplea
ALTER DATABASE mydatabase RENAME TO sample;
```

-----

## sqlalchemy操作

除了需要安装 SQLAlchemy 外还需要安装 psycopg2 库(PostgreSQL 数据库适配器), 它允许 Python 应用程序与 PostgreSQL 数据库进行交互

在安装 psycopg2 库前需要先安装 PostgreSQL 客户端库:

```bash
sudo apt install libpq-dev
```

然后再安装  psycopg2 

```bash
pip install psycopg2
```

---

## 数据库同步

- **流复制（Streaming Replication）**：配置 PostgreSQL 流复制，将源数据库设置为主服务器（Primary），目标数据库设置为从服务器（Standby），然后使用流复制将数据同步到目标数据库。这种方法可以保持数据的实时同步，并且不会产生不必要的网络流量。
- **逻辑复制（Logical Replication）**：逻辑复制允许你只复制感兴趣的表或数据，而不是整个数据库。你可以设置逻辑复制订阅，并选择要复制的表，以减少不必要的数据传输。

---

### 逻辑复制

在 Postgre 中, 要使用逻辑复制, 需要确保 `wal_level` 至少为 `logical`, 这样 PostgreSQL 才能生成逻辑复制所需的 WAL 日志

> WAL 日志(Write-Ahead Logging)是数据库系统中的一种技术, 用于确保数据持久性和事务的原子性
>
> WAL 日志记录了数据库中发生的所有变更操作, 例如插入, 更新和删除操作, 以及相关的事务信息

修改 `postgresql.conf` 中的 `wal_level` 设置为 `logical` 即可:

![image-20240409155715278](http://cdn.ayusummer233.top/DailyNotes/202404091557518.png)

```bash
# 重启 PostgreSQL
sudo systemctl restart postgresql
```

主数据库创建逻辑复制源:

```postgresql
-- 连接到目标数据库
\c my_database
-- 创建逻辑订阅
CREATE PUBLICATION my_pub FOR TABLE my_table;
```

在从数据库中设置逻辑复制订阅

```postgresql
-- 创建逻辑复制订阅
CREATE SUBSCRIPTION my_sub CONNECTION 'dbname=my_db host=xx.xx.xx.xx port=5432 user=postgres password=xxx' PUBLICATION my_pub;
-- 启用订阅
ALTER SUBSCRIPTION my_sub ENABLE;
-- 关闭订阅
ALTER SUBSCRIPTION my_sub DISABLE;
```

---

























