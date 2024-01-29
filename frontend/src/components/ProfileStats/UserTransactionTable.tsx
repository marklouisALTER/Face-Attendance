import React, { useState, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { Table, Button, Input, Space } from 'antd';
import type { GetRef, TableColumnsType, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import { useUserTransaction } from '../../Store/userStateManagement';


type attendanceType = {
    id: number;
    transaction_id: string;
    face_image: string;
    eyebrows_perc: number;
    leyes_perc: number;
    reyes_perc: number;
    nose_perc: number;
    mouth_perc: number;
    create_At: Date;
    overall_perc: number;
}


type InputRef = GetRef<typeof Input>;
type DataIndex = keyof attendanceType;

const UserTransactionTable:React.FC = () => {

const [searchText, setSearchText] = useState('');
const [searchedColumn, setSearchedColumn] = useState('');
const searchInput = useRef<InputRef | null>(null);
const userTransaction = useUserTransaction(state => state.userTransaction);

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
    



    const columns: TableColumnsType<attendanceType> = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'attendance_id',
        width: 50,
        className: 'font-secondary',
    },
    {
        title: 'Emp ID',
        dataIndex: 'employee_id',
        key: 'employee_id',
        width: 100,
        className: 'font-secondary text-center',
    },
    {
        title: 'Transaction Id',
        dataIndex: 'transaction_id',
        key: 'transaction_id',
        width: 200,
        className: 'font-secondary',
        ...getColumnSearchProps('transaction_id'),
        sorter: (a, b) => a.transaction_id.length - b.transaction_id.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Face Image Path',
        dataIndex: 'face_image',
        key: 'face_image',
        width: 300,
        className: 'font-secondary text-center',
    },
    {
        title: <h1 className='text-center'>Eyebrows %</h1>,
        dataIndex: 'eyebrows_perc',
        width: 100,
        key: 'eyebrows_perc',
        className: 'font-secondary text-center',
    },
    {
        title:  <h1 className='text-center'>Left Eye %</h1>,
        dataIndex: 'leyes_perc',
        width: 100,
        key: 'leyes_perc',
        className: 'font-secondary'
    },
    {
        title:  <h1 className='text-center'>Right Eye %</h1>,
        dataIndex: 'reyes_perc',
        width: 100,
        key: 'reyes_perc',
        className: 'font-secondary text-center'
    },
    {
        title:  <h1 className='text-center'>Nose %</h1>,
        dataIndex: 'nose_perc',
        width: 100,
        key: 'nose_perc',
        className: 'font-secondary text-center'
    },
    {
        title:  <h1 className='text-center'>Mouth %</h1>,
        dataIndex: 'mouth_perc',
        width: 100,
        key: 'mouth_perc',
        className: 'font-secondary text-center'
    },
    {
        title:  <h1 className='text-center'>Date</h1>,
        dataIndex: 'created_at',
        width: 100,
        key: 'created_at',
        className: 'font-secondary text-center'
    },
    {
        title:  <h1 className='text-center'>Overall %</h1>,
        dataIndex: 'overall_perc',
        width: 100,
        key: 'overall_perc',
        className: 'font-secondary text-center'
    },
    ];
    return (
        <div>
            <Table
                columns={columns}
                dataSource={userTransaction}
                pagination={{ position: ['bottomCenter'] }}
                scroll={{ x: 1000 }}
                bordered
            />
        </div>
    )
}
export default UserTransactionTable;