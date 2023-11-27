import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  
  checkUserType: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  
    if (!user) {
      throw new Error('User not found');
    }
  
    let type;
    let userId = {id:null as string | null, name:null as string | null};
  
    if (user.userType === "COMPANY") {
      const company = await ctx.db.company.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true, companyName: true }
      });
      type = "COMPANY";
      userId = {id:company?.id as string | null, name:company?.companyName as string | null};
    } else {
      const seeker = await ctx.db.seeker.findUnique({
        where: { userId: ctx.session.user.id },
        select: { id: true, firstName: true  }
      });
      type = "SEEKER";
      userId = {id:seeker?.id as string | null, name:seeker?.firstName as string | null};
    }
  
    const needsRegistration = user.userType == null;
    return { needsRegistration, type, userId };
  }),
  
  registerSeeker: protectedProcedure
  .input(z.object({
    firstName: z.string(),
    surName: z.string(),
    sex: z.string(),
    dob: z.string(),
    phone: z.string(),
    educationLevel: z.string(),
    schoolName: z.string(),
    major: z.string(),
    gpa: z.string(),
    profile: z.string()
  }))
  .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

    return  await ctx.db.$transaction([
        ctx.db.seeker.create({
          data: {
            ...input,
            userId: userId,
          },
        }),
        ctx.db.user.update({
          where: { id: userId },
          data: { userType: 'SEEKER', image: input.profile },
        }),
      ]);
  

  }),

    registerCompany: protectedProcedure
    .input(z.object({
      companyName: z.string(),
      companyType: z.string(),
      companyDetail: z.string(),
      companyAddress: z.string(),
      companyPhone: z.string(),
      logo: z.string() 
    }))
    .mutation(async ({ ctx, input }) => {

        const userId = ctx.session.user.id;
  
      return  await ctx.db.$transaction([
          ctx.db.company.create({
            data: {
              ...input,
              userId: userId,
            },
          }),
          ctx.db.user.update({
            where: { id: userId },
            data: { userType: 'COMPANY', image: input.logo },
          }),
        ]);
    }),

    createJobPosting: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      requirements: z.string(),
      benefits: z.string(),
      salary: z.string(),
      startTime: z.string(), 
      endTime: z.string(), 
      applicationJob: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
  
      const company = await ctx.db.company.findUnique({ where: { userId } });
      if (!company) {
        throw new Error("Only companies can create job postings");
      }
  
      return ctx.db.jobPosting.create({
        data: {
          title: input.title,
          description: input.description,
          requirements: input.requirements,
          benefits: input.benefits,
          salary: input.salary,
          startTime: input.startTime,
          endTime: input.endTime, 
          applicationJob: input.applicationJob,
          companyId: company.id,
        },
      });
      
    }),
  
    getJobPostings: publicProcedure.query(async ({ ctx }) => {
      const jobPostings = await ctx.db.jobPosting.findMany();
    
      const enhancedJobPostings = await Promise.all(jobPostings.map(async (jobPosting) => {
        const company = await ctx.db.company.findUnique({
          where: { id: jobPosting.companyId },
          select: { companyName: true, companyType: true, companyDetail: true, logo: true }
        });
    
        return {
          ...jobPosting,
          companyName: company?.companyName,
          companyType: company?.companyType,
          companyDetail: company?.companyDetail,
          companyLogo: company?.logo
        };
      }));
    
      return enhancedJobPostings;
    }),

    getJobById: publicProcedure 
    .input(z.object({ jobId: z.string() }))
    .query(async ({ ctx, input })  => {
      const jobPosting = await ctx.db.jobPosting.findUnique({
        where: { id: input.jobId }
      });
  
      if (!jobPosting) {
        throw new Error("Job posting not found");
      }
  
      const company = await ctx.db.company.findUnique({
        where: { id: jobPosting.companyId },
        select: { companyName: true, companyType: true, companyDetail: true, logo: true }
      });
  
      if (!company) {
        throw new Error("Company not found");
      }
  
      const jobPage = {
        ...jobPosting,
        companyName: company.companyName,
        companyType: company.companyType,
        companyDetail: company.companyDetail,
        companyLogo: company.logo
      };
  
      return jobPage;
    }),
    getCompanyById: publicProcedure 
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const company = await ctx.db.company.findUnique({
        where: { id: input.companyId },
        select: { companyName: true, 
          companyType: true, 
          companyDetail: true, 
          companyAddress:true, 
          companyPhone:true, 
          logo: true, 
          userId: true }
      });
  
      if (!company) {
        throw new Error("Company not found");
      }
  
      const jobPostings = await ctx.db.jobPosting.findMany({
        where: { companyId : input.companyId },
        select: { id: true, 
          title: true, 
          applicationJob: true, 
          salary: true, 
}
      });

      const email = await ctx.db.user.findUnique({
        where: { id: company.userId },
        select: { email: true}
      });
  
      const companyPage = {
        ...company,
        jobPostings: jobPostings.map(jobPosting => ({
          ...jobPosting,
        })),
        email
      };
  
      return companyPage;
    }),
    getSeekerById: protectedProcedure 
    .input(z.object({ seekerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const seeker = await ctx.db.seeker.findUnique({
        where: { id: input.seekerId },
        select: { firstName: true, 
          surName: true, 
          sex: true, 
          dob:true, 
          phone:true, 
          educationLevel:true, 
          schoolName:true, 
          major:true, 
          gpa: true, 
          profile: true, 
          userId: true }
      });
  
      if (!seeker) {
        throw new Error("Company not found");
      }


      const email = await ctx.db.user.findUnique({
        where: { id: seeker.userId },
        select: { email: true}
      });
  
      const seekerPage = {
        ...seeker,
        email,
      };
  
      return seekerPage;
    }),

    getMyjobsCompany: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      const company = await ctx.db.company.findUnique({
        where: { userId }
      });
      const jobPostings = await ctx.db.jobPosting.findMany({
        where: { companyId: company?.id },
        select: {
          id: true,
          title: true,
          applicationJob: true,
          createdAt: true,
          applications: {
            select: {
              id: true,
              coverLetter: true,
              status: true,
              createdAt: true,
              updatedAt: true,
              seeker: {
                select: {
                  id: true,
                  firstName: true,
                  surName: true,
                  schoolName: true,
                  profile: true,
                },
              },
            },
          },
        },
      });
    
      const myJobs = {
        jobPostings: jobPostings.map((jobPosting) => ({
          ...jobPosting,
          applicationCount: jobPosting.applications.length, 
        })),
      };
    
      return myJobs;
    }),
    
    
    getSeekerApplications: protectedProcedure .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      const seeker = await ctx.db.seeker.findUnique({
        where: { userId }
      });
  
      const applications = await ctx.db.application.findMany({
        where: { seekerId: seeker?.id },
        include: {
          jobPosting: {
            select: { 
              id: true, 
              title: true, 
              company: true,
            }
          },
        }
      });
    
      const seekerApplications = applications.map(application => ({
        applicationId: application.id,
        coverLetter: application.status,
        status: application.status,
        jobPosting: application.jobPosting,
        createdAt: application.createdAt,
      }));
    
      return seekerApplications;
    }),

    applyJob: protectedProcedure
    .input(z.object({
      jobPostingId: z.string(),
      coverLetter: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const seeker = await ctx.db.seeker.findUnique({
        where: { userId }
      });
  
      if (!seeker) {
        throw new Error('Only registered seekers can apply for jobs');
      }

      return await ctx.db.application.create({
        data: {
          jobPostingId: input.jobPostingId,
          seekerId: seeker.id,
          coverLetter: input.coverLetter,
        },
      });
    }),

    appliedJob: protectedProcedure
    .input(z.object({
      jobPostingId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const seeker = await ctx.db.seeker.findUnique({
        where: { userId }
      });
  
      if (!seeker) {
        throw new Error('Only registered seekers can apply for jobs');
      }


      const existing = await ctx.db.application.findFirst({
        where: {
          jobPostingId: input.jobPostingId,
          seekerId: seeker.id,
        },
      });
  
      if (existing) {
        return {existingApplication : true}
      }
      else{
        return {existingApplication : false}
      }

    }),
    
    updateViewed: protectedProcedure
    .input(z.object({
      seekerId: z.string(),
      jobPostingId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.db.company.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });
  
      if (!company) {
        throw new Error('Only companies can update application statuses');
      }
  
      await ctx.db.application.updateMany({
        where: {
          seekerId: input.seekerId,
          jobPostingId: input.jobPostingId,
          jobPosting: {
            companyId: company.id,
          },
        },
        data: {
          status: "viewed",
        },
      });
  
      return { success: true };
    }),
  

    seekerProtect: protectedProcedure
    .input(z.object({
      seekerId: z.string(),
    }))
    .query(async ({ ctx, input }) => {

      const companyId = await ctx.db.company.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });
      const applications = await ctx.db.application.findMany({
        where: {
          seekerId: input.seekerId,
          jobPosting: {
            companyId: companyId?.id,
          },
        },
        include: {
          jobPosting: true,
        },
      });

      const hasApplied = applications.length > 0;
      return { hasApplied };
    }),

  deleteJobPosting: protectedProcedure
    .input(z.object({
      jobId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const company = await ctx.db.company.findUnique({
        where: { userId },
      });

      if (!company) {
        throw new Error('Only registered companies can delete job postings');
      }

      const jobPosting = await ctx.db.jobPosting.delete({
        where: { 
          id: input.jobId,
          companyId: company.id 
        },
      });

      if (!jobPosting) {
        throw new Error('Job posting not found or not authorized to delete');
      }
      else{
        return { success: true };
      }
      
    }),
  
});