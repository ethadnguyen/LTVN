import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { CategoryRes } from '@/services/types/response/category_types/category.res';

interface CategoryTreeProps {
  categories: CategoryRes[];
  currentCategorySlug?: string;
}

export function CategoryTree({
  categories,
  currentCategorySlug,
}: CategoryTreeProps) {
  // Lọc ra các danh mục cha (parent === null)
  const parentCategories = categories.filter(
    (cat) => cat.parent === null && cat.is_active
  );

  return (
    <div className='space-y-1'>
      {parentCategories.map((category) => (
        <CategoryTreeItem
          key={category.id}
          category={category}
          currentCategorySlug={currentCategorySlug}
          level={0}
        />
      ))}
    </div>
  );
}

interface CategoryTreeItemProps {
  category: CategoryRes;
  currentCategorySlug?: string;
  level: number;
}

function CategoryTreeItem({
  category,
  currentCategorySlug,
  level,
}: CategoryTreeItemProps) {
  const isActive = category.slug === currentCategorySlug;
  const hasChildren = category.children.length > 0;
  const activeChildren = category.children.filter((child) => child.is_active);

  return (
    <div className='space-y-1'>
      <Link
        href={`/category/${category.slug}`}
        className={`flex items-center px-2 py-1.5 rounded-md text-sm ${
          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren && activeChildren.length > 0 && (
          <ChevronRight className='h-4 w-4 mr-1 shrink-0' />
        )}
        <span className='truncate'>{category.name}</span>
      </Link>

      {hasChildren && activeChildren.length > 0 && (
        <div className='space-y-1'>
          {activeChildren.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              currentCategorySlug={currentCategorySlug}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
