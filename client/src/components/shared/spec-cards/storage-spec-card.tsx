import React from 'react';
import { HardDrive } from 'lucide-react';
import { SpecCard, SpecRow } from './spec-card';

interface StorageSpecCardProps {
  data: {
    storage_type: string;
    capacity: number;
    read_speed: number;
    write_speed: number;
    form_factor: string;
    cache: number;
  };
}

export const StorageSpecCard: React.FC<StorageSpecCardProps> = ({ data }) => {
  return (
    <SpecCard title='Thông số Lưu trữ' icon={<HardDrive className='h-5 w-5' />}>
      <div className='space-y-1'>
        <SpecRow label='Loại ổ cứng' value={data.storage_type} highlight />
        <SpecRow
          label='Dung lượng'
          value={`${
            data.capacity >= 1000
              ? data.capacity / 1000 + 'TB'
              : data.capacity + 'GB'
          }`}
        />
        <SpecRow label='Tốc độ đọc' value={`${data.read_speed}MB/s`} />
        <SpecRow label='Tốc độ ghi' value={`${data.write_speed}MB/s`} />
        <SpecRow label='Kích thước' value={data.form_factor} />
        <SpecRow label='Bộ nhớ đệm' value={`${data.cache}MB`} />
      </div>
    </SpecCard>
  );
};
