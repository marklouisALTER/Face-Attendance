import React from 'react'
import { HomeOutlined, UserAddOutlined, FileTextOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { useLocation } from 'react-router-dom';
import { PiUserListLight } from "react-icons/pi";
import { LuScanFace } from "react-icons/lu";
import { RiFileHistoryFill } from "react-icons/ri";
import { BiSolidUserDetail } from "react-icons/bi";

export const Breadcrumbs:React.FC = () => {
    const location = useLocation();

    const showBreadcrumbs = () => {
        if(location.pathname === '/dashboard'){
            return (
                <Breadcrumb
                    items={[{
                        href: '/dashboard',
                        title: <HomeOutlined />,
                    },
                    {
                        title: 'Dashboard',
                    }]}
                />
            )
        }
        else if(location.pathname === '/dashboard/capture-face'){
            return (
                <Breadcrumb
                    items={[
                        {
                            href: '/dashboard',
                            title: <HomeOutlined />,
                            
                        },
                        {
                            title: 
                                <div className='flex items-center gap-2'>
                                    <LuScanFace />
                                    <span>Face Recognition</span>
                                </div>,
                        },
                        
                    ]}
                />
            )
        }
        else if(location.pathname === '/dashboard/transaction-history'){
            return (
                <Breadcrumb
                    items={[
                        {
                            href: '/dashboard',
                            title: <HomeOutlined />,
                            
                        },
                        {
                            title: 
                                <div className='flex items-center gap-2'>
                                    <RiFileHistoryFill />
                                    <span>Transaction History</span>
                                </div>,
                        },
                        
                    ]}
                />
            )
        }
        else if(location.pathname === '/dashboard/tracking-record/employee-profile'){
            return (
                <Breadcrumb
                    items={[
                        {
                            href: '/dashboard',
                            title: <HomeOutlined />,
                        },
                        {
                            title: 'Dashboard',
                        },
                        {
                            href: '/tracking-record/employee-profile',
                            title: 
                                <div className='flex items-center gap-2'>
                                    <PiUserListLight />
                                    <span>Attendance Record</span>
                                </div>,
                        }
                    ]}
                />
            )
        }
        else if(location.pathname === '/dashboard/tracking-record/attendance-record'){
            return (
                <Breadcrumb
                    items={[
                        {
                            href: '/dashboard',
                            title: <HomeOutlined />,
                        },
                        {
                            title: 'Dashboard',
                        },
                        {   
                            href: '/tracking-record/attendance-record',
                            title: 
                                <div className='flex gap-2'>
                                    <FileTextOutlined />
                                    <span>Attendance Record</span>
                                </div>,
                        }
                    ]}
                />
            )
        }
        else if(location.pathname === '/dashboard/attendance-record/profile-stats/:id'){
            return (
                <Breadcrumb
                    items={[
                        {
                            href: '/dashboard',
                            title: <HomeOutlined />,
                        },
                        {
                            title: 'Dashboard',
                        },
                        {   
                            href: '/tracking-record/attendance-record',
                            title: 
                                <div className='flex gap-2'>
                                    <FileTextOutlined />
                                    <span>Attendance Record</span>
                                </div>,
                        },
                        {   
                            // href: '/tracking-record/attendance-record',
                            title: 
                                <div className='flex items-center gap-2'>
                                    <BiSolidUserDetail />
                                    <span>Profile Statistics</span>
                                </div>,
                        }
                    ]}
                />
            )
        }
        else if(location.pathname === '/dashboard/monitoring-control/new-teacher'){
            return (
                <Breadcrumb
                    items={[
                        {
                            href: '/dashboard',
                            title: <HomeOutlined />,
                        },
                        {
                            title: 'Monitoring Control',
                        },
                        {
                            href: '/monitoring-control/new-teacher',
                            title: 
                                <div className='flex gap-2'>
                                    <UserAddOutlined />
                                    <span>New Teacher</span>
                                </div>,

                        }
                    ]}
                />
            )
        }
    }

    return showBreadcrumbs()
}
