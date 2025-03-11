import React from 'react';
import { Zap } from 'lucide-react';
import { SpecCard, SpecRow, SpecBadge } from './spec-card';
import { ProtectionType } from '@/services/types/response/product_types/specifications';

interface PSUSpecCardProps {
  data: {
    wattage: number;
    efficiency_rating: number;
    form_factor: string;
    modular: boolean;
    input_voltage: number;
    fan_size: number;
    fan_speed: number;
    noise_level: number;
    fan_bearing: string;
    rgb: boolean;
    atx12v_version: string;
    pcie_connectors: number;
    sata_connectors: number;
    eps_connectors: number;
    protection_features: ProtectionType[];
  };
}

export const PSUSpecCard: React.FC<PSUSpecCardProps> = ({ data }) => {
  return (
    <SpecCard title='Thông số Nguồn' icon={<Zap className='h-5 w-5' />}>
      <div className='space-y-1'>
        <SpecRow label='Công suất' value={`${data.wattage}W`} highlight />
        <SpecRow label='Hiệu suất' value={`${data.efficiency_rating}%`} />
        <SpecRow label='Form Factor' value={data.form_factor} />
        <SpecRow label='Modular' value={data.modular} />
        <SpecRow label='Điện áp đầu vào' value={`${data.input_voltage}V`} />
        <SpecRow label='Kích thước quạt' value={`${data.fan_size}mm`} />
        <SpecRow label='Tốc độ quạt' value={`${data.fan_speed}RPM`} />
        <SpecRow label='Độ ồn' value={`${data.noise_level}dB`} />
        <SpecRow label='Loại bạc đạn quạt' value={data.fan_bearing} />
        <SpecRow label='Đèn RGB' value={data.rgb} />
        <SpecRow label='Phiên bản ATX12V' value={data.atx12v_version} />
        <SpecRow label='Số cổng PCIe' value={data.pcie_connectors} />
        <SpecRow label='Số cổng SATA' value={data.sata_connectors} />
        <SpecRow label='Số cổng EPS' value={data.eps_connectors} />
        <SpecRow
          label='Tính năng bảo vệ'
          value={
            <>
              {data.protection_features.map((feature, index) => (
                <SpecBadge key={index}>{feature}</SpecBadge>
              ))}
            </>
          }
        />
      </div>
    </SpecCard>
  );
};
