import React, { useEffect, useState } from 'react'
import { TeacherTable } from '../../components/Table/TeacherTable'
import axios from 'axios'
import { useUpdateModal, useUserSessionStore } from '../../Store/ManagementState'
import { StatusModal } from '../../components/Modal/StatusModal'
import { UpdateTeacher } from '../../components/Modal/UpdateTeacher'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'

type teacherProfile = {
    employee_id: number;
    first_name: string;
    last_name: string;
    face_image: string;
    eyebrows: string;
    lefteye: string;
    righteye: string;
    nose: string;
    mouth: string;
}

const TeacherProfile:React.FC = () => {
    const token = useUserSessionStore(state => state.formSession['token']);
    const updateModal = useUpdateModal(state => state.updateModal);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [statusModalMessage, setStatusModalMessage] = useState<{title: string, message: string}>({
        title: '',
        message: ''
    })

    const [userProfile, setUserProfile] = useState<teacherProfile[]>([])


    useEffect(() => {
        document.title = 'Teacher Profile'
        setLoading(true)
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

    }, [])

    return(
        <div className='w-full h-screen'>
            <Breadcrumbs />
            {/* Teacher profile table */}
            <div className='mt-10'>
                <TeacherTable 
                    data={userProfile}
                    loading={loading}
                />
            </div>

            {/* Status Modal it will show if there is error*/}
            {error &&
                <StatusModal 
                    title={statusModalMessage.title} 
                    comment={statusModalMessage.message} 
                    toggle={() => setError(prevState => !prevState)}
                    />
            }
            {updateModal &&
                <UpdateTeacher />
            }
        </div>

    )
}

export default TeacherProfile;