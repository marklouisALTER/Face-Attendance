import React from 'react'
import { Image, Progress } from 'antd'
export const DashboardTeacherCard:React.FC = () => {
  return (
    <div className='relative border bg-white rounded-xl shadow-md grid grid-rows-2'>
        <div className='flex items-center gap-4 p-5'>
            <div className='rounded-full w-20 h-20 overflow-hidden'>
                <Image 
                src={'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D'} 
                alt='avatar' 
                className='w-full h-full object-center'
                />
            </div>
            <div className='flex flex-col'>
                <h1 className='font-secondary text-primary text-xl font-semibold'>Cherryann Lopez</h1>
                <h1 className='font-primary text-gray-500'>Teacher</h1>
            </div>
        </div>
        <div className='grid grid-cols-3 px-5'>
            <div className='col-span-2 flex gap-5 items-center'>
                <div className='flex flex-col items-center gap-1'>
                <Progress 
                    percent={2} 
                    type='circle'
                    size={60}
                    format={percent => `${percent}`}
                    strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                    }}
                />
                <h1 className='text-xs font-secondary text-primary'>Attendance</h1>
                </div>
                <div className='flex flex-col items-center gap-1'>
                <Progress 
                    percent={2} 
                    type='circle'
                    size={60}
                    format={percent => `${percent}`}
                    strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                    }}
                />
                <h1 className='text-xs font-secondary text-primary'>Transaction</h1>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center gap-2'>
                <button className='bg-primary w-full py-2 rounded-md font-secondary text-white'>View Profile</button>
                <button className='bg-primary w-full py-2 rounded-md font-secondary text-white'>View Stats</button>
            </div>
        </div>
        <div className='absolute top-0 right-5 w-20 h-20 bg-secondary rounded-b-md flex items-center justify-center'>
            <h1 className='absolute top-0 right-16 text-xs font-secondary text-white'>ID</h1>
            <div className=''>
                <h1 className='text-xl font-secondary text-white'>42</h1>
            </div>
        </div>
    </div>
  )
}
