import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
	getAll: protectedProcedure
		.input(
			z.object({
				topicId: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			const notes = await ctx.prisma.note.findMany({
				where: {
					topicId: input.topicId,
				},
			});

			if (!notes || notes.length === 0) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "No notes found",
				});
			}

			return notes;
		}),

	create: protectedProcedure
		.input(
			z.object({
				title: z.string(),
				content: z.string(),
				topicId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const note = await ctx.prisma.note.create({
				data: {
					title: input.title,
					content: input.content,
					topicId: input.topicId,
				},
			});

			return note;
		}
	),

	delete: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const note = await ctx.prisma.note.delete({
				where: {
					id: input.id,
				},
			});

			return note;
		}
	),
});
