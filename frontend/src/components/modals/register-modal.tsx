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
import { closeModal, openModal } from "@/redux/features/modal-slice";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/redux/features/account-slice";
import { toast } from "sonner";
import { setLogin } from "@/redux/features/auth-slice";

type Props = {};

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  repassword: z.string().min(1, { message: "Re-Password is required" }),
});

type FormType = z.infer<typeof formSchema>;

const RegisterModal = (props: Props) => {
  const dispatch = useAppDispatch();
  const { isOpen, type } = useAppSelector((state) => state.modal);
  const isModalOpen = isOpen && type === "register";
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();

  const onClose = () => {
    dispatch(closeModal());
  };

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      repassword: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      form.handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (data: FormType) => {
    const password = data.password;
    const repassword = data.repassword;
    if (password !== repassword) {
      toast.error("Passwords do not match");
    }

    register(data)
      .unwrap()
      .then((res) => {
        dispatch(closeModal());
        form.reset();
        toast.success("Account created successfully");

        login({
          username: data.username,
          password: data.password,
        })
          .unwrap()
          .then((res) => {
            dispatch(setLogin(null));
          })
          .catch((err) => {
            console.log(err);
            toast.error("Something went wrong");
          });
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
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogOverlay className="opacity-60">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new account</DialogTitle>
            <DialogDescription>
              You need a new account to chat.
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
              <FormField
                control={form.control}
                name="repassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(closeModal());
                    dispatch(openModal("login"));
                  }}
                >
                  Login
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Register
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default RegisterModal;
