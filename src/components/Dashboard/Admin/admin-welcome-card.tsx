import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mess } from '@/types/types';
import { Crown, DollarSign, Plus, Settings, Trash2, Users } from 'lucide-react';

interface AdminWelcomeCardProps {
  onCreateMess: () => void;
  onDeleteMess: () => void;
  onDataCleanup: () => void;
  allMesses: Mess[];
}

export default function AdminWelcomeCard({
  onCreateMess,
  onDeleteMess,
  onDataCleanup,
  allMesses,
}: AdminWelcomeCardProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Crown className="w-7 h-7 text-yellow-500" />
          Admin Dashboard
        </CardTitle>
        <CardDescription className="text-base">
          Manage all messes and system data from one centralized location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Create Mess Section - Full Width */}
        <div className="space-y-4 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Create New Mess</h3>
              <p className="text-sm text-muted-foreground">
                Set up a new mess and assign a manager to get started
              </p>
            </div>
          </div>
          <Button onClick={onCreateMess} className="w-full md:w-auto" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Create New Mess
          </Button>
        </div>

        {/* Admin Controls Section - Full Width */}
        <div className="space-y-4 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Settings className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Administrative Controls</h3>
              <p className="text-sm text-muted-foreground">
                Advanced system management and maintenance tools
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <Button
              variant="outline"
              onClick={onDeleteMess}
              className="h-16 justify-start px-4 border-amber-200 bg-amber-50 hover:bg-amber-100"
              disabled={allMesses.length === 0}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Delete Mess</p>
                  <p className="text-xs text-muted-foreground">Remove existing mess</p>
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={onDataCleanup}
              className="h-16 justify-start px-4 border-orange-200 bg-orange-50 hover:bg-orange-100"
              disabled={allMesses.length === 0}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Trash2 className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Cleanup Data</p>
                  <p className="text-xs text-muted-foreground">System maintenance</p>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Messes Overview - Full Width */}
        {allMesses.length > 0 && (
          <div className="space-y-4 p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Existing Messes ({allMesses.length})</h3>
                <p className="text-sm text-muted-foreground">
                  Overview of all active messes in the system
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allMesses.slice(0, 4).map((mess) => (
                <Card
                  key={mess._id}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-lg truncate">{mess.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Users className="w-3 h-3" />
                          <span>{mess.members.length} members</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full">
                          <DollarSign className="w-3 h-3" />
                          <span className="text-sm font-medium">৳{mess.mealRate}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">per meal</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {allMesses.length > 4 && (
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  ... and {allMesses.length - 4} more messes
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {allMesses.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">No Messes Created Yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Get started by creating your first mess. You'll be able to manage members, track
                meals, and handle finances all in one place.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
