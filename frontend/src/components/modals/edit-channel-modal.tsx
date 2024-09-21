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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal";
import { useAppSelector } from "@/redux/hooks";
import {
  useEditChannelMutation,
  useGetChannelQuery,
} from "@/redux/features/channel-slice";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

type Props = {};

const formSchema = z.object({
  name: z.string().min(1, { message: "Title is required" }),
  topic: z.string(),
  description: z.string(),
});

type FormType = z.infer<typeof formSchema>;

const EditChannelModal = (props: Props) => {
  const { isModalOpen, onOpenChange } = useModal("edit-channel");
  const { editChannelId } = useAppSelector((state) => state.modal);
  const { data: channel } = useGetChannelQuery(editChannelId ?? "");
  const [editChannel, { isLoading }] = useEditChannelMutation();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      topic: "",
      description: "",
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("topic", channel.topic);
      form.setValue("description", channel.description);
    }
  }, [channel, form]);

  const formDescription = form.watch("description");

  useEffect(() => {
    adjustHeight();
  }, [formDescription]);

  if (!editChannelId || !channel) {
    return null;
  }

  const onSubmit = async (data: FormType) => {
    editChannel({ id: editChannelId, ...data })
      .unwrap()
      .then(() => {
        toast.success("Channel updated successfully");
      })
      .catch((err: any) => {
        if (err.data) {
          console.log(err)
          if (Array.isArray(err.data)) {
            for (const field in err.data) {
              err.data[field].forEach((errorMessage: string) => {
                toast.error(errorMessage);
              });
            }
          } else {
            toast.error(err.data.detail);
          }
        } else {
          console.error(err);
          toast.error("An error occurred while updating the channel");
        }
      });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="opacity-60">
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              Edit channel <span className="">{channel.name}</span>
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4 flex w-full items-center justify-end">
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

export default EditChannelModal;
