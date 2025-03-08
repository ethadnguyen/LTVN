import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CaseFormValues } from '../product-schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MainboardFormFactor } from '@/services/types/request/product-req';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export const CaseForm = ({ form }: { form: UseFormReturn<CaseFormValues> }) => {
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    const value = parseInt(e.target.value, 10);
    onChange(isNaN(value) ? 0 : Math.max(0, value));
  };

  const addFormFactor = (formFactor: MainboardFormFactor) => {
    const currentFormFactors = form.getValues('form_factor') || [];
    if (!currentFormFactors.includes(formFactor)) {
      form.setValue('form_factor', [...currentFormFactors, formFactor]);
    }
  };

  const removeFormFactor = (formFactor: MainboardFormFactor) => {
    const currentFormFactors = form.getValues('form_factor') || [];
    form.setValue(
      'form_factor',
      currentFormFactors.filter((ff) => ff !== formFactor)
    );
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className='space-y-4'>
        <div className='grid gap-2'>
          <Label>Hỗ trợ mainboard</Label>
          <Controller
            name='form_factor'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <div className='flex flex-wrap gap-2 mb-2'>
                  {field.value &&
                    field.value.map((formFactor) => (
                      <Badge
                        key={formFactor}
                        variant='secondary'
                        className='flex items-center gap-1'
                      >
                        {formFactor}
                        <X
                          className='h-3 w-3 cursor-pointer'
                          onClick={() =>
                            removeFormFactor(formFactor as MainboardFormFactor)
                          }
                        />
                      </Badge>
                    ))}
                </div>
                <Select
                  onValueChange={(value) =>
                    addFormFactor(value as MainboardFormFactor)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn loại mainboard hỗ trợ' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MainboardFormFactor).map((type) => (
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
                  Chọn tất cả các loại mainboard mà case này hỗ trợ
                </p>
              </>
            )}
          />
        </div>

        <div className='grid gap-2'>
          <Label>Màu sắc</Label>
          <Controller
            name='color'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder='Ví dụ: Đen, Trắng, Đen-Đỏ' />
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
          <Label>Chất liệu</Label>
          <Controller
            name='material'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  placeholder='Ví dụ: Thép, Nhôm, Kính cường lực'
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
          <Label>Chiều cao tối đa tản nhiệt CPU (mm)</Label>
          <Controller
            name='cpu_cooler_height'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Chiều cao tối đa tản nhiệt CPU'
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
          <Label>Chiều dài tối đa GPU (mm)</Label>
          <Controller
            name='max_gpu_length'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Chiều dài tối đa GPU'
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

        <div className='grid gap-2'>
          <Label>Chiều dài tối đa PSU (mm)</Label>
          <Controller
            name='psu_max_length'
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type='number'
                  placeholder='Chiều dài tối đa PSU'
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
