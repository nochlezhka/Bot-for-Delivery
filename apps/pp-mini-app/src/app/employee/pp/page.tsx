'use client';
import { NewPickupPointDialog } from '@/widget/NewPickupPointDialog';
import { TaskListing } from '@/widget/TaskListing';

export default function UsersPage() {
  return (
    <div className="flex flex-col relative">
      <NewPickupPointDialog className="mx-2 self-end" />
      <TaskListing className="mt-2" />
    </div>
  );
}
