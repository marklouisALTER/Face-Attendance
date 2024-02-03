import React, { useEffect } from 'react';
import { Authentication } from '../../Authentication/Authentication';
import { useNavigate, useLocation } from 'react-router-dom';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs';
import { DashboardTeacherCard } from '../../components/TeacherCard/DashboardTeacherCard';


const Dashboard: React.FC = () => {
  const { isAuthenticated } = Authentication();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/', { state: { message: 'You must be logged in to view this page', from: location.pathname } });
    }
  }, []);




  return (
    <div className='w-full h-screen'>
      <Breadcrumbs />
      <div className='w-full h-screen'>
        <div className='flex items-center justify-between'>
          <div className='border h-[5rem] w-[20rem]'>
          </div>
          <div className='border h-[5rem] w-[20rem]'>
          </div>
          <div className='h-[5rem] flex justify-center md:justify-end gap-10 mt-5'>
            <div className='flex flex-col items-center'>
              <h1 className='text-xl md:text-3xl font-bold font-secondary text-primary'>2</h1>
              <h1 className='font-secondary text-secondary text-xs md:text-sm'>Total Teacher</h1>
            </div>
            <div className='flex flex-col items-center'>
              <h1 className='text-xl md:text-3xl font-bold font-secondary text-primary'>20</h1>
              <h1 className='font-secondary text-secondary text-xs md:text-sm'>Total Transaction</h1>
            </div>
            <div className='flex flex-col items-center'>
              <h1 className='text-xl md:text-3xl font-bold font-secondary text-primary'>50</h1>
              <h1 className='font-secondary text-secondary text-xs md:text-sm'>Total Attendance</h1>
            </div>
          </div>
        </div>
        <div className='my-5'>
          <h1 className='font-primary text-xl text-primary'>All Employees</h1>
        </div>
        <div className='w-full h-full'>
          <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            <DashboardTeacherCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;