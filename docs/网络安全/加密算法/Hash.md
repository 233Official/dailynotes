---
category:
  - 网络安全
  - 加密算法
tags:
  - 网络安全
  - 加密算法
  - Hash
excerpt: Hash 算法的常用命令与用法，涵盖 SHA256、MD5 等哈希计算工具与示例。
---

# Hash

> [加密算法比较：SHA1，SHA256，MD5\_风神修罗使的博客-CSDN博客\_md5 sha1 sha256区别](https://blog.csdn.net/WuLex/article/details/81477097)
>
> [SHA-1 vs SHA-256 - pengyingh - 博客园 (cnblogs.com)](https://www.cnblogs.com/pengyingh/articles/2499181.html)
>
> [Securing your webhooks - GitHub Docs](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks)

---

## 常用命令

```powershell
# Get-FileHash -Path [FilePath] -Algorithm [Algorithm]
Get-FileHash -Algorithm SHA256 -Path test
Get-FileHash -Algorithm MD5 -Path test
```

![image-20230910211506449](http://cdn.ayusummer233.top/DailyNotes/202309102115479.png)

---
