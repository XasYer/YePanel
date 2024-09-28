import { StreamLanguage } from "@codemirror/language";
import { coffeeScript } from "@codemirror/legacy-modes/mode/coffeescript";

export default {
  language: () => StreamLanguage.define(coffeeScript),
  ext: "coffee"
};
