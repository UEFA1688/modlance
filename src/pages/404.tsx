import Link from 'next/link';


export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-10">
      <h1 className="text-5xl font-bold text-white">NotFound404</h1>
      <h1 className="text-2xl font-medium text-white">ไม่พบหน้าที่คุณค้นหา</h1>
      <Link href={`/`}>
        <button className="inline-flex justify-center items-center gap-x-1.5 text-sm text-gray-400 hover:text-gray-200">
          <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            กลับหน้าหลัก
        </button>
      </Link>
      </div>
    )
  }