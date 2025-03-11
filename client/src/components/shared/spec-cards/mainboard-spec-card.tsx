import React from 'react';
import { CircuitBoard } from 'lucide-react';
import { SpecCard, SpecRow } from './spec-card';

interface MainboardSpecCardProps {
  data: {
    form_factor: string;
    socket_type: string;
    chipset: string;
    ram_type: string;
    ram_speed: number;
    ram_slots: number;
    max_ram_capacity: number;
    pcie_slots: number;
    pcie_version: string;
    m2_slots: number;
    sata_slots: number;
    usb_ports: number;
    rgb: boolean;
    size: string;
    has_video_ports: boolean;
  };
}

export const MainboardSpecCard: React.FC<MainboardSpecCardProps> = ({
  data,
}) => {
  return (
    <SpecCard
      title='Thông số Bo mạch chủ'
      icon={<CircuitBoard className='h-5 w-5' />}
    >
      <div className='space-y-1'>
        <SpecRow label='Form Factor' value={data.form_factor} highlight />
        <SpecRow label='Socket' value={data.socket_type} />
        <SpecRow label='Chipset' value={data.chipset} />
        <SpecRow label='Loại RAM' value={data.ram_type} />
        <SpecRow label='Tốc độ RAM' value={`${data.ram_speed}MHz`} />
        <SpecRow label='Số khe RAM' value={data.ram_slots} />
        <SpecRow
          label='Dung lượng RAM tối đa'
          value={`${data.max_ram_capacity}GB`}
        />
        <SpecRow label='Số khe PCIe' value={data.pcie_slots} />
        <SpecRow label='Phiên bản PCIe' value={data.pcie_version} />
        <SpecRow label='Số khe M.2' value={data.m2_slots} />
        <SpecRow label='Số cổng SATA' value={data.sata_slots} />
        <SpecRow label='Số cổng USB' value={data.usb_ports} />
        <SpecRow label='Hỗ trợ RGB' value={data.rgb ? 'Có' : 'Không'} />
        <SpecRow label='Kích thước' value={data.size} />
        <SpecRow label='Cổng xuất hình' value={data.has_video_ports} />
      </div>
    </SpecCard>
  );
};
