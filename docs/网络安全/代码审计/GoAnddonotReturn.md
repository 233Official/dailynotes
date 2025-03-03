---
date: 2025-01-15
---

# Go and don't return

[skip to content 跳转到内容](https://securitylab.github.com/ctf/go-and-dont-return/answers/#content)

/[Security Lab 安全实验室](https://securitylab.github.com/)

[Research](https://github.blog/tag/github-security-lab/) [Advisories](https://securitylab.github.com/advisories/) [CodeQL Wall of Fame](https://securitylab.github.com/codeql-wall-of-fame/)
研究咨询 CodeQL 名人墙 Resources  资源 [Events 事件](https://securitylab.github.com/events/)

[Get Involved 参与其中](https://securitylab.github.com/get-involved/)

- Resources 资源
- [Open Source Community
  开源社区](https://securitylab.github.com/open-source)
- [Enterprise 企业；事业；公司](https://securitylab.github.com/enterprise)

[
](https://securitylab.github.com/codeql-wall-of-fame/)





CTF: Go and don’t return
CTF：去了就别回来

# Model answers  模型答案

This page includes a reference solution written by CTF reviewers during the contest. There are many correct ways to solve this challenge; this is one approach.
此页面包含了竞赛期间 CTF 评审员编写的参考解决方案。有许多正确的方法可以解决此挑战；这是其中一种方法。

## Part 1 第 1 部分

### Step 1.1 步骤 1.1

```ql
import go

from Ident i
where i.getName() = "ErrNone"
select i
```

### Step 1.2 步骤 1.2

```ql
import go

from EqualityTestExpr e
where e.getAnOperand().(Ident).getName() = "ErrNone"
select e
```

### Step 1.3 步骤 1.3

```ql
import go

from IfStmt s
where s.getCond().(EqualityTestExpr).getAnOperand().(Ident).getName() = "ErrNone"
select s
```

### Step 1.4 步骤 1.4

```ql
import go

from ReturnStmt r
select r
```

### Step 1.5 步骤 1.5

```ql
import go

from IfStmt i
where not i.getThen().getAStmt() instanceof ReturnStmt
select i
```

### Step 1.6 步骤 1.6

```ql
import go

from IfStmt i
where
i.getCond().(EqualityTestExpr).getAnOperand().(Ident).getName() = "ErrNone"
and not i.getThen().getAStmt() instanceof ReturnStmt
select i
```

## Part 2 第二部分

### Step 2.1 步骤 2.1

```ql
import go

class AuthTestConfig extends DataFlow::Configuration {

  AuthTestConfig() { this = "auth-test-config" }

  override predicate isSource(DataFlow::Node source) {
    source = any(DataFlow::CallNode cn |
      cn.getTarget().hasQualifiedName("github.com/minio/minio/cmd", "isReqAuthenticated")
    ).getResult()
  }

  override predicate isSink(DataFlow::Node sink) {
    sink = any(DataFlow::EqualityTestNode n).getAnOperand()
  }

}

from AuthTestConfig config, DataFlow::Node sink, DataFlow::EqualityTestNode comparison
where config.hasFlow(_, sink) and comparison.getAnOperand() = sink
select comparison
```

### Step 2.2 步骤 2.2

```ql
import go

class AuthTestConfig extends DataFlow::Configuration {

  AuthTestConfig() { this = "auth-test-config" }

  override predicate isSource(DataFlow::Node source) {
    source = any(DataFlow::CallNode cn |
      cn.getTarget().hasQualifiedName("github.com/minio/minio/cmd", "isReqAuthenticated")
    ).getResult()
  }

  override predicate isSink(DataFlow::Node sink) {
    sink = any(DataFlow::EqualityTestNode n).getAnOperand()
  }

}

EqualityTestExpr getAnAuthCheck() {
  exists(AuthTestConfig config, DataFlow::Node sink, DataFlow::EqualityTestNode comparison |
    config.hasFlow(_, sink) and comparison.getAnOperand() = sink |
    result = comparison.asExpr()
  )
}

from IfStmt i
where
i.getCond() = getAnAuthCheck() and
i.getCond().(EqualityTestExpr).getAnOperand().(Ident).getName() = "ErrNone"
and not i.getThen().getAStmt() instanceof ReturnStmt
select i
```

## Part 3 第 3 部分

### Step 3.1 步骤 3.1

```ql
import go

class AuthTestConfig extends DataFlow::Configuration {

  AuthTestConfig() { this = "auth-test-config" }

  override predicate isSource(DataFlow::Node source) {
    source = any(DataFlow::CallNode cn |
      cn.getTarget().hasQualifiedName("github.com/minio/minio/cmd", "isReqAuthenticated") or
      // Note new source function:
      cn.getTarget().hasQualifiedName("github.com/github/codeql-ctf-go-return", "errorSource")
    ).getResult()
  }

  override predicate isSink(DataFlow::Node sink) {
    sink = any(DataFlow::EqualityTestNode n).getAnOperand()
  }

}

EqualityTestExpr getADirectAuthCheck(boolean polarity) {
  exists(AuthTestConfig config, DataFlow::Node sink, DataFlow::EqualityTestNode comparison |
    config.hasFlow(_, sink) and comparison.getAnOperand() = sink |
    result = comparison.asExpr() and
    polarity = result.getPolarity()
  )
}

/**
 * Given `ifStmt`'s condition compares some `x` against `ErrNone` with `polarity` (true means checking
 * equality; false checking inequality), return the block reached when `x != ErrNone`.
 */
BlockStmt getErrorBranch(IfStmt ifStmt, boolean polarity) {
  polarity = [true, false] and
  if polarity = true then result = ifStmt.getElse() else result = ifStmt.getThen()
}

from IfStmt i, boolean testPolarity
where
i.getCond() = getADirectAuthCheck(testPolarity) and
i.getCond().(EqualityTestExpr).getAnOperand().(Ident).getName() = "ErrNone"
and not getErrorBranch(i, testPolarity).getAStmt() instanceof ReturnStmt
select i
```

### Step 3.2 步骤 3.2

```ql
import go

class AuthTestConfig extends DataFlow::Configuration {

  AuthTestConfig() { this = "auth-test-config" }

  override predicate isSource(DataFlow::Node source) {
    source = any(DataFlow::CallNode cn |
      cn.getTarget().hasQualifiedName("github.com/minio/minio/cmd", "isReqAuthenticated") or
      // Note new source function:
      cn.getTarget().hasQualifiedName("github.com/github/codeql-ctf-go-return", "errorSource")
    ).getResult()
  }

  override predicate isSink(DataFlow::Node sink) {
    sink = any(DataFlow::EqualityTestNode n).getAnOperand()
  }

}

EqualityTestExpr getAnAuthCheck() {
  exists(AuthTestConfig config, DataFlow::Node sink, DataFlow::EqualityTestNode comparison |
    config.hasFlow(_, sink) and comparison.getAnOperand() = sink |
    result = comparison.asExpr()
  )
}

ReturnStmt getAReturnStatementInBlock(BlockStmt b) {
  result = b.getAChild*()
}

predicate mustReachReturnInBlock(ControlFlow::Node node, BlockStmt b) {
  node.(IR::ReturnInstruction).getReturnStmt() = getAReturnStatementInBlock(b) or
  forex(ControlFlow::Node succ | succ = node.getASuccessor() | mustReachReturnInBlock(succ, b))
}

from IfStmt i, ControlFlow::ConditionGuardNode ifSucc
where
i.getCond() = getAnAuthCheck() and
i.getCond().(EqualityTestExpr).getAnOperand().(Ident).getName() = "ErrNone" and
ifSucc.ensures(DataFlow::exprNode(i.getCond()), true) and
not mustReachReturnInBlock(ifSucc, i.getThen())
select i
```

### Step 3.3 步骤 3.3

```ql
import go

class AuthTestConfig extends DataFlow::Configuration {

  AuthTestConfig() { this = "auth-test-config" }

  override predicate isSource(DataFlow::Node source) {
    source = any(DataFlow::CallNode cn |
      cn.getTarget().hasQualifiedName("github.com/minio/minio/cmd", "isReqAuthenticated") or
      // Note new source function:
      cn.getTarget().hasQualifiedName("github.com/github/codeql-ctf-go-return", "errorSource")
    ).getResult()
  }

  override predicate isSink(DataFlow::Node sink) {
    sink = any(DataFlow::EqualityTestNode n).getAnOperand()
  }

}

EqualityTestExpr getADirectAuthCheck(boolean polarity) {
  exists(AuthTestConfig config, DataFlow::Node sink, DataFlow::EqualityTestNode comparison |
    config.hasFlow(_, sink) and comparison.getAnOperand() = sink |
    result = comparison.asExpr() and
    result.getAnOperand().(Ident).getName() = "ErrNone" and
    polarity = result.getPolarity()
  )
}

CallExpr getACheckCall(boolean polarity, FuncDecl target, Expr innerCheck) {
  innerCheck = getAnAuthCheck(polarity) and
  target = result.getTarget().getFuncDecl() and
  forex(DataFlow::ResultNode rn | rn.getRoot() = target | rn.asExpr() = innerCheck)
}

Expr getAnAuthCheck(boolean polarity) {
  result = getADirectAuthCheck(polarity) or
  result = getACheckCall(polarity, _, _)
}

/**
 * Given `ifStmt`'s condition compares some `x` against `ErrNone` with `polarity` (true means checking
 * equality; false checking inequality), return the block reached when `x != ErrNone`.
 */
BlockStmt getErrorBranch(IfStmt ifStmt, boolean polarity) {
  polarity = [true, false] and
  if polarity = true then result = ifStmt.getElse() else result = ifStmt.getThen()
}

from IfStmt i, boolean testPolarity
where
i.getCond() = getAnAuthCheck(testPolarity)
and not getErrorBranch(i, testPolarity).getAStmt() instanceof ReturnStmt
select i
```

### Step 3.4 步骤 3.4

```ql
import go

class AuthTestConfig extends DataFlow::Configuration {

  AuthTestConfig() { this = "auth-test-config" }

  override predicate isSource(DataFlow::Node source) {
    source = any(DataFlow::CallNode cn |
      cn.getTarget().hasQualifiedName("github.com/minio/minio/cmd", "isReqAuthenticated") or
      // Note new source function:
      cn.getTarget().hasQualifiedName("github.com/github/codeql-ctf-go-return", "errorSource")
    ).getResult()
  }

  override predicate isSink(DataFlow::Node sink) {
    sink = any(DataFlow::EqualityTestNode n).getAnOperand()
  }

}

EqualityTestExpr getADirectAuthCheck(boolean polarity) {
  exists(AuthTestConfig config, DataFlow::Node sink, DataFlow::EqualityTestNode comparison |
    config.hasFlow(_, sink) and comparison.getAnOperand() = sink |
    result = comparison.asExpr() and
    polarity = result.getPolarity()
  )
}

Expr getAnAuthCheck(Boolean noError, EqualityTestExpr test) {
  result = getADirectAuthCheck(noError) and test = result
  or
  result.(ParenExpr).getExpr() = getAnAuthCheck(noError, test)
  or
  result.(NotExpr).getOperand() = getAnAuthCheck(noError.booleanNot(), test)
  or
  result.(LandExpr).getRightOperand() = getAnAuthCheck(noError, test)
  or
  result.(LandExpr).getLeftOperand() = getAnAuthCheck(true, test) and noError = true
  or
  result.(LandExpr).getLeftOperand() = getAnAuthCheck(false, test) and noError = [true, false]
  or
  result.(LorExpr).getRightOperand() = getAnAuthCheck(noError, test)
  or
  result.(LorExpr).getLeftOperand() = getAnAuthCheck(false, test) and noError = false
  or
  result.(LorExpr).getLeftOperand() = getAnAuthCheck(true, test) and noError = [true, false]
}

/**
 * Given `ifStmt`'s condition compares some `x` against `ErrNone` with `polarity` (true means checking
 * equality; false checking inequality), return a block reached when `x != ErrNone`.
 */
BlockStmt getErrorBranch(IfStmt ifStmt, boolean polarity) {
  polarity = [true, false] and
  if polarity = true then result = ifStmt.getElse() else result = ifStmt.getThen()
}

from IfStmt i, EqualityTestExpr test
where
test.getAnOperand().(Ident).getName() = "ErrNone"
and not forall(boolean testPolarity |
  i.getCond() = getAnAuthCheck(testPolarity, test) |
  exists(Stmt s | s = getErrorBranch(i, testPolarity).getAStmt() | s instanceof ReturnStmt))
and i.getFile().getBaseName() = "logicalOperators.go"
select i
```

### Step 3.5 步骤 3.5

```ql
import go

class AuthTestConfig extends DataFlow::Configuration {

  AuthTestConfig() { this = "auth-test-config" }

  override predicate isSource(DataFlow::Node source) {
    source = any(DataFlow::CallNode cn |
      cn.getTarget().hasQualifiedName("github.com/minio/minio/cmd", "isReqAuthenticated") or
      // Note new source function:
      cn.getTarget().hasQualifiedName("github.com/github/codeql-ctf-go-return", "errorSource")
    ).getResult()
  }

  override predicate isSink(DataFlow::Node sink) {
    sink = any(DataFlow::EqualityTestNode n).getAnOperand()
  }

}

predicate returnsNil(FuncDecl f) {
  forex(DataFlow::ResultNode r | r.getRoot() = f | r = Builtin::nil().getARead())
}

predicate isNil(Expr e) {
  e = any(CallExpr c | returnsNil(c.getTarget().getFuncDecl())) or
  e = Builtin::nil().getAReference()
}

EqualityTestExpr getADirectAuthCheck(boolean polarity) {
  exists(AuthTestConfig config, DataFlow::Node sink, DataFlow::EqualityTestNode comparison |
    config.hasFlow(_, sink) and comparison.getAnOperand() = sink |
    result = comparison.asExpr() and
    polarity = result.getPolarity()
  )
}

/**
 * Given `ifStmt`'s condition compares some `x` against `ErrNone` with `polarity` (true means checking
 * equality; false checking inequality), return the block reached when `x != ErrNone`.
 */
BlockStmt getErrorBranch(IfStmt ifStmt, boolean polarity) {
  polarity = [true, false] and
  if polarity = true then result = ifStmt.getElse() else result = ifStmt.getThen()
}

from IfStmt i, boolean testPolarity, int resultIdx
where
i.getCond() = getADirectAuthCheck(testPolarity) and
i.getCond().(EqualityTestExpr).getAnOperand().(Ident).getName() = "ErrNone" and
i.getEnclosingFunction().getType().getResultType(resultIdx) = Builtin::error().getType() and
not exists(ReturnStmt r |
  r = getErrorBranch(i, testPolarity).getAStmt() |
  not isNil(r.getExpr(resultIdx))
)
select i
```

[ Back to all challenges
回到所有挑战](https://securitylab.github.com/ctf/)



## Product

- [Features](https://github.com/features)
- [Security](https://github.com/security)
- [Team](https://github.com/team)
- [Enterprise](https://github.com/enterprise)
- [Customer stories](https://github.com/customer-stories?type=enterprise)
- [The ReadME Project](https://github.com/readme)
- [Pricing](https://github.com/pricing)
- [Resources](https://resources.github.com/)
- [Roadmap](https://github.com/github/roadmap)
- [Compare GitHub](https://resources.github.com/devops/tools/compare/)

## Platform

- [Developer API](https://developer.github.com/)
- [Partners](http://partner.github.com/)
- [Atom](https://atom.io/)
- [Electron](http://electron.atom.io/)
- [GitHub Desktop](https://desktop.github.com/)

## Support

- [Docs](https://docs.github.com/)
- [Community Forum](https://github.community/)
- [Professional Services](https://services.github.com/)
- [GitHub Skills](https://skills.github.com/)
- [Status](https://githubstatus.com/)
- [Contact GitHub](https://support.github.com/)

## Company

- [About](https://github.com/about)
- [Blog](https://github.blog/)
- [Careers](https://github.com/about/careers)
- [Press](https://github.com/about/press)
- [Inclusion](https://github.com/about/careers)
- [Social Impact](https://github.com/about/press)
- [Shop](https://shop.github.com/)

- 
- 
- 
- 
- 

- GitHub Inc. © 2024
- [Terms](https://docs.github.com/en/github/site-policy/github-terms-of-service)
- [Privacy](https://docs.github.com/en/github/site-policy/github-privacy-statement)
- [Sitemap](https://securitylab.github.com/ctf/go-and-dont-return/answers/#)
- [What is Git?](https://github.com/git-guides)
- [Manage Cookies](https://securitylab.github.com/ctf/go-and-dont-return/answers/#)
- [Do not share my personal information](https://securitylab.github.com/ctf/go-and-dont-return/answers/#)





## 摘要

本文是GitHub Security Lab CTF（Capture The Flag）挑战“Go and don’t return”的解答与反馈。文章详细展示了如何使用CodeQL进行Go代码的静态分析，特别是针对错误处理逻辑中的潜在漏洞。文章分为三个部分，逐步深入分析Go代码中的错误处理模式，尤其是与`ErrNone`相关的条件判断和返回语句。通过一系列CodeQL查询，文章展示了如何识别和处理未正确返回错误的情况，最终帮助开发者发现并修复潜在的安全漏洞。

## 主要内容

### 1. 第1部分：基础查询

- **步骤1.1**：查找所有名为`ErrNone`的标识符。
- **步骤1.2**：查找所有与`ErrNone`进行比较的等式测试表达式。
- **步骤1.3**：查找所有条件语句中与`ErrNone`进行比较的`IfStmt`。
- **步骤1.4**：查找所有返回语句。
- **步骤1.5**：查找所有`IfStmt`中`then`块不包含返回语句的情况。
- **步骤1.6**：结合前几步，查找所有与`ErrNone`进行比较且`then`块不包含返回语句的`IfStmt`。

### 2. 第2部分：数据流分析

- **步骤2.1**：定义`AuthTestConfig`类，用于分析从`isReqAuthenticated`函数到等式测试节点的数据流。
- **步骤2.2**：扩展查询，查找与`ErrNone`进行比较且`then`块不包含返回语句的`IfStmt`，并结合数据流分析结果。

### 3. 第3部分：复杂条件与逻辑操作符

- **步骤3.1**：扩展数据流分析，引入新的源函数`errorSource`，并处理更复杂的条件判断。
- **步骤3.2**：引入控制流分析，确保在特定条件下必须返回错误。
- **步骤3.3**：处理嵌套的条件表达式，如逻辑与（`&&`）和逻辑或（`||`）。
- **步骤3.4**：进一步扩展查询，处理更复杂的逻辑操作符组合。
- **步骤3.5**：最终查询，确保在错误分支中返回的错误值不为`nil`。

## 重要观点或结论

1. **错误处理的重要性**：文章强调了在Go代码中正确处理错误的重要性，特别是在涉及敏感操作（如身份验证）时，未正确处理错误可能导致安全漏洞。
2. **CodeQL的强大功能**：通过CodeQL的静态分析能力，开发者可以自动化地检测代码中的潜在错误处理问题，尤其是在复杂的逻辑条件下。
3. **数据流与控制流分析的结合**：文章展示了如何结合数据流和控制流分析，精确地识别代码中的错误处理漏洞，特别是在条件判断和返回语句的上下文中。
4. **逻辑操作符的处理**：文章详细介绍了如何处理复杂的逻辑操作符（如`&&`和`||`），确保在复杂的条件判断中也能正确识别错误处理逻辑。
5. **返回值的验证**：最终查询确保在错误分支中返回的错误值不为`nil`，进一步增强了代码的健壮性和安全性。