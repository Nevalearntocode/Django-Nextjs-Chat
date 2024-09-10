import LandingPage from "@/components/landing-page";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function ServerPage({ params }: Props) {
  const serverId = params.id;

  return (
    <div className="w-full p-12">
      <LandingPage serverId={serverId} />
    </div>
  );
}
