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
    password: string;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({ uin: "", password: "" })
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
  password: [
    {
      required: true,
      message: "请输入密码"
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
    },
    renderField: (_, onChange) => {
      return h(ElInput, {
        onChange,
        disabled: newFormInline.value.uin === "default"
      });
    }
  },
  {
    label: "password",
    prop: "password",
    valueType: "input",
    fieldProps: {
      placeholder: "请输入密码"
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
