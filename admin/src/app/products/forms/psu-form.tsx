import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PSUFormValues } from '../product-schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ATX12VType,
  ProtectionType,
} from '@/services/types/request/product-req';

export const PSUForm = ({ form }: { form: UseFormReturn<PSUFormValues> }) => {
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    const value = parseInt(e.target.value, 10);
    onChange(isNaN(value) ? 0 : Math.max(0, value));
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className='space-y-4'>
        <div className='grid gap-2'>
          <Label>Công suất (W)</Label>
          <Controller
            name='wattage'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Công suất'
                  onChange={(e) => handleNumberChange(e, field.onChange)}
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
          <Label>Hiệu suất</Label>
          <Controller
            name='efficiency_rating'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  placeholder='Ví dụ: 80 Plus Gold'
                  type='number'
                  onChange={(e) => handleNumberChange(e, field.onChange)}
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
          <Label>Chuẩn ATX</Label>
          <Controller
            name='atx12v_version'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn chuẩn ATX' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ATX12VType).map((type) => (
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
          <Label>Số cổng PCIe</Label>
          <Controller
            name='pcie_connectors'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Số cổng PCIe'
                  onChange={(e) => handleNumberChange(e, field.onChange)}
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
          <Label>Số cổng SATA</Label>
          <Controller
            name='sata_connectors'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Số cổng SATA'
                  onChange={(e) => handleNumberChange(e, field.onChange)}
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
          <Label>Số cổng EPS</Label>
          <Controller
            name='eps_connectors'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Số cổng EPS'
                  onChange={(e) => handleNumberChange(e, field.onChange)}
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
          <Label>Kích thước quạt (mm)</Label>
          <Controller
            name='fan_size'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Kích thước quạt'
                  onChange={(e) => handleNumberChange(e, field.onChange)}
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
          <Label>Loại quạt</Label>
          <Controller
            name='fan_bearing'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder='Ví dụ: Fluid Dynamic Bearing' />
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
          <Label>Bảo vệ</Label>
          <Controller
            name='protection_features'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <div className='flex flex-wrap gap-2'>
                  {Object.values(ProtectionType).map((type) => (
                    <div key={type} className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        id={`protection-${type}`}
                        checked={field.value.includes(type)}
                        onChange={(e) => {
                          const updatedValue = e.target.checked
                            ? [...field.value, type]
                            : field.value.filter((item) => item !== type);
                          field.onChange(updatedValue);
                        }}
                      />
                      <label htmlFor={`protection-${type}`}>{type}</label>
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

        <div className='flex items-center space-x-2'>
          <Controller
            name='modular'
            control={form.control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label>Modular</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <Controller
            name='rgb'
            control={form.control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label>RGB</Label>
        </div>
      </div>
    </div>
  );
};
