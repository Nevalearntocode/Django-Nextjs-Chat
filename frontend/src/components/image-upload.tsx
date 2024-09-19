"use client";

import React from "react";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "./user-avatar";
import { cn } from "@/lib/utils";

type Props = {
  onChange: (image: File | string) => void;
  onRemove: () => void;
  value: string | File | null;
  type?: "image" | "icon";
};

const ImageUpload = ({ onChange, value, onRemove, type = "image" }: Props) => {
  const uploadImageRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file);
  };

  return (
    <>
      {value ? (
        <div className="group relative flex aspect-video flex-col">
          {typeof value === "string" ? (
            <>
              {type === "image" ? (
                <Image
                  src={value}
                  alt="Uploaded Image"
                  fill
                  sizes="( max-width: 768px ) 768px, ( max-width: 1200px ) 768px, 768px"
                  className="h-80 w-auto rounded-md"
                  priority={true}
                />
              ) : (
                <UserAvatar
                  name={value}
                  image={value}
                  className="h-80 w-auto rounded-md"
                />
              )}
            </>
          ) : (
            <>
              {type === "image" ? (
                <Image
                  src={URL.createObjectURL(value)}
                  alt="Uploaded Image"
                  fill
                  sizes="( max-width: 768px ) 768px, ( max-width: 1200px ) 768px, 768px"
                  className="h-80 w-auto rounded-md"
                  priority={true}
                />
              ) : (
                <UserAvatar
                  name={value.name}
                  image={URL.createObjectURL(value)}
                  className="h-80 w-auto rounded-md"
                />
              )}
            </>
          )}
          <Button
            className={cn(
              "absolute -top-3 m-0 hidden h-6 w-6 rounded-full p-0 group-hover:flex",
              type === "image" ? "-right-3" : "left-10",
            )}
            size={`icon`}
            variant={`destructive`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onRemove();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Button
            size={`icon`}
            variant={`ghost`}
            onClick={(e) => {
              e.preventDefault();
              uploadImageRef.current?.click();
            }}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
          <Input
            type="file"
            ref={uploadImageRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </>
  );
};

export default ImageUpload;
