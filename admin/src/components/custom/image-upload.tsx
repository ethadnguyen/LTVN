'use client';

import { useState } from 'react';
import { ImagePlus, X, Upload as UploadIcon, Link } from 'lucide-react';
import { uploadImage } from '@/services/modules/file.service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onRemove?: (url: string) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({
  value = [],
  onChange,
  onRemove,
  maxImages = 8,
  className,
}: ImageUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setLoading(true);

    try {
      const newFiles = Array.from(files);
      const uploadPromises = newFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await uploadImage(formData);
        if (!response.data.success) {
          throw new Error('Upload failed');
        }

        return response.data.image.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newUrls = [...value, ...uploadedUrls].slice(0, maxImages);

      onChange(newUrls);
      setIsDialogOpen(false);
    } catch {
      setError('Có lỗi xảy ra khi upload ảnh');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlAdd = () => {
    if (!urlInput) return;

    try {
      new URL(urlInput);

      const newUrls = [...value, urlInput].slice(0, maxImages);
      onChange(newUrls);
      setUrlInput('');
      setIsDialogOpen(false);
    } catch {
      setError('URL không hợp lệ');
    }
  };

  const handleRemoveImage = (url: string) => {
    if (onRemove) {
      onRemove(url);
    } else {
      const newUrls = value.filter((item) => item !== url);
      onChange(newUrls);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className='flex justify-between items-center'>
        <span className='text-sm text-muted-foreground'>
          Tối đa {maxImages} hình ảnh
        </span>
        <Button
          variant='outline'
          onClick={() => setIsDialogOpen(true)}
          disabled={value.length >= maxImages}
        >
          <ImagePlus className='w-4 h-4 mr-2' />
          Thêm ảnh
        </Button>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {value.map((url, index) => (
          <div
            key={`image-${index}`}
            className='relative group aspect-square rounded-lg overflow-hidden border'
          >
            <Image
              src={url}
              alt={`Product image ${index + 1}`}
              className='w-full h-full object-cover'
              fill
              sizes='(max-width: 768px) 100vw, 300px'
            />
            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity'>
              <Button
                variant='destructive'
                size='icon'
                className='absolute top-2 right-2'
                onClick={() => handleRemoveImage(url)}
              >
                <X className='w-4 h-4' />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className='text-sm text-destructive'>{error}</p>}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm hình ảnh</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue='upload'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='upload'>
                <UploadIcon className='w-4 h-4 mr-2' />
                Upload
              </TabsTrigger>
              <TabsTrigger value='url'>
                <Link className='w-4 h-4 mr-2' />
                URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value='upload' className='space-y-4'>
              <Input
                type='file'
                accept='image/png,image/jpeg,image/jpg'
                multiple
                onChange={handleFileUpload}
                disabled={loading}
              />
              {loading && <p className='text-sm'>Đang tải...</p>}
            </TabsContent>

            <TabsContent value='url' className='space-y-4'>
              <div className='flex gap-2'>
                <Input
                  placeholder='Nhập URL hình ảnh'
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlAdd()}
                />
                <Button onClick={handleUrlAdd}>Thêm</Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
