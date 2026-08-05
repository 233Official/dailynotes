<script setup lang="ts">
import { RouteLink } from "vuepress/client";

const focuses = [
  {
    title: "AI 工具与安全",
    description: "Agent 实践、模型能力与 AI 安全研究",
    link: "/category/ai/",
    label: "AI",
  },
  {
    title: "网络安全研究",
    description: "攻防技术、端点安全与漏洞研究",
    link: "/category/网络安全/",
    label: "SEC",
  },
  {
    title: "系统与工程实践",
    description: "macOS、Linux、容器与日常排障",
    link: "/category/通识/",
    label: "OPS",
  },
];

const guides = [
  {
    title: "Python 开发环境配置",
    description: "安装、版本管理、换源与调试设置",
    link: "/Language/Python/开发环境.html",
  },
  {
    title: "版本管理工具",
    description: "Python 版本与依赖管理工具索引",
    link: "/Language/Python/版本管理工具.html",
  },
];
</script>

<template>
  <section class="home-focus" aria-labelledby="home-focus-title">
    <header class="home-section-heading">
      <p>CURATED PATHS</p>
      <h2 id="home-focus-title">本阶段在整理</h2>
      <span>从正在持续更新的方向进入，而不是在数百篇笔记里漫游。</span>
    </header>

    <div class="home-focus-grid">
      <RouteLink
        v-for="focus in focuses"
        :key="focus.title"
        class="home-focus-card"
        :to="focus.link"
      >
        <span class="home-focus-card__label">{{ focus.label }}</span>
        <strong>{{ focus.title }}</strong>
        <small>{{ focus.description }}</small>
        <span class="home-focus-card__more">进入主题 <span aria-hidden="true">→</span></span>
      </RouteLink>
    </div>

    <div class="home-guides">
      <div class="home-guides__heading">
        <span>常用指南</span>
        <small>经过长期使用与维护的基础入口</small>
      </div>

      <RouteLink
        v-for="guide in guides"
        :key="guide.title"
        class="home-guide-link"
        :to="guide.link"
      >
        <span>
          <strong>{{ guide.title }}</strong>
          <small>{{ guide.description }}</small>
        </span>
        <span aria-hidden="true">↗</span>
      </RouteLink>
    </div>

    <header id="recent-notes" class="home-section-heading home-section-heading--recent">
      <p>LATEST NOTES</p>
      <h2>最近更新</h2>
      <span>按照更新时间排列，保留这份随笔当前的工作轨迹。</span>
    </header>
  </section>
</template>

<style scoped lang="scss">
.home-focus {
  margin: 0.75rem 0 0;
}

.home-section-heading {
  margin: 0 0 1rem;
  padding: 0.25rem 0.25rem 0;

  p {
    margin: 0 0 0.35rem;
    color: var(--vp-c-accent);
    font-weight: 700;
    font-size: 0.72rem;
    font-family: var(--vp-font-mono);
    letter-spacing: 0.12em;
  }

  h2 {
    margin: 0;
    border: 0;
    font-size: 1.55rem;
  }

  span {
    display: block;
    margin-top: 0.4rem;
    color: var(--vp-c-text-mute);
    font-size: 0.9rem;
    line-height: 1.6;
  }
}

.home-section-heading--recent {
  scroll-margin-top: calc(var(--navbar-height) + 1rem);
  margin-top: 1.75rem;
  margin-bottom: 0.2rem;
}

.home-focus-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.home-focus-card {
  display: flex;
  flex-direction: column;

  min-height: 9.25rem;
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 0.65rem;

  background:
    linear-gradient(145deg, var(--vp-c-accent-soft), transparent 58%),
    var(--vp-c-bg-elv);
  color: var(--vp-c-text);

  transition:
    border-color var(--vp-t-color),
    transform var(--vp-t-transform);

  &:hover {
    border-color: var(--vp-c-accent);
    color: var(--vp-c-text);
    transform: translateY(-2px);
  }

  strong,
  small {
    display: block;
  }

  strong {
    margin-top: 0.65rem;
    font-family: var(--vp-font-heading);
    font-size: 1.05rem;
  }

  small {
    margin-top: 0.35rem;
    color: var(--vp-c-text-mute);
    font-size: 0.82rem;
    line-height: 1.55;
  }
}

.home-focus-card__label {
  width: fit-content;
  padding: 0.18rem 0.45rem;
  border-radius: 999px;

  background: var(--vp-c-accent-soft);
  color: var(--vp-c-accent);

  font-weight: 700;
  font-size: 0.65rem;
  font-family: var(--vp-font-mono);
  letter-spacing: 0.08em;
}

.home-focus-card__more {
  margin-top: auto;
  padding-top: 0.75rem;
  color: var(--vp-c-accent);
  font-weight: 600;
  font-size: 0.78rem;
}

.home-guides {
  display: grid;
  grid-template-columns: 1.15fr repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  align-items: stretch;

  margin-top: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 0.65rem;
  background: var(--vp-c-bg-soft);
}

.home-guides__heading,
.home-guide-link {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.home-guides__heading {
  flex-direction: column;
  justify-content: center;
  padding: 0.35rem 0.45rem;

  span {
    font-weight: 700;
    font-family: var(--vp-font-heading);
  }

  small {
    color: var(--vp-c-text-mute);
    font-size: 0.76rem;
    line-height: 1.45;
  }
}

.home-guide-link {
  align-items: center;
  padding: 0.7rem 0.8rem;
  border-radius: 0.45rem;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text);

  transition: background var(--vp-t-color);

  &:hover {
    background: var(--vp-c-accent-soft);
    color: var(--vp-c-text);
  }

  strong,
  small {
    display: block;
  }

  strong {
    font-size: 0.85rem;
  }

  small {
    margin-top: 0.25rem;
    color: var(--vp-c-text-mute);
    font-size: 0.72rem;
    line-height: 1.4;
  }

  > span:last-child {
    color: var(--vp-c-accent);
  }
}

@media (max-width: 719px) {
  .home-focus {
    margin: 0.5rem 1rem 0;
  }

  .home-focus-grid {
    grid-template-columns: 1fr;
  }

  .home-focus-card {
    min-height: 7.75rem;
  }

  .home-guides {
    grid-template-columns: 1fr;
  }

  .home-guides__heading {
    padding-bottom: 0.15rem;
  }

  .home-section-heading--recent {
    margin-top: 1.5rem;
  }
}
</style>
