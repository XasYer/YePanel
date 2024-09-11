export default {
  path: "/setting",
  name: "setting",
  meta: {
    title: "设置",
    icon: "ep:setting"
  },
  children: [
    {
      path: "/setting/index",
      name: "setting",
      component: () => import("@/views/setting/index.vue"),
      meta: {
        title: "设置"
      }
    }
  ]
} as RouteConfigsTable;
