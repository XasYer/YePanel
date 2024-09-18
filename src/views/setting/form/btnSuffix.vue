<script setup lang="ts">
import { ElInput, InputInstance } from "element-plus";
import {
  type PlusColumn,
  type FieldValues,
  PlusForm
} from "plus-pro-components";
import { h, nextTick, ref, toRaw } from "vue";
import component, {
  type FormProps as ComponentFormProps
} from "./btnSuffixComponent.vue";
import { addDialog } from "@/components/ReDialog";

export interface FormProps {
  formInline: {
    uin: string;
    position: string;
    values: Array<ComponentFormProps["formInline"]>;
  };
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({ uin: "", position: "", values: [] })
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
  position: [
    {
      required: true,
      message: "请选择位置"
    }
  ],
  values: [
    {
      required: true,
      message: "请输入按钮模版"
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
    label: "位置",
    prop: "position",
    valueType: "select",
    options: Array.from({ length: 5 }, (_, index) => ({
      label: `第${index + 1}行`,
      value: index + 1
    })),
    fieldProps: {
      placeholder: "请选择位置"
    }
  },
  {
    label: "按钮模版",
    prop: "values"
  }
];

const componentFormRef = ref();
const showDialog = (title: string, index?: number) => {
  const props: ComponentFormProps = {
    formInline: {
      type: "input",
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
    }
  };
  if (index > -1 && newFormInline.value.values[index]) {
    props.formInline = newFormInline.value.values[index];
    props.formInline.send = !!props.formInline.send;
  }
  addDialog({
    width:
      window.innerWidth < 992
        ? "90%"
        : window.innerWidth <= 1200
          ? "50%"
          : "25%",
    title: title + "按钮",
    contentRenderer: () => h(component, { ref: componentFormRef }),
    props,
    closeCallBack: ({ options, args }) => {
      const { formInline } = options.props as ComponentFormProps;
      if (args?.command === "sure") {
        const arr = newFormInline.value.values as Array<
          ComponentFormProps["formInline"]
        >;
        if (index > -1) {
          arr.splice(index, 1, formInline);
        } else {
          arr.push(formInline);
        }
      }
    },
    beforeSure: (done, { options, index }) => {
      const FormRef = componentFormRef.value.getRef(options);
      FormRef.validate((valid: boolean) => {
        if (valid) {
          done();
        }
      });
    },
    draggable: true,
    closeOnClickModal: false
  });
};

const closeTag = (index: number) => {
  const keys = newFormInline.value.values as Array<string>;
  keys.splice(index, 1);
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
      <template #plus-field-values>
        <el-tag
          v-for="(val, key) in newFormInline.values as any[]"
          :key="key"
          class="mx-1 max-w-[100%] cursor-pointer"
          closable
          @close="closeTag(key)"
          @click="showDialog('修改', key)"
        >
          {{ val.type + ":" + val.text }}
        </el-tag>
        <el-button
          class="button-new-tag"
          size="small"
          @click="showDialog('增加')"
        >
          新增
        </el-button>
      </template>
    </PlusForm>
  </div>
</template>
