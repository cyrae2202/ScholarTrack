import { fetchScholarshipById } from '@/lib/data';
import { Scholarship } from '@/lib/definitions';
import { notFound } from 'next/navigation';

export default async function ApplyPage({ params }: { params: { id: string } }) {
  const scholarship = await fetchScholarshipById(params.id);

  if (!scholarship) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Apply for {scholarship.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Scholarship Details</h2>
          <p className="mb-2">{scholarship.description}</p>
          <p className="text-sm text-gray-500">Amount: ${scholarship.amount}</p>
          <p className="text-sm text-gray-500">Deadline: {scholarship.deadline}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Application Form</h2>
          {/* Application form will go here */}
        </div>
      </div>
    </div>
  );
}
