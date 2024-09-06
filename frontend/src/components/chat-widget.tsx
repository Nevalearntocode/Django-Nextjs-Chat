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

  const { sendJsonMessage } = useWebsocket(socketUrl, {
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
    <div className="flex h-full flex-col justify-between dark:bg-muted/20">
      <div className="h-full flex-1 px-6">
        <div className="h-[100px] w-full bg-blue-500" />
      </div>
      <div className="overflow-y-auto px-6">
        {[...Array(50)].map((_, i) => (
          <p key={i}>content {i}</p>
        ))}
      </div>
      <div className="flex gap-4 px-6 py-4">
        <Input
          className="border-muted-foreground"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={sendHello}>send</Button>
      </div>
    </div>
  );
}
