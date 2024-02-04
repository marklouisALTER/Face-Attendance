import React, { useState, useRef } from 'react';
import { Table, Button, Input, Space, Popconfirm } from 'antd';
import type { GetRef, TableColumnsType, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Highlighter from 'react-highlight-words';
import { useAttendanceModal, useAttendanceRecord, useUpdateAttendanceModal, useUserSessionStore } from '../../Store/ManagementState';
import { StatusModal } from '../Modal/StatusModal';
import axios from 'axios';

type attendanceType = {
  attendance_id: number;
  employee_id: number;
  full_name: string;
  date: string;
  time_in: string;
  time_out: string;
}

type attendanceTypeProps = {
  data: attendanceType[];
  loading: boolean;
}

type InputRef = GetRef<typeof Input>;
type DataIndex = keyof attendanceType;

export const AttendanceTable:React.FC<attendanceTypeProps> = ({data, loading}) => {
  const token = useUserSessionStore(state => state.formSession['token']);
  const setUpdateAttendanceModal = useUpdateAttendanceModal(state => state.setUpdateAttendanceModal);
  const updateAttendanceInfo = useAttendanceModal(state => state.updateAttendanceInfo);
  const updateAttendanceRecord = useAttendanceRecord(state => state.updateAttendanceRecord);
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const [statusModalMessage, setStatusModalMessage] = useState<{title: string, message: string}>({
      title: '',
      message: ''
  })
    

  const handleDelete = async (attendance_id: number) => {
    try{
      const response = await axios.delete(`http://localhost:5000/attendance/delete-attendance?attendance_id=${attendance_id}`, {
        headers:{
          'Authorization': token
        },
        withCredentials: true
      })
      setStatusModalMessage({
        title: response.data.title,
        message: response.data.message
      })
      // setIsSuccess(true)
      setStatusModal(true)

      updateAttendanceRecord(
        data.filter((record) => record.attendance_id !== attendance_id)
      )

    }catch(err: any){
      setStatusModalMessage({
        title: err.response.data.title,
        message: err.response.data.message
      })
      setStatusModal(true)
    }
  }
  
  const handleUpdate = (record: attendanceType) => {
      updateAttendanceInfo(record);
      setUpdateAttendanceModal(true);
  }

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef | null>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<attendanceType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="default"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const columns: TableColumnsType<attendanceType> = [
    {
        title: 'No.',
        dataIndex: 'attendance_id',
        key: 'attendance_id',
        width: 50,
        className: 'font-secondary',
    },
    {
        title: 'Employee ID',
        dataIndex: 'employee_id',
        key: 'employee_id',
        width: 100,
        className: 'font-secondary',
    },
    {
        title: 'Full Name',
        dataIndex: 'full_name',
        key: 'full_name',
        width: 150,
        className: 'font-secondary',
        ...getColumnSearchProps('full_name'),
        sorter: (a, b) => a.full_name.length - b.full_name.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Date',
        dataIndex: 'date',
        width: 150,
        key: 'date',
        className: 'font-secondary',
        ...getColumnSearchProps('date'),
    },
  
    {
        title: 'Time In',
        dataIndex: 'time_in',
        width: 150,
        key: 'time_in',
        className: 'font-secondary'
      },
    {
        title: 'Time Out',
        dataIndex: 'time_out',
        width: 150,
        key: 'time_out',
        className: 'font-secondary'
    },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        className: 'font-secondary',
        width: 100,
        render: (record) => (
            <span className='flex-col md:flex-row'>
                <Button 
                    size="small" 
                    onClick={() => handleUpdate(record)}
                    className='mr-0 md:mr-1 text-blue-500 border border-blue-500' >
                        <MdEdit />
                </Button>
                <Popconfirm 
                  title="Sure to delete?" 
                  onConfirm={() => handleDelete(record.attendance_id)}
                  okType='danger'
                >
                    <Button 
                      type="primary" 
                      danger 
                      size="small"
                      >
                      <MdDelete />
                    </Button>
                </Popconfirm>
                
            </span>
        )
    },
];


  return (
    <>
      <Table
        title={() => <h1 className='text-xl font-bold text-primary font-secondary'>Attendance Record</h1>}
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ y: 1500}}
      />

          {statusModal && 
            <StatusModal
              title={statusModalMessage.title} 
              comment={statusModalMessage.message} 
              toggle={() => {
                setStatusModal(prevState => !prevState)

                // if(isSuccess){ // it will refresh the page if success after the modal is closed
                //   window.location.reload()
                // }
              }}
            />
          }
    </>
  )
}
