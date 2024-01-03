import { getServerSession } from 'next-auth';

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
       Server sessions
       {session?.user?.name ? (
         <div>{session?.user?.name}</div>
       ) : (
         <div>Not logged in</div>
       )}
       Home
    </main>
  );
}
