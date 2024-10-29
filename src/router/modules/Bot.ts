const Layout = () => import("@/layout/index.vue");

export default {
  path: "/Bot",
  name: "Bot",
  component: Layout,
  meta: {
    title: "Bot",
    icon: "bxs:bot",
    rank: 2
  },
  children: [
    {
      path: "/Bot/stats",
      name: "stats",
      component: () => import("@/views/Bot/stats/index.vue"),
      meta: {
        title: "数据统计",
        icon: "gridicons:stats-alt"
      }
    },
    {
      path: "/Bot/sandbox",
      name: "sandbox",
      component: () => import("@/views/Bot/sandbox/index.vue"),
      meta: {
        title: "沙盒调试",
        icon: "mage:hour-glass-fill"
      }
    },
    {
      path: "/Bot/plugins",
      name: "bot-plugins",
      component: () => import("@/views/Bot/plugins/index.vue"),
      meta: {
        title: "插件列表",
        icon: "material-symbols:list"
      }
    }
  ]
} as RouteConfigsTable;
