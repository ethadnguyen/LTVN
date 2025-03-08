import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-secondary border-t border-primary'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-4 text-primary'>
              About Us
            </h3>
            <p className='text-accent'>
              TechBuild is your one-stop shop for custom PC builds. We offer
              high-quality components and an easy-to-use configuration tool.
            </p>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4 text-primary'>
              Quick Links
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/products'
                  className='text-accent hover:text-primary'
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href='/builder'
                  className='text-accent hover:text-primary'
                >
                  PC Builder
                </Link>
              </li>
              <li>
                <Link
                  href='/saved-configs'
                  className='text-accent hover:text-primary'
                >
                  Saved Configurations
                </Link>
              </li>
              <li>
                <Link href='/cart' className='text-accent hover:text-primary'>
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4 text-primary'>
              Contact Us
            </h3>
            <p className='text-accent'>
              Email: support@techbuild.com
              <br />
              Phone: (123) 456-7890
              <br />
              Address: 123 Tech Street, Silicon Valley, CA 94000
            </p>
          </div>
        </div>
        <div className='mt-8 pt-8 border-t border-primary text-center text-muted-foreground'>
          <p>
            &copy; {new Date().getFullYear()} TechBuild. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
