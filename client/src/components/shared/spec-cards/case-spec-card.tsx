import React from 'react';
import { PcCase } from 'lucide-react';
import { SpecCard, SpecRow, SpecBadge } from './spec-card';

interface CaseSpecCardProps {
  data: {
    length: number;
    width: number;
    height: number;
    color: string;
    material: string;
    psu_max_length: number;
    cpu_cooler_height: number;
    max_gpu_length: number;
    form_factor: string[];
  };
}

export const CaseSpecCard: React.FC<CaseSpecCardProps> = ({ data }) => {
  return (
    <SpecCard title='Thông số Case' icon={<PcCase className='h-5 w-5' />}>
      <div className='space-y-1'>
        <SpecRow
          label='Kích thước'
          value={`${data.length} x ${data.width} x ${data.height}mm`}
          highlight
        />
        <SpecRow label='Màu sắc' value={data.color} />
        <SpecRow label='Chất liệu' value={data.material} />
        <SpecRow
          label='Chiều dài PSU tối đa'
          value={`${data.psu_max_length}mm`}
        />
        <SpecRow
          label='Chiều cao tản nhiệt CPU tối đa'
          value={`${data.cpu_cooler_height}mm`}
        />
        <SpecRow
          label='Chiều dài GPU tối đa'
          value={`${data.max_gpu_length}mm`}
        />
        <SpecRow
          label='Form Factor hỗ trợ'
          value={
            <>
              {data.form_factor.map((factor, index) => (
                <SpecBadge key={index}>{factor}</SpecBadge>
              ))}
            </>
          }
        />
      </div>
    </SpecCard>
  );
};
