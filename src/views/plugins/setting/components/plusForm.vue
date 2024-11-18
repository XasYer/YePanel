<template>
  <PlusForm
    v-model="state"
    :rules="rules"
    :group="group"
    inline-message
    :label-position="labelPosition"
    resetText="重置"
    submitText="保存"
    footerAlign="center"
    class="mt-5"
    labelWidth="30%"
    :submitLoading="submitLoading"
    @submit="submit"
    @submit-error="handleSubmitError"
    @reset="getData"
  />
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { PlusColumn, PlusForm, PlusFormGroupRow } from "plus-pro-components";
import { computed, h, onErrorCaptured, onMounted, ref, VNode } from "vue";
import { clone } from "@pureadmin/utils";
import {
  ElInput,
  ElInputNumber,
  ElSelectV2,
  ElSwitch,
  ElTag,
  ElText,
  ElTooltip
} from "element-plus";
import {
  getGroupList,
  getFriendList,
  setSettingData,
  getGuobaData
} from "@/api/plugins";
import { message } from "@/utils/message";

const props = defineProps({
  pluginName: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const labelPosition = ref<"right" | "top">(
  window.innerWidth > 768 ? "right" : "top"
);

const emit = defineEmits(["update:loading"]);

const loading = computed({
  get: () => props.loading,
  set: value => emit("update:loading", value)
});

const schemas = ref(null);

const state = ref(null);
const data = ref(null);

getGuobaData(props.pluginName).then(res => {
  state.value = clone(res.data, true);
  data.value = clone(res.data, true);
  schemas.value = res.schemas;
  schemas.value.forEach(schema => {
    const columns: PlusColumn = {
      label: schema.label,
      prop: schema.field,
      colProps: {
        span: 24,
        className: "w-[80%]"
      },
      tooltip: schema.helpMessage,
      renderLabel
    };
    columns.fieldProps = {};
    if (schema.componentProps) {
      columns.fieldProps.placeholder = schema.componentProps.placeholder;
    }
    switch (schema.component) {
      case "InputPassword":
        columns.fieldProps.type = "password";
      case "InputTextArea":
        columns.fieldProps.type ||= "textarea";
      case "Input":
        columns.valueType = "input";
        columns.fieldProps.clearable = true;
        break;
      case "InputNumber":
        columns.valueType = "input-number";
        columns.fieldProps.controlsPosition = "right";
        columns.renderField = (value, onChange) =>
          h(ElInputNumber, {
            value,
            onChange,
            class: "w-[51%]"
          });
        break;
      case "Select":
        columns.valueType = "select";
        columns.renderField = (value, onChange) => {
          return h(ElSelectV2, {
            value,
            onChange,
            filterable: true,
            tagType: "primary",
            clearable: true,
            multiple:
              schema.componentProps.mode === "multiple" ||
              schema.componentProps.multiple,
            options: schema.componentProps.options
          });
        };
        break;
      case "RadioGroup":
        columns.valueType = "radio";
        columns.options = schema.componentProps.options;
        break;
      case "Checkbox":
        columns.valueType = "checkbox";
        columns.options = schema.componentProps.options;
      case "Switch":
        columns.valueType = "switch";
        break;
      case "Slider":
        columns.valueType = "slider";
        break;
      case "Rate":
        columns.valueType = "rate";
        break;
      case "Divider":
        if (columnsCache.columns.length > 0) {
          group.value.push(clone(columnsCache, true));
          columnsCache.columns = [];
          columnsCache.title = "";
        }
        columnsCache.title = schema.label;
        return;
      case "GSelectGroup":
      case "GSelectFriend": {
        const options = ref([]);
        (schema.component === "GSelectGroup" ? getGroupList() : getFriendList())
          .then(res => {
            options.value = res.data;
          })
          .catch(() => {});
        columns.renderField = (value, onChange) => {
          return h(ElSelectV2, {
            value,
            onChange,
            filterable: true,
            tagType: "primary",
            clearable: true,
            multiple: true,
            options: options.value
          });
        };
        break;
      }
      case "GTags":
        columns.valueType = "plus-input-tag";
        columns.fieldProps = {
          ...columns.fieldProps,
          trigger: ["blur", "enter"],
          inputProps: {
            placeholder: "输入内容后按回车或别处进行添加"
          },
          formatTag(value: string) {
            if (value.length > 20) {
              return `${value.slice(0, 20)}...`;
            }
            return value;
          }
        };
        break;
      case "GSubForm": // TODO
      case "GColorPicker":
      case "EasyCron":
      case "InputGroup":
      case "InputSearch":
      case "InputCountDown":
      case "ApiSelect":
      case "TreeSelect":
      case "ApiTree":
      case "ApiTreeSelect":
      case "ApiRadioGroup":
      case "RadioButtonGroup":
      case "AutoComplete":
      case "ApiCascader":
      case "CheckboxGroup":
      case "Cascader":
      case "DatePicker":
      case "MonthPicker":
      case "RangePicker":
      case "WeekPicker":
      case "TimePicker":
      case "StrengthMeter":
      case "Upload":
      case "IconPicker":
      case "ApiTransfer":
      default:
        columns.renderField = (value, onChange) =>
          h(ElText, { type: "warning" }, "暂未适配本组件");
        break;
    }
    if (schema.bottomHelpMessage) {
      columns.renderExtra = () => schema.bottomHelpMessage;
      columns.colProps.className += " __mb-0 ";
    }
    columns.fieldProps = {
      ...columns.fieldProps,
      ...schema.componentProps
    };
    columns.fieldSlots = {
      ...columns.fieldSlots,
      suffix: () => schema.componentProps?.addonAfter,
      prefix: () => schema.componentProps?.addonBefore
    };
    columnsCache.columns.push(columns);
    if (schema.required) {
      rules.value[schema.field] = [
        { required: true, message: `请输入 ${schema.label}` }
      ];
    }
  });

  if (columnsCache.columns.length > 0) {
    group.value.push(columnsCache as any);
  }
  loading.value = false;
});
const rules = ref({});
const group = ref<PlusFormGroupRow[]>([]);

const renderLabel = (label: string) => {
  return h(ElTooltip, { content: label, placement: "top", effect: "light" }, [
    h(
      ElText,
      {
        truncated: true,
        class: "max-w-[190px] text-right"
      },
      label
    ),
    h("br")
  ]);
};

const columnsCache: PlusFormGroupRow = {
  title: "",
  columns: []
};

const submitLoading = ref(false);

const submit = () => {
  const data = {};
  schemas.value.forEach(i => {
    if (i.field) {
      data[i.field] = (i.field as string)
        .split(".")
        .reduce((acc, key) => acc && acc[key], state.value);
    }
  });
  setSettingData(props.pluginName, data).then(res => {
    message(res.message, {
      type: "success",
      customClass: "el"
    });
  });
};
const handleSubmitError = () => {};
const getData = () => {
  state.value = clone(data.value, true);
};

defineExpose({ getData, submit });
</script>

<style>
.plus-form-item-extra {
  margin-left: 30% !important;
}

.__mb-0 > :first-child {
  margin-bottom: 0 !important;
}
</style>
