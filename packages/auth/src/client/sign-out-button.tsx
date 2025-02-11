"use client";
import { PropsWithChildren } from "react";

export type SignOutButtonProps = {
  className?: string;
};

export const SignOutButton = ({
  children,
  className,
}: PropsWithChildren<SignOutButtonProps>) => {
  console.log("==> SignOutButton:", children, className);
  return (
    <a href="/auth/logout" className={"bg-red-500 text-black p-2 " + className}>
      {children}
    </a>
  );
};
