import { MutableRefObject, useEffect, useRef, useState } from "react";
import "./App.css";
import CodeEditor from "./components/CodeEditor";
import CodeTerminal from "./components/CodeTerminal";
import { DirectoryNode, WebContainer } from "@webcontainer/api";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { files } from "./assets/files/files";
import "xterm/css/xterm.css";

const exampleArray = [
  {
    path: "/examples/optimizationExample",
  },
  {
    path: "/examples/useStateExample",
  },
  {
    path: "/examples/useEffectExample",
  },
  {
    path: "/examples/contextExample",
  },
];

function App() {
  const [example, setExample] = useState(0);
  const [currFile, setCurrFile] = useState({ name: "", text: "" });
  const [loading, setLoading] = useState(true);

  const baseUrl = useRef("");
  const iframe = useRef<HTMLIFrameElement>(null);
  let webcontainerInstance = useRef<WebContainer | null>(null);
  const terminal = useRef<Terminal | null>(null);

  const filenames = Object.keys(
    ((files.src as DirectoryNode).directory.examples as DirectoryNode).directory
  );

  async function installDependencies(
    terminal: MutableRefObject<Terminal | null>
  ) {
    if (!webcontainerInstance.current) return;
    const installProcess = await webcontainerInstance.current.spawn("npm", [
      "install",
    ]);

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          if (terminal.current) terminal.current.write(data);
        },
      })
    );

    return installProcess.exit;
  }

  async function startDevServer(terminal: MutableRefObject<Terminal | null>) {
    if (!webcontainerInstance.current) return;
    // Run `npm run start` to start the Express app
    const startProcess = await webcontainerInstance.current.spawn("npm", [
      "run",
      "dev",
    ]);

    startProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          if (terminal.current) terminal.current.write(data);
        },
      })
    );

    // Wait for `server-ready` event
    webcontainerInstance.current.on("server-ready", (port, url) => {
      console.log(url);
      baseUrl.current = url;
      if (!iframe.current) return;
      iframe.current.src = `${url}${exampleArray[example].path}`;
      getFile();
      setLoading(false);
    });
  }

  useEffect(() => {
    if (terminal.current) return;

    terminal.current = new Terminal({
      convertEol: true,
    });
    const fitAddon = new FitAddon();

    terminal.current.loadAddon(fitAddon);

    const terminalEL = document.querySelector<HTMLDivElement>(".terminal");
    if (terminalEL) terminal.current.open(terminalEL);
    fitAddon.fit();
    window.onresize = fitAddon.fit;

    if (webcontainerInstance.current) return;

    window.addEventListener("load", async () => {
      webcontainerInstance.current = await WebContainer.boot();
      if (!webcontainerInstance.current) return;
      await webcontainerInstance.current.mount(files);

      const exitCode = await installDependencies(terminal);
      if (exitCode !== 0) {
        throw new Error("Installation failed");
      }

      startDevServer(terminal);
    });
  });

  useEffect(() => {
    if (!iframe.current || !baseUrl.current) return;
    iframe.current.src = `${baseUrl.current}${exampleArray[example].path}`;
    getFile();
  }, [example]);

  async function getFile() {
    if (!webcontainerInstance.current) return;
    const file = await webcontainerInstance.current.fs.readFile(
      `src${exampleArray[example].path}/index.tsx`
    );
    setCurrFile((state) => ({
      ...state,
      text: new TextDecoder().decode(file),
    }));
  }

  async function saveFile(file: { text: string }) {
    if (!webcontainerInstance.current) return;
    await webcontainerInstance.current.fs.writeFile(
      `src${exampleArray[example].path}/index.tsx`,
      file.text
    );
  }

  return (
    <div className="App">
      <aside>
        {filenames.map((item, index) => (
          <button
            className={`aside-button ${index === example ? "selected" : ""}`}
            key={item}
            onClick={() => setExample(index)}
            disabled={loading}
          >
            {item}
          </button>
        ))}
      </aside>
      <div className="middle-column">
        <div className="middle-column-top">
          <CodeEditor file={currFile} saveFile={saveFile} />
        </div>
        <div className="middle-column-bottom">
          <CodeTerminal />
        </div>
      </div>
      <iframe ref={iframe} width={"40%"} height={"100%"}></iframe>
    </div>
  );
}

export default App;
