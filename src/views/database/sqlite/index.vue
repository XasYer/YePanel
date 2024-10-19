<template>
  <el-card v-loading="isLoading">
    <el-row :gutter="20" class="mb-[20px]">
      <el-col :xs="24" :lg="6">
        <div class="flex-c">
          <el-text tag="b" class="w-[60px]">数据源:</el-text>
          <el-select v-model="path">
            <el-option
              v-for="item in pathList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :xs="24" :lg="3">
        <div class="flex-c">
          <el-text tag="b" class="w-[50px]">表名:</el-text>
          <el-select v-model="table">
            <el-option
              v-for="item in tableList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :xs="24" :lg="6">
        <div class="flex-c">
          <el-text tag="b" class="w-[50px]">搜索:</el-text>
          <el-input v-model="searchInput" placeholder="支持模糊搜索">
            <template #prepend>
              <el-select
                v-model="searchColumn"
                placeholder="搜索列"
                style="width: 100px"
                multiple
                collapse-tags
                clearable
              >
                <el-option
                  v-for="item in showColumn"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </template>
            <template #append>
              <el-button
                :icon="Search"
                :disabled="!path"
                @click="handleSearch"
              />
            </template>
          </el-input>
        </div>
      </el-col>
      <el-col :xs="24" :lg="1">
        <div class="flex">
          <el-button
            type="success"
            :disabled="!path"
            @click="handleAdd('新增数据')"
            >新增</el-button
          >
          <el-popover
            placement="bottom"
            title="展示列"
            :width="150"
            trigger="click"
          >
            <template #reference>
              <el-button type="primary" :icon="Setting" />
            </template>
            <template #default>
              <el-scrollbar height="300px">
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                >
                  Check all
                </el-checkbox>
                <el-checkbox-group
                  v-model="showColumn"
                  class="flex flex-col"
                  @change="handleShowColumnChange"
                >
                  <el-checkbox
                    v-for="item in column"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-checkbox-group>
              </el-scrollbar>
            </template>
          </el-popover>
        </div>
      </el-col>
    </el-row>
    <div>
      <el-table
        ref="tableRef"
        :data="tableData"
        height="65vh"
        border
        stripe
        class="mb-[20px]"
      >
        <el-table-column
          v-for="item in showColumn"
          :key="item"
          :prop="item"
          :label="item"
          :show-overflow-tooltip="{
            effect: 'light'
          }"
        >
          <template #header="scope">
            <div class="flex">
              <iconify
                v-if="tableInfo[scope.column.label].pk"
                icon="mdi:primary-key"
                :width="24"
                :height="24"
                class="mr-[10px]"
              />
              <span class="mr-[10px]">{{ scope.column.label }} </span>
              <iconify
                v-if="privacyColumu.includes(scope.column.label)"
                icon="mdi:eye"
                :width="20"
                :height="20"
                class="cursor-pointer"
                @click="handlePrivacy(scope.column.label, true)"
              />
              <iconify
                v-else
                icon="mdi:eye-off"
                :width="20"
                :height="20"
                class="cursor-pointer"
                @click="handlePrivacy(scope.column.label, false)"
              />
            </div>
          </template>
          <template #default="scope">
            <el-text v-if="privacyColumu.includes(scope.column.label)">
              ***
            </el-text>
            <el-text v-else>
              {{ scope.row[scope.column.label] }}
            </el-text>
          </template>
        </el-table-column>
        <el-table-column v-if="path" fixed="right" label="操作" width="120px">
          <template #default="scope">
            <el-link
              :underline="false"
              type="primary"
              @click="handleAdd('修改数据', scope.row)"
            >
              编辑
            </el-link>
            <el-popconfirm
              title="确认删除吗？"
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-link :underline="false" type="danger">删除</el-link>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="flex flex-wrap justify-start"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import {
  deleteSqliteTableData,
  getSqlitePath,
  getSqliteTable,
  getSqliteTableData,
  setSqliteTableData
} from "@/api/database";
import { h, ref, watch } from "vue";
import { IconifyIconOnline as iconify } from "@/components/ReIcon";
import { Search, Setting } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import codeMirror from "./components/codeMirror.vue";
import { addDialog } from "@/components/ReDialog";
import add from "./components/add.vue";

defineOptions({
  name: "sqlite"
});

const isLoading = ref(true);

const path = ref<string>("");
const pathList = ref<string[]>([]);
const table = ref<string>("");
const tableList = ref<string[]>([]);
const tableData = ref<any[]>([]);
const total = ref(0);
const tableInfo = ref<{
  [key: string]: {
    pk: 0 | 1;
    name: string;
    type: string;
    notnull: 0 | 1;
    dflt_value: string;
    autoincrement: boolean;
  };
}>();

const checkAll = ref(false);
const isIndeterminate = ref(true);
const handleCheckAllChange = (val: boolean) => {
  showColumn.value = val ? column.value : [];
  isIndeterminate.value = false;
};
const column = ref<string[]>([]);
const showColumn = ref<string[]>([]);
const privacyColumu = ref<string[]>([]);
const handleShowColumnChange = (val: string[]) => {
  showColumn.value.sort(
    (a, b) => column.value.indexOf(a) - column.value.indexOf(b)
  );
};
const handlePrivacy = (column: string, isPrivacy: boolean) => {
  if (!isPrivacy) {
    privacyColumu.value.push(column);
  } else {
    privacyColumu.value = privacyColumu.value.filter(i => i !== column);
  }
};

const searchInput = ref<string>("");
const searchColumn = ref<string[]>();
const handleSearch = () => {
  if (!searchColumn.value.length && searchInput.value) {
    message("请选择搜索列", {
      type: "error",
      customClass: "el"
    });
  } else {
    currentPage.value = 1;
  }
};

const addDialogRef = ref<any>();
const showTip = ref(false);
const handleAdd = (title: string, row?: any) => {
  showTip.value = false;
  const type = title === "新增数据" ? "add" : "edit";
  addDialog({
    width: window.innerWidth < 992 ? "90%" : "50%",
    title,
    contentRenderer: () => h(add, { ref: addDialogRef }),
    props: {
      data: {
        columns: column.value,
        tableInfo: tableInfo.value,
        value:
          row ||
          column.value.reduce((acc, cur) => {
            acc[cur] = "";
            return acc;
          }, {}),
        type
      }
    },
    closeCallBack: ({ options, args }) => {
      if (args?.command === "sure") {
        const data = addDialogRef.value.getData();
        setSqliteTableData(path.value, table.value, data).then(res => {
          if (res.success) {
            message("操作成功~ Ciallo～(∠・ω< )⌒☆", {
              type: "success",
              customClass: "el"
            });
          } else {
            message(`操作失败: ${res.message}`, {
              type: "error",
              customClass: "el"
            });
          }
          getTableData();
        });
      }
    },
    beforeSure(done, { options, index }) {
      const FormRef = addDialogRef.value.getRef();
      FormRef.validate((valid: boolean) => {
        if (valid) {
          const data = addDialogRef.value.getData();
          for (const key in data) {
            if (data[key]) {
              done();
              return;
            }
          }
          if (showTip.value) {
            done();
            return;
          }
          message("真的什么都不填吗?", {
            type: "warning",
            customClass: "el"
          });
          showTip.value = true;
        }
      });
    }
  });
};

const handleDelete = (rows: any) => {
  deleteSqliteTableData(path.value, table.value, rows).then(res => {
    if (res.success) {
      message("删除成功~ Ciallo～(∠・ω< )⌒☆", {
        type: "success",
        customClass: "el"
      });
    } else {
      message(`删除失败: ${res.message}`, {
        type: "error",
        customClass: "el"
      });
    }
    getTableData();
  });
};

const currentPage = ref(1);
const pageSize = ref(20);

const handleSizeChange = (size: number) => {
  pageSize.value = size;
};
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};

getSqlitePath().then(res => {
  pathList.value = res.data;
  if (pageSize.value) {
    path.value = res.data[0];
  } else {
    isLoading.value = false;
  }
});

watch(path, () => {
  getSqliteTable(path.value).then(res => {
    table.value = res.data[0];
    tableList.value = res.data;
  });
});

watch([table, pageSize, currentPage], ([newTable], [oldTable]) => {
  if (newTable !== oldTable) {
    currentPage.value = 1;
  }
  getTableData();
});

watch(
  column,
  newVal =>
    (showColumn.value = newVal.filter(
      i => !["createdAt", "updatedAt"].includes(i)
    ))
);

const getTableData = () => {
  isLoading.value = true;
  let search = "";
  if (searchInput.value) {
    searchColumn.value.forEach(item => {
      search += `${item} LIKE '%${searchInput.value}%' OR `;
    });
    search = search.slice(0, -4);
  }
  getSqliteTableData(
    path.value,
    table.value,
    currentPage.value,
    pageSize.value,
    search
  ).then(res => {
    column.value = [];
    isLoading.value = false;
    tableData.value = res.data;
    tableInfo.value = res.tableInfo;
    total.value = res.total;
    column.value = Object.keys(res.tableInfo);
    searchColumn.value = [column.value[0]];
  });
};
</script>

<style scoped>
.el-link {
  margin-right: 10px;
}

.el-col {
  margin-bottom: 10px;
}
</style>
