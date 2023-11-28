"use client"
import type {
  GetServerSidePropsContext,
} from "next";
import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { useRouter } from 'next/router';
import { api } from "~/utils/api";
import { IconLoading } from "~/components/IconLoading";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSquarePhone } from '@fortawesome/free-solid-svg-icons';
import { useRouter as navigation } from 'next/navigation'
import { useSession } from "next-auth/react";

type Seeker = {
  dob: string;
};

export default function Seeker() {
  const router = useRouter();
  const navigationRouter = navigation();
  const { data: getSeekerById, status: getSeekerByIdStatus} = api.user.getSeekerById.useQuery({ seekerId: String(router.query.id) });
  const { data: seekerProtect, status: seekerProtectStatus } = api.user.seekerProtect.useQuery({ seekerId: String(router.query.id) });
  const { data: sessionData } = useSession();

  if (getSeekerByIdStatus === "loading" || seekerProtectStatus === "loading") {
    return <IconLoading/>
  }
  else if (sessionData?.user.id === getSeekerById?.userId || seekerProtect?.hasApplied  ) {
    return (
      <div className="flex flex-col justify-center items-center p-5 sm:p-10 gap-5">
      <Link href={`/`}>
        <button className="inline-flex justify-center items-center gap-x-1.5 text-sm text-gray-400 hover:text-gray-200">
          <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          กลับหน้าหลัก
        </button>
      </Link>
        <div className="w-full sm:w-auto flex flex-col items-center gap-4 bg-white/[.05] border border-white/[.05] p-5 lg:p-10 rounded-lg shadow hover:bg-white/[.06] transition-all">
          <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 relative rounded-full overflow-hidden">
            <Image
              src={getSeekerById?.profile ?? ""}
              layout="fill"
              objectFit="cover"
              alt="Company Image"
            />
          </div>
          <div className="w-full flex flex-col h-full p-4 sm:p-6">
            <h3 className="break-all mx-auto text-xl sm:text-2xl font-semibold text-white">
              {getSeekerById?.firstName} {getSeekerById?.surName}
            </h3>
            <p className="break-all mx-auto text-xl text-white/[.8]">
              เพศ: {getSeekerById?.sex}
            </p>
          </div>
          <div className="w-full flex flex-col h-full p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">
              วันเกิด
            </h3>
            <p className="break-all text-2xl leading-6 indent-8 text-white/[.8]">
              {getSeekerById?.dob}
            </p>
          </div>
          <div className="w-full flex flex-col h-full p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">
              อายุ
            </h3>
            <p className="break-all text-xl leading-6 indent-8 text-white/[.8]">
              {getSeekerById?.dob && (<>{calculateAge(getSeekerById)}</>)} ปี
            </p>
          </div>
          <div className="w-full flex flex-col h-full p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">
              ระดับการศึกษา
            </h3>
            <p className="break-all text-xl leading-6 indent-8 text-white/[.8]">
              {getSeekerById?.educationLevel}
            </p>
          </div>
          <div className="w-full flex flex-col h-full p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">
              โรงเรียน/มหาวิทยาลัย
            </h3>
            <p className="break-all text-xl leading-6 indent-8 text-white/[.8]">
              {getSeekerById?.schoolName}
            </p>
          </div>
          <div className="w-full flex flex-col h-full p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">
              แผนการเรียน/คณะ
            </h3>
            <p className="break-all text-xl leading-6 indent-8 text-white/[.8]">
              {getSeekerById?.major}
            </p>
          </div>
          <div className="w-full flex flex-col h-full p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">
              เกรดเฉลี่ย GPA
            </h3>
            <p className="break-all text-xl leading-6 indent-8 text-white/[.8]">
              {getSeekerById?.gpa}
            </p>
          </div>
  
          <div>
            <h3 className="text-2xl font-semibold text-white">
              ติดต่อ
            </h3>
            <div className="flex flex-col md:flex-row gap-5 justify-center">
              <a href={`mailto:${getSeekerById?.email?.email}`} className="py-3 px-4 inline-flex gap-x-2 text-sm font-semibold bg-white/[.1] p-5 items-center rounded-md">
                <FontAwesomeIcon icon={faEnvelope} className="text-white h-10 w-10" />
                <div>
                  <h3 className="max-w-[10rem] md:max-w-[20rem] lg:max-w-[30rem] truncate text-xl font-semibold text-white">
                    {getSeekerById?.email?.email}
                  </h3>
                </div>
              </a>
              <a href={`tel:${getSeekerById?.phone}`} className="py-3 px-4 inline-flex gap-x-2 text-sm font-semibold bg-white/[.1] p-5 items-center rounded-md">
                <FontAwesomeIcon icon={faSquarePhone} className="text-white h-10 w-10" />
                <div>
                <h3 className="max-w-[10rem] md:max-w-[20rem] lg:max-w-[30rem] truncate text-xl font-semibold text-white">
                  {getSeekerById?.phone}
                </h3>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  else{
    navigationRouter.push('/')
  }
}


function calculateAge({ dob }: Seeker) {
  const dobDate = new Date(dob).getTime(); // Convert to timestamp
  const currentDate = new Date().getTime(); // Convert to timestamp
  const ageInMilliseconds = currentDate - dobDate;
  const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000));
  return ageInYears;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return { redirect: { destination: "/" } }
  }

  return {
    props: {},
  }
}