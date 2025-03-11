import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
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
  const parentCategories =
    categories && Array.isArray(categories)
      ? categories.filter((cat) => cat && cat.parent === null && cat.is_active)
      : [];

  return (
    <div className='space-y-1'>
      {/* Thêm mục "Tất cả" */}
      <Link
        href='/category/all'
        className={`flex items-center px-2 py-1.5 rounded-md text-sm ${
          currentCategorySlug === 'all'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted'
        }`}
      >
        <span className='truncate'>Tất cả sản phẩm</span>
      </Link>

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
  // Thêm state để theo dõi trạng thái mở/đóng của dropdown
  const [isOpen, setIsOpen] = useState(false);

  const isActive = category.slug === currentCategorySlug;
  const hasChildren =
    category.children &&
    Array.isArray(category.children) &&
    category.children.length > 0;
  const activeChildren = hasChildren
    ? category.children.filter((child) => child && child.is_active)
    : [];

  // Mở dropdown tự động nếu danh mục hiện tại hoặc một trong các danh mục con của nó đang active
  const isChildActive =
    hasChildren &&
    activeChildren.some(
      (child) =>
        child.slug === currentCategorySlug ||
        (child.children &&
          child.children.some(
            (grandChild) => grandChild.slug === currentCategorySlug
          ))
    );

  // Mở dropdown tự động nếu danh mục hiện tại hoặc một trong các danh mục con của nó đang active
  useEffect(() => {
    if (isActive || isChildActive) {
      setIsOpen(true);
    }
  }, [isActive, isChildActive]);

  // Hàm xử lý khi click vào mũi tên
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className='space-y-1'>
      <div className='flex items-center'>
        {hasChildren && activeChildren.length > 0 ? (
          <button
            onClick={toggleDropdown}
            className='p-1 hover:bg-muted rounded-md'
            style={{ marginLeft: `${level * 12}px` }}
          >
            {isOpen ? (
              <ChevronDown className='h-4 w-4 shrink-0' />
            ) : (
              <ChevronRight className='h-4 w-4 shrink-0' />
            )}
          </button>
        ) : (
          <div style={{ width: '24px', marginLeft: `${level * 12}px` }}></div>
        )}

        <Link
          href={`/category/${category.slug}`}
          className={`flex-1 flex items-center px-2 py-1.5 rounded-md text-sm ${
            isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
        >
          <span className='truncate'>{category.name}</span>
        </Link>
      </div>

      {/* Chỉ hiển thị danh mục con khi isOpen = true */}
      {hasChildren && activeChildren.length > 0 && isOpen && (
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
