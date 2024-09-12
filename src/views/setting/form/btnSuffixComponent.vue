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
    type: string;
    data: string;
    text: string;
    style?: number;
    clicked_text?: string;
    send?: boolean;
    permission?: string[];
    show?: {
      type: string;
      data: string | number;
    };
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    type: "",
    data: "",
    text: "",
    style: 0,
    clicked_text: "",
    send: false,
    permission: [],
    show: {
      type: "",
      data: ""
    }
  })
});

const newFormInline = ref<FieldValues>(props.formInline);

const ruleFormRef = ref();
function getRef() {
  return ruleFormRef.value.formInstance;
}

defineExpose({ getRef });

const rules = {
  type: [
    {
      required: true,
      message: "请选择按钮类型"
    }
  ],
  data: [
    {
      required: true,
      message: "请输入按钮数据"
    }
  ],
  text: [
    {
      required: true,
      message: "请输入按钮文本"
    }
  ]
};

const columns: PlusColumn[] = [
  {
    label: "text",
    prop: "text",
    valueType: "input",
    fieldProps: {
      placeholder: "请输入按钮文本"
    }
  },
  {
    label: "type",
    prop: "type",
    valueType: "select",
    options: [
      {
        label: "input",
        value: "input"
      },
      {
        label: "callback",
        value: "callback"
      },
      {
        label: "link",
        value: "link"
      }
    ],
    fieldProps: {
      placeholder: "请选择按钮类型"
    }
  },
  {
    label: "data",
    prop: "data",
    valueType: "input",
    fieldProps: {
      placeholder: "请输入按钮数据"
    }
  },
  {
    label: "style",
    prop: "style",
    valueType: "select",
    options: [
      {
        label: "灰色线条灰色字体",
        value: 0
      },
      {
        label: "蓝色线条蓝色字体",
        value: 1,
        color: "blue"
      },
      {
        label: "灰色线条红色字体",
        value: 3
      },
      {
        label: "蓝色背景白色字体",
        value: 4
      }
    ],
    fieldProps: {
      placeholder: "请选择按钮样式"
    }
  },
  {
    label: "clicked_text",
    prop: "clicked_text",
    valueType: "input",
    fieldProps: {
      placeholder: "请输入点击之后的按钮文本"
    }
  },
  {
    label: "send",
    prop: "send",
    valueType: "switch",
    fieldProps: {
      activeValue: true,
      inactiveValue: false
    },
    width: "100px"
  },
  {
    label: "permission",
    prop: "permission"
  },
  {
    label: "show.type",
    prop: "show.type",
    valueType: "select",
    options: [
      {
        label: "random",
        value: "random"
      }
    ],
    fieldProps: {
      placeholder: "达成什么条件显示"
    }
  },
  {
    label: "show.data",
    prop: "show.data",
    valueType: "input",
    fieldProps: {
      placeholder: "达成什么条件显示"
    }
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
    const keys = newFormInline.value.permission as Array<string>;
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
  const keys = newFormInline.value.permission as Array<string>;
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
      <template #plus-field-permission>
        <el-tag
          v-for="(val, key) in newFormInline.permission"
          :key="key"
          class="mx-1 max-w-[100%] truncate"
          closable
          @close="closeTag(val)"
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
