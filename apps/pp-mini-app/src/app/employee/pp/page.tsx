'use client';
import { NewPickupPointDialog } from '@/widget/NewPickupPointDialog';
import { PickupPointListing } from '@/widget/PickupPointListing';

export default function UsersPage() {
  return (
    <div className="flex flex-col relative">
      <NewPickupPointDialog className="mx-2 self-end" />
      <PickupPointListing className="mt-2" />
    </div>
  );
}
