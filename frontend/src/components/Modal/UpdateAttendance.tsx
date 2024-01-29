import React,{useState} from 'react'
import { Input,Form,Switch,Button,DatePicker,TimePicker } from 'antd'
import { SlLogout } from 'react-icons/sl'
import { AiFillSave } from 'react-icons/ai'
// import { UploadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import axios from 'axios'
import { useAttendanceModal, useUpdateAttendanceModal, useUserSessionStore } from '../../Store/ManagementState'
import { StatusModal } from './StatusModal';
dayjs.extend(customParseFormat);

type updateAttendance = {
    attendance_id: string;
    employee_id: string;
    full_name: string;
    date: string;
    time_in: string;
    time_out: string;
}

export const UpdateAttendance:React.FC = () => {
    const attendanceInfo = useAttendanceModal(state => state.attendanceInfo);
    const token = useUserSessionStore(state => state.formSession['token']);
    const setUpdateAttendanceModal = useUpdateAttendanceModal(state => state.setUpdateAttendanceModal); 
    const removeAttendanceInfo = useAttendanceModal(state => state.removeAttendanceInfo);
    const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
    const [statusModal, setStatusModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [statusModalMessage, setStatusModalMessage] = useState<{title: string, message: string}>({
        title: '',
        message: ''
    })
    const [form] = Form.useForm();

    const onSuccess = async(values: updateAttendance) => {
        const formattedTimeIn = dayjs(values.time_in).format('HH:mm:ss')
        const formattedOut = dayjs(values.time_out).format('HH:mm:ss')
        const formattedDate = dayjs(values.date).format('YYYY-MM-DD')

        setLoading(true);
        const formData = new FormData();
        formData.append('attendance_id', values.attendance_id);
        formData.append('employee_id', values.employee_id);
        formData.append('full_name', values.full_name);
        formData.append('date', formattedDate);
        formData.append('time_in', formattedTimeIn);
        formData.append('time_out', formattedOut);

        try {
            const response = await axios.put(`http://localhost:5000/attendance/update-attendance-record/${values.attendance_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authentication': token
                },
                withCredentials: true
            });
        
            setStatusModal(true);
            setStatusModalMessage({
                title: response.data.title,
                message: response.data.message
            });
            setIsSuccess(true);
        } catch (err: any) {
            setStatusModal(true);
            setStatusModalMessage({
                title: err.response.data.title,
                message: err.response.data.message
            });
        }finally{
            setLoading(false);
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50 backdrop-blur-sm">
        <div 
            data-aos="zoom-in"
            data-aos-easing="ease-in-out"
            data-aos-delay="50"
            className="bg-white rounded-md shadow-lg p-4 w-96"
        >
            <h1 className='font-secondary text-md mb-5 text-center font-semibold text-primary italic'>Edit Employee Information</h1>
            <div className='flex items-center gap-2 mb-2'>
            <h1 className='font-optional'>Enable</h1>
                <Switch
                    checkedChildren="ON" unCheckedChildren="OFF"
                    style={{backgroundColor: componentDisabled ? "gray" : ""}}
                    onClick={() => setComponentDisabled(prevState => !prevState)}
                />
            </div>
            <Form
                className='mt-5'
                form={form}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 18,
                }}
                layout="horizontal"
                disabled={componentDisabled}
                // initialValues={attendanceInfo}
                style={{
                    maxWidth: 600,
                }}
                onFinish={onSuccess}
                onFinishFailed={onFinishFailed}
                autoComplete='off'
                >
                    <Form.Item
                        name="employee_id"
                        label="Employee ID"
                        initialValue={attendanceInfo.employee_id}
                        hidden
                        rules={[
                        {
                            required: true,
                            message: "Please enter the employee ID",
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="attendance_id"
                        label="Attendance ID"
                        initialValue={attendanceInfo.attendance_id}
                        hidden
                        rules={[
                        {
                            required: true,
                            message: "Please enter the attendance ID",
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item
                        name="full_name"
                        label="Full Name"
                        initialValue={attendanceInfo.full_name}
                        rules={[
                        {
                            required: true,
                            message: "Please enter a full name",
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    
                    <Form.Item 
                        label="Date"
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: "Please enter a date",
                            },
                            ]}
                    >
                        
                        <DatePicker 
                            defaultValue={dayjs(attendanceInfo.date, 'YYYY-MM-DD')}
                            style={{width: '100%'}}
                        />

                    </Form.Item>
                    <Form.Item 
                        label="Time In"
                        name="time_in"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the Time in",
                            },
                            ]}
                    >
                        
                        <TimePicker 
                            defaultValue={dayjs(attendanceInfo.time_in, 'HH:mm:ss')}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Time Out"
                        name="time_out"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the Time Out",
                            },
                            ]}
                    >
                        
                        <TimePicker 
                            defaultValue={dayjs(attendanceInfo.time_out, 'HH:mm:ss')}
                            style={{width: '100%'}}
                        />
                    </Form.Item>
                    
                    
                <div className='flex gap-2 justify-end mt-10'>
                    <Button
                        type='default'
                        onClick={() => {
                            setUpdateAttendanceModal(false) // close the modal
                            removeAttendanceInfo() // clear the selected attendance record info in state mangement
                        }}
                        disabled={componentDisabled}
                        className={`${componentDisabled ? 'bg-gray-500' : 'bg-white hover:bg-white'} text-primary hover:text-secondary cursor-pointer flex gap-2 items-center`}
                        >
                        <SlLogout/>
                        Go back
                    </Button>
                    <Button
                        type='default'
                        loading={loading}
                        htmlType='submit'
                        className={`${componentDisabled ? 'bg-gray-500' : 'bg-primary hover:bg-optional'} text-white cursor-pointer flex gap-2 items-center`}
                        disabled={componentDisabled}
                        >
                            <AiFillSave />
                            Submit
                    </Button>
                </div>
            </Form>
        </div>

        {statusModal && 
            <StatusModal 
                title={statusModalMessage.title} 
                comment={statusModalMessage.message} 
                toggle={() => {
                    setStatusModal(prevState => !prevState)

                    if(isSuccess){ // it will refresh the page if success after the modal is closed
                        window.location.reload()
                    }
                }}
            />
        }
    </div>
  )
}
