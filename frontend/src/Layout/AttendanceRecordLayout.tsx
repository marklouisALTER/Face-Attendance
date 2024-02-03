import React,{ useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { useAttendanceRecord, useUpdateAttendanceModal, useUserSessionStore } from '../Store/ManagementState';
import { StatusModal } from '../components/Modal/StatusModal';
import { UpdateAttendance } from '../components/Modal/UpdateAttendance';
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs';
import '../style/style.css'
import { TeacherCard } from '../components/TeacherCard/TeacherCard';

type teacherProfile = {
    employee_id: number;
    first_name: string;
    last_name: string;
    face_image: string;
}

const AttendanceRecordLayout:React.FC = () => {
    const token = useUserSessionStore(state => state.formSession['token']);
    const updateAttendanceModal = useUpdateAttendanceModal(state => state.updateAttendanceModal);
    const updateAttendanceRecord = useAttendanceRecord(state => state.updateAttendanceRecord);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [statusModalMessage, setStatusModalMessage] = useState<{title: string, message: string}>({
        title: '',
        message: ''
    })
    // const [attendanceRecord, setAttendanceRecord] = useState<attendanceType[]>([])
    const [userProfile, setUserProfile] = useState<teacherProfile[]>([])

    useEffect(() => {
        document.title = 'Teacher Profile'
        setLoading(true)
    const getAllAttendance = async () => {
        try{
            const response = await axios.get('http://localhost:5000/attendance/record', {
                headers: {
                    'Authorization': token
                }
            })
            setLoading(false)
            // setAttendanceRecord(response.data.data)
            updateAttendanceRecord(response.data.data) 
        }catch(err: any){
            setError(true)
            setLoading(false)
            setStatusModalMessage({
                title: err.response.data.title,
                message: err.response.data.message 
            })
        }
        
    }
    getAllAttendance();

    const getTeachersProfile = async () => {
        try{
            const response = await axios.get('http://localhost:5000/teachers/profile', {
                headers: {
                    'Authorization': token
                }
            })
            setLoading(false)
            setUserProfile(response.data.data) 

        }catch(err: any){
            setError(true)
            setLoading(false)
            setStatusModalMessage({
                title: err.response.data.title,
                message: err.response.data.message
            })
        }
        
    }
    getTeachersProfile();

}, [token, updateAttendanceRecord])

  return (
    <div className='w-full'>
        <Breadcrumbs />
        <div className=' h-full flex flex-col gap-5'>
            <div className='container w-full h-[17rem] overflow-x-auto flex items-center overflow-hidden'>
                <div className='flex gap-5'>
                    <TeacherCard teacherInfo={userProfile}/>
                </div>
            </div>
            <div>
                <Outlet context={{ loading }}/>
            </div>
        </div>
        {/* Status Modal it will show if there is error*/}
        {error &&
            <StatusModal 
            title={statusModalMessage.title} 
            comment={statusModalMessage.message} 
            toggle={() => setError(prevState => !prevState)}
            />
        }

        {updateAttendanceModal &&
            <UpdateAttendance />
        }

    </div>
  )
}
export default AttendanceRecordLayout;