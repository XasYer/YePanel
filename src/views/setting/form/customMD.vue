<script setup lang="ts">
import { ElInput, InputInstance } from "element-plus";
import {
  type PlusColumn,
  type FieldValues,
  PlusForm
} from "plus-pro-components";
import { nextTick, ref } from "vue";

// 声明 props 类型
export interface FormProps {
  formInline: {
    uin: string;
    id: string;
    keys: Array<string>;
  };
}

// 声明 props 默认值
// 推荐阅读：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({ uin: "", id: "", keys: [] })
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
  ],
  keys: [
    {
      required: true,
      message: "请输入模版key"
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
    label: "模版id",
    prop: "id",
    valueType: "input",
    fieldProps: {
      placeholder: "请输入模版id"
    }
  },
  {
    label: "模版key",
    prop: "keys"
  }
];

const inputValue = ref("");
const inputVisible = ref(false);
const InputRef = ref<InputInstance>();
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};
const handleInputConfirm = () => {
  if (inputValue.value) {
    const keys = newFormInline.value.keys as Array<string>;
    keys.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};
const inputWidth = ref(48);
const handleInput = () => {
  inputWidth.value = Math.max(inputValue.value.length * 9, 48);
};

const closeTag = (key: string) => {
  const keys = newFormInline.value.keys as Array<string>;
  keys.splice(keys.indexOf(key), 1);
};
</script>

<template>
  <div>
    <PlusForm
      ref="ruleFormRef"
      v-model="newFormInline"
      class="w-[90%]"
      label-position="right"
      :columns="columns"
      :rules="rules"
      :row-props="{ gutter: 10 }"
      :has-footer="false"
      labelWidth="90px"
    >
      <template #plus-field-keys>
        <el-tag
          v-for="(val, key) in newFormInline.keys"
          :key="key"
          class="mx-1 max-w-[100%] truncate"
          closable
          @close="closeTag(key)"
        >
          {{ val }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          :style="{ width: inputWidth + 'px' }"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
          @input="handleInput"
        />
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showInput"
        >
          新增
        </el-button>
      </template>
    </PlusForm>
  </div>
</template>
