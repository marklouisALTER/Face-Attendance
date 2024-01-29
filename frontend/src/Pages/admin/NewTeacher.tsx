import React, { useEffect } from 'react'
import { Authentication } from '../../Authentication/Authentication'
import { useNavigate, useLocation } from 'react-router-dom'
import { Stepper } from '../../components/Steps/Stepper'
import { useFormStore } from '../../Store/ManagementState'
import { UserInformation } from '../../components/RegisterEmployee/UserInformation'
import { RegisterEyebrows } from '../../components/RegisterEmployee/RegisterEyebrows'
import { RegisterLeftEye } from '../../components/RegisterEmployee/RegisterLeftEye'
import { RegisterRightEye } from '../../components/RegisterEmployee/RegisterRightEye'
import { RegisterNose } from '../../components/RegisterEmployee/RegisterNose'
import { RegisterMouth } from '../../components/RegisterEmployee/RegisterMouth'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
const NewTeacher:React.FC = () => {

    const { isAuthenticated } = Authentication();
    const navigate = useNavigate();
    const location = useLocation();
    const step = useFormStore(state => state.step);
    useEffect(() => {
        if(!isAuthenticated()){
            navigate('/', {state: {message: 'You must be logged in to view this page', from: location.pathname}})
        }
    },[])

    function showStep(step:number) {
        switch(step){
            case 0:
                return <UserInformation />
            case 1:
                return <RegisterEyebrows />
            case 2:
                return <RegisterLeftEye />
            case 3: 
                return <RegisterRightEye />
            case 4:
                return <RegisterNose />
            case 5: 
                return <RegisterMouth />
        }
    }

return (
    <div className='relative w-full h-screen'>
        <Breadcrumbs />
        <div className='flex items-center justify-center my-10'>
            <h1 className='text-primary font-secondary text-2xl'>Register New Teacher</h1>
        </div>
        <Stepper />
        <div className='absolute w-full flex flex-col items-center mt-[3rem]'>
        {showStep(step)}
        </div>
    </div>
  )
}

export default NewTeacher;