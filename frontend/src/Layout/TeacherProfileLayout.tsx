import React, { useEffect, useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import { Progress } from 'antd';
import { Link, NavLink, useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { useUserSessionStore } from '../Store/ManagementState';
import { useUserAttendance, useUserTransaction } from '../Store/userStateManagement';
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

    useEffect(() => {
        document.title = 'Teacher Profile'

        const getUserTransaction = async () => {
            try{
                const response = await axios.get(`http://localhost/transaction/get-user-transaction/${id}`, {
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
                const response = await axios.get(`http://localhost/attendance/get-user-attendance/${id}`, {
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
        
        getUserAttendance()
        getUserTransaction()

    },[id, token])

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
                                    md:w-[12rem] md:h-[12rem] lg:w-[15rem] lg:h-[15rem]'>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center flex-col gap-1'>
                        <h1 className='text-2xl font-secondary text-primary font-medium'>Mark Louis Bernardo</h1>
                        <h1 className='text-xl text-gray-500 font-semibold'>Teacher</h1>
                    </div>
                    <div className='mt-14 flex items-center justify-center'>
                        <h1 className='font-secondary text-xl font-semibold text-secondary'>User Information</h1>
                    </div>
                    <div className='w-full mt-5 py-5 flex items-center justify-center flex-wrap gap-5 md:gap-20'>
                        <div className='flex items-center justify-center flex-col gap-3'>
                            <Progress type="circle" percent={75} />
                            <h1 className='font-secondary text-md'>Attendance Count</h1>
                        </div>
                        <div className='flex items-center justify-center flex-col gap-3'>
                            <Progress type="circle" percent={75}/>
                            <h1 className='font-secondary text-md'>Transaction Count</h1>
                        </div>
                        <div className='flex items-center justify-center flex-col gap-3'>
                            <Progress type="circle" percent={75}/>
                            <h1 className='font-secondary text-md'>Attendance Percentage</h1>
                        </div>
                    </div>
                </div>
                <div className='bg-white rounded-xl p-5'>
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
        </div>
    )
}

export default TeacherProfileLayout;