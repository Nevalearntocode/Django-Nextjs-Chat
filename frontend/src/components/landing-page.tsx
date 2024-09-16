"use client";

import React from "react";
import Image from "next/image";
import { useGetServerQuery } from "@/redux/features/server-slice";

const LandingPage = ({ serverId }: { serverId: string }) => {
  const { data: server } = useGetServerQuery(serverId);

  if (!server) return null;

  return (
    <div className="flex h-full w-full flex-col items-center">
      {/* Placeholder for the SVG image */}
      <div className="relative h-[250px] w-[360px] rounded-md">
        <Image src={server.banner} alt="Server Image" fill />
      </div>
      <h2 className="mt-8 text-3xl font-bold">Welcome to {server.name}</h2>
      <p className="mt-4 max-w-md">{server.description}</p>
    </div>
  );
};

export default LandingPage;
