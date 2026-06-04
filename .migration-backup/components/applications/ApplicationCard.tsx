import { Application } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{application.scholarship_title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Status: {application.status}</p>
      </CardContent>
    </Card>
  );
}
