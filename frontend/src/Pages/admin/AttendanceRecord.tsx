import React from 'react'
import { AttendanceTable } from '../../components/Table/AttendanceTable';
import { useOutletContext } from 'react-router-dom';
import { useAttendanceRecord } from '../../Store/ManagementState';

type loadingType = {
    loading: boolean;
}

const AttendanceRecord:React.FC = () => {
    const attendanceRecord = useAttendanceRecord(state => state.attendanceRecord);
    const {loading} = useOutletContext<loadingType>();
  return (
    <div>
        <AttendanceTable loading={loading} data={attendanceRecord}/>
    </div>
  )
}

export default AttendanceRecord;
