import { FileSystemTree } from "@webcontainer/api";

export const files: FileSystemTree = {
  src: {
    directory: {
      examples: {
        directory: {
          optimizationExample: {
            directory: {
              "index.tsx": {
                file: {
                  contents: `
import React,{ useCallback, useState, Profiler } from "react";
import './styles.css';

const initialSquares = {
  squares: Array.from(new Array(16)).map((_, i) => ({
    name: \`Quadrado \${i}\`,
    isActive: false,
  })),
};

export default function UseMemoExample() {
  const [state, setState] = useState(initialSquares);

  let handleClick = (i: number) => {
    setState((state) => {
      let squares = [...state.squares];
      squares[i].isActive = !squares[i].isActive;
      return {
        ...state,
        squares,
      };
    });
  };

  return (
    <div className="grid">
      {state.squares.map(({ isActive, name }, index) => (
        <Toggle
          on={isActive}
          index={index}
          onClick={handleClick}
          key={name}
          name={name}
        />
      ))}
    </div>
  );
}

function Toggle({ on, onClick, index, name }: IToggle) {
  function handleClick() {
    onClick(index);
  }

  return (
    <Profiler id={index} onRender={console.log}>
      <div className={\`square \${on && "on"}\`} onClick={handleClick}>
        <p>{name}</p>
      </div>
    </Profiler>
  );
}

                  `,
                },
              },
              "styles.css": {
                file: {
                  contents: `
                  .square {
                    width: 100px;
                    height: 100px;
                    background: red;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-family: sans-serif;
                    user-select: none;
                    cursor: pointer;
                    transition: 0.3s;
                  }
                  
                  .on {
                    background: green;
                  }
                  
                  .grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr;
                    gap: 20px;
                    width: fit-content;
                  }
                  
                  `,
                },
              },
            },
          },
          useStateExample: {
            directory: {
              "index.tsx": {
                file: {
                  contents: `
import React,{ useState } from "react";
import './styles.css';

export default function UseStateExemple() {
  const [count1, setCount1] = useState(0);

  function incrementCount() {
    setCount1(count1 + 1);
    setCount1(count1 + 1);
  }

  return (
    <div className="containerExample1">
      <h1>{count1}</h1>
      <button onClick={incrementCount}>increment</button>
      <hr />
    </div>
  );
}
                  `,
                },
              },
              "styles.css": {
                file: {
                  contents: `
                  .containerExample1 button {
                    box-sizing: border-box;
                    -webkit-appearance: none;
                       -moz-appearance: none;
                            appearance: none;
                    background-color: transparent;
                    border: 2px solid #e74c3c;
                    border-radius: 0.6em;
                    color: #e74c3c;
                    cursor: pointer;
                    display: -webkit-box;
                    display: -webkit-flex;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-align-self: center;
                        -ms-flex-item-align: center;
                            align-self: center;
                    font-size: 1rem;
                    font-weight: 400;
                    line-height: 1;
                    margin: 20px;
                    padding: 1.2em 2.8em;
                    text-decoration: none;
                    text-align: center;
                    text-transform: uppercase;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 700;
                  }
                  .containerExample1 button:hover, .containerExample1 button:focus {
                    color: #fff;
                    outline: 0;
                  }

                  .containerExample1 button {
                    -webkit-transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
                    transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
                  }
                  .containerExample1 button:hover {
                    box-shadow: 0 0 40px 40px #e74c3c inset;
                  }

                  .containerExample1 {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                  }

                  hr {
                    width: 100%;
                  }
                  `,
                },
              },
            },
          },
          useEffectExample: {
            directory: {
              "index.tsx": {
                file: {
                  contents: `
import React, {useState, useEffect, Profiler} from 'react'

interface Repo {
name: string;
description: string;
}

export default function ReposExample() {
const [repos, setRepos] = useState<Repo[]>([])
const [filteredRepos, setFilteredRepos] = useState<Repo[]>()

const [search, setSearch] = useState('');

useEffect(() => {
  fetch('https://api.github.com/users/victor-lomba/repos')
  .then(response => response.json())
  .then(data => setRepos(data))
}, []);


useEffect(() => {
  setFilteredRepos(repos.filter(repo => repo.name.includes(search)));
}, [search])

return (
  <Profiler 
  id="search"
  onRender={() => {
    console.log("Renderizou a lista");
  }}>
    <div>
      <input
        name="search"
        type="text"
        placeholder="Buscar..."
        onChange={e => setSearch(e.target.value)}
        value={search} />

        {search.length > 0 ? (
          <ul>
            {filteredRepos.map(repo => {
              return (
                <li key={repo.name}>
                  {repo.name}
                </li>
              )
            })}
          </ul>
        ) : (
          <ul>
          {repos.map(repo => {
            return (
              <li key={repo.name}>
                {repo.name}
              </li>
            )
          })}
          </ul>
        )}
    </div>
  </Profiler>
      )
}

                  `,
                },
              },
            },
          },

          contextExample: {
            directory: {
              "index.tsx": {
                file: {
                  contents: `
import React,{ ReactNode, useMemo, useState, Profiler, createContext, useContext } from "react";
import './styles.css'

interface IUserContextProvider {
  children: ReactNode;
}

interface IUserContext {
  name: string;
  email: string;
  age: number;
}

const UserContext = createContext({} as IUserContext);

export function UserContextProvider({ children }: IUserContextProvider) {
  const [name, _setName] = useState("Fulano");
  const [email, setEmail] = useState("Fulano@gmail.com");
  const [age, _setAge] = useState(35);

  return (
    <UserContext.Provider
      value={{ email, age, name }}
    >
      <input
        className="inputExample2"
        type="text"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function Username() {
  const {name} = useUser();
  return (
    <Profiler
      id="username"
      onRender={() => {
        console.log("Renderizou o nome de usuario");
      }}
    >
      <div>
        <h1>{name}</h1>
      </div>
    </Profiler>
  );
}

export default function ContextExemple() {
  return (
    <UserContextProvider>
      <Username />
    </UserContextProvider>
  );
}

                  `,
                },
              },
              "styles.css": {
                file: {
                  contents: `
                  .inputExample2 {
                    margin: 0 auto;
	                  padding: 10px;
	                  border: none;
	                  margin-bottom: 10px;
	                  border-radius: 50px;
                  }
                  `,
                },
              },
            },
          },
        },
      },
      "main.tsx": {
        file: {
          contents: `import React from "react";
          import ReactDOM from "react-dom/client";
          import { createBrowserRouter, RouterProvider } from "react-router-dom";
          import UseStateExample from "./examples/useStateExample";
          import ContextExemple from "./examples/contextExample";
          import OptimizationExample from "./examples/optimizationExample";
          import UseEffectExample from "./examples/useEffectExample";
          
          const router = createBrowserRouter([
            {
              path: "/",
              element: <h1>Você não devia estar aqui...</h1>,
            },
            {
              path: "/examples/useStateExample",
              element: <UseStateExample />,
            },
            {
              path: "/examples/optimizationExample",
              element: <OptimizationExample />,
            },
            {
              path: "/examples/contextExample",
              element: <ContextExemple />,
            },
            {
              path: "/examples/useEffectExample",
              element: <UseEffectExample />,
            },
          ]);
          
          ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
              <RouterProvider router={router} />
          );
          `,
        },
      },
    },
  },
  "package.json": {
    file: {
      contents: `{
        "name": "exemplo1",
        "private": true,
        "version": "0.0.0",
        "type": "module",
        "scripts": {
          "dev": "vite",
          "build": "tsc && vite build",
          "preview": "vite preview"
        },
        "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-router-dom": "^6.9.0",
          "scheduler": "^0.23.0",
          "use-context-selector": "^1.4.1"
        },
        "devDependencies": {
          "@types/react": "^18.0.27",
          "@types/react-dom": "^18.0.10",
          "@vitejs/plugin-react-swc": "^3.0.0",
          "typescript": "^4.9.3",
          "vite": "^4.1.0"
        }
      }`,
    },
  },
  "index.html": {
    file: {
      contents: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="/vite.svg" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Palestra</title>
          <style>
          h1{
            color: white
          }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/main.tsx"></script>
        </body>
      </html>
      `,
    },
  },
  "vite.config.js": {
    file: {
      contents: `import { defineConfig } from 'vite'
      
      // https://vitejs.dev/config/
      export default defineConfig({
        plugins: [],
      })
      `,
    },
  },
};

export const example1 = [
  {
    name: "index.tsx",
    text: '\nimport React,{ useState } from "react";\n\nexport default function UseStateExemple() {\n  const [count1, setCount1] = useState(0);\n  const [count2, setCount2] = useState(0);\n\n  function incrementCount() {\n    setCount1(count1 + 1);\n    setCount1(count1 + 1);\n  }\n\n  function incrementCountWithFunction() {\n    setCount2((count) => count + 1);\n    setCount2((count) => count + 1);\n  }\n\n  return (\n    <div>\n      <h1>{count1}</h1>\n      <button onClick={incrementCount}>increment</button>\n      <hr />\n      <h1>{count2}</h1>\n      <button onClick={incrementCountWithFunction}>\n        increment with function\n      </button>\n    </div>\n  );\n}\n                  ',
  },
];

export const example2 = [
  {
    name: "index.tsx",
    text: '\nimport React from "react"\nimport Username from "./Username/username";\nimport { UserContextProvider } from "./context/UserContext";\n\nexport default function ContextExemple() {\n  return (\n    <UserContextProvider>\n      <Username />\n    </UserContextProvider>\n  );\n}\n\n                  ',
  },
  {
    name: "username.tsx",
    text: '\nimport React,{ Profiler } from "react";\nimport { useUser } from "../context/UserContext";\n\nexport default function Username() {\n  const name = useUser((state) => state.name);\n  return (\n    <Profiler\n      id="username"\n      onRender={() => {\n        console.log("Renderizou o nome de usuario");\n      }}\n    >\n      <div>\n        <h1>{name}</h1>\n      </div>\n    </Profiler>\n  );\n}\n                      ',
  },
  {
    name: "UserContext.tsx",
    text: '\nimport React,{ ReactNode, useMemo, useState } from "react";\nimport { createContext, useContextSelector } from "use-context-selector";\n\ninterface IUserContextProvider {\n  children: ReactNode;\n}\n\ninterface IUserContext {\n  name: string;\n  email: string;\n  age: number;\n}\n\nconst UserContext = createContext({} as IUserContext);\n\nexport function UserContextProvider({ children }: IUserContextProvider) {\n  const [name, _setName] = useState("Fulano");\n  const [email, setEmail] = useState("Fulano@gmail.com");\n  const [age, _setAge] = useState(35);\n\n  return (\n    <UserContext.Provider\n      value={useMemo(() => ({ email, age, name }), [name, email, age])}\n    >\n      <input\n        type="text"\n        onChange={(e) => {\n          setEmail(e.target.value);\n        }}\n      />\n      {children}\n    </UserContext.Provider>\n  );\n}\n\nexport function useUser<T>(selector: (value: IUserContext) => T) {\n  return useContextSelector(UserContext, selector);\n}\n\n                      ',
  },
];
