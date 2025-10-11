---
date: 2025-10-09
category: 
  - 网络安全
  - 威胁情报
tags:
  - OTX
  - Python
excerpt: OTX (Open Threat Exchange) 是一个开放威胁情报共享平台
---

# OTX Python SDK

> [OTX Python SDK Github Repo](https://github.com/AlienVault-OTX/OTX-Python-SDK)

![image-20250509135748526](http://cdn.ayusummer233.top/DailyNotes/202505091357837.png)

Open Threat Exchange 是一个开放社区，允许参与者了解最新威胁、研究在其环境中观察到的攻击指标、分享他们已识别的威胁，并使用最新指标自动更新其安全基础设施以保护其环境。

OTX Direct Connect agents 提供了一种方法，可以使用您从 Open Threat Exchange 订阅的脉冲自动更新您的安全基础设施。通过使用 Direct Connect，您可以下载订阅的脉冲中包含的指标，并将其本地化，供其他应用程序（例如入侵检测系统、防火墙和其他以安全为中心的应用程序）使用。

OTX Direct Connect 提供了一种机制，可以将 Open Threat Exchange 门户中的入侵指标 (IoC) 自动提取到您的环境中。DirectConnect API 允许您访问您在 Open Threat Exchange ( [https://otx.alienvault.com](https://otx.alienvault.com/) ) 中订阅的所有 *Pulses* 。

---

## 安装

可以使用 `pip install OTXv2` 安装 OTX Python SDK 或者 Clone [OTX Python SDK Github Repo](https://github.com/AlienVault-OTX/OTX-Python-SDK) 后使用根目录下的 `setup.py` 安装

```bash
poetry add OTXv2 -vvv
```

![image-20250509140817169](http://cdn.ayusummer233.top/DailyNotes/202505091408288.png)

可以使用 [OTX Python SDK Github Repo](https://github.com/AlienVault-OTX/OTX-Python-SDK) 中提供的 Jupyter Notebook 来查看基本用法：

![image-20250509143136599](http://cdn.ayusummer233.top/DailyNotes/202505091431871.png)

不过这个 notebook 最后一次更新已经是 8 年前了，时效性不足

---

## Example

从 OTX 读取内容：

```python
from OTXv2 import OTXv2
from OTXv2 import IndicatorTypes
otx = OTXv2("API_KEY")
# Get all the indicators associated with a pulse
indicators = otx.get_pulse_indicators("pulse_id")
for indicator in indicators:
    print indicator["indicator"] + indicator["type"]
# Get everything OTX knows about google.com
otx.get_indicator_details_full(IndicatorTypes.DOMAIN, "google.com")
```

> 从这里可以看到这是 Python2 的写法，这个仓库最后一次更新是 4 年前了，时效性也不是很够，不过姑且也可以用来看看有什么用

![image-20250509144115933](http://cdn.ayusummer233.top/DailyNotes/202505091441012.png)

![image-20250509144125694](http://cdn.ayusummer233.top/DailyNotes/202505091441788.png)



---

















