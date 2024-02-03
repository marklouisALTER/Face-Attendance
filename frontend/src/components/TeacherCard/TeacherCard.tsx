import { Image } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom';
// import { FaUserLarge } from "react-icons/fa6";
// import { IoStatsChart } from "react-icons/io5";

type teacherType = {
    employee_id: number;
    first_name: string;
    last_name: string;
    face_image: string;
}

type teacherInfoTypeProps = {
    teacherInfo: teacherType[];
}

export const TeacherCard:React.FC<teacherInfoTypeProps> = ({teacherInfo}) => {
  return (
    <>
        {teacherInfo.map((teacher, index) => (
            <div key={index} className='relative group w-[13rem] h-[13rem] bg-white rounded-xl hover:bg-primary
            transition-all delay-50 ease-in-out border'>
                <div className='absolute p-2'>
                    <h1 className='font-secondary text-xs bg-primary text-white rounded-sm px-2 
                    group-hover:bg-white group-hover:text-primary'>ID: {teacher.employee_id}</h1>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-full gap-3">
                    <div className='w-14 h-14 rounded-full border border-primary group-hover:border-secondary overflow-hidden'>
                        <Image 
                            src={`data:image/png;base64,${teacher.face_image}`}
                            alt="Employee Profile"
                            width={56}
                            height={56}
                            className='rounded-full  object-cover'
                        />
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className='font-secondary text-primary group-hover:text-white'>{teacher.first_name} {teacher.last_name}</h1>
                        <h1 className='font-secondary text-gray-400 group-hover:text-secondary'>Teacher</h1>
                    </div>
                    <div className='flex items-center gap-1'>
                        
                        <Link 
                            to={'/tracking-record/employee-profile'}
                            className='font-secondary text-primary hover:text-primary-dark 
                            transition-all delay-50 border p-1 px-2 rounded-xl ease-in-out
                            group-hover:text-white text-xs group-hover:border-white
                            focus:outline-none focus:ring-2 focus:ring-secondary'>
                            {/* <FaUserLarge /> */}
                            Profile
                        </Link>
                        <Link
                            to={`../attendance-record/profile-stats/${teacher.employee_id}`}
                            className='font-secondary text-primary hover:text-primary-dark 
                            transition-all delay-50 border p-1 px-2 rounded-xl ease-in-out
                            group-hover:text-white text-xs group-hover:border-white
                            focus:outline-none focus:ring-2 focus:ring-secondary'>
                            {/* <IoStatsChart /> */}
                            Stats
                        </Link>
                    </div>
                </div>
            </div>
        ))}
    </>
  )
}
