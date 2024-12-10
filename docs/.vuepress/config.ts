import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import theme from "./theme";
import { sitemapPlugin } from "@vuepress/plugin-sitemap";
import { slimsearchPlugin } from '@vuepress/plugin-slimsearch'
import { cachePlugin } from "@vuepress/plugin-cache";
import { appendDatePlugin } from "@vuepress/plugin-append-date";

export default defineUserConfig({
  lang: "zh-CN",
  // 站点的标题
  title: "DailyNotes",
  // 站点的描述
  description: "233的日常学习记录",
  // 站点配置, 设置为 /[仓库名]/
  //  Github
  // base: "/DailyNotes/",  
  // Gitlab Backup
  base: "/dailynotes/",

  plugins: [
    slimsearchPlugin({
      // 配置项
    }),
    appendDatePlugin(), 
    cachePlugin({ type: "filesystem" })
  ],

  // plugins: [
  //   searchProPlugin({
  //     // 配置选项
  //   }),
  //   sitemapPlugin({
  //     // 配置选项
  //     hostname: "ayusummer.github.io",
  //   }),
  // ],
  bundler: viteBundler(),
  // 主题配置
  theme,
});
