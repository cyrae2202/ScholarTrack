'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Database } from '@/lib/database.types';

export function Header() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-xl font-bold">Opportunity Tracker</h1>
      <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
    </header>
  );
}
