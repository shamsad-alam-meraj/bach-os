import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface AdminControlsProps {
  isAdmin: boolean;
  onCreateMess: () => void;
  onDeleteMess: () => void;
  onDataCleanup: () => void;
}

export default function AdminControls({
  isAdmin,
  onCreateMess,
  onDeleteMess,
  onDataCleanup,
}: AdminControlsProps) {
  if (!isAdmin) return null;

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onCreateMess}>
        <Plus className="w-4 h-4 mr-1" />
        Create Mess
      </Button>
      <Button variant="outline" size="sm" onClick={onDeleteMess}>
        <Trash2 className="w-4 h-4 mr-1" />
        Delete Mess
      </Button>
      <Button variant="outline" size="sm" onClick={onDataCleanup}>
        <Trash2 className="w-4 h-4 mr-1" />
        Cleanup Data
      </Button>
    </div>
  );
}
