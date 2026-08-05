import { defineClientConfig } from "vuepress/client";

import HomeBlogLayout from "./layouts/HomeBlogLayout.vue";

export default defineClientConfig({
  layouts: {
    Blog: HomeBlogLayout,
  },
});
