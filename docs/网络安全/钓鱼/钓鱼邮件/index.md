---

---

# 钓鱼邮件

## 伪造伪造发件人

> [什么是电子邮件假冒？| Cloudflare | Cloudflare (cloudflare-cn.com)](https://www.cloudflare-cn.com/learning/email-security/what-is-email-spoofing/)
>
> [邮件伪造原理和实践 - SAUCERMAN (saucer-man.com)](https://saucer-man.com/information_security/452.html#cl-4)
>
> [关于伪造邮件的简单研究 (ti0s.com)](https://www.ti0s.com/39.html)

在[电子邮件](https://www.cloudflare-cn.com/learning/email-security/what-is-email/)假冒中，攻击者使用一个电子邮件头掩盖自己的身份，冒充成一个合法的发件人。（电子邮件头是一个代码片段，其中包含有关邮件的重要细节，如发件人、收件人和跟踪数据。）

攻击者使用脚本伪造电子邮件收件人可以看到的字段。这些字段位于电子邮件头中，包括“发件人”和“回复”地址。如下例子显示了这些字段在一封假冒电子邮件中的样子：

- **From:** “Legitimate Sender” email@legitimatecompany.com
- **Reply-to:** email@legitimatecompany.com

之所以能够伪造这些字段，原因是[简单邮件传输协议（SMTP）](https://www.cloudflare-cn.com/learning/email-security/what-is-smtp/)没有内建验证电子邮件地址的机制。事实上，发件人和收件人的电子邮件存在于电子邮件的两个位置：邮件头和 SMTP 信封。电子邮件头包括收件人可见的字段。然而，SMTP 信封包含用于邮件服务器用于将电子邮件发送到正确地址的信息。但这些字段不必一致，电子邮件也能成功发送。因为 SMTP 信封从不检查邮件头，而且收件人不能看到信封中的信息，因此电子邮件假冒相对容易实现。

---

电子邮件收件人可按照如下步骤来防范电子邮件假冒：

- **要警惕那些鼓励迅速或紧急采取行动的信息：** 对于任何要求提供个人信息、付款或其他即时行动的意外或自发的电子邮件，收件人应持怀疑态度。例如，如果突然出现要求更改某个应用程序登录信息的要求，就应该表示怀疑。
- **检查电子邮件头：**很多电子邮件客户端提供查看电子邮件头的方法。例如， <a href='https://it.umn.edu/services-technologies/how-tos/gmail-view-email-headers' 'target=_blank'>在 Gmail 中，在一封电子邮件中点击“显示原始邮件”，即可查看其电子邮件头的内容。查看邮件头时，寻找“Received”部分。如果域名不同于“发件人”地址中显示的域名，则该电子邮件很可能是伪造的。
- **使用软件来过滤假冒邮件：**反垃圾邮件软件可要求对传入的电子邮件进行身份验证，从而阻止假冒企图。

域名所有者也可采取措施来防止攻击者从其域发送消息。为此，组织可创建专用于身份验证的[域名系统（DNS）](https://www.cloudflare-cn.com/learning/dns/what-is-dns/)记录。其中包括：

- **[SPF 记录](https://www.cloudflare-cn.com/learning/dns/dns-records/dns-spf-record/)：** 发件人策略框架（SPF）记录列出被授权从特定域发送电子邮件的服务器。这样，如果有人编造了一个与某个域相关联的电子邮件地址，这个地址不会出现在 SPF 记录中，也不会通过认证。
- **[DKIM 记录](https://www.cloudflare-cn.com/learning/dns/dns-records/dns-dkim-record/)：** 域名密匙确认邮件（DKIM） 记录使用一对密钥进行身份验证：一个公钥和一个私钥。公钥存储于 DKIM 记录中，私钥对 DKIM 头进行数字签名。如果假冒电子邮件来自一个具有 DKIM 记录的域，无法使用正确的密钥签名，因而无法通过验证。
- **[DMARC 记录](https://www.cloudflare-cn.com/learning/dns/dns-records/dns-dmarc-record/)：** 基于域名的消息认证报告与一致性（DMARC）记录包含 DMARC 策略，在检查 SPF 和 DKIM 记录后，告诉邮件服务器如何处理。域名所有者可以根据这些检查设置规则，决定是否阻止、允许或传递消息。由于 DMARC 策略会审查其他身份验证策略，并允许域所有者设置更具体的规则，因此这些记录为防止电子邮件假冒增加了另一层保护。

在组织层面，安全主管也可以采取措施，通过实施网络钓鱼和[恶意软件](https://www.cloudflare-cn.com/learning/ddos/glossary/malware/)保护，防止员工受到电子邮件假冒侵害。

---

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

## 相关链接

- [钓鱼邮件的投递和伪造 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/6325?time__1311=n4%2BxnD0DRDBDclCKDsAoxCqxmwuMDIOq0Iqx&alichlgref=https%3A%2F%2Fgithub.com%2Ftib36%2FPhishingBook%3Ftab%3Dreadme-ov-file)

---

























