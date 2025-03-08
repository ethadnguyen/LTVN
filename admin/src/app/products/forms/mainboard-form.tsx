import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MainboardFormValues } from '../product-schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MainboardFormFactor,
  SocketType,
  RamType,
  ChipsetType,
  PCIeType,
} from '@/services/types/request/product-req';

export const MainboardForm = ({
  form,
}: {
  form: UseFormReturn<MainboardFormValues>;
}) => {
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    const value = parseInt(e.target.value, 10);
    onChange(isNaN(value) ? 0 : Math.max(0, value));
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {/* Cột trái - Thông tin cơ bản và RAM */}
      <div className='space-y-4'>
        <div className='space-y-4'>
          <h3 className='font-medium'>Thông tin cơ bản</h3>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label>Socket</Label>
              <Controller
                name='socket_type'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as SocketType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn socket' />
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
                  </>
                )}
              />
            </div>

            <div className='grid gap-2'>
              <Label>Form Factor</Label>
              <Controller
                name='form_factor'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as MainboardFormFactor)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn form factor' />
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
                  </>
                )}
              />
            </div>

            <div className='grid gap-2'>
              <Label>Chipset</Label>
              <Controller
                name='chipset'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as ChipsetType)
                      }
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
              <Label>Kích thước</Label>
              <Controller
                name='size'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input {...field} placeholder='Ví dụ: 305 x 244 mm' />
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
                  name='has_video_ports'
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id='has-video-ports'
                    />
                  )}
                />
                <Label htmlFor='has-video-ports'>Có cổng xuất hình ảnh</Label>
              </div>
              <p className='text-sm text-muted-foreground'>
                Bật nếu mainboard có cổng xuất hình ảnh (HDMI, DisplayPort, VGA)
                cho GPU tích hợp.
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <h3 className='font-medium'>Thông số RAM</h3>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label>Loại RAM hỗ trợ</Label>
              <Controller
                name='ram_type'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as RamType)
                      }
                    >
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
              <Label>Tốc độ RAM hỗ trợ (MHz)</Label>
              <Controller
                name='ram_speed'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      type='number'
                      min={1}
                      onChange={(e) => handleNumberChange(e, field.onChange)}
                      placeholder='Ví dụ: 3200, 3600'
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
              <Label>Số khe RAM</Label>
              <Controller
                name='ram_slots'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      type='number'
                      min={1}
                      onChange={(e) => handleNumberChange(e, field.onChange)}
                      placeholder='Số khe RAM'
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
              <Label>Dung lượng RAM tối đa (GB)</Label>
              <Controller
                name='max_ram_capacity'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      type='number'
                      min={1}
                      onChange={(e) => handleNumberChange(e, field.onChange)}
                      placeholder='Dung lượng RAM tối đa'
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
      </div>

      {/* Cột phải - Kết nối và tính năng khác */}
      <div className='space-y-4'>
        <div className='space-y-4'>
          <h3 className='font-medium'>Khe cắm mở rộng</h3>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label>Số khe PCIe</Label>
              <Controller
                name='pcie_slots'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      type='number'
                      min={1}
                      onChange={(e) => handleNumberChange(e, field.onChange)}
                      placeholder='Số khe PCIe'
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
                      onValueChange={(value) =>
                        field.onChange(value as PCIeType)
                      }
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
              <Label>Số khe M.2</Label>
              <Controller
                name='m2_slots'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      type='number'
                      min={1}
                      onChange={(e) => handleNumberChange(e, field.onChange)}
                      placeholder='Số khe M.2'
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
                name='sata_slots'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      type='number'
                      min={1}
                      onChange={(e) => handleNumberChange(e, field.onChange)}
                      placeholder='Số cổng SATA'
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

        <div className='space-y-4'>
          <h3 className='font-medium'>Kết nối và tính năng</h3>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label>Số cổng USB</Label>
              <Controller
                name='usb_ports'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      type='number'
                      min={1}
                      onChange={(e) => handleNumberChange(e, field.onChange)}
                      placeholder='Số cổng USB'
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

            <div className='flex items-center space-x-2'>
              <Controller
                name='rgb'
                control={form.control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label>RGB</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
