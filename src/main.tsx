import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <>{window.innerWidth >= 1024 ? <App /> : <h1>MOBILE NÃO</h1>}</>
  // </React.StrictMode>,
);
