"use client";

import { usePathname } from "next/navigation";

type Props = {
  appDomain: string;
};

export const LogoutLink = ({ appDomain }: Props) => {
  const pathname = usePathname();
  return (
    <a
      href={`/logout?returnUrl=${appDomain}/${pathname}`}
      className="px-4 py-2 bg-red-400"
    >
      Log out
    </a>
  );
};
