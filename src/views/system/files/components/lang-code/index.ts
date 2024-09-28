const importers = import.meta.glob<string>("./*/index.ts");
console.log("importers", importers);
const languages: { [key in string]: () => any } = {};
Object.keys(importers).forEach(fileName => {
  const language = fileName.replace("./", "").replace("/index.ts", "");
  languages[language] = importers[fileName];
});

export default languages;
