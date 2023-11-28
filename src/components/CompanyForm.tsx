"use client"
import React, { ChangeEvent, useState } from 'react';
import { api } from "~/utils/api";
import { useEdgeStore } from '~/lib/edgestore';
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faClipboardCheck, faEllipsis, faCircleCheck } from '@fortawesome/free-solid-svg-icons';


interface CompanyFormProps {
  company: boolean;
  setCompany: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CompanyForm({ company, setCompany }: CompanyFormProps){

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [companyDetail, setCompanyDetail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  
  const [companyNameError, setCompanyNameError] = useState('');
  const [companyTypeError, setCompanyTypeError] = useState('');
  const [companyDetailError, setCompanyDetailError] = useState('');
  const [companyAddressError, setCompanyAddressError] = useState('');
  const [companyPhoneError, setCompanyPhoneError] = useState('');

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');

    const phonePattern = /^(0[689]{1})+([0-9]{8})+$/;
    if (!phonePattern.test(numericValue)) {
      if (field === 'phone') {
        setCompanyPhoneError('กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง');
      }
    } else {
      setCompanyPhoneError('');
    }

    if (field === 'phone') {
      setCompanyPhone(numericValue);
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
  
  // Check if the value is empty and set the error message accordingly
  if (!value.trim()) {
    setErrorState(errorMessage);
  } else {
    setErrorState('');
  }
  };


  const [photo, setPhoto] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState('');

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        setPhoto("");
        setPhotoError('The selected file is too large. Please choose a file smaller than 10MB.');
        setLogoFile(null);
      } else {
        setPhoto(URL.createObjectURL(file));
        setPhotoError("");
        setLogoFile(file);
      }
    }
  };

  const { edgestore } = useEdgeStore();
  const registerCompanyMutation = api.user.registerCompany.useMutation();
  const router = useRouter()
  const [submitError, setSubmitError] = useState('');

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
      { value: photo, setError: setPhotoError, errorMessage: "กรุณาอัพโหลดรูปโปรไฟล์" },
      { value: companyName, setError: setCompanyNameError, errorMessage: 'กรุณากรอกชื่อบริษัท' },
      { value: companyType, setError: setCompanyTypeError, errorMessage: 'กรุณากรอกประเภทบริษัท' },
      { value: companyDetail, setError: setCompanyDetailError, errorMessage: 'กรุณากรอกรายละเอียดบริษัท' },
      { value: companyAddress, setError: setCompanyAddressError, errorMessage: 'กรุณากรอกที่อยู่บริษัท' },
      { value: companyPhone, setError: setCompanyPhoneError, errorMessage: 'กรุณากรอกหมายเลขโทรศัพท์บริษัท' },
    ];
  
    const validationResults = fields.map(field => validateField(field.value, field.setError, field.errorMessage));
  
    if (validationResults.every(result => result)) {
      if (logoFile) {
        const res = await edgestore.publicFiles.upload({
          file: logoFile
        });
        console.log(res);
    
        const logo = res.url;
    
        registerCompanyMutation.mutate({
          companyName,
          companyType,
          companyDetail,
          companyAddress,
          companyPhone,
          logo,
        });
        
        if(registerCompanyMutation.error){
          setSubmitError('เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง');
          setLoading(false);
        }
        else if(!registerCompanyMutation.error){
          setSubmitError('');
          setTimeout(() => {
            setIsSuccess(true);
            router.refresh();
          }, 4000);
        }
      }
    } else {
      setLoading(false);
    }
  };
  

  return (
    <>
      <button className="inline-flex items-center gap-x-1.5 text-sm text-gray-400 hover:text-gray-200" 
        onClick={() =>setCompany(!company)}
      >
        <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        ย้อนกลับ
      </button>
      <div className="relative bg-white/[.05] border border-white/[.05] w-full max-w-md shadow-md rounded-lg px-8 py-10 my-5">
        <h2 className="mb-2 text-center font-[500] text-gray-200 text-2xl md:text-3xl lg:text-4xl">แบบฟอร์มฟรีแลนซ์</h2>
        <div className="py-3 flex items-center text-xs text-gray-400 before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
          กรอกข้อมูลต่อไปนี้
        </div>
        <form className="space-y-10" onSubmit={handleSubmit}>
          <div className="space-y-4">
              <div className="flex flex-col items-center">
                <label className="block text-gray-200 text-sm font-[500] my-2" htmlFor="photo">
                  อัพโหลดรูปภาพของคุณ (ขนาดไม่เกิน 10MB)
                </label>
                <input
                  className="hidden"
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                <button
                  className="bg-white/[.05] hover:bg-white/[.15] text-indigo-100 font-bold w-32 h-32 sm:w-36 sm:h-36 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => document.getElementById('photo')?.click()}
                  style={{ backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {photo ?
                    null
                    :
                    <div className="p-2 sm:p-5 flex flex-col gap-2 text-white/[.65] items-center">
                      <FontAwesomeIcon icon={faCamera} className="w-8 h-8 md:w-16 md:h-16" />
                      <p className="text-xs font-[500] sm:text-sm">เลือกรูปภาพของคุณ </p>
                    </div>
                  }
                </button>
                {photoError && (
                  <p className="text-red-400/[0.90] text-sm m-2">{photoError}</p>
                )}
              </div>
          </div>
          <div>
              <label className="block text-sm font-medium text-white">
                ชื่อบริษัท
              </label>
              <input
                type="text"
                className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                placeholder="กรอกชื่อบริษัทของคุณ"
                value={companyName}
                onChange={(event) =>
                  handleInputChange(event, setCompanyName, setCompanyNameError, 'กรุณากรอกชื่อบริษัทของคุณ')
                }
              />
              {companyNameError && (
                <p className="text-red-400/[0.90] text-sm m-2">{companyNameError}</p>
              )}
          </div>
          <div>
              <label className="block text-sm font-medium text-white">
               ประเภทของธุรกิจคุณ
              </label>
              <input
                type="text"
                className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                placeholder="กรอกประเภทของธุรกิจคุณ"
                value={companyType}
                onChange={(event) =>
                  handleInputChange(event, setCompanyType, setCompanyTypeError, 'กรุณากรอกประเภทของธุรกิจคุณ')
                }
              />
              {companyTypeError && (
                <p className="text-red-400/[0.90] text-sm m-2">{companyTypeError}</p>
              )}
          </div>
          <div>
              <label className="block text-sm font-medium text-white">
                รายละเอียดบริษัท
              </label>
              <textarea  
                className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm" 
                placeholder="กรอกรายละเอียดบริษัทของคุณ"
                value={companyDetail}
                onChange={(event) =>
                  handleInputChange(event, setCompanyDetail, setCompanyDetailError, 'กรุณากรอกรายละเอียดบริษัทของคุณ')
                }
                >
              </textarea>
              {companyDetailError && (
                <p className="text-red-400/[0.90] text-sm m-2">{companyDetailError}</p>
              )}
          </div>
          <div>
              <label className="block text-sm font-medium text-white">
                ข้อมูลที่อยู่บริษัท
              </label>
              <textarea
                className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                placeholder="กรอกข้อมูลที่อยู่บริษัท"
                value={companyAddress}
                onChange={(event) =>
                  handleInputChange(event, setCompanyAddress, setCompanyAddressError, 'กรุณากรอกข้อมูลที่อยู่บริษัท')
                }
                >
              </textarea>
              {companyAddressError && (
                <p className="text-red-400/[0.90] text-sm m-2">{companyAddressError}</p>
              )}
          </div>
          <div>
              <label  className="block text-sm font-medium text-white">
                เบอร์โทรบริษัท
              </label>
              <input
                type="text"
                className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                placeholder="กรุณาเบอร์โทรบริษัท"
                value={companyPhone}
                onChange={(event) => handlePhoneChange(event, 'phone')}
              />
              {companyPhoneError && (
                <p className="text-red-400/[0.90] text-sm m-2">{companyPhoneError}</p>
              )}
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
                <p className="text-xl font-[500] sm:text-2xl">ยืนยันการสมัคร</p>
              </div>
            }
          </button>
          {submitError && <p className="text-sm text-center p-1 text-red-500 font-semibold">{submitError}</p>}
        </form>
        {loading && <LockLoading isSuccess={isSuccess} />}          
      </div>

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