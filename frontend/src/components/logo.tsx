import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center">
      <Link href={`/`}>
        <div className="hidden items-center gap-2 rounded-full bg-sky-200 py-1 pl-1 pr-2 hover:bg-sky-300 dark:bg-sky-600 sm:flex">
          <Image
            src={`/logo.jpg`}
            priority
            width={40}
            height={40}
            alt={`logo`}
            className="h-auto w-auto rounded-full"
          />
          <p className="text-xl font-bold">DNC</p>
        </div>
      </Link>
      <div className="flex sm:hidden">
        <Menu className="h-6 w-6" />
      </div>
    </div>
  );
};

export default Logo;
