---
date: 2025-10-09

---

# 音视频下载

> [[VilVil] - 您的多平台视频下载助手！/V2EX / 分享创造](https://www.v2ex.com/t/1102705#reply0)
>
> [⏬you-get Dumb downloader that scrapes the web](https://github.com/soimort/you-get?tab=readme-ov-file#supported-sites)

---

## 糖豆视频

> [糖豆-想锻炼 上糖豆](https://m.tangdou.com/)

基本都是广场舞啥的

下载视频需要先定位到视频的 `vid`

![image-20241101001202704](http://cdn.ayusummer233.top/DailyNotes/202411010012978.png)

> 可以尝试使用 [糖豆视频下载器 – 免费下载糖豆视频 - VideoFk](https://www.videofk.com/zh-cn/tangdou-video-download/search?url=https%3A%2F%2Fshare.tangdou.com%2Fh5%2Fplay%3Fvid%3D20000007029626&select=tangdou) 下载, 不过这个广告和跳转挺多的, 理论上这种web直接下载是最方便的, 但是我尚未在此站点成功下载过视频

可以使用  [糖豆视频下载器 – CCBP的小站](https://www.amrzs.net/2022/05/10/tangdou_downloader/) - [Releases · CCBP/TangdouDownloader](https://github.com/CCBP/TangdouDownloader/releases)  进行下载, 命令行中运行程序交互大致如下:

```cmd
===================糖豆视频下载器 By CCBP===================
     使用回车键（Enter）选择默认值，使用Ctrl+C退出程序
视频剪辑的时间输入以" "、"."、":"、"："、","、"，"作为分隔符
============================================================
请输入视频链接或vid编号:https://www.tangdoucdn.com/h5/play?vid=20000002258422&utm_campaign=client_share&utm_source=tangdou_android&utm_medium=wx_chat&utm_type=0&share_uid=#1652176249257
请输入文件储存目录(默认为当前目录):
[308.71 s] Download completed, save to d:\Workspace\Python\tangdou\Download\安徽金社《母亲》网红一夜火爆最新男生版 母亲节献礼附教学.mp4 
剪辑起始时间(默认为不剪辑):2.30
剪辑截止时间:5.0
是否保存剪辑过的视频（y/n）:y
[00:02:30<--->00:05:00]
Moviepy - Building video d:\Workspace\Python\tangdou\Download\安徽金社《母亲》网红一夜火爆最新男生版 母亲节献礼附教学_edited.mp4.
MoviePy - Writing audio in 安徽金社《母亲》网红一夜火爆最新男生版 母亲节献礼附教学_editedTEMP_MPY_wvf_snd.mp3
MoviePy - Done.
Moviepy - Writing video d:\Workspace\Python\tangdou\Download\安徽金社《母亲》网红一夜火爆最新男生版 母亲节献礼附教学_edited.mp4
 
Moviepy - Done !
Moviepy - video ready d:\Workspace\Python\tangdou\Download\安徽金社《母亲》网红一夜火爆最新男生版 母亲节献礼附教学_edited.mp4
是否转换为音频（y/n）:y
MoviePy - Writing audio in d:\Workspace\Python\tangdou\Download\安徽金社《母亲》网红一夜火爆最新男生版 母亲节献礼附教学.mp3
MoviePy - Done.
请输入视频链接或vid编号:https://www.tangdoucdn.com/h5/play?vid=20000002258422&utm_campaign=client_share&utm_source=tangdou_android&utm_medium=wx_chat&utm_type=0&share_uid=#1652176249257
请输入文件储存目录(默认为当前目录):
[11.35 s] Download completed, save to D:\Workspace\Python\tangdou\dist\Download\雨凡《疯疯疯》64步弹跳附分解.mp4
剪辑起始时间(默认为不剪辑):11
剪辑截止时间:3.56
是否保存剪辑过的视频（y/n）:n
是否转换为音频（y/n）:y
MoviePy - Writing audio in D:\Workspace\Python\tangdou\dist\Download\雨凡《疯疯疯》64步弹跳附分解.mp3
MoviePy - Done.
请输入视频链接或vid编号:Traceback (most recent call last):
  File "d:\Workspace\Python\tangdou\main.py", line 144, in <module>
    main()
  File "d:\Workspace\Python\tangdou\main.py", line 62, in main
    url = input('请输入视频链接或vid编号:')
KeyboardInterrupt
```

> 使用此程序我成功下载了目标视频

---

## 微信公众号

- 音视频提取
  - [微信公众号视频提取 - 96微信编辑器](https://bj.96weixin.com/tools/wechat_video)
  - [公众号文章视频提取器 - 山炮工具箱](https://tool.wpjam.com/mp_video)

有的公众号文章里只有一个视频, 提取出来是空页, 此时也可以尝试直接检查网页源代码, 可能视频是外链, 然后直接从外链下载

---

## 百度

百度小视频之类的

参考 [下载百度小视频 - Luckyfish小文 - 博客园](https://www.cnblogs.com/Craft001wen/p/18221639) 直接检查源代码找视频 src 访问下载即可

![image-20241101002515864](http://cdn.ayusummer233.top/DailyNotes/202411010025969.png)

> 或者可以尝试[百度视频 | 不求人去水印](https://parse.bqrdh.com/sites/baidu)

---

## Youtube

- [用Downmp3.yt毫不费力地下载YouTube视频](https://downmp3.yt/zhq9/youtube-video-downloader)
- [YouTube高清视频下载 - 油管(YouTube)视频解析下载保存到手机、电脑](https://tubedown.cn/youtube)
- [YouTube高清视频下载 - 油管(YouTube)视频解析下载保存到手机、电脑](https://youtube.iiilab.com/)

---

