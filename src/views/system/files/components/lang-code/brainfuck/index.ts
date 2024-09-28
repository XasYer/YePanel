import { StreamLanguage } from "@codemirror/language";
import { brainfuck } from "@codemirror/legacy-modes/mode/brainfuck";

export default {
  language: () => StreamLanguage.define(brainfuck),
  ext: "bf"
};
