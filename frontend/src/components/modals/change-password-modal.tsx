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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeModal } from "@/redux/features/modal-slice";
import { useChangePasswordMutation } from "@/redux/features/account-slice";
import { toast } from "sonner";

type Props = {};

const formSchema = z.object({
  oldPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(1, { message: "New password is required" }),
});

type FormType = z.infer<typeof formSchema>;

const ChangePasswordModal = (props: Props) => {
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const isModalOpen = isOpen && type === "change-password";
  const dispatch = useAppDispatch();
  const [changePassword] = useChangePasswordMutation();

  const onClose = () => {
    dispatch(closeModal());
  };

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    const oldPassword = data.oldPassword;
    const newPassword = data.newPassword;
    changePassword({ oldPassword, newPassword })
      .unwrap()
      .then(() => {
        onClose();
        form.reset();
        toast.success("Password changed successfully");
      })
      .catch((err: any) => {
        toast.error(err.data.old_password[0]);
      });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogOverlay className="opacity-60">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              You need to enter your current password and a new password.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4 flex w-full items-center justify-between">
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant={`secondary`}
                >
                  Cancel
                </Button>
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

export default ChangePasswordModal;
