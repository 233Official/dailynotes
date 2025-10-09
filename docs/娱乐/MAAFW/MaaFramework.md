---
category: 娱乐
tags:
  - 娱乐
  - MaaFramework
excerpt: MaaFramework 是一个基于图像识别的自动化黑盒测试框架
---

# MaaFramework

---

- [MaaFramework](#maaframework)
  - [Tools](#tools)
    - [调试](#调试)
    - [截图工具](#截图工具)
    - [规范化](#规范化)
      - [oxipng](#oxipng)
    - [VSCode插件](#vscode插件)
  - [发布](#发布)
  - [模拟器管理工具](#模拟器管理工具)

---

## Tools

### 调试

[MaaXYZ/MaaDebugger](https://github.com/MaaXYZ/MaaDebugger)

```bash
# Python >= 3.9
# 安装
python -m pip install MaaDebugger
# 更新
python -m pip install MaaDebugger MaaFW --upgrade
# 使用
python -m MaaDebugger
# MaaDebugger 默认使用端口 8011。你可以通过使用 --port [port] 选项来指定 MaaDebugger 运行的端口。例如，要在端口 8080 上运行 MaaDebugger
python -m MaaDebugger --port 8080
# 开发 MaaDebugger
cd src
python -m MaaDebugger
## 或者使用 VSCode，在项目目录中按下 F5
```

---

### 截图工具

```powershell
# 截图工具
cd E:\Repo\Entertainment\Maa\MaaFramework\tools\ImageCropper
.venv/Scripts/activate
python .\main.py
```

---

### 规范化

#### oxipng

oxipng 是一个基于 Rust 的图片优化工具, 需要先在本地安装 Rust 环境, 不然 Precommit Check 会报错不通过, 导致无法 commit

[Install Rust - Rust Programming Language](https://www.rust-lang.org/tools/install)

```bash
# 先确认 Rust 是否安装
rustc --version

# 如果安装了 Rust，尝试手动安装 oxipng
cargo install oxipng
```

---

### VSCode插件

![image-20251009111433142](http://cdn.ayusummer233.top/DailyNotes/202510091114199.png)

------

## 发布

```bash
# CI 检测到 tag 会自动进行发版
git tag v1.0.0
git push origin v1.0.0
```

---

## 模拟器管理工具

模拟器一般会给个工具来管理自己家的模拟器, 例如: [MuMuManager命令行开发者使用说明](https://mumu.163.com/help/20240726/35047_1170006.html)

