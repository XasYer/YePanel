const Layout = () => import("@/layout/index.vue");

export default {
  path: "/database",
  name: "database",
  component: Layout,
  meta: {
    title: "数据库",
    icon: "mdi:database"
  },
  children: [
    {
      path: "/database/redis",
      name: "redis",
      component: () => import("@/views/database/redis/index.vue"),
      meta: {
        title: "redis",
        icon: "cib:redis"
      }
    },
    {
      path: "/database/sqlite",
      name: "sqlite",
      component: () => import("@/views/database/sqlite/index.vue"),
      meta: {
        title: "sqlite",
        icon: "file-icons:sqlite"
      }
    }
  ]
} as RouteConfigsTable;
