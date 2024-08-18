# Shell

- [Shell](#shell)
  - [时间](#时间)
    - [Shell显示时间](#shell显示时间)
    - [修改时间](#修改时间)
  - [主题](#主题)
    - [OhMyZSH](#ohmyzsh)
      - [OhMyZSH 主题推荐](#ohmyzsh-主题推荐)
    - [OhMyPosh](#ohmyposh)
  - [运算符](#运算符)
    - [管道运算符 `|`](#管道运算符-)
    - [单引号, 双引号与反引号](#单引号-双引号与反引号)

---

- **Shell** 是一个命令行界面，用户可以通过它与操作系统进行交互。Shell 既是一个命令解释器，也是一种脚本语言。在类 Unix 系统(如 Linux、macOS) 中，Shell 是用户与操作系统核心进行交互的主要方式。

  - **sh(Bourne Shell) **：

    **sh** 是最早的 Unix shell，由 Stephen Bourne 在贝尔实验室开发。作为最初的 Unix shell，它为后来的许多 shell，包括 bash 和 zsh，奠定了基础。

  - **bash(Bourne Again Shell) **：

    **bash** 是 sh 的一个改进版本，由 GNU 项目开发。它是 Bourne Shell 的自由软件替代品，加入了更多的功能和用户友好的特性。bash 遵循 POSIX 标准，与原始的 Bourne Shell 兼容，同时加入了一些额外的特性(如命令历史和命令行编辑) 。

  - **zsh(Z Shell) **：

    **zsh** 是另一个流行的 Unix shell，它兼容 bash，但引入了许多新功能和改进，如更好的脚本语言功能和用户界面改进。zsh 的一些特性特别注重交互性和易用性，比如更强大的自动补全和主题支持

- `.sh` 文件扩展名通常用于指代 shell 脚本，而不特指用 Bourne Shell (`sh`) 编写的脚本。

---

## 时间

### Shell显示时间

:::tabs

@tab:active bash

```bash
PS1="[\d  \t] \u@\h: "
# 要永久生效请编辑如下文件
~/.bashrc

# 如果要保留 python 的虚拟环境提示符，可以这样写
PS1="\$(if [ -n \"\${VIRTUAL_ENV}\" ]; then echo \"(\${VIRTUAL_ENV##*/})\"; fi) [\d  \t] \u@\h: "
```
- `\d`: 显示当前日期(格式为 `Weekday Month Date`，如 `Mon Dec 11`) 
- `\t`: 显示当前时间(24小时制，包括小时、分钟和秒) 
- `\u@\h`: 显示当前用户名和主机名
- 

![image-20231211105830736](http://cdn.ayusummer233.top/DailyNotes/202312111059839.png)

@tab zsh

```bash
PROMPT='[%*] %n@%m: %~%# '
# 要显示日期:
PROMPT='[%D{%Y-%m-%d} %*] %n@%m: %~%# '
# 要永久生效请编辑如下文件
~/.zshrc

# 如果要保留 python 的虚拟环境提示符，可以这样写
PROMPT='$(if [ -n "${VIRTUAL_ENV}" ]; then echo "(${VIRTUAL_ENV##*/})"; fi) [%D{%Y-%m-%d} %*] %n@%m: %~%# '
```
- `%*`: 显示当前时间(24小时制，包括小时、分钟和秒) 
- `%n@%m: %~%#`: 显示当前用户名、主机名、当前目录和提示符

```bash
# 或者使用如下这种写法以支持显示python虚拟环境
set_prompt() {
    # 保存原始的 PS1，以便在虚拟环境中使用
    export ORIG_PS1="$PS1"

    # 设置自定义提示符
    export PROMPT="[%D{%Y-%m-%d} %*] %n@%m: %~ %# "

    # 如果 Python 虚拟环境被激活，则添加它的提示符
    if [[ -n "$VIRTUAL_ENV" ]]; then
        export PROMPT="(`basename \"$VIRTUAL_ENV\"`) $PROMPT"
    fi
}

# 在每个命令之前执行 set_prompt 函数
autoload -Uz add-zsh-hook
add-zsh-hook precmd set_prompt
```

![image-20231211110828980](http://cdn.ayusummer233.top/DailyNotes/202312111108063.png)

:::

---

### 修改时间







---

## 主题

### OhMyZSH

运行如下命令以安装 ohmyzsh

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

配置 Remote-SSH 连接到的远程 Linux 服务器默认使用 zsh(原本默认是bash),可以在设置中打开远程linux机器的设置文件

![image-20240722193217480](http://cdn.ayusummer233.top/DailyNotes/image-20240722193217480.png)

然后输入如下配置即可

```json
{
    "terminal.integrated.profiles.linux": {
        "zsh": {
            "path": "/bin/zsh",
            "args": []
        }
    },
    "terminal.integrated.defaultProfile.linux": "zsh"
}
```

![image-20240722193301489](http://cdn.ayusummer233.top/DailyNotes/image-20240722193301489.png)

此时重新连接到服务器或者新建终端都会是 zsh 了

---

#### OhMyZSH 主题推荐

- [GitHub - spaceship-prompt/spaceship-prompt: :rocket::star: Minimalistic, powerful and extremely customizable Zsh prompt](https://github.com/spaceship-prompt/spaceship-prompt#-installation)
- [OhMyZsh 主题汇集 - Cloud Notes (lzwang.ltd)](https://notes.lzwang.ltd/Linux/OhMyZsh/omz_themes/#agnosterzak)
- [Themes · ohmyzsh/ohmyzsh Wiki · GitHub](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes)

---

### OhMyPosh

Oh My Posh 在底层使用 ANSI 颜色代码，这些代码应该适用于每个终端，但您可能必须将环境变量 `$TERM` 设置为 `xterm-256color` 才能正常工作。

编辑 `~/.bashrc` 加入如下语句:

```bash
export TERM=xterm-256color
```

然后安装 OhMyPosh

```bash
curl -s https://ohmyposh.dev/install.sh | bash -s
```

![image-20240412112439944](http://cdn.ayusummer233.top/DailyNotes/202404121124083.png)

要显示所有图标，官方建议使用 [Nerd 字体](https://ohmyposh.dev/docs/installation/fonts)

```bash
oh-my-posh font install
```

选择 `Meslo` 并安装

![image-20240412133955849](http://cdn.ayusummer233.top/DailyNotes/202404121339937.png)

---

接下来需要配置使用 OhMyPosh 的 shell

> [Change your prompt | Oh My Posh](https://ohmyposh.dev/docs/installation/prompt)

```bash
# 查看当前使用的是哪个 shell
oh-my-posh get shell
```

![image-20240412113231938](http://cdn.ayusummer233.top/DailyNotes/202404121132054.png)

:::tabs

@tab:active bash

将如下命令下入 `~/.bashrc`

```bash
eval "$(oh-my-posh init bash)"s
```

:::

在 VSCode terminal 中使用 OhMyPosh 需要更改设置中的 `Integrated: Font Family`

![image-20240412143701806](http://cdn.ayusummer233.top/DailyNotes/202404121437899.png)

根据 [Themes | Oh My Posh](https://ohmyposh.dev/docs/themes) 选择一个主题配置上即可

---


## 运算符

### 管道运算符 `|`

```bash
command 1 | command 2
```

把第一个命令 `command 1` 执行的结果作为 `command 2`的输入传给 `command 2`

例如:

```bash
ls -s|sort -nr
```

该命令列出当前目录中的文档(含 size)，并把输出送给 sort 命令作为输入，sort 命令按数字递减的顺序把 ls 的输出排序。

- `-s`: file size
- `-n`: `numeric-sort`
- `-r`: reverse，反转

> ![image-20221122002954641](http://cdn.ayusummer233.top/img/202211220038780.png)

---

### 单引号, 双引号与反引号

> [Shell(Bash) 单引号、双引号和反引号用法详解 (biancheng.net)](http://c.biancheng.net/view/951.html)

单引号和双引号用于变量值出现空格时，比如 `name=zhang san` 这样执行就会出现问题，而必须用引号括起来，比如 `name="zhang san"`。

单引号和双引号的区别在于

- 单引号中的字符仅仅表示它本身，不会被解释，比如 `name='zhang san'`，那么 `echo $name` 就会输出 `zhang san`。
- 双引号中括起来的字符, `$` 和 `\` 以及反引号是拥有特殊意义的

```bash
#定义变量name的值是sc
name=sc
# 如果输出时使用单引号，则$name原封不动地输出
echo '$name'
#如果输出时使用双引号，则会输出变量name的值sc
echo "$name"
# 使用反引号调用 date 函数获取当前时间
echo `date`
# 使用 $() 调用 date 函数获取当前时间
echo $(date)
# 使用单引号括起来的反引号会将反引号中的命令当作字符串输出
echo '`date`'
# 使用双引号括起来的反引号会将反引号中的命令执行后的结果输出
echo "`date`"
# \ 可以用来转义特殊字符, 如在 " 中输出 $, 可以使用 \$
echo "\$ \`"
```

![](http://cdn.ayusummer233.top/DailyNotes/202304171500058.png)

---








