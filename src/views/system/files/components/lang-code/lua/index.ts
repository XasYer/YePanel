import { StreamLanguage } from "@codemirror/language";
import { lua } from "@codemirror/legacy-modes/mode/lua";

export default {
  language: () => StreamLanguage.define(lua),
  ext: "lua"
};
