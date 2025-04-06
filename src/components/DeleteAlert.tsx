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

import React from "react";
import { RxCross2 } from "react-icons/rx";

interface DeleteAlertProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteTrip: (tripId: string) => void;
  tripId: string;
}

const DeleteAlert = ({
  modalOpen,
  setModalOpen,
  deleteTrip,
  tripId,
}: DeleteAlertProps) => {
  return (
    <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
      <AlertDialogTrigger
        className="absolute top-2 right-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-full p-2 cursor-pointer hover:bg-red-400  transition-colors duration-200 ease-in-out">
          <RxCross2 color="white" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this trip and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteTrip(tripId)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlert;
