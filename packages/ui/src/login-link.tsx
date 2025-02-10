"use client";

import { usePathname } from "next/navigation";

type Props = {
  appDomain: string;
};

export const LoginLink = ({ appDomain }: Props) => {
  const pathname = usePathname();
  return (
    <a
      href={`/login?returnUrl=${appDomain}/${pathname}`}
      className="px-4 py-2 bg-green-400"
    >
      Login
    </a>
  );
};
