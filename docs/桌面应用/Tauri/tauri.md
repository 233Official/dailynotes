---
date: 2025-10-09

---

# Tauri

> [Tauri 2.0](https://v2.tauri.app/)

---

## Tools

### Tuari 图标生成器

[DailyNotesCode/tauri_icon_generate.py](https://github.com/233Official/DailyNotesCode/blob/main/Python/use_case/picture/to_ico/tauri_icon_generate.py)

---

Tauri 新建项目自动生成的图标如下：

![image-20250226161908605](http://cdn.ayusummer233.top/DailyNotes/202502261619671.png)

---

使用上述 python 程序传入一张需要作为图标的图像可以便捷地生成一组简易图标:

![image-20250226161709189](http://cdn.ayusummer233.top/DailyNotes/202502261617433.png)

![image-20250226161800418](http://cdn.ayusummer233.top/DailyNotes/202502261618468.png)

---

## 踩坑收集

### 不要在浏览器中调试 Tauri 应用

虽然在开发阶段使用 `pnpm tauri dev` 可以看到有类似 `http://localhost:1420/`, 的 url，但是 Tauri 应用并不能在浏览器中进行调试

Tauri 的 API（特别是 invoke 函数）只能在 Tauri 桌面应用环境中运行，而不能在普通浏览器环境中使用。

当使用 `pnpm tauri dev` 运行时，Tauri 会启动一个桌面应用程序，其中包含一个特殊的 WebView 环境，该环境具有 JavaScript 到 Rust 的桥接功能。

而在普通浏览器中，没有这个桥接层，所以 `@tauri-apps/api` 中的 invoke 函数不存在，导致错误。

![image-20250226162216774](http://cdn.ayusummer233.top/DailyNotes/202502261622901.png)

---

相应的可以在Tauri应用中使用开发者工具进行调试

- **Windows/Linux**: `F12` 或 `Ctrl+Shift+I`
- **macOS**: `Command+Option+I`

在运行应用时按下这些快捷键即可打开开发者工具。

---

