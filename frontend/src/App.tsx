import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SignIn } from './Pages/SignIn'
import { lazy, Suspense } from 'react'
import { Spin } from 'antd'
import { UserAttendanceTable } from './components/ProfileStats/UserAttendanceTable'
import { UserPhotos } from './components/ProfileStats/UserPhotos'
const Dashboard = lazy(() => import('./Pages/admin/Dashboard'))
const AdminLayout = lazy(() => import('./Layout/AdminLayout'))
const NewTeacher = lazy(() => import('./Pages/admin/NewTeacher'))
const TeacherProfile = lazy(() => import('./Pages/admin/TeacherProfile'))
const AttendanceRecord = lazy(() => import('./Pages/admin/AttendanceRecord'))
const Capture = lazy(() => import('./Pages/admin/Capture'))
const TransactionHistory = lazy(() => import('./Pages/admin/TransactionHistory'))
const TeacherProfileLayout = lazy(() => import('./Layout/TeacherProfileLayout'))
const UserTransactionTable = lazy(() => import('./components/ProfileStats/UserTransactionTable'))
const AttendanceRecordLayout = lazy(() => import('./Layout/AttendanceRecordLayout'))
function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<AdminLayout />} >
          <Route index element={
            <Suspense fallback={<div className='w-full h-screen flex items-center justify-center'><Spin /></div>}>
              <Dashboard />
            </Suspense>
          } 
          />
          <Route path="tracking-record/employee-profile" element={
            <Suspense fallback={<div className='w-full h-screen flex items-center justify-center'><Spin /></div>}>
              <TeacherProfile />
            </Suspense>
          } />
          
          <Route path="tracking-record/attendance-record" element={
            <Suspense fallback={<div className='w-full h-screen flex items-center justify-center'><Spin /></div>}>
              <AttendanceRecordLayout />
            </Suspense>
          }>
            <Route index element={
              <Suspense fallback={<div>Loading...</div>}>
                <AttendanceRecord />
              </Suspense>
            } />
          </Route>
          {/* Viewing employee stats profile */}
          <Route path="attendance-record/profile-stats/:id" element={
            <Suspense fallback={<div>Loading...</div>}>
              <TeacherProfileLayout />
            </Suspense>
          }>
            <Route index element={
              <Suspense fallback={<div>Loading...</div>}>
                <UserTransactionTable />
              </Suspense>
            } />

            <Route path='user-attendance' element={
              <Suspense fallback={<div>Loading...</div>}>
                <UserAttendanceTable />
              </Suspense>
            } />

            <Route path='user-photos' element={
              <Suspense fallback={<div>Loading...</div>}>
                <UserPhotos />
              </Suspense>
            } />
            
          </Route>

          <Route path="monitoring-control/new-teacher" element={
            <Suspense fallback={<div>Loading...</div>}>
              <NewTeacher />
            </Suspense>
          } />
          <Route path="capture-face" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Capture />
            </Suspense>
          } />
          <Route path="transaction-history" element={
            <Suspense fallback={<div>Loading...</div>}>
              <TransactionHistory />
            </Suspense>
          } />
        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
