import React, { useState, useRef } from 'react';
import Highlighter from 'react-highlight-words';
import { Table, Button, Input, Space } from 'antd';
import type { GetRef, TableColumnsType, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import { useUserAttendance } from '../../Store/userStateManagement';


type attendanceType = {
    attendance_id: number;
    employee_id: number;
    full_name: string;
    date: string;
    time_in: string;
    time_out: string;
}

type InputRef = GetRef<typeof Input>;
type DataIndex = keyof attendanceType;

export const UserAttendanceTable:React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef | null>(null);
    const userAttendance = useUserAttendance(state => state.userAttendance);

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
];

    return (
    <div>
    <Table
        title={() => <h1 className='text-xl font-bold text-primary font-secondary'>Attendance Record</h1>}
        columns={columns}
        dataSource={userAttendance}
        pagination={{ position: ['bottomRight'], pageSize: 5 }}
        scroll={{ x: 1000 }}
        bordered
    />
    </div>
)
}
