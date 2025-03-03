---
date: 2024-05-29
---

# CobaltStrike

## 校验

> [verify.cobaltstrike.com](https://verify.cobaltstrike.com/)

---

## 问题处理

### library initialization failed - unable to allocate file descriptor table - out of memory

> [Recent trouble launching on Debian; resolved : r/slaythespire (reddit.com)](https://www.reddit.com/r/slaythespire/comments/1dgtkif/recent_trouble_launching_on_debian_resolved/?rdt=52135)

最近 CS 启 teamserver 遇到了这个问题:

![image-20241017163038348](http://cdn.ayusummer233.top/DailyNotes/202410171630607.png)

直接搜索描述基本上都说是文件描述符限制, 尝试了很多类似的方法都没有成功

![image-20241017163123274](http://cdn.ayusummer233.top/DailyNotes/202410171631342.png)

最后在 [Recent trouble launching on Debian; resolved : r/slaythespire (reddit.com)](https://www.reddit.com/r/slaythespire/comments/1dgtkif/recent_trouble_launching_on_debian_resolved/?rdt=52135) 注意到有可能是 jdk 版本的问题, 换了个版本就能成功启动了

![image-20241017163416006](http://cdn.ayusummer233.top/DailyNotes/202410171634072.png)

---

















