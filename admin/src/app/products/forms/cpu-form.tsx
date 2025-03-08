import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CPUFormValues } from '../product-schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SocketType,
  PCIeType,
  ChipsetType,
  RamType,
} from '@/services/types/request/product-req';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface CPUFormProps {
  form: UseFormReturn<CPUFormValues>;
}

export const CPUForm = ({ form }: CPUFormProps) => {
  const getSocketDisplayName = (socket: string): string => {
    switch (socket) {
      case SocketType.AM4:
        return 'Socket AM4 (AMD)';
      case SocketType.AM5:
        return 'Socket AM5 (AMD)';
      case SocketType.LGA1151:
        return 'Socket LGA1151 (Intel)';
      case SocketType.LGA1200:
        return 'Socket LGA1200 (Intel)';
      case SocketType.LGA1700:
        return 'Socket LGA1700 (Intel)';
      default:
        return socket;
    }
  };

  const addSupportedChipset = () => {
    const currentChipsets = form.getValues('supported_chipsets') || [];
    form.setValue('supported_chipsets', [...currentChipsets, ChipsetType.Z790]);
  };

  const removeSupportedChipset = (index: number) => {
    const currentChipsets = form.getValues('supported_chipsets') || [];
    form.setValue(
      'supported_chipsets',
      currentChipsets.filter((_, i) => i !== index)
    );
  };

  const addSupportedRam = () => {
    const currentRam = form.getValues('supported_ram') || [];
    form.setValue('supported_ram', [
      ...currentRam,
      { ram_type: RamType.DDR5, max_speed: 0 },
    ]);
  };

  const removeSupportedRam = (index: number) => {
    const currentRam = form.getValues('supported_ram') || [];
    form.setValue(
      'supported_ram',
      currentRam.filter((_, i) => i !== index)
    );
  };

  return (
    <div className='space-y-4'>
      <div className='grid gap-2'>
        <div className='flex items-center justify-between'>
          <Label>Chipset được hỗ trợ</Label>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addSupportedChipset}
          >
            <Plus className='h-4 w-4 mr-2' />
            Thêm chipset
          </Button>
        </div>
        <Controller
          name='supported_chipsets'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <div className='space-y-2'>
                {field.value?.map((chipset, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <Select
                      value={chipset}
                      onValueChange={(value) => {
                        const newChipsets = [...field.value];
                        newChipsets[index] = value as ChipsetType;
                        field.onChange(newChipsets);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn chipset' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ChipsetType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => removeSupportedChipset(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
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

      <div className='grid gap-2'>
        <div className='flex items-center justify-between'>
          <Label>RAM được hỗ trợ</Label>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addSupportedRam}
          >
            <Plus className='h-4 w-4 mr-2' />
            Thêm RAM
          </Button>
        </div>
        <Controller
          name='supported_ram'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <div className='space-y-2'>
                {field.value?.map((ram, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <Select
                      value={ram.ram_type}
                      onValueChange={(value) => {
                        const newRam = [...field.value];
                        newRam[index] = {
                          ...newRam[index],
                          ram_type: value as RamType,
                        };
                        field.onChange(newRam);
                      }}
                    >
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Chọn loại RAM' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(RamType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type='number'
                      min='0'
                      placeholder='Tốc độ tối đa (MHz)'
                      value={ram.max_speed}
                      onChange={(e) => {
                        const newRam = [...field.value];
                        newRam[index] = {
                          ...newRam[index],
                          max_speed: parseInt(e.target.value, 10) || 0,
                        };
                        field.onChange(newRam);
                      }}
                      className='w-[180px]'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => removeSupportedRam(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
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

      <div className='grid gap-2'>
        <Label htmlFor='socket_type'>Socket</Label>
        <Controller
          name='socket_type'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as SocketType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chọn loại socket' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SocketType).map((socket) => (
                    <SelectItem key={socket} value={socket}>
                      {getSocketDisplayName(socket)}
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
        <div className='flex items-center space-x-2'>
          <Controller
            name='has_integrated_gpu'
            control={form.control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id='has-integrated-gpu'
              />
            )}
          />
          <Label htmlFor='has-integrated-gpu'>Có GPU tích hợp</Label>
        </div>
        <p className='text-sm text-muted-foreground'>
          Bật nếu CPU có GPU tích hợp (iGPU). Nếu không có, người dùng sẽ cần
          thêm GPU rời.
        </p>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='cores'>Số nhân</Label>
          <Controller
            name='cores'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  min='1'
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : Math.max(1, value));
                  }}
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
          <Label htmlFor='threads'>Số luồng</Label>
          <Controller
            name='threads'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  min='1'
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : Math.max(1, value));
                  }}
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

      <div className='grid grid-cols-2 gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='base_clock'>Xung nhịp cơ bản</Label>
          <Controller
            name='base_clock'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder='Ví dụ: 3.6 GHz' />
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
          <Label htmlFor='boost_clock'>Xung boost</Label>
          <Controller
            name='boost_clock'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder='Ví dụ: 4.2 GHz' />
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

      <div className='grid grid-cols-3 gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='cache'>Cache</Label>
          <Controller
            name='cache'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder='Ví dụ: 32MB' />
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
          <Label htmlFor='tdp'>TDP (W)</Label>
          <Controller
            name='tdp'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  min='0'
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : Math.max(0, value));
                  }}
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
          <Label htmlFor='wattage'>Công suất (W)</Label>
          <Controller
            name='wattage'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  min='0'
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : Math.max(0, value));
                  }}
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

      <div className='grid grid-cols-3 gap-4'>
        <div className='grid gap-2'>
          <Label htmlFor='max_memory_capacity'>RAM tối đa (GB)</Label>
          <Controller
            name='max_memory_capacity'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  min='0'
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : Math.max(0, value));
                  }}
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
          <Label htmlFor='pcie_version'>Phiên bản PCIe</Label>
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
          <Label htmlFor='pcie_slots'>Số khe PCIe</Label>
          <Controller
            name='pcie_slots'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  min='0'
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    field.onChange(isNaN(value) ? 0 : Math.max(0, value));
                  }}
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
    </div>
  );
};
