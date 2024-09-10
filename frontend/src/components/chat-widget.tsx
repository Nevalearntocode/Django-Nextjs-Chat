"use client";

import React, { useEffect } from "react";
import useWebsocket from "react-use-websocket";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Message, useGetMessagesQuery } from "@/redux/features/message-slice";
import { useGetChannelQuery } from "@/redux/features/channel-slice";
import Image from "next/image";
import { env } from "@/env";

type Props = {
  channelId: string;
};

export default function ChatWidget({ channelId }: Props) {
  const { data } = useGetMessagesQuery({ channelId });
  const [message, setMessage] = React.useState("");
  const [newMessages, setNewMessages] = React.useState<Message[]>([]);
  const { data: channel } = useGetChannelQuery(channelId);

  useEffect(() => {
    setNewMessages(data ?? []);
  }, [data]);

  const { sendJsonMessage } = useWebsocket(
    `${env.NEXT_PUBLIC_WEBSOCKET_URL}${channelId}/`,
    {
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
    },
  );

  const sendHello = () => {
    sendJsonMessage({ type: "message", message });
    setMessage("");
  };

  if (!channel) {
    return <div>Not found</div>;
  }

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden dark:bg-muted/20">
      <div className="h-full flex-1">
        {channel?.server_banner ? (
          <div className="relative h-[100px] w-full">
            <Image
              src={channel.server_banner}
              alt="Server Banner"
              fill
              sizes="400px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-[100px] w-full bg-blue-500" />
        )}
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
