import { createServerSideHelpers } from "@trpc/react-query/server";
import { Navigation, ProfileFeed, ProfileImage } from "~/components";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import { api } from "~/utils/api";
import { type GetStaticPaths, type GetStaticProps } from "next";
import Head from "next/head";
import superjson from "superjson";

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db, userId: null },
    transformer: superjson,
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

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default function ProfilePage(props: { username: string }) {
  const { username } = props;

  console.log("Props", props);
  const { data: userData } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!userData)
    return <div>{`Sorry we couldn't find the page you were looking for`}</div>;

  const { firstName, lastName, imageUrl, id: userId } = userData;

  return (
    <>
      <Head>
        <title>
          {firstName} {lastName} (@{username}) • Chirpatorio
        </title>
      </Head>
      <Navigation />
      <main className="wrapper relative top-[74px]">
        <div className="flex flex-col gap-4 p-4">
          <div className="grid grid-cols-[1fr,84px]">
            <h1 className="col-start-1 text-2xl font-bold">
              {firstName} {lastName}
            </h1>
            <p className="col-start-1 mb-4">@{username}</p>
            <ProfileImage
              className="col-start-2 row-span-2 row-start-1 h-full w-full"
              src={imageUrl}
            />
          </div>
          <p>This site was built using Create T3 stack.</p>
          <p>Next.js, tRPC, TypeScript, Tailwind, Prisma, and more</p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem
            eveniet quos libero dignissimos possimus omnis impedit pariatur
            cumque placeat earum?
          </p>

          <section className="flex flex-col gap-8">
            <h2 className="text-lg font-bold">Posts</h2>
            <ProfileFeed userId={userId} />
          </section>
        </div>
      </main>
    </>
  );
}
