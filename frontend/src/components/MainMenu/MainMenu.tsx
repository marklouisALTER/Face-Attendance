import React, {useState} from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import Sider from 'antd/es/layout/Sider'
import { Content, Header } from 'antd/es/layout/layout'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoExit } from "react-icons/io5";
import { AiFillDashboard } from "react-icons/ai";
import { Authentication } from '../../Authentication/Authentication'
import { IoReceiptSharp } from "react-icons/io5";
import { RiFolderUserFill } from "react-icons/ri";
import { RiFileUserFill } from "react-icons/ri";
import { PiUsersFill, PiUserCirclePlusFill  } from "react-icons/pi";
import { RiFileHistoryFill } from "react-icons/ri";
import { LuScanFace } from "react-icons/lu";

type MainMenuProps = {
    children: React.ReactNode
}

export const MainMenu:React.FC<MainMenuProps> = ({children}) => {

    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const { logout } = Authentication();


    return (
    <div>        
        <Layout className='w-full h-full'>
            <Header className='bg-primary flex justify-between items-center px-4'>
                <h1 className='text-white font-secondary text-2xl'>Resibo Pilipinas</h1>
                
            </Header>
            <Layout>
                <Sider theme='light' className='relative border-2 py-10' width={250} collapsed={collapsed}>
                    <button 
                    className='group absolute w-10 h-10 border-1 bg-white rounded-md shadow-md shadow-spread-xl flex items-center 
                    justify-center shadow-gray-300 right-[-20px] top-0 hover:bg-gray-300 hover:cursor-pointer transition-all delay-50 ease-in-out'
                    onClick={()=> setCollapsed(prevState => !prevState)}>
                        {collapsed ? 
                            <IoIosArrowForward className='text-xl text-primary'/>
                            :
                            <IoIosArrowBack className='text-xl text-primary'/>
                        }
                    </button>
                    <Menu
                        mode='inline'
                        defaultSelectedKeys={['dashboard']}
                        items={[
                        {
                            label: "Dashboard",
                            key: "dashboard",
                            icon: <AiFillDashboard/>,
                            style: {color: "#003554"},
                            onClick: () => {navigate('.')}
                        },
                        {
                            label: "Face Attendance",
                            key: "face_attendance",
                            icon: <LuScanFace />,
                            style: {color: "#003554"},
                            onClick: () => {navigate('capture-face')}
                        },
                        {
                            label: "Tracking Records",
                            key: "tracking_records",
                            style: {color: "#003554"},
                            icon: <IoReceiptSharp />,
                            children: [
                                {
                                    label: "Employee Data",
                                    key: "employee_data",
                                    icon: <RiFolderUserFill />,
                                    style: {color: "#003554"},
                                    onClick: () => {navigate('tracking-record/employee-profile')}
                                },
                                {
                                    label: "Attendance Record",
                                    key: "attendance_record",
                                    icon: <RiFileUserFill/>,
                                    style: {color: "#003554"},
                                    onClick: () => {navigate('tracking-record/attendance-record')}
                                }
                            ]
                        },
                        {
                            label: "Monitoring and Control",
                            key: "monitioring-and-control",
                            style: {color: "#003554"},
                            icon: <PiUsersFill/>,
                            children: [{
                                label: "New Teacher",
                                key: "new_teacher",
                                style: {color: "#003554"},
                                icon: <PiUserCirclePlusFill  />,
                                onClick: () => {navigate('monitoring-control/new-teacher')}
                            }]
                        },
                        {
                            label: "Transaction History",
                            key: "transaction-history",
                            icon: <RiFileHistoryFill />,
                            style: {color: "#003554"},
                            onClick: () => {navigate('transaction-history')}
                        },
                        {
                            label: "Logout",
                            key: "logout",
                            style: {color: "#003554"},
                            icon: <IoExit/>,
                            onClick: () => {
                                logout()
                                navigate('/')
                            }
                        },
                        
                    
                    ]}/>
                </Sider>
                <Content className='p-5'>
                    {children}
                </Content>
            </Layout>
        </Layout>
    </div>
  )
}
