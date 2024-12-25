# ClashVergeRev


- [ClashVergeRev](#clashvergerev)
  - [扩展配置](#扩展配置)
    - [扩展节点](#扩展节点)
    - [扩展代理组](#扩展代理组)
    - [扩展规则](#扩展规则)
  - [全局扩展配置](#全局扩展配置)
  - [TODO](#todo)

---

## 扩展配置

可以在机场订阅的基础上扩展代理配置，例如扩展一组用于链接内网的代理以及配置

或是扩展一组指定场景的代理规则

通常流程是 -> 新建扩展节点 -> 扩展代理组 -> 扩展规则

---

### 扩展节点

![image-20241226011957087](http://cdn.ayusummer233.top/DailyNotes/202412260120133.png)

---

### 扩展代理组

![image-20241226012115709](http://cdn.ayusummer233.top/DailyNotes/202412260121789.png)

---

### 扩展规则

在定义了节点并且在代理组中引入后,  就可以定义规则将指定匹配的请求引入到代理组中走代理组指定的节点了:

![image-20241226012323429](http://cdn.ayusummer233.top/DailyNotes/202412260123478.png)

![image-20241222104051857](http://cdn.ayusummer233.top/DailyNotes/202412221040885.png)

![image-20241222104104361](http://cdn.ayusummer233.top/DailyNotes/202412221041424.png)

可以帮助我们在原有机场订阅规则的前提下扩展我们自己需要的规则

点击右上角的 `高级` 可以看到文件格式的规则扩展

![image-20241222111230281](http://cdn.ayusummer233.top/DailyNotes/202412221112313.png)

![image-20241222111250356](http://cdn.ayusummer233.top/DailyNotes/202412221112387.png)

这样就可以方便的在多个订阅间拷贝扩展规则了

---

## 全局扩展配置

> [扩展配置/脚本 - Clash Verge Rev Docs](https://www.clashverge.dev/guide/extend.html)

> 当前 Verge 版本 v2.0.3-alpha, 全局扩展配置和基本订阅文件配置写法一样, 仅做多个订阅间的配置覆盖使用, 具体扩展配置直接作用于订阅本身即可

当我们有多个机场订阅或是有时候遇到需要重新导入订阅的时候也不是很想将配置都拷贝一遍, 此时可以用全局扩展配置来一次性扩展所有配置

打开全局扩展配置文件进行编辑, 文档可参阅 [扩展配置/脚本 - Clash Verge Rev Docs](https://www.clashverge.dev/guide/extend.html)

----

## TODO

- 目前还没能成功扩展自定义代理节点以及配置, 官方文档太简洁了, 后续有需求再继续寻找

  目前暂时还是用 proxifier

---



