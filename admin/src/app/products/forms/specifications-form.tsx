import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import { ProductFormValues } from '../product-schema';

export const SpecificationsForm = ({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) => {
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    const currentSpecs = form.getValues('specifications');
    if (currentSpecs) {
      const specArray = Object.entries(currentSpecs).map(([key, value]) => ({
        key,
        value: value as string,
      }));
      setSpecs(specArray);
    }
  }, [form]);

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
    updateFormSpecs(newSpecs);
  };

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
    updateFormSpecs(newSpecs);
  };

  const updateFormSpecs = (specArray: { key: string; value: string }[]) => {
    const specsObject = specArray.reduce((acc, { key, value }) => {
      if (key) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    form.setValue('specifications', specsObject);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h4 className='font-medium'>Thông số kỹ thuật bổ sung</h4>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={addSpec}
          className='flex items-center'
        >
          <PlusCircle className='h-4 w-4 mr-1' />
          Thêm thông số
        </Button>
      </div>

      {specs.map((spec, index) => (
        <div key={index} className='flex gap-2 items-start'>
          <div className='grid gap-2 flex-1'>
            <Input
              placeholder='Tên thông số'
              value={spec.key}
              onChange={(e) => updateSpec(index, 'key', e.target.value)}
            />
          </div>
          <div className='grid gap-2 flex-1'>
            <Input
              placeholder='Giá trị'
              value={spec.value}
              onChange={(e) => updateSpec(index, 'value', e.target.value)}
            />
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => removeSpec(index)}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ))}
    </div>
  );
};
