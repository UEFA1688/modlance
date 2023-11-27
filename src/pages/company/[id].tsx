"use client"
import { useRouter } from 'next/router'
import { api } from "~/utils/api";
import { IconLoading } from "~/components/IconLoading";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSquarePhone, faBriefcase, faMoneyBill } from '@fortawesome/free-solid-svg-icons';


export default function Company() {
  const router = useRouter()
  const { data: getCompanyById, status } = api.user.getCompanyById.useQuery({ companyId: String(router.query.id) });

  if (status === "loading") {
    return <IconLoading/>
  }

  return (
    <>

    <div className="flex flex-col justify-center items-center p-5 sm:p-10 gap-5">
    <button className="inline-flex justify-center items-center gap-x-1.5 text-sm text-gray-400 hover:text-gray-200" 
        onClick={() => router.push('/')}
        >
        <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        กลับหน้าหลัก
      </button>

      <div className="w-full sm:w-auto flex flex-col items-center gap-4 bg-white/[.05] border border-white/[.05] p-5 lg:p-10 rounded-lg shadow hover:bg-white/[.06] transition-all">
        <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 relative rounded-full overflow-hidden">
          <Image
            src={getCompanyById?.logo ?? ""}
            layout="fill"
            objectFit="cover"
            alt="Company Image"
            loading="lazy"
          />
        </div>
        <div className="w-full flex flex-col h-full p-4 sm:p-6">
          <h3 className="break-all mx-auto text-lg sm:text-3xl font-semibold text-white">
            {getCompanyById?.companyName}
          </h3>
          <p className="break-all mx-auto text-lg text-white/[.8]">
            {getCompanyById?.companyType}
          </p>
        </div>
        <div className="w-full flex flex-col h-full p-4 sm:p-6">
          <p className="break-all text-lg leading-6 indent-8 text-white/[.8]">
            {getCompanyById?.companyDetail}
          </p>
        </div>
        <div className="w-full flex flex-col h-full p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white">
            ที่อยู่
          </h3>
          <p className="break-all text-xl leading-6 indent-8 text-white/[.8]">
            {getCompanyById?.companyAddress}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            ติดต่อ
          </h3>
          <div className="flex flex-col md:flex-row gap-5 justify-center">
            <a href={`mailto:${getCompanyById?.email?.email}`} className="py-3 px-4 inline-flex gap-x-2 text-sm font-semibold bg-white/[.1] p-5 items-center rounded-md">
              <FontAwesomeIcon icon={faEnvelope} className="text-white h-10 w-10" />
              <div>
                <h3 className="max-w-[10rem] md:max-w-[16rem] lg:max-w-[30rem] truncate text-lg font-semibold text-white">
                {getCompanyById?.email?.email}
                </h3>
              </div>
            </a>
            <a href={`tel:${getCompanyById?.companyPhone}`} className="py-3 px-4 inline-flex gap-x-2 text-sm font-semibold bg-white/[.1] p-5 items-center rounded-md">
              <FontAwesomeIcon icon={faSquarePhone} className="text-white h-10 w-10" />
              <div>
              <h3 className="max-w-[10rem] md:max-w-[16rem] lg:max-w-[30rem] truncate text-lg font-semibold text-white">
                {getCompanyById?.companyPhone}
              </h3>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <div className="flex flex-col gap-5 items-center mb-10 p-2 md:p-10">
      <h2 className="text-lg sm:text-3xl font-semibold text-white">งานที่ประกาศรับสมัคร</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">

      {getCompanyById?.jobPostings.map((getJobPosting) => (
        <button
          key={getJobPosting.id} 
          className="flex flex-col bg-white/[.05] hover:bg-white/[.15] border border-white/[.05] rounded-xl transition-all" 
          onClick={() => router.push(`/job/${getJobPosting.id}`)}
        >
          <div className="p-4 md:p-5">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <h3 className="max-w-[8rem] md:max-w-[12rem] lg:max-w-[16rem] text-start truncate font-semibold text-gray-200">
                  {getJobPosting.title}
                </h3>
                <div className="flex flex-col gap-1 indent-2">
                  <p className="inline-flex gap-1 items-center max-w-[8rem] md:max-w-[12rem] lg:max-w-[16rem] truncate text-base text-gray-400">
                    <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4" />{getJobPosting.applicationJob} ตำแหน่ง
                  </p>
                  <p className="inline-flex gap-1 items-center max-w-[8rem] md:max-w-[12rem] lg:max-w-[16rem] truncate text-base text-gray-400">
                    <FontAwesomeIcon icon={faMoneyBill} className="w-4 h-4" />{getJobPosting.salary} บาท
                  </p>
                </div>
              </div>
            </div>
          </div>
        </button>
      ))}

      </div>
      {getCompanyById?.jobPostings.length === 0 && <p className="text-xs sm:text-sm font-normal text-gray-400">ไม่มีงานที่ประกาศรับสมัครของบริษัทนี้</p>}
    </div>
    </>

  );
}
