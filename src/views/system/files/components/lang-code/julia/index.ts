import { StreamLanguage } from "@codemirror/language";
import { julia } from "@codemirror/legacy-modes/mode/julia";

export default {
  language: () => StreamLanguage.define(julia),
  ext: "jl"
};
