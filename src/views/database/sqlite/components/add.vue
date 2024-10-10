<template>
  <el-row justify="center">
    <el-col :lg="20" :xs="24">
      <PlusForm
        ref="ruleFormRef"
        v-model="data.value"
        :rules="rules"
        :columns="columns"
        inline-message
        labelWidth="120px"
        label-position="right"
        :has-footer="false"
      />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ElText } from "element-plus";
import {
  type FieldValues,
  FieldValueType,
  PlusColumn,
  PlusForm,
  PlusFormGroupRow
} from "plus-pro-components";
import { h, ref } from "vue";
import { IconifyIconOnline as iconify } from "@/components/ReIcon";

export interface DataProps {
  data: {
    column: string[];
    value: any;
    tableInfo: {
      [key: string]: {
        pk: 0 | 1;
        name: string;
        type: string;
        notnull: 0 | 1;
        dflt_value: string;
        autoincrement: boolean;
      };
    };
    type: "add" | "edit";
  };
}

const props = withDefaults(defineProps<DataProps>(), {
  data: () => ({
    column: [],
    value: "",
    tableInfo: {},
    type: "add"
  })
});

const data = ref<DataProps["data"]>(props.data);

const rules = ref({});
const columns = ref<PlusColumn[]>([]);

for (const key in data.value.tableInfo) {
  if (["createdAt", "updatedAt"].includes(key)) {
    continue;
  }
  const column: PlusColumn = {
    label: key,
    prop: key
  };
  column.fieldProps = {};
  if (data.value.tableInfo[key].notnull) {
    rules.value[key] = [{ required: true, message: `请填写${key}` }];
  }
  if (data.value.tableInfo[key].dflt_value && data.value.type === "add") {
    data.value.value[key] = data.value.tableInfo[key].dflt_value?.replace?.(
      /'/g,
      ""
    );
  }
  column.fieldProps.placeholder = `类型: ${data.value.tableInfo[key].type}`;
  if (data.value.tableInfo[key].autoincrement) {
    continue;
  }
  switch (getSQLiteStorageType(data.value.tableInfo[key].type)) {
    case "INTEGER":
      column.valueType = "input-number";
      break;
    case "TEXT":
      column.valueType = "textarea";
      column.fieldProps.autosize = { minRows: 2, maxRows: 10 };
      column.fieldProps.resize = "none";
      break;
    case "NUMERIC":
    case "BLOB":
    case "REAL":
    default:
      column.renderField = (value, onChange) =>
        h(
          ElText,
          { type: "warning" },
          `暂未适配本类型: ${data.value.tableInfo[key].type}`
        );
      break;
  }
  if (data.value.tableInfo[key].pk) {
    if (data.value.type === "edit") {
      column.fieldProps.disabled = true;
    } else if (!data.value.tableInfo[key].autoincrement) {
      rules.value[key] = [{ required: true, message: `请填写${key}` }];
    }
    column.renderLabel = () =>
      h("span", { class: "flex-c" }, [
        h(iconify, {
          icon: "mdi:primary-key",
          width: 18,
          height: 18
        }),
        h("span", {}, column.label as string)
      ]);
  }
  columns.value.push(column as any);
}

const ruleFormRef = ref();
function getRef() {
  return ruleFormRef.value.formInstance;
}

function getData() {
  return data.value.value;
}

defineExpose({ getRef, getData });

function getSQLiteStorageType(typeAlias: string) {
  const type = typeAlias.toUpperCase();

  if (type.includes("INT")) {
    return "INTEGER";
  } else if (
    type.includes("CHAR") ||
    type.includes("CLOB") ||
    type.includes("TEXT")
  ) {
    return "TEXT";
  } else if (type.includes("BLOB")) {
    return "BLOB";
  } else if (
    type.includes("REAL") ||
    type.includes("FLOA") ||
    type.includes("DOUB")
  ) {
    return "REAL";
  } else if (
    type.includes("NUMERIC") ||
    type.includes("DECIMAL") ||
    type.includes("BOOLEAN") ||
    type.includes("DATE")
  ) {
    return "NUMERIC";
  }

  // 默认情况返回 BLOB，因为未识别的类型在 SQLite 中通常按 BLOB 处理
  return "BLOB";
}
</script>
