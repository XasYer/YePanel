import { StreamLanguage } from "@codemirror/language";
import { erlang } from "@codemirror/legacy-modes/mode/erlang";

export default {
  language: () => StreamLanguage.define(erlang),
  ext: "erl"
};
