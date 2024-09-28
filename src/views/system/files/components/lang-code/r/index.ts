import { StreamLanguage } from "@codemirror/language";
import { r } from "@codemirror/legacy-modes/mode/r";

export default {
  language: () => StreamLanguage.define(r),
  ext: "r"
};
