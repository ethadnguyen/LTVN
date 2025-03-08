import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function RecentSales() {
  return (
    <div className='space-y-8'>
      <div className='flex items-center'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/01.png' alt='Avatar' />
          <AvatarFallback>TH</AvatarFallback>
        </Avatar>
        <div className='ml-4 space-y-1'>
          <p className='text-sm font-medium leading-none'>Trần Hoàng</p>
          <p className='text-sm text-muted-foreground'>hoang.tran@email.com</p>
        </div>
        <div className='ml-auto font-medium'>+1.999.000đ</div>
      </div>
      <div className='flex items-center'>
        <Avatar className='flex h-9 w-9 items-center justify-center space-y-0 border'>
          <AvatarImage src='/avatars/02.png' alt='Avatar' />
          <AvatarFallback>NH</AvatarFallback>
        </Avatar>
        <div className='ml-4 space-y-1'>
          <p className='text-sm font-medium leading-none'>Nguyễn Hương</p>
          <p className='text-sm text-muted-foreground'>
            huong.nguyen@email.com
          </p>
        </div>
        <div className='ml-auto font-medium'>+399.000đ</div>
      </div>
      <div className='flex items-center'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/03.png' alt='Avatar' />
          <AvatarFallback>LT</AvatarFallback>
        </Avatar>
        <div className='ml-4 space-y-1'>
          <p className='text-sm font-medium leading-none'>Lê Thành</p>
          <p className='text-sm text-muted-foreground'>thanh.le@email.com</p>
        </div>
        <div className='ml-auto font-medium'>+2.999.000đ</div>
      </div>
      <div className='flex items-center'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/04.png' alt='Avatar' />
          <AvatarFallback>PM</AvatarFallback>
        </Avatar>
        <div className='ml-4 space-y-1'>
          <p className='text-sm font-medium leading-none'>Phạm Minh</p>
          <p className='text-sm text-muted-foreground'>minh.pham@email.com</p>
        </div>
        <div className='ml-auto font-medium'>+999.000đ</div>
      </div>
      <div className='flex items-center'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/05.png' alt='Avatar' />
          <AvatarFallback>VH</AvatarFallback>
        </Avatar>
        <div className='ml-4 space-y-1'>
          <p className='text-sm font-medium leading-none'>Vũ Hà</p>
          <p className='text-sm text-muted-foreground'>ha.vu@email.com</p>
        </div>
        <div className='ml-auto font-medium'>+399.000đ</div>
      </div>
    </div>
  );
}
