import React from 'react'
import { useFormDataStore } from '../../Store/ManagementState';
import { UploadChangeParam } from 'antd/es/upload'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Upload, Input } from 'antd'
import { useFormStore } from '../../Store/ManagementState'


type userNose = {
  imageupload: Blob[];
}

export const RegisterNose:React.FC = () => {
    const setIncrementStep = useFormStore(state => state.setIncrementStep);
    const setDecrementStep = useFormStore(state => state.setDecrementStep);
    const updateFormData = useFormDataStore((state) => state.updateFormData);
    const formData = useFormDataStore(state => state.formData);
    const userName = formData.first_name;

    const onFinish = (values : userNose) => {

    const nose = values.imageupload[0];
    updateFormData({
        nose: nose
    });
    setIncrementStep();
    }

    
    const handleFileChange = (info: UploadChangeParam) => {
        if (info.file.status === 'done') {
            console.log('Uploaded file:', info.file);
        }
    };
    
  return (
    <div className='flex flex-col items-center justify-center'>
        <div className='my-10'>
            <h1 className='text-secondary font-secondary text-xl'>Upload the nose of selected teacher</h1>
        </div>
        <Form
            name="basic"
            className='w-[20rem]'
            layout='vertical'
            defaultValue={userName}
            style={{
            maxWidth: 600
        }}
            onFinish={onFinish}
            autoComplete="off"
            >
            <Form.Item
            name="firstname"
            >
            <Input placeholder='Firstname' defaultValue={userName} readOnly/> 
            </Form.Item>
            
            <Form.Item
            label="Nose Image"
            name="imageupload"
            className='flex items-center justify-center w-full'
            valuePropName="fileList"
            getValueFromEvent={(e) =>
                e.fileList.map((file: any) => file.originFileObj)
                }
            >
            
            <Upload
            listType="picture"
            accept="image/*"
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
                // loading={loading}
                type="default" 
                htmlType="submit"
                className='bg-primary w-full hover:bg-secondary text-white hover:text-white'>
                Next  
            </Button>
            <Button
                type="default" 
                onClick={setDecrementStep}
                className='bg-white border border-transparent w-full mt-2 hover:border hover:border-primary text-primary'>
                Back 
            </Button>
        </Form>
        
    </div>
  )
}
