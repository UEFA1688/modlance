
"use client"
import { useState } from 'react';
import Link from 'next/link'
import { api } from "~/utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faMoneyBill } from '@fortawesome/free-solid-svg-icons';

export function HeroSec(){
  const {data: getJobPostings, status} = api.user.getJobPostings.useQuery();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredJobPostings = getJobPostings?.filter((jobPosting) =>
    jobPosting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

    return (
      <div className="max-w-[85rem]  min-h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="text-center">
              <div className="relative text-6xl sm:text-8xl font-bold">
                <h1 className="absolute inset-0 text-orange-200">
                  Modlance
                </h1>
                <h1 className="blur-md text-orange-400">
                  Modlance
                </h1>
              </div>
      
              <p className="mt-3 text-orange-400">
                Freelance Freedom with Modlance.
              </p>
        
              <div className="my-7 sm:my-12 mx-auto max-w-xl relative">
                  <div className="relative z-10 flex space-x-3 p-3 backdrop-blur-lg bg-white/[.05] hover:bg-white/[.06] border border-white/[.05]  rounded-lg shadow-lg">
                      <div className="flex-1">
                      <input
                        type="text"
                        className="backdrop-blur-sm text-white bg-white/[.05] hover:bg-white/[.1] border border-white/[.05] py-2.5 px-4 block w-full rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600"
                        placeholder="หางานที่ใช่สำหรับคุณ"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        maxLength={50}
                        />
                      </div>

                  </div>

                <div className="hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20">
                  <svg className="w-16 h-auto text-orange-500" width="121" height="135" viewBox="0 0 121 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
                    <path d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
                    <path d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
                  </svg>
                </div>
                <div className="hidden md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32">
                  <svg className="w-40 h-auto text-cyan-500" width="347" height="188" viewBox="0 0 347 188" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
        
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {status === "loading" && (
          <>
            {Array.from({ length: 12 }, (_, index) => (
              <a
              key={index} 
              className="flex flex-col bg-white/[.05] hover:bg-white/[.15] border border-white/[.05] rounded-xl transition-all py-20 animate-pulse"
              >
              </a>
            ))}
          </>
          )}

            {filteredJobPostings && filteredJobPostings.length > 0 && (filteredJobPostings.map((getJobPosting) => (
            <Link href={`/job/${getJobPosting.id}`} className="flex flex-col bg-white/[.05] hover:bg-white/[.15] border border-white/[.05] rounded-xl transition-all" >
              <button key={getJobPosting.id}>
                <div className="p-4 md:p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                      <h3 className="md:max-w-[12rem] lg:max-w-[16rem] text-start break-all md:truncate font-semibold text-gray-200">
                        {getJobPosting.title}
                      </h3>
                      <div className="flex flex-col gap-1 indent-2">
                        <p className="inline-flex gap-1 items-center max-w-[8rem] md:max-w-[12rem] lg:max-w-[16rem] truncate text-base text-gray-400">
                          <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4" />{getJobPosting.applicationJob} ตำแหน่ง
                        </p>
                        <p className="inline-flex gap-1 items-center max-w-[8rem] md:max-w-[12rem] lg:max-w-[16rem] truncate text-base text-gray-400">
                          <FontAwesomeIcon icon={faMoneyBill} className="w-4 h-4" />{getJobPosting.salary} บาท
                        </p>
                        <div className="inline-flex gap-1 mt-5 items-center justify-start text-gray-400">
                          <a
                            className="bg-no-repeat bg-cover bg-center w-10 h-10  rounded-full"
                            style={{ backgroundImage: `url(${getJobPosting?.companyLogo ?? ""})` }}> 
                          </a>
                          <p className="max-w-[16rem] md:max-w-[9rem] lg:max-w-[12rem] text-base truncate">
                            {getJobPosting.companyName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </Link>
            )))}
          </div>
          {filteredJobPostings && filteredJobPostings.length === 0 && 
            <div className="animate-pulse transition-all p-10 m-10">
              <p className="text-lg sm:text-xl font-normal text-center text-gray-400">ไม่มีงานที่ประกาศรับสมัคร<br/>{searchQuery && <span className="ml-2">{searchQuery}</span>}</p>
            </div>
          }
      </div>
    )

}

