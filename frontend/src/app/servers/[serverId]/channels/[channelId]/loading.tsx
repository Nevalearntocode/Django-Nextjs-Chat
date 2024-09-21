import { Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {};

export default function Loading({}: Props) {
  return (
    <div className="flex h-[55vh] w-full flex-col items-center justify-center gap-8">
      <Image src={"/svgs/loading.svg"} alt="loading" width={300} height={300} />
      <Loader2 className="absolute h-20 w-20 animate-spin" />
    </div>
  );
}
