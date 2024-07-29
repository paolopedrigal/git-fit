"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  console.log("session:", session);
  console.log("status:", status);

  if (session)
    return (
      <main>
        <p>Hero, World!</p>
        <a onClick={() => signOut()}>Sign out</a>
      </main>
    );
  else
    return (
      <main>
        <p>No session currently</p>
        <a onClick={() => signIn()}>Sign in</a>
      </main>
    );
}
