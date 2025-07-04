import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants.ts";

export default function useSocket(username: string): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!username) return;

    const socketInstance = io(SOCKET_URL, {
      query: { username },
      transports: ["websocket"],
    });
    setSocket(socketInstance);
    console.log(`Socket created for ${username} with id ${socketInstance.id}`);

    return () => {
      console.log(`Disconnecting socket for ${username}`);
      socketInstance.disconnect();
    };
  }, [username]);

  return socket;
}
