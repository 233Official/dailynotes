# SpringMVC内存马

## 环境配置

```bash
mvn archetype:generate -DgroupId=com.summery233 -DartifactId=spring-webmvc-memshell -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false
```

- `mvn archetype:generate`：使用 Maven 的原型插件生成一个项目。
- `-DgroupId=com.summery233`：指定项目的组 ID，一般是公司或组织的域名倒写。
- `-DartifactId=spring-webmvc-memshell`：指定项目的工件 ID，即项目名称。
- `-DarchetypeArtifactId=maven-archetype-webapp`：指定要使用的原型，这里是一个 Web 应用程序的原型。
- `-DinteractiveMode=false`：禁用交互模式，所有参数都通过命令行指定，不需要用户输入。