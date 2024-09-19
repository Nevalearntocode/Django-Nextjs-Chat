import ChatWidget from "@/components/chat/chat-widget";
import React from "react";

type Props = {
  params: {
    channelId: string;
  };
};

const Channel = ({ params }: Props) => {
  const channelId = params.channelId;

  return (
    <main className="w-full">
      <ChatWidget channelId={channelId} />
    </main>
  );
};

export default Channel;
