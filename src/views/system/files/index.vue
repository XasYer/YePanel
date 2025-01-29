<template>
  <el-card class="h-[80vh]">
    <el-row class="flex flex-wrap">
      <el-col :xl="7" :sm="12" :lg="7" :xs="24" class="mr-[10px]">
        <el-input v-model="path">
          <template #prepend>
            <el-dropdown
              split-button
              :disabled="!historyPath.length"
              style="width: 40px"
              @command="getData"
              @click="getData(historyPath.shift())"
            >
              <IconifyIconOnline icon="mdi:arrow-left" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in historyPath"
                    :key="item"
                    :command="item"
                  >
                    {{ item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #append>
            <el-button @click="getData(path)">
              <IconifyIconOnline icon="mdi:arrow-right" /> </el-button
          ></template>
        </el-input>
      </el-col>
      <div class="mr-[10px] div-col">
        <el-popover :width="400" trigger="click" :visible="uploadVisible">
          <template #reference>
            <el-button
              type="primary"
              class="mr-[10px]"
              @click="uploadVisible = true"
              >上传</el-button
            >
          </template>
          <el-upload
            ref="uploadRef"
            drag
            :action="`${getBaseUrlApi()}/upload-file`"
            multiple
            :data="{ path }"
            show-file-list
            :auto-upload="false"
            :headers="{ Authorization: `Bearer ${getToken().accessToken}` }"
            :on-success="handleUploadSuccess"
          >
            <div>
              <IconifyIconOnline icon="mdi:upload" :width="96" class="m-auto" />
            </div>
            <div>拖动文件到此处或点我上传</div>
            <template #tip>
              <div class="text-center">
                仅支持简单文件上传，请勿上传大文件<br />上传同名文件将会覆盖原文件。
              </div>
              <div class="text-right">
                <el-button
                  text
                  @click="uploadVisible = false && (uploadLoading = false)"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  :loading="uploadLoading"
                  @click="handleUpload"
                >
                  确认
                </el-button>
              </div>
            </template>
          </el-upload>
        </el-popover>
        <el-dropdown trigger="click" @command="newFileOrDir">
          <el-button type="primary" class="mr-[10px]">新建</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="file"> 文件 </el-dropdown-item>
              <el-dropdown-item command="dir"> 文件夹 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-popconfirm
          :title="deleteTitle"
          width="300px"
          @confirm="handleDelete(selectData)"
        >
          <template #reference>
            <el-button
              type="danger"
              :disabled="!selectData.length"
              @click="changeDeleteTitle(selectData)"
              >删除</el-button
            >
          </template>
        </el-popconfirm>
        <el-button
          type="primary"
          :disabled="!selectData.length || action == 'copy'"
          @click="action = 'copy'"
          >复制</el-button
        >
        <el-button
          type="primary"
          :disabled="!selectData.length || action == 'move'"
          @click="action = 'move'"
          >移动</el-button
        >
        <el-button
          v-if="selectData.length"
          type="default"
          @click="handleCancelSelect"
          >取消</el-button
        >
        <el-button v-if="action" type="success" @click="handlePaste"
          >粘贴</el-button
        >
      </div>
    </el-row>
    <div>
      <el-table
        ref="tableRef"
        :data="data"
        row-key="path"
        :height="`${tableHeigth}vh`"
        @cell-dblclick="handleDblclick"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <el-table-column
          type="selection"
          :selectable="checkSelect"
          reserve-selection
        />"
        <el-table-column label="名称" sortable="'custom'" prop="name">
          <template #default="scope">
            <div class="flex items-center">
              <div class="mr-[10px]">
                <!-- <svg :name="scope.row.ext" /> -->
                <component :is="svg" :name="scope.row.ext" />
              </div>
              <el-input
                v-if="renameRow?.path === scope.row.path"
                ref="renameInputRef"
                v-model="renameInput"
              >
                <template #append>
                  <el-button @click="handleRename">确认</el-button>
                </template>
              </el-input>
              <el-text v-else>
                {{ scope.row.name }}
              </el-text>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="大小" prop="size" sortable="'custom'" />
        <el-table-column label="修改时间" prop="time" sortable="'custom'" />
        <el-table-column label="操作">
          <template #default="scope">
            <span v-if="renameRow?.path !== scope.row.path">
              <el-link :underline="false" @click="handleDblclick(scope.row)"
                >打开</el-link
              >
              <span v-if="scope.row.name !== '..'">
                <el-link :underline="false" @click="showRenameInput(scope.row)"
                  >重命名</el-link
                >
                <el-link
                  v-if="!scope.row.isDir"
                  :underline="false"
                  @click="handleDownload(scope.row)"
                  >下载</el-link
                >
                <el-popconfirm
                  :title="
                    scope.row.isDir
                      ? '确认删除这个文件夹吗？'
                      : '确认删除这个文件吗？'
                  "
                  width="200px"
                  @confirm="handleDelete([scope.row])"
                >
                  <template #reference>
                    <el-link :underline="false" type="danger">删除</el-link>
                  </template>
                </el-popconfirm>
              </span>
            </span>
            <el-link v-else @click="handleCancelRename">取消</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { h, nextTick, ref } from "vue";
import {
  deleteFiles,
  downloadFile,
  getDirData,
  getDirDataResult,
  moveFiles,
  renameFile,
  setFileData
} from "@/api/system";
import svg from "./components/svg.vue";
import { message } from "@/utils/message";
import { IconifyIconOnline } from "@/components/ReIcon";
import { ElUpload, type ElTable } from "element-plus";
import { getBaseUrlApi } from "@/api/utils";
import { getToken } from "@/utils/auth";
import { downloadByData } from "@pureadmin/utils";
import { addDialog, DialogOptions } from "@/components/ReDialog";
import dialog, { type Props as DialogProps } from "./components/dialog.vue";

defineOptions({
  name: "files"
});

const tableHeigth = ref<number>(
  window.innerWidth <= 768 ? 62 : window.innerWidth <= 1200 ? 66 : 70
);

const data = ref<getDirDataResult["data"]["files"]>([]);
const path = ref("");
const historyPath = ref<string[]>([]);
const tableRef = ref<InstanceType<typeof ElTable>>();
const selectData = ref<getDirDataResult["data"]["files"]>([]);
const action = ref<"copy" | "move">();
const uploadVisible = ref(false);

const checkSelect = (row: getDirDataResult["data"]["files"][0]) =>
  row.name !== "..";

const handleSelectionChange = (rows: getDirDataResult["data"]["files"]) => {
  selectData.value = rows;
  if (!selectData.value.length) {
    action.value = null;
  }
};

const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  let firstData = null;
  if (data.value[0].name === "..") {
    firstData = data.value.shift();
  }
  const dirs = [];
  const files = [];
  data.value.forEach(file => {
    if (file.isDir) {
      dirs.push(file);
    } else {
      files.push(file);
    }
  });

  const isSpecialChar = str => /^[^a-zA-Z\u4e00-\u9fa5]/.test(str);
  const isEnglish = str => /^[a-zA-Z]/.test(str);

  const compareFunction = (a, b, order) => {
    const isASpecial = isSpecialChar(a.name);
    const isBSpecial = isSpecialChar(b.name);
    const isAEnglish = isEnglish(a.name);
    const isBEnglish = isEnglish(b.name);

    if (order === "descending") {
      // 倒序：中文 -> 英文 -> 特殊符号
      if (!isASpecial && isBSpecial) return -1;
      if (isASpecial && !isBSpecial) return 1;

      if (!isAEnglish && isBEnglish) return -1;
      if (isAEnglish && !isBEnglish) return 1;
    } else {
      // 正序：特殊符号 -> 英文 -> 中文
      if (isASpecial && !isBSpecial) return -1;
      if (!isASpecial && isBSpecial) return 1;

      if (isAEnglish && !isBEnglish) return -1;
      if (!isAEnglish && isBEnglish) return 1;
    }

    // 同类型比较
    return a.name.localeCompare(b.name) * (order === "descending" ? -1 : 1);
  };

  const sortItems = (items, key, order) => {
    items.sort((a, b) =>
      order === "descending" ? b[key] - a[key] : a[key] - b[key]
    );
  };

  switch (prop) {
    case "name":
      dirs.sort((a, b) => compareFunction(a, b, order));
      files.sort((a, b) => compareFunction(a, b, order));
      break;
    case "size":
      sortItems(dirs, "rowSize", order);
      sortItems(files, "rowSize", order);
      break;
    case "time":
      sortItems(dirs, "mtimeMs", order);
      sortItems(files, "mtimeMs", order);
      break;
    default:
      break;
  }
  if (order === "descending") {
    data.value = [...files, ...dirs];
  } else {
    data.value = [...dirs, ...files];
  }
  if (firstData) {
    data.value.unshift(firstData);
  }
};

const handleCancelSelect = () => {
  action.value = null;
  selectData.value = [];
  tableRef.value.clearSelection();
};

const readBlobAsText = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsText(blob);
  });
};

const diaLogRef = ref<InstanceType<typeof dialog>>();

const showDialog = (options: DialogOptions) => {
  addDialog({
    width: "80%",
    top: "5vh",
    contentRenderer: () => h(dialog, { ref: diaLogRef }),
    props: options.props,
    closeCallBack: options.closeCallBack
  });
};

const handleDblclick = (row: getDirDataResult["data"]["files"][0]) => {
  if (row.isDir) {
    if (historyPath.value.length >= 10) {
      historyPath.value.pop();
    }
    historyPath.value.unshift(path.value);
    getData(row.path);
  } else {
    const imgExt = ["jpg", "jpeg", "png", "gif", "ico", "svg", "webp", "bmp"];
    const videoExt = ["mp4", "webm", "flv", "avi", "wmv", "mov"];
    const audioExt = ["mp3", "wav", "wma", "ogg", "flac", "aac", "m4a"];
    const codeExt = [
      "html",
      "htm",
      "css",
      "less",
      "sass",
      "js",
      "json",
      "xml",
      "vue",
      "yaml",
      "yml",
      "md",
      "cjs",
      "mjs",
      "ts",
      "jsx",
      "tsx",
      "php",
      "java",
      "cpp",
      "rs",
      "erl",
      "scm",
      "go",
      "lua",
      "pas",
      "pl",
      "sql",
      "styl",
      "swift",
      "tcl",
      "toml",
      "sh",
      "gitignore",
      "npmrc",
      "erl",
      "bat",
      "bf",
      "clj",
      "coffee",
      "ps1",
      "txt",
      "r",
      "rb",
      "py",
      "ini",
      "jl",
      "vb",
      "vbs"
    ];
    const props: DialogProps = {
      type: null,
      data: {}
    };
    if (imgExt.includes(row.ext)) {
      downloadFile(row.path, row.name).then(res => {
        const url = URL.createObjectURL(res);
        props.type = "image";
        props.data = { url };
        showDialog({ props });
      });
    } else if (codeExt.includes(row.ext)) {
      downloadFile(row.path, row.name)
        .then(blob => readBlobAsText(blob))
        .then((res: string) => {
          props.type = "code";
          props.data = { ext: row.ext, content: res };
          showDialog({
            props,
            closeCallBack({ options, args }) {
              if (args?.command === "sure") {
                setFileData(
                  row.path,
                  diaLogRef.value.getData().content as string
                ).then(res => {
                  if (!res.success) {
                    message("保存失败:" + res.message, {
                      customClass: "el",
                      type: "error"
                    });
                  } else {
                    message("保存成功~ Ciallo～(∠・ω< )⌒☆", {
                      customClass: "el",
                      type: "success"
                    });
                  }
                });
              }
            }
          });
        });
    } else {
      return message("暂不支持预览该文件类型", {
        customClass: "el",
        type: "warning"
      });
    }
  }
};

const deleteTitle = ref<string>("");

const changeDeleteTitle = (rows: getDirDataResult["data"]["files"]) => {
  let files = 0;
  let dirs = 0;
  rows.forEach(row => {
    if (row.isDir) {
      dirs++;
    } else {
      files++;
    }
  });
  const tip = ["确认删除"];
  if (files) {
    tip.push(`${files}个文件`);
  }
  if (dirs) {
    if (files) {
      tip.push("和");
    }
    tip.push(`${dirs}个文件夹`);
  }
  tip.push("吗？");
  deleteTitle.value = tip.join("");
};

const handleDelete = (rows: getDirDataResult["data"]["files"]) => {
  deleteFiles(rows.map(row => ({ path: row.path, isDir: row.isDir }))).then(
    res => {
      handleCancelSelect();
      if (!res.success) {
        message("操作失败:" + res.message, {
          customClass: "el",
          type: "error"
        });
        return;
      }
      if (res.errors?.length) {
        for (const { path, isDir, message: msg } of res.errors) {
          message(
            (isDir ? "文件夹" : "文件") + `“${path}”` + "删除失败:" + msg,
            { customClass: "el", type: "error" }
          );
        }
      }
      message("删除成功~ Ciallo～(∠・ω< )⌒☆", {
        customClass: "el",
        type: "success"
      });
      getData(path.value);
    }
  );
};

const handleDownload = (row: getDirDataResult["data"]["files"][0]) => {
  downloadFile(row.path, row.name)
    .then(res => {
      downloadByData(res, row.name);
    })
    .catch(err => {
      message("下载失败:" + err.message, {
        customClass: "el",
        type: "error"
      });
    });
};

const uploadLoading = ref(false);
const uploadRef = ref<InstanceType<typeof ElUpload>>();
const fileList = ref<string[]>([]);

const handleUpload = () => {
  uploadRef.value.submit();
  uploadLoading.value = true;
};

const handleUploadSuccess = (res: {
  success: boolean;
  data: getDirDataResult["data"]["files"][0];
  message?: string;
}) => {
  const index = fileList.value.indexOf(res.data.name);
  if (index !== -1) {
    fileList.value.splice(index, 1);
  }
  if (!res.success) {
    message(res.data.name + "上传失败:" + res.message, {
      customClass: "el",
      type: "error"
    });
  }
  if (fileList.value.length === 0) {
    uploadRef.value.clearFiles();
    uploadLoading.value = false;
    uploadVisible.value = false;
    getData(path.value);
    message("上传成功~ Ciallo～(∠・ω< )⌒☆", {
      customClass: "el",
      type: "success"
    });
  }
};

const newFileOrDir = (type: "file" | "dir") => {
  if (renameRow.value?.path) {
    renameInputRef.value.focus();
    return;
  }
  let index = data.value.findIndex(
    row => (type === "file" ? !row.isDir : row.isDir) && row.name !== ".."
  );
  if (index === -1) {
    if (type === "dir") {
      index = 1;
    } else {
      index = data.value.length;
    }
  }
  let name = "新建文件" + (type === "file" ? ".txt" : "夹");
  let fileID = 1;
  while (true) {
    if (data.value.some(row => row.name === name)) {
      name =
        "新建文件" +
        (type === "file" ? `（${fileID}）.txt` : `夹（${fileID}）`);
    } else {
      break;
    }
    fileID++;
  }
  data.value.splice(index, 0, {
    name,
    path: `${path.value}/${name}`,
    ext: type === "file" ? "file" : "folder",
    size: "",
    rowSize: 0,
    time: "",
    mtimeMs: 0,
    isDir: type === "dir"
  });
  showRenameInput(data.value[index]);
};

const handlePaste = () => {
  moveFiles(
    selectData.value.map(row => ({
      path: row.path,
      name: row.name,
      isDir: row.isDir
    })),
    path.value,
    action.value
  ).then(res => {
    handleCancelSelect();
    if (!res.success) {
      message("操作失败:" + res.message, {
        customClass: "el",
        type: "error"
      });
      return;
    }
    if (res.errors?.length) {
      for (const { path, isDir, message: msg } of res.errors) {
        message(
          (isDir ? "文件夹" : "文件") + `“${path}” ${action.value}失败 ${msg}`,
          {
            customClass: "el",
            type: "error"
          }
        );
      }
    }
    message(`${action.value}}成功~ Ciallo～(∠・ω< )⌒☆`, {
      customClass: "el",
      type: "success"
    });
    getData(path.value);
  });
};

const renameInput = ref<string>();
const renameRow = ref<getDirDataResult["data"]["files"][0]>();
const renameInputRef = ref<HTMLInputElement>();

const showRenameInput = (row: getDirDataResult["data"]["files"][0]) => {
  renameRow.value = row;
  renameInput.value = row.name;
  nextTick(() => {
    renameInputRef.value.focus();
  });
};

const handleRename = () => {
  renameFile(
    renameRow.value.path,
    renameInput.value,
    renameRow.value.isDir
  ).then(res => {
    const target =
      (renameRow.value.mtimeMs === 0 ? "创建" : "重命名") +
      (renameRow.value.isDir ? "文件夹" : "文件");
    handleCancelRename();
    if (!res.success) {
      message(`${target}成功失败...${res.message}`, {
        customClass: "el",
        type: "error"
      });
      return;
    }
    message(`${target}成功~ Ciallo～(∠・ω< )⌒☆`, {
      customClass: "el",
      type: "success"
    });
    getData(path.value);
  });
};

const handleCancelRename = () => {
  if (renameRow.value.mtimeMs === 0) {
    data.value.splice(data.value.indexOf(renameRow.value), 1);
  }
  renameRow.value = {} as any;
  renameInput.value = "";
};

const getData = (dir: string) => {
  getDirData(dir).then(res => {
    if (!res.success) {
      message(res.message, { customClass: "el", type: "error" });
      return;
    }
    path.value = res.data.path;
    const dirs = [];
    if (res.data.parentPath) {
      dirs.push({
        name: "..",
        path: res.data.parentPath,
        ext: "folder",
        size: "",
        time: "",
        isDir: true
      });
    }
    const files = [];
    res.data.files.forEach(file => {
      if (file.isDir) {
        dirs.push(file);
      } else {
        files.push(file);
      }
    });
    data.value = [...dirs, ...files];
    tableRef.value.setScrollTop(0);
  });
};
getData("");
</script>

<style scoped>
.el-link {
  margin-right: 10px;
}

.el-col {
  margin-bottom: 10px;
}

.div-col .el-button {
  margin-right: 10px;
  margin-left: 0;
  margin-bottom: 10px;
}
</style>
