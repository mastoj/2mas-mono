"use client";

import { useAuth } from "@repo/auth/client/hooks";

export const UserInfo = () => {
  const authData = useAuth();

  if (!authData.isAuthenticated) {
    return <p>Not logged in</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2>User Info</h2>
      <div>Authenticated: {authData.isAuthenticated.toString()}</div>
      <div>Roles: {authData.roles.join(", ")}</div>
      <div>Name: {authData.name}</div>
      <div>Username: {authData.username}</div>
      <div>Access token: {authData.accessToken}</div>
    </div>
  );
};
