'use client';
import { UsersListing } from './UsersListing';
import { UsersPageFilters } from './UsersPageFilters';

export default function UsersPage() {
  return (
    <div className="flex flex-col relative">
      <UsersPageFilters className=" px-2" />
      <UsersListing className="mt-2" />
    </div>
  );
}
