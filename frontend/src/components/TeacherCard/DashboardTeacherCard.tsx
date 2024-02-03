import React, { useEffect } from 'react'
import { Image } from 'antd'
import { useProfileApi } from '../../Store/userStateManagement'
import { useUserSessionStore } from '../../Store/ManagementState';
import { useNavigate } from 'react-router-dom';

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
        <div key={index}
            className='group transition-all delay-50 ease-in-out relative border bg-white rounded-xl grid grid-rows-2 
            hover:shadow-md hover:scale-105 hover:bg-primary'>
            <div className='flex items-center gap-4 p-5'>
                <div className='rounded-full w-20 h-20 overflow-hidden'>
                    <Image 
                        src={`data:image/png;base64,${user.face_image}`} 
                        alt='avatar'
                        width={80}
                        height={80}
                        className='object-cover'
                    />
                </div>
                <div className='flex flex-col'>
                    <h1 className='font-secondary text-primary text-xl font-semibold group-hover:text-white'>{user.first_name} {user.last_name}</h1>
                    <h1 className='font-primary text-gray-500 group-hover:text-gray-400'>Teacher</h1>
                </div>
            </div>
            <div className='grid grid-cols-3 px-5'>
                <div className='col-span-2'>
                    <h1 className='text-primary font-secondary group-hover:text-white'>Attendance Info.</h1>
                </div>
                <div className='flex flex-col items-center justify-center gap-2'>
                    <button className='bg-primary w-full py-2 rounded-md font-secondary text-white
                    group-hover:bg-secondary transition-all delay-50 ease-linear outline-none
                    focus:outline focus:ring-1 focus:ring-white'
                    onClick={() => navigate(`./tracking-record/employee-profile`)}
                    >View Profile</button>
                    <button className='bg-primary w-full py-2 rounded-md font-secondary text-white
                    group-hover:bg-secondary transition-all delay-50 ease-linear outline-none
                    focus:outline focus:ring-1 focus:ring-white'
                    onClick={() => navigate(`./attendance-record/profile-stats/${user.employee_id}`)}
                    >View Stats</button>
                </div>
            </div>
            <div className='absolute top-0 right-5 w-20 h-20 bg-secondary rounded-b-md flex items-center justify-center'>
                <h1 className='absolute top-0 right-16 text-xs font-secondary text-white'>ID</h1>
                <div className=''>
                    <h1 className='text-xl font-secondary text-white'>42</h1>
                </div>
            </div>
        </div>
        ))}
    </>
  )
}
