import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { LoadingSpinner, Post } from "~/components";
import { api } from "~/utils/api";
import Head from "next/head";

export default function SinglePostPage() {
  const { data, isLoading: isLoadingPosts } = api.posts.getAll.useQuery();
  const { isSignedIn } = useUser();

  if (!data && !isLoadingPosts) return <div>No data</div>;
  if (!data) return;
  if (data.length < 0) return;
  const post = data[0]!;

  return (
    <>
      <Head>
        <title>@username • ${`first charaters of post`} • Chirpatorio</title>
      </Head>
      <nav className="fixed left-0 right-0 top-0 flex h-[74px] items-center gap-4 p-4">
        {!isSignedIn && <SignInButton />}
        {isSignedIn && <SignOutButton />}
      </nav>
      <main className="wrapper relative top-[74px]">
        <div className="flex flex-col gap-4 p-4">
          {isLoadingPosts ? (
            <div className="grid">
              <LoadingSpinner className="place-self-center" />
            </div>
          ) : (
            <div>
              <Post {...post} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}