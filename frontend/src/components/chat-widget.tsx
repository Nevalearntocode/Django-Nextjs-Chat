"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useWebsocket from "react-use-websocket";
import { Message, useGetMessagesQuery } from "@/redux/features/message-slice";
import { useGetChannelQuery } from "@/redux/features/channel-slice";
import Image from "next/image";
import { env } from "@/env";
import { MessageDisplay } from "./message-display";
import { MessageInput } from "./message-input";

type Props = {
  channelId: string;
};

export default function ChatWidget({ channelId }: Props) {
  const { data: messages, isLoading } = useGetMessagesQuery({ channelId });
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [messageId, setMessageId] = useState<string>();
  const [type, setType] = useState<"edit" | "send">("send");
  const { data: channel } = useGetChannelQuery(channelId);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [channelId, newMessages]);

  useEffect(() => {
    setNewMessages(messages ?? []);
  }, [messages]);

  const { sendJsonMessage } = useWebsocket(
    `${env.NEXT_PUBLIC_WEBSOCKET_URL}${channelId}/`,
    {
      onMessage: (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "send") {
          setNewMessages([...newMessages, data.new_message]);
        }
        if (data.type !== "send") {
          setNewMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === data.new_message.id ? data.new_message : msg,
            ),
          );
        }
      },
    },
  );

  const sendMessage = () => {
    if (type === "edit") {
      sendJsonMessage({
        type,
        message: {
          id: messageId,
          content: message,
        },
      });
    }
    if (type === "send") {
      sendJsonMessage({ type, message });
    }
    setType("send");
    setMessage("");
  };

  const handleEdit = (messageId: string) => {
    setType("edit");
    const messageToEdit = newMessages.find(
      (message) => message.id === messageId,
    );
    setMessageId(messageId);
    setMessage(messageToEdit?.content ?? "");
  };

  if (!channel || isLoading) {
    return <div>Loading...</div>;
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
            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] -skew-x-[15deg] rounded-lg bg-transparent/30 p-4">
              <p className="-skew-x-[15deg] text-2xl font-bold">
                {channel.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[100px] w-full bg-blue-500" />
        )}
      </div>
      <div
        className="flex flex-col gap-2 overflow-y-auto px-6"
        style={{}}
        ref={scrollRef}
      >
        {newMessages.map((message, i) => (
          <MessageDisplay key={i} message={message} onEdit={handleEdit} />
        ))}
      </div>
      <MessageInput
        message={message}
        type={type}
        onTypeChange={setType}
        onMessageChange={setMessage}
        onSendMessage={sendMessage}
      />
    </div>
  );
}
