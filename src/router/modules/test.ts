export default {
  path: "/test",
  meta: {
    title: "test"
  },
  children: [
    {
      path: "/test/index",
      name: "test",
      component: () => import("@/views/test/index.vue"),
      meta: {
        title: "test"
      }
    }
  ]
};
