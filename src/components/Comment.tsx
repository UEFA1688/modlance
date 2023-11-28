"use client"
import {  useState } from 'react';
import { useRouter } from 'next/navigation'
import { signIn,  useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';


interface CommentProps {
    jobId: string;
  }
  
export function Comment({ jobId }: CommentProps) {
    const router = useRouter()
 
    const { data: sessionData } = useSession();
 
    const { data: getAllComments, status: getAllCommentsStatus } = api.comment.getAllComments.useQuery({ jobId: jobId });
    const deleteComment = api.comment.deleteComment.useMutation();
    const commentPosting = api.comment.commentPosting.useMutation();

    const [content, setContent] = useState('');
    const [contentError, setContentError] = useState('');    


    const handleInputContent = (
        event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
      ) => {
        const value = event.target.value;
        setContent(value);
      
      if (!value.trim()) {
        setContentError('คุณยังไม่ได้กรอกข้อความ');
      } else {
        setContentError('');
      }
      };    
    const handleCommeting = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!contentError) {
            commentPosting.mutate({
                jobId,
                content,
            })
            setContent('');
            router.refresh();
        };
    };

    return (
    <div className="border-t-2 py-5">
        <div className="text-start">
            <h1 className="text-sm font-normal sm:text-base text-white">
                แสดงความเห็น
            </h1>
        </div>

        {getAllCommentsStatus === "loading" ? 
         <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            <div className="animate-pulse transition-all p-10 m-10">
               <p className="text-lg sm:text-xl font-normal text-center text-gray-400">กำลังโหลด...</p>
            </div>
        </div>
        
        :
        <div className="relative m-5 rounded-3xl">
            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">

            {!getAllComments && 
                <div className="animate-pulse transition-all p-10 m-10">
                <p className="text-lg sm:text-xl font-normal text-center text-gray-400">ไม่มีข้อความ...</p>
                </div>
            }
                <ul className="space-y-10">
                {getAllComments?.map((comment) => (
                    <div key={comment.id}>

                    {sessionData && comment.userId === sessionData.user.id ?
                        <li className="max-w-2xl ms-auto flex justify-end gap-x-2 sm:gap-x-4">
                        <div className="flex flex-col">
                            <div className="flex flex-col items-end m-2">
                                <a
                                    className="bg-no-repeat bg-cover bg-center w-[2.375rem] h-[2.375rem] rounded-full"
                                    style={{ backgroundImage: `url(${comment.userData?.image ?? ""})` }}> 
                                </a>
                            </div> 
                            <div className="break-all space-y-3">
                                <h3 className="font-semibold text-xs text-orange-500 text-end">
                                {comment.userData?.userType === "COMPANY" ? comment.userData?.company[0]?.companyName : comment.userData?.seeker[0]?.firstName}
                                </h3>
                                <div className="flex flex-col items-end space-y-1.5">
                                    <p className="text-sm w-fit text-white text-end bg-orange-900/50 rounded-md px-6 py-4 ">
                                    {comment.content}                                
                                    </p>
                                </div>
                                <h4 className="font-normal text-[0.6rem] text-orange-200 text-end">
                                    {`เวลา: ${new Date(comment.createdAt).toLocaleTimeString('th-TH', { hour12: false })} | วันที่: ${new Date(comment.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                                </h4>
                            </div>
                            <div className="flex flex-col items-end m-2">
                                <button
                                    className={`px-2 text-xs text-start rounded-sm text-white hover:text-gray-200 hover:bg-red-500/50 bg-red-500`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteComment.mutate({
                                        commentId: comment.id,
                                        });
                                        router.refresh();
                                    }}
                                    >
                                        ลบข้อความ
                                </button>
                            </div> 
                        </div>
                        
                        </li>                      
                    :
                        <li className="ms-auto flex justify-start gap-x-2 sm:gap-x-4">
                            <div className="flex flex-col">
                                <div className="flex flex-col items-start m-2">
                                    <a
                                        className="bg-no-repeat bg-cover bg-center w-[2.375rem] h-[2.375rem] rounded-full"
                                        style={{ backgroundImage: `url(${comment.userData?.image ?? ""})` }}> 
                                    </a>
                                </div> 
                                <div className="break-all space-y-3">
                                    <h3 className="indent-2 font-semibold text-xs text-orange-500 text-start">
                                    {comment.userData?.userType === "COMPANY" ? comment.userData?.company[0]?.companyName : comment.userData?.seeker[0]?.firstName}
                                    </h3>
                                    <div className="flex flex-col items-start space-y-1.5">
                                        <p className="text-sm w-fit text-white text-start bg-gray-900 rounded-md px-6 py-4 ">
                                        {comment.content}                                
                                        </p>
                                    </div>
                                    <h4 className="indent-2 font-normal text-[0.6rem] text-orange-200 text-start">
                                        {`เวลา: ${new Date(comment.createdAt).toLocaleTimeString('th-TH', { hour12: false })} | วันที่: ${new Date(comment.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                                    </h4>
                                </div>
                            </div>
                        </li>                          
                    }
                    </div>
                    ))}
                </ul>
            </div>
            {sessionData ?
            <footer className="max-w-4xl mx-auto sticky bottom-0 z-10 bg-white/[.05] p-5 rounded-full backdrop-blur-md">
                <form className="relative flex flex-row" onSubmit={handleCommeting}>
                <input
                    type="text"
                    className="p-4 block w-full max-h-20 text-sm disabled:opacity-50 disabled:pointer-events-none rounded-full bg-gray-900/[.9] border border-white/[.05] text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    placeholder="พิมพ์เพื่อโต้ตอบ..."
                    value={content}
                    onChange={(event) => handleInputContent(event)}
                ></input>
                <div className="px-2 flex flex-col justify-center items-center rounded-full">
                    <button 
                    type="submit" 
                    className="inline-flex flex-shrink-0 justify-center items-center h-12 w-12 rounded-full text-white bg-orange-600 hover:bg-orange-500">
                        <svg className="flex-shrink-0 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                        </svg>
                    </button>
                </div>
                </form>
                {contentError && (
                    <p className="text-orange-500 text-center text-sm mt-2">{contentError}</p>
                )}
            </footer>
            :
            <footer
                
                className="max-w-4xl mx-auto sticky bottom-0 z-10 bg-white/[.05] p-5 rounded-full backdrop-blur-md">
                <form className="relative flex flex-row" onSubmit={handleCommeting}>
                <input
                    type="text"
                    className="p-4 block w-full max-h-20 text-sm disabled:opacity-50 disabled:pointer-events-none rounded-full bg-gray-900/[.9] border border-white/[.05] text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                    placeholder="พิมพ์เพื่อโต้ตอบ..."
                    value={content}
                    onChange={(event) => handleInputContent(event)}
                ></input>
                <div className="px-2 flex flex-col justify-center items-center rounded-full">
                    <button 
                    type="submit" 
                    className="inline-flex flex-shrink-0 justify-center items-center h-12 w-12 rounded-full text-white bg-orange-600 hover:bg-orange-500">
                        <svg className="flex-shrink-0 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                        </svg>
                    </button>
                </div>
                </form>
                {contentError && (
                    <p className="text-orange-500 text-center text-sm mt-2">{contentError}</p>
                )}
                <button onClick={() => signIn()} className="absolute top-0 start-0 w-full h-full rounded-lg backdrop-brightness-60 hover:backdrop-brightness-90 backdrop-blur-[2px]"></button>
                <button onClick={() => signIn()} className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-white hover:text-gray-400 font-medium inline-flex space-x-10 items-center justify-center"><p>เข้าสู่ระบบเพื่อแสดงความคิดเห็น</p> <FontAwesomeIcon icon={faLock} className="w-10 h-10" beatFade /></div>
                    
                </button>
            </footer>
            }
        </div>
    } 
    </div>   
    );
}