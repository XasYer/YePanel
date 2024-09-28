import { StreamLanguage } from "@codemirror/language";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";

export default {
  language: () => StreamLanguage.define(yaml),
  ext: ["yaml", "yml"]
};
