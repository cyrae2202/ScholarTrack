import { Avatar, AvatarFallback, AvatarImage } from '@/(components)/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/(components)/ui/card';

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatarUrl: 'https://github.com/shadcn.png',
    bio: 'A passionate student developer interested in web technologies and open source.',
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>{user.bio}</p>
        </CardContent>
      </Card>
    </div>
  );
}
