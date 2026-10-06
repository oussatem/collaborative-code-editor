import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      const response = await fetch(`${API_URL}/documents`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const document = await response.json();

      navigate(`/editor/${document.roomId}`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const joinRoom = async () => {
    const trimmedRoomId = roomId.trim();

    if (!trimmedRoomId) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/documents/${trimmedRoomId}`,
      );

      if (!response.ok) {
        throw new Error("Room not found");
      }

      navigate(`/editor/${trimmedRoomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <main className="app">
      <h1>Collaborative Code Editor</h1>
      <p>Write code together in real time.</p>

      <button onClick={createRoom}>Create Room</button>

      <p>or</p>

      <input
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(event) => setRoomId(event.target.value)}
      />

      <button onClick={joinRoom}>Join Room</button>
    </main>
  );
}

export default HomePage;
