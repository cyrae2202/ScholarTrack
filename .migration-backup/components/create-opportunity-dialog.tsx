'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from '@/lib/database.types';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];
type OpportunityInsert = Database['public']['Tables']['opportunities']['Insert'];

const opportunitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  organization: z.string().min(1, 'Organization is required'),
  description: z.string().optional(),
  application_link: z.string().url('Invalid URL').optional(),
  opportunity_type: z.enum(['Scholarship', 'Competition', 'Internship', 'Workshop', 'Summer Program', 'Exchange Program', 'Other']),
  deadline: z.string().optional(),
  status: z.enum(['Saved', 'Planning', 'Applying', 'Submitted', 'Accepted', 'Rejected']),
  notes: z.string().optional(),
});

export function CreateOpportunityDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OpportunityInsert>({
    resolver: zodResolver(opportunitySchema),
  });

  const onSubmit: SubmitHandler<OpportunityInsert> = async (data) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase.from('opportunities').insert([{ ...data, user_id: user.id }]);
        router.refresh();
        onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Opportunity</DialogTitle>
          <DialogDescription>
            Add a new opportunity to your tracking list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <Input placeholder="Title" {...register('title')} />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          <Input placeholder="Organization" {...register('organization')} />
          {errors.organization && <p className="text-red-500 text-xs">{errors.organization.message}</p>}
          <Textarea placeholder="Description" {...register('description')} />
          <Input placeholder="Application Link" {...register('application_link')} />
          {errors.application_link && <p className="text-red-500 text-xs">{errors.application_link.message}</p>}
          <Select onValueChange={(value) => register('opportunity_type', { value })} >
            <SelectTrigger>
              <SelectValue placeholder="Opportunity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Scholarship">Scholarship</SelectItem>
              <SelectItem value="Competition">Competition</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
              <SelectItem value="Summer Program">Summer Program</SelectItem>
              <SelectItem value="Exchange Program">Exchange Program</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" {...register('deadline')} />
          <Select onValueChange={(value) => register('status', { value })}>
            <SelectTrigger>
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Saved">Saved</SelectItem>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="Applying">Applying</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Textarea placeholder="Notes" {...register('notes')} />
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
