import { StreamLanguage } from "@codemirror/language";
import { stylus } from "@codemirror/legacy-modes/mode/stylus";

export default {
  language: () => StreamLanguage.define(stylus),
  ext: "styl"
};
