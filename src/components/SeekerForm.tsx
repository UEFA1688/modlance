"use client"
import React, { ChangeEvent, useState } from 'react';
import { api } from "~/utils/api";
import { useEdgeStore } from '~/lib/edgestore';
import { redirect } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faClipboardCheck, faEllipsis, faCircleCheck } from '@fortawesome/free-solid-svg-icons';


interface SeekerFormProps {
  seeker: boolean;
  setSeeker: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SeekerForm({ seeker, setSeeker }: SeekerFormProps){

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [surName, setSurName] = useState('');
  const [sex, setSex] = useState('');

  const [dob, setDob] = useState('');
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  const dateString = date.toISOString().substr(0,10);
  
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');

    const phonePattern = /^(0[689]{1})+([0-9]{8})+$/;
    if (!phonePattern.test(numericValue)) {
      if (field === 'phone') {
        setPhoneError('กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง');
      }
    } else {
      setPhoneError('');
    }

    if (field === 'phone') {
      setPhone(numericValue);
    }
  };
  const [firstNameError, setFirstNameError] = useState('');
  const [surNameError, setSurNameError] = useState('');
  const [sexError, setSexError] = useState('');
  const [dobError, setDobError] = useState('');
  const [educationLevelError, setEducationLevelError] = useState('');
  const [schoolNameError, setSchoolNameError] = useState('');
  const [majorError, setMajorError] = useState('');
  const [gpaError, setGpaError] = useState('');
  
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
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
  const [educationLevel, setEducationLevel] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [major, setMajor] = useState('');
  const [gpa, setGPA] = useState('');

  const [photo, setPhoto] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState('');

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        setPhoto("");
        setPhotoError('The selected file is too large. Please choose a file smaller than 10MB.');
        setPhotoFile(null);
      } else {
        setPhoto(URL.createObjectURL(file));
        setPhotoError("");
        setPhotoFile(file);
      }
    }
  };

  const { edgestore } = useEdgeStore();
  const registerSeekerMutation = api.user.registerSeeker.useMutation();
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
      { value: firstName, setError: setFirstNameError, errorMessage: "กรุณากรอกชื่อ" },
      { value: surName, setError: setSurNameError, errorMessage: "กรุณากรอกนามสกุล" },
      { value: sex, setError: setSexError, errorMessage: "กรุณากรอกเพศ" },
      { value: dob, setError: setDobError, errorMessage: "กรุณากรอกวันเดือนปีเกิด" },
      { value: phone, setError: setPhoneError, errorMessage: "กรุณากรอกหมายเลขโทรศัพท์" },
      { value: educationLevel, setError: setEducationLevelError, errorMessage: "กรุณากรอกระดับการศึกษา" },
      { value: schoolName, setError: setSchoolNameError, errorMessage: "กรุณากรอกชื่อโรงเรียน" },
      { value: major, setError: setMajorError, errorMessage: "กรุณากรอกสาขา" },
      { value: gpa, setError: setGpaError, errorMessage: "กรุณากรอกเกรดเฉลี่ย" }
    ];
  
    const validationResults = fields.map(field => validateField(field.value, field.setError, field.errorMessage));
  
    if (validationResults.every(result => result)) {
      if (photoFile) {
        const res = await edgestore.publicFiles.upload({
          file: photoFile,
        });
        console.log(res);
    
        const profile = res.url;
        
        registerSeekerMutation.mutate({
          firstName,
          surName,
          sex,
          dob,
          phone,
          educationLevel,
          schoolName,
          major,
          gpa,
          profile
        });
        
        if(registerSeekerMutation.error){
          setSubmitError('เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง');
          setLoading(false);
        }
        else if(!registerSeekerMutation.error){
          setSubmitError('');
          setIsSuccess(true);
          setTimeout(() => {
            redirect('/refresh');
          }, 500);
        }
      }
    } else {
      setLoading(false);
    }
  };
  

  return (
    <>
      <button className="inline-flex items-center gap-x-1.5 text-sm text-gray-400 hover:text-gray-200" 
        onClick={() =>setSeeker(!seeker)}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">
                  ชื่อ
                </label>
                <input
                  type="text"
                  className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                  placeholder="กรอกชื่อของคุณ"
                  value={firstName}
                  onChange={(event) =>
                    handleInputChange(event, setFirstName, setFirstNameError, 'กรุณากรอกชื่อ')
                  }
                />
                {firstNameError && <p className="text-red-400/[0.90] text-sm m-2">{firstNameError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  นามสกุล
                </label>
                <input
                  type="text"
                  className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                  placeholder="กรอกนามสกุลของคุณ"
                  value={surName}
                  onChange={(event) =>
                    handleInputChange(event, setSurName, setSurNameError, 'กรุณานามสกุล')
                  }
                />
                {surNameError && <p className="text-red-400/[0.90] text-sm m-2">{surNameError}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white text-center mb-2">
                เพศ
              </label>
              <div className="flex items-center justify-center space-x-2">
                <label className="inline-flex items-center py-2 px-5 text-white/[.9] bg-white/[.05] hover:bg-orange-500/[.15] border border-white/[.1] rounded-md">
                  <input
                    type="radio"
                    className="h-5 w-5 transition-all appearance-none checked:bg-orange-500 border-4 border-white/[.4] rounded-full"
                    value="ชาย"
                    checked={sex === 'ชาย'}
                    onChange={(event) => setSex(event.target.value)}
                  />
                  <span className="ml-2">ชาย</span>
                </label>
                <label className="inline-flex items-center py-2 px-5 text-white/[.9] bg-white/[.05] hover:bg-orange-500/[.15] border border-white/[.1] rounded-md">
                  <input
                    type="radio"
                    className="h-5 w-5 transition-all appearance-none checked:bg-orange-500 border-4 border-white/[.4] rounded-full"
                    value="หญิง"
                    checked={sex === 'หญิง'}
                    onChange={(event) => setSex(event.target.value)}
                  />
                  <span className="ml-2">หญิง</span>
                </label>
              </div>
              {sexError && (
                <p className="text-red-400/[0.90] text-center text-sm m-2">{sexError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                วัน/เดือน/ปีเกิด
              </label>
              <input
                type="date"
                className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                value={dob}
                max={dateString}
                onChange={(event) =>
                  handleInputChange(event, setDob, setDobError, 'กรุณากรอก วัน/เดือน/ปีเกิด')
                }
              />
              {dobError && (
                <p className="text-red-400/[0.90] text-sm m-2">{dobError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                เบอร์โทรศัพท์
              </label>
              <input
                type="text"
                className="mb-2 w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                placeholder="กรุณากรอกเบอร์โทรศัพท์ของคุณ"
                value={phone}
                onChange={(event) => handlePhoneChange(event, 'phone')}
              />
              {phoneError && (
                <p className="text-red-400/[0.90] text-sm m-2">{phoneError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                ระดับการศึกษา
              </label>
              <input
                type="text"
                className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                placeholder="กรุณากรอกระดับการศึกษาของคุณ"
                value={educationLevel}
                onChange={(event) =>
                  handleInputChange(event, setEducationLevel, setEducationLevelError, 'กรุณากรอกระดับการศึกษาของคุณ')
                }
              />
              {educationLevelError && (
                <p className="text-red-400/[0.90] text-sm m-2">{educationLevelError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                ชื่อโรงเรียนหรือมหาวิทยาลัย
              </label>
              <input
                type="text"
                className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                placeholder="กรอกชื่อโรงเรียนหรือมหาวิทยาลัยของคุณ"
                value={schoolName}
                onChange={(event) =>
                  handleInputChange(event, setSchoolName, setSchoolNameError, 'กรอกชื่อโรงเรียนหรือมหาวิทยาลัยของคุณ')
                }
              />
              {schoolNameError && (
                <p className="text-red-400/[0.90] text-sm m-2">{schoolNameError}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  สาขาวิชา
                </label>
                <input
                  type="text"
                  className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                  placeholder="กรุณากรอกสาขาวิชา"
                  value={major}
                  onChange={(event) =>
                    handleInputChange(event, setMajor, setMajorError, 'กรุณากรอกสาขาวิชา')
                  }
                />
                {majorError && (
                  <p className="text-red-400/[0.90] text-sm m-2">{majorError}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  เกรดเฉลี่ย GPA
                </label>
                <input
                  type="number"
                  className="transition-all w-full px-3 py-2 text-white/[.9] bg-white/[.05] hover:bg-white/[.15] border border-white/[.1] focus:outline-none focus:border-white/[.5] rounded shadow-sm"
                  placeholder="กรุณากรอกเกรดเฉลี่ย"
                  step="0.01"
                  min="0.00"
                  max="4.00"
                  value={gpa}
                  onChange={(event) =>
                    handleInputChange(event, setGPA, setGpaError, 'กรุณากรอกเกรดเฉลี่ย')
                  }
                  onPaste={(event) => event.preventDefault()}
                />
                {gpaError && (
                  <p className="text-red-400/[0.90] text-sm m-2">{gpaError}</p>
                )}
              </div>
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
                <p className="text-xl font-[500] sm:text-2xl">ยืนยันการสมัคร</p>
              </div>
            }
          </button>
          {submitError && (<p className="text-red-400/[0.90] text-sm m-2">{submitError}</p>)}
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