"use client";

import React, { useCallback, useEffect, useRef } from "react";
import useWebsocket from "react-use-websocket";
import { Button } from "./ui/button";
import { Message, useGetMessagesQuery } from "@/redux/features/message-slice";
import { useGetChannelQuery } from "@/redux/features/channel-slice";
import Image from "next/image";
import { env } from "@/env";
import { UserAvatar } from "./user-avatar";
import { Pencil, Trash, X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type Props = {
  channelId: string;
};

export default function ChatWidget({ channelId }: Props) {
  const { data } = useGetMessagesQuery({ channelId });
  const [message, setMessage] = React.useState("");
  const [newMessages, setNewMessages] = React.useState<Message[]>([]);
  const [messageId, setMessageId] = React.useState<string>();
  const [type, setType] = React.useState<"edit" | "delete" | "send">("send");
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

  const formatDate = (timestamp: string) => {
    return format(new Date(timestamp), "h:mm a MM/dd/yyyy");
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
    if (type === "delete") {
      sendJsonMessage({ type, message: messageId });
    }
    setType("send");
    setMessage("");
  };

  const handleEdit = (message_id: string, type: "edit" | "delete") => {
    setType(type);
    console.log(type);
    const message = newMessages.find((message) => message.id === message_id);
    setMessageId(message_id);
    if (type === "edit") {
      setMessage(message?.content ?? "");
    }
  };

  const handleDelete = (message_id: string) => {
    setMessageId(message_id);
    sendJsonMessage({ type: "delete", message: message_id });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
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

  console.log(newMessages);

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
            {message.deleted === true ? (
              <p className="ml-2 text-xs italic text-zinc-400">
                this message has been deleted
              </p>
            ) : (
              <>
                <p className="ml-2 text-sm">{message.content}</p>
                <div className="absolute right-0 top-0 hidden items-center gap-2 group-hover:flex">
                  <p className="mr-2 hidden text-xs italic group-hover:block">
                    {formatDate(message.created)}
                  </p>
                  <Button
                    size={`icon`}
                    variant={`secondary`}
                    onClick={() => handleEdit(message.id, "edit")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size={`icon`}
                    variant={`destructive`}
                    onClick={() => handleDelete(message.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="relative flex flex-shrink-0 gap-4 py-4 pl-6 pr-[72px]">
        <div className="flex w-full flex-col">
          {type === "edit" && (
            <div className="flex h-[16px] w-full -skew-x-12 items-center justify-between rounded-md bg-zinc-700 px-4">
              <p className="text-xs italic">Editing</p>
              <X
                className="h-4 w-4 cursor-pointer"
                onClick={() => {
                  setType("send");
                  setMessage("");
                }}
              />
            </div>
          )}
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
        </div>
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
