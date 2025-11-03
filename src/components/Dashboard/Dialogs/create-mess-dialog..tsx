import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateMessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createMessData: {
    name: string;
    description: string;
    address: string;
  };
  onDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CreateMessDialog({
  open,
  onOpenChange,
  createMessData,
  onDataChange,
  onSubmit,
}: CreateMessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Mess</DialogTitle>
          <DialogDescription>Create a new mess and assign a manager.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Mess Name *</Label>
              <Input
                id="name"
                value={createMessData.name}
                onChange={(e) => onDataChange({ ...createMessData, name: e.target.value })}
                placeholder="Enter mess name"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={createMessData.description}
                onChange={(e) => onDataChange({ ...createMessData, description: e.target.value })}
                placeholder="Enter mess description"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={createMessData.address}
                onChange={(e) => onDataChange({ ...createMessData, address: e.target.value })}
                placeholder="Enter mess address"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Mess</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
