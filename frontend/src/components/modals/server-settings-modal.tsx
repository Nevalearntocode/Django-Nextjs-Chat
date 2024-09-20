"use client";

import React, { useEffect, useRef } from "react";
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
  useUpdateServerMutation,
} from "@/redux/features/server-slice";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../image-upload";
import { toast } from "sonner";

type Props = {};

export const updateServerSettingsFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  icon_file: z.union([z.instanceof(File), z.string()]).nullable(),
  banner_file: z.union([z.instanceof(File), z.string()]).nullable(),
});

export type UpdateServerFormType = z.infer<
  typeof updateServerSettingsFormSchema
>;

const ServerSettingsModal = (props: Props) => {
  const dispatch = useAppDispatch();
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const isModalOpen = isOpen && type === "server-settings";
  const pathname = usePathname();
  const serverId = pathname.split("/")[2];
  const { data: server } = useGetServerQuery(serverId);
  const [updateServer] = useUpdateServerMutation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const onOpenChange = () => {
    dispatch(closeModal());
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

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    adjustHeight();
  }, [form.watch("description")]);

  const onSubmit = async (data: UpdateServerFormType) => {
    updateServer({ server: data, id: serverId })
      .unwrap()
      .then(() => {
        onOpenChange();
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

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="opacity-60">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize your server</DialogTitle>
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
