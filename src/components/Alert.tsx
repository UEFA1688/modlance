
interface ModalProps {
    open: boolean;
    onClick: () => void;
  }
export  function Alert({ open, onClick }: ModalProps){
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
          xxxxxx
        </div>
      </div>
    )
  }