# 雷池WAF

> [雷池 WAF 社区版 | 下一代 Web 应用防火墙 | 免费使用 (chaitin.cn)](https://waf-ce.chaitin.cn/)

---

## 安装

>  [手动安装雷池 | 雷池 SafeLine (chaitin.cn)](https://docs.waf-ce.chaitin.cn/zh/上手指南/安装雷池/手动安装)
>
> [Ubuntu | Docker Docs](https://docs.docker.com/engine/install/ubuntu/)

创建雷池目录

```bash
mkdir -p "/data/safeline"
```

- `-p`：如果父目录不存在，则一并创建父目录。

该命令会创建 `/data/safeline` 目录作为雷池的安装目录（你可以根据你的实际情况选择安装目录）请确保该目录至少有 5GB 的存储空间（如果日常流量较大，请保证充足的磁盘容量）

---

使用下方的命令进入雷池安装目录，并下载 docker compose 编排脚本

```bash
cd "/data/safeline"
wget "https://waf-ce.chaitin.cn/release/latest/compose.yaml"
```

![image-20241029155347830](http://cdn.ayusummer233.top/DailyNotes/202410291553072.png)

---

使用下方的命令进入雷池安装目录，并创建 `.env` 配置文件

```bash
cd "/data/safeline"
touch ".env"
```

使用文本编辑器打开 `.env` 文件，写入下方的内容

```properties
SAFELINE_DIR={safeline-dir}
IMAGE_TAG=latest
MGT_PORT=9443
POSTGRES_PASSWORD={postgres-password}
SUBNET_PREFIX=172.22.222
IMAGE_PREFIX=swr.cn-east-3.myhuaweicloud.com/chaitin-safeline
```

- **SAFELINE_DIR**: 雷池安装目录，如 `/data/safeline`
- **IMAGE_TAG**: 要安装的雷池版本，保持默认的 `latest` 即可
- **MGT_PORT**: 雷池控制台的端口，保持默认的 `9443` 即可
- **POSTGRES_PASSWORD**: 雷池所需数据库的初始化密码，请随机生成一个
- **SUBNET_PREFIX**: 雷池内部网络的网段，保持默认的 `172.22.222` 即可
- **IMAGE_PREFIX**: 雷池镜像源的前缀，建议根据服务器地理位置选择合适的源

![image-20241029155746138](http://cdn.ayusummer233.top/DailyNotes/202410291557250.png)

> 根据你的实际情况修改配置文件中的 `{safeline-dir}` 和 `{postgres-password}` 字段
>
> ---
>
> 如果使用的是海外服务器或者使用上述国内镜像无法成功拉取的话建议设置 `IMAGE_PREFIX=chaitin` 直接通过 [docker.io](http://docker.io/) 拉取镜像
>
> ---
>
> REF: [Docker-换源 | DailyNotes (233official.github.io)](https://233official.github.io/dailynotes/通识/Docker/Docker.html#docker-hub-换源)

---

使用以下命令启动雷池服务

```bash
cd "/data/safeline"
docker compose up -d
```

![image-20241029161001310](http://cdn.ayusummer233.top/DailyNotes/202410291610538.png)

![image-20241029161142563](http://cdn.ayusummer233.top/DailyNotes/202410291611605.png)

---

雷池安装成功以后，你可以打开浏览器访问 `https://<safeline-ip>:9443/` 来使用雷池控制台

![image-20241029161627546](http://cdn.ayusummer233.top/DailyNotes/202410291616731.png)

![image-20241029161758473](http://cdn.ayusummer233.top/DailyNotes/202410291617521.png)

第一次登录雷池需要初始化你的管理员账户（默认会执行），如果没有找到账户密码，手动执行以下命令即可

```bash
docker exec safeline-mgt resetadmin
```

命令执行完成后会随机重置 `admin` 账户的密码，输出结果如下

```bash
[SafeLine] Initial username：admin
[SafeLine] Initial password：**********
[SafeLine] Done
```

![image-20241029162259327](http://cdn.ayusummer233.top/DailyNotes/202410291622424.png)

---

## 快速配置

> [快速配置 | 雷池 SafeLine (chaitin.cn)](https://docs.waf-ce.chaitin.cn/上手指南/快速配置)
>
> [技术讨论 | 长亭百川云 (chaitin.cn)](https://rivers.chaitin.cn/discussion)

> 如有疑问，可加入 [雷池微信群](https://docs.waf-ce.chaitin.cn/wechat.png) 与社区用户共同讨论，或在 [百川论坛](https://rivers.chaitin.cn/discussion) 内发帖求助。

---

### 雷池工作原理

#### 反向代理

雷池基于 `Nginx` 进行开发, 作为 `反向代理` 接入网络

如下图所示, 来自互联网的流量可能是正常用户, 也有可能是恶意用户, 雷池通过在 Web 服务和互联网之间设置一道屏障, 将恶意流量进行阻断.

![img](http://cdn.ayusummer233.top/DailyNotes/202410291639343.png)

---

#### 内部逻辑

>  [HTTP 请求在雷池内部流转的过程](https://docs.waf-ce.chaitin.cn/更多技术文档/处理流程)

![img](http://cdn.ayusummer233.top/DailyNotes/202410291641536.png)

---

### 使用雷池防护一个网站

登录雷池控制台后, 进入 `防护站点 - 站点管理` 页面, 点击右上角的 `添加站点` 按钮进行配置.

![img](http://cdn.ayusummer233.top/DailyNotes/202410291642120.gif)

- 域名: 通过雷池访问该站点时使用的域名 (支持使用 `*` 做为通配符)，注意修改 DNS 解析到雷池 IP
- 端口: 雷池监听的端口 (如需配置 HTTPS 服务, 请勾选 SSL 选项并配置对应的 SSL 证书)
- 上游服务器: 被保护的 Web 服务的实际地址

> ![image-20241029165049214](http://cdn.ayusummer233.top/DailyNotes/202410291650385.png)

---

### 测试防护效果

完成以上步骤后你的雷池已经可以正常工作了, 使用刚才配置的域名和端口访问试试.

访问后雷池 `数据统计` 页面的 `请求数` 若有所增加，那恭喜你, 说明你配置的完全正确. *★,°*:.☆(￣▽￣)/$:*.°★* 。

![image-20241029182538273](http://cdn.ayusummer233.top/DailyNotes/202410291825636.png)

更多测试用例请参考 [测试防护效果](https://docs.waf-ce.chaitin.cn/上手指南/测试防护效果)

---

### 使用高级防护功能

除了常见的 `SQL 注入`, `XSS` 等通用 Web 防护能力之外, 雷池还提供了 `人机验证`, `访问频率限制`, `身份认证`, `动态防护` 等高级防护能力.

请参考 [高级防护能力](https://docs.waf-ce.chaitin.cn/上手指南/高级防护能力)

---

### 其他问题

请参考[配置问题](https://docs.waf-ce.chaitin.cn/更多技术文档/配置问题)

---





















