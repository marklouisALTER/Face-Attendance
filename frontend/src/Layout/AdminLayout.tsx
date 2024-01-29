import React from 'react'
import { MainMenu } from '../components/MainMenu/MainMenu'
import { Outlet } from 'react-router-dom'

const AdminLayout:React.FC = () => {
  return (
    <MainMenu>
        <Outlet />
    </MainMenu>
  )
}
export default AdminLayout;