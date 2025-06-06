---

---

# kali

- [kali](#kali)
  - [版本](#版本)
  - [换源](#换源)
  - [远程桌面连接](#远程桌面连接)
- [报错收集](#报错收集)
  - [GPG error: The following signatures were invalid: KEYEXPIRED](#gpg-error-the-following-signatures-were-invalid-keyexpired)

----

## 版本

kali 是基于 Debian 构建的, Debian 有多个版本, 包括稳定版（Stable）、测试版（Testing）和不稳定版（Unstable）。每个版本都有一个代号, 通常以玩具总动员（Toy Story）电影中的角色命名
- Debian 12, 代号 "Bookworm"
- Debian 11, 代号 "Bullseye"

- Debian 10, 代号 "Buster"

- Debian 9, 代号 "Stretch"

- Debian 8, 代号 "Jessie"

- Debian 7, 代号 "Wheezy"


可以通过 `cat /etc/debian_version ` 查看当前 kali 基于的 Debian 版本

不过z和不一定能获得具体的 Debian 版本号, 也可能得到 `kali-rolling` 

![image-20240418142949196](http://cdn.ayusummer233.top/DailyNotes/image-20240418142949196.png)

Kali Rolling 是基于 Debian 的 Testing 分支，而不是 Debian 的稳定版。Debian 的 Testing 分支是用于开发和测试即将发布为稳定版的新功能和软件包的地方。因此，虽然 Kali Rolling 会包含许多最新的软件包，但这些软件包可能还在测试中，可能不如 Debian 稳定版稳定。

一般可以认为 kali rolling 基于 Debian 的最新版本, 比如当前的  Debian12 bookworm

----

## 换源

打开 `/etc/apt/sources.list` 注释掉原来的源并添加新的源, 格式如下

```list
deb [源] kali-rolling main non-free contrib
deb-src [源] kali-rolling main non-free contrib
```

例如:

```list
# 华为
deb https://repo.huaweicloud.com/kali/ kali-rolling main non-free contrib
deb-src https://repo.huaweicloud.com/kali/ kali-rolling main non-free contrib
```

目前可用的源如下:

```list
https://www.kali.org/get-kali/
https://mirrors.aliyun.com/kali/
https://mirrors.cloud.tencent.com/kali/
https://repo.huaweicloud.com/kali/
https://mirrors.tuna.tsinghua.edu.cn/kali/
https://mirrors.ustc.edu.cn/kali/
http://mirrors.zju.edu.cn/kali/
https://mirror.nyist.edu.cn/kali/
http://mirrors.neusoft.edu.cn/kali/
http://mirrors.njupt.edu.cn/kali/
https://mirrors.nwsuaf.edu.cn/kali/
https://mirrors.cqu.edu.cn/kali-images/
https://mirrors.bfsu.edu.cn/kali/
https://mirrors.hit.edu.cn/kali
https://mirrors.sjtug.sjtu.edu.cn/kali/
```

可以将这些源写入到一个 `txt` 文件, 然后使用下面的程序进行自动排序输出

```python
# 读取 kali 源列表每一行的地址, 将每个地址拆分为 [协议, 域名, 路径], 然后对每个域名 ping 4次, 按照响应时间递增排序, 输出到目的文件
import os
import re


def ping_linux(host: str, count: int = 4) -> float:
    """Linux 下的 ping 命令  
    :param host: 域名
    :param count: ping 的次数
    :return: 返回平均响应时长
    """
    output = os.popen(f'ping {host} -c {count}').read()
    try:
        min, avg, max, mdev = re.findall(r'rtt min/avg/max/mdev = (\d+\.\d+)/(\d+\.\d+)/(\d+\.\d+)/(\d+\.\d+) ms', output)[0]
        print(f'{host} {avg}ms')
    # 全丢包的情况下就找不到了, 此时返回一个很大的数
    except IndexError:
        print(f'{host} 超时')
        return 999999
    return float(avg)


def split_url_to_hosts(source_path: str) -> list:
    """将源列表每个条目拆分成 [协议, 域名, 路径] 的格式并返回所有条目拆分完后的嵌套列表  
    :param source_path: 源文件
    :return: 拆分后的嵌套列表
    """
    with open(source_path, 'r') as f:
        hosts = f.read().splitlines()
        for i in range(len(hosts)):
            hosts[i] = hosts[i].strip()
            # 根据 :// 进行拆分, 拆分结果作为继续拆分 协议, 域名, 路径 的依据
            main_split = hosts[i].split('://')

            # 第一片为 协议://
            first_fragment = main_split[0] + '://'
            # 第二片为 域名
            second_fragment = main_split[1].split('/')[0]
            # 第三片为 路径
            third_fragment = '/' + '/'.join(main_split[1].split('/')[1:])

            # 将拆分后的三片组合成一个列表
            hosts[i] = [first_fragment, second_fragment, third_fragment]
        # 返回拆分后的嵌套列表
        return hosts


def sort_write_hosts(hosts: list, target_path: str) -> None:
    """根据对源文件拆分后的嵌套列表中的域名进行 ping 操作, 并将结果按响应时间升序输出到目的文件  
    :param hosts: 源文件拆分后的嵌套列表  
    :param target_path: 目标输出文件路径
    :return: None
    """
    # 遍历 hosts 中的每个域名, 并对其进行 ping 操作, 将平均响应时间插入到 hosts 尾部
    for i in range(len(hosts)):
        hosts[i].append(ping_linux(hosts[i][1]))
    # 按照响应时间升序排序
    hosts.sort(key=lambda x: x[3])
    # 将排序后的 hosts 写入到目的文件
    with open(target_path, 'w') as f:
        for host in hosts:
            f.write(f'{host[0]}{host[1]}{host[2]} {host[3]}ms \n')


def sort_sources(source_path: str, target_path: str) -> None:
    """对源文件(kali 镜像列表)进行排序, 并按照响应时间升序输出到目的文件  
    :param source_path: kali 镜像列表文件路径  
    :param target_path: 按照相应时间升序输出的目的文件路径
    """
    print("开始拆分源文件...")
    # 将源文件拆分为嵌套列表
    hosts = split_url_to_hosts(source_path)
    print("拆分完成, 开始排序...")
    # 对拆分后的嵌套列表进行排序并输出到目的文件
    sort_write_hosts(hosts, target_path)    
    print("排序完成, 请查看目的文件")


if __name__ == '__main__':
    source_path = os.path.join(os.path.dirname(__file__), 'sources_kali.txt')
    target_path = os.path.join(os.path.dirname(__file__), 'result_kali.txt')
    sort_sources(source_path, target_path)
```

> ![image-20220908164224429](http://cdn.ayusummer233.top/img/202209081643208.png)
>
> ![image-20220908164325366](http://cdn.ayusummer233.top/img/202209081643429.png)

---

## 远程桌面连接

> [如何使用远程桌面连接(RDP)至Kali/Ubuntu图形化桌面？ - 掘金 (juejin.cn)](https://juejin.cn/post/7090421599781781512)

```bash
apt-get install kali-desktop-xfce
apt-get install xorg
apt-get install xfce4
apt-get install xrdp
```

```bash
sed -i 's/port=3389/port=3399/g' /etc/xrdp/xrdp.ini
echo xfce4-session >~/.xsession
service xrdp restart
```

```bash
# 以 1920*1080 的分辨率连接到本地远程桌面(使用Mobaxterm自带的xserver)
rdesktop 127.0.0.1:3399 -g 1920x1080
```

![image-20230306173257148](http://cdn.ayusummer233.top/DailyNotes/202303061735760.png)

![image-20230306173612503](http://cdn.ayusummer233.top/DailyNotes/202303061736408.png)

![image-20230306174040608](http://cdn.ayusummer233.top/DailyNotes/202303061740221.png)

---

# 报错收集

## GPG error: The following signatures were invalid: KEYEXPIRED

> [apt - "GPG error:The following signatures were invalid: KEYEXPIRED" - Ask Ubuntu](https://askubuntu.com/questions/650032/gpg-errorthe-following-signatures-were-invalid-keyexpired)
>
> [在Ubuntu实例中使用apt-get update命令时提示“The following signatures were invalid: KEYEXPIRED 1544811256” (aliyun.com)](https://help.aliyun.com/document_detail/149961.html)
>
> [apt/apt-get：The following signatures were invalid: KEYEXPIRED_heituan的技术博客_51CTO博客](https://blog.51cto.com/hackedu/3403797)

---



