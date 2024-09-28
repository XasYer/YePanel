import { StreamLanguage } from "@codemirror/language";
import { clojure } from "@codemirror/legacy-modes/mode/clojure";

export default {
  language: () => StreamLanguage.define(clojure),
  ext: "clj"
};
