export default {
  path: "/setting",
  name: "setting",
  meta: {
    title: "设置",
    icon: "ant-design:setting-filled"
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
