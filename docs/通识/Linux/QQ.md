---
category:
  - 通识
  - Linux
tags:
  - 通识
  - Linux
  - QQ
  - xrdp
  - Openbox
excerpt: 在无 GUI 的 Ubuntu 服务器上，通过 Openbox、xrdp 和 SSH 隧道运行官方 Linux QQ 的部署、排障与资源占用记录。
---

# 在无 GUI 的 Ubuntu 服务器上运行官方 Linux QQ

- [在无 GUI 的 Ubuntu 服务器上运行官方 Linux QQ](#在无-gui-的-ubuntu-服务器上运行官方-linux-qq)
  - [适用场景与结论](#适用场景与结论)
  - [验证服务器的图形环境](#验证服务器的图形环境)
  - [安装官方 Linux QQ](#安装官方-linux-qq)
  - [部署轻量图形环境](#部署轻量图形环境)
  - [通过 SSH 隧道连接 xrdp](#通过-ssh-隧道连接-xrdp)
  - [启动与保持 QQ 会话](#启动与保持-qq-会话)
  - [常见问题](#常见问题)
    - [QQ 缺少 libasound.so.2](#qq-缺少-libasoundso2)
    - [Openbox 菜单中的终端没有反应](#openbox-菜单中的终端没有反应)
    - [中文粘贴后显示方框或空白](#中文粘贴后显示方框或空白)
    - [图片剪贴板无法粘贴](#图片剪贴板无法粘贴)
  - [资源占用实测](#资源占用实测)
  - [安全与维护注意事项](#安全与维护注意事项)

---

## 适用场景与结论

本文记录于 2026 年 7 月，实测环境为 Ubuntu 24.04（Noble）服务器和官方 Linux QQ `3.2.31`。

官方 Linux QQ 是基于 Electron 的桌面 GUI 应用，不提供官方命令行聊天模式。无 X11、Wayland 或桌面环境的服务器即使成功安装 `.deb`，也不能直接通过普通 SSH 终端使用。

如果只是希望在服务器上登录并保持官方 QQ 在线，可以使用以下轻量组合：

- Openbox：轻量窗口管理器。
- tint2：任务栏和系统托盘。
- xrdp + xorgxrdp：提供 RDP 图形会话。
- xfce4-terminal：提供支持常规复制粘贴快捷键的终端。
- SSH 本地端口转发：避免将 RDP 的 `3389` 端口暴露到公网。

这套方案比完整 XFCE 桌面更节省内存，但缺少桌面图标、完整设置中心、文件管理器和完善的应用菜单。对于只需要启动、登录和保持 QQ 在线的场景已经足够。

---

## 验证服务器的图形环境

检查 QQ、显示环境和系统默认启动目标：

```bash
command -v qq
echo "$DISPLAY"
systemctl get-default
```

进一步检查显示管理器和桌面会话：

```bash
systemctl is-active display-manager
ls /usr/share/xsessions/
```

需要注意：

- `graphical.target` 只是默认启动目标，不代表已经安装或运行桌面环境。
- SSH 会话中的 `$DISPLAY` 为空，表示当前终端没有可用的图形显示。
- `display-manager` 为 `inactive` 且 `/usr/share/xsessions/` 不存在时，通常可以确认服务器没有现成桌面环境。

---

## 安装官方 Linux QQ

从 [QQ Linux 官方页面](https://im.qq.com/index/#/linux) 下载对应架构的 `.deb` 后安装：

```bash
apt install ./QQ_3.2.31_260710_amd64_01.deb
```

检查安装结果：

```bash
command -v qq
readlink -f /usr/bin/qq
```

通常可执行入口为 `/usr/bin/qq`，实际程序位于 `/opt/QQ/qq`。

QQ 应当使用普通用户运行，不要长期使用 `root` 或依赖 `--no-sandbox` 启动。

---

## 部署轻量图形环境

安装 Openbox、任务栏、xrdp 和必要的 Xorg 组件：

```bash
apt update
apt install -y --no-install-recommends \
  openbox tint2 xterm dbus-x11 xrdp xorgxrdp

adduser xrdp ssl-cert
```

为普通用户配置 Openbox 和 tint2。以下示例用户为 `ubuntu`：

```bash
sudo -u ubuntu mkdir -p /home/ubuntu/.config/openbox

sudo -u ubuntu sh -c \
  'printf "tint2 &\n" > /home/ubuntu/.config/openbox/autostart'

sudo -u ubuntu sh -c \
  'printf "exec dbus-run-session openbox-session\n" > /home/ubuntu/.xsession'
```

启动 xrdp：

```bash
systemctl enable --now xrdp
systemctl is-active xrdp
```

为 RDP 登录用户设置密码：

```bash
passwd ubuntu
```

连接 xrdp 登录界面后，`Session` 选择 `Xorg`。`Xvnc`、`vnc-any` 和 `neutrinordp-any` 需要额外配置其他服务，本方案不使用。

---

## 通过 SSH 隧道连接 xrdp

不建议在腾讯云安全组中将 TCP `3389` 对 `0.0.0.0/0` 开放。可以在本地电脑建立 SSH 隧道：

```bash
ssh -N -L 13389:127.0.0.1:3389 ubuntu@服务器公网IP
```

保持该 SSH 命令运行，然后在 Jump Desktop 或 Windows App 中创建 RDP 连接：

```text
地址：127.0.0.1
端口：13389
用户名：ubuntu
密码：为 ubuntu 设置的密码
```

数据流如下：

```text
RDP 客户端
  -> 本地 127.0.0.1:13389
  -> SSH 加密隧道
  -> 服务器 127.0.0.1:3389
  -> xrdp
```

这样腾讯云安全组只需要开放 SSH 端口。若必须直接连接 `服务器公网IP:3389`，安全组来源应限制为可信固定公网 IP `/32`。

---

## 启动与保持 QQ 会话

进入 Openbox 后，可以右键打开终端并执行：

```bash
qq
```

确认 QQ 可以正常启动后，可使用脱离终端的方式运行，避免关闭终端时影响 QQ：

```bash
nohup qq >/dev/null 2>&1 </dev/null &
disown
```

登录后直接断开 RDP 即可。不要在 Openbox 右键菜单中选择 `Exit`，否则会结束图形会话。RDP 断开后可以关闭本地 SSH 隧道，服务器上的 QQ 通常仍会继续运行。

检查 QQ 和 xrdp 通道进程：

```bash
pgrep -a -u ubuntu qq
pgrep -a -u ubuntu xrdp-chansrv
```

Electron 会为 QQ 创建多个 zygote、network、audio 等子进程，因此看到多个 `/opt/QQ/qq` 或 `/proc/self/exe` 进程不一定代表重复启动。

---

## 常见问题

### QQ 缺少 libasound.so.2

如果运行 `qq` 后立即退出，并提示：

```text
error while loading shared libraries: libasound.so.2: cannot open shared object file
```

Ubuntu 24.04 中的 `libasound2` 是虚拟包，应安装 `libasound2t64`：

```bash
apt install -y libasound2t64
```

确认动态库已经注册：

```bash
ldconfig -p | grep libasound.so.2
```

预期能够看到类似结果：

```text
libasound.so.2 (libc6,x86-64) => /lib/x86_64-linux-gnu/libasound.so.2
```

如果后续仍有其他动态库缺失，可以检查：

```bash
ldd "$(readlink -f /usr/bin/qq)" | grep "not found"
```

---

### Openbox 菜单中的终端没有反应

先确认程序存在并找到 xrdp 的显示编号：

```bash
command -v x-terminal-emulator
command -v xterm
pgrep -a Xorg
```

xrdp 的 Xorg 进程通常包含 `:10`：

```text
/usr/lib/xorg/Xorg :10 -auth .Xauthority ...
```

可以从 SSH 向该图形会话直接启动终端：

```bash
sudo -u ubuntu env \
  DISPLAY=:10 \
  XAUTHORITY=/home/ubuntu/.Xauthority \
  xterm >/tmp/xterm-start.log 2>&1 &
```

如果实际显示编号为 `:11` 等其他值，需要同步修改 `DISPLAY`。

xterm 的复制粘贴快捷键与普通桌面终端不同。为了获得 `Ctrl + Shift + C` 和 `Ctrl + Shift + V`，可以安装：

```bash
apt install -y --no-install-recommends xfce4-terminal
```

在图形会话中启动：

```bash
xfce4-terminal
```

从普通 SSH 终端直接执行 `xfce4-terminal` 会因为没有 `$DISPLAY` 而提示 `cannot open display`，这是预期行为。

---

### 中文粘贴后显示方框或空白

如果英文剪贴板正常，但中文在终端显示为方框、在 QQ 中显示为空白，先检查：

```bash
locale charmap
```

输出 `UTF-8` 时，问题通常不是剪贴板编码，而是精简服务器没有安装中文字形。

安装 Noto CJK 字体：

```bash
apt install -y fonts-noto-cjk
fc-cache -f
```

确认中文字体匹配：

```bash
fc-match ':lang=zh-cn'
```

预期结果类似：

```text
NotoSansCJK-Regular.ttc: "Noto Sans CJK SC" "Regular"
```

关闭并重新启动终端和 QQ 后，中文显示与中文剪贴板即可恢复。安装字体只会明显增加磁盘占用，不会带来显著常驻内存开销。

---

### 图片剪贴板无法粘贴

文字剪贴板正常，但从 macOS 复制图片后无法粘贴到远程终端或 QQ，通常是 xrdp 图片剪贴板能力和版本兼容问题，而不是 QQ 本身的问题。

Ubuntu 24.04 默认提供的 xrdp `0.9.24` 存在图片剪贴板回归。xrdp 的传统实现主要通过 Windows `CF_DIB`/bitmap 与 X11 的 `image/bmp` 交互，并不保证传递原始 `image/png`。

可以在复制图片后检查 X11 剪贴板格式：

```bash
xclip -selection clipboard -t TARGETS -o
```

如果存在 `image/bmp`，可以尝试导出：

```bash
xclip -selection clipboard -t image/bmp -o > /tmp/clipboard.bmp
file /tmp/clipboard.bmp
```

更可靠的方式是把图片作为文件传输：

```bash
scp image.png ubuntu@服务器公网IP:/home/ubuntu/Pictures/
```

然后在 QQ 中通过图片按钮选择该文件。也可以使用 RDP 文件夹重定向，映射目录通常位于：

```text
/home/ubuntu/thinclient_drives/
```

xrdp `0.9.26` 或 `0.10.1` 已包含相关修复，但仅为图片粘贴替换服务器的远程桌面组件可能引入断连和兼容风险，一般不值得专门升级。

参考：

- [xrdp issue #3102](https://github.com/neutrinolabs/xrdp/issues/3102)
- [xrdp PR #3120](https://github.com/neutrinolabs/xrdp/pull/3120)

---

## 资源占用实测

一台约 4 GiB 内存的服务器在部署前后两次执行 `free -h`：

| 指标 | 部署运行前 | QQ 和图形组件运行后 | 变化 |
| --- | ---: | ---: | ---: |
| 内存 `used` | 2.0 GiB | 2.2 GiB | 约 +200 MiB |
| 内存 `available` | 1.6 GiB | 1.4 GiB | 约 -200 MiB |
| Swap `used` | 915 MiB | 1.2 GiB | 约 +300 MiB |

由于采样期间 Linux 页缓存和其他服务也可能变化，不能把差值视为精确的进程内存。按物理内存和 Swap 的变化估计，Linux QQ 与轻量图形环境带来的综合内存压力约为 `400–600 MiB`。

磁盘占用实测及安装输出：

| 组件 | 占用 |
| --- | ---: |
| `/opt/QQ` | 594 MB |
| `fonts-noto-cjk` | 93.2 MB |
| `xfce4-terminal` 及依赖 | 8.23 MB |
| `libasound2t64` 及依赖 | 2.81 MB |
| Openbox、xrdp、Xorg、tint2 等 | 约 50–150 MB |

完整方案预计新增约 `750–850 MB` 安装空间。此外，下载目录中的 QQ `.deb` 安装包仍会额外占用磁盘，确认安装正常后可以自行删除，不影响已经安装的程序。

查看资源和程序目录：

```bash
free -h
du -sh /opt/QQ
```

当 `available` 长期低于约 `500 MiB`，或 Swap 持续快速增长时，应评估 QQ 是否适合继续与服务器上的其他服务共存。

---

## 安全与维护注意事项

- 不要使用 `root` 长期运行 QQ，也不要把 `--no-sandbox` 作为常规启动方式。
- 不要将 RDP `3389` 端口直接对公网开放；优先使用 SSH 隧道。
- 如果直接开放 RDP，安全组来源至少应限制为可信固定公网 IP `/32`。
- QQ 登录二维码在失效前属于敏感登录凭据，不应公开分享。
- 断开 RDP 不会自动退出图形会话，但 Openbox 的 `Exit` 会结束会话。
- `apt` 提示存在 automatically installed and no longer required 的软件包时，不要因为本次部署而直接执行 `apt autoremove`；应先确认这些包是否仍被其他工作流使用。
- 官方 Linux QQ 并不是专门为云服务器无人值守挂机设计的，云服务器 IP 登录可能触发扫码确认、验证码或风控。

---

