<script setup lang="ts">
import { InputInstance } from "element-plus";
import {
  type PlusColumn,
  type FieldValues,
  PlusForm
} from "plus-pro-components";
import { h, nextTick, ref, reactive } from "vue";
import CircleClose from "@/assets/svg/circle-close.svg?component";

export interface FormProps {
  formInline: {
    uin: string;
    val: Array<{ key: string; values: Array<string> }>;
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

const rules = reactive({
  uin: [
    {
      required: true,
      message: "请输入机器人uin"
    }
  ],
  default: [
    {
      required: !newFormInline.value.uin,
      message: "请输入对应参数"
    }
  ]
});

const columns = ref<PlusColumn[]>([
  {
    label: "uin",
    prop: "uin",
    valueType: "input",
    fieldProps: {
      placeholder: "请输入机器人uin"
    }
  },
  {
    label: "default",
    prop: "default"
  }
]);

const inputValue = ref("");
const inputVisible = ref(false);
const InputRef = ref<InputInstance>();
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};
const closeItem = (key: string) => {
  const arr = newFormInline.value.val as Array<any>;
  arr.splice(
    arr.findIndex(i => i.key == key),
    1
  );
  columns.value.splice(
    columns.value.findIndex(i => i.prop == key),
    1
  );
  if (columns.value.length === 2) {
    rules.default[0].required = true;
    delete newFormInline.value.default;
  }
};

const addColumn = (key: string, values: string) => {
  const index = columns.value.findIndex(i => i.prop == key);
  columns.value.splice(
    index > -1 ? index : columns.value.length - 1,
    index > -1 ? 1 : 0,
    {
      label: key,
      prop: key,
      renderField: () => {
        return h(
          "div",
          { class: "flex justify-between items-center max-w-[100%]" },
          [
            h("div", { class: "mr-5 break-all" }, values.replace(/\r/g, "\\r")),
            h(
              "div",
              { class: "cursor-pointer", onClick: () => closeItem(key) },
              [h(CircleClose)]
            )
          ]
        );
      },
      renderLabel: value => {
        return h("div", { class: "truncate ... w-[90px] text-right" }, value);
      }
    }
  );
};

for (const i of newFormInline.value.val as Array<any>) {
  addColumn(i.key, i.values[0]);
}

const handleInputConfirm = (target: "key" | "value") => {
  switch (target) {
    case "key":
      if (!keyInputValue.value) return;
      keyInputVisible.value = false;
      break;
    case "value":
      if (!valueInputValue.value) return;
      valueInputVisible.value = false;
      break;
  }
  if (!keyInputVisible.value && !valueInputVisible.value) {
    const val = newFormInline.value.val as Array<any>;
    const values = valueInputValue.value;
    const key = keyInputValue.value;
    val.push({
      key: key,
      values: [values]
    });
    addColumn(key, values);
    keyInputValue.value = "";
    valueInputValue.value = "";
    keyInputVisible.value = true;
    valueInputVisible.value = true;
    if (!newFormInline.value.default) {
      newFormInline.value.default = true;
      rules.default[0].required = false;
    }
    // console.log(newFormInline.value);
  }
};
const keyInputVisible = ref(true);
const keyInputValue = ref("");
const valueInputVisible = ref(true);
const valueInputValue = ref("");
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
      <template #plus-label-default>
        <el-input
          v-if="keyInputVisible"
          v-model="keyInputValue"
          placeholder="参数名"
          @keyup.enter="handleInputConfirm('key')"
          @blur="handleInputConfirm('key')"
        />
        <div v-else class="truncate ... w-[70px] text-right">
          {{ keyInputValue }}
        </div>
        :
      </template>
      <template #plus-field-default>
        <el-input
          v-if="valueInputVisible"
          v-model="valueInputValue"
          placeholder="参数值"
          autosize
          type="textarea"
          @keyup.enter="handleInputConfirm('value')"
          @blur="handleInputConfirm('value')"
        />
        <div v-else class="break-all">{{ valueInputValue }}</div>
      </template>
    </PlusForm>
  </div>
</template>
