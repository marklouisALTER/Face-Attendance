import React, { useState } from 'react'
import { Switch, Form, Input, Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { SlLogout } from 'react-icons/sl'
import { AiFillSave } from 'react-icons/ai'
import { useTeacherIdentity, useUpdateModal, useUserSessionStore } from '../../Store/ManagementState'
import { UploadFileStatus } from 'antd/es/upload/interface'
import axios from 'axios'
import { StatusModal } from './StatusModal'
type updateTeacher = {
  employee_id: string;
  first_name: string;
  last_name: string;
  face_image: string;
  imageupload: Blob[];
}

export const UpdateTeacher:React.FC = () => {
  const [statusModalMessage, setStatusModalMessage] = useState<{title: string, message: string}>({
    title: '',
    message: ''
  })
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const setUpdateModal = useUpdateModal(state => state.setUpdateModal);
  const teacher = useTeacherIdentity(state => state.teacher)
  const token = useUserSessionStore(state => state.formSession['token']);

  const [form] = Form.useForm();

  const fileList = [
    {
      uid: '-1',
      name: 'face_image.png',
      status: 'done' as UploadFileStatus, // Make sure 'status' is of type UploadFileStatus
      url: `data:image/png;base64,${teacher.face_image}`,
      thumbUrl: `data:image/png;base64,${teacher.face_image}`,
    }
  ];
  

  const onSuccess = async (values: updateTeacher) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('first_name', values.first_name);
    formData.append('last_name', values.last_name);
  
    if (values.imageupload && values.imageupload.length > 0) {
      const image = values.imageupload[0];
      formData.append('file', image, image.name);
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/teachers/update-teacher-profile?employee_id=${values.employee_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authentication': token
        },
        withCredentials: true
      });
      
      setStatusModal(true);
      setLoading(false);
      setStatusModalMessage({
        title: response.data.title,
        message: response.data.message
      });
      setIsSuccess(true);
    } catch (err: any) {
      setStatusModal(true);
      setLoading(false);
      setStatusModalMessage({
        title: err.response.data.title,
        message: err.response.data.message
      });
    }
  };
  

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  }

  const handleFileChange = (info: any) => {
    if (info.file.status === 'done') {
      console.log('Uploaded file:', info.file);

      // Set the uploaded file in the form values
      form.setFieldsValue({
        imageupload: [info.file.originFileObj],
      });
    }
  };
  
  const handleUpdateClick = () => {
    form.setFieldsValue({
      imageupload: form.getFieldValue('imageupload'),
    });
  };

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
            form={form}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            layout="horizontal"
            disabled={componentDisabled}
            style={{
              maxWidth: 600,
            }}
            onFinish={onSuccess}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
          >

                <Form.Item 
                  label="Emp_ID"
                  name="employee_id"
                  initialValue={teacher.employee_id}
                  hidden
                  rules={[
                    {
                      required: true,
                      message: 'Please input the Employee_id!',
                    },
                  ]}
                  >
                  <Input/>
              </Form.Item>
                <Form.Item 
                  label="First Name"
                  name="first_name"
                  initialValue={teacher.first_name}
                  rules={[
                    {
                      required: true,
                      message: 'Please input the First Name!',
                    },
                  ]}
                  >
                  <Input/>
              </Form.Item>
                <Form.Item 
                  label="Last Name"
                  name="last_name"
                  initialValue={teacher.last_name}
                  rules={[
                    {
                      required: true,
                      message: 'Please input the Last Name!',
                    },
                  ]}
                  >
                  <Input/>
              </Form.Item>
              <Form.Item
                  label="Face Image"
                  name="imageupload"
                  valuePropName="fileList"
                  getValueFromEvent={(e) =>
                    e.fileList.map((file:any) => file.originFileObj)
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please re-insert the image again!',
                    },
                  ]}
                >
                  <Upload
                    listType="picture"
                    defaultFileList={[...fileList]}
                    onChange={handleFileChange}
                    accept="image/*"
                    name="file"
                  >
                  <Button 
                    icon={<UploadOutlined />}
                  >
                    Upload
                  </Button>

                </Upload>
                </Form.Item>

                  <div className='flex gap-2 justify-end mt-10'>
                  <Button
                    type='primary'
                    onClick={() => setUpdateModal(false)}
                    disabled={componentDisabled}
                    className={`${componentDisabled ? 'bg-gray-500' : 'bg-white hover:bg-white'} text-primary hover:text-secondary cursor-pointer flex gap-2 items-center`}
                    >
                      <SlLogout/>
                      Go back
                    </Button>
                    <Button
                      type='primary'
                      loading={loading}
                      htmlType='submit'
                      className={`${componentDisabled ? 'bg-gray-500' : 'bg-primary hover:bg-optional'} text-white cursor-pointer flex gap-2 items-center`}
                      disabled={componentDisabled}
                      onClick={handleUpdateClick}
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
