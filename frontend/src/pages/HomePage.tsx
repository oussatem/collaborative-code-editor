import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = crypto.randomUUID();
    navigate(`/editor/${newRoomId}`);
  };

  const joinRoom = () => {
    const trimmedRoomId = roomId.trim();

    if (!trimmedRoomId) {
      return;
    }

    navigate(`/editor/${trimmedRoomId}`);
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
