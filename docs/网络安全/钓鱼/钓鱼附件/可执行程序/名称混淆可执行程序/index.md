# 名称混淆可执行程序

## RLO

> [特洛伊代码 - YYGQ site (srayu.ws)](https://yygq.srayu.ws/post/trojansource/)

RLO(Right-to-Left Override）是一种用于改变文本显示方向的特殊控制字符

在Unicode标准中，RLO的字符代码是U+202E。其主要作用是将后续文本的显示方向从默认的左到右（LTR）改为从右到左（RTL）

RLO可以用于例如阿拉伯语和希伯来语等本身是从右到左书写的语言的显示

这个显示效果会一直持续到接下来的一个换行符（或者是一些其他更复杂的规则，譬如 [U+202C PDF](https://codepoints.net/U+202C)）

![image-20240605113053649](http://cdn.ayusummer233.top/DailyNotes/202406051131187.png)

例如要把上面这个 `msedge.exe` 显示上看起来像是个 PDF 文件, 可以先改成 `msedgefdp.exe`

![image-20240605113402020](http://cdn.ayusummer233.top/DailyNotes/202406051134342.png)

然后在 `f` 前插入 `RLO`

![image-20240605113525917](http://cdn.ayusummer233.top/DailyNotes/202406051135781.png)

![image-20240605113547878](http://cdn.ayusummer233.top/DailyNotes/202406051348121.png)

---

可以写个程序批量给 exe 加 RLO 和文档后缀

> 伪装程序图标可以参阅[安装打包程序](../安装打包程序/利用Winrar捆绑恶意程序与合法程序.md)那节的内容, 这里没做批量构造

```Python
# 为指定文件批量生成用 RLO +  PDF,DOC,PPT,XLS 等伪造的文件
from pathlib import Path

def add_rlo_suffix(file_path:Path, new_extension_list:list[str])->None:
    """
    Add an RLO character to the file name to spoof its extension.

    :param file_path: 原始文件路径
    :param new_extension_list: 新扩展名列表
    """
    # RLO字符
    rlo_char = '\u202E'

    base_dir, filename = file_path.parent, file_path.name
    filename, current_extension = filename.rsplit('.', 1)
    base_dir = base_dir / filename
    base_dir.mkdir(parents=True, exist_ok=True)

    for new_extension in new_extension_list:
        # 生成新的文件名
        spoofed_file_path = base_dir / f"{filename}{rlo_char}{new_extension[::-1]}.{current_extension}"

        # 保存文件到新的路径
        spoofed_file_path.write_bytes(file_path.read_bytes())
    

original_file = "msedge.exe"
original_file_path = Path(__file__).parent / original_file
new_extension_list = ["pdf", "doc","docx", "ppt", "pptx","xls", "xlsx", "txt"]
spoofed_file = add_rlo_suffix(original_file_path, new_extension_list)
```

![image-20240605145917917](http://cdn.ayusummer233.top/DailyNotes/202406051459543.png)

![image-20240605145950809](http://cdn.ayusummer233.top/DailyNotes/202406051500950.png)

![image-20240605150024678](http://cdn.ayusummer233.top/DailyNotes/202406051500178.png)

---

## 扩展名伪装

Windows 文件资源管理器默认不会显示后缀名, 因此在文件名末尾, 扩展名之前添加文档扩展名也是一种常用的伪装钓鱼附件程序的方案

稍微改一下上面的RLO生成程序来批量构造扩展名伪装文件:

```python
# 为指定文件批量生成用 RLO +  PDF,DOC,PPT,XLS 伪造的文件
from pathlib import Path

def add_fake_suffix(file_path:Path, new_extension_list:list[str])->None:
    """
    :param file_path: 原始文件路径
    :param new_extension_list: 新扩展名列表
    """

    base_dir, filename = file_path.parent, file_path.name
    filename, current_extension = filename.rsplit('.', 1)
    base_dir = base_dir / f"{filename}_fake_extension"
    base_dir.mkdir(parents=True, exist_ok=True)

    for new_extension in new_extension_list:
        # 生成新的文件名
        spoofed_file_path = base_dir / f"{filename}.{new_extension}.{current_extension}"

        # 保存文件到新的路径
        spoofed_file_path.write_bytes(file_path.read_bytes())
    

# Example usage
original_file = "msedge.exe"
original_file_path = Path(__file__).parent / original_file
new_extension_list = ["pdf", "doc","docx", "ppt", "pptx","xls", "xlsx", "txt"]
spoofed_file = add_fake_suffix(original_file_path, new_extension_list)
```

![image-20240605152002116](http://cdn.ayusummer233.top/DailyNotes/202406061634777.png)

![image-20240605152015909](http://cdn.ayusummer233.top/DailyNotes/202406061634712.png)

![image-20240605151503937](http://cdn.ayusummer233.top/DailyNotes/202406061634262.png)













---

