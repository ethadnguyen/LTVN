import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoolingFormValues } from '../product-schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CoolingType, SocketType } from '@/services/types/request/product-req';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export const CoolingForm = ({
  form,
}: {
  form: UseFormReturn<CoolingFormValues>;
}) => {
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

  const addSocketSupport = (socket: SocketType) => {
    const currentSockets = form.getValues('socket_support') || [];
    if (!currentSockets.includes(socket)) {
      form.setValue('socket_support', [...currentSockets, socket]);
    }
  };

  const removeSocketSupport = (socket: SocketType) => {
    const currentSockets = form.getValues('socket_support') || [];
    form.setValue(
      'socket_support',
      currentSockets.filter((s) => s !== socket)
    );
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className='space-y-4'>
        <div className='grid gap-2'>
          <Label>Loại tản nhiệt</Label>
          <Controller
            name='cooling_type'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  value={field.value as string}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn loại tản nhiệt' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CoolingType).map((type) => (
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
          <Label>Socket hỗ trợ</Label>
          <Controller
            name='socket_support'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {field.value &&
                    field.value.map((socket) => (
                      <Badge
                        key={socket}
                        variant='secondary'
                        className='flex items-center gap-1'
                      >
                        {socket}
                        <X
                          className='h-3 w-3 cursor-pointer'
                          onClick={() => removeSocketSupport(socket)}
                        />
                      </Badge>
                    ))}
                </div>
                <Select
                  onValueChange={(value) =>
                    addSocketSupport(value as SocketType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn socket hỗ trợ' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SocketType).map((type) => (
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
                <p className='text-sm text-muted-foreground mt-1'>
                  Chọn tất cả các socket mà tản nhiệt này hỗ trợ
                </p>
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
          <Label>Tốc độ quạt (RPM)</Label>
          <Controller
            name='fan_speed'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Tốc độ quạt'
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
          <Label>Độ ồn (dB)</Label>
          <Controller
            name='noise_level'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  step='0.1'
                  placeholder='Độ ồn'
                  onChange={(e) => handleFloatChange(e, field.onChange)}
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
          <Label>Chiều rộng (mm)</Label>
          <Controller
            name='width'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Chiều rộng'
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
          <Label>Chiều cao (mm)</Label>
          <Controller
            name='height'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Chiều cao'
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
};
