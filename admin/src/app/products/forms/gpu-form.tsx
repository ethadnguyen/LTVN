import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GPUFormValues } from '../product-schema';
import {
  DisplayPortsType,
  PowerConnectorType,
  GpuMemoryType,
  PCIeType,
} from '@/services/types/request/product-req';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';

export const GPUForm = ({ form }: { form: UseFormReturn<GPUFormValues> }) => {
  const [selectedDisplayPorts, setSelectedDisplayPorts] = useState<
    DisplayPortsType[]
  >(
    Array.isArray(form.getValues('display_ports'))
      ? form.getValues('display_ports')
      : []
  );

  useEffect(() => {
    const subscription = form.watch((value) => {
      const displayPorts = Array.isArray(value.display_ports)
        ? (value.display_ports as DisplayPortsType[])
        : [];
      console.log('display_ports from form:', displayPorts);
      setSelectedDisplayPorts(displayPorts);
    });

    const currentDisplayPorts = Array.isArray(form.getValues('display_ports'))
      ? form.getValues('display_ports')
      : [];
    setSelectedDisplayPorts(currentDisplayPorts);

    return () => subscription.unsubscribe();
  }, [form]);
  const handleDisplayPortToggle = (port: DisplayPortsType) => {
    const updatedPorts = selectedDisplayPorts.includes(port)
      ? selectedDisplayPorts.filter((p) => p !== port)
      : [...selectedDisplayPorts, port];

    setSelectedDisplayPorts(updatedPorts);
    form.setValue('display_ports', updatedPorts, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div className='space-y-4'>
        <div className='grid gap-2'>
          <Label>Chipset</Label>
          <Controller
            name='chipset'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder='Ví dụ: NVIDIA RTX 4070' />
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>Dung lượng bộ nhớ (GB)</Label>
          <Controller
            name='memory_size'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Dung lượng bộ nhớ'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>Loại bộ nhớ</Label>
          <Controller
            name='memory_type'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  value={field.value || ''}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn loại bộ nhớ' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(GpuMemoryType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>Xung nhịp cơ bản (MHz)</Label>
          <Controller
            name='core_clock'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder='Xung nhịp cơ bản' />
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>Xung nhịp boost (MHz)</Label>
          <Controller
            name='boost_clock'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder='Xung nhịp boost' />
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>Số CUDA cores</Label>
          <Controller
            name='cuda_cores'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Số CUDA cores'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>Số Tensor cores</Label>
          <Controller
            name='tensor_cores'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Số Tensor cores'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className='space-y-4'>
        <div className='grid gap-2'>
          <Label>Công suất nguồn tối thiểu (W)</Label>
          <Controller
            name='min_psu_wattage'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Công suất nguồn tối thiểu'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>Kết nối nguồn</Label>
          <Controller
            name='power_connector'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  value={field.value?.toString() || ''}
                  onValueChange={(value) =>
                    field.onChange(value as PowerConnectorType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn loại kết nối nguồn' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PowerConnectorType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>TDP (W)</Label>
          <Controller
            name='tdp'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='TDP'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>Chiều dài (mm)</Label>
          <Controller
            name='length'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Chiều dài'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>Phiên bản PCIe</Label>
          <Controller
            name='pcie_version'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as PCIeType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn phiên bản PCIe' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PCIeType).map((version) => (
                      <SelectItem key={version} value={version}>
                        {version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>Kích thước slot</Label>
          <Controller
            name='slot_size'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='text'
                  placeholder='Số slot chiếm dụng Single, Dual, 2.5, 3.5...'
                  onChange={(e) => field.onChange(e.target.value)}
                />
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>Cổng kết nối</Label>
          <Controller
            name='display_ports'
            control={form.control}
            render={({ fieldState }) => (
              <>
                <div className='grid grid-cols-2 gap-2 border rounded-md p-3'>
                  {Object.values(DisplayPortsType).map((port) => (
                    <div key={port} className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        id={`port-${port}`}
                        checked={selectedDisplayPorts.includes(port)}
                        onChange={() => handleDisplayPortToggle(port)}
                        className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
                      />
                      <label
                        htmlFor={`port-${port}`}
                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        {port}
                      </label>
                    </div>
                  ))}
                </div>
                {fieldState.error && (
                  <span className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};
