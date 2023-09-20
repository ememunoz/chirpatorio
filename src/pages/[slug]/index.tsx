import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { LoadingSpinner, Post, ProfileImage } from "~/components";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import { api } from "~/utils/api";
import { type GetServerSideProps } from "next";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db, userId: null },
  });

  const slug = context.params?.slug as string;

  const username = slug.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ username });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
  };
};

export default function ProfilePage(props: { username: string }) {
  const { username } = props;
  const { data, isLoading: isLoadingPosts } = api.posts.getAll.useQuery();
  const { isSignedIn } = useUser();

  const { data: userData, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (isLoading) {
    console.log("LOADING");
  }
  if (!userData)
    return <div>Sorry we could&apos;t find the page you were looking for</div>;

  const { firstName, lastName, imageUrl } = userData;

  if (!data && !isLoadingPosts) return <div>No data</div>;

  return (
    <>
      <Head>
        <title>
          {firstName} {lastName} (@{username}) • Chirpatorio
        </title>
      </Head>
      <nav className="fixed left-0 right-0 top-0 flex h-[74px] items-center gap-4 p-4">
        {!isSignedIn && <SignInButton />}
        {isSignedIn && <SignOutButton />}
      </nav>
      <main className="wrapper relative top-[74px]">
        <div className="flex flex-col gap-4 p-4">
          <div className="grid grid-cols-[1fr,84px]">
            <h1 className="col-start-1 text-2xl font-bold">
              {firstName} {lastName}
            </h1>
            <p className="col-start-1 mb-4">{username}</p>
            <ProfileImage
              className="col-start-2 row-span-2 row-start-1 h-full w-full"
              src={imageUrl}
            />
          </div>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem
            eveniet quos libero dignissimos possimus omnis impedit pariatur
            cumque placeat earum, voluptatum, sit deleniti dolor magnam mollitia
            obcaecati inventore voluptas excepturi?
          </p>

          <section className="flex flex-col gap-8">
            <h2 className="text-lg font-bold">Posts</h2>
            {isLoadingPosts ? (
              <div className="grid">
                <LoadingSpinner className="place-self-center" />
              </div>
            ) : (
              <div>
                {data.map((post) => (
                  <Post key={post.post.id} {...post} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}