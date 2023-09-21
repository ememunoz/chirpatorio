import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { LoadingSpinner, Post } from "~/components";
import { api } from "~/utils/api";
import Head from "next/head";
import { type GetStaticPaths, type GetStaticProps } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import superjson from "superjson";

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db, userId: null },
    transformer: superjson,
  });

  const postId = context.params?.id as string;

  await helpers.posts.getById.prefetch({ postId });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      postId,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default function SinglePostPage(props: { postId: string }) {
  const { postId } = props;
  const { data, isLoading: isLoadingPost } = api.posts.getById.useQuery({
    postId,
  });
  const { isSignedIn } = useUser();

  if (!data) return <div>No data</div>;

  return (
    <>
      <Head>
        <title>
          @{data.author.username} • {data.post.content.substring(0, 10)}... •
          Chirpatorio
        </title>
      </Head>
      <nav className="fixed left-0 right-0 top-0 flex h-[74px] items-center gap-4 p-4">
        {!isSignedIn && <SignInButton />}
        {isSignedIn && <SignOutButton />}
      </nav>
      <main className="wrapper relative top-[74px]">
        <div className="flex flex-col gap-4 p-4">
          {isLoadingPost ? (
            <div className="grid">
              <LoadingSpinner className="place-self-center" />
            </div>
          ) : (
            <div>
              <Post {...data} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
