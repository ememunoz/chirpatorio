import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { CreatePostWizard, LoadingSpinner, Post } from "~/components";
import { api } from "~/utils/api";
import Head from "next/head";

export default function Home() {
  const { data, isLoading: isLoadingPosts } = api.posts.getAll.useQuery()
  const { isSignedIn, isLoaded: isUserLoaded } = useUser()

  if (!data) return <div>No data</div>

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="fixed top-0 right-0 left-0 h-[74px] flex items-center gap-4 p-4">
        {!isSignedIn && <SignInButton />}
        {isSignedIn && <SignOutButton />}
      </nav>
      <main className="wrapper relative top-[74px]">
        <div className="flex flex-col gap-4 p-4">
          {isUserLoaded
            ? <CreatePostWizard />
            : <div className="grid"><LoadingSpinner className="place-self-center" /></div>

          }
          {isLoadingPosts
            ? <div className="grid"><LoadingSpinner className="place-self-center" /></div>
            : <div>{data.map((post) => <Post key={post.post.id} {...post} />)} </div>
          }
        </div>
      </main>
    </>
  );
}
