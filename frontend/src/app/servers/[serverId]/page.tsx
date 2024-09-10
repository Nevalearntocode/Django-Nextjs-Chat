import LandingPage from "@/components/landing-page";
import React from "react";

type Props = {
  params: {
    serverId: string;
  };
};

export default function ServerPage({ params }: Props) {
  const serverId = params.serverId;

  return (
    <div className="w-full p-12">
      <LandingPage serverId={serverId} />
    </div>
  );
}
