const Layout = () => import("@/layout/index.vue");

export default {
  path: "/dev",
  name: "dev",
  component: Layout,
  meta: {
    title: "开发",
    icon: "mdi:dev-to",
    rank: 99
  },
  children: [
    {
      path: "/dev/vue",
      name: "vue",
      component: () => import("@/views/dev/vue/index.vue"),
      meta: {
        title: "vue",
        showParent: true,
        icon: "mdi:vuejs"
      }
    }
  ]
} as RouteConfigsTable;
