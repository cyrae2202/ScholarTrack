'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Database } from '@/lib/database.types';
import { Opportunity } from '@/lib/definitions';

interface CreateOpportunityDialogProps {
  onOpportunityCreated: (opportunity: Opportunity) => void;
}

export function CreateOpportunityDialog({ onOpportunityCreated }: CreateOpportunityDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const supabase = createClientComponentClient<Database>();

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from('opportunities')
      .insert([{ title, description, skills: skills.split(',').map((s) => s.trim()) }])
      .select();

    if (error) {
      console.error('Error creating opportunity:', error);
    } else if (data) {
      onOpportunityCreated(data[0] as Opportunity);
      setOpen(false);
      setTitle('');
      setDescription('');
      setSkills('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Opportunity</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Opportunity</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new opportunity.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input placeholder="Skills (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
