import { StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";

export default {
  language: () => StreamLanguage.define(shell),
  ext: "sh"
};
