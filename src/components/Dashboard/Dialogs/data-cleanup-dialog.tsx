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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mess } from '@/types/types';

interface DataCleanupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMess: string;
  onMessChange: (messId: string) => void;
  allMesses: Mess[];
  cleanupType: 'meals' | 'expenses' | 'deposits' | 'all';
  onTypeChange: (type: 'meals' | 'expenses' | 'deposits' | 'all') => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onCleanupPreviousMonth: () => void;
  onConfirm: () => void;
}

export default function DataCleanupDialog({
  open,
  onOpenChange,
  selectedMess,
  onMessChange,
  allMesses,
  cleanupType,
  onTypeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onCleanupPreviousMonth,
  onConfirm,
}: DataCleanupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cleanup Data</DialogTitle>
          <DialogDescription>
            Delete data for a specific date range. Useful for cleaning up previous month data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="cleanup-mess">Select Mess</Label>
            <Select value={selectedMess} onValueChange={onMessChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a mess" />
              </SelectTrigger>
              <SelectContent>
                {allMesses.map((mess) => (
                  <SelectItem key={mess._id} value={mess._id}>
                    {mess.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cleanup-type">Data Type</Label>
            <Select value={cleanupType} onValueChange={(value: any) => onTypeChange(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data</SelectItem>
                <SelectItem value="meals">Meals Only</SelectItem>
                <SelectItem value="expenses">Expenses Only</SelectItem>
                <SelectItem value="deposits">Deposits Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onCleanupPreviousMonth}
            className="w-full"
          >
            Set to Previous Month
          </Button>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={!selectedMess || !startDate || !endDate}
          >
            Cleanup Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
