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
import { useAppDispatch } from "@/redux/hooks";
import { closeModal, openModal } from "@/redux/features/modal-slice";
import { useLoginMutation } from "@/redux/features/account-slice";
import { setLogin } from "@/redux/features/auth-slice";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";

type Props = {};

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormType = z.infer<typeof formSchema>;

const LoginModal = (props: Props) => {
  const { isModalOpen, onOpenChange } = useModal("login");
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const onSubmit = (data: FormType) => {
    login(data)
      .unwrap()
      .then((res) => {
        dispatch(setLogin(null));
        onOpenChange();
        form.reset();
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
          toast.error("An error occurred during registration");
        }
      });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="opacity-60">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log into your account</DialogTitle>
            <DialogDescription>
              You need to be authenticated to chat.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
              onKeyDown={handleKeyDown}
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 flex w-full justify-end gap-4">
                <Button
                  variant={`link`}
                  disabled={isLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(closeModal());
                    dispatch(openModal("register"));
                  }}
                >
                  Register
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default LoginModal;
