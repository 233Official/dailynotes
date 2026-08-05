<script setup lang="ts">
import { RouteLink } from "vuepress/client";
</script>

<template>
  <section class="home-notebook-footer" aria-labelledby="home-notebook-title">
    <div>
      <p>ABOUT THIS NOTEBOOK</p>
      <h2 id="home-notebook-title">拾掇过往经验，也记录仍在变化的理解。</h2>
      <span>这里收录经过实践的技术笔记、排障过程与日常观察。</span>
    </div>

    <nav aria-label="随笔相关链接">
      <RouteLink to="/about/">关于随笔</RouteLink>
      <a href="https://233official.github.io/dailynotes/atom.xml">订阅 Atom</a>
      <a href="https://github.com/233Official/dailynotes">查看源码</a>
    </nav>
  </section>
</template>

<style scoped lang="scss">
.home-notebook-footer {
  display: flex;
  gap: 2rem;
  align-items: flex-end;
  justify-content: space-between;

  box-sizing: border-box;
  width: min(1096px, calc(100% - 4rem));
  margin: 2.25rem auto 0;
  padding: 1.5rem 0 0;
  border-top: 1px solid var(--vp-c-border);

  p {
    margin: 0 0 0.45rem;
    color: var(--vp-c-accent);
    font-weight: 700;
    font-size: 0.7rem;
    font-family: var(--vp-font-mono);
    letter-spacing: 0.12em;
  }

  h2 {
    margin: 0;
    border: 0;
    font-size: 1.2rem;
  }

  span {
    display: block;
    margin-top: 0.4rem;
    color: var(--vp-c-text-mute);
    font-size: 0.86rem;
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    justify-content: flex-end;
  }

  a {
    font-weight: 600;
    font-size: 0.82rem;
    white-space: nowrap;
  }
}

@media (max-width: 719px) {
  .home-notebook-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;

    width: calc(100% - 2rem);
    margin-top: 1.5rem;

    nav {
      justify-content: flex-start;
    }
  }
}
</style>
