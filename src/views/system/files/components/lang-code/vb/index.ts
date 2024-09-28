import { StreamLanguage } from "@codemirror/language";
import { vb } from "@codemirror/legacy-modes/mode/vb";

export default {
  language: () => StreamLanguage.define(vb),
  ext: "vb"
};
