import { StreamLanguage } from "@codemirror/language";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";

export default {
  language: () => StreamLanguage.define(ruby),
  ext: "rb"
};
