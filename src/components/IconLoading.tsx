
export function IconLoading() {
    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <div className="relative animate-bounce">
                    <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-orange-900 opacity-75"></span>
                    <span className="relative inline-block h-10 w-10 border-[4px] border-current border-t-transparent rounded-full text-orange-400 animate-spin">
                        <span className="sr-only">Loading...</span>
                    </span>
                </div>
            </div>
        </>
    )
}
