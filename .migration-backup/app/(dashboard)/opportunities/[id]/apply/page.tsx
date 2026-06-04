import { fetchOpportunityById } from '@/app/(lib)/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/(components)/ui/card';
import { Badge } from '@/(components)/ui/badge';

export default function ApplyPage({ params }: { params: { id: string } }) {
  const opportunity = fetchOpportunityById(params.id);

  if (!opportunity) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{opportunity.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">{opportunity.description}</p>
          <div className="flex justify-between items-center mb-4">
            <Badge>{opportunity.type}</Badge>
            <p className="text-sm text-gray-500">Due: {opportunity.deadline}</p>
          </div>
          <a href={opportunity.applicationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Apply Here
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
