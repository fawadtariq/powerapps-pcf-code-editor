// src/monacoSetup.ts
// Minimal worker wiring for Monaco in bundlers (webpack-based PCF builds)

(self as any).MonacoEnvironment = {
  getWorker(_: any, label: string) {
    switch (label) {
      case "json":
        return new (require("monaco-editor/esm/vs/language/json/json.worker").default)();
      default:
        return new (require("monaco-editor/esm/vs/editor/editor.worker").default)();
    }
  },
};