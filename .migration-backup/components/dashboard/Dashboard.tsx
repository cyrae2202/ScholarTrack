'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { OpportunityList } from '@/components/opportunities/OpportunityList';
import { CreateOpportunityDialog } from '@/components/opportunities/CreateOpportunityDialog';
import { Database } from '@/lib/database.types';
import { Opportunity } from '@/lib/definitions';

export function Dashboard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchOpportunities = async () => {
      const { data, error } = await supabase.from('opportunities').select('*');
      if (error) {
        console.error('Error fetching opportunities:', error);
      } else {
        setOpportunities(data as Opportunity[]);
      }
    };

    fetchOpportunities();
  }, [supabase]);

  const handleOpportunityCreated = (opportunity: Opportunity) => {
    setOpportunities((prev) => [...prev, opportunity]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Opportunities</h2>
        <CreateOpportunityDialog onOpportunityCreated={handleOpportunityCreated} />
      </div>
      <OpportunityList opportunities={opportunities} />
    </div>
  );
}
