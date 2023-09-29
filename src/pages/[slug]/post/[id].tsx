import { LoadingSpinner, Navigation, Post } from "~/components";
import { api } from "~/utils/api";
import Head from "next/head";
import { type GetStaticPaths, type GetStaticProps } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import superjson from "superjson";
import Link from "next/link";

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

  if (!data) return <div>No data</div>;

  return (
    <>
      <Head>
        <title>
          @{data.author.username} • {data.post.content.substring(0, 10)}... •
          Chirpatorio
        </title>
      </Head>
      <Navigation />
      <main className="wrapper relative top-[74px]">
        <div className="flex flex-col gap-4 p-4">
          <Link href={`/@${data.author.username}`}>Go back</Link>
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
