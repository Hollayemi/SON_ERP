"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DeleteDialogProps {
  type: "role" | "permission";
  item: {
    id: string;
    name: string;
  };
  affectedCount?: number; // For roles: number of users, for permissions: number of roles
  onSuccess?: () => void;
}

export function DeleteDialog({ type, item, affectedCount = 0, onSuccess }: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`${type === "role" ? "Role" : "Permission"} deleted successfully`, {
        description: `${item.name} has been permanently removed.`,
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to delete", {
        description: "Please try again later.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="size-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {type === "role" ? "Role" : "Permission"}?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete <strong>{item.name}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {affectedCount > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              {type === "role" ? (
                <>
                  This role is currently assigned to <strong>{affectedCount} user(s)</strong>. Deleting it will remove
                  these assignments.
                </>
              ) : (
                <>
                  This permission is used by <strong>{affectedCount} role(s)</strong>. Deleting it will remove it from
                  those roles.
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
