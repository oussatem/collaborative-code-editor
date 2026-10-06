import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

function EditorPage() {
  const { roomId } = useParams();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userCount, setUserCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch(
          `${API_URL}/documents/${roomId}`,
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

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const socket = io(API_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);

      socket.emit("join-room", roomId);
    });

    socket.on("code-update", (updatedCode: string) => {
      setCode(updatedCode);
    });

    socket.on("user-count", (count: number) => {
      setUserCount(count);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  const handleCodeChange = (value: string | undefined) => {
    const updatedCode = value ?? "";

    setCode(updatedCode);

    if (roomId) {
      socketRef.current?.emit("code-change", {
        roomId,
        code: updatedCode,
      });
    }
  };

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
          <p>Users connected : {userCount}</p>
        </div>
      </header>

      <section className="editor-container">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
        />
      </section>
    </main>
  );
}

export default EditorPage;
