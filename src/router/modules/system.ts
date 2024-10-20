export default {
  path: "/system",
  name: "system",
  meta: {
    title: "系统",
    icon: "icon-park-solid:system",
    rank: 1
  },
  children: [
    {
      path: "/system/sandbox",
      name: "sandbox",
      component: () => import("@/views/system/sandbox/index.vue"),
      meta: {
        title: "沙盒调试",
        icon: "mage:hour-glass-fill"
      }
    },
    {
      path: "/system/terminal",
      name: "terminal",
      component: () => import("@/views/system/terminal/index.vue"),
      meta: {
        title: "远程终端",
        icon: "ph:terminal-fill"
      }
    },
    {
      path: "/system/realtimeLog",
      name: "realtimeLog",
      component: () => import("@/views/system/realtimeLog/index.vue"),
      meta: {
        title: "实时日志",
        icon: "icon-park-solid:log"
      }
    },
    // {
    //   path: "/system/pastLog",
    //   name: "pastLog",
    //   component: () => import("@/views/system/pastLog/index.vue"),
    //   meta: {
    //     title: "过往日志",
    //     icon: "octicon:log-16"
    //   }
    // },
    {
      path: "/system/files",
      name: "files",
      component: () => import("@/views/system/files/index.vue"),
      meta: {
        title: "文件管理",
        icon: "mdi:files"
      }
    }
  ]
} as RouteConfigsTable;
