'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import ConfirmDialog from '@/app/components/ConfirmDialog';

function SignOut() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <button className="ml-4" onClick={() => setDialogOpen(true)}>Log Out</button>
      <ConfirmDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSuccess={() => signOut({ callbackUrl: `${window.location.origin}` })} ariaId="logout-dialog" title="Logging out" message="Are you sure you want to log out?" />
    </>
  );
}

export default SignOut;
