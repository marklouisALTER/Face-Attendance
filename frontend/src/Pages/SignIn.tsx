import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import { BiLogInCircle } from 'react-icons/bi'
import axios from 'axios';
import { StatusModal } from '../components/Modal/StatusModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { Authentication } from '../Authentication/Authentication';
import { useUserSessionStore } from '../Store/ManagementState';

type userLogin = {
  username: string;
  password: string;
  remember: boolean;
}

export const SignIn:React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false); // loading state of login button
  const [error, setError] = useState<boolean>(false); // error 
  const [modalMessage, setModalMessage] = useState<{title: string, message: string}>({
    title: "",
    message: ""
  })
  
  const updateSession = useUserSessionStore(state => state.updateSession);
  const location = useLocation();
  const from = location?.state?.from || '/dashboard'; // it will check if there is a state from the location, if there is none, it will go to the dashboard
  const navigate = useNavigate();
  const { login } = Authentication();


  useEffect(() => {
    document.title = 'Sign In'
  },[])

  // Submit the login function
  const onFinish = async (values : userLogin) => {
    const credentials = {
      username: values.username,
      password: values.password,
      remember: values.remember
    } 
    
    try{
      setLoading(true)
      const response = await axios.post('http://localhost:5000/api/login', credentials); 
      
      if(response.status === 200){
        setError(false);
        login({
          user: response.data.username,
          token: response.data.token
        })
        updateSession({ // save the session in zustand state management to avoid prop drilling
          user: response.data.username,
          token: response.data.token
        })

        navigate(from, {replace: true}); // navigate to the admin page 
      }else if(response.status === 401){  
        setError(true);
        setModalMessage({
          title: response.data.title,
          message: response.data.message
        })
      }
    }catch(err: any){
      setError(true);
      setModalMessage({
        title: "Error",
        message: err.response.data.message
      })
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className='w-full h-screen flex flex-col justify-center px-[1rem]'>
        <div className='flex flex-col items-center gap-5'>
          <h1 className='text-2xl font-primary text-center'>WELCOME TO <span className='text-primary font-semibold'>FACE RECOGNITION OF PMCI</span> OF PMCI</h1>
          <h1 className='font-secondary text-xl md:text-2xl text-center'>Login to your Account</h1>
          {location.state?.message &&
            <h1 className='font-secondary text-xl md:text-xl font-bold text-center text-red-500'>{location.state.message}</h1>
          } 
        </div>
          <div className='w-full flex items-center justify-center mt-10'>
            <Form
              name="basic"
              className='w-full font-secondary'
              labelCol={{
                span: 20,
              }}

              style={{
                maxWidth: 300,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout='vertical'
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input className='p-2 rounded-xl'/>
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password className='p-2 rounded-xl'/>
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                  offset: 0,
                  span: 30,
                }}
              >
                <Checkbox
                  >
                    Remember me
                </Checkbox>
              </Form.Item>

              <Form.Item
              >
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className='text-white font-secondary bg-primary w-full flex justify-center items-center gap-2 rounded-xl'
                  icon={<BiLogInCircle />}
                  size='large'
                  loading={loading}
                  >
                  Submit 
                </Button>
              </Form.Item>
            </Form>
        </div>
        {error &&
          <StatusModal title={modalMessage.title} comment={modalMessage.message} toggle={()=> setError(prevState => !prevState)}/>
        }
    </div>
  )
}
