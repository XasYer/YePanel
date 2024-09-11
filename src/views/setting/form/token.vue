<script setup lang="ts">
import { ElInput } from "element-plus";
import {
  type PlusColumn,
  type FieldValues,
  PlusForm
} from "plus-pro-components";
import { h, ref } from "vue";

export interface FormProps {
  formInline: {
    uin: string;
    appid: string;
    token: string;
    appSecret: string;
    isGroup: number;
    isPrivate: number;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    uin: "",
    appid: "",
    token: "",
    appSecret: "",
    isGroup: 0,
    isPrivate: 0
  })
});

const newFormInline = ref<FieldValues>(props.formInline);

const ruleFormRef = ref();
function getRef() {
  return ruleFormRef.value.formInstance;
}

defineExpose({ getRef });

const rules = {
  uin: [
    {
      required: true,
      message: "请输入机器人uin"
    }
  ],
  appid: [
    {
      required: true,
      message: "请输入机器人appid"
    }
  ],
  token: [
    {
      required: true,
      message: "请输入机器人token"
    }
  ],
  appSecret: [
    {
      required: true,
      message: "请输入机器人appSecret"
    }
  ]
};

const columns: PlusColumn[] = [
  {
    label: "uin",
    prop: "uin",
    valueType: "input",
    fieldProps: {
      placeholder: "请输入机器人uin"
    }
  },
  {
    label: "appid",
    prop: "appid",
    valueType: "input",
    fieldProps: {
      placeholder: "请输入机器人appid"
    }
  },
  {
    label: "token",
    prop: "token",
    valueType: "input",
    fieldProps: {
      placeholder: "请输入机器人token"
    }
  },
  {
    label: "appSecret",
    prop: "appSecret",
    valueType: "input",
    fieldProps: {
      placeholder: "请输入机器人appSecret"
    }
  },
  {
    label: "群Bot",
    prop: "isGroup",
    valueType: "switch",
    fieldProps: {
      activeValue: 1,
      inactiveValue: 0
    }
  },
  {
    label: "频道私域",
    prop: "isPrivate",
    valueType: "switch",
    fieldProps: {
      activeValue: 1,
      inactiveValue: 0
    }
  }
];
</script>

<template>
  <div>
    <PlusForm
      ref="ruleFormRef"
      v-model="newFormInline"
      class="w-[90%]"
      :columns="columns"
      label-position="right"
      :rules="rules"
      :row-props="{ gutter: 10 }"
      :has-footer="false"
      labelWidth="90px"
    />
  </div>
</template>
