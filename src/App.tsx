import "./App.css";
import Editor from "./editor/Editor";

import ErrorBoundary from "./ErrorBoundary";
import { atomWithStorage } from "jotai/utils";
const darkModeAtom = atomWithStorage("darkMode", true);

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="bg-gray-700 w-full flex-shrink h-8">
          <div className="flex items-center text-sm h-8 px-2">Editor Test</div>
        </header>
        <main className="flex-auto bg-gray-600">
          <ErrorBoundary fallback={<p>Something went wrong</p>}>
            <Editor />
          </ErrorBoundary>
        </main>
        <footer className="bg-gray-700 w-full flex-shrink">
          <div className="flex items-center text-sm h-8 px-2">Editor Test</div>
        </footer>
      </div>
    </>
  );
}

export default App;
