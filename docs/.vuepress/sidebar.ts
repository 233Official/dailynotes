import { sidebar } from "vuepress-theme-hope";

/** 通识-Linux */
let general_linux = [
  {
    text: "Linux",
    link: "/通识/Linux/",
  },
  {
    text: "SSH",
    link: "/通识/Linux/SSH.md",
  },
  {
    text: "Shell",
    link: "/通识/Linux/Shell.md",
  },
  {
    text: "网络配置",
    link: "/通识/Linux/网络配置.md",
  },
  {
    text: "会话管理工具",
    link: "/通识/Linux/会话管理工具.md",
  },
  {
    text: "Linux服务器",
    link: "/通识/Linux/Linux服务器.md",
  },
  {
    text: "Linux软件管理",
    link: "/通识/Linux/Linux软件管理.md",
  },
  {
    text: "WSL2",
    link: "/通识/Linux/WSL/WSL2.md",
  },
];

/** 通识-macOS */
let general_macOS = [
  {
    text: "macOS",
    link: "/通识/macOS/",
  },
  {
    text: "Surge",
    link: "/通识/macOS/Surge.md",
  },
];

/** 日常 */
let dailylife = [
  {
    text: "食谱",
    link: "/DailyLife/食谱/",
  },
  {
    text: "日常",
    link: "/DailyLife/DailyLife.md",
  },
  {
    text: "代理",
    link: "/DailyLife/Proxy.md",
  },
  {
    text: "生活",
    link: "/DailyLife/生活.md",
  },
];

/** 后端-数据库 */
let backend_database = [
  {
    text: "数据库",
    link: "/后端/数据库/数据库.md",
  },
  {
    text: "PostgreSQL",
    link: "/后端/数据库/PostgreSQL.md",
  },
  {
    text: "MySQL",
    link: "/后端/数据库/MySQL.md",
  },
  {
    text: "SQLite",
    link: "/后端/数据库/SQLite.md",
  },
  {
    text: "Redis",
    link: "/后端/数据库/Redis.md",
  },
  {
    text: "SQLAlchemy",
    link: "/后端/数据库/SQLAlchemy.md",
  },
];

/** 后端-FastAPI */
let backend_fastapi = [
  {
    text: "FastAPI",
    link: "/后端/FastAPI/",
  },
  {
    text: "请求模型",
    link: "/后端/FastAPI/请求模型.md",
  },
  {
    text: "响应模型",
    link: "/后端/FastAPI/响应模型.md",
  },
  {
    text: "依赖注入",
    link: "/后端/FastAPI/依赖注入.md",
  },
  {
    text: "JSON兼容",
    link: "/后端/FastAPI/JSON兼容.md",
  },
  {
    text: "OAuth2.0授权模式",
    link: "/后端/FastAPI/OAuth2.0授权模式.md",
  },
  {
    text: "数据库操作",
    link: "/后端/FastAPI/数据库操作.md",
  },
  {
    text: "中间件",
    link: "/后端/FastAPI/中间件.md",
  },
  {
    text: "跨域资源共享",
    link: "/后端/FastAPI/跨域资源共享.md",
  },
  {
    text: "后台任务",
    link: "/后端/FastAPI/后台任务.md",
  },

  {
    text: "Pydantic",
    link: "/后端/FastAPI/Pydantic.md",
  },
  {
    text: "测试用例",
    link: "/后端/FastAPI/测试用例.md",
  },
  {
    text: "高级用户指南",
    link: "/后端/FastAPI/高级用户指南.md",
  },
];

/** 前端-Vue */
let frontend_vue = [
  {
    text: "Vben",
    link: "/前端/VUE/Vben.md",
  },
  {
    text: "vue-admin-template",
    link: "/前端/VUE/vue-admin-template.md",
  },
  {
    text: "Vue",
    children: [
      {
        text: "简介",
        link: "/前端/VUE/Vue3/简介.md",
      },
      {
        text: "安装",
        link: "/前端/VUE/Vue3/安装.md",
      },
      {
        text: "MicrosoftLearn",
        link: "/前端/VUE/Vue3/MicrosoftLearn.md",
      },
      {
        text: "工具",
        link: "/前端/VUE/Vue3/工具.md",
      },
      {
        text: "Vite",
        link: "/前端/VUE/Vue3/Vite.md",
      },
      {
        text: "ESLint",
        link: "/前端/VUE/Vue3/ESLint.md",
      },
      {
        text: "Router",
        link: "/前端/VUE/Vue3/Router.md",
      },
      {
        text: "Vuex",
        link: "/前端/VUE/Vue3/Vuex.md",
      },
      {
        text: "Pinia",
        link: "/前端/VUE/Vue3/Pinia.md",
      },
      {
        text: "Less",
        link: "/前端/VUE/Vue3/Less.md",
      },
      {
        text: "AnimateCSS",
        link: "/前端/VUE/Vue3/AnimateCSS.md",
      },
      {
        text: "GreenSock",
        link: "/前端/VUE/Vue3/GreenSock.md",
      },
      {
        text: "Lodash",
        link: "/前端/VUE/Vue3/Lodash.md",
      },
      {
        text: "VueUse",
        link: "/前端/VUE/Vue3/VueUse.md",
      },
      {
        text: "TSX",
        link: "/前端/VUE/Vue3/TSX.md",
      },
      {
        text: "auto-import",
        link: "/前端/VUE/Vue3/auto-import.md",
      },
      {
        text: "ElementPlus",
        link: "/前端/VUE/Vue3/ElementPlus.md",
      },
      {
        text: "Scoped与样式穿透",
        link: "/前端/VUE/Vue3/Scoped与样式穿透.md",
      },
      {
        text: "自定义全局插件",
        link: "/前端/VUE/Vue3/自定义全局插件.md",
      },
      {
        text: "组件系统",
        link: "/前端/VUE/Vue3/组件系统.md",
      },
      {
        text: "可复用组合",
        link: "/前端/VUE/Vue3/可复用组合.md",
      },
      {
        text: "API",
        link: "/前端/VUE/Vue3/API.md",
      },
    ],
  },
];

/** 笔记工具 */
let NoteTools = [
  {
    text: "VuePress",
    link: "/NoteTools/VuePress.md",
  },
  {
    text: "Markdown",
    link: "/NoteTools/Markdown.md",
  },
  {
    text: "Mermaid",
    link: "/NoteTools/Mermaid.md",
  },
  {
    text: "LaTeX",
    link: "/NoteTools/LaTex/",
  },
  {
    text: "PlantUML",
    link: "/NoteTools/PlantUML.md",
  },
  {
    text: "VitePress",
    link: "/NoteTools/VitePress.md",
  },
];

/** 通识-Docker */
let Docker = [
  {
    text: "Docker",
    link: "/通识/Docker/Docker.md",
  },
  {
    text: "Harbor",
    link: "/通识/Docker/Harbor.md",
  },
];

/** 大模型 */
let big_model = [
  {
    text: "大模型",
    link: "/AI/大模型/大模型.md",
  },
  {
    text: "DeepSeek",
    children: [
      {
        text: "DeepSeek",
        link: "/AI/大模型/DeepSeek/DeepSeek.md",
      },
      {
        text: "本地部署DeepSeek",
        link: "/AI/大模型/DeepSeek/本地部署DeepSeek.md",
      }
    ]
  },
];



/** 网络安全-钓鱼 */
let security_phishing = [
  {
    text: "钓鱼",
    children: [
      {
        text: "钓鱼",
        link: "/网络安全/钓鱼/",
      },
      {
        text: "GoPhish",
        link: "/网络安全/钓鱼/GoPhish/",
      },
      {
        text: "Postfix",
        link: "/网络安全/钓鱼/Postfix/",
      },
      {
        text: "钓鱼附件",
        link: "/网络安全/钓鱼/钓鱼附件/",
      },
    ],
  },
];

/** 网络安全-钓鱼-钓鱼附件 */
let security_phishing_attachments = [
  {
    text: "钓鱼",
    link: "/网络安全/钓鱼/",
  },
  {
    text: "钓鱼附件",
    link: "/网络安全/钓鱼/钓鱼附件/",
  },
  {
    text: "Office",
    link: "/网络安全/钓鱼/钓鱼附件/Office/Office宏/Excel4.0宏.md",
  },
  {
    text: "CHM",
    link: "/网络安全/钓鱼/钓鱼附件/CHM/",
  },
  {
    text: "PDF",
    children: [
      {
        text: "PDF嵌入JavaScript",
        link: "/网络安全/钓鱼/钓鱼附件/PDF/PDF嵌入JavaScript/",
      },
      {
        text: "PDF阅读器漏洞",
        link: "/网络安全/钓鱼/钓鱼附件/PDF/PDF阅读器漏洞/CVE-2024-4367_Arbitrary-JavaScript-execution-in-PDF-js/",
      },
    ],
  },
  {
    text: "LNK伪造",
    link: "/网络安全/钓鱼/钓鱼附件/LNK伪造/",
  },
  {
    text: "可执行程序",
    children: [
      {
        text: "捆绑程序",
        link: "/网络安全/钓鱼/钓鱼附件/可执行程序/捆绑程序.md",
      },
      {
        text: "白加黑",
        link: "/网络安全/钓鱼/钓鱼附件/可执行程序/白加黑.md",
      },
      {
        text: "文件名混淆",
        link: "/网络安全/钓鱼/钓鱼附件/可执行程序/文件名混淆.md",
      },
      {
        text: "NTFS文件流隐藏的可执行文件",
        link: "/网络安全/钓鱼/钓鱼附件/可执行程序/NTFS文件流隐藏的可执行文件.md",
      },
    ],
  },
  {
    text: "漏洞利用",
    children: [
      {
        text: "CVE-2023-38831-Winrar代码执行漏洞",
        link: "/网络安全/钓鱼/钓鱼附件/漏洞利用/CVE-2023-38831-Winrar代码执行漏洞.md",
      },
    ],
  },
];

/** 网络安全-钓鱼-钓鱼附件-Office */
let security_phishing_attachments_Office = [
  {
    text: "钓鱼附件",
    link: "/网络安全/钓鱼/钓鱼附件/",
  },
  {
    text: "Office",
    link: "/网络安全/钓鱼/钓鱼附件/Office/",
  },
  {
    text: "Office宏",
    children: [
      {
        text: "Excel4.0宏",
        link: "/网络安全/钓鱼/钓鱼附件/Office/Office宏/Excel4.0宏.md",
      },
      {
        text: "VBA宏",
        link: "/网络安全/钓鱼/钓鱼附件/Office/Office宏/VBA宏.md",
      },
    ],
  },
  {
    text: "DDE",
    link: "/网络安全/钓鱼/钓鱼附件/Office/DDE/",
  },
  {
    text: "CSV注入",
    link: "/网络安全/钓鱼/钓鱼附件/Office/CSV/",
  },
  {
    text: "VBScript",
    link: "/网络安全/钓鱼/钓鱼附件/Office/VBScript/",
  },
  {
    text: "SLK",
    link: "/网络安全/钓鱼/钓鱼附件/Office/SLK/",
  },
  {
    text: "关系模板注入",
    link: "/网络安全/钓鱼/钓鱼附件/Office/关系模板注入/",
  },
  {
    text: "RTF",
    children: [
      {
        text: "RTF模板注入",
        link: "/网络安全/钓鱼/钓鱼附件/Office/RTF/模板注入/",
      },
      {
        text: "RTF漏洞利用",
        link: "/网络安全/钓鱼/钓鱼附件/Office/RTF/漏洞利用/CVE-2017-8570.md",
      },
    ],
  },
];

/** 端点安全 */
let endpointSecurity = [
  {
    text: "端点安全",
    link: "/网络安全/端点安全/",
  },
  {
    text: "Malware",
    children: [
      {
        text: "Malware",
        link: "/网络安全/端点安全/Malware/",
      },
      {
        text: "从基础的RAT出发梳理一些常见的查杀与免杀技术",
        link: "/网络安全/端点安全/Malware/从基础的RAT出发梳理一些常见的查杀与免杀技术.md",
      },
      {
        text: "查杀技术",
        link: "/网络安全/端点安全/Malware/查杀技术/",
      },
    ],
  },
  {
    text: "Windows",
    children: [
      {
        text: "Windows安全",
        link: "/网络安全/端点安全/Windows/",
      },
      {
        text: "Windows提权",
        link: "/网络安全/端点安全/Windows/提权/本地提权.md",
      },
    ],
  },
  {
    text: "Linux",
    children: [
      {
        text: "Linux安全通识",
        link: "/网络安全/端点安全/Linux/",
      },
      {
        text: "Linux日志分析",
        link: "/网络安全/端点安全/Linux/日志分析/",
      },
    ],
  },
  {
    text: "Docker",
    link: "/网络安全/端点安全/Docker/",
  },
  {
    text: "AtomicRedTeam",
    link: "/网络安全/端点安全/AtomicRedTeam/",
  },
  {
    text: "Vectr",
    link: "/网络安全/端点安全/AtomicRedTeam/Vectr.md",
  },
];

/** 端点安全-Windows- Windows提权 */
let endpointSecurity_windows_privilege_escalation = [
  {
    text: "Windows",
    link: "/网络安全/端点安全/Windows/",
  },
  {
    text: "Windows提权",
    link: "/网络安全/端点安全/Windows/提权/本地提权.md",
  },
  {
    text: "土豆提权",
    link: "/网络安全/端点安全/Windows/提权/土豆提权.md",
  },
];

/** 端点安全-Malware-查杀技术 */
let endpointSecurity_malware_scan = [
  {
    text: "查杀技术",
    link: "/网络安全/端点安全/Malware/查杀技术/",
  },
  {
    text: "AMSI",
    link: "/网络安全/端点安全/Malware/查杀技术/AMSI.md",
  },
];

/** 加密算法侧边栏 */
let security_encrypt = [
  {
    text: "加密算法",
    link: "/网络安全/加密算法/",
  },
  {
    text: "Hash",
    link: "/网络安全/加密算法/Hash.md",
  },
  {
    text: "HMAC",
    link: "/网络安全/加密算法/HMAC.md",
  },
];

/** 内网渗透 */
let penetration = [
  {
    text: "内网渗透",
    link: "/网络安全/内网渗透/",
  },
  {
    text: "代理转发",
    children: [
      {
        text: "代理转发",
        link: "/网络安全/内网渗透/代理转发/",
      },
      {
        text: "SSH隧道",
        link: "/网络安全/内网渗透/代理转发/SSH隧道.md",
      },
      {
        text: "NATBypass",
        link: "/网络安全/内网渗透/代理转发/NATBypass.md",
      },
    ],
  },
  {
    text: "PowershellEmpire",
    link: "/网络安全/内网渗透/C2/Powershell-Empire.md",
  },
  {
    text: "横向移动",
    link: "/网络安全/内网渗透/横向移动/SSH横向移动.md",
  },
];

/** 信息收集 */
let information_collection = [
  {
    text: "端口扫描",
    link: "/网络安全/信息收集/端口扫描/nmap.md",
  },
  {
    text: "漏扫工具",
    link: "/网络安全/信息收集/漏扫工具/AWVS.md",
  },
];

/** 网络安全-ATTCK 侧边栏 */
let security_ATTCK = [
  // {
  //   text: "ATTCK",
  //   link: "/网络安全/ATTCK/",
  // },
  {
    text: "TA0001-InitialAccess",
    link: "/网络安全/ATTCK/TA0001-InitialAccess.md",
  },
  {
    text: "TA0005-DefenseEvasion",
    link: "/网络安全/ATTCK/TA0005-DefenseEvasion(下).md",
  },
  {
    text: "TA0040-Impact",
    link: "/网络安全/ATTCK/TA0040-Impact.md",
  },
];

/** 网络安全-Tools 侧边栏 */
let security_tools = [
  {
    text: "kali",
    link: "/网络安全/Tools/kali.md",
  },
  {
    text: "MSF",
    children: [
      {
        text: "MSF",
        link: "/网络安全/Tools/MSF/",
      },
      // {
      //   text: "MSFConsole",
      //   link: "/网络安全/Tools/MSF/MSFConsole.md",
      // }
    ],
  },
];

/** 网络安全-web安全侧边栏 */
let security_web = [
  {
    text: "web安全",
    link: "/网络安全/Web安全/",
  },
  {
    text: "内存马",
    children: [
      {
        text: "内存马",
        link: "/网络安全/Web安全/漏洞类型/内存马/",
      },
      {
        text: "Java内存马",
        link: "/网络安全/Web安全/漏洞类型/内存马/Java内存马/",
      },
    ],
  },
  {
    text: "漏洞类型",
    children: [
      {
        text: "暴力破解",
        link: "/网络安全/Web安全/漏洞类型/暴力破解/",
      },
      {
        text: "XSS",
        link: "/网络安全/Web安全/漏洞类型/XSS/",
      },
    ],
  },
  {
    text: "Tools",
    children: [
      {
        text: "BurpSuite",
        link: "/网络安全/Web安全/Tools/BurpSuite.md",
      },
      {
        text: "Webshell",
        children: [
          {
            text: "Webshell",
            link: "/网络安全/Web安全/Tools/Webshell/",
          },
          {
            text: "WebShell管理工具",
            link: "/网络安全/Web安全/Tools/Webshell/Webshell管理工具/蚁剑.md",
          },
        ],
      },
    ],
  },
  {
    text: "Web漏洞通用型Python复现脚本编写指南",
    link: "/网络安全/Web安全/Web漏洞通用型Python复现脚本编写指南/",
  },
];

/** Webshell管理工具 */
let webshell_manager = [
  {
    text: "Webshell",
    link: "/网络安全/Web安全/Tools/Webshell/",
  },
  {
    text: "蚁剑",
    link: "/网络安全/Web安全/Tools/Webshell/Webshell管理工具/蚁剑.md",
  },
  {
    text: "冰蝎",
    link: "/网络安全/Web安全/Tools/Webshell/Webshell管理工具/冰蝎.md",
  },
];

/** Java内存马 */
let java_memshell = [
  {
    text: "内存马",
    link: "/网络安全/Web安全/漏洞类型/内存马/",
  },
  {
    text: "Java内存马",
    link: "/网络安全/Web安全/漏洞类型/内存马/Java内存马/",
  },
  {
    text: "Tomcat内存马",
    children: [
      {
        text: "Filter内存马",
        link: "/网络安全/Web安全/漏洞类型/内存马/Java内存马/Tomcat内存马/Filter内存马/servletContext-addFilter.md",
      },
      {
        text: "Servlet内存马",
        link: "/网络安全/Web安全/漏洞类型/内存马/Java内存马/Tomcat内存马/Servlet内存马/servletContext-addServlet.md",
      },
      {
        text: "Listener内存马",
        link: "/网络安全/Web安全/漏洞类型/内存马/Java内存马/Tomcat内存马/Listener内存马/index.md",
      },
      {
        text: "Valve内存马",
        link: "/网络安全/Web安全/漏洞类型/内存马/Java内存马/Tomcat内存马/Valve内存马/",
      },
    ],
  },
  {
    text: "Jetty 内存马",
    link: "/网络安全/Web安全/漏洞类型/内存马/Java内存马/Jetty内存马/",
  },
  {
    text: "Struts2内存马",
    children: [
      {
        text: "Struts2内存马",
        link: "/网络安全/Web安全/漏洞类型/内存马/Java内存马/Struts2内存马/",
      },
      {
        text: "S2-045内存马",
        link: "/网络安全/Web安全/漏洞类型/内存马/Java内存马/Struts2内存马/s2-045内存马.md",
      },
    ],
  },
  {
    text: "SpringMVC内存马",
    children: [
      {
        text: "Controller 内存马",
        link: "/网络安全/Web安全/漏洞类型/内存马/Java内存马/SpringMVC/",
      },
      {
        text: "Interceptor 内存马",
        link: "/网络安全/Web安全/漏洞类型/内存马/Java内存马/SpringMVC/Interceptor/",
      },
    ],
  },
];

/** Go */
let language_go = [
  {
    text: "Go",
    link: "/Language/Go/",
  },
  {
    text: "Go语言圣经学习随笔",
    children: [
      {
        text: "CH1.入门",
        link: "/Language/Go/Go语言圣经/CH1-入门.md",
      },
      {
        text: "CH2.程序结构",
        link: "/Language/Go/Go语言圣经/CH2-程序结构",
      },
      {
        text: "CH3.基础数据类型",
        link: "/Language/Go/Go语言圣经/CH3-基础数据类型",
      },
      {
        text: "CH4.复合数据类型",
        link: "/Language/Go/Go语言圣经/CH4-复合数据类型",
      },
      {
        text: " CH5.函数",
        link: "/Language/Go/Go语言圣经/CH5-函数",
      },
      {
        text: "CH6.方法",
        link: "/Language/Go/Go语言圣经/CH6-方法",
      },
      {
        text: "CH7.接口",
        link: "/Language/Go/Go语言圣经/CH7-接口",
      },
      {
        text: "CH8.Goroutines和Channels",
        link: "/Language/Go/Go语言圣经/CH8-Goroutines和Channels.md",
      },
      {
        text: "CH9.基于共享变量的并发",
        link: "/Language/Go/Go语言圣经/CH9-基于共享变量的并发.md",
      },
      {
        text: "CH10.包和工具",
        link: "/Language/Go/Go语言圣经/CH10-包和工具.md",
      },
      {
        text: "CH11.测试",
        link: "/Language/Go/Go语言圣经/CH11-测试.md",
      },
      {
        text: "CH12.反射",
        link: "/Language/Go/Go语言圣经/CH12-反射.md",
      },
    ],
  },
];

/** language-python */
let language_python = [
  {
    text: "QuickStart",
    link: "/Language/Python/QuickStart.md",
  },
  {
    text: "开发环境",
    link: "/Language/Python/开发环境.md",
  },
  {
    text: "版本管理工具",
    link: "/Language/Python/版本管理工具.md",
  },
  {
    text: "Note-python",
    link: "/Language/Python/Note-python.md",
  },
  {
    text: "PEP8",
    link: "/Language/Python/PEP8.md",
  },
  {
    text: "PythonWeb",
    link: "/Language/Python/PythonWeb.md",
  },
  {
    text: "libs",
    children: [
      {
        text: "asyncio",
        link: "/Language/Python/libs/asyncio/异步编程.md",
      },
      {
        text: "json",
        link: "/Language/Python/libs/json/json.md",
      },
      {
        text: "Matplotlib",
        link: "/Language/Python/libs/Matplotlib/Matplotlib.md",
      },
      {
        text: "numpy",
        link: "/Language/Python/libs/numpy/numpy.md",
      },
      {
        text: "OpenCV-python",
        link: "/Language/Python/libs/OpenCV/OpenCV-python.md",
      },
      {
        text: "Pandas",
        link: "/Language/Python/libs/Pandas/Pandas.md",
      },
      {
        text: "Pillow",
        link: "/Language/Python/libs/Pillow/Pillow.md",
      },
      {
        text: "PyPSRP",
        link: "/Language/Python/libs/PyPSRP/PyPSRP.md",
      },
      {
        text: "TensorFlow",
        link: "/Language/Python/libs/TensorFlow/TensorFlow.md",
      },
      {
        text: "turtle",
        link: "/Language/Python/libs/turtle/turtle.md",
      },
      {
        text: "Rocketry",
        link: "/Language/Python/libs/Rocketry/",
      },
    ],
  },
];

/** language-java */
let language_java = [
  {
    text: "Java",
    link: "/Language/Java/Java.md",
  },
  {
    text: "Java代码审计",
    link: "/Language/Java/Java代码审计.md",
  },
  {
    text: "JavaWeb",
    link: "/Language/Java/JavaWeb.md",
  },
];

/** language_shell */
let language_shell = [
  {
    text: "Shell",
    link: "/Language/Shell/Shell/",
  },
  {
    text: "Powershell",
    link: "/Language/Shell/Powershell/",
  },
  {
    text: "CMD",
    link: "/Language/Shell/CMD/",
  },
];

/** Git */
let Git = [
  {
    text: "Git",
    link: "/Git/",
  },
  {
    text: "Github",
    link: "/Git/Github.md",
  },
  // {
  //   text: "Gitee",
  //   link: "/Git/Gitee.md",
  // },
  {
    text: "Gitlab",
    link: "/Git/Gitlab.md",
  },
];

/** Bot */
let Bot = [
  {
    text: "Bot",
    link: "/娱乐/Bot/",
  },
  {
    text: "频道Bot",
    link: "/娱乐/Bot/频道Bot.md",
  },
  {
    text: "企微Bot",
    link: "/娱乐/Bot/企微Bot.md",
  },
  {
    text: "云崽",
    link: "/娱乐/Bot/云崽.md",
  },
];

/** sovits */
let sovits = [
  {
    text: "sovits_32k",
    link: "/娱乐/sovits/sovits_32k.md",
  },
  {
    text: "sovits_4",
    link: "/娱乐/sovits/sovits_4.md",
  },
];

export const Sidebar = sidebar({
  "/通识/Docker/": Docker,
  "/通识/Linux/": general_linux,
  "/通识/macOS/": general_macOS,

  "/DailyLife/": dailylife,

  "/后端/数据库/": backend_database,
  "/后端/FastAPI/": backend_fastapi,

  "/前端/VUE/": frontend_vue,

  "/NoteTools/": NoteTools,

  "/Language/Python/": language_python,
  "/Language/Java/": language_java,
  "/Language/Shell/": language_shell,
  "/Language/Go/": language_go,

  "/Git/": Git,

  "/娱乐/Bot/": Bot,
  "/娱乐/sovits/": sovits,

  "/AI/大模型/": big_model,

  "/网络安全/加密算法/": security_encrypt,
  "/网络安全/ATTCK/": security_ATTCK,
  "/网络安全/Tools/": security_tools,
  "/网络安全/Web安全/": security_web,
  "/网络安全/Web安全/Tools/Webshell/Webshell管理工具/": webshell_manager,
  "/网络安全/Web安全/漏洞类型/内存马/Java内存马/": java_memshell,
  "/网络安全/端点安全/": endpointSecurity,
  "/网络安全/端点安全/Windows/提权/":
    endpointSecurity_windows_privilege_escalation,
  "/网络安全/内网渗透/": penetration,
  "/网络安全/信息收集/": information_collection,
  "/网络安全/钓鱼/": security_phishing,
  "/网络安全/钓鱼/钓鱼附件": security_phishing_attachments,
  "/网络安全/钓鱼/钓鱼附件/Office": security_phishing_attachments_Office,
});
