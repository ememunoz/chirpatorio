import { type User } from "@clerk/backend";
import { clerkClient } from "@clerk/nextjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { z } from "zod";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    imageUrl: user.imageUrl
  }
}

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
    })
    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient)
    return posts.map(post => ({
      post,
      author: users.find((user) => user.id === post.authorId)
    }))
  }),
});
