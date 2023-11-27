"use client"
import React, { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faEllipsis, faCircleCheck } from '@fortawesome/free-solid-svg-icons';


interface CreateJobFormmProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export function CreateJobForm({ setPage }: CreateJobFormmProps){

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [jobBenefits, setJobBenefits] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobStartTime, setJobStartTime] = useState('');
  const [jobEndTime, setJobEndTime] = useState('');
  const [applicationJob, setApplicationJob] = useState('');



  const [jobTitleError, setJobTitleError] = useState('');
  const [jobDescriptionError, setJobDescriptionError] = useState('');
  const [jobRequirementsError, setJobRequirementsError] = useState('');
  const [jobBenefitsError, setJobBenefitsError] = useState('');
  const [jobSalaryError, setJobSalaryError] = useState('');
  const [jobStartTimeError, setJobStartTimeError] = useState('');
  const [jobEndTimeError, setJobEndTimeError] = useState('');
  const [applicationJobError, setApplicationJobError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const validateNumericInput = (
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<string>>,
    setErrorState: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const value = event.target.value;
    if (/^\d+$/.test(value)) {
      setErrorState('');
      setState(value);
    } else {
      setErrorState('กรุณากรอกตัวเลข');
      setState('');
    }
  };
  
  
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

  const createJobMutation = api.user.createJobPosting.useMutation();
  const router = useRouter()


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const validateField = (
      value: string, 
      setErrorState: React.Dispatch<React.SetStateAction<string>>, 
      errorMessage: string
      ) => {
      if (value === '') {
        setErrorState(errorMessage);
        return false;
      }
      setErrorState('');
      return true;
    };
  
    const fields = [
      { value: String(jobTitle), setError: setJobTitleError, errorMessage: "กรุณากรอกชื่องาน" },
      { value: String(jobDescription), setError: setJobDescriptionError, errorMessage: "กรุณากรอกรายละเอียดงาน" },
      { value: String(jobRequirements), setError: setJobRequirementsError, errorMessage: "คุณสมบัติผู้สมัคร" },
      { value: String(jobBenefits), setError: setJobBenefitsError, errorMessage: "กรุณากรอกสวัสดิการ" },
      { value: String(jobSalary), setError: setJobSalaryError, errorMessage: "กรุณากรอกเงินเดือน" },
      { value: String(jobStartTime), setError: setJobStartTimeError, errorMessage: "กรุณากรอกเวลาเริ่มงาน" },
      { value: String(jobEndTime), setError: setJobEndTimeError, errorMessage: "กรุณากรอกเวลาสิ้นสุดงาน" },
      { value: String(applicationJob), setError: setApplicationJobError, errorMessage: "กรุณากรอกจำนวนที่เปิดรับสมัคร" },
   ];
    
    
    const validationResults = fields.map(field => validateField(field.value, field.setError, field.errorMessage));

    if (validationResults.every(result => result) &&  !applicationJobError) {
      createJobMutation.mutate({
        title: jobTitle,
        description: jobDescription,
        requirements: jobRequirements,
        benefits: jobBenefits,
        salary: jobSalary,
        startTime: jobStartTime,
        endTime: jobEndTime,
        applicationJob: applicationJob,
      });
        
      if(createJobMutation.error){
        setSubmitError('เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง');
        setLoading(false);
      }
      else if(!createJobMutation.error){
        setSubmitError('');
        setIsSuccess(true);
        setTimeout(() => {
          router.refresh();
        }, 1500); 
      }
    } else {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-5">
      <button className="inline-flex items-center gap-x-1.5 text-sm text-gray-400 hover:text-gray-200" 
        onClick={() =>setPage(0)}
      >
        <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        ย้อนกลับ
      </button>
      <div className="relative bg-white/[.05] border border-white/[.05] w-full max-w-md shadow-md rounded-lg px-8 py-10 my-5">
          <h2 className="mb-2 text-center font-[500] text-gray-200 text-xl md:text-2xl lg:text-3xl mt-5">
            สร้างงาน
          </h2>
          <div className="py-3 flex items-center text-xs text-gray-400 before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
            กรอกข้อมูลต่อไปนี้
          </div>
        <form className="space-y-5 md:space-y-6 lg:space-y-7" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white">ชื่องาน</label>
                <input
                  type="text"
                  className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                  placeholder="กรอกชื่องาน"
                  value={jobTitle}
                  onChange={(event) =>
                    handleInputChange(event, setJobTitle, setJobTitleError, 'กรุณากรอกชื่องาน')
                  }
                />
                {jobTitleError && (
                  <p className="text-red-400/[0.90] text-sm m-2">{jobTitleError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white">รายละเอียดงาน</label>
                <textarea
                  className="transition-all w-full h-24 md:h-32 lg:h-40 px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                  placeholder="กรอกรายละเอียดงาน"
                  value={jobDescription}
                  onChange={(event) =>
                    handleInputChange(event, setJobDescription, setJobDescriptionError, 'กรุณากรอกรายละเอียดงาน')
                  }
                />
                {jobDescriptionError && (
                  <p className="text-red-400/[0.90] text-sm m-2">{jobDescriptionError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white">คุณสมบัติผู้สมัคร</label>
                <textarea
                  className="transition-all w-full h-24 md:h-32 lg:h-40 px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                  placeholder="กรอกคุณสมบัติผู้สมัคร"
                  value={jobRequirements}
                  onChange={(event) =>
                    handleInputChange(event, setJobRequirements, setJobRequirementsError, 'กรุณากรอกคุณสมบัติผู้สมัคร')
                  }
                />
                {jobRequirementsError && (
                  <p className="text-red-400/[0.90] text-sm m-2">{jobRequirementsError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white">สวัสดิการ</label>
                <textarea
                  className="transition-all w-full h-24 md:h-32 lg:h-40 px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                  placeholder="กรอกสวัสดิการ"
                  value={jobBenefits}
                  onChange={(event) =>
                    handleInputChange(event, setJobBenefits, setJobBenefitsError, 'กรุณากรอกสวัสดิการ')
                  }
                />
                {jobBenefitsError && (
                  <p className="text-red-400/[0.90] text-sm m-2">{jobBenefitsError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white">เงินเดือน/ค่าตอบแทน</label>
                <input
                  type="text"
                  className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                  placeholder="กรอกเงินเดือน/ค่าตอบแทน"
                  value={jobSalary}
                  onChange={(event) =>
                    validateNumericInput(event, setJobSalary, setJobSalaryError)
                  }
                />
                {jobSalaryError && (
                  <p className="text-red-400/[0.90] text-sm m-2">{jobSalaryError}</p>
                )}
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-white">เวลาเริ่มงาน</label>
                  <input
                    type="time"
                    className="appearance-none transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                    placeholder="กรอกเวลาเริ่มงาน"
                    value={jobStartTime ?? ''}
                    onChange={(event) =>
                      handleInputChange(event, setJobStartTime, setJobStartTimeError, 'กรุณากรอกเวลาเริ่มงาน')
                    }
                  />
                  {jobStartTimeError && (
                    <p className="text-red-400/[0.90] text-sm m-2">{jobStartTimeError}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-white">เวลาสิ้นสุดงาน</label>
                  <input
                    type="time"
                    className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                    placeholder="กรอกเวลาสิ้นสุดงาน"
                    value={jobEndTime ?? ''}
                    onChange={(event) =>
                      handleInputChange(event, setJobEndTime, setJobEndTimeError, 'กรุณากรอกเวลาสิ้นสุดงาน')
                    }
                  />
                  {jobEndTimeError && (
                    <p className="text-red-400/[0.90] text-sm m-2">{jobEndTimeError}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">จำนวนที่เปิดรับสมัคร</label>
                <input
                  type="text"
                  className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                  placeholder="กรอกจำนวนที่เปิดรับสมัคร"
                  value={applicationJob}
                  onChange={(event) =>
                    validateNumericInput(event, setApplicationJob, setApplicationJobError)
                  }
                />
                {applicationJobError && (
                  <p className="text-red-400/[0.90] text-sm m-2">{applicationJobError}</p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`transition-all w-full ${
                loading
                  ? "bg-orange-500/[.05] border border-orange-500"
                  : "bg-gradient-to-tr from-orange-500/90 from-20% via-orange-700/90 via-50% to-transparent to-90% hover:bg-orange-700"
              } rounded-full py-2 px-5`}
            >
              {loading
                ? <div className="p-2 inline-flex space-x-1 text-white/[.65] items-center animate-pulse">
                  <FontAwesomeIcon icon={faEllipsis} className="w-8 h-8" bounce />
                </div>

                : <div className="p-2 inline-flex gap-x-4 text-white/[.65] items-center">
                  <FontAwesomeIcon icon={faClipboardCheck} className="w-5 h-5" />
                  <p className="text-xl font-[500] sm:text-2xl">สร้างงาน</p>
                </div>
              }
            </button>
            {submitError && <p className="text-sm text-center p-1 text-red-500 font-semibold">{submitError}</p>}
          </form>
            {loading && <LockLoading isSuccess={isSuccess} />}          
      </div>

    </div>
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