import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const topicRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const topics = await ctx.prisma.topic.findMany({
			where: {
				userId: ctx.session.user.id,
			},
		})

		if (!topics || topics.length === 0) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "No topics found",
			});
		}

		return topics;
	}),

	create: protectedProcedure
		.input(
			z.object({
				title: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const topic = await ctx.prisma.topic.create({
				data: {
					title: input.title,
					userId: ctx.session.user.id,
				},
			});

			return topic;
		}
	),
});
