import { StreamLanguage } from "@codemirror/language";
import { go } from "@codemirror/legacy-modes/mode/go";

export default {
  language: () => StreamLanguage.define(go),
  ext: "go"
};
