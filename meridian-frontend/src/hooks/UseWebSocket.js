import { useEffect, useRef } from "react";

export function useWebSocket(onMessage) {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.1.42:8080");

    ws.current.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };

    return () => ws.current.close();
  }, [onMessage]);

  const send = (data) => {
    ws.current?.send(JSON.stringify(data));
  };

  return send;
}