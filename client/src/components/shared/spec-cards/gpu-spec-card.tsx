import React from 'react';
import { MonitorSmartphone } from 'lucide-react';
import { SpecCard, SpecRow, SpecBadge } from './spec-card';

interface GPUSpecCardProps {
  data: {
    chipset: string;
    memory_size: number;
    memory_type: string;
    min_psu_wattage: number;
    power_connector: string;
    core_clock: string;
    boost_clock: string;
    tdp: number;
    pcie_version: string;
    slot_size: string;
    cuda_cores: number;
    tensor_cores: number;
    display_ports: string[];
    length: number;
  };
}

export const GPUSpecCard: React.FC<GPUSpecCardProps> = ({ data }) => {
  return (
    <SpecCard
      title='Thông số GPU'
      icon={<MonitorSmartphone className='h-5 w-5' />}
    >
      <div className='space-y-1'>
        <SpecRow label='Chipset' value={data.chipset} highlight />
        <SpecRow label='Dung lượng bộ nhớ' value={`${data.memory_size}GB`} />
        <SpecRow label='Loại bộ nhớ' value={data.memory_type} />
        <SpecRow
          label='Công suất PSU tối thiểu'
          value={`${data.min_psu_wattage}W`}
        />
        <SpecRow label='Kết nối nguồn' value={data.power_connector} />
        <SpecRow label='Xung nhịp cơ bản' value={data.core_clock} />
        <SpecRow label='Xung nhịp tăng cường' value={data.boost_clock} />
        <SpecRow label='TDP' value={`${data.tdp}W`} />
        <SpecRow label='Phiên bản PCIe' value={data.pcie_version} />
        <SpecRow label='Kích thước khe cắm' value={data.slot_size} />
        <SpecRow label='Số nhân CUDA' value={data.cuda_cores} />
        <SpecRow label='Số nhân Tensor' value={data.tensor_cores} />
        <SpecRow
          label='Cổng kết nối'
          value={
            <>
              {data.display_ports.map((port, index) => (
                <SpecBadge key={index}>{port}</SpecBadge>
              ))}
            </>
          }
        />
        <SpecRow label='Chiều dài' value={`${data.length}mm`} />
      </div>
    </SpecCard>
  );
};
