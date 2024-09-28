import { StreamLanguage } from "@codemirror/language";
import { swift } from "@codemirror/legacy-modes/mode/swift";

export default {
  language: () => StreamLanguage.define(swift),
  ext: "swift"
};
