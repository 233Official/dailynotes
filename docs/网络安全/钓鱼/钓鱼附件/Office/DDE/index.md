# DDE

> [鱼叉钓鱼：利用 Office 文档进行 DDE 攻击-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1816083)

DDE (Dynamic Data Exchange) 是一种用于在Windows应用程序之间交换数据的协议

攻击者可以利用 DDE 通过自定义字段插入到Word或Excel文档中，用于执行恶意代

---

当用户打开包含DDE字段的文档时，Office应用程序会显示两个警告：

1. **第一个警告**：告知文档包含指向其他文件的链接。
2. **第二个警告**：告知将打开远程命令提示符。

如果用户忽略警告并允许操作，恶意命令将被执行，导致系统被攻击

---

> 在 Office365 和 Office 2013 的 Word 上都没复现出来,都只有如下第一条警告, 然后就没有动静了
>
> ![image-20240517153248330](http://cdn.ayusummer233.top/DailyNotes/202405171532647.png)

---

## 参考链接

> [下面链接的OneTab合集](https://www.one-tab.com/page/m1oUCGvRSVywUorY3lTPvA)
>
> 基本描述都一样, 都无法成功复现
>
> ----
>
> [鱼叉钓鱼：利用 Office 文档进行 DDE 攻击-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1816083)
>
> [钓鱼攻击：Office DDE 漏洞复现笔记 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/32103256)
>
> [干货 | Office文档钓鱼的实战和免杀技巧-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1917641)
>
> [鱼叉钓鱼：利用 Office 文档进行 DDE 攻击_dde攻击-CSDN博客](https://blog.csdn.net/weixin_45575473/article/details/115894657)
>
> [wps和office宏钓鱼从认识到免杀 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/network/317116.html)
>
> [谨防钓鱼——OFFICE DDE复现-CSDN博客](https://blog.csdn.net/tempulcc/article/details/108471488)
>
> [钓鱼攻击：Office DDE 漏洞复现笔记 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/32103256)



