"use client";

import React from "react";
import { Pencil, Trash } from "lucide-react";
import { format } from "date-fns";
import { useAppDispatch } from "@/redux/hooks";
import { openModal, setDeleteMessageId } from "@/redux/features/modal-slice";
import { Message } from "@/redux/features/message-slice";
import { UserAvatar } from "../user-avatar";
import { Button } from "../ui/button";
import { useGetCurrentUserQuery } from "@/redux/features/account-slice";

type Props = {
  message: Message;
  onEdit: (messageId: string) => void;
};

export const MessageDisplay = ({ message, onEdit }: Props) => {
  const dispatch = useAppDispatch();
  const { data: user } = useGetCurrentUserQuery();

  const formatDate = (timestamp: string) => {
    return format(new Date(timestamp), "h:mm a MM/dd/yyyy");
  };

  const formattedDates = (created: string, edited: string) => {
    const formattedCreate = formatDate(created);
    const formattedEdit = formatDate(edited);

    if (formattedCreate === formattedEdit) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="group relative rounded-lg px-4 py-2">
      <div className="flex items-center gap-1">
        <UserAvatar name={message.sender} className="h-9 w-9" />
        <p className="text-sm font-semibold">{message.sender}</p>
      </div>
      {message.deleted === true ? (
        <p className="ml-2 text-xs italic text-zinc-400">
          This message has been deleted
        </p>
      ) : (
        <>
          <p className="ml-2 text-sm">{message.content}</p>
          <div className="absolute right-0 top-0 hidden items-center gap-2 group-hover:flex">
            <p className="mr-2 hidden text-xs italic group-hover:block">
              {`At ${formatDate(message.created)}`}{" "}
              {!formattedDates(message.created, message.edited) &&
                `Edited ${formatDate(message.edited)}`}
            </p>
            {user?.username === message.sender && (
              <>
                <Button
                  size={`icon`}
                  variant={`secondary`}
                  onClick={() => onEdit(message.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size={`icon`}
                  variant={`destructive`}
                  onClick={() => {
                    dispatch(openModal("delete-message"));
                    dispatch(setDeleteMessageId(message.id));
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
