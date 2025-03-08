import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { StorageFormValues } from '../product-schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StorageType } from '@/services/types/request/product-req';

export const StorageForm = ({
  form,
}: {
  form: UseFormReturn<StorageFormValues>;
}) => {
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
        <Label>Loại ổ cứng</Label>
        <Controller
          name='storage_type'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Chọn loại ổ cứng' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(StorageType).map((type) => (
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
        <Label>Dung lượng (GB)</Label>
        <Controller
          name='capacity'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Dung lượng'
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
        <Label>Tốc độ đọc (MB/s)</Label>
        <Controller
          name='read_speed'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                type='number'
                placeholder='Tốc độ đọc'
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
        <Label>Tốc độ ghi (MB/s)</Label>
        <Controller
          name='write_speed'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                type='number'
                placeholder='Tốc độ ghi'
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
        <Label>Kích thước (inch)</Label>
        <Controller
          name='form_factor'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input {...field} placeholder='Ví dụ: 2.5, 3.5, M.2 2280' />
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
        <Label>Cache</Label>
        <Controller
          name='cache'
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                placeholder='Ví dụ: 512 MB DRAM'
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
  </div>
);
