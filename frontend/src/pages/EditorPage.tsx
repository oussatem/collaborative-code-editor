import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

function EditorPage() {
  const { roomId } = useParams();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/documents/${roomId}`,
        );

        if (!response.ok) {
          throw new Error("Document not found");
        }

        const document = await response.json();

        setCode(document.content);
        setLanguage(document.language);
      } catch (error) {
        console.error("Error loading document:", error);
        setError("Document not found");
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [roomId]);

  if (loading) {
    return <p>Loading document...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
          language={language}
          value={code}
          onChange={(value) => setCode(value ?? "")}
          theme="vs-dark"
        />
      </section>
    </main>
  );
}

export default EditorPage;
