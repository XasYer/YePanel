import { StreamLanguage } from "@codemirror/language";
import { tcl } from "@codemirror/legacy-modes/mode/tcl";

export default {
  language: () => StreamLanguage.define(tcl),
  ext: "tcl"
};
