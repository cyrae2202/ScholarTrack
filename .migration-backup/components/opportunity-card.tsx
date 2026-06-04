import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

import { Database } from '@/lib/database.types';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{opportunity.title}</CardTitle>
        <CardDescription>{opportunity.organization}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Deadline</p>
            <p className="font-medium">{format(new Date(opportunity.deadline!), 'MMMM dd, yyyy')}</p>
          </div>
          <Badge variant={opportunity.status === 'Applied' ? 'default' : 'secondary'}>{opportunity.status}</Badge>
        </div>
        <p className="text-sm text-gray-500 mb-2">Description</p>
        <p className="line-clamp-3">{opportunity.description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">View Details</Button>
      </CardFooter>
    </Card>
  );
}
