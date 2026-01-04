'use client';
import { UserRoleFilter } from '@/features/UserRoleFilter';
import { UsersListing } from '@/widget/UsersListing';

import { NewUserDialog } from '@/widget/NewUserDialog';

export default function UsersPage() {
  return (
    <div className="flex flex-col relative">
      <UserRoleFilter className=" px-2">
        <NewUserDialog className="col-start-2" />
      </UserRoleFilter>
      <UsersListing className="mt-2" />
    </div>
  );
}
