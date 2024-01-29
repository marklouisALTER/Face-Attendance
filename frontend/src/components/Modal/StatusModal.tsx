import React from 'react'
import { IoMdCloseCircle } from "react-icons/io";
import { MdCheckCircle } from "react-icons/md";

type status = {
    title: string;
    comment: string;
    toggle: () => void;
}
export const StatusModal:React.FC<status> = ({ title, comment, toggle }) => {
    
    return (
        <div className="transition-all delay-100 ease-in-out fixed inset-0 flex items-center justify-center z-[9999]
        bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg w-96">        
            
            {title === 'Success' ? 
            <div className='w-full h-[6rem] bg-green-500 flex items-center justify-center rounded-t-md'>
                <MdCheckCircle className='text-6xl text-white'/>
            </div>
            : 
            <div className='w-full h-[6rem] bg-red-500 flex items-center justify-center rounded-t-md'>
            <IoMdCloseCircle className='text-6xl text-white'/>
            </div>

            }
            <div className='p-4 flex flex-col items-center'>
            <h1 className='font-bold text-2xl text-primary font-primary'>{title}</h1>
            <p className="text-gray-500 font-secondary text-center mt-5">{comment}</p>
            <div className="mt-4 flex justify-end">
                <button
                className={`${title === 'Success' ? 'bg-green-500' : 'bg-red-500'} px-4 py-1 text-white font-semibold 
                rounded hover-bg-secondary hover-text-primary`}
                onClick={toggle}
                >
                Okay
                </button>
            </div>
            </div>
        </div>
    </div>
  );
};
