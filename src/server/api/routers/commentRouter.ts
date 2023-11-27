import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  
    commentPosting:protectedProcedure.input(z.object({
        jobId: z.string(),
        content: z.string(), 
      })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;
        const { jobId, content } = input;
      
        const comment = await ctx.db.comment.create({
          data: {
            content,
            userId,
            jobPostingId: jobId,
          },
        });
      
        return comment;
      }),

    deleteComment:protectedProcedure.input(z.object({
        commentId: z.string(),
      })).mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;
        const { commentId } = input;
      
        // Check if the comment exists and belongs to the current user
        const comment = await ctx.db.comment.findUnique({
          where: {
            id: commentId,
          },
        });
      
        if (!comment || comment.userId !== userId) {
          throw new Error('Comment not found or unauthorized to delete.');
        }
      
        // Delete the comment
        await ctx.db.comment.delete({
          where: {
            id: commentId,
          },
        });
      
        return 'Comment deleted successfully';
    }),    
    getAllComments: protectedProcedure.input(z.object({
        jobId: z.string(),
    })).query(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;
        const { jobId } = input;
    
        const comments = await ctx.db.comment.findMany({
            where: {
                jobPostingId: jobId,
            },
        });
    
        const commentsWithMatch = await Promise.all(comments.map(async (comment) => {
            const userData = await ctx.db.user.findUnique({
                where: {
                    id: comment.userId,
                },
                include: {
                    seeker: {
                        select: {
                            firstName: true,
                            surName: true,
                        },
                    },
                    company: {
                        select: {
                            companyName: true,
                        },
                    },
                },
            });
            

            const userIdMatched = comment.userId === userId;
            return {
                ...comment,
                userIdMatched,
                userData,
            };
        }));
        
    
        return commentsWithMatch;
    }),

  });