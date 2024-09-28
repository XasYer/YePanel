import { StreamLanguage } from "@codemirror/language";
import { vbScript } from "@codemirror/legacy-modes/mode/vbscript";

export default {
  language: () => StreamLanguage.define(vbScript),
  ext: "vbs"
};
