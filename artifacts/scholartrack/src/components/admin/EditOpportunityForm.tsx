import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Opportunity } from '@/lib/definitions';

export function EditOpportunityForm({ opportunity, onUpdate }: { opportunity: Opportunity; onUpdate: (opportunity: any) => void }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedOpportunity = {
      ...opportunity,
      title: formData.get('title') as string,
      type: formData.get('type') as string,
      deadline: formData.get('deadline') as string,
      status: formData.get('status') as string,
    };
    onUpdate(updatedOpportunity);
  };

  const opportunityTypes = ['Internship', 'Scholarship', 'Competition'];
  const opportunityStatuses = ['Saved', 'Planning', 'Applying', 'Submitted', 'Accepted', 'Rejected'];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">Title</Label>
          <Input id="title" name="title" defaultValue={opportunity.title} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">Type</Label>
          <Select name="type" defaultValue={opportunity.type}>
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
          <Input id="deadline" name="deadline" type="date" defaultValue={opportunity.deadline} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">Status</Label>
          <Select name="status" defaultValue={opportunity.status}>
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
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  );
}
