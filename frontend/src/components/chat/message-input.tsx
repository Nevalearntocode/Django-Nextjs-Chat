import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import EmojiPicker from "./emoji-picker";

type Props = {
  message: string;
  type: "edit" | "send";
  onTypeChange: (type: "edit" | "send") => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
};

export const MessageInput = ({
  message,
  type,
  onTypeChange,
  onMessageChange,
  onSendMessage,
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      if (message.trim() === "") {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="relative flex flex-shrink-0 gap-4 py-4 pl-6 pr-[72px]">
      <div className="relative flex w-full flex-col">
        {type === "edit" && (
          <div className="flex h-[16px] w-full -skew-x-12 items-center justify-between rounded-md bg-zinc-700 px-4">
            <p className="text-xs italic">Editing</p>
            <X
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                onTypeChange("send");
                onMessageChange("");
              }}
            />
          </div>
        )}
        <Textarea
          ref={textareaRef}
          id="message"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="max-h-24 min-h-[40px] resize-none overflow-y-auto"
          rows={1}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute bottom-0 right-2">
          <EmojiPicker
            onChange={(emoji: string) => onMessageChange(`${message} ${emoji}`)}
          />
        </div>
      </div>
      <Button
        onClick={onSendMessage}
        className={cn("absolute bottom-[18px] right-4")}
      >
        <PaperPlaneIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
