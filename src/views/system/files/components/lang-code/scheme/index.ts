import { StreamLanguage } from "@codemirror/language";
import { scheme } from "@codemirror/legacy-modes/mode/scheme";

export default {
  language: () => StreamLanguage.define(scheme),
  ext: "scm"
};
