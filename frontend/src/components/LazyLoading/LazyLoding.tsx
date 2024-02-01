import React from 'react';
import { Spin } from 'antd';

export const LazyLoding:React.FC = () => {
    return(
        <div className='w-full h-screen flex flex-col gap-5 items-center justify-center'>
            <Spin size='large'/>
            <h1 className='text-xl font-secondary text-primary'>Loading...</h1>
        </div>
    )
}

