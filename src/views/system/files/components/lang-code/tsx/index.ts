import { javascript } from "@codemirror/lang-javascript";

export default {
  language: () => javascript({ typescript: true, jsx: true }),
  ext: "tsx"
};
