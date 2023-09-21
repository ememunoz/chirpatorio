import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import { z } from "zod";
import { type Post } from "@prisma/client";

// Create a new ratelimiter, that allows 3 requests per 1 min
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

const addUserDataToPosts = async (posts: Post[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    })
  ).map(filterUserForClient);

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId);
    if (!author?.username || author.username === null) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author for post not found",
      });
    }
    return {
      post,
      author: {
        ...author,
        username: author.username,
      },
    };
  });
}

export const postsRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ postId: z.string() })).query(
    async ({ ctx, input }) => {
      const singlePost = await ctx.db.post.findUnique({
        where: {
          id: input.postId
        }
      })
      if (!singlePost) throw new TRPCError({ code: "NOT_FOUND" })
      const [finalPost] = await addUserDataToPosts([singlePost]);
      return finalPost
    }
  ),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
    });
    return addUserDataToPosts(posts)

  }),

  getPostsByUserId: publicProcedure.input(z.object({ userId: z.string() })).query(
    async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          authorId: input.userId,
        },
        take: 100,
        orderBy: { createdAt: 'desc' },
      })
      return addUserDataToPosts(posts)
    }
  ),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji().min(1).max(280),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const post = await ctx.db.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),
});
