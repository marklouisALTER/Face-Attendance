import React, { useEffect, useState } from 'react';
import { Authentication } from '../../Authentication/Authentication';
import { useNavigate, useLocation } from 'react-router-dom';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Alert, Calendar } from 'antd';
import Chart from 'react-apexcharts';
import { heatmapData } from '../../components/Graph/GraphLabel';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = Authentication();
  const navigate = useNavigate();
  const location = useLocation();

  const [value, setValue] = useState<Dayjs>(dayjs());
  const [selectedValue, setSelectedValue] = useState<Dayjs>(dayjs());

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/', { state: { message: 'You must be logged in to view this page', from: location.pathname } });
    }
  }, []);



  const heatmapOptions = {
    options: {
      
      
    },
    series: heatmapData,
  };

  return (
    <div className='w-full h-screen'>
      <Breadcrumbs />
      <div className='w-full h-full grid grid-rows-3 gap-5 py-5'>
        <div className='bg-white'>
          
        </div>
        <div className='row-span-2 grid grid-cols-3 gap-5'>
          <div className='col-span-2 bg-white flex items-center justify-center'>
          <Chart
            options={
                {
                    chart: {
                        type: 'heatmap',
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    colors: ['#008FFB'],
                    title: {
                        text: 'Attendance Graph',
                    },
                }
            }
            series={heatmapOptions.series}
            type='heatmap'
            height={350}
            width={800}
          />
          </div>
          <div className='bg-white border rounded-xl overflow-x-auto px-5'>
            <div className='p-5'>
                <Alert message={`The date today is ${selectedValue?.format('YYYY-MM-DD')}`} />
            </div>
            <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;