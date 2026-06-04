import { Opportunity } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{opportunity.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{opportunity.description}</p>
        <div className="flex flex-wrap gap-2">
          {opportunity.skills?.map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
