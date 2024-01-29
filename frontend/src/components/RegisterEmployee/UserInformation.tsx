import React, { useState } from 'react'
import { UploadChangeParam } from 'antd/es/upload';
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Upload, Input } from 'antd'
import axios from "axios"
import { useFormStore, useUserSessionStore } from '../../Store/ManagementState'
import { StatusModal } from '../Modal/StatusModal';

type userInfo = {
    firstname : string;
    lastname: string;
    imageupload: Blob[];
}


export const UserInformation:React.FC = () => {
    const setIncrementStep = useFormStore(state => state.setIncrementStep);
    // const updateFormData = useFormDataStore((state) => state.updateFormData);
    const token = useUserSessionStore(state => state.formSession['token'])
    const [loading, setLoading] = useState<boolean>(false); // loading state of login button
    const [error, setError] = useState<boolean>(false); // error 
    const [modalMessage, setModalMessage] = useState<{title: string, message: string}>({
      title: "",
      message: ""
    }) 

    console.log(token);

    const onFinish = async (values: userInfo) => {
        setLoading(true);
        // updateFormData({
        //     first_name: values.firstname,
        //     last_name: values.lastname,
        //     face_image: values.imageupload[0] 
        // });
        
        const imageUpload = values.imageupload[0];

        const formData = new FormData();
        formData.append('first_name', values.firstname);
        formData.append('last_name', values.lastname);
        formData.append('face_image', imageUpload, imageUpload.name );

        try{
            const response = await axios.post('http://localhost:5000/teachers/new-teacher', formData, {
                headers: {
                    'Content-Type': `multipart/form-data`,
                    'Authorization': token
                }
            })
            if(response.status === 200){
                setLoading(false);
                setError(true);
                setModalMessage({
                    title: response.data.title,
                    message: response.data.message
                })
            }else{
                setLoading(false);
                setError(true);
                setModalMessage({
                    title: response.data.title,
                    message: response.data.message
                })
            }
        }catch(err: any){
            setLoading(false);
            setError(true); // it will prompt if there is response in the backend
            setModalMessage({
                title: err.response.data.title,
                message: err.response.data.message
            })
        }
    };

    const handleFileChange = (info: UploadChangeParam) => {
        if (info.file.status === 'done') {
            console.log('Uploaded file:', info.file);
        }
    };
  return (
    <div className='flex flex-col items-center justify-center'>
        <div className='my-10'>
            <h1 className='text-secondary font-secondary text-xl'>Employee Information</h1>
        </div>
        <Form
            name="basic"
            className='w-[20rem]'
            layout='vertical'
            style={{
            maxWidth: 600
        }}
            onFinish={onFinish}
            autoComplete="off"
            >
            <Form.Item
            name="firstname"
            rules={[
                {
                required: true,
                message: 'Please input your First Name!',
                },
            ]}
            >
            <Input placeholder='Firstname'/>
            </Form.Item>
            <Form.Item
            name="lastname"
            rules={[
                {
                    required: true,
                    message: 'Please input your Last Name!',
                },
            ]}
            >
            <Input placeholder='Lastname'/>
            </Form.Item> 
            <Form.Item
            label="Face Image"
            name="imageupload"
            className='flex items-center justify-center w-full'
            valuePropName="fileList"
            getValueFromEvent={(e) =>
                e.fileList.map((file: any) => file.originFileObj)
                }
            rules={[
            {
                required: true,
                message: 'Please upload a Face Image!',
            }
            ]}
            >
            
            <Upload
            listType="picture"
            accept="image/*"
            // beforeUpload={() => false} // prevent default upload behavior
            name="imageupload"
            onChange={handleFileChange}
            >
            <Button 
                icon={<UploadOutlined />}>                
                Upload
            </Button>
            </Upload>
            </Form.Item>

            <Button 
                loading={loading}
                type="default" 
                htmlType="submit"
                className='bg-primary w-full hover:bg-secondary text-white hover:text-white'>
                Register  
            </Button>
        </Form>
            <Button
                type="default" 
                htmlType="submit"
                onClick={setIncrementStep}
                className='bg-white border border-transparent w-full mt-2 hover:border hover:border-primary text-primary'>
                Next  
            </Button>
        {error &&
            <StatusModal title={modalMessage.title} comment={modalMessage.message} toggle={()=> {
                setError(prevState => !prevState);
                if(modalMessage.title === 'Success'){
                    setIncrementStep();
                }
            }}/>
        }
    </div>
  )
}
