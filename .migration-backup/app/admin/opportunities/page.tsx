'use client';

import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { AddOpportunityForm } from './add-opportunity-form';
import { EditOpportunityForm } from './edit-opportunity-form';
import { useState } from 'react';
import { Opportunity } from '@/lib/definitions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/app/components/ui/alert-dialog';
import { useLocalStorageState } from '@/lib/use-local-storage-state';
import { opportunities as initialOpportunities } from '@/lib/data';

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useLocalStorageState(
    'opportunities',
    initialOpportunities
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [opportunityToDelete, setOpportunityToDelete] = useState<Opportunity | null>(null);

  const handleAddOpportunity = (newOpportunity: any) => {
    const updatedOpportunities = [...opportunities, newOpportunity];
    setOpportunities(updatedOpportunities);
    setIsAddDialogOpen(false);
  };

  const handleUpdateOpportunity = (updatedOpportunity: any) => {
    const updatedOpportunities = opportunities.map((op) =>
      op.id === updatedOpportunity.id ? updatedOpportunity : op
    );
    setOpportunities(updatedOpportunities);
    setIsEditDialogOpen(false);
    setSelectedOpportunity(null);
  };

  const handleDeleteOpportunity = (opportunity: Opportunity) => {
    const updatedOpportunities = opportunities.filter((op) => op.id !== opportunity.id);
    setOpportunities(updatedOpportunities);
    setOpportunityToDelete(null);
  };

  const openEditDialog = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (opportunity: Opportunity) => {
    setOpportunityToDelete(opportunity);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Manage Opportunities</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Opportunity</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Opportunity</DialogTitle>
            </DialogHeader>
            <AddOpportunityForm onAdd={handleAddOpportunity} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opportunity) => (
            <TableRow key={opportunity.id}>
              <TableCell>{opportunity.title}</TableCell>
              <TableCell>{opportunity.type}</TableCell>
              <TableCell>{opportunity.deadline}</TableCell>
              <TableCell>{opportunity.status}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => openEditDialog(opportunity)}>
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(opportunity)}>
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  {opportunityToDelete && (
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the opportunity.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpportunityToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteOpportunity(opportunityToDelete)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  )}
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedOpportunity && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Opportunity</DialogTitle>
            </DialogHeader>
            <EditOpportunityForm opportunity={selectedOpportunity} onUpdate={handleUpdateOpportunity} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
