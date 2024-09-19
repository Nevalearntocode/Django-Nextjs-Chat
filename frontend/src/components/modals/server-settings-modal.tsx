"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeModal } from "@/redux/features/modal-slice";
import { usePathname } from "next/navigation";
import {
  useGetServerQuery,
  useRollInviteCodeMutation,
} from "@/redux/features/server-slice";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import ImageUpload from "../image-upload";
import { Copy, RefreshCcw } from "lucide-react";
import { env } from "@/env";
import { toast } from "sonner";

type Props = {};

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  status: z.enum(["public", "private"]),
  icon_file: z.union([z.instanceof(File), z.string()]).nullable(),
  banner_file: z.union([z.instanceof(File), z.string()]).nullable(),
  category: z.string().min(1, { message: "Category is required" }),
  invite_code: z.string(),
});

type FormType = z.infer<typeof formSchema>;

const ServerSettingsModal = (props: Props) => {
  const dispatch = useAppDispatch();
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const isModalOpen = isOpen && type === "server-settings";
  const pathname = usePathname();
  const serverId = pathname.split("/")[2];
  const { data: server } = useGetServerQuery(serverId);
  const [rollInviteCode, { isLoading: isRerollLoading }] =
    useRollInviteCodeMutation();

  const onOpenChange = () => {
    dispatch(closeModal());
  };

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "public",
      icon_file: null,
      banner_file: null,
      category: "",
      invite_code: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("description", server.description);
      form.setValue("status", server.status);
      form.setValue("icon_file", server.icon);
      form.setValue("banner_file", server.banner);
      form.setValue("category", server.category);
      form.setValue(
        "invite_code",
        `${env.NEXT_PUBLIC_WEBSITE_URL}/join/${server.invite_code}`,
      );
    }
  }, [server]);

  const isLoading = form.formState.isSubmitting;

  const onRollInviteCode = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    rollInviteCode(serverId)
      .unwrap()
      .then((data) => {
        form.setValue(
          "invite_code",
          `${env.NEXT_PUBLIC_WEBSITE_URL}/join/${data}`,
        );
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
          toast.error("An error occurred while rolling the invite code");
        }
      });
  };

  const onSubmit = async (data: FormType) => {
    console.log(data);
  };

  const isInviteCodeDisabled = form.watch("status") === "public";

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="opacity-60">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create your server</DialogTitle>
            <DialogDescription>
              What do you want your server to look like?
            </DialogDescription>
          </DialogHeader>
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
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-2 flex w-full gap-8">
                <FormField
                  control={form.control}
                  name="invite_code"
                  render={({ field }) => (
                    <FormItem className="relative flex w-full flex-col justify-end gap-2">
                      <FormLabel>Invite Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Invite Code"
                          disabled={isInviteCodeDisabled}
                          {...field}
                          readOnly
                        />
                      </FormControl>
                      <div className="flex w-full justify-end gap-4">
                        <Button
                          className="flex self-end rounded-full"
                          variant={`outline`}
                          size={"icon"}
                          onClick={onRollInviteCode}
                          disabled={isRerollLoading || isInviteCodeDisabled}
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          className="flex self-end rounded-full"
                          variant={`outline`}
                          size={"icon"}
                          disabled={isInviteCodeDisabled}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-2">
                      <FormLabel>Private mode</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value === "private"}
                          onCheckedChange={() =>
                            field.onChange(
                              field.value === "private" ? "public" : "private",
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              <div className="mt-4 flex w-full justify-end">
                <Button type="submit" disabled={isLoading}>
                  Confirm
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default ServerSettingsModal;
