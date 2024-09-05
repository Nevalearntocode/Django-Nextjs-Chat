"use client";

import React from "react";
import useWebsocket from "react-use-websocket";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const socketUrl = "ws://127.0.0.1:8000/ws/chat/1/";

type Props = {};

export default function ChatWidget({}: Props) {
  const [message, setMessage] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const {
    getWebSocket,
    lastJsonMessage,
    lastMessage,
    readyState,
    sendJsonMessage,
    sendMessage,
  } = useWebsocket(socketUrl, {
    onOpen: () => {
      console.log("connected");
    },
    onClose: () => {
      console.log("disconnected");
    },
    onError: () => {
      console.log("error");
    },
    onMessage: (event) => {
      const jsonMessage = JSON.parse(event.data);
      setMessage(jsonMessage.text);
    },
  });

  const sendHello = () => {
    sendJsonMessage({ text: inputValue });
    setInputValue("");
  };

  return (
    <div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button onClick={sendHello}>send</Button>
      <p>{message}</p>
    </div>
  );
}
