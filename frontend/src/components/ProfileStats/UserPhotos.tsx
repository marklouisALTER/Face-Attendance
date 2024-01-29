import { Image } from 'antd'
import React from 'react'
import { useSelectedUserProfile } from '../../Store/userStateManagement'

export const UserPhotos:React.FC = () => {
  const userInfo = useSelectedUserProfile(state => state.userInfo)
  return (
    <div className='mt-10'>
      <div className='flex items-center justify-center'>
        <h1 className='font-secondary text-xl text-primary'>All Photos</h1>
      </div>
      <div className='flex gap-2 items-center flex-wrap justify-center mt-5'>
        <Image src={`data:image/png;base64,${userInfo.eyebrows}`} width={200} height={100} alt='user profile' className='object-cover'/>
        <Image src={`data:image/png;base64,${userInfo.reyes}`} width={200} height={100} alt='user profile' className='object-cover' />
        <Image src={`data:image/png;base64,${userInfo.leyes}`} width={200} height={100} alt='user profile' className='object-cover' />
        <Image src={`data:image/png;base64,${userInfo.nose}`} width={200} height={100} alt='user profile' className='object-cover' />
        <Image src={`data:image/png;base64,${userInfo.mouth}`} width={200} height={100} alt='user profile' className='object-cover' />
      </div>
    </div>
  )
}
