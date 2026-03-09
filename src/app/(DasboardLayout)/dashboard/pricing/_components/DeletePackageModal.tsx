import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PricingPackage } from "@/types";
import { Trash2 } from "lucide-react";

const DeletePackageModal = ({
  pkg,
  open,
  onClose,
  onConfirm,
}: {
  pkg: PricingPackage | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!pkg) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <DialogTitle className="text-center">Delete Package?</DialogTitle>
          <DialogDescription className="text-center">
            You&apos;re about to permanently delete{" "}
            <span className="font-medium text-foreground">{pkg.name}</span>.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border p-4 my-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-foreground">{pkg.name}</p>
              <p className="text-sm text-muted-foreground">{pkg.validity}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-foreground">${pkg.price}</p>
              <p className="text-xs text-[#A9F877] font-medium">
                {pkg.credits} Credits
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-1.5"
            onClick={onConfirm}
          >
            <Trash2 className="w-4 h-4" />
            Delete Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeletePackageModal;
