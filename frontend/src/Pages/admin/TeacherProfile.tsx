import React, { useEffect } from 'react'
import { TeacherTable } from '../../components/Table/TeacherTable'
import { useUpdateModal, useUserSessionStore } from '../../Store/ManagementState'
import { StatusModal } from '../../components/Modal/StatusModal'
import { UpdateTeacher } from '../../components/Modal/UpdateTeacher'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { useProfileApi } from '../../Store/userStateManagement'

const TeacherProfile:React.FC = () => {
    const token = useUserSessionStore(state => state.formSession['token']);
    const updateModal = useUpdateModal(state => state.updateModal);
    const { fetchData, error, title, comment, updateData, userProfile, isLoading } = useProfileApi()

    useEffect(() => {
        document.title = 'Teacher Profile'
        fetchData(token)
    }, [])

    return(
        <div className='w-full'>
            <Breadcrumbs />
            {/* Teacher profile table */}
            <div className='mt-10'>
                <TeacherTable 
                    data={userProfile?.data}
                    loading={isLoading}
                />
            
            </div>

            {/* Status Modal it will show if there is error*/}
            {error &&
                <StatusModal 
                    title={title} 
                    comment={comment} 
                    toggle={updateData}
                    />
            }
            {updateModal &&
                <UpdateTeacher />
            }
        </div>

    )
}

export default TeacherProfile;