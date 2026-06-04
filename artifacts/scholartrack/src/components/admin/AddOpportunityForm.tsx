import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';

export function AddOpportunityForm({ onAdd }: { onAdd: (opportunity: any) => void }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newOpportunity = {
      id: Math.random().toString(),
      title: formData.get('title') as string,
      type: formData.get('type') as string,
      organization: formData.get('organization') as string,
      description: formData.get('description') as string,
      applicationLink: formData.get('applicationLink') as string,
      deadline: formData.get('deadline') as string,
      status: formData.get('status') as string,
    };
    onAdd(newOpportunity);
  };

  const opportunityTypes = ['Internship', 'Scholarship', 'Competition'];
  const opportunityStatuses = ['Saved', 'Planning', 'Applying', 'Submitted', 'Accepted', 'Rejected'];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">Title</Label>
          <Input id="title" name="title" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="organization" className="text-right">Organization</Label>
          <Input id="organization" name="organization" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">Description</Label>
          <Input id="description" name="description" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="applicationLink" className="text-right">Link</Label>
          <Input id="applicationLink" name="applicationLink" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">Type</Label>
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
          <Label htmlFor="deadline" className="text-right">Deadline</Label>
          <Input id="deadline" name="deadline" type="date" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">Status</Label>
          <Select name="status">
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {opportunityStatuses.map(status => (
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
