import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className='bg-muted'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <h3 className='text-lg font-bold mb-4'>TechParts</h3>
            <p className='text-muted-foreground mb-4'>
              Chuyên cung cấp linh kiện máy tính chính hãng với giá cả cạnh
              tranh và dịch vụ chăm sóc khách hàng tốt nhất.
            </p>
            <div className='flex space-x-4'>
              <Link
                href='#'
                className='text-muted-foreground hover:text-primary'
              >
                <Facebook size={20} />
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-primary'
              >
                <Instagram size={20} />
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-primary'
              >
                <Twitter size={20} />
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-primary'
              >
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-bold mb-4'>Danh mục sản phẩm</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/category/cpu'
                  className='text-muted-foreground hover:text-primary'
                >
                  CPU
                </Link>
              </li>
              <li>
                <Link
                  href='/category/mainboard'
                  className='text-muted-foreground hover:text-primary'
                >
                  Mainboard
                </Link>
              </li>
              <li>
                <Link
                  href='/category/ram'
                  className='text-muted-foreground hover:text-primary'
                >
                  RAM
                </Link>
              </li>
              <li>
                <Link
                  href='/category/vga'
                  className='text-muted-foreground hover:text-primary'
                >
                  VGA
                </Link>
              </li>
              <li>
                <Link
                  href='/category/storage'
                  className='text-muted-foreground hover:text-primary'
                >
                  SSD/HDD
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-bold mb-4'>Thông tin</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/about'
                  className='text-muted-foreground hover:text-primary'
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href='/policy'
                  className='text-muted-foreground hover:text-primary'
                >
                  Chính sách
                </Link>
              </li>
              <li>
                <Link
                  href='/warranty'
                  className='text-muted-foreground hover:text-primary'
                >
                  Bảo hành
                </Link>
              </li>
              <li>
                <Link
                  href='/shipping'
                  className='text-muted-foreground hover:text-primary'
                >
                  Vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  href='/faq'
                  className='text-muted-foreground hover:text-primary'
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-bold mb-4'>Liên hệ</h3>
            <ul className='space-y-4'>
              <li className='flex items-start'>
                <MapPin className='mr-2 h-5 w-5 text-primary shrink-0' />
                <span className='text-muted-foreground'>
                  123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                </span>
              </li>
              <li className='flex items-center'>
                <Phone className='mr-2 h-5 w-5 text-primary' />
                <span className='text-muted-foreground'>0123 456 789</span>
              </li>
              <li className='flex items-center'>
                <Mail className='mr-2 h-5 w-5 text-primary' />
                <span className='text-muted-foreground'>info@techparts.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t mt-12 pt-8 text-center text-muted-foreground'>
          <p>
            &copy; {new Date().getFullYear()} TechParts. Tất cả quyền được bảo
            lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
