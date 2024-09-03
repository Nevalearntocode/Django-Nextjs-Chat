"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  image?: string;
  name: string;
};

export function UserAvatar({ image, name }: Props) {
  return (
    <Avatar>
      <AvatarImage src={image} alt={`${name}-avatar`} />
      <AvatarFallback className={cn("")}>
        {name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
