import React, { useState, useRef } from 'react';
import { Table, Button, Input, Space, Popconfirm } from 'antd';
import type { GetRef, TableColumnsType, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useTeacherIdentity, useUpdateModal, useUserSessionStore } from '../../Store/ManagementState';
import axios from 'axios';
import { StatusModal } from '../Modal/StatusModal';
import Highlighter from 'react-highlight-words';
import { FaSortAmountUp,FaSortAmountUpAlt } from "react-icons/fa";
import { MdSort } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";

type teacherProfile = {
    employee_id: number;
    first_name: string;
    last_name: string;
    face_image: string;
    eyebrows: string;
    lefteye: string;
    righteye: string;
    nose: string;
    mouth: string;
};

interface TeacherTableProps {
    data?: teacherProfile[];
    loading: boolean;
}

type InputRef = GetRef<typeof Input>;
type DataIndex = keyof teacherProfile;

export const TeacherTable: React.FC<TeacherTableProps> = ({ data, loading }) => {
    const [statusModal, setStatusModal] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [statusModalMessage, setStatusModalMessage] = useState<{title: string, message: string}>({
        title: '',
        message: ''
    })
    const setTeacherId = useTeacherIdentity(state => state.setTeacherId)
    const setUpdateModal = useUpdateModal(state => state.setUpdateModal)
    const token = useUserSessionStore(state => state.formSession['token']);


    const handleDelete = async (employee_id: number) => {
      try{
        const response = await axios.delete(`http://localhost:5000/teachers/delete-teacher?employee_id=${employee_id}`, {
          headers:{
            'Authorization': token
          },
          withCredentials: true
        })
        setStatusModalMessage({
          title: response.data.title,
          message: response.data.message
        })
        setIsSuccess(true)
        setStatusModal(true)
      }catch(err: any){
        setStatusModalMessage({
          title: err.response.data.title,
          message: err.response.data.message
        })
        setStatusModal(true)
      }
    }
    
    const handleUpdate = (record: teacherProfile) => {
        setTeacherId(record) 
        setUpdateModal(true);
    }
    

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

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

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<teacherProfile> => ({
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
        setTimeout(() => searchInput.current?.select(), 100);
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



    const columns: TableColumnsType<teacherProfile> = [
        {
            title: 'Id',
            dataIndex: 'employee_id',
            key: 'employee_id',
            width: 30,
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
            width: 150,
            ...getColumnSearchProps('first_name'),
            sorter: (a, b) => a.first_name.length - b.first_name.length,
            sortDirections: ['descend', 'ascend'],
            sortIcon: ({ sortOrder }) => {
                if (sortOrder === 'ascend') {
                  return <FaSortAmountUpAlt className='text-primary'/>;
                } else if (sortOrder === 'descend') {
                  return <FaSortAmountUp className='text-primary'/>;
                } else {
                    return <MdSort />;
                }
            },
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            width: 150,
            key: 'last_name',
            ...getColumnSearchProps('last_name'),
        },
        {
            title: 'Face Image',
            dataIndex: 'face_image',
            width: 150,
            key: 'face_image',
            render: (face_image, record) => (
                <div key={record.first_name} className='flex items-center gap-3'>
                    <a
                        href={`data:image/png;base64,${face_image}`}
                        download={`picture_${record.face_image}.png`} 
                        className='text-primary underline'
                    >
                        Download
                    </a>
                    <a
                        href={`data:image/png;base64,${face_image}`}
                        target='_blank'
                        rel='noreferrer'
                        className='text-primary underline'
                    >
                        View
                    </a>
                </div>
                )
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            align: 'center',
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
                      onConfirm={() => handleDelete(record.employee_id)}
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
            title={() => <h1 className='text-xl font-medium text-primary font-secondary'>All Teacher Table Record</h1>}
            bordered={true}
            loading={loading}
            columns={columns}
            dataSource={data?.map((record) => ({...record, key: record.employee_id}))}
            pagination={{ pageSize: 5 }}
            expandable={{
              expandedRowRender: (record) => <div key={`${record.employee_id}`} className='grid grid-cols-5'>
                <div className='flex flex-col'>
                  <h1 className="font-secondary">Eyebrows</h1>
                  <div className='flex items-center gap-3 m-auto'>
                    <a
                        href={`data:image/png;base64,${record?.eyebrows}`}
                        download={`picture_${record?.eyebrows}.png`} 
                        className='text-primary'
                    >
                        <MdOutlineFileDownload />
                    </a>
                    <a
                        href={`data:image/png;base64,${record?.eyebrows}`}
                        target='_blank'
                        rel='noreferrer'
                        className='text-primary'
                    >
                        <FaRegEye />
                    </a>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <h1 className="font-secondary">Lefteye</h1>
                  <div className='flex items-center gap-3 m-auto'>
                    <a
                        href={`data:image/png;base64,${record?.lefteye}`}
                        download={`picture_${record?.lefteye}.png`} 
                        className='text-primary'
                    >
                        <MdOutlineFileDownload />
                    </a>
                    <a
                        href={`data:image/png;base64,${record?.lefteye}`}
                        target='_blank'
                        rel='noreferrer'
                        className='text-primary'
                    >
                        <FaRegEye />
                    </a>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <h1 className="font-secondary">Righteye</h1>
                  <div className='flex items-center gap-3 m-auto'>
                    <a
                        href={`data:image/png;base64,${record?.lefteye}`}
                        download={`picture_${record?.lefteye}.png`} 
                        className='text-primary'
                    >
                        <MdOutlineFileDownload />
                    </a>
                    <a
                        href={`data:image/png;base64,${record?.lefteye}`}
                        target='_blank'
                        rel='noreferrer'
                        className='text-primary'
                    >
                        <FaRegEye />
                    </a>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <h1 className="font-secondary">Nose</h1>
                  <div className='flex items-center gap-3 m-auto'>
                    <a
                        href={`data:image/png;base64,${record?.nose}`}
                        download={`picture_${record?.nose}.png`} 
                        className='text-primary'
                    >
                        <MdOutlineFileDownload />
                    </a>
                    <a
                        href={`data:image/png;base64,${record?.nose}`}
                        target='_blank'
                        rel='noreferrer'
                        className='text-primary'
                    >
                        <FaRegEye />
                    </a>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <h1 className="font-secondary">Mouth</h1>
                  <div className='flex items-center gap-3 m-auto'>
                    <a
                        href={`data:image/png;base64,${record?.mouth}`}
                        download={`picture_${record?.mouth}.png`} 
                        className='text-primary'
                    >
                        <MdOutlineFileDownload />
                    </a>
                    <a
                        href={`data:image/png;base64,${record?.mouth}`}
                        target='_blank'
                        rel='noreferrer'
                        className='text-primary'
                    >
                        <FaRegEye />
                    </a>
                  </div>
                  {/* <Image src={`data:image/png;base64,${record.mouth}`} /> */}
                  {/* <Image src={` /> */}
                </div>
              </div>,

            }}
            scroll={{ x: 1300 }}
            />
        
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
        </>
    );
};
