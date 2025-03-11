'use client';

import { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb } from '@/components/custom/breadcrumb';
import { ImageGallery } from '@/components/shared/image-gallery';
import { ProductCard } from '@/components/shared/product-card';
import { ReviewCard } from '@/components/shared/review-card';
import { RatingInput } from '@/components/shared/rating-input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { useCartStore } from '@/store/useCartStore';
import { getProductBySlug } from '@/services/modules/product.service';
import {
  getReviewsByProductId,
  createReview,
} from '@/services/modules/review.service';
import { ProductRes } from '@/services/types/response/product_types/product.res';
import { ReviewRes } from '@/services/types/response/review_types/review.res';
import { PaginationWrapper } from '@/components/custom/pagination-wrapper';
import { CPUSpecCard } from '@/components/shared/spec-cards/cpu-spec-card';
import { GPUSpecCard } from '@/components/shared/spec-cards/gpu-spec-card';
import { RAMSpecCard } from '@/components/shared/spec-cards/ram-spec-card';
import { MainboardSpecCard } from '@/components/shared/spec-cards/mainboard-spec-card';
import { StorageSpecCard } from '@/components/shared/spec-cards/storage-spec-card';
import { PSUSpecCard } from '@/components/shared/spec-cards/psu-spec-card';
import { CaseSpecCard } from '@/components/shared/spec-cards/case-spec-card';
import { CoolingSpecCard } from '@/components/shared/spec-cards/cooling-spec-card';
import {
  CPUSpecifications,
  GPUSpecifications,
  RAMSpecifications,
  MainboardSpecifications,
  StorageSpecifications,
  PSUSpecifications,
  CaseSpecifications,
  CoolingSpecifications,
} from '@/services/types/response/product_types/specifications';
import {
  fetchCPUDetails,
  fetchGPUDetails,
  fetchRamDetails,
  fetchMainboardDetails,
  fetchStorageDetails,
  fetchPSUDetails,
  fetchCaseDetails,
  fetchCoolingDetails,
} from '@/services/modules/product.service';

// Remove the props interface since we're using useParams
export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<ProductRes | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductRes[]>([]);
  const [reviews, setReviews] = useState<ReviewRes[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);

  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { addToCart } = useCartStore();

  // Fetch reviews
  const fetchReviews = async (page: number) => {
    if (!product) return;
    try {
      const reviewsData = await getReviewsByProductId(product.id, {
        page,
        size: reviewsPerPage,
      });
      setReviews(reviewsData.reviews);
      setTotalReviews(reviewsData.total);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải đánh giá',
        variant: 'destructive',
      });
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchReviews(page);
  };

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productData = await getProductBySlug(slug);
        setProduct(productData);

        // Fetch reviews for this product
        await fetchReviews(currentPage);

        // TODO: Fetch related products based on category
        setRelatedProducts([]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin sản phẩm',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductData();
    }
  }, [slug, toast]);

  const handleQuantityChange = (value: number) => {
    if (product && value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      toast({
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
        variant: 'destructive',
      });
      router.push(`/auth/sign-in?callbackUrl=/product/${slug}`);
      return;
    }

    try {
      await addToCart({
        product_id: product.id,
        quantity: quantity,
      });

      toast({
        title: 'Thêm vào giỏ hàng thành công',
        description: `Đã thêm ${product.name} vào giỏ hàng`,
      });
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm sản phẩm vào giỏ hàng',
        variant: 'destructive',
      });
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      toast({
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để mua sản phẩm',
        variant: 'destructive',
      });
      router.push(`/auth/sign-in?callbackUrl=/product/${slug}`);
      return;
    }

    try {
      await addToCart({
        product_id: product.id,
        quantity: quantity,
      });

      router.push('/cart');
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm sản phẩm vào giỏ hàng',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    if (!isAuthenticated) {
      toast({
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để đánh giá sản phẩm',
        variant: 'destructive',
      });
      router.push(`/auth/sign-in?callbackUrl=/product/${slug}`);
      return;
    }

    if (!reviewText.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập nội dung đánh giá',
        variant: 'destructive',
      });
      return;
    }

    try {
      setReviewLoading(true);
      await createReview({
        product_id: product.id,
        rating,
        comment: reviewText,
      });

      await fetchReviews(currentPage);

      setReviewText('');
      setRating(5);

      toast({
        title: 'Thành công',
        description: 'Đã gửi đánh giá của bạn',
      });
      setReviewLoading(false);
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể gửi đánh giá',
        variant: 'destructive',
      });
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='container-custom py-12'>
        <div className='flex items-center justify-center h-96'>
          <p className='text-lg'>Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='container-custom py-12'>
        <div className='flex items-center justify-center h-96'>
          <p className='text-lg'>Không tìm thấy sản phẩm</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: product.type, href: `/category/${product.type.toLowerCase()}` },
    { label: product.name, active: true },
  ];

  const formattedImages = product.images.map((src) => ({
    src,
    alt: product.name,
  }));

  const ProductSpecifications = ({ product }: { product: ProductRes }) => {
    type ComponentDetails =
      | (CPUSpecifications & { product: ProductRes })
      | (GPUSpecifications & { product: ProductRes })
      | (RAMSpecifications & { product: ProductRes })
      | (MainboardSpecifications & { product: ProductRes })
      | (StorageSpecifications & { product: ProductRes })
      | (PSUSpecifications & { product: ProductRes })
      | (CaseSpecifications & { product: ProductRes })
      | (CoolingSpecifications & { product: ProductRes });

    const [componentDetails, setComponentDetails] =
      useState<ComponentDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchComponentDetails = async () => {
        try {
          let details;
          switch (product.type) {
            case 'CPU':
              details = await fetchCPUDetails(product.id);
              break;
            case 'GPU':
              details = await fetchGPUDetails(product.id);
              break;
            case 'RAM':
              details = await fetchRamDetails(product.id);
              break;
            case 'MAINBOARD':
              details = await fetchMainboardDetails(product.id);
              break;
            case 'STORAGE':
              details = await fetchStorageDetails(product.id);
              break;
            case 'POWER_SUPPLY':
              details = await fetchPSUDetails(product.id);
              break;
            case 'CASE':
              details = await fetchCaseDetails(product.id);
              break;
            case 'COOLING':
              details = await fetchCoolingDetails(product.id);
              break;
            default:
              throw new Error(`Unsupported product type: ${product.type}`);
          }
          setComponentDetails(details);
        } catch (error) {
          console.error('Error fetching component details:', error);
          toast({
            title: 'Lỗi',
            description: 'Không thể tải thông tin chi tiết sản phẩm',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };

      fetchComponentDetails();
    }, [product.id, product.type]);

    if (loading) {
      return <div>Đang tải thông tin chi tiết...</div>;
    }

    if (!componentDetails) {
      return <div>Không có thông tin chi tiết cho sản phẩm này</div>;
    }

    switch (product.type) {
      case 'CPU':
        return <CPUSpecCard data={componentDetails as CPUSpecifications} />;
      case 'GPU':
        return <GPUSpecCard data={componentDetails as GPUSpecifications} />;
      case 'RAM':
        return <RAMSpecCard data={componentDetails as RAMSpecifications} />;
      case 'MAINBOARD':
        return (
          <MainboardSpecCard
            data={componentDetails as MainboardSpecifications}
          />
        );
      case 'STORAGE':
        return (
          <StorageSpecCard data={componentDetails as StorageSpecifications} />
        );
      case 'POWER_SUPPLY':
        return <PSUSpecCard data={componentDetails as PSUSpecifications} />;
      case 'CASE':
        return <CaseSpecCard data={componentDetails as CaseSpecifications} />;
      case 'COOLING':
        return (
          <CoolingSpecCard data={componentDetails as CoolingSpecifications} />
        );
      default:
        return null;
    }
  };

  return (
    <div className='container-custom'>
      <div className='mb-6'>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
        <div>
          <ImageGallery
            images={
              formattedImages.length > 0
                ? formattedImages
                : [
                    {
                      src: '/placeholder.svg?height=600&width=600',
                      alt: product.name,
                    },
                  ]
            }
          />
        </div>
        <div className='space-y-6'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold'>{product.name}</h1>
            <div className='flex items-center mt-2'>
              <div className='flex'>
                <RatingInput value={product.rating} readOnly />
              </div>
              <span className='ml-2 text-sm text-muted-foreground'>
                ({totalReviews} đánh giá)
              </span>
              <span className='mx-2 text-muted-foreground'>•</span>
              <span className='text-sm text-muted-foreground'>
                Thương hiệu:{' '}
                <span className='text-primary'>
                  {product.brand?.name || 'Không có thông tin'}
                </span>
              </span>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            {product.is_sale && product.sale_price ? (
              <>
                <span className='text-3xl font-bold'>
                  {product.sale_price.toLocaleString()}đ
                </span>
                <span className='text-lg text-muted-foreground line-through'>
                  {product.price.toLocaleString()}đ
                </span>
                <span className='bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-medium'>
                  Giảm giá
                </span>
              </>
            ) : (
              <span className='text-3xl font-bold'>
                {product.price.toLocaleString()}đ
              </span>
            )}
          </div>

          <div className='border-t border-b py-4'>
            <p className='text-card-foreground'>{product.description}</p>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Số lượng:</span>
            <div className='flex items-center'>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 rounded-r-none'
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <input
                type='number'
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(Number.parseInt(e.target.value))
                }
                className='h-8 w-12 border-y text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                aria-label='Số lượng sản phẩm'
                title='Số lượng sản phẩm'
              />
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 rounded-l-none'
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </div>
            <span className='text-sm text-muted-foreground'>
              {product.stock} sản phẩm có sẵn
            </span>
          </div>

          <div className='flex flex-col sm:flex-row gap-4'>
            <Button
              className='flex-1'
              size='lg'
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className='mr-2 h-5 w-5' />
              Thêm vào giỏ hàng
            </Button>
            <Button
              variant='secondary'
              className='flex-1'
              size='lg'
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >
              Mua ngay
            </Button>
            <Button variant='outline' size='icon' className='h-12 w-12'>
              <Heart className='h-5 w-5' />
              <span className='sr-only'>Thêm vào yêu thích</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue='specifications' className='mb-12'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='specifications'>Thông số kỹ thuật</TabsTrigger>
          <TabsTrigger value='description'>Mô tả</TabsTrigger>
          <TabsTrigger value='reviews'>Đánh giá</TabsTrigger>
        </TabsList>
        <TabsContent
          value='specifications'
          className='border rounded-md mt-6 p-6'
        >
          <ProductSpecifications product={product} />
        </TabsContent>
        <TabsContent value='description' className='border rounded-md mt-6 p-6'>
          <div className='prose max-w-none dark:prose-invert'>
            <p>{product.description}</p>
          </div>
        </TabsContent>
        <TabsContent value='reviews' className='mt-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='md:col-span-2 space-y-6'>
              <h3 className='text-xl font-bold'>Đánh giá từ khách hàng</h3>
              <div className='space-y-4'>
                {reviews.length > 0 ? (
                  <>
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        id={review.id.toString()}
                        author={review.user?.name || 'Người dùng ẩn danh'}
                        date={new Date(review.created_at).toLocaleDateString(
                          'vi-VN'
                        )}
                        rating={review.rating}
                        content={review.comment}
                      />
                    ))}
                    {totalReviews > reviewsPerPage && (
                      <div className='mt-6'>
                        <PaginationWrapper
                          currentPage={currentPage}
                          totalItems={totalReviews}
                          pageSize={reviewsPerPage}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <p className='text-muted-foreground'>
                    Chưa có đánh giá nào cho sản phẩm này.
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className='border rounded-md p-6'>
                <h3 className='text-lg font-bold mb-4'>Viết đánh giá</h3>
                <form onSubmit={handleSubmitReview} className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Đánh giá của bạn
                    </label>
                    <RatingInput value={rating} onChange={setRating} />
                  </div>
                  <div>
                    <label
                      htmlFor='review'
                      className='block text-sm font-medium mb-2'
                    >
                      Nhận xét
                    </label>
                    <Textarea
                      id='review'
                      placeholder='Chia sẻ trải nghiệm của bạn với sản phẩm này'
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={reviewLoading || !isAuthenticated}
                  >
                    {reviewLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
                  </Button>
                  {!isAuthenticated && (
                    <p className='text-sm text-muted-foreground text-center'>
                      Vui lòng đăng nhập để gửi đánh giá
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {relatedProducts.length > 0 && (
        <section className='mb-12'>
          <h2 className='text-2xl font-bold mb-6'>Sản phẩm tương tự</h2>
          <div className='product-grid'>
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id.toString()}
                name={product.name}
                slug={product.slug}
                price={product.price}
                image={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : '/placeholder.svg?height=300&width=300'
                }
                rating={product.rating}
                category={product.type}
                is_sale={product.is_sale}
                sale_price={product.sale_price}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
