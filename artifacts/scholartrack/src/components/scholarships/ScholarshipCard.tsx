import { Scholarship } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{scholarship.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{scholarship.description}</p>
        <p className="text-sm text-muted-foreground">Amount: ${scholarship.amount}</p>
        <p className="text-sm text-muted-foreground">Deadline: {scholarship.deadline}</p>
      </CardContent>
    </Card>
  );
}
