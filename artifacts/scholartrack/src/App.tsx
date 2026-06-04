import { useEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavContext } from "@/components/layout/NavContext";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import OpportunityApplyPage from "@/pages/OpportunityApplyPage";
import ScholarshipApplyPage from "@/pages/ScholarshipApplyPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminOpportunitiesPage from "@/pages/AdminOpportunitiesPage";
import DiscoverPage from "@/pages/DiscoverPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function AppRoutes({ session }: { session: Session | null }) {
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (!session && location !== '/login') {
      navigate('/login');
    } else if (session && location === '/login') {
      navigate('/');
    }
  }, [session, location, navigate]);

  if (!session && location !== '/login') return null;

  return (
    <NavContext.Provider value={{ navigate }}>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={DashboardPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/discover" component={DiscoverPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/opportunities/:id/apply" component={({ params }) => <OpportunityApplyPage id={params.id} />} />
        <Route path="/scholarships/:id/apply" component={({ params }) => <ScholarshipApplyPage id={params.id} />} />
        <Route path="/admin/dashboard" component={AdminDashboardPage} />
        <Route path="/admin/opportunities" component={AdminOpportunitiesPage} />
        <Route component={NotFound} />
      </Switch>
    </NavContext.Provider>
  );
}

function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRoutes session={session} />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
