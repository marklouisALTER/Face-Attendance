import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { Form, Select,Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useFormDataStore, useFormStore, useUserSessionStore } from '../../Store/ManagementState'
import { UploadChangeParam } from 'antd/es/upload'

type userEyeBrows = {
    employee_id: string; 
    employee_name: string;
    imageupload: Blob[];
}


export const RegisterEyebrows:React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [employeeNames, setEmployeeNames] = useState<Array<{ employee_id: string; first_name: string }>>([]);
    const [isSelectedUserName, setIsSelectedUserName] = useState<string | undefined>(undefined);
    const setDecrementStep = useFormStore(state => state.setDecrementStep)
    const setIncrementStep = useFormStore(state => state.setIncrementStep)
    const updateFormData = useFormDataStore((state) => state.updateFormData)
    const token = useUserSessionStore(state => state.formSession['token']);
    const formData = useFormDataStore(state => state.formData);

    useEffect(() => {
        const fetchingData = async () => {
            try {
                    const response = await axios.get('http://localhost:5000/teachers/first-name', {
                        headers: {
                            'Authorization': token
                        }
                    });
                    setEmployeeNames(response.data.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            };
        fetchingData();
    },[])

    console.log(formData)

    const selectedUserName = (value: string) => {
        const selectedEmployeeFname = employeeNames.find(employee => employee.first_name === value)
        if (selectedEmployeeFname) {
          const employeeID = selectedEmployeeFname.employee_id;
          setIsSelectedUserName(employeeID);
        } else {
          setIsSelectedUserName('');
        }
    }
    const onFinish = async (values: userEyeBrows) => {
        const employeeName = values.employee_name;
        const employee_id = isSelectedUserName || '';
        const imageupload = values.imageupload[0];
        
        updateFormData({
            employee_id: employee_id,
            first_name: employeeName,
            eyebrows: imageupload
        })
        setIncrementStep();
    };

    const handleFileChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
        console.log('Uploaded file:', info.file);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='my-10'>
            <h1 className='text-secondary text-center font-secondary text-xl'>Upload the Eyebrows of selected teacher</h1>
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
                name="employee_name"
                className='text-secondary'
                
                label="Select Employee">
            
                <Select
                        placeholder={loading ? 'Loading...' : 'Employee no.'}
                        allowClear
                        disabled={loading}
                        onChange={(value) => selectedUserName(value)}
                    >
                        {employeeNames?.map((employee, index) => (
                        <Select.Option key={index} value={employee.first_name}>
                            {employee.first_name}
                        </Select.Option>
                        ))}
                </Select>
            </Form.Item>
            <Form.Item
            label="Eyebrows Image"
            name="imageupload"
            className='flex items-center justify-center w-full'
            valuePropName="fileList"
            getValueFromEvent={(e) =>
                e.fileList.map((file: any) => file.originFileObj)
                }
            rules={[
            {
                required: true,
                message: 'Please upload a Eyebrows Image!',
            }
            ]}
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
                loading={loading}
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
