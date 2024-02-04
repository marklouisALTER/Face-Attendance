import React, { useRef, useEffect, useState } from 'react';
import logo from '../../../../backend/temp/detected_features.jpg';
import { FaCamera } from "react-icons/fa";
import { MdCamera } from "react-icons/md";
import { LuScanFace } from "react-icons/lu";
import { BsCameraVideoOffFill } from "react-icons/bs";
import { FaCircleExclamation } from "react-icons/fa6";
import axios from 'axios'
import { FaUserAlt } from "react-icons/fa";
import { Image, Progress, Spin, Button } from 'antd';
import { StatusModal } from '../../components/Modal/StatusModal';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs';


const Capture:React.FC = () => {
    // const [imageFile, setImageFile] = useState(null);
    // const [detectedImage, setDetectedImage] = useState<string | null>(null);
    const [imageFileWillSent, setImageFileWillSent] = useState<string | null>(null);
    const [overallAccuracy, setOverallAccuracy] = useState<string | null>(null);
    const [employeeId, setEmployeeId] = useState<number | null>(null);
    const [firstname, setFirstName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [attendanceLoading, setAttendanceLoading] = useState<boolean>(false);
    const [featureAccuracies, setFeatureAccuracies] = useState(null);
    const [isAttendanceSuccess, setIsAttendanceSuccess] = useState<boolean>(false);
    const [showTransactionId, setShowTransactionId] = useState<number | null>();
    const [lastName, setLastName] = useState<string | null>();
    const [errorStatus, setErrorStatus] = useState<boolean>(false);
    const [statusModalMessage, setStatusModalMessage] = useState<{title: string, message: string}>({
        title: '',
        message: ''
    })

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);


    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = videoRef.current;
        if (video) {
            video.srcObject = stream;
        }
        setIsCameraOpen(true);
        } catch (error) {
            setErrorStatus(true);
            setStatusModalMessage({
                title: 'Camera Error',
                message: 'Camera is not found or available.'
            })
        }
    };
    
    const stopCamera = () => {
        const video = videoRef.current;
        if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        const tracks = stream.getTracks();
    
        tracks.forEach((track) => {
            track.stop();
        });
    
        video.srcObject = null;
        setIsCameraOpen(false);
        }
    };

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
    
        if (video && canvas) {
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        // You can get the captured image as a data URL
        const imageDataURL = canvas.toDataURL('image/png');
        // console.log('Captured Image:', imageDataURL);
        setImageFileWillSent(imageDataURL);
        }
    };

    const handleDetectFaces = async () => {
        setLoading(true);
        if (imageFileWillSent === null) {
            // Handle the case where imageFileWillSent is null
            return;
        }
        const formData = new FormData();
        formData.append('file', dataURLtoBlob(imageFileWillSent));
        
        try{

        const response = await axios.post('http://localhost:5000/face_recognition/detect_faces', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            // const blob = new Blob([response.data.image_path], { type: 'image/jpeg' });
            // setDetectedImage(URL.createObjectURL(blob));
            setOverallAccuracy(response.data.overall_percentage);
            setFeatureAccuracies(response.data.feature_accuracies);
            setEmployeeId(response.data.employee_id);
            setFirstName(response.data.first_name);
            setLastName(response.data.last_name);
            setShowTransactionId(response.data.transaction_id)
        }catch(error: any) {
            setLoading(false);
            setErrorStatus(true);
            setStatusModalMessage({
                title: error.response.data.title,
                message: error.response.data.message
            })
        }
    };

    const colorAccuracy = {
        Color: overallAccuracy && Number(overallAccuracy) > 76 ? 'green' : 'red',
        textPrompt: overallAccuracy && Number(overallAccuracy) > 76 ? 'Perfectly Matched' : 'High Similarity',
    };

    const dataURLtoBlob = (dataURL: string) => {
        const arr = dataURL.split(',');
        const matchResult = arr[0].match(/:(.*?);/);
    
        if (matchResult === null) {
            throw new Error('Invalid dataURL format');
        }
    
        const mime = matchResult[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
    
        return new Blob([u8arr], { type: mime });
    };
    

    const submitAttendance = async() => {
        setAttendanceLoading(true)
        const requestData = {
            employeeId: employeeId,
            full_name: firstname + ' ' + lastName,
        }
        try{
            const response = await axios.post('http://localhost:5000/attendance/record-attendance', requestData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            setErrorStatus(true)
            setStatusModalMessage({
                title: response.data.title,
                message: response.data.message,
            })
            setAttendanceLoading(false)
            setIsAttendanceSuccess(true)
        }catch(err: any){
            setErrorStatus(true)
            setStatusModalMessage({
                title: err.response.data.title,
                message: err.response.data.message,
            })
            setAttendanceLoading(false)
        }

    }

  return (
        featureAccuracies ? (
            <div className='w-full h-screen'>
            <Breadcrumbs />
                <div className='grid grid-cols-1 md:grid-cols-3'>
                <div className='w-full h-full p-5'>
                    <h1 className='font-primary text-2xl text-blue-700 font-bold'>Attendance Result</h1>
                    <h1 className='font-secondary text-xl mt-10 font-semibold text-gray-700'>Employee Information :</h1>
                    <h1 className='font-secondary mt-5'>Transaction ID : {showTransactionId}</h1>
                    <div className='flex flex-col items-center mt-5 justify-center'>
                        <div className='p-10 border-2 bg-gray-100 rounded-xl'>
                            <Image 
                                className='w-full h-full object-cover rounded-md'
                                src={logo} 
                                alt="Detected Face" 
                            />
                        </div>
                        <div className='mt-10 w-full grid grid-cols-4 gap-1'>
                            <div className='col-span-1 bg-gray-100 border-2 rounded-tl-xl rounded-bl-xl flex items-center justify-center'>
                                <FaUserAlt className='text-3xl text-primary'/>
                            </div>
                            <div className=' col-span-3 flex flex-col bg-gray-100 p-2 border-2 rounded-tr-xl rounded-br-xl'>
                                <h1 className='font-secondary text-xl text-gray-600'>Employee Name</h1>
                                <div className='flex items-center gap-2'>
                                    <h1 className='text-2xl font-primary font-bold mt-1 text-primary'>{firstname ? firstname : 'No Last Name'}</h1>
                                    <h1 className='text-2xl font-primary font-bold mt-1 text-primary'>{lastName ? lastName : 'No Last Name'}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-2 w-full h-full p-5 md:mt-10'>
                    <h1 className='font-secondary text-xl mt-10 font-semibold text-gray-700'>Face Accuracy :</h1>
                    <div className='flex flex-col items-center'>
                        <div className='mt-10 w-full grid grid-cols-2 gap-5'>
                            {/* <h1 className='font-secondary text-xl text-gray-600'>Eyebrows Accuracy Matched</h1>
                            <Progress percent={99} /> */}
                                {featureAccuracies && Object.keys(featureAccuracies).map((feature) => (
                                    <div className='flex flex-col bg-gray-100 p-3 border-2 rounded-xl'>
                                        <h1 className='font-secondary text-sm md:text-xl text-gray-600'>{feature}</h1>
                                        <Progress percent={featureAccuracies[feature]} />
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className='mt-10'>
                        <div className='p-5 flex flex-col md:flex-row justify-evenly'>
                            <div className='flex flex-col gap-5 items-center'>
                                <h1 className='font-secondary text-xl font-semibold text-gray-700'>Overall Accuracy</h1>
                                <div className='flex items-center gap-20 '>
                                    <Progress 
                                        strokeColor={{
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }}
                                        type='dashboard' 
                                        percent={Number(overallAccuracy) ?? 0} 
                                    />
                                    <div className='flex items-center gap-3'>
                                        <div className={`w-3 h-3 bg-${colorAccuracy.Color}-500 rounded-full`}></div>
                                        <h1 className={`text-2xl text-${colorAccuracy.Color}-500`}>{colorAccuracy.textPrompt}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-center items-end  md:justify-end md:mt-5'>
                                {/* <h1 className='font-secondary text-xl font-semibold text-gray-700'>Button Functionality</h1> */}
                                <div className='flex mt-5 gap-5'>
                                    <Button 
                                    type="default"
                                    size="large"
                                    loading={attendanceLoading} 
                                    className='bg-primary rounded-md text-white font-primary
                                    transition-all delay-50 ease-in-out hover:bg-blue-600 focus:outline-none
                                    focus:ring focus:ring-blue-300 text-sm'
                                    onClick={() => {
                                        submitAttendance()
                                        
                                    }}
                                    >Add to attendance
                                    </Button>
                                    <button className='bg-primary px-5 py-2 rounded-md text-white font-primary
                                    transition-all delay-50 ease-in-out hover:bg-blue-600 focus:outline-none
                                    focus:ring focus:ring-blue-300'
                                    onClick={() => {
                                        setFeatureAccuracies(null)
                                        setLoading(false)
                                        
                                    }}
                                    >Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            {errorStatus &&
                <StatusModal 
                    title={statusModalMessage.title}
                    comment={statusModalMessage.message}
                    toggle={() => {
                        setErrorStatus(false)
                        if(isAttendanceSuccess){
                            window.location.reload()
                        }
                    }}
                />
            }
        </div>
        ) : 
        (
        <div className='w-full h-screen'>
            <Breadcrumbs />
            <div className='p-5 flex flex-col items-center w-full h-screen'>
                
                <h1 className='my-10 font-primary font-semibold text-primary text-xl'>Face Recognition Image Capture Section</h1>
                <div className='relative'>
                    <video
                        ref={videoRef}
                        width="640" 
                        height="480"
                        autoPlay
                        playsInline
                        style={{ transform: 'scaleX(-1)' }}
                        className='border-2 rounded-md'
                    />
                    <BsCameraVideoOffFill className={`${isCameraOpen ? "hidden": "block"} absolute inset-0 
                    text-gray-400 text-8xl m-auto`}/>
                </div>
                
                <canvas
                    ref={canvasRef}
                    style={{ position: 'absolute', top: 0, right: 0 }}
                />
                <div className='flex gap-[60px] mt-10'>
                    <div className='relative'>
                        <button className='group border p-5 rounded-full border-primary hover:bg-primary
                        transition-all delay-50 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-200' onClick={startCamera}>
                            <FaCamera className='text-3xl text-primary group-hover:text-white'/>
                        </button>
                        <FaCircleExclamation className={`${isCameraOpen ? "hidden": "block"} absolute top-0 right-0 text-xl 
                        text-orange-400`}/>
                    </div>
                    <button className='group bg-primary p-5 rounded-full hover:bg-blue-500
                    transition-all delay-50 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-200' onClick={captureImage}>
                        <MdCamera className='text-3xl text-white'/>
                    </button>
                    <button className='bg-blue-700 p-5 rounded-full hover:bg-blue-900
                    transition-all delay-50 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-200' onClick={handleDetectFaces}>
                        {loading ? 
                            <Spin size='large'/> :
                            <LuScanFace className='text-3xl text-white'/>
                        }
                    </button>
                </div>
                {errorStatus &&
                    <StatusModal 
                        title={statusModalMessage.title}
                        comment={statusModalMessage.message}
                        toggle={() => setErrorStatus(false)}
                    />
                }
            </div>
        </div> 
        )
        
  );
}

export default Capture;