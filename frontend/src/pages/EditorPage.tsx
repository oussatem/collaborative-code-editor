import { useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

function EditorPage() {
  const { roomId } = useParams();
  const [code, setCode] = useState("// Start coding here...");

  return (
    <main className="editor-page">
      <header className="editor-header">
        <div>
          <h1>Collaborative Code Editor</h1>
          <p>Room: {roomId}</p>
        </div>
      </header>

      <section className="editor-container">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value ?? "")}
          theme="vs-dark"
        />
      </section>
    </main>
  );
}

export default EditorPage;
