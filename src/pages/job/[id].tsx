"use client"
import React, { useState, ReactNode , FormEvent  } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { api } from "~/utils/api";
import { signIn,  useSession } from "next-auth/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faClock, faBriefcase, faBuilding, faEllipsis, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { IconLoading } from "~/components/IconLoading";
import { Comment } from "~/components/Comment";

export default function Job() {
  const router = useRouter();

  const paramJobId = String(router.query.id);
  const { data: getJobById, status: getJobByIdStatus } = api.user.getJobById.useQuery({ jobId: paramJobId });
  const { data: checkUserType } = api.user.checkUserType.useQuery();
  const {data: appliedJob } = api.user.appliedJob.useQuery({ jobPostingId: paramJobId });
  const { data: sessionData } = useSession();

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false);

  const [coverLetter, setCoverLetter] = useState('');
  const [coverLetterError, setCoverLetterError] = useState('');

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<string>>,
    setErrorState: React.Dispatch<React.SetStateAction<string>>,
    errorMessage: string
  ) => {
    const value = event.target.value;
    setState(value);
  
    if (!value) {
      setErrorState(errorMessage);
    } else {
      setErrorState('');
    }
  };
  const createApplyJob = api.user.applyJob.useMutation();
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if(coverLetter){
      setIsLoading(true);
      createApplyJob.mutate({
        jobPostingId: paramJobId,
        coverLetter: coverLetter,
      });
        
      if(createApplyJob.error){
        setSubmitError('เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง');
        setIsLoading(false);
      }
      else if(!createApplyJob.error){
        setSubmitError('');
        setIsSuccess(true);
        setTimeout(() => {
          setOpen(false);
          setCoverLetter('');
          setIsLoading(false);
          
        }, 1500);

      };
    }
    else{
      setCoverLetterError('กรุณากรอกคำแนะนำตัว');
    }
  }

  if (getJobByIdStatus === "loading") {
    return <IconLoading/>
  }


  return (
    <>
      <Modal open={open} onClick={() => setOpen(!open)} loading={isLoading} isSuccess={isSuccess}>
        <form className="text-center w-56" onSubmit={handleSubmit}>
          <div className="mx-auto my-4 w-48 flex flex-col gap-5 justify-center items-center">
                <label className="text-sm font-medium text-white">แนะนำตัวคุณ</label>
                <textarea
                  className="transition-all w-full h-24 md:h-32 lg:h-40 px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                  placeholder="กรอกคำแนะนำตัว"
                  value={coverLetter}
                  onChange={(event) =>
                    handleInputChange(event, setCoverLetter, setCoverLetterError, 'กรุณากรอกคำแนะนำตัว')
                  }
                />
                {coverLetterError && (
                  <p className="text-red-400/[0.90] text-sm">{coverLetterError}</p>
                )}
          </div>
          <div className="flex gap-4 text-white">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full p-2 rounded-full bg-orange-700/[.5] hover:bg-orange-700/[.2] border border-white/[.05]"
            >
              ส่งใบสมัคร
            </button>
            <button
              className="w-full p-2 rounded-full bg-gray-700/[.5] hover:bg-gray-700/[.2] border border-white/[.05]"
              onClick={() => setOpen(false)}
            >
              ยกเลิก
            </button>
          </div>
          {submitError && <p className="text-sm text-center p-1 text-red-500 font-semibold">{submitError}</p>}
        </form>
      </Modal>

      
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-12">
        <div className="lg:col-span-2">
          <div className="py-8 lg:pe-8">
            <div className="space-y-5 lg:space-y-8">
              <Link href={`/`}>
                <button className="inline-flex items-center gap-x-1.5 text-sm text-gray-400 hover:text-gray-200" >
                  <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  กลับหน้าหลัก
                </button>
              </Link>
    
                <h2 className="break-all text-3xl font-bold lg:text-5xl text-white">{getJobById?.title}</h2>
    
                <div className="flex items-center gap-x-5 text-white">
                  <a className="max-w-[10rem] md:max-w-[20rem] lg:max-w-[30rem] truncate py-1 px-3 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm bg-orange-500/[.1] border border-orange-500/[.05]" href="#">
                    {getJobById?.companyName}
                  </a>
                  {getJobById?.createdAt && (
                    <p className="text-xs sm:text-sm">
                      {`ประกาศเมื่อเวลา: ${new Date(getJobById.createdAt).toLocaleTimeString('th-TH', { hour12: false })} | วันที่: ${new Date(getJobById.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                    </p>
                  )}
                </div>

                <div className="max-w-[15rem] items-center whitespace-nowrap inline-flex space-x-5 py-2 px-4 text-xs font-medium bg-orange-500/[.2] border border-orange-500 text-white rounded-md">
                  <h3 className="text-xl font-semibold">จำนวนที่เปิดรับ</h3>
                  <p className="truncate text-2xl font-bold animate-pulse">{getJobById?.applicationJob}</p>
                </div>
                <div className="p-5">
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="flex flex-row gap-5 bg-white/[.1] p-5 rounded-md">
                      <FontAwesomeIcon icon={faCoins} className="text-white h-10 w-10"  />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          เงินเดือน/ค่าตอบแทน
                        </h3>
                        <p className="break-all mt-1 ml-1 text-lg leading-6 text-gray-400">
                          {getJobById?.salary}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 bg-white/[.1] p-5 rounded-md">
                      <FontAwesomeIcon icon={faClock} className="text-white h-10 w-10" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          เวลาการทำงาน
                        </h3>
                        <p className="break-all inline-flex space-x-2 mt-1 ml-1 text-lg leading-6 text-gray-400">
                        {getJobById?.startTime} - {getJobById?.endTime}
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="flex flex-col gap-5 my-5">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        รายละเอียดงาน
                      </h3>
                      <p className="break-all indent-8 mt-1 ml-1 text-sm leading-6 text-gray-400">
                        {getJobById?.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        คุณสมบัติผู้สมัคร
                      </h3>
                      <p className="break-all mt-1 ml-1 text-sm leading-6 text-gray-400">
                        {getJobById?.requirements}
                      </p>
                    </div>


                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        สวัสดิการ
                      </h3>
                      <p className="break-all mt-1 ml-1 text-sm leading-6 text-gray-400">
                        {getJobById?.benefits}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  {!sessionData &&
                  <>
                    <button
                      onClick={() => signIn()}
                      className="transition-all w-56 sm:w-60 h-16 bg-gradient-to-tr from-orange-500/90 from-20% via-orange-700/90 via-50% to-transparent to-90% hover:bg-orange-700 rounded-full py-2 px-5"
                    >
                      <div className="p-2 inline-flex gap-x-4 text-white items-center">
                        <FontAwesomeIcon icon={faBriefcase} className="w-5 h-5" />
                          <p className="text-xl font-[500] sm:text-2xl">สมัครงานนี้</p>
                        </div>     
                    </button>
                  </>
                  }   
                  {sessionData && checkUserType?.type === "SEEKER" &&
                    <RegisterButton open={open} applied={appliedJob?.existingApplication ?? false} isSuccess={isSuccess}/>
                  }
                </div>
             

            </div>
          </div>
          <Comment jobId={paramJobId} />
        </div>
    
        <div className="p-5 lg:border-l lg:border-gray-200">
          <div className="sticky top-0 start-0 py-8">
            <div className="flex justify-center">
            <Link href={`/company/${getJobById?.companyId}`}>
              <button
                className="bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] py-2 px-10 mb-5 inline-flex items-center space-x-2 p-2 transition-all font-semibold text-xl text-white rounded-md"
              >
              <FontAwesomeIcon icon={faBuilding} className="w-10 h-10" />
              <p>
                ข้อมูลบริษัท
              </p>
              </button>
            </Link>
            </div>
            <div className="group flex items-center gap-x-3 border-b border-gray-200 pb-8 mb-8">
              <a
                className="p-10 bg-no-repeat bg-cover bg-center w-20 h-20 rounded-full"
                style={{ backgroundImage: `url(${getJobById?.companyLogo})` }}> 
              </a>
      
                <a className="flex flex-col gap-2" href="">
                  <h5 className="break-all text-white text-base md:text-xl font-semibold ">
                    {getJobById?.companyName}
                  </h5>
                  <p className="break-all text-gray-400 text-sm md:text-lg">
                    {getJobById?.companyType}
                  </p>
                </a>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="break-all indent-8 mt-1 ml-1 text-sm leading-6 text-gray-400">
                  {getJobById?.companyDetail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
interface ModalProps {
  open: boolean;
  onClick: () => void;
  children: ReactNode;
  loading: boolean;
  isSuccess: boolean;
}
function Modal({ open, onClick, children, loading, isSuccess }: ModalProps){
  return (
    <div
      className={`
        fixed inset-0 flex justify-center items-center transition-colors z-50
        ${open ? "visible bg-gray-900/50 backdrop-blur-md" : "invisible"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
        bg-gray-700/[.5] border border-white/[.05] rounded-xl shadow p-6 transition-all
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
      >
        <button
          onClick={onClick}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:text-gray-600"
        >
          X
        </button>
        {children}
      </div>
      {loading && <LockLoading isSuccess={isSuccess} />}          
    </div>
  )
}

interface RegisterButtonProps {
  open: boolean;
  applied: boolean;
  isSuccess: boolean;
}

function RegisterButton({ open, applied, isSuccess }: RegisterButtonProps){


  return (
    <>
      {applied || isSuccess ?
      <>
        <button
            disabled={true}
            className={`transition-all w-56 sm:w-60 h-16 bg-orange-500/[.05] border border-orange-500 rounded-full py-2 px-5`}
            >
            <div className="p-2 inline-flex gap-x-4 text-gray-600 items-center">
              <p className="text-xl font-[500] sm:text-xl">คุณสมัครงานนี้แล้ว</p>
            </div>
        </button>
      </>
      :
      <>
      <button
        disabled={open}
        className={`transition-all w-56 sm:w-60 h-16 ${
          open
          ? "bg-orange-500/[.05] border border-orange-500"
          : "bg-gradient-to-tr from-orange-500/90 from-20% via-orange-700/90 via-50% to-transparent to-90% hover:bg-orange-700"
      } rounded-full py-2 px-5`}
        >
        {open
          ? <div className="p-2 inline-flex space-x-1 text-white/[.65] items-center animate-pulse">
            <FontAwesomeIcon icon={faEllipsis} className="w-8 h-8" bounce />
          </div>

          : <div className="p-2 inline-flex gap-x-4 text-white items-center">
              <FontAwesomeIcon icon={faBriefcase} className="w-5 h-5" />
              <p className="text-xl font-[500] sm:text-2xl">สมัครงานนี้</p>
            </div>
          }
      </button>   
      </>
      }
  
    </>
  );
}


interface LockLoadingProps {
  isSuccess: boolean;
}

function LockLoading({isSuccess}: LockLoadingProps){
  return (
    <>
      <div className="absolute top-0 start-0 w-full h-full rounded-lg  backdrop-brightness-50"></div>
      <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {isSuccess ? 
          <>
            <FontAwesomeIcon icon={faCircleCheck} className="w-20 h-20" beatFade style={{color: "#00d150",}} />
          </>
        :
          <div className="animate-spin inline-block w-10 h-10 border-[3px] border-current border-t-transparent rounded-full text-orange-500" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
        }
      </div>
    </>
  );
}