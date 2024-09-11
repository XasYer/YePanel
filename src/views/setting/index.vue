<script setup lang="ts">
import { h, ref } from "vue";
import "plus-pro-components/es/components/form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusForm,
  PlusFormGroupRow
} from "plus-pro-components";
import markdown, {
  type FormProps as MarkdownFormProps
} from "./form/markdown.vue";
import customMD, {
  type FormProps as CustomMDFormProps
} from "./form/customMD.vue";
import mdSuffix, {
  type FormProps as MdSuffixFormProps
} from "./form/mdSuffix.vue";
import filterLog, {
  type FormProps as FilterLogFormProps
} from "./form/filterLog.vue";
import btnSuffix, {
  type FormProps as BtnSuffixFormProps
} from "./form/btnSuffix.vue";
import password, {
  type FormProps as PasswordFormProps
} from "./form/password.vue";

import token, { type FormProps as TokenFormProps } from "./form/token.vue";
import { addDialog } from "@/components/ReDialog";
import { getSettingData, setSetting } from "@/api/setting";
import { message } from "@/utils/message";
import { clone } from "@pureadmin/utils";

defineOptions({
  name: "setting"
});

// 表单绑定值
const state = ref({
  permission: "",
  toQRCode: "",
  toCallback: false,
  toBotUpload: false,
  hideGuildRecall: false,
  toQQUin: false,
  toImg: false,
  sendButton: false,
  callStats: false,
  userStats: false,
  simplifiedSdkLog: false,
  markdownImgScale: false,
  sep: "",
  bot: {
    sandbox: false,
    maxRetry: 0,
    timeout: 0
  },
  dauDB: "level",
  markdown: {},
  customMD: {},
  mdSuffix: {},
  filterLog: {},
  btnSuffix: {},
  token: [],
  web: {
    password: {}
  }
});

const getData = () => {
  getSettingData()
    .then(res => res.data)
    .then(data => {
      for (const key in data) {
        state.value[key] = data[key];
      }
      state.value.token = [];
      for (const i of data.token as string[]) {
        const [uin, appid, token, appSecret, isGroup, isPrivate] = i.split(":");
        state.value.token.push({
          uin,
          appid,
          token,
          appSecret,
          isGroup: Number(isGroup),
          isPrivate: Number(isPrivate)
        });
      }
      for (const key in state.value.btnSuffix) {
        const i = state.value.btnSuffix[key].values[0];
        for (const k of ["input", "callback", "link"]) {
          if (i[k]) {
            i.type = k;
            i.data = i[k];
            break;
          }
        }
      }
    });
};

getData();

// 表单校验规则
const rules = {
  permission: [
    {
      required: true,
      message: "请选择权限"
    }
  ],
  dauDB: [
    {
      required: true,
      message: "请选择dau数据库"
    }
  ]
};

const fieldProps = {
  activeValue: true,
  inactiveValue: false
};

const group: PlusFormGroupRow[] = [
  {
    title: "基础设置",
    columns: [
      {
        label: "权限",
        prop: "permission",
        valueType: "radio",
        options: [
          {
            label: "master",
            value: "master"
          },
          {
            label: "owner",
            value: "owner"
          },
          {
            label: "admin",
            value: "admin"
          },
          {
            label: "all",
            value: "all"
          }
        ],
        colProps: {
          span: 12
        }
      },
      {
        label: "dau数据库",
        prop: "dauDB",
        valueType: "radio",
        tooltip: "重启后生效",
        options: [
          {
            label: "level",
            value: "level"
          },
          {
            label: "redis",
            value: "redis"
          },
          {
            label: "关闭",
            value: false
          }
        ],
        colProps: {
          span: 12
        }
      },
      {
        label: "md图片缩放",
        prop: "markdownImgScale",
        valueType: "input-number",
        fieldProps: {
          precision: 1,
          step: 0.1
        },
        colProps: {
          span: 12
        }
      },
      {
        label: "ID分隔符",
        prop: "sep",
        valueType: "input",
        tooltip: "重启后生效",
        colProps: {
          span: 11
        },
        fieldProps: {
          placeholder: "可为空"
        }
      },
      {
        label: "链接正则",
        prop: "toQRCode",
        valueType: "input",
        tooltip: "发送url需要备案,匹配url转换二维码",
        fieldProps: {
          placeholder: "请输入正则或为空关闭"
        },
        colProps: {
          span: 23
        }
      }
    ]
  },
  {
    title: "扩展功能",
    columns: [
      {
        label: "按钮回调",
        prop: "toCallback",
        valueType: "switch",
        fieldProps,
        colProps: {
          span: 6
        }
      },
      {
        label: "上传图片",
        prop: "toBotUpload",
        valueType: "switch",
        tooltip: "使用其他Bot上传图链",
        fieldProps,
        colProps: {
          span: 6
        }
      },
      {
        label: "隐藏频道撤回",
        prop: "hideGuildRecall",
        valueType: "switch",
        fieldProps,
        colProps: {
          span: 6
        }
      },
      {
        label: "真实QQ",
        prop: "toQQUin",
        valueType: "switch",
        tooltip: "配合ws-plugin的绑定",
        fieldProps,
        colProps: {
          span: 6
        }
      },
      {
        label: "转发消息转图",
        prop: "toImg",
        valueType: "switch",
        fieldProps,
        colProps: {
          span: 6
        }
      },
      {
        label: "发送按钮",
        prop: "sendButton",
        valueType: "switch",
        tooltip: "没有自定义按钮权限请关闭此项",
        fieldProps,
        colProps: {
          span: 6
        }
      },
      {
        label: "调用统计",
        prop: "callStats",
        valueType: "switch",
        fieldProps,
        colProps: {
          span: 6
        }
      },
      {
        label: "用户统计",
        prop: "userStats",
        valueType: "switch",
        fieldProps,
        colProps: {
          span: 6
        }
      }
    ]
  },
  {
    title: "高阶功能",
    columns: [
      {
        label: "markdown",
        prop: "markdown",
        tooltip: "是否开启全局md",
        colProps: {
          span: 11
        }
      },
      {
        label: "md模版",
        prop: "customMD",
        colProps: {
          span: 12
        }
      },
      {
        label: "md附加值",
        prop: "mdSuffix",
        colProps: {
          span: 11
        }
      },
      {
        label: "按钮附加值",
        prop: "btnSuffix",
        colProps: {
          span: 12
        }
      }
    ]
  },
  {
    title: "日志相关",
    columns: [
      {
        label: "缩短日志",
        prop: "simplifiedSdkLog",
        valueType: "switch",
        fieldProps,
        tooltip: "缩短sdk的日志",
        width: 500,
        colProps: {
          span: 6
        }
      },
      {
        label: "过滤日志",
        prop: "filterLog",
        colProps: {
          span: 18
        }
      }
    ]
  },
  {
    title: "sdk相关",
    columns: [
      {
        label: "沙盒模式",
        prop: "bot.sandbox",
        valueType: "switch",
        tooltip: "重启后生效",
        fieldProps,
        colProps: {
          span: 6
        }
      },
      {
        label: "最大重连次数",
        prop: "bot.maxRetry",
        valueType: "input-number",
        tooltip: "为0则无限重连",
        colProps: {
          span: 8
        }
      },
      {
        label: "请求超时时间",
        prop: "bot.timeout",
        valueType: "input-number",
        tooltip: "重启后生效",
        colProps: {
          span: 8
        }
      }
    ]
  },
  {
    title: "核心功能",
    columns: [
      {
        label: "token",
        prop: "token",
        tooltip: "重启后生效",
        colProps: {
          span: 11
        }
      },
      {
        label: "web密码",
        prop: "password",
        tooltip: "重启后生效",
        colProps: {
          span: 12
        }
      }
    ]
  }
];

const submitLoading = ref(false);
const handleSubmit = (values: FieldValues) => {
  submitLoading.value = true;
  const data = clone(values, true) as any;
  data.token = data.token.map(
    i =>
      `${i.uin}:${i.appid}:${i.token}:${i.appSecret}:${i.isGroup}:${i.isPrivate}`
  );
  for (const key in data.btnSuffix) {
    const i = data.btnSuffix[key].values[0];
    for (const type of ["input", "callback", "link"]) {
      if (i.type === type) {
        i[type] = i.data;
        delete data.btnSuffix[key].values[0].type;
        delete data.btnSuffix[key].values[0].data;
        for (const val in data.btnSuffix[key].values[0]) {
          const v = data.btnSuffix[key].values[0][val];
          if ((Array.isArray(v) && !v.length) || !v) {
            delete data.btnSuffix[key].values[0][val];
          }
        }
        break;
      }
    }
  }
  setSetting(data).then(res => {
    if (res.success) {
      message("保存成功~ Ciallo～(∠・ω< )⌒☆'", {
        customClass: "el",
        type: "success"
      });
    } else {
      message("保存失败: " + res.message, { customClass: "el", type: "error" });
    }
    submitLoading.value = false;
  });
};
const handleSubmitError = (err: any) => {
  console.log(err, "err");
};

const closeTag = (tag: string) => {
  const [key, value] = tag.split(":");
  delete state.value[key][value];
};

const closePasswordTag = (tag: string) => {
  delete state.value.web.password[tag];
};

const closeTokenTag = (tag: string) => {
  const keys = state.value.token as Array<TokenFormProps["formInline"]>;
  const index = keys.findIndex(item => item.uin == tag);
  if (index > -1) {
    keys.splice(index, 1);
  }
};

const markdownFormRef = ref();
const showMarkdownDialog = (title: string, key: string | null) => {
  const formInline = {
    uin: "",
    id: ""
  };
  if (key && state.value.markdown[key]) {
    formInline.uin = key;
    formInline.id = state.value.markdown[key];
  }
  addDialog({
    width: "25%",
    title: title + "markdown模版",
    contentRenderer: () => h(markdown, { ref: markdownFormRef }),
    props: {
      // 赋默认值
      formInline
    },
    closeCallBack: ({ options, args }) => {
      // options.props 是响应式的
      const { formInline } = options.props as MarkdownFormProps;
      if (args?.command === "sure") {
        state.value.markdown[formInline.uin] = formInline.id;
      }
    },
    beforeSure: (done, { options, index }) => {
      const FormRef = markdownFormRef.value.getRef(options);
      FormRef.validate((valid: boolean) => {
        if (valid) {
          done();
        }
      });
    },
    draggable: true
  });
};

const customMDFormRef = ref();
const showCustomMDDialog = (title: string, key: string | null) => {
  const formInline = {
    uin: "",
    id: "",
    keys: []
  };
  if (key && state.value.customMD[key]) {
    formInline.uin = key;
    formInline.id = state.value.customMD[key].custom_template_id;
    formInline.keys = state.value.customMD[key].keys;
  }
  addDialog({
    width: "25%",
    title: title + "自定义markdown模版",
    contentRenderer: () => h(customMD, { ref: customMDFormRef }),
    props: {
      // 赋默认值
      formInline
    },
    closeCallBack: ({ options, args }) => {
      // options.props 是响应式的
      const { formInline } = options.props as CustomMDFormProps;
      if (args?.command === "sure") {
        state.value.customMD[formInline.uin] = {
          custom_template_id: formInline.id,
          keys: formInline.keys
        };
      }
    },
    beforeSure: (done, { options, index }) => {
      const FormRef = customMDFormRef.value.getRef(options);
      FormRef.validate((valid: boolean) => {
        if (valid) {
          done();
        }
      });
    },
    draggable: true
  });
};

const mdSuffixMDFormRef = ref();
const showMdSuffixDialog = (title: string, key: string | null) => {
  const props: MdSuffixFormProps = {
    formInline: {
      uin: "",
      val: []
    }
  };
  if (key && state.value.mdSuffix[key]) {
    props.formInline.uin = key;
    props.formInline.val = state.value.mdSuffix[key];
  }
  addDialog({
    width: "25%",
    title: title + "自定义markdown附加值",
    contentRenderer: () => h(mdSuffix, { ref: mdSuffixMDFormRef }),
    props,
    closeCallBack: ({ options, args }) => {
      // options.props 是响应式的
      const { formInline } = options.props as MdSuffixFormProps;
      if (args?.command === "sure") {
        state.value.mdSuffix[formInline.uin] = formInline.val;
      }
    },
    beforeSure: (done, { options, index }) => {
      const FormRef = mdSuffixMDFormRef.value.getRef(options);
      FormRef.validate((valid: boolean) => {
        if (valid) {
          done();
        }
      });
    },
    draggable: true
  });
};

const tokenFormRef = ref();
const showTokenDialog = (title: string, key: string | null) => {
  const props: TokenFormProps = {
    formInline: {
      uin: "",
      token: "",
      appid: "",
      appSecret: "",
      isGroup: 0,
      isPrivate: 0
    }
  };
  if (key) {
    for (const i of state.value.token as any[]) {
      if (i.uin == key) {
        props.formInline = i;
      }
    }
  }
  addDialog({
    width: "25%",
    title: title + "Token",
    contentRenderer: () => h(token, { ref: tokenFormRef }),
    props,
    closeCallBack: ({ options, args }) => {
      // options.props 是响应式的
      const { formInline } = options.props as TokenFormProps;
      if (args?.command === "sure") {
        const token = state.value.token as Array<TokenFormProps["formInline"]>;
        const index = token.findIndex(item => item.uin == key);
        if (index > -1) {
          token[index] = formInline;
        } else {
          token.push(formInline);
        }
      }
    },
    beforeSure: (done, { options, index }) => {
      const FormRef = tokenFormRef.value.getRef(options);
      FormRef.validate((valid: boolean) => {
        if (valid) {
          done();
        }
      });
    },
    draggable: true
  });
};

const btnSuffixFormRef = ref();
const showBtnSuffixDialog = (title: string, key: string | null) => {
  const props = {
    formInline: {
      uin: "",
      position: 1,
      values: []
    }
  };
  if (key && state.value.btnSuffix[key]) {
    props.formInline = state.value.btnSuffix[key];
    props.formInline.uin = key;
  }
  addDialog({
    width: "25%",
    title: title + "自定义按钮附加值",
    contentRenderer: () => h(btnSuffix, { ref: btnSuffixFormRef }),
    props,
    closeCallBack: ({ options, args }) => {
      const { formInline } = options.props as BtnSuffixFormProps;
      if (args?.command === "sure") {
        console.log(formInline);
        state.value.btnSuffix[formInline.uin] = {
          position: formInline.position,
          values: formInline.values
        };
      }
    },
    beforeSure: (done, { options, index }) => {
      const FormRef = btnSuffixFormRef.value.getRef(options);
      FormRef.validate((valid: boolean) => {
        if (valid) {
          done();
        }
      });
    },
    draggable: true
  });
};

const filterLogFormRef = ref();
const showFilterLogDialog = (title: string, key: string | null) => {
  const formInline = {
    uin: "",
    val: []
  };
  if (key && state.value.filterLog[key]) {
    formInline.uin = key;
    formInline.val = state.value.filterLog[key];
  }
  addDialog({
    width: "25%",
    title: title + "过滤日志",
    contentRenderer: () => h(filterLog, { ref: filterLogFormRef }),
    props: {
      // 赋默认值
      formInline
    },
    closeCallBack: ({ options, args }) => {
      // options.props 是响应式的
      const { formInline } = options.props as FilterLogFormProps;
      if (args?.command === "sure") {
        state.value.filterLog[formInline.uin] = formInline.val;
      }
    },
    beforeSure: (done, { options, index }) => {
      const FormRef = filterLogFormRef.value.getRef(options);
      FormRef.validate((valid: boolean) => {
        if (valid) {
          done();
        }
      });
    },
    draggable: true
  });
};

const passwordFormRef = ref();
const showPasswordDialog = (title: string, key: string | null) => {
  const formInline = {
    uin: "",
    password: ""
  };
  if (key && state.value.web.password[key]) {
    formInline.uin = key;
    formInline.password = state.value.web.password[key];
  }
  addDialog({
    width: "25%",
    title: title + "web密码",
    contentRenderer: () => h(password, { ref: passwordFormRef }),
    props: {
      // 赋默认值
      formInline
    },
    closeCallBack: ({ options, args }) => {
      // options.props 是响应式的
      const { formInline } = options.props as PasswordFormProps;
      if (args?.command === "sure") {
        state.value.web.password[formInline.uin] = formInline.password;
      }
    },
    beforeSure: (done, { options, index }) => {
      const FormRef = passwordFormRef.value.getRef();
      FormRef.validate((valid: boolean) => {
        if (valid) {
          done();
        }
      });
    },
    draggable: true
  });
};
</script>

<template>
  <div>
    <PlusForm
      v-model="state"
      class="w-[1000px] m-auto"
      :rules="rules"
      :group="group"
      :row-props="{ gutter: 10 }"
      label-position="right"
      resetText="重置"
      submitText="保存"
      footerAlign="center"
      labelWidth="120px"
      :submitLoading="submitLoading"
      @submit="handleSubmit"
      @submit-error="handleSubmitError"
      @reset="getData"
    >
      <template #plus-field-markdown>
        <el-tag
          v-for="(val, key) in state.markdown"
          :key="key"
          class="mx-1 cursor-pointer mt-1"
          :closable="key !== 'template'"
          @close="closeTag('markdown:' + key)"
          @click="showMarkdownDialog('修改', String(key))"
        >
          {{ key }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showMarkdownDialog('增加', null)"
        >
          新增
        </el-button>
      </template>
      <template #plus-field-customMD>
        <el-tag
          v-for="(val, key) in state.customMD"
          :key="key"
          class="mx-1 cursor-pointer mt-1"
          closable
          @close="closeTag('customMD:' + key)"
          @click="showCustomMDDialog('修改', key)"
        >
          {{ key }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showCustomMDDialog('增加', null)"
        >
          新增
        </el-button>
      </template>
      <template #plus-field-mdSuffix>
        <el-tag
          v-for="(val, key) in state.mdSuffix"
          :key="key"
          class="mx-1 cursor-pointer mt-1"
          closable
          @close="closeTag('mdSuffix:' + key)"
          @click="showMdSuffixDialog('修改', key)"
        >
          {{ key }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showMdSuffixDialog('增加', null)"
        >
          新增
        </el-button>
      </template>
      <template #plus-field-btnSuffix>
        <el-tag
          v-for="(val, key) in state.btnSuffix"
          :key="key"
          class="mx-1 cursor-pointer mt-1"
          closable
          @close="closeTag('btnSuffix:' + key)"
          @click="showBtnSuffixDialog('修改', key)"
        >
          {{ key }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showBtnSuffixDialog('增加', null)"
        >
          新增
        </el-button>
      </template>
      <template #plus-field-filterLog>
        <el-tag
          v-for="(val, key) in state.filterLog"
          :key="key"
          class="mx-1 cursor-pointer mt-1"
          closable
          @close="closeTag('filterLog:' + key)"
          @click="showFilterLogDialog('修改', key)"
        >
          {{ key }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showFilterLogDialog('增加', null)"
        >
          新增
        </el-button>
      </template>
      <template #plus-field-token>
        <el-tag
          v-for="val in state.token as Array<any>"
          :key="val.uin"
          class="mx-1 cursor-pointer mt-1"
          closable
          @close="closeTokenTag(val.uin)"
          @click="showTokenDialog('修改', val.uin)"
        >
          {{ val.uin }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showTokenDialog('增加', null)"
        >
          新增
        </el-button>
      </template>
      <template #plus-field-password>
        <el-tag
          v-for="(val, key) in state.web.password"
          :key="key"
          class="mx-1 cursor-pointer mt-1"
          :closable="key !== 'default'"
          @close="closePasswordTag(key)"
          @click="showPasswordDialog('修改', String(key))"
        >
          {{ key }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showPasswordDialog('增加', null)"
        >
          新增
        </el-button>
      </template>
    </PlusForm>
  </div>
</template>
