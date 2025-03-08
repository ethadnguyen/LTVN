import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RAMFormValues } from '../product-schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RamType,
  ModuleType,
  ChannelType,
} from '@/services/types/request/product-req';

export const RAMForm = ({ form }: { form: UseFormReturn<RAMFormValues> }) => {
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    const value = parseInt(e.target.value, 10);
    onChange(isNaN(value) ? 0 : Math.max(0, value));
  };

  const handleFloatChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    const value = parseFloat(e.target.value);
    onChange(isNaN(value) ? 0 : Math.max(0, value));
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className='space-y-4'>
        <div className='grid gap-2'>
          <Label>Loại RAM</Label>
          <Controller
            name='ram_type'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
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
          <Label>Tốc độ (MHz)</Label>
          <Controller
            name='speed'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  min={0}
                  onChange={(e) => handleNumberChange(e, field.onChange)}
                  placeholder='Tốc độ RAM'
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
          <Label>Dung lượng (GB)</Label>
          <Controller
            name='capacity'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  min={0}
                  onChange={(e) => handleNumberChange(e, field.onChange)}
                  placeholder='Dung lượng (GB)'
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
          <Label>Độ trễ (CL)</Label>
          <Controller
            name='latency'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder='Ví dụ: CL16' />
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
          <Label>Điện áp (V)</Label>
          <Controller
            name='voltage'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  step='0.01'
                  min={0}
                  onChange={(e) => handleFloatChange(e, field.onChange)}
                  placeholder='Điện áp'
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
          <Label>Loại module</Label>
          <Controller
            name='module_type'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn loại module' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ModuleType).map((type) => (
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
          <Label>Kênh</Label>
          <Controller
            name='channel'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn loại kênh' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ChannelType).map((type) => (
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
          <Label>Timing</Label>
          <Controller
            name='timing'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder='Ví dụ: 16-18-18-38' />
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
            name='ecc_support'
            control={form.control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label>Hỗ trợ ECC</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <Controller
            name='heat_spreader'
            control={form.control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label>Tản nhiệt</Label>
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
