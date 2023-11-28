
"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link'
import { api } from "~/utils/api";
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faBriefcase, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { CreateButton } from "~/components/CreateButton";

interface PageProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export function NavBar({ setPage }: PageProps) {
    const router = useRouter()
    const { data: sessionData } = useSession();
    const { data: checkUserType } = api.user.checkUserType.useQuery();


    return (
    <>
    <nav className="sticky inset-x-0 w-fit bottom-5 z-40 mx-auto text-center">
    {sessionData && checkUserType?.type === "COMPANY"  &&
      <div className="absolute right-5 w-fit -top-16 z-50 transition-all rounded-full">
        <CreateButton  setPage={setPage}/>
      </div>}
        <div className="px-4 py-4 mx-auto backdrop-blur-lg bg-orange-600/[.25] hover:bg-orange-600/[.3] border-2 border-white/[.05] rounded-full transition-all">
        {sessionData ?
          <>
            <div className="truncate flex items-center justify-center space-x-5 px-5 sm:px-10 lg:px-20">
              <button
                className="inline-flex items-center space-x-2 p-5 transition-all bg-red-500 hover:bg-white/20 font-semibold text-xl text-white rounded-full"
                onClick={() => void signOut()}>
                <FontAwesomeIcon icon={faRightToBracket} className="w-10 h-10" />
                <p className="hidden sm:block">
                  ออกจากระบบ
                </p>
              </button>

              {checkUserType?.type === "SEEKER" ?
                <>
                  <button
                    className="inline-flex items-center space-x-2 p-5 transition-all bg-orange-500 hover:bg-white/20 font-semibold text-xl text-white rounded-full"
                    onClick={() => setPage(1)}>
                      <FontAwesomeIcon icon={faBriefcase} className="w-10 h-10" />
                      <p className="hidden sm:block">
                        งานที่คุณสมัคร
                      </p>
                  </button>
                </>
              :
                <>
                  <button
                    className="inline-flex items-center space-x-2 p-5 transition-all bg-orange-500 hover:bg-white/20 font-semibold text-xl text-white rounded-full"
                    onClick={() => setPage(1)}>
                      <FontAwesomeIcon icon={faBriefcase} className="w-10 h-10" />
                      <p className="hidden sm:block">
                        งานที่ประกาศ
                      </p>
                  </button>
                </>
              }
            <Link href={checkUserType?.type === "SEEKER" ? `/seeker/${checkUserType?.userId?.id}` : `/company/${checkUserType?.userId?.id}`}>
              <button className="inline-flex items-center space-x-5 p-1 transition-all font-semibold text-xl text-white bg-orange-500 hover:bg-white/20 rounded-full">
                <a
                  className="bg-no-repeat bg-cover bg-center w-20 h-20 rounded-full"
                  style={{ backgroundImage: `url(${sessionData.user?.image ?? ""})` }}> 
                </a>


                <p className="hidden sm:block pr-5 sm:w-24 md:w-32 lg:w-40 truncate">
                  {checkUserType?.userId?.name}
                </p>
              </button>
            </Link>
            </div>

          </>
        :
            <div className="flex flex-row justify-between space-x-10">
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text 
                        bg-gradient-to-r from-orange-400 via-orange-200 to-orange-400 pl-5">
                    Modlance
                    </h1>
                </div>
                <div className="relative">
                  <a className="absolute justify-center items-center flex animate-ping rounded-full bg-orange-400 py-3 px-4 h-[3.6rem] w-[3.6rem] transition-all">
                  </a>
                  <button
                    className="relative justify-center items-center flex rounded-full bg-orange-500 p-5 h-[3.6rem] w-[3.6rem] font-semibold text-white no-underline transition-all hover:bg-white/20"
                    onClick={() => void signIn()}
                  >
                    <FontAwesomeIcon icon={faAnglesRight} className="h-full w-full" beat />
                  </button>
                </div>
            </div>
        }

        </div>
    </nav>
    </>
    )
}


