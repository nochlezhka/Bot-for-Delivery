'use client';
import { UserRoleFilter } from '@/features/UserRoleFilter';
import { NewUserDialog } from '@/widget/NewUserDialog';
import { UsersListing } from '@/widget/UsersListing';

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
