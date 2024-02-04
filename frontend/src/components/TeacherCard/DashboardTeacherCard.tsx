import React, { useEffect } from 'react'
import { Image } from 'antd'
import { useProfileApi } from '../../Store/userStateManagement'
import { useUserSessionStore } from '../../Store/ManagementState';
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom'
import { FaUser } from "react-icons/fa";

export const DashboardTeacherCard:React.FC = () => {

    const {fetchData, userProfile} = useProfileApi();
    const token = useUserSessionStore(state => state.formSession['token']);
    useEffect(() => {
        fetchData(token);
    },[])

    const navigate = useNavigate()

return (
    <>
        {userProfile?.data.map((user, index) => (
        <div key={index} className='transition-all delay-50 ease-in-out relative border bg-white rounded-xl flex flex-col 
        justify-between hover:shadow-md p-5'>
            <div className='w-full flex flex-col items-center justify-center'>
                <div className='rounded-full w-[4rem] h-[4rem] sm:w-[5rem] sm:h-[5rem] xl:w-[7rem] xl:h-[7rem] overflow-hidden'>
                    <Image 
                        src={`data:image/png;base64,${user.face_image}`} 
                        alt='avatar'
                        // width={80}
                        // height={80}
                        className='object-cover'
                    />
                </div>
                <div className='flex flex-col items-center gap-2 mt-5'>
                    <h1 className='font-secondary text-primary text-sm text-center font-semibold group-hover:text-white lg:text-xl'>{user.first_name} {user.last_name}</h1>
                    <h1 className='font-primary text-gray-500 group-hover:text-gray-400 text-xs lg:text-lg'>Teacher</h1>
                </div>
            </div>
            <div className='w-full grid grid-cols-5 gap-3 mt-5 sm:mt-7 lg:mt-15'>
                <div className=''>
                    <Link to={'./tracking-record/employee-profile'} 
                        className='flex items-center justify-center text-primary hover:bg-gray-200
                        w-full h-full rounded-md transition-all delay-100 ease-in-out'>
                        <FaUser />
                    </Link>
                </div>
                <button className='col-span-4 bg-blue-100 w-full py-3 rounded-md font-secondary text-secondary
                    transition-all delay-50 ease-linear outline-none font-semibold hover:bg-primary hover:text-white
                    focus:outline focus:ring-1 focus:ring-white text-xs lg:text-sm'
                    onClick={() => navigate(`./attendance-record/profile-stats/${user.employee_id}`)}>
                    View Stats
                </button>
            </div>
        </div>
        ))}
    </>
  )
}
