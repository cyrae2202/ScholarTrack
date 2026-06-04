import { Card, CardContent, CardHeader, CardTitle } from "@/(components)/ui/card";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the admin dashboard. You can manage opportunities from here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
