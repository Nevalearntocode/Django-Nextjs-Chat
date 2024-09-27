import Image from "next/image";
import React from "react";

type Props = {};

const NotFound = (props: Props) => {
  return (
    <div className="flex w-full flex-col items-center gap-8 py-20">
      <h1 className="text-center text-xl font-semibold md:text-2xl xl:text-4xl">
        There isn't anything here :&quot;&gt;
      </h1>
      <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px]">
        <Image src="/svgs/not-found.svg" alt="not found" fill />
      </div>
    </div>
  );
};

export default NotFound;
