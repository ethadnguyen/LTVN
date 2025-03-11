import React from 'react';
import { MemoryStick } from 'lucide-react';
import { SpecCard, SpecRow } from './spec-card';

interface RAMSpecCardProps {
  data: {
    ram_type: string;
    speed: number;
    capacity: number;
    latency: string;
    voltage: number;
    module_type: string;
    ecc_support: boolean;
    channel: string;
    timing: string;
    rgb: boolean;
    heat_spreader: boolean;
  };
}

export const RAMSpecCard: React.FC<RAMSpecCardProps> = ({ data }) => {
  return (
    <SpecCard title='Thông số RAM' icon={<MemoryStick className='h-5 w-5' />}>
      <div className='space-y-1'>
        <SpecRow label='Loại RAM' value={data.ram_type} highlight />
        <SpecRow label='Tốc độ' value={`${data.speed}MHz`} />
        <SpecRow label='Dung lượng' value={`${data.capacity}GB`} />
        <SpecRow label='Độ trễ' value={data.latency} />
        <SpecRow label='Điện áp' value={`${data.voltage}V`} />
        <SpecRow label='Loại module' value={data.module_type} />
        <SpecRow label='Hỗ trợ ECC' value={data.ecc_support ? 'Có' : 'Không'} />
        <SpecRow label='Kênh' value={data.channel} />
        <SpecRow label='Timing' value={data.timing} />
        <SpecRow label='Đèn RGB' value={data.rgb ? 'Có' : 'Không'} />
        <SpecRow
          label='Tản nhiệt'
          value={data.heat_spreader ? 'Có' : 'Không'}
        />
      </div>
    </SpecCard>
  );
};
