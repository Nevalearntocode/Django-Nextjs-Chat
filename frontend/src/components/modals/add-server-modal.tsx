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
import { useGetCategoriesQuery } from "@/redux/features/category-slice";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CheckboxIcon } from "@radix-ui/react-icons";
import { Checkbox } from "../ui/checkbox";
import ImageUpload from "../image-upload";
import { UserAvatar } from "../user-avatar";

type Props = {};

const formSchema = z.object({
  name: z.string().min(1, { message: "Title is required" }),
  description: z.string(),
  status: z.enum(["public", "private"]),
  icon_file: z.instanceof(File).nullable(),
  banner_file: z.instanceof(File).nullable(),
  category: z.string().min(1, { message: "Category is required" }),
});

type FormType = z.infer<typeof formSchema>;

const AddServerModal = (props: Props) => {
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const { data: categories } = useGetCategoriesQuery();
  const isModalOpen = isOpen && type === "server";
  const dispatch = useAppDispatch();
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
      description: "",
      status: "public",
      icon_file: null,
      banner_file: null,
      category: "",
    },
  });

  useEffect(() => {
    adjustHeight();
  }, [form.watch("description")]);

  const onOpenChange = () => {
    dispatch(closeModal());
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    console.log(data);
  };

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
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Category</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? categories?.find(
                                    (category) => category.id === field.value,
                                  )?.name
                                : "Select category"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search category..." />
                            <CommandList>
                              <CommandEmpty>No category found.</CommandEmpty>
                              <CommandGroup>
                                {categories?.map((category) => (
                                  <CommandItem
                                    value={category.id}
                                    key={category.id}
                                    onSelect={() => {
                                      form.setValue("category", category.id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        category.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {category.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                          onRemove={field.onChange}
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
                          onRemove={field.onChange}
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

export default AddServerModal;
