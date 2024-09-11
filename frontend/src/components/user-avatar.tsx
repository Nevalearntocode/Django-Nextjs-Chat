"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  image?: string;
  name: string;
  className?: string;
};

export function UserAvatar({ image, name, className }: Props) {
  return (
    <Avatar>
      <AvatarImage src={image} alt={`${name}-avatar`} />
      <AvatarFallback className={cn("", className)}>
        {name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
