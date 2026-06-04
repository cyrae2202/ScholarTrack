import { Scholarship } from '@/lib/definitions';
import { ScholarshipCard } from './ScholarshipCard';

interface ScholarshipListProps {
  scholarships: Scholarship[];
}

export function ScholarshipList({ scholarships }: ScholarshipListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {scholarships.map((scholarship) => (
        <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
      ))}
    </div>
  );
}
