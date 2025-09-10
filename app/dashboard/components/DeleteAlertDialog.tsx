// app/dashboard/components
// custom alert dialog for deleting data in the data tables action dropdown
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import React from "react";

interface Props {
  title: string;
  data: () => React.ReactNode;
  deleteFn: () => void;
}

const DeleteAlertDialog = ({ title, data, deleteFn }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="!text-red-500 hover:!text-red-500 cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <Trash2 color="#fb2c36" className="!size-[14]" />
          Delete {title}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent className="z-50">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 justify-center md:justify-start">
            {" "}
            <Trash2 size={17} className="mb-0.5 hidden md:inline-flex" /> Are
            you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-bold">This action cannot be undone.</span>{" "}
            This will permanently delete the selected {title}{" "}
            <span className="font-bold text-red-400">({data()})</span> and
            remove the {title} from our servers and database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 cursor-pointer hover:bg-red-700 !gap-1"
            onClick={() => {
              deleteFn();
            }}
          >
            Delete <span className="capitalize p-0 m-0">{title}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlertDialog;
