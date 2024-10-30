<template>
  <el-card v-loading="loading">
    <el-row :gutter="20">
      <el-col :xs="12" :lg="4" :sm="12">
        <div class="flex-c">
          <el-text tag="b" class="w-[70px]">数据源:</el-text>
          <el-select v-model="source" @change="handleSourceChange">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :xs="12" :lg="4" :sm="12">
        <div class="flex-c">
          <el-text tag="b" class="w-[60px]">搜索:</el-text>
          <el-input
            v-model="search"
            placeholder="Ciallo～(∠・ω< )⌒☆"
            @input="handleSearch"
          />
        </div>
      </el-col>
      <el-col :xs="12" :lg="4" :sm="12">
        <el-button type="primary" @click="installCustomPlugin"
          >安装自定义插件</el-button
        >
      </el-col>
    </el-row>
    <div>
      <el-table
        ref="tableRef"
        :data="
          data[source].slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )
        "
        height="65vh"
        stripe
        class="mb-[20px]"
      >
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="标题" prop="title" width="200px">
          <template #default="scope">
            <el-link
              v-if="scope.row.link"
              :underline="false"
              :href="scope.row.link"
              target="_blank"
              type="primary"
            >
              {{ scope.row.title }}
            </el-link>
            <el-text v-else>{{ scope.row.title }}</el-text>
            <el-tag
              v-if="data.install.some(i => i.name === scope.row.name)"
              type="success"
              size="small"
              >已安装</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" width="200px">
          <template #default="scope">
            <el-link
              v-if="scope.row.link"
              :underline="false"
              :href="scope.row.link"
              target="_blank"
              type="primary"
            >
              {{ scope.row.name }}
            </el-link>
            <el-text v-else>{{ scope.row.name }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="作者" prop="authors" width="200px">
          <template #default="scope">
            <el-link
              v-for="item in scope.row.authors"
              :key="item.link"
              :underline="false"
              :href="item.link"
              target="_blank"
              :type="item.link ? 'primary' : 'default'"
            >
              {{ item.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="desc" />
        <el-table-column fixed="right" label="操作" width="120px">
          <template #default="scope">
            <!-- <iconify icon="material-symbols:info-outline" :width="20" /> -->
            <el-button
              :icon="More"
              circle
              size="small"
              @click="handleOptions(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data[source].length"
        class="flex flex-wrap justify-start"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { getPluginList, PluginInfo, installPlugin } from "@/api/Bot";
import { h, ref } from "vue";
import { More } from "@element-plus/icons-vue";
import { addDialog, closeDialog } from "@/components/ReDialog";
import options from "./components/options.vue";
import Install from "./components/install.vue";
import { message } from "@/utils/message";

defineOptions({
  name: "bot-plugins"
});

const loading = ref(true);

const currentPage = ref(1);
const pageSize = ref(20);

const handleSizeChange = (size: number) => {
  pageSize.value = size;
};
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

const source = ref("all");
const selectOptions = [
  {
    label: "全部",
    value: "all"
  },
  {
    label: "已安装",
    value: "install"
  },
  {
    label: "未安装",
    value: "uninstall"
  },
  {
    label: "功能插件",
    value: "function"
  },
  {
    label: "游戏插件",
    value: "game"
  },
  {
    label: "文游插件",
    value: "wordgame"
  }
];
const handleSourceChange = () => {
  search.value = "";
};
const search = ref("");
const handleSearch = () => {
  if (search.value.trim() === "") {
    source.value = "all";
    return;
  }
  data.value.搜索 = data.value.all.filter(
    i =>
      i.title.includes(search.value) ||
      i.name.includes(search.value) ||
      i.desc.includes(search.value) ||
      i.authors.some(a => a.name.includes(search.value))
  );
  source.value = "搜索";
};

const handleOptions = (row: PluginInfo) => {
  addDialog({
    width: window.innerWidth < 992 ? "90%" : "50%",
    title: row.name,
    top: "5vh",
    contentRenderer: () => h(options),
    props: {
      data: {
        info: row,
        installed: data.value.install.some(i => i.name === row.name)
      },
      addInstall,
      removeInstall
    }
  });
};

const addDialogRef = ref<any>(null);
const installCustomPlugin = () => {
  addDialog({
    width: window.innerWidth < 992 ? "90%" : "50%",
    title: "安装插件",
    contentRenderer: () => h(Install, { ref: addDialogRef }),
    props: {
      addInstall
    },
    footerButtons: [
      {
        label: "取消",
        btnClick: ({ dialog: { options, index }, button }) => {
          closeDialog(options, index);
        }
      },
      {
        label: "确定",
        type: "primary",
        loading: false,
        btnClick: ({ dialog: { options, index }, button }) => {
          const FormRef = addDialogRef.value.getRef();
          FormRef.validate((valid: boolean) => {
            if (valid) {
              button.btn.loading = true;
              const data = addDialogRef.value.getData();
              installPlugin(data.link, data.name, data.branch).then(res => {
                button.btn.loading = false;
                if (res.success) {
                  message("安装成功~Ciallo～(∠・ω< )⌒☆", {
                    type: "success",
                    customClass: "el"
                  });
                  addInstall(
                    data.name ||
                      data.link
                        .replace(/\.git$/, "")
                        .split("/")
                        .pop()
                  );
                } else {
                  message(res.message, {
                    type: "error",
                    customClass: "el"
                  });
                }
                closeDialog(options, index);
              });
            }
          });
        }
      }
    ],
    beforeSure(done, { options, index }) {
      const FormRef = addDialogRef.value.getRef();
      FormRef.validate((valid: boolean) => {
        if (valid) {
          const data = addDialogRef.value.getData();
          installPlugin(data.link, data.name, data.branch).then(res => {
            if (res.success) {
              message("安装成功~Ciallo～(∠・ω< )⌒☆", {
                type: "success",
                customClass: "el"
              });
              addInstall(
                data.name ||
                  data.link
                    .replace(/\.git$/, "")
                    .split("/")
                    .pop()
              );
            } else {
              message(res.message, {
                type: "error",
                customClass: "el"
              });
            }
            done();
          });
        }
      });
    }
  });
};

const data = ref<{
  function: PluginInfo[];
  game: PluginInfo[];
  wordgame: PluginInfo[];
  all: PluginInfo[];
  install: PluginInfo[];
  uninstall: PluginInfo[];
  搜索: PluginInfo[];
}>({
  function: [],
  game: [],
  wordgame: [],
  all: [],
  install: [],
  uninstall: [],
  搜索: []
});

const addInstall = (name: string) => {
  const index = data.value.uninstall.findIndex(
    j => j.name.toLowerCase() === name.toLowerCase()
  );
  if (index !== -1) {
    data.value.install.push(data.value.uninstall[index]);
    data.value.uninstall.splice(index, 1);
  } else {
    data.value.install.push({
      name: name,
      title: name,
      link: "",
      authors: [],
      desc: ""
    });
  }
};

const removeInstall = (name: string) => {
  const index = data.value.install.findIndex(
    j => j.name.toLowerCase() === name.toLowerCase()
  );
  if (index !== -1) {
    data.value.uninstall.push(data.value.install[index]);
    data.value.install.splice(index, 1);
  }
};

getPluginList().then(res => {
  data.value.function = [...res.data.main, ...res.data.function];
  data.value.game = res.data.game;
  data.value.wordgame = res.data.wordgame;
  data.value.all = [
    ...data.value.function,
    ...data.value.game,
    ...data.value.wordgame
  ];
  // data.value.all.forEach(i => {
  //   if (res.data.install.includes(i.name)) {
  //     data.value.install.push(i);
  //   } else {
  //     data.value.uninstall.push(i);
  //   }
  // });
  // data.value.uninstall = data.value.all.filter(
  //   i => !res.data.install.some(j => j.toLowerCase() === i.name.toLowerCase())
  // );
  data.value.uninstall = [...data.value.all];
  res.data.install.forEach(addInstall);
  data.value.all.push(...data.value.install.filter(i => !i.link));
  loading.value = false;
});
</script>

<style scoped>
.el-link {
  margin-right: 10px;
}
.el-col {
  margin-bottom: 10px;
}
</style>
