

"use client"

import { useState } from 'react';
import { useSession, signIn } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from 'next/navigation'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUsersViewfinder } from '@fortawesome/free-solid-svg-icons';

import { IconLoading } from "~/components/IconLoading";
import { CompanyForm } from "~/components/CompanyForm";
import { SeekerForm } from "~/components/SeekerForm";



export default function Register() {
  const router = useRouter()

  const [seeker, setSeeker] = useState(false);
  const [company, setCompany] = useState(false);
  const { data: sessionData, status } = useSession()

  const { data: checkUserType } = api.user.checkUserType.useQuery();

  if (status === "loading") {
    return <IconLoading/>
  }

  else if (!sessionData) {
    return signIn();
  }

  else if (!checkUserType?.needsRegistration) {
    if (!checkUserType) {
      return <IconLoading/>
    }
    router.replace('/')
  }

  else if (checkUserType?.needsRegistration){
    return (
      <div className="min-h-screen flex flex-col items-center justify-center max-w-[85rem] mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        {seeker||company ?
          <>
            {company && <CompanyForm company={company} setCompany={setCompany}/>}
            {seeker && <SeekerForm seeker={seeker} setSeeker={setSeeker}/>}
          </>
        :
          <>
            <h1 className="transition-all text-center bg-clip-text text-transparent text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-tr from-orange-500/90 from-20% via-orange-700/90 via-40% to-yellow-400 to-90%">
              Who are you?
            </h1>
            <div className="grid lg:grid-cols-2 gap-6 mt-12 sm:mt-16">
                <button className="transition-all rounded-xl hover:scale-105" onClick={() =>setSeeker(!seeker)}>
                    <div className="flex flex-col gap-10 p-12 sm:p-24 transition-all text-white bg-white/[.05] rounded-lg hover:bg-transparent hover:bg-gradient-to-tr from-orange-500/90 from-20% via-orange-700/90 via-50% to-transparent to-90%">
                      <h2 className="text-center text-4xl sm:text-5xl font-bold">
                        Seeker
                      </h2>
                      <FontAwesomeIcon icon={faBriefcase} className="w-10 h-10 sm:w-20 sm:h-20 mx-auto"/>
                    </div>
                </button>
                <button className="transition-all rounded-xl hover:scale-105" onClick={() =>setCompany(!company)}>
                    <div className="flex flex-col gap-10 p-12 sm:p-24 transition-all text-white bg-white/[.05] rounded-lg hover:bg-transparent hover:bg-gradient-to-tl from-orange-500/90 from-10% via-orange-700/90 via-50% to-transparent to-90%">
                      <h2 className="text-center text-4xl sm:text-5xl font-bold">
                          Company
                      </h2>
                      <FontAwesomeIcon icon={faUsersViewfinder} className="w-10 h-10 sm:w-20 sm:h-20  mx-auto"/>
                    </div>
                </button>
            </div>
          </>
        }
      </div>
    );
  }
}


