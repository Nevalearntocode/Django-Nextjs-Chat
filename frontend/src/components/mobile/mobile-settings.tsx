"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetContent,
} from "../ui/sheet";
import { useForm } from "react-hook-form";
import {
  updateServerSettingsFormSchema,
  UpdateServerFormType,
} from "../modals/server-settings-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../image-upload";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import {
  useGetServerQuery,
  useRollInviteCodeMutation,
  useToggleStatusMutation,
  useUpdateServerMutation,
} from "@/redux/features/server-slice";
import { toast } from "sonner";
import { env } from "@/env";
import { Copy, RefreshCcw } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

type Props = {
  children: React.ReactNode;
};

export default function MobileSettings({ children }: Props) {
  const pathname = usePathname();
  const serverId = pathname.split("/")[2];
  const { data: server } = useGetServerQuery(serverId);
  const [updateServer] = useUpdateServerMutation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [rollInviteCode] = useRollInviteCodeMutation();
  const [toggleStatus] = useToggleStatusMutation();
  const [isInviteCodeLoading, setisInviteCodeLoading] = useState(false);
  const [isCopiedLoading, setisCopiedLoading] = useState(false);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const form = useForm<UpdateServerFormType>({
    resolver: zodResolver(updateServerSettingsFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon_file: null,
      banner_file: null,
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("description", server.description);
      form.setValue("icon_file", server.icon);
      form.setValue("banner_file", server.banner);
    }
  }, [server]);

  useEffect(() => {
    adjustHeight();
  }, [form.watch("description")]);
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: UpdateServerFormType) => {
    updateServer({ server: data, id: serverId })
      .unwrap()
      .then(() => {
        form.reset();
        toast.success("Server updated successfully");
      })
      .catch((err: any) => {
        if (err.data) {
          for (const field in err.data) {
            err.data[field].forEach((errorMessage: string) => {
              toast.error(errorMessage);
            });
          }
        } else {
          console.error(err);
          toast.error("An error occurred while updating the server");
        }
      });
  };

  const onRollInviteCode = () => {
    rollInviteCode(serverId)
      .unwrap()
      .then(() => {
        toast.success("Your invite link has been renewed successfully");
        setisInviteCodeLoading(true);
        setTimeout(() => {
          setisInviteCodeLoading(false);
        }, 15000);
      })
      .catch((err: any) => {
        if (err.data) {
          for (const field in err.data) {
            err.data[field].forEach((errorMessage: string) => {
              toast.error(errorMessage);
            });
          }
        } else {
          console.error(err);
          toast.error("An error occurred while renewing the invite link");
        }
      });
  };

  const onToggleStatus = () => {
    toggleStatus(serverId)
      .unwrap()
      .then(() => {
        toast.success(`Server status has been changed!`);
      })
      .catch((err: any) => {
        if (err.data) {
          for (const field in err.data) {
            err.data[field].forEach((errorMessage: string) => {
              toast.error(errorMessage);
            });
          }
        } else {
          console.error(err);
          toast.error("An error occurred while toggling the server status");
        }
      });
  };

  const onCopyInviteLink = () => {
    navigator.clipboard.writeText(
      `${env.NEXT_PUBLIC_WEBSITE_URL}/servers/${server?.id}/?invite_code=${server?.invite_code}`,
    );
    toast.success("Invite link copied to clipboard");
    setisCopiedLoading(true);
    setTimeout(() => {
      setisCopiedLoading(false);
    }, 15000);
  };

  const isInviteLinkDisabled = server?.status === "public";

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={"right"} aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle className="text-left">Server settings</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Server Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      {...field}
                      ref={textareaRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-2 flex w-full gap-8"></div>
            <div className="mt-2 flex w-full justify-between gap-8">
              <FormField
                control={form.control}
                name="banner_file"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Banner</FormLabel>
                    <FormControl>
                      <ImageUpload
                        onChange={field.onChange}
                        onRemove={() => field.onChange(null)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon_file"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <ImageUpload
                        onChange={field.onChange}
                        onRemove={() => field.onChange(null)}
                        value={field.value}
                        type="icon"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Invite link</p>
                <div className="flex gap-1">
                  <Button
                    variant={`outline`}
                    size={`icon`}
                    className="rounded-full"
                    onClick={onCopyInviteLink}
                    disabled={isCopiedLoading || isInviteLinkDisabled}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={`outline`}
                    size={`icon`}
                    className="rounded-full"
                    onClick={onRollInviteCode}
                    disabled={isInviteCodeLoading || isInviteLinkDisabled}
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={`${env.NEXT_PUBLIC_WEBSITE_URL}/join/${server?.invite_code}?serverId=${serverId}`}
                  disabled={isInviteLinkDisabled}
                />
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-semibold">Server status</p>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-light">Private</p>
                  <Checkbox
                    checked={server?.status === "private"}
                    onClick={onToggleStatus}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex w-full justify-end">
              <Button type="submit" disabled={isLoading}>
                Confirm
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
