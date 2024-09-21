"use client";

import React from "react";
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
import { useAddChannelMutation } from "@/redux/features/channel-slice";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";
import { useServerId } from "@/hooks/use-server-id";

type Props = {};

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  topic: z.string().min(1, { message: "Topic is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  server: z.string().min(1, { message: "Server is required" }),
});

export type AddChannelForm = z.infer<typeof formSchema>;

const AddChannelModal = (props: Props) => {
  const { isModalOpen, onOpenChange } = useModal("channel");
  const server = useServerId();
  const [addChannel] = useAddChannelMutation();

  
  const form = useForm<AddChannelForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      topic: "",
      description: "",
      server: server || "",
    },
  });
  
  if (!server) {
    return null;
  }

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: AddChannelForm) => {
    addChannel(data)
      .unwrap()
      .then(() => {
        onOpenChange();
        form.reset();
        toast.success("Channel created successfully");
      })
      .catch((err: any) => {
        if (err.data) {
          console.log(err);
          for (const field in err.data) {
            err.data[field].forEach((errorMessage: string) => {
              toast.error(errorMessage);
            });
          }
        } else {
          console.error(err);
          toast.error("An error occurred while creating the channel");
        }
      });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="opacity-60">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create another channel</DialogTitle>
            <DialogDescription>
              Create a new channel for your server.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Channel topic</FormLabel>
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
                    <FormLabel>Channel description"</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

export default AddChannelModal;
