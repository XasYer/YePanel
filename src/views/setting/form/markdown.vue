<script setup lang="ts">
import { ElInput } from "element-plus";
import {
  type PlusColumn,
  type FieldValues,
  PlusForm
} from "plus-pro-components";
import { h, ref } from "vue";

// 声明 props 类型
export interface FormProps {
  formInline: {
    uin: string;
    id: string;
  };
}

// 声明 props 默认值
// 推荐阅读：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({ uin: "", id: "" })
});

// vue 规定所有的 prop 都遵循着单向绑定原则，直接修改 prop 时，Vue 会抛出警告。此处的写法仅仅是为了消除警告。
// 因为对一个 reactive 对象执行 ref，返回 Ref 对象的 value 值仍为传入的 reactive 对象，
// 即 newFormInline === props.formInline 为 true，所以此处代码的实际效果，仍是直接修改 props.formInline。
// 但该写法仅适用于 props.formInline 是一个对象类型的情况，原始类型需抛出事件
// 推荐阅读：https://cn.vuejs.org/guide/components/props.html#one-way-data-flow
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
  id: [
    {
      required: true,
      message: "请输入模版id"
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
    renderLabel: value => {
      if (newFormInline.value.uin === "template") {
        return "通用模版:";
      } else {
        return value;
      }
    },
    renderField: (_, onChange) => {
      if (newFormInline.value.uin === "template") {
        return h(ElInput, {
          onChange,
          disabled: true
        });
      } else {
        return h(ElInput, {
          onChange
        });
      }
    }
  },
  {
    label: "模版id",
    prop: "id",
    valueType: "input",
    fieldProps: {
      placeholder: "请输入模版id"
    },
    renderLabel: value => {
      if (newFormInline.value.uin === "template") {
        return "模版参数:";
      } else {
        return value;
      }
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
