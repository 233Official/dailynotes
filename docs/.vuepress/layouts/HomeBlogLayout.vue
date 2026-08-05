<script setup lang="ts">
import { useFrontmatter } from "vuepress/client";
import { Blog } from "vuepress-theme-hope/blog";

import HomeFocus from "../components/HomeFocus.vue";
import HomeNotebookFooter from "../components/HomeNotebookFooter.vue";
import HomeQuickLinks from "../components/HomeQuickLinks.vue";

const frontmatter = useFrontmatter();
</script>

<template>
  <Blog v-if="frontmatter.home">
    <template #heroAfter>
      <HomeQuickLinks />
    </template>

    <template #articlesBefore>
      <HomeFocus />
    </template>

    <template #content>
      <HomeNotebookFooter />
    </template>
  </Blog>

  <Blog v-else />
</template>
