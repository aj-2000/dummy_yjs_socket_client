import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import * as Y from "yjs";
const doc = new Y.Doc();
const array = doc.getArray('array')
array.insert(0, [0,1,2])
const socket = io("ws://localhost:8080", {});
const App = () => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join", { username: "ajay", room: "my room", doc: Y.encodeStateAsUpdate(doc) });
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("join", (data) => {
      console.log(data)
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("join");
    };
  }, []);

  const sendPing = () => {
    socket.emit("ping");
  };

  return (
    <div>
      <p>Connected: {"" + isConnected}</p>
      <p>Last pong: {lastPong || "-"}</p>
      <button onClick={sendPing}>Send ping</button>
    </div>
  );
};

export default App;
