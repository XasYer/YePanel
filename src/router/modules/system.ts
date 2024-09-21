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
    },
    {
      path: "/system/realtimeLog",
      name: "realtimeLog",
      component: () => import("@/views/system/realtimeLog/index.vue"),
      meta: {
        title: "实时日志",
        showParent: true,
        icon: "icon-park-solid:log"
      }
    }
  ]
} as RouteConfigsTable;
