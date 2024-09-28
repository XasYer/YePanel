import { StreamLanguage } from "@codemirror/language";
import { pascal } from "@codemirror/legacy-modes/mode/pascal";

export default {
  language: () => StreamLanguage.define(pascal),
  ext: "pas"
};
