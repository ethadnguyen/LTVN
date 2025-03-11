import React from 'react';
import { Cpu } from 'lucide-react';
import { SpecCard, SpecRow, SpecBadge } from './spec-card';

interface CPUSpecCardProps {
  data: {
    socket_type: string;
    cores: number;
    threads: number;
    base_clock: string;
    boost_clock: string;
    wattage: number;
    cache: string;
    tdp: number;
    pcie_version: string;
    pcie_slots: number;
    max_memory_capacity: number;
    supported_ram: {
      ram_type: string;
      max_speed: number;
    }[];
    supported_chipsets: string[];
    has_integrated_gpu: boolean;
  };
}

export const CPUSpecCard: React.FC<CPUSpecCardProps> = ({ data }) => {
  return (
    <SpecCard title='Thông số CPU' icon={<Cpu className='h-5 w-5' />}>
      <div className='space-y-1'>
        <SpecRow label='Socket' value={data.socket_type} highlight />
        <SpecRow label='Số nhân' value={data.cores} />
        <SpecRow label='Số luồng' value={data.threads} />
        <SpecRow label='Xung nhịp cơ bản' value={data.base_clock} />
        <SpecRow label='Xung nhịp tăng cường' value={data.boost_clock} />
        <SpecRow label='Công suất' value={`${data.wattage}W`} />
        <SpecRow label='Bộ nhớ đệm' value={data.cache} />
        <SpecRow label='TDP' value={`${data.tdp}W`} />
        <SpecRow label='Phiên bản PCIe' value={data.pcie_version} />
        <SpecRow label='Số khe PCIe' value={data.pcie_slots} />
        <SpecRow
          label='Dung lượng RAM tối đa'
          value={`${data.max_memory_capacity}GB`}
        />
        <SpecRow
          label='Loại RAM hỗ trợ'
          value={
            <>
              {data.supported_ram.map((ram, index) => (
                <SpecBadge key={index}>
                  {ram.ram_type} {ram.max_speed}MHz
                </SpecBadge>
              ))}
            </>
          }
        />
        <SpecRow
          label='Chipset hỗ trợ'
          value={
            <>
              {data.supported_chipsets.map((chipset, index) => (
                <SpecBadge key={index}>{chipset}</SpecBadge>
              ))}
            </>
          }
        />
        <SpecRow label='GPU tích hợp' value={data.has_integrated_gpu} />
      </div>
    </SpecCard>
  );
};
