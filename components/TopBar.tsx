"use client";

import { UserButton } from "@clerk/nextjs";

export default function TopBar() {
  return (
    <div className="flex items-center justify-end px-8 py-4">
      <UserButton afterSignOutUrl="/sign-in" showName />
    </div>
  );
}
