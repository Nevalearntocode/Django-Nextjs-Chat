"use client";

import React, { useCallback, useEffect, useRef } from "react";
import useWebsocket from "react-use-websocket";
import { Button } from "./ui/button";
import { Message, useGetMessagesQuery } from "@/redux/features/message-slice";
import { useGetChannelQuery } from "@/redux/features/channel-slice";
import Image from "next/image";
import { env } from "@/env";
import { UserAvatar } from "./user-avatar";
import { Pencil, Trash } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type Props = {
  channelId: string;
};

export default function ChatWidget({ channelId }: Props) {
  const { data } = useGetMessagesQuery({ channelId });
  const [message, setMessage] = React.useState("");
  const [newMessages, setNewMessages] = React.useState<Message[]>([]);
  const { data: channel } = useGetChannelQuery(channelId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  useEffect(() => {
    scrollToBottom();
  }, [channelId, newMessages]);

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

  const sendMessage = () => {
    sendJsonMessage({ type: "message", message });
    setMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // i want to check if the message is empty
      if (message.trim() === "") {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      sendMessage();
    }
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
          <div key={i} className="group relative rounded-lg px-4 py-2">
            <div className="flex items-center gap-1">
              <UserAvatar name={message.sender} className="h-9 w-9" />
              <p className="text-sm font-semibold">{message.sender}</p>
            </div>
            <p className="ml-2 text-sm">{message.content}</p>
            <div className="absolute right-0 top-0 hidden gap-2 group-hover:flex">
              <Button size={`icon`} variant={`secondary`}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size={`icon`} variant={`destructive`}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="relative flex flex-shrink-0 gap-4 py-4 pl-6 pr-[72px]">
        <Textarea
          ref={textareaRef}
          id="message"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="max-h-24 min-h-[40px] resize-none overflow-y-auto"
          rows={1}
          onKeyDown={handleKeyDown}
        />
        <Button
          onClick={sendMessage}
          className={cn("absolute bottom-[18px] right-4")}
        >
          <PaperPlaneIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
