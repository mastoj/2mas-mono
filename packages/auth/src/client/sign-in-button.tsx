"use client";
import { PropsWithChildren } from "react";

export type SignInButtonProps = {
  className?: string;
};

export const SignInButton = ({
  children,
  className,
}: PropsWithChildren<SignInButtonProps>) => {
  return (
    <a href="/login" className={"bg-green-500 text-black p-2 " + className}>
      {children}
    </a>
  );
};
