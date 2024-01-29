import React, { useEffect, useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import { Image } from 'antd'
import { Link, NavLink, useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { useUserSessionStore } from '../Store/ManagementState';
import { useSelectedUserProfile, useUserAttendance, useUserTransaction } from '../Store/userStateManagement';
import { StatusModal } from '../components/Modal/StatusModal';
const TeacherProfileLayout:React.FC = () => {
    const { id } = useParams();
    const token  = useUserSessionStore(state => state.formSession['token']);
    const [statusModal, setStatusModal] = useState<boolean>(false);
    const [statusModalMessage, setStatusModalMessage] = useState<{title: string, message: string}>({
        title: '',
        message: ''
    })

    // zustand state management 
    const updateUserTransaction = useUserTransaction(state => state.updateUserTransaction);
    const updateUserAttendance = useUserAttendance(state => state.updateUserAttendance);
    const updateUserInfo = useSelectedUserProfile(state => state.updateUserInfo);
    const userInfo = useSelectedUserProfile(state => state.userInfo);
    useEffect(() => {
        document.title = 'Teacher Profile'

        const getUserTransaction = async () => {
            try{
                const response = await axios.get(`http://localhost:5000/transaction/get-user-transaction/${id}`, {
                    headers: {
                        'Authorization': token
                    }
                })

                updateUserTransaction(response.data.data)

            }catch(err : any){
                setStatusModalMessage({
                    title: err.response.data.title,
                    message: err.response.data.message
                })
                setStatusModal(true)
            }
        }

        const getUserAttendance = async () => {
            try{
                const response = await axios.get(`http://localhost:5000/attendance/get-user-attendance/${id}`, {
                    headers: {
                        'Authorization': token
                    }
                })

                updateUserAttendance(response.data.data)

            }catch(err : any){
                setStatusModalMessage({
                    title: err.response.data.title,
                    message: err.response.data.message
                })
                setStatusModal(true)
            }
        }
        const getUserInformation = async () => {
            try{
                const response = await axios.get(`http://localhost:5000/teachers/get-user-profile/${id}`, {
                    headers: {
                        'Authorization': token
                    }
                })

                updateUserInfo({
                    employee_id: response.data.data.employee_id,
                    first_name: response.data.data.first_name,
                    last_name: response.data.data.last_name,
                    face_image: response.data.data.face_image,
                    eyebrows: response.data.data.eyebrows,
                    leyes: response.data.data.leyes,
                    reyes: response.data.data.reyes,
                    nose: response.data.data.nose,
                    mouth: response.data.data.mouth,
                }) 
            }catch(err : any){
                setStatusModalMessage({
                    title: err.response.data.title,
                    message: err.response.data.message
                })
                setStatusModal(true)
            }
        }
        getUserInformation()
        getUserAttendance()
        getUserTransaction()

    },[id, token])
    console.log(userInfo)
    return(
        <div>
            <Breadcrumbs />
            <Link to={'../tracking-record/attendance-record'}>
                Go back to attendance
            </Link>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className='bg-white rounded-xl border overflow-hidden'>
                    <div className='w-full h-[20rem] md:h-[24rem] bg-white'>
                        <div className='bg-primary w-full h-[12rem] md:h-[15rem]'>
                            <div className='w-full h-full flex items-center justify-center'>
                                <div className='border border-secondary mt-[14rem]
                                    w-[10rem] h-[10rem] rounded-full left-[32%] top-[15%] bg-white
                                    md:w-[12rem] md:h-[12rem] lg:w-[15rem] lg:h-[15rem] overflow-hidden'>
                                    <Image src={`data:image/png;base64,${userInfo.face_image}`} alt='user profile' className='rounded-full'/>
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div className='flex items-center flex-col gap-1'>
                        <h1 className='text-2xl font-secondary text-primary font-medium'>
                            {userInfo.first_name} {userInfo.last_name}
                        </h1>
                        <h1 className='text-xl text-gray-500 font-semibold'>Teacher</h1>
                    </div>
                    <div className='mt-14 flex items-center justify-center'>
                        <h1 className='font-secondary text-xl font-semibold text-secondary'>User Information</h1>
                    </div>
                    <div className='w-full mt-5 py-5 grid grid-cols-3 px-5 gap-5 h-[15rem]'>
                        <div className='border border-black'></div>
                        <div className='border border-black'></div>
                        <div className='border border-black'></div>
                    </div>
                </div>
                <div className='bg-white rounded-xl p-5 shadow-md shadow-gray-300'>
                    <div className='flex items-center gap-5'> 
                        <NavLink to={'.'}
                            end
                            className={({isActive}) => isActive ? 'text-secondary font-secondary': 'text-primary font-secondary hover:text-secondary' }>
                            User Transaction
                        </NavLink>
                        <NavLink to={'user-attendance'}
                            className={({isActive}) => isActive ? 'text-secondary font-secondary': 'text-primary font-secondary hover:text-secondary' }>
                            User Attendance
                        </NavLink>
                        <NavLink to={'user-photos'}
                            className={({isActive}) => isActive ? 'text-secondary font-secondary': 'text-primary font-secondary hover:text-secondary' }>
                            All Image Photo
                        </NavLink>
                    </div>
                    <div className='mt-5'>
                        <Outlet/>
                    </div>
                </div>
            </div>
            {statusModal &&
                <StatusModal
                    title={statusModalMessage.title}
                    comment={statusModalMessage.message}
                    toggle={() => setStatusModal(false)}
                />
            }
        </div>
    )
}

export default TeacherProfileLayout;