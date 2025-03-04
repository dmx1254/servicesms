import React from "react";
import { Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LoadingDialog = ({
  open,
  title = "",
  description = "",
}: {
  open: boolean;
  title?: string;
  description?: string;
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-transparent border-none">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader className="h-10 w-10 text-[#67B142] animate-spin" />
          <p className="text-white">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialog;
