'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { DialogFooter } from '@/app/components/ui/dialog';
import { useLocalStorageState } from '@/lib/use-local-storage-state';

export function AddOpportunityForm({ onAdd }: { onAdd: (opportunity: any) => void }) {
  const [opportunities] = useLocalStorageState('opportunities', []);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newOpportunity = {
      id: Math.random().toString(),
      title: formData.get('title') as string,
      type: formData.get('type') as string,
      deadline: formData.get('deadline') as string,
      status: formData.get('status') as string,
    };
    onAdd(newOpportunity);
  };
  const opportunityTypes = Array.from(new Set(opportunities.map(op => op.type)));
  const opportunityStatues = ['Saved', 'Planning', 'Applying', 'Submitted', 'Accepted', 'Rejected'];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input id="title" name="title" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <Select name="type">
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {opportunityTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deadline" className="text-right">
            Deadline
          </Label>
          <Input id="deadline" name="deadline" type="date" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select name="status">
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
            {opportunityStatues.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Add Opportunity</Button>
      </DialogFooter>
    </form>
  );
}
