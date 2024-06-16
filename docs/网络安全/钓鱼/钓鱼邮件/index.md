# 钓鱼邮件

## 伪造伪造发件人

> [什么是电子邮件假冒？| Cloudflare | Cloudflare (cloudflare-cn.com)](https://www.cloudflare-cn.com/learning/email-security/what-is-email-spoofing/)
>
> [邮件伪造原理和实践 - SAUCERMAN (saucer-man.com)](https://saucer-man.com/information_security/452.html#cl-4)
>
> [关于伪造邮件的简单研究 (ti0s.com)](https://www.ti0s.com/39.html)

以 Postfix + Gophish 为例

在 `Users & Groups` 中设置靶机登录的目标邮箱地址

![image-20240617043652932](http://cdn.ayusummer233.top/DailyNotes/202406170440685.png)

在 `Sending Profiles` 中设置邮件服务器的相关信息

![image-20240617044001139](http://cdn.ayusummer233.top/DailyNotes/202406170440246.png)

> 测试邮件内容如下：
>
> ![image-20240617044039405](http://cdn.ayusummer233.top/DailyNotes/202406170440443.png)

在 `Email Templates` 中可以设置钓鱼邮件模板，在 `Envelope Sender` 那一栏可以伪造发件人昵称与邮箱

![image-20240617044410255](http://cdn.ayusummer233.top/DailyNotes/202406170444353.png)

---

在 `Campaigns` 中配置具体活动

![image-20240617045010643](http://cdn.ayusummer233.top/DailyNotes/202406170450717.png)

点击 `Send Test Email` 可以手动尝试发一封邮件

![image-20240617044902437](http://cdn.ayusummer233.top/DailyNotes/202406170449492.png)

然后在靶机邮箱中可以看到对应邮件

![image-20240617045149858](http://cdn.ayusummer233.top/DailyNotes/202406170451908.png)

可以看到这里拿 Foxmail 打开是看不出来伪造之前的发件人的

查看邮件原始信息可以看到如下信息：

![image-20240617050643574](http://cdn.ayusummer233.top/DailyNotes/202406170506603.png)

---























