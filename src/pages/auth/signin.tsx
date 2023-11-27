import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
  } from "next"
  import { getProviders, signIn, useSession } from "next-auth/react"
  import { getServerSession } from "next-auth/next"
  import { authOptions } from "~/server/auth";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faDiscord, faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';  
  import { IconLoading } from "~/components/IconLoading";


  export default function SignIn({
    providers,
  }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { status } = useSession();

    if (status === "loading") {
        return <IconLoading/>
      }
    
    return (
      <>
      <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-5 bg-white/[.05] border border-white/[.05] p-10 rounded-md hover:bg-white/[.06] transition-all">
        <h1 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text 
            bg-gradient-to-r from-orange-400 via-orange-200 to-orange-400">
                Modlance
            <div className="py-3 flex items-center text-xs font-normal text-gray-400 before:flex-[1_1_0%] before:border-t before:mr-6 after:flex-[1_1_0%] after:border-t after:ml-6  before:border-gray-600 after:border-gray-600">
                เลือกเข้าสู่ระบบ
            </div>
        </h1>
        <div className="flex flex-col gap-5 items-center">
            {Object.values(providers).map((provider) => (
                <div key={provider.name} >
                    <button type="button" className="inline-flex items-center gap-2 bg-white/[.05] hover:bg-white/[.1] border border-white/[.05] hover:scale-110 transition-all text-xl text-gray-200 font-semibold py-3 px-4 rounded-md shadow-xl"
                    onClick={() => signIn(provider.id)}
                    >
                    {provider.name}  
                    {provider.name == "Discord"&& <FontAwesomeIcon icon={faDiscord} className="w-6 h-6"/>}
                    {provider.name == "Google"&& <FontAwesomeIcon icon={faGoogle} className="w-6 h-6"/>}
                    {provider.name == "Apple"&& <FontAwesomeIcon icon={faApple} className="w-6 h-6"/>}
                    </button>
                </div>
            ))}
        </div>
      </div>
      </div>
      </>
    )
  }
  
  export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)
  
    if (session) {
      return { redirect: { destination: "/" } }
    }

    const providers = await getProviders()
  
    return {
      props: { providers: providers ?? [] },
    }
  }