import React from 'react'
import { Steps } from 'antd'
import { useFormStore } from '../../Store/ManagementState'
export const Stepper:React.FC = () => {

    const step  = useFormStore((state) => state.step)

  return (
    <Steps
        current={step}
        progressDot
        size="small"
        direction='horizontal'
        items={[
            {
            },
            {
            },
            {
            },
            {
            },
            {
            },
            {
            },
        ]}
    />
  )
}
