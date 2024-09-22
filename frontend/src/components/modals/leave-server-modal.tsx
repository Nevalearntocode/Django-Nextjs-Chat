"use client";

import React from "react";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogContent,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  useGetServerQuery,
  useLeaveServerMutation,
} from "@/redux/features/server-slice";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";
import { useServerId } from "@/hooks/use-server-id";
import { useRouter } from "next/navigation";
type Props = {};

export default function LeaveServerModal({}: Props) {
  const { isModalOpen, onOpenChange } = useModal("server-leave");
  const serverId = useServerId();
  const router = useRouter()
  const { data: server } = useGetServerQuery(serverId);
  const [leaveServer] = useLeaveServerMutation();

  if (!server) return null;

  const onConfirm = () => {
    leaveServer(server.id)
      .unwrap()
      .then(() => {
        onOpenChange();
        toast.success(`You have left ${server.name} server.`);
        router.push("/")
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
          toast.error("An error occurred while leaving the server.");
        }
      });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="opacity-60">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave server</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave {server?.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full items-center justify-end gap-4">
            <Button className="" variant={`secondary`} onClick={onOpenChange}>
              Cancel
            </Button>
            <Button className="" variant={`destructive`} onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
