import { StreamLanguage } from "@codemirror/language";
import { perl } from "@codemirror/legacy-modes/mode/perl";

export default {
  language: () => StreamLanguage.define(perl),
  ext: "pl"
};
