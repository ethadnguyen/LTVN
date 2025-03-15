'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  getAllAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from '@/services/modules/address.service';
import {
  AddressResponse,
  PlacePrediction,
} from '@/services/types/response/address_types/address.res';
import {
  UpdateAddressRequest,
  CreateAddressRequest,
} from '@/services/types/request/address_types/address.req';
import { useUserStore } from '@/store/useUserStore';
import { AddressCard } from '@/components/address/address-card';
import { EmptyAddress } from '@/components/address/empty-address';
import { AddressSkeleton } from '@/components/address/address-skeleton';
import {
  AddressDialog,
  AddressFormValues,
  AddAddressButton,
} from '@/components/address/address-dialog';
import { PaginationWrapper } from '@/components/custom/pagination-wrapper';
import { Breadcrumb } from '@/components/custom/breadcrumb';

export default function AddressPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, checkAuth } = useUserStore();
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; // Giá trị cố định

  const defaultAddValues: AddressFormValues = {
    label: 'HOME',
    province: '',
    district: '',
    ward: '',
    street: '',
    note: '',
  };

  const [defaultEditValues, setDefaultEditValues] = useState<AddressFormValues>(
    {
      label: 'HOME',
      province: '',
      district: '',
      ward: '',
      street: '',
      note: '',
    }
  );

  const [editSelectedPlace, setEditSelectedPlace] =
    useState<PlacePrediction | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push('/auth/sign-in');
      } else if (user) {
        fetchAddresses(currentPage, pageSize);
      }
    };

    verifyAuth();
  }, [user, router, checkAuth, currentPage, pageSize]);

  const fetchAddresses = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      const response = await getAllAddresses({
        page: page,
        size: size,
        user_id: user?.user_id,
      });

      if (response && response.addresses && Array.isArray(response.addresses)) {
        setAddresses(response.addresses);
        setCurrentPage(response.currentPage || 1);
        setTotalItems(response.total || 0);
      } else {
        setAddresses([]);
        setCurrentPage(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa chỉ:', error);
      setAddresses([]);
      setCurrentPage(1);
      setTotalItems(0);
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy danh sách địa chỉ. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAddresses(page, pageSize);
  };

  const handleAddAddress = async (
    data: AddressFormValues,
    selectedPlace: PlacePrediction
  ) => {
    try {
      if (!user?.user_id) return;

      const addressData: CreateAddressRequest = {
        place_id: selectedPlace.place_id,
        user_id: Number(user.user_id),
        note: data.note || '',
        street: selectedPlace.structured_formatting.main_text,
        province: data.province,
        district: data.district,
        ward: data.ward,
        label: data.label,
      };

      await createAddress(addressData);

      toast({
        title: 'Thành công',
        description: 'Đã thêm địa chỉ mới thành công.',
      });

      setIsAddDialogOpen(false);

      fetchAddresses(currentPage, pageSize);
    } catch (error) {
      console.error('Lỗi khi thêm địa chỉ:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm địa chỉ mới. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  };

  const handleEditAddress = async (address: AddressResponse) => {
    setEditingAddress(address);

    setDefaultEditValues({
      label: address.label,
      province: address.province,
      district: address.district,
      ward: address.ward,
      street: address.street,
      note: address.note || '',
    });

    setEditSelectedPlace({
      place_id: address.place_id,
      description: `${address.street}, ${address.ward}, ${address.district}, ${address.province}`,
      structured_formatting: {
        main_text: address.street,
        secondary_text: `${address.ward}, ${address.district}, ${address.province}`,
      },
    });

    setIsEditDialogOpen(true);
  };

  const handleDeleteAddress = async (address: AddressResponse) => {
    try {
      await deleteAddress(address.id);

      toast({
        title: 'Thành công',
        description: 'Đã xóa địa chỉ thành công.',
      });

      fetchAddresses(currentPage, pageSize);
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa địa chỉ. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateAddress = async (
    data: AddressFormValues,
    selectedPlace: PlacePrediction
  ) => {
    try {
      if (!editingAddress) return;

      const updateData: UpdateAddressRequest = {
        id: editingAddress.id,
        place_id: selectedPlace.place_id,
        note: data.note || '',
        street: selectedPlace.structured_formatting.main_text,
        label: data.label,
        province: data.province,
        district: data.district,
        ward: data.ward,
      };

      await updateAddress(updateData);

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật địa chỉ thành công.',
      });

      setEditingAddress(null);
      setIsEditDialogOpen(false);

      fetchAddresses(currentPage, pageSize);
    } catch (error) {
      console.error('Lỗi khi cập nhật địa chỉ:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật địa chỉ. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  };

  if (loading && !user) {
    return (
      <div className='container py-10'>
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='container py-10'>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tài khoản', href: '/profile' },
          { label: 'Địa chỉ của tôi', href: '/profile/address' },
        ]}
        className='mb-6'
      />

      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Địa chỉ của tôi</h1>
        <AddAddressButton onClick={() => setIsAddDialogOpen(true)} />
      </div>

      {/* Dialog thêm địa chỉ mới */}
      <AddressDialog
        isOpen={isAddDialogOpen}
        onOpenChange={(open) => setIsAddDialogOpen(open)}
        onSubmit={handleAddAddress}
        title='Thêm địa chỉ mới'
        description='Chọn tỉnh/thành phố, quận/huyện, phường/xã và nhập chi tiết địa chỉ của bạn.'
        buttonText='Lưu địa chỉ'
        defaultValues={defaultAddValues}
      />

      {/* Dialog sửa địa chỉ */}
      <AddressDialog
        isOpen={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingAddress(null);
            setEditSelectedPlace(null);
          }
        }}
        onSubmit={handleUpdateAddress}
        title='Sửa địa chỉ'
        description='Chỉnh sửa thông tin địa chỉ của bạn.'
        buttonText='Cập nhật'
        defaultValues={defaultEditValues}
        initialSelectedPlace={editSelectedPlace}
      />

      <div className='grid grid-cols-1 gap-6'>
        {loading ? (
          <div className='space-y-4'>
            {[1, 2, 3].map((i) => (
              <AddressSkeleton key={i} />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <EmptyAddress onAddNew={() => setIsAddDialogOpen(true)} />
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
            />
          ))
        )}
      </div>

      {!loading && addresses.length > 0 && (
        <div className='mt-6'>
          <PaginationWrapper
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
