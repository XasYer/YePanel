# YePanel

<div align="center">

**提供 web 面板管理功能**

<br/>

![GitHub release (latest by date)](https://img.shields.io/github/v/release/XasYer/YePanel)
![GitHub stars](https://img.shields.io/github/stars/XasYer/YePanel?style=social)
![GitHub forks](https://img.shields.io/github/forks/XasYer/YePanel?style=social)
![GitHub license](https://img.shields.io/github/license/XasYer/YePanel)
![GitHub issues](https://img.shields.io/github/issues/XasYer/YePanel)
![GitHub pull requests](https://img.shields.io/github/issues-pr/XasYer/YePanel)
<br/>

<img src="https://count.getloli.com/get/@XasYer-YePanel?theme=rule34" />

</div>

![Star History Chart](https://api.star-history.com/svg?repos=XasYer/YePanel&type=Date)

## 安装

1. clone build 分支 (推荐)

   ```sh
   git clone --depth=1 -b build https://github.com/XasYer/YePanel.git ./plugins/YePanel/
   ```

   > 如果你的网络环境较差，无法连接到 Github，可以使用 Gitee 镜像仓库，可能会更新不及时
   >
   > ```sh
   > git clone --depth=1 -b build https://gitee.com/xiaoye12123/YePanel.git ./plugins/YePanel/
   > ```

   安装依赖

   ```sh
   pnpm install --filter=YePanel -P
   ```

2. clone main 分支自行编译 (不推荐)
   ```sh
   git clone --depth=1 https://github.com/XasYer/YePanel.git ./plugins/YePanel/
   cd plugins/YePanel/
   pnpm install
   pnpm run build
   ```

## 使用

快捷登录: **私聊bot发送`#小叶面板登录`**

YePanel 目前只提供 api 接口，需要登陆官方或第三方面板后才能使用。需要服务器有公网 ip 或 gui，才能访问面板。

用户名和密码可在`config/server.yaml`中编辑，密码默认为`123456`，用户名可以为任何已登录的 Bot 账号，
api 接口地址为`http://ip:port`，**ip 为服务器公网 ip，port 更换为配置文件中设置的端口，如果在外网环境中访问面板，需要开放端口**。

使用方式为 1 或 2 时, 可以直接访问`http://ip:port`。

### 1. 使用公共面板

[公共地址](http://gh.xasyer.icu/YePanel/)

#### 注意

web 面板和 api 接口 通常为同步更新，如果届时发现无法登录 web 面板或出现异常，请先尝试更新插件。

 <details>
 <summary>chrome打开公共面板显示 `该网页无法正常运作`</summary>

> 注意: 要使用`http` 而不是 `https`, 输入网址时需要手动加`http://`
> 可先尝试手动添加`http://`再访问, 如`http://gh.xasyer.icu/YePanel/`

可尝试以下方法:

- 方法一

  1. 地址栏输入: chrome://settings/content/siteDetails?site=http%3A%2F%2Fgh.xasyer.icu
  2. 找到不安全内容 选择 允许
  3. 再打开 http://gh.xasyer.icu/YePanel/

- 方法二

  1. chrome 地址栏输入 chrome://net-internals/#hsts
  2. Delete domain security policies 下面的输入框输入https://gh.xasyer.icu/YePanel/ 点击 delete
  3. 重新打开 chrome,地址栏输入http://gh.xasyer.icu/YePanel/

- 方法三

  私聊 bot 发送 `#小叶面板安装web` 挂载在本地服务器上

 </details>

### 2. 挂载到崽上

clone gh-pages 分支到 plugins 目录下以`YePanel-Web`命名, 此时启动时会自动挂载到 server.yaml 中配置的端口下。

```sh
git clone --depth=1 -b gh-pages https://github.com/XasYer/YePanel.git ./plugins/YePanel-Web/
```

> [!TIP]
> 网络问题导致 clone 失败时, 可以使用以下命令克隆
>
> ```sh
> git clone --depth=1 -b gh-pages https://gitee.com/xiaoye12123/YePanel.git ./plugins/YePanel-Web/
> ```

~~放到 plugins 目录蹭一下#全部更新~~

### 3. clone web 分支自行编译

在任意目录下执行以下命令

```sh
git clone --depth=1 -b web https://github.com/XasYer/YePanel.git
cd YePanel
pnpm install
```

调试

```sh
pnpm run dev
```

编译

```sh
pnpm run build
```

## 联系方式

- QQ 群: [741577559](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=IvPaOVo_p-6n--FaLm1v39ML9EZaBRCm&authKey=YPs0p%2FRh8MGPQrWZgn99fk4kGB5PtRAoOYIUqK71FBsBYCDdekxCEHFFHnznpYA1&noverify=0&group_code=741577559)

## 页面预览

<details>
<summary>登录页面</summary>

![登录页面](https://cdn.jsdelivr.net/gh/XasYer/YePanel@web/public/login.png)

</details>

<details>
<summary>面板首页</summary>

![面板首页](https://cdn.jsdelivr.net/gh/XasYer/YePanel@web/public/welcome.png)

</details>

<details>
<summary>沙盒测试</summary>

![沙盒测试](https://cdn.jsdelivr.net/gh/XasYer/YePanel@web/public/sendbox.png)

</details>

<details>
<summary>数据统计</summary>

![数据统计](https://cdn.jsdelivr.net/gh/XasYer/YePanel@web/public/stats.png)

</details>

<details>
<summary>插件列表</summary>

![插件列表](https://cdn.jsdelivr.net/gh/XasYer/YePanel@web/public/plugins.png)

</details>

<details>
<summary>远程终端</summary>

![远程终端](https://cdn.jsdelivr.net/gh/XasYer/YePanel@web/public/terminal.png)

</details>

<details>
<summary>实时日志</summary>

![实时日志](https://cdn.jsdelivr.net/gh/XasYer/YePanel@web/public/realtimeLog.png)

</details>

<details>
<summary>文件管理</summary>

![文件管理](https://cdn.jsdelivr.net/gh/XasYer/YePanel@web/public/files.png)

</details>

<details>
<summary>redis</summary>

![redis信息](https://cdn.jsdelivr.net/gh/XasYer/YePanel@web/public/redisInfo.png)
![redis数据](https://cdn.jsdelivr.net/gh/XasYer/YePanel@web/public/redisData.png)

</details>

<details>
<summary>sqlite</summary>

![sqlite](https://cdn.jsdelivr.net/gh/XasYer/YePanel@web/public/sqlite.png)

</details>

<details>
<summary>vue开发</summary>

![vue开发](https://cdn.jsdelivr.net/gh/XasYer/YePanel@web/public/vue.png)

</details>

## 插件开发

### vue 页面

使用[vue3-sfc-loader](https://github.com/FranckFreiburger/vue3-sfc-loader)进行组件加载。

#### 文件存放位置

需要在自己的插件目录下新建`YePanel`文件夹

其中包含以下文件:

1. `index.js` 用于注册路由以及 api 接口
2. `*.vue` 页面文件
3. `components` 组件文件夹(可选)

#### index.js

```js
// 应当默认导出一个对象
export default {
  // 前端路由配置
  router: {
    meta: {
      // 路由显示的名字
      title: "YePanel",
      // 路由图标 https://icon-sets.iconify.design/
      icon: "vaadin:panel",
    },
    // 如果插件适配了锅巴,并且有setting.vue页面,则不会显示锅巴页面
    // 子路由 仅支持二级路由
    children: [
      {
        // 显示的url 需要带上 /
        path: "/test",
        // 对应当前目录下的 .vue文件 即显示的组件
        name: "test",
        meta: {
          // 路由显示的名字
          title: "设置",
          // 路由图标 https://icon-sets.iconify.design/
          icon: "ant-design:setting-filled",
          // 是否显示父级菜单, 如果子路由只有一个的话会生成二级路由
          // 如果为false 并且只有一个子路由 则不会显示父级菜单
          showParent: true,
        },
      },
    ],
  },
  // 使用fastify.route注册路由
  api: [
    {
      // 接口的url 需要带上 / 不用判断是否和其他接口重复 在收集api时会在前带上plugin名字
      url: "/get-data",
      // 请求方法
      method: "post",
      // 如果不需要鉴权可以取消这段注释
      // preHandler: (request, reply, done) => done(),
      // 回调函数
      handler: (request, reply) => {
        return {
          success: true,
        };
      },
      // 可以有wsHandler进行ws连接 不需要onopen, 连接即open
      // wsHandler: (ws, request) => {}
    },
  ],
};
```

#### \*.vue

```vue
<template>
  <el-card> {{ "Ciallo～(∠・ω< )⌒☆" }} </el-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElCard } from "element-plus";
import * as echarts from "echarts";
// https://icon-sets.iconify.design/
// 使用: <iconify icon="mdi:home" :width="24" :height="24" />
import iconify from "iconify";
// https://pure-admin-utils.netlify.app/
import * as utils from "@pureadmin/utils";
// https://plus-pro-components.com/
import * as PlusProComponents from "plus-pro-components";
// Too more please pr or issue...

const props = defineProps({
  // method, url, param, axiosConfig
  // url 为index.js中注册的api的url
  // 如果需要访问其他api, 可以设置param.baseURL
  request: Function,
  // 登录时填写的url
  baseUrl: String,
  // 插件文件名
  pluginName: String,
  /// 登录后获得的token, 可用于ws鉴权等 new WebSocket(url, accessToken)
  accessToken: String,
});
</script>
```

#### components 文件夹

此文件夹下可存放`*.vue`组件文件。

可选, 用于存放组件文件。使用时直接导入`yourComponentName.vue`即可, 不需要`./components/`前缀。

注意: 组件加载的先后顺序为文件名顺序, 如果在组件加载前导入则会加载失败。

## 常见问题

### 插件加载错误

`YePanel Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'Yunzai\plugins\YePanel\lib\index.js' imported from Yunzai\plugins\YePanel\index.js`

请检查是不是拉取的 build 分支，而不是 main 分支。
如果为 main 分支，请自行编译。或删除后重新拉取 build 分支。

### 请求/login 失败：Network Error

1. 是否开放 server.yaml 中设置的端口
2. 是否访问地址为`http`而不是`https`
3. 是否填写错端口号或 ip 地址

## 贡献者

> 🌟 星光闪烁，你们的智慧如同璀璨的夜空。感谢所有为 **YePanel** 做出贡献的人！

<a href="https://github.com/XasYer/YePanel/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=XasYer/YePanel" />
</a>

![Alt](https://repobeats.axiom.co/api/embed/56c04a0e5e63aef877943a8f31e46278d9c3a6c0.svg "Repobeats analytics image")

## 鸣谢

感谢以下开源项目: (排名不分先后)

- [element-plus](https://github.com/element-plus/element-plus)
- [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin)
- [vue3-sfc-loader](https://github.com/FranckFreiburger/vue3-sfc-loader)
- [fastify](https://github.com/fastify/fastify)
- [echarts](https://github.com/apache/echarts)
- [iconify](https://github.com/iconify/iconify)
- [karin-plugin-manage](https://github.com/HalcyonAlcedo/karin-plugin-manage)
- [yenai-plugin](https://github.com/yeyang52/yenai-plugin)

## 其他

如果觉得此插件对你有帮助的话,可以点一个 star,你的支持就是不断更新的动力~
