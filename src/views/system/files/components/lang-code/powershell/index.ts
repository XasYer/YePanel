import { StreamLanguage } from "@codemirror/language";
import { powerShell } from "@codemirror/legacy-modes/mode/powershell";

export default {
  language: () => StreamLanguage.define(powerShell),
  ext: "ps1"
};
