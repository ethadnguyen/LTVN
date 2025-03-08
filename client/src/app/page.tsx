import HomeContent from '@/components/home/home-content';
import { getActiveProducts } from '@/services/modules/product.service';

export default async function HomePage() {
  const res = await getActiveProducts({ is_active: true });
  return <HomeContent products={res.products} />;
}
