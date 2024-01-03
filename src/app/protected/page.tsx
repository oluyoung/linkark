import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

async function ProtectedRoute() {
  const session = await getServerSession();

  if (!session || !session.user) redirect('/api/auth/signin');

  return <p>This is a protected route.</p>;
}

export default ProtectedRoute;
