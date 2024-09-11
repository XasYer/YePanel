<script setup lang="ts">
import { ElInput, InputInstance } from "element-plus";
import {
  type PlusColumn,
  type FieldValues,
  PlusForm
} from "plus-pro-components";
import { nextTick, ref } from "vue";

export interface FormProps {
  formInline: {
    uin: string;
    val: Array<string>;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({ uin: "", val: [] })
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
  val: [
    {
      required: true,
      message: "请输入需要过滤的日志"
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
    label: "过滤日志",
    prop: "val"
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
    const keys = newFormInline.value.val as Array<string>;
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
  const keys = newFormInline.value.val as Array<string>;
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
      <template #plus-field-val>
        <el-tag
          v-for="(val, key) in newFormInline.val"
          :key="key"
          class="mx-1"
          style=""
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
