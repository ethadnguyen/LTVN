'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  getAllAddresses,
  createAddress,
  getProvinces,
  updateAddress,
  deleteAddress,
  suggestAddress,
  getDistricts,
  getWards,
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

  // Thêm state cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; // Giá trị cố định

  // Danh sách các tỉnh/thành phố, quận/huyện, phường/xã
  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>(
    []
  );

  // Danh sách gợi ý địa chỉ
  const [addressSuggestions, setAddressSuggestions] = useState<
    PlacePrediction[]
  >([]);
  const [selectedPlace, setSelectedPlace] = useState<PlacePrediction | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);

  // Giá trị mặc định cho form thêm địa chỉ
  const defaultAddValues: AddressFormValues = {
    label: 'HOME',
    province: '',
    district: '',
    ward: '',
    street: '',
    note: '',
  };

  // Giá trị mặc định cho form chỉnh sửa địa chỉ
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

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push('/auth/sign-in');
      } else if (user) {
        fetchAddresses(currentPage, pageSize);
        fetchProvinces();
      }
    };

    verifyAuth();
  }, [user, router, checkAuth, currentPage, pageSize]);

  // Lấy danh sách tỉnh/thành phố
  const fetchProvinces = async () => {
    try {
      const data = await getProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
      toast({
        title: 'Lỗi',
        description:
          'Không thể lấy danh sách tỉnh/thành phố. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  };

  // Lấy danh sách địa chỉ
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

  useEffect(() => {
    const handleAddressSuggestions = async () => {
      if (!selectedPlace) {
        const streetValue = isEditDialogOpen
          ? defaultEditValues.street
          : defaultAddValues.street;

        if (streetValue && streetValue.length >= 3) {
          setIsSearching(true);
          try {
            // Gọi API suggestAddress với các tham số cần thiết
            const provinceValue = isEditDialogOpen
              ? defaultEditValues.province
              : defaultAddValues.province;

            // Lấy tên tỉnh/thành phố từ code
            const provinceObj = provinces.find((p) => p.code === provinceValue);
            const provinceName = provinceObj?.name || '';

            const suggestions = await suggestAddress(
              provinceName,
              '', // district
              '', // ward
              streetValue
            );
            setAddressSuggestions(suggestions);
          } catch (error) {
            console.error('Lỗi khi lấy gợi ý địa chỉ:', error);
          } finally {
            setIsSearching(false);
          }
        } else {
          setAddressSuggestions([]);
        }
      }
    };

    const debounce = setTimeout(handleAddressSuggestions, 500);
    return () => clearTimeout(debounce);
  }, [
    defaultAddValues.street,
    defaultEditValues.street,
    defaultAddValues.province,
    defaultEditValues.province,
    isEditDialogOpen,
    selectedPlace,
    provinces,
  ]);

  // Xử lý khi chọn một địa chỉ từ danh sách gợi ý
  const handleSelectPlace = (place: PlacePrediction) => {
    setSelectedPlace(place);
    setAddressSuggestions([]);
  };

  // Xử lý thêm địa chỉ mới
  const handleAddAddress = async (data: AddressFormValues) => {
    try {
      if (!user?.user_id) return;

      if (!selectedPlace) {
        toast({
          title: 'Lỗi',
          description: 'Vui lòng chọn một địa chỉ từ danh sách gợi ý.',
          variant: 'destructive',
        });
        return;
      }

      const provinceObj = provinces.find((p) => p.code === data.province);
      const districtObj = provinces.find((d) => d.code === data.district);
      const wardObj = provinces.find((w) => w.code === data.ward);

      if (!provinceObj || !districtObj || !wardObj) {
        toast({
          title: 'Lỗi',
          description: 'Thông tin địa chỉ không đầy đủ. Vui lòng kiểm tra lại.',
          variant: 'destructive',
        });
        return;
      }

      const addressData: CreateAddressRequest = {
        place_id: selectedPlace.place_id,
        user_id: Number(user.user_id),
        note: data.note || '',
        street: data.street,
        province: provinceObj.name,
        district: districtObj.name,
        ward: wardObj.name,
        label: data.label,
      };

      await createAddress(addressData);

      toast({
        title: 'Thành công',
        description: 'Đã thêm địa chỉ mới thành công.',
      });

      setSelectedPlace(null);
      setIsAddDialogOpen(false);

      // Cập nhật lại danh sách địa chỉ
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

  // Xử lý sửa địa chỉ
  const handleEditAddress = async (address: AddressResponse) => {
    setEditingAddress(address);

    try {
      // Tìm mã code của tỉnh/thành phố từ tên
      const provinceObj = provinces.find((p) => p.name === address.province);
      const provinceCode = provinceObj?.code || '';

      if (provinceCode) {
        // Lấy danh sách quận/huyện dựa trên tỉnh/thành phố
        const districtsData = await getDistricts(provinceCode);

        // Tìm mã code của quận/huyện từ tên
        const districtObj = districtsData.find(
          (d: { code: string; name: string }) => d.name === address.district
        );
        const districtCode = districtObj?.code || '';

        if (districtCode) {
          // Lấy danh sách phường/xã dựa trên quận/huyện
          const wardsData = await getWards(districtCode);

          // Tìm mã code của phường/xã từ tên
          const wardObj = wardsData.find(
            (w: { code: string; name: string }) => w.name === address.ward
          );
          const wardCode = wardObj?.code || '';

          // Cập nhật giá trị mặc định cho form chỉnh sửa
          setDefaultEditValues({
            label: address.label,
            province: provinceCode,
            district: districtCode,
            ward: wardCode,
            street: address.street,
            note: address.note || '',
          });
        } else {
          // Nếu không tìm thấy quận/huyện
          setDefaultEditValues({
            label: address.label,
            province: provinceCode,
            district: '',
            ward: '',
            street: address.street,
            note: address.note || '',
          });
        }
      } else {
        // Nếu không tìm thấy tỉnh/thành phố
        setDefaultEditValues({
          label: address.label,
          province: '',
          district: '',
          ward: '',
          street: address.street,
          note: address.note || '',
        });
      }

      setSelectedPlace({
        place_id: address.place_id,
        description: `${address.street}, ${address.ward}, ${address.district}, ${address.province}`,
        structured_formatting: {
          main_text: address.street,
          secondary_text: `${address.ward}, ${address.district}, ${address.province}`,
        },
      });

      setIsEditDialogOpen(true);
    } catch (error) {
      console.error('Lỗi khi chuẩn bị dữ liệu chỉnh sửa:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu địa chỉ. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  };

  // Xử lý xóa địa chỉ
  const handleDeleteAddress = async (address: AddressResponse) => {
    try {
      await deleteAddress(address.id);

      toast({
        title: 'Thành công',
        description: 'Đã xóa địa chỉ thành công.',
      });

      // Cập nhật lại danh sách địa chỉ
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

  // Xử lý cập nhật địa chỉ
  const handleUpdateAddress = async (data: AddressFormValues) => {
    try {
      if (!editingAddress || !selectedPlace) return;

      let provinceName = editingAddress.province;
      let districtName = editingAddress.district;
      let wardName = editingAddress.ward;

      // Chỉ cập nhật thông tin địa chỉ nếu người dùng đã chọn đầy đủ
      if (data.province && data.district && data.ward) {
        const provinceObj = provinces.find((p) => p.code === data.province);
        const districtObj = provinces.find((d) => d.code === data.district);
        const wardObj = provinces.find((w) => w.code === data.ward);

        if (provinceObj && districtObj && wardObj) {
          provinceName = provinceObj.name;
          districtName = districtObj.name;
          wardName = wardObj.name;
        }
      }

      const updateData: UpdateAddressRequest = {
        id: editingAddress.id,
        place_id: selectedPlace.place_id,
        note: data.note || '',
        street: data.street,
        label: data.label,
        province: provinceName,
        district: districtName,
        ward: wardName,
      };

      await updateAddress(updateData);

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật địa chỉ thành công.',
      });

      // Reset state và đóng dialog
      setSelectedPlace(null);
      setEditingAddress(null);
      setIsEditDialogOpen(false);

      // Cập nhật lại danh sách địa chỉ
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
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setSelectedPlace(null);
            setAddressSuggestions([]);
          }
        }}
        onSubmit={handleAddAddress}
        provinces={provinces}
        title='Thêm địa chỉ mới'
        description='Chọn tỉnh/thành phố, quận/huyện, phường/xã và nhập chi tiết địa chỉ của bạn.'
        buttonText='Lưu địa chỉ'
        defaultValues={defaultAddValues}
        addressSuggestions={addressSuggestions}
        isSearching={isSearching}
        selectedPlace={selectedPlace}
        onSelectPlace={handleSelectPlace}
      />

      {/* Dialog sửa địa chỉ */}
      <AddressDialog
        isOpen={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedPlace(null);
            setEditingAddress(null);
            setAddressSuggestions([]);
          }
        }}
        onSubmit={handleUpdateAddress}
        provinces={provinces}
        title='Sửa địa chỉ'
        description='Chỉnh sửa thông tin địa chỉ của bạn.'
        buttonText='Cập nhật'
        defaultValues={defaultEditValues}
        addressSuggestions={addressSuggestions}
        isSearching={isSearching}
        selectedPlace={selectedPlace}
        onSelectPlace={handleSelectPlace}
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
