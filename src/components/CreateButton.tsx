"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus} from '@fortawesome/free-solid-svg-icons';


interface CreateJobFormmProps {
    setPage: React.Dispatch<React.SetStateAction<number>>;
}
  
export function CreateButton({ setPage }: CreateJobFormmProps){

    return (
        <div className="relative">
            <a className="absolute justify-center items-center flex animate-ping rounded-full bg-orange-400 h-12 w-12 transition-all">
            </a>        
            <button
            className="relative items-center justify-center transition-all hover:text-white/20 font-semibold text-xl text-orange-500 rounded-full"
            onClick={() => setPage(2)}>
                <FontAwesomeIcon icon={faCirclePlus} className="w-12 h-12"/>
            </button>
        </div>
    );
}