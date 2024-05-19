'use client';

import { useState } from 'react';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import { deleteAccount } from '@/app/lib/actions/users.actions';
import { signOut } from 'next-auth/react';

function DeleteAccount() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <a href="#" onClick={(e) => {
      e.preventDefault();
      setDialogOpen(true);
    }}>
      <span className="ml-4">
        Delete Account
      </span>
      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={async () => {
          await deleteAccount();
          await signOut({ callbackUrl: `${window.location.origin}` });
        }}
        ariaId="delete-dialog"
        title="Delete Account"
        message="Are you sure you want to delete your account. It cannot be recovered after this?"
      />
    </a>
  );
}

export default DeleteAccount;
