"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { IconLoading } from "~/components/IconLoading";

const HeroSec = dynamic(() => import("~/components/HeroSec").then((module) => module.HeroSec));
const CreateJobForm = dynamic(() => import("~/components/CreateJobForm").then((module) => module.CreateJobForm));
const MyJobs = dynamic(() => import("~/components/MyJobs").then((module) => module.MyJobs));
const NavBar = dynamic(() => import("~/components/NavBar").then((module) => module.NavBar));

export default function Home() {
  const router = useRouter();

  const { data: sessionData, status: sessionStatus } = useSession();
  const { data: checkUserType, status: checkUserTypeStatus } = api.user.checkUserType.useQuery();

  if (sessionStatus === "loading") {
    return <IconLoading />;
  } 
  else if (sessionData) {
    if (checkUserTypeStatus === "loading") {
      return <IconLoading />;
    } 
    else if (checkUserType?.needsRegistration) {
      return router.replace("/register");
    } 
    else {
      return <Page />;
    }
  } 

  else {
    return <Page />;
  }

} 

function Page(){
  const [page, setPage] = useState(0);
  return (
    <>

      {page === 0 ? (
      <>

        <HeroSec />
        <NavBar setPage={setPage} />
      </>
      ) : page === 1 ? (
        <>
        <MyJobs setPage={setPage} />
        </>
      ) : page === 2 ? (
        <CreateJobForm setPage={setPage} />
      ) : null}
    </>
    );
}

