<script setup lang="ts">
import { h, ref } from "vue";
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
        state.value.btnSuffix[key].values.forEach((i: any) => {
          for (const k of ["input", "callback", "link"]) {
            if (i[k]) {
              i.type = k;
              i.data = i[k];
              break;
            }
          }
        });
      }
    });
  console.log(state.value);
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
          span: 12,
          xs: 23
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
          span: 12,
          xs: 23
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
          span: 12,
          xs: 23
        }
      },
      {
        label: "ID分隔符",
        prop: "sep",
        valueType: "input",
        tooltip: "重启后生效",
        colProps: {
          span: 11,
          xs: 23
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
          span: 23,
          xs: 23
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
          span: 6,
          xs: 12
        }
      },
      {
        label: "上传图片",
        prop: "toBotUpload",
        valueType: "switch",
        tooltip: "使用其他Bot上传图链",
        fieldProps,
        colProps: {
          span: 6,
          xs: 12
        }
      },
      {
        label: "隐藏频道撤回",
        prop: "hideGuildRecall",
        valueType: "switch",
        fieldProps,
        colProps: {
          span: 6,
          xs: 12
        }
      },
      {
        label: "真实QQ",
        prop: "toQQUin",
        valueType: "switch",
        tooltip: "配合ws-plugin的绑定",
        fieldProps,
        colProps: {
          span: 6,
          xs: 12
        }
      },
      {
        label: "转发消息转图",
        prop: "toImg",
        valueType: "switch",
        fieldProps,
        colProps: {
          span: 6,
          xs: 12
        }
      },
      {
        label: "发送按钮",
        prop: "sendButton",
        valueType: "switch",
        tooltip: "没有自定义按钮权限请关闭此项",
        fieldProps,
        colProps: {
          span: 6,
          xs: 12
        }
      },
      {
        label: "调用统计",
        prop: "callStats",
        valueType: "switch",
        fieldProps,
        colProps: {
          span: 6,
          xs: 12
        }
      },
      {
        label: "用户统计",
        prop: "userStats",
        valueType: "switch",
        fieldProps,
        colProps: {
          span: 6,
          xs: 12
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
          span: 11,
          xs: 23
        }
      },
      {
        label: "md模版",
        prop: "customMD",
        colProps: {
          span: 12,
          xs: 23
        }
      },
      {
        label: "md附加值",
        prop: "mdSuffix",
        colProps: {
          span: 11,
          xs: 23
        }
      },
      {
        label: "按钮附加值",
        prop: "btnSuffix",
        colProps: {
          span: 12,
          xs: 23
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
          span: 18,
          xs: 23
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
          span: 6,
          xs: 23
        }
      },
      {
        label: "最大重连次数",
        prop: "bot.maxRetry",
        valueType: "input-number",
        tooltip: "为0则无限重连",
        colProps: {
          span: 8,
          xs: 23
        }
      },
      {
        label: "请求超时时间",
        prop: "bot.timeout",
        valueType: "input-number",
        tooltip: "重启后生效",
        colProps: {
          span: 8,
          xs: 23
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
          span: 11,
          xs: 23
        }
      },
      {
        label: "web密码",
        prop: "password",
        tooltip: "重启后生效",
        colProps: {
          span: 12,
          xs: 23
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
    data.btnSuffix[key].values.forEach((i: any) => {
      for (const type of ["input", "callback", "link"]) {
        if (i.type === type) {
          i[type] = i.data;
          delete i.type;
          delete i.data;
          for (const val in i) {
            const v = i[val];
            if ((Array.isArray(v) && !v.length) || !v) {
              delete i[val];
            }
          }
          if (!i.show?.type || !i.show.data) {
            delete i.show;
          }
          break;
        }
      }
    });
  }
  setSetting(data).then(res => {
    if (res.success) {
      message("保存成功~ Ciallo～(∠・ω< )⌒☆", {
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

const initData = {
  markdown: {
    uin: "",
    id: ""
  },
  customMD: {
    uin: "",
    id: "",
    keys: []
  },
  mdSuffix: {
    uin: "",
    val: []
  },
  btnSuffix: {
    uin: "",
    position: 1,
    values: []
  },
  filterLog: {
    uin: "",
    val: []
  },
  token: {
    uin: "",
    token: "",
    appid: "",
    appSecret: "",
    isGroup: 0,
    isPrivate: 0
  },
  password: {
    uin: "",
    password: ""
  }
};

const getFormInline = (key: string | null, name: string) => {
  const formInline = clone(initData[name], true);
  if (
    key &&
    ((name === "password" && state.value.web.password[key]) ||
      state.value[name][key])
  ) {
    switch (name) {
      case "markdown":
        formInline.uin = key;
        formInline.id = state.value.markdown[key];
        break;
      case "customMD":
        formInline.uin = key;
        formInline.id = state.value.customMD[key].custom_template_id;
        formInline.keys = state.value.customMD[key].keys;
        break;
      case "mdSuffix":
        formInline.uin = key;
        formInline.val = state.value.mdSuffix[key];
        break;
      case "btnSuffix":
        formInline.position = state.value.btnSuffix[key].position;
        formInline.values = state.value.btnSuffix[key].values;
        formInline.uin = key;
        break;
      case "filterLog":
        formInline.uin = key;
        formInline.val = state.value.filterLog[key];
        break;
      case "token":
        formInline.uin = state.value.token[key].uin;
        formInline.token = state.value.token[key].token;
        formInline.appid = state.value.token[key].appid;
        formInline.appSecret = state.value.token[key].appSecret;
        formInline.isGroup = state.value.token[key].isGroup;
        formInline.isPrivate = state.value.token[key].isPrivate;
        break;
      case "password":
        formInline.uin = key;
        formInline.password = state.value.web.password[key];
        break;
      default:
        break;
    }
  }
  return formInline;
};

const closeCallBack = ({ options, args }, key: string | null, name: string) => {
  const { formInline } = options.props;
  if (args?.command === "sure") {
    if (name === "token") {
      key = key ?? "-1";
    } else {
      if (!key || key === formInline.uin) {
        key = formInline.uin;
      } else if (name === "password") {
        delete state.value.web.password[key];
        key = formInline.uin;
      } else {
        delete state.value[name][key];
        key = formInline.uin;
      }
    }
    switch (name) {
      case "markdown":
        state.value.markdown[key] = formInline.id;
        break;
      case "customMD":
        state.value.customMD[key] = {
          custom_template_id: formInline.id,
          keys: formInline.keys
        };
        break;
      case "mdSuffix":
        state.value.mdSuffix[key] = formInline.val;
        break;
      case "btnSuffix":
        state.value.btnSuffix[key] = {
          position: formInline.position,
          values: formInline.values
        };
        break;
      case "filterLog":
        state.value.filterLog[key] = formInline.val;
        break;
      case "token":
        const token = state.value.token as Array<TokenFormProps["formInline"]>;
        if (Number(key) > -1) {
          token[key] = formInline;
        } else {
          token.push(formInline);
        }
        break;
      case "password":
        state.value.web.password[key] = formInline.password;
        break;
      default:
        break;
    }
  }
};

const formRef = ref();
const showDialog = (title: string, key: string | null, content: any) => {
  addDialog({
    width:
      window.innerWidth < 992
        ? "90%"
        : window.innerWidth <= 1200
          ? "50%"
          : "25%",
    title,
    contentRenderer: () => h(content, { ref: formRef }),
    props: {
      formInline: getFormInline(key, content.__name)
    },
    closeCallBack: ({ options, args }) =>
      closeCallBack({ options, args }, key, content.__name),
    beforeSure: (done, { options, index }) => {
      const FormRef = formRef.value.getRef();
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
      class="lg:w-[1000px] m-auto xs:w-full"
      :rules="rules"
      :group="group"
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
          @click="showDialog('修改Markdown模版', String(key), markdown)"
        >
          {{ key }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showDialog('增加Markdown模版', null, markdown)"
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
          @click="showDialog('修改自定义Markdown模版', key, customMD)"
        >
          {{ key }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showDialog('增加自定义Markdown模版', null, customMD)"
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
          @click="showDialog('修改Markdown附加值', key, mdSuffix)"
        >
          {{ key }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showDialog('增加Markdown附加值', null, mdSuffix)"
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
          @click="showDialog('修改按钮附加值', key, btnSuffix)"
        >
          {{ key }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showDialog('增加按钮附加值', null, btnSuffix)"
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
          @click="showDialog('修改过滤日志', key, filterLog)"
        >
          {{ key }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showDialog('增加过滤日志', null, filterLog)"
        >
          新增
        </el-button>
      </template>
      <template #plus-field-token>
        <el-tag
          v-for="(val, index) in state.token as Array<any>"
          :key="val.uin"
          class="mx-1 cursor-pointer mt-1"
          closable
          @close="closeTokenTag(val.uin)"
          @click="showDialog('修改Token', String(index), token)"
        >
          {{ val.uin }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showDialog('增加Token', null, token)"
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
          @click="showDialog('修改密码', String(key), password)"
        >
          {{ key }}
        </el-tag>
        <el-button
          class="button-new-tag ml-1"
          size="small"
          @click="showDialog('增加密码', null, password)"
        >
          新增
        </el-button>
      </template>
    </PlusForm>
  </div>
</template>
