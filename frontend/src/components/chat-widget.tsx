"use client";

import React, { useEffect } from "react";
import useWebsocket from "react-use-websocket";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Message, useGetMessagesQuery } from "@/redux/features/message-slice";

const socketUrl = "ws://127.0.0.1:8000/ws/chat/1/";

type Props = {};

export default function ChatWidget({}: Props) {
  const { data } = useGetMessagesQuery();
  const [message, setMessage] = React.useState("");
  const [newMessages, setNewMessages] = React.useState<Message[]>([]);

  useEffect(() => {
    setNewMessages(data ?? []);
  }, [data]);

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
      const data = JSON.parse(event.data);
      setNewMessages([...newMessages, data.new_message]);
    },
  });

  const sendHello = () => {
    sendJsonMessage({ type: "message", message });
    setMessage("");
  };

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden dark:bg-muted/20">
      <div className="h-full flex-1">
        <div className="h-[100px] w-full bg-blue-500" />
      </div>
      <div className="overflow-y-auto px-6">
        {newMessages.map((message, i) => (
          <p key={i}>{message.content}</p>
        ))}
      </div>
      <div className="flex flex-shrink-0 gap-4 overflow-hidden px-6 py-4">
        <Input
          className="border-muted-foreground"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={sendHello}>send</Button>
      </div>
    </div>
  );
}
