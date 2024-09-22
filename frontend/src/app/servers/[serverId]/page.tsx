import LandingPage from "@/components/landing-page";
import SecondaryDraw from "@/components/navbars/secondary-draw";
import { Separator } from "@/components/ui/separator";
import React from "react";

type Props = {
  params: {
    serverId: string;
  };
};

export default function ServerPage({ params }: Props) {
  const serverId = params.serverId;

  return (
    <div className="w-full p-16">
      <LandingPage serverId={serverId} />
    </div>
  );
}
