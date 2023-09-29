import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export const Navigation = () => {
  const { isSignedIn } = useUser();
  return (
    <nav className="fixed left-0 right-0 top-0 flex h-[74px] items-center justify-between gap-4 p-4">
      <h1 className="text-lg font-bold">
        <Link href="/">Chirpatorio</Link>
      </h1>
      {!isSignedIn && <SignInButton />}
      {isSignedIn && <SignOutButton />}
    </nav>
  );
};
