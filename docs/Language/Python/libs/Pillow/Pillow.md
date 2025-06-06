---

---

# 目录
- [目录](#目录)
- [Pillow](#pillow)
  - [Image](#image)
    - [convert(mode)](#convertmode)
    - [new(mode, size, color=0)](#newmode-size-color0)
  - [ImageDraw](#imagedraw)

----
# Pillow

---
## Image

---
### convert(mode)
- [[Python] - 图像处理 ------ img.convert()@Exler_yz](https://blog.csdn.net/qq_32808045/article/details/108855380)

    ---
-  是图像实例对象的一个方法，接受一个 mode 参数，用以指定一种色彩模式
- `mode`
  - 1: 1位像素，黑白，每字节一个像素存储
  - L: 8位像素，黑白
  - P: 8位像素，使用调色板映射到任何其他模式
  - RGB: 3x8位像素，真彩色
  - RGBA: 4x8位像素，带透明度掩模的真彩色
  - CMYK: 4x8位像素，分色
  - YCbCr: 3x8位像素，彩色视频格式
  - I: 32位有符号整数像素
  - F: 32位浮点像素

----
### new(mode, size, color=0)
```doc
(function) new: (mode: str, size: _Size, color: str | Tuple[int, ...] | None = ...) -> Image
Creates a new image with the given mode and size.

:param mode: The mode to use for the new image.
:param size: A 2-tuple, containing (width, height) in pixels.
:param color: What color to use for the image. Default is black.
   If given, this should be a single integer or floating point value for single-band modes, and a tuple for multi-band modes (one value per band). When creating RGB images, you can also use color strings as supported by the ImageColor module. If the color is None, the image is not initialised.
:returns: An ~PIL.Image.Image object.
```
- color 是填充颜色

----
## ImageDraw
- 支持 2D 图像, 且与 Image 对象的区别在于 ImageDraw 对象支持绘制

