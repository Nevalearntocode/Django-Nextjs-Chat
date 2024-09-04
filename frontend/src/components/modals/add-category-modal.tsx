"use client";

import React, { useEffect, useRef } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import { Textarea } from "../ui/textarea";
import ImageUpload from "../image-upload";

type Props = {};

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  icon: z.instanceof(File).nullable(),
});

type FormType = z.infer<typeof formSchema>;

const AddCategoryModal = (props: Props) => {
  const { isOpen, type } = useAppSelector((state) => state.modal);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const dispatch = useAppDispatch();

  const isModalOpen = isOpen && type === "category";

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: null,
    },
  });

  useEffect(() => {
    adjustHeight();
  }, [form.watch("description")]);

  const isLoading = form.formState.isSubmitting;

  const onOpenChange = () => {
    dispatch(closeModal());
  };

  const onSubmit = async (data: FormType) => {
    console.log(data);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Category</DialogTitle>
          <DialogDescription>Add a new category</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category name</FormLabel>
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
                <FormItem className="flex flex-col">
                  <FormLabel>Description</FormLabel>
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
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onChange={field.onChange}
                      onRemove={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isLoading}>
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
