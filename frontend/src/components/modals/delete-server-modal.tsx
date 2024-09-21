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
import { useRouter } from "next/navigation";
import {
  useGetServerQuery,
  useDeleteServerMutation,
} from "@/redux/features/server-slice";
import { toast } from "sonner";
import { useModal } from "@/hooks/use-modal";
import { useServerId } from "@/hooks/use-server-id";
type Props = {};

export default function DeleteServerModal({}: Props) {
  const { isModalOpen, onOpenChange } = useModal("server-delete");
  const serverId = useServerId();
  
  const { data: server } = useGetServerQuery(serverId);
  const [deleteServer] = useDeleteServerMutation();
  const router = useRouter();

  if (!server) return null;

  const onConfirm = () => {
    deleteServer(server.id)
      .unwrap()
      .then(() => {
        onOpenChange();
        toast.success(`${server.name} has been deleted.`);
        router.push(`/`);
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
          toast.error("An error occurred while deleting the server.");
        }
      });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="opacity-60">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete server</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {server?.name}?
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
