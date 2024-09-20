export default {
  path: "/system",
  name: "system",
  meta: {
    title: "系统",
    icon: "icon-park-solid:system"
  },
  children: [
    {
      path: "/system/terminal",
      name: "terminal",
      component: () => import("@/views/system/terminal/index.vue"),
      meta: {
        title: "远程终端",
        showParent: true,
        icon: "ph:terminal-fill"
      }
    }
  ]
} as RouteConfigsTable;
