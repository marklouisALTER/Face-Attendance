import React, { useEffect, useState } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs';
import axios from 'axios';
import { useTransactionHistory, useUserSessionStore } from '../../Store/ManagementState';
import { TransactionTable } from '../../components/Table/TransactionTable';
import { StatusModal } from '../../components/Modal/StatusModal';

// type transactionHistoryType = {
//     id: number;
//     transaction_id: string;
//     face_image: string;
//     eyerows_perc: number;
//     leyes_perc: number;
//     reyes_perc: number;
//     nose_perc: number;
//     mouth_perc: number;
//     create_At: Date;
//     overall_perc: number;
// }

const TransactionHistory:React.FC = () => {
    const token = useUserSessionStore(state => state.formSession['token'])
    const [loading, setLoading] = useState<boolean>(false);
    const updateTransactionHistory = useTransactionHistory(state => state.updateTransactionHistory);
    const transactionHistory = useTransactionHistory(state => state.transactionHistory);
    const [error, setError] = useState<boolean>(false);
    const [statusModalMessage, setStatusModalMessage] = useState<{title: string, message: string}>({
        title: '',
        message: ''
    })

    useEffect(() => {

        document.title = 'Transaction History | Attendance';

        const getAllTransactionHistory = async () => {
            setLoading(true)
            try{
                const response = await axios.get('http://localhost:5000/transaction/history', {
                headers: {
                    'Authorization': token
                }
                
            })
                updateTransactionHistory(response.data.data)
            }catch(err:any){
                setError(true)
                setStatusModalMessage({
                    title: err.response.data.title,
                    message: err.response.data.message
                })
            }finally{
                setLoading(false)
            }
        }
        getAllTransactionHistory();
    },[token])
    return(
    <div className='w-full h-screen'>
        <Breadcrumbs />
        <div className='mt-10'>
            <TransactionTable data={transactionHistory} loading={loading}/>
        </div>

        {error &&
            <StatusModal 
                title={statusModalMessage.title} 
                comment={statusModalMessage.message} 
                toggle={() => setError(prevState => !prevState)}
            />
            }
    </div>
    )
}
export default TransactionHistory;