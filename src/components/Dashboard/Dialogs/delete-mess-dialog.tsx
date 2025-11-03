import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mess } from '@/types/types';

interface DeleteMessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMess: string;
  onMessChange: (messId: string) => void;
  allMesses: Mess[];
  onConfirm: () => void;
}

export default function DeleteMessDialog({
  open,
  onOpenChange,
  selectedMess,
  onMessChange,
  allMesses,
  onConfirm,
}: DeleteMessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Mess</DialogTitle>
          <DialogDescription>
            This will permanently delete the mess and all related data (meals, expenses, deposits).
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="delete-mess">Select Mess to Delete</Label>
            <Select value={selectedMess} onValueChange={onMessChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a mess" />
              </SelectTrigger>
              <SelectContent>
                {allMesses.map((mess) => (
                  <SelectItem key={mess._id} value={mess._id}>
                    {mess.name} ({mess.members.length} members)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={!selectedMess}>
            Delete Mess
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
