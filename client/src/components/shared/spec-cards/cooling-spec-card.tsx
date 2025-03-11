import React from 'react';
import { Fan } from 'lucide-react';
import { SpecCard, SpecRow, SpecBadge } from './spec-card';

interface CoolingSpecCardProps {
  data: {
    cooling_type: string;
    length: number;
    width: number;
    height: number;
    socket_support: string[];
    fan_speed: number;
    noise_level: number;
    fan_size: number;
  };
}

export const CoolingSpecCard: React.FC<CoolingSpecCardProps> = ({ data }) => {
  return (
    <SpecCard title='Thông số Tản nhiệt' icon={<Fan className='h-5 w-5' />}>
      <div className='space-y-1'>
        <SpecRow label='Loại tản nhiệt' value={data.cooling_type} highlight />
        <SpecRow
          label='Kích thước'
          value={`${data.length} x ${data.width} x ${data.height}mm`}
        />
        <SpecRow
          label='Socket hỗ trợ'
          value={
            <>
              {data.socket_support.map((socket, index) => (
                <SpecBadge key={index}>{socket}</SpecBadge>
              ))}
            </>
          }
        />
        <SpecRow label='Tốc độ quạt' value={`${data.fan_speed}RPM`} />
        <SpecRow label='Độ ồn' value={`${data.noise_level}dB`} />
        <SpecRow label='Kích thước quạt' value={`${data.fan_size}mm`} />
      </div>
    </SpecCard>
  );
};
