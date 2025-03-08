import { useState, useEffect } from 'react';
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

interface UploadImagesProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxImages?: number;
}

interface ImageFile {
  id: string;
  url: string;
  name: string;
}

export const UploadImages = ({
  value = [],
  onChange,
  maxImages = 8,
}: UploadImagesProps) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Convert initial value to ImageFile format
    const initialImages = value.map((url, index) => ({
      id: `image-${index}`,
      url,
      name: `Image ${index + 1}`,
    }));
    setImages(initialImages);
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

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

        return {
          id: `image-${Date.now()}-${Math.random()}`,
          url: response.data.image.url,
          name: file.name,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedImages].slice(0, maxImages);

      setImages(newImages);
      onChange?.(newImages.map((img) => img.url));
      setIsDialogOpen(false);
    } catch (error) {
      setError('Có lỗi xảy ra khi upload ảnh');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlAdd = () => {
    if (!urlInput) return;

    try {
      new URL(urlInput);

      const newImage = {
        id: `image-${Date.now()}`,
        url: urlInput,
        name: 'URL Image',
      };

      const newImages = [...images, newImage].slice(0, maxImages);
      setImages(newImages);
      onChange?.(newImages.map((img) => img.url));
      setUrlInput('');
      setIsDialogOpen(false);
    } catch {
      setError('URL không hợp lệ');
    }
  };

  const removeImage = (id: string) => {
    const newImages = images.filter((img) => img.id !== id);
    setImages(newImages);
    onChange?.(newImages.map((img) => img.url));
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <span className='text-sm text-muted-foreground'>
          Tối đa {maxImages} hình ảnh
        </span>
        <Button
          variant='outline'
          onClick={() => setIsDialogOpen(true)}
          disabled={images.length >= maxImages}
        >
          <ImagePlus className='w-4 h-4 mr-2' />
          Thêm ảnh
        </Button>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {images.map((image) => (
          <div
            key={image.id}
            className='relative group aspect-square rounded-lg overflow-hidden border'
          >
            <img
              src={image.url}
              alt={image.name}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity'>
              <Button
                variant='destructive'
                size='icon'
                className='absolute top-2 right-2'
                onClick={() => removeImage(image.id)}
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
};
