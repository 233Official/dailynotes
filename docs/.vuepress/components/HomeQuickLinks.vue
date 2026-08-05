<script setup lang="ts">
import { RouteLink } from "vuepress/client";
</script>

<template>
  <nav class="home-quick-links" aria-label="首页快捷入口">
    <a class="home-quick-link" href="#recent-notes">
      <span class="home-quick-link__index">01</span>
      <span>
        <strong>最近更新</strong>
        <small>查看最新整理的内容</small>
      </span>
      <span class="home-quick-link__arrow" aria-hidden="true">↘</span>
    </a>

    <RouteLink class="home-quick-link" to="/category/">
      <span class="home-quick-link__index">02</span>
      <span>
        <strong>主题索引</strong>
        <small>从分类与标签进入</small>
      </span>
      <span class="home-quick-link__arrow" aria-hidden="true">↗</span>
    </RouteLink>

    <RouteLink class="home-quick-link" to="/timeline/">
      <span class="home-quick-link__index">03</span>
      <span>
        <strong>时间轴</strong>
        <small>回看笔记的演进</small>
      </span>
      <span class="home-quick-link__arrow" aria-hidden="true">↗</span>
    </RouteLink>
  </nav>
</template>

<style scoped lang="scss">
.home-quick-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;

  box-sizing: border-box;
  width: min(1096px, calc(100% - 4rem));
  margin: 0 auto 1.5rem;
}

.home-quick-link {
  position: relative;

  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.85rem;
  align-items: center;

  min-width: 0;
  padding: 1rem 1.1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 0.65rem;

  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text);
  box-shadow: 0 1px 3px 1px var(--vp-c-shadow);

  transition:
    border-color var(--vp-t-color),
    box-shadow var(--vp-t-transform),
    transform var(--vp-t-transform);

  &:hover {
    border-color: var(--vp-c-accent);
    color: var(--vp-c-text);
    box-shadow: 0 4px 14px var(--vp-c-shadow);
    transform: translateY(-2px);
  }

  strong,
  small {
    display: block;
  }

  strong {
    font-family: var(--vp-font-heading);
    font-size: 1rem;
  }

  small {
    margin-top: 0.25rem;
    color: var(--vp-c-text-mute);
    font-size: 0.78rem;
    line-height: 1.4;
  }
}

.home-quick-link__index {
  color: var(--vp-c-accent);
  font-weight: 700;
  font-size: 0.75rem;
  font-family: var(--vp-font-mono);
}

.home-quick-link__arrow {
  color: var(--vp-c-text-mute);
  font-size: 1.1rem;
}

@media (max-width: 959px) {
  .home-quick-links {
    width: calc(100% - 2rem);
  }
}

@media (max-width: 719px) {
  .home-quick-links {
    grid-template-columns: 1fr;
    gap: 0.55rem;
    margin-bottom: 1rem;
  }

  .home-quick-link {
    padding: 0.8rem 0.9rem;
  }
}
</style>
