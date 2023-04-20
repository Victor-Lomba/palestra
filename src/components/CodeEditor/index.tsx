import Editor, { loader, useMonaco } from "@monaco-editor/react";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./style.module.css";
import { example1, example2 } from "../../assets/files/files";

loader.init().then((_monacoInstance) => {});

interface ICodeEditor {
  file: {
    name: string;
    text: string;
  };
  saveFile: (file: { text: string }) => void;
}

let timeout: number | undefined;

export default function CodeEditor({ file, saveFile }: ICodeEditor) {
  const monaco = useMonaco();

  if (monaco) {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,

      typeRoots: ["node_modules/@types"],
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      "<<react-definition-file>>",
      `file:///node_modules/@react/types/index.d.ts`
    );
  }

  return (
    <div className={styles.container}>
      <>
        <Editor
          width={"100%"}
          height={"100%"}
          language="typescript"
          theme="vs-dark"
          value={file.text}
          options={{}}
          onChange={(e) => {
            if (timeout) {
              clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
              saveFile({ text: e || "" });
              timeout = undefined;
            }, 3000);
          }}
          loading={<div>carregando</div>}
        ></Editor>
      </>
    </div>
  );
}
