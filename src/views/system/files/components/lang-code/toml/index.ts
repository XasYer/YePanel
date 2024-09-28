import { StreamLanguage } from "@codemirror/language";
import { toml } from "@codemirror/legacy-modes/mode/toml";

export default {
  language: () => StreamLanguage.define(toml),
  ext: "toml"
};
