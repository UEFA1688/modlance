
"use client"
import { useState } from 'react';
import { api } from "~/utils/api";
import { useRouter } from 'next/navigation'
import { IconLoading } from "~/components/IconLoading";


interface PageProps {
    setPage: React.Dispatch<React.SetStateAction<number>>;
}
  
export function MyJobs({ setPage }: PageProps) {
    const router = useRouter()
    const { data: checkUserType, status } = api.user.checkUserType.useQuery();
    const { data: getMyjobsCompany, status: statusMyjobsCompany } = api.user.getMyjobsCompany.useQuery();
    const { data: getSeekerApplications, status: statusSeekerApplications } = api.user.getSeekerApplications.useQuery();
    const { mutate: updateViewedMutation } = api.user.updateViewed.useMutation();
    const { mutate: deleteJobPosting } = api.user.deleteJobPosting.useMutation();
    const [showCompanyApplication, setShowCompanyApplication] = useState(false);
    const [jobPostingsId, setJobPostingsId] = useState('');
    const [deleteJob, setDeleteJob] = useState(false);
    
    const filteredSeekers = getMyjobsCompany?.jobPostings
    ?.filter((jobPosting) => jobPosting.id === jobPostingsId)
    .flatMap((jobPosting) =>
      jobPosting.applications.map((application) => application)
    );
  

    if (status === "loading") {
        return <IconLoading/>;
    }
    else if (statusMyjobsCompany === "loading" || statusSeekerApplications === "loading") {
        return (
        <div className="max-w-[85rem]  min-h-screen flex flex-col gap-5 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="mt-20 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 12 }, (_, index) => (
              <a
                key={index} 
                className="flex flex-col bg-white/[.05] hover:bg-white/[.15] border border-white/[.05] rounded-xl transition-all py-20 animate-pulse"
              >
              </a>
            ))}
          </div>
        </div>
        );
    }
    

    else if (showCompanyApplication && checkUserType?.type === "COMPANY"){
      return (
       <div className="max-w-[85rem] min-h-screen flex flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <button className="w-fit inline-flex justify-start items-center gap-x-1.5 text-sm text-gray-400 hover:text-gray-200" 
              onClick={() => {
                setJobPostingsId('');
                setShowCompanyApplication(false);
              }}
          >
              <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              ย้อนกลับ
          </button>

          <div className="break-all justify-start items-center">
            <h1 className="indent-8 text-start text-4xl font-bold text-white">
              {getMyjobsCompany?.jobPostings
                ?.filter((jobPosting) => jobPosting.id === jobPostingsId)
                .map((jobPosting) => jobPosting.title)}
            </h1>
          </div>

            <div className="justify-center grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-10">
            {filteredSeekers && filteredSeekers.length > 0 && (filteredSeekers.map((filteredSeeker) => (
              <button
                key={filteredSeeker.seeker.id}
                className="w-full p-2 flex flex-col justify-center items-center bg-white/[.05] hover:bg-white/[.15] border border-white/[.05] rounded-xl transition-all"
                onClick={() => {
                  setJobPostingsId('');
                  updateViewedMutation({
                    seekerId: filteredSeeker.seeker.id,
                    jobPostingId: jobPostingsId,
                  });
                  router.push(`/seeker/${filteredSeeker.seeker.id}`);
                }}
              >
                <div className="p-4 md:p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-4">
                      {filteredSeeker.status === "pending" ?
                        <div className="bg-orange-500/50 py-1 px-2 max-w-[10rem] md:max-w-[9rem] lg:max-w-[10rem] rounded-full items-center justify-start text-white">
                          <p className="text-sm truncate">
                            ยังไม่เปิดโปรไฟล์
                          </p>
                        </div>
                        :
                        <div className="bg-gray-500/50 py-1 px-2 max-w-[10rem] md:max-w-[9rem] lg:max-w-[10rem] rounded-full items-center justify-start text-white">
                          <p className="text-sm truncate">
                            เคยเปิดโปรไฟล์แล้ว
                        </p>
                        </div>
                      }
                      <a
                        className="bg-no-repeat bg-cover bg-center w-60 h-60 rounded-md mx-auto"
                        style={{ backgroundImage: `url(${filteredSeeker.seeker.profile ?? ""})` }}> 
                      </a>
                      <h2 className="uppercase max-w-[18rem] md:max-w-[12rem] lg:max-w-[16rem] text-start text-xl truncate font-semibold text-gray-200">
                        {filteredSeeker.seeker.firstName}
                        <h3 className="max-w-[18rem] md:max-w-[12rem] lg:max-w-[16rem] text-start text-base truncate font-semibold text-gray-200">
                          {filteredSeeker.seeker.surName}
                        </h3>
                      </h2>
                      <div className="flex flex-col justify-center items-center">
                        <p className="indent-4 h-[10rem] w-[15rem] overflow-y-auto overflow-x-hidden text-justify bg-white/10 border border-white/20 text-white p-5 rounded-md text-sm break-all">
                          {filteredSeeker.coverLetter}
                        </p>
                      </div>
                      <p className="text-start max-w-[18rem] md:max-w-[12rem] lg:max-w-[16rem] truncate text-sm text-gray-400">
                        {`สมัครมาเมื่อ: ${new Date(filteredSeeker.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            )))}
            </div>
            { filteredSeekers?.length === 0 && <NoDataMessage />}

          </div>
      );
    }
    else{
      return (
       <div className="max-w-[85rem] flex flex-col gap-5 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <button className="w-fit inline-flex justify-start items-center gap-x-1.5 text-sm text-gray-400 hover:text-gray-200" 
          onClick={() =>setPage(0)}
          >
              <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              ย้อนกลับ
          </button>
          <div className="justify-start items-center text-center text-4xl font-bold text-orange-500">{checkUserType?.type === "SEEKER" ?<p>งานที่คุณสมัคร</p> : <p>งานที่คุณประกาศไว้</p>}</div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              
              {checkUserType?.type === "COMPANY" &&   
                getMyjobsCompany &&
                Array.isArray(getMyjobsCompany.jobPostings) &&
                getMyjobsCompany.jobPostings.length > 0 && (
                getMyjobsCompany.jobPostings.map((jobPosting) => (
                <div
                  key={jobPosting.id}
                  className="relative flex flex-col" 
                  onClick={() => {
                    setJobPostingsId(jobPosting.id);
                    setShowCompanyApplication(true);
                  }}
                >
                <button
                  disabled={deleteJob && true}
                  className={`absolute -top-9 right-0 px-2 py-1 rounded-lg text-white hover:bg-red-500/50 ${deleteJob ? "bg-red-500/50" : "bg-red-500"} bg-red-500`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteJob(true);
                    deleteJobPosting({
                      jobId: jobPosting.id,
                    });
                    router.refresh();                      
                  }}
                >
                  {`${deleteJob ? 'กำลังลบ...': 'ลบงาน'}`}
                </button>
                <button
                    className="bg-white/[.05] hover:bg-white/[.15] border border-white/[.05] rounded-xl transition-all"
                    disabled={deleteJob && true}
                    onChange={() => {
                      setJobPostingsId(jobPosting.id);
                      setShowCompanyApplication(true);
                    }}
                  >
                      <div className="p-4 md:p-5">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col gap-5">
                            <h3 className="max-w-[18rem] md:max-w-[12rem] lg:max-w-[16rem] text-start text-xl truncate font-semibold text-gray-200">
                              {jobPosting.title}
                            </h3>
                            <p className="text-start max-w-[18rem] md:max-w-[12rem] lg:max-w-[16rem] truncate text-sm text-gray-400">
                              {`ประกาศเมื่อ: ${new Date(jobPosting.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                            </p>
                            <div className="flex flex-col gap-2">
                                <p className="text-start text-white">จำนวนผู้สมัคร</p>
                                <div className="items-center justify-start text-white">
                                    <p className="bg-orange-500/50 py-1 px-4 w-fit max-w-[10rem] md:max-w-[9rem] lg:max-w-[10rem] rounded-full text-sm truncate">
                                    {jobPosting.applicationCount}
                                    </p>
                                </div>
                                </div>
                          </div>
                        </div>
                      </div>
                </button>            
                </div>            
              ))
              )}


              {checkUserType?.type === "SEEKER" &&                 
                Array.isArray(getSeekerApplications) &&
                getSeekerApplications.length > 0 && (
                getSeekerApplications.map((getSeekerApplication) => (
                <button
                  key={getSeekerApplication.applicationId}
                  className="flex flex-col bg-white/[.05] hover:bg-white/[.15] border border-white/[.05] rounded-xl transition-all" 
                  onClick={() => router.push(`/job/${getSeekerApplication.jobPosting.id}`)}
                >
                  <div className="p-4 md:p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-5">
                        <h3 className="max-w-[18rem] md:max-w-[12rem] lg:max-w-[16rem] text-start text-xl truncate font-semibold text-gray-200">
                          {getSeekerApplication.jobPosting.title}
                        </h3>
                        <p className="text-start max-w-[18rem] md:max-w-[12rem] lg:max-w-[16rem] truncate text-sm text-gray-400">
                          {getSeekerApplication.jobPosting.company.companyName}
                        </p>
                        <p className="text-start max-w-[18rem] md:max-w-[12rem] lg:max-w-[16rem] truncate text-sm text-gray-400">
                          {`สมัครเมื่อ: ${new Date(getSeekerApplication.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                        </p>
                        {getSeekerApplication.status === "pending" ?
                        <div className="bg-gray-500/50 py-1 px-2 max-w-[10rem] md:max-w-[9rem] lg:max-w-[10rem] rounded-full items-center justify-start text-white">
                          <p className="text-sm truncate">
                              ยื่นใบสมัคร
                          </p>
                        </div>
                        :
                        <div className="bg-orange-500/50 py-1 px-2 max-w-[10rem] md:max-w-[9rem] lg:max-w-[10rem] rounded-full items-center justify-start text-white">
                          <p className="text-sm truncate">
                            บริษัทดูใบสมัครแล้ว
                        </p>
                        </div>
                        }

                      </div>
                    </div>
                  </div>
                </button>            
                ))
              )}

            </div>
            {getSeekerApplications?.length === 0 && checkUserType?.type === "SEEKER" && <NoDataMessage />}
            {getMyjobsCompany?.jobPostings?.length === 0 && checkUserType?.type === "COMPANY" && <NoDataMessage />}
        </div>
      );
    }
}

function NoDataMessage() {
  return (
    <div className="animate-pulse transition-all p-10 m-10">
      <p className="text-lg sm:text-xl font-normal text-center text-gray-400">ไม่พบข้อมูล</p>
    </div>
  );
}