import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteVoiceDialogProps {
  showDeleteDialog: boolean;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  voiceName: string;
  handleDeleteVoice: () => void;
  isDeletingVoice: boolean;
}
const DeleteVoiceDialog = ({
  showDeleteDialog,
  setShowDeleteDialog,
  voiceName,
  handleDeleteVoice,
  isDeletingVoice,
}: DeleteVoiceDialogProps) => {
  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete voice</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{voiceName}&rdquo;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={isDeletingVoice} onClick={handleDeleteVoice}>
            {isDeletingVoice ? <Loader2 className="size-3.5 animate-spin" /> : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteVoiceDialog;
