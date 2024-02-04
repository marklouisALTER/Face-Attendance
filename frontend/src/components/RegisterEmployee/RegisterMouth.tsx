import React, { useState } from 'react';
import { useFormDataStore } from '../../Store/ManagementState';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Upload, Input } from 'antd';
import { useFormStore, useUserSessionStore } from '../../Store/ManagementState';
import { StatusModal } from '../Modal/StatusModal';
import axios from 'axios';

type userMouth = {
    imageupload: File[];
};

export const RegisterMouth: React.FC = () => {
    const setDecrementStep = useFormStore((state) => state.setDecrementStep);
    const updateFormData = useFormDataStore((state) => state.updateFormData);
    const token = useUserSessionStore((state) => state.formSession['token']);
    const formDataAll = useFormDataStore((state) => state.formData);
    const userName = formDataAll.first_name;

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<{ title: string; message: string }>({
        title: '',
        message: '',
    });

    const handleFileChange = (info: UploadChangeParam) => {
        if (info.file.status === 'done') {
            console.log('Uploaded file:', info.file);
        }
    };

    console.log(formDataAll);
    const onFinish = async (values: userMouth) => {
        const mouth = values.imageupload[0];
        updateFormData({
            mouth: mouth,
        });

        const formData = new FormData();
        formData.append('employee_id', formDataAll.employee_id);
        formData.append('eyebrows', formDataAll.eyebrows, formDataAll.eyebrows.name);
        formData.append('leyes', formDataAll.leyes, formDataAll.leyes.name);
        formData.append('reyes', formDataAll.reyes, formDataAll.reyes.name);
        formData.append('nose', formDataAll.nose, formDataAll.nose.name);
        formData.append('mouth', mouth, mouth.name);
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/teachers/add-face-part', formData, {
                headers: {
                    'Content-Type': `multipart/form-data`,
                    Authorization: token,
                },
            });
            setLoading(false);
            setError(true);
            setModalMessage({
                title: response.data.title,
                message: response.data.message,
            });
        } catch (err: any) {
            setLoading(false);
            setError(true);
            setModalMessage({
                title: err.response.data.title,
                message: err.response.data.message,
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="my-10">
                <h1 className="text-secondary font-secondary text-xl">Upload the Mouth of selected teacher</h1>
            </div>
            <Form
                name="basic"
                className="w-[20rem]"
                layout="vertical"
                defaultValue={userName}
                style={{
                    maxWidth: 600,
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item name="firstname">
                    <Input placeholder="Firstname" defaultValue={userName} readOnly />
                </Form.Item>

                <Form.Item
                    label="Mouth Image"
                    name="imageupload"
                    className="flex items-center justify-center w-full"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e.fileList.map((file: any) => file.originFileObj)}
                >
                    <Upload listType="picture" accept="image/*" name="imageupload" onChange={handleFileChange}>
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>

                <Button
                    loading={loading}
                    type="default"
                    htmlType="submit"
                    className="bg-primary w-full hover:bg-secondary text-white hover:text-white"
                >
                    Submit
                </Button>
                <Button
                    type="default"
                    onClick={setDecrementStep}
                    className="bg-white border border-transparent w-full mt-2 hover:border hover:border-primary text-primary"
                >
                    Back
                </Button>
            </Form>
            {error && <StatusModal title={modalMessage.title} comment={modalMessage.message} toggle={() => setError((prevState) => !prevState)} />}
        </div>
    );
};
