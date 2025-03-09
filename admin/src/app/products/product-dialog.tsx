'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { BaseProductForm } from './forms/base-product-form';
import { CPUForm } from './forms/cpu-form';
import {
  ProductFormValues,
  CPUFormValues,
  baseProductSchema,
  cpuSchema,
  GPUFormValues,
  gpuSchema,
  ramSchema,
  RAMFormValues,
  StorageFormValues,
  storageSchema,
  psuSchema,
  PSUFormValues,
  CoolingFormValues,
  coolingSchema,
  MainboardFormValues,
  mainboardSchema,
  CaseFormValues,
  caseSchema,
} from './product-schema';
import { ProductRes } from '@/services/types/response/product-res';
import {
  ATX12VType,
  ChannelType,
  ChipsetType,
  CoolingType,
  GpuMemoryType,
  MainboardFormFactor,
  ModuleType,
  PCIeType,
  PowerConnectorType,
  ProductType,
  RamType,
  SocketType,
  StorageType,
} from '@/services/types/request/product-req';
import { CategoryRes } from '@/services/types/response/category-res';
import { fetchAllCategories } from '@/services/modules/categories.service';
import {
  createCPU,
  updateCPU,
  deleteCPU,
  fetchCPUDetails,
  fetchGPUDetails,
  fetchPSUDetails,
  fetchRAMDetails,
  fetchStorageDetails,
  fetchCoolingDetails,
  fetchMainboardDetails,
  fetchCaseDetails,
  updateMainboard,
  updatePSU,
  updateGPU,
  updateStorage,
  updateCooling,
  updateCase,
  createPSU,
  createGPU,
  createStorage,
  createCooling,
  createMainboard,
  createCase,
  createRam,
  updateRam,
  deleteProduct,
  updateProduct,
} from '@/services/modules/product.service';
import { RAMForm } from './forms/ram-form';
import { GPUForm } from './forms/gpu-form';
import { PSUForm } from './forms/psu-form';
import { StorageForm } from './forms/storage-form';
import { CoolingForm } from './forms/cooling-form';
import { MainboardForm } from './forms/mainboard-form';
import { CaseForm } from './forms/case-form';

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product?: ProductRes | null;
  onRefresh?: () => void;
  isUpdate?: boolean;
}

export default function ProductDialog({
  open,
  onClose,
  product,
  onRefresh,
  isUpdate = false,
}: ProductDialogProps) {
  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const { toast } = useToast();

  const baseForm = useForm<ProductFormValues>({
    resolver: zodResolver(baseProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category_id: [],
      is_active: true,
      type: ProductType.CPU,
      specifications: {},
      images: [],
      brand_id: null,
    },
  });

  // Form cho thông tin CPU
  const cpuForm = useForm<CPUFormValues>({
    resolver: zodResolver(cpuSchema),
    defaultValues: {
      socket_type: SocketType.LGA1700,
      supported_chipsets: [],
      supported_ram: [],
      cores: 0,
      threads: 0,
      base_clock: '',
      boost_clock: '',
      wattage: 0,
      cache: '',
      tdp: 0,
      pcie_slots: 0,
      max_memory_capacity: 0,
      pcie_version: PCIeType.PCIE_4_0,
      has_integrated_gpu: false,
    },
  });

  const gpuForm = useForm<GPUFormValues>({
    resolver: zodResolver(gpuSchema),
    defaultValues: {
      chipset: '',
      memory_size: 0,
      memory_type: GpuMemoryType.GDDR6X,
      core_clock: '',
      boost_clock: '',
      min_psu_wattage: 0,
      power_connector: PowerConnectorType.PIN_8,
      tdp: 0,
      cuda_cores: 0,
      tensor_cores: 0,
      display_ports: [],
      pcie_version: PCIeType.PCIE_4_0,
      slot_size: '',
      length: 0,
    },
  });

  const psuForm = useForm<PSUFormValues>({
    resolver: zodResolver(psuSchema),
    defaultValues: {
      wattage: 0,
      efficiency_rating: 0,
      form_factor: MainboardFormFactor.ATX,
      modular: false,
      input_voltage: 0,
      atx12v_version: ATX12VType.ATX12V_2_5,
      protection_features: [],
      pcie_connectors: 0,
      sata_connectors: 0,
      eps_connectors: 0,
      fan_size: 0,
      fan_speed: 0,
      noise_level: 0,
      fan_bearing: '',
      rgb: false,
    },
  });

  const mainboardForm = useForm<MainboardFormValues>({
    resolver: zodResolver(mainboardSchema),
    defaultValues: {
      socket_type: SocketType.LGA1700,
      form_factor: MainboardFormFactor.ATX,
      chipset: ChipsetType.Z790,
      ram_type: RamType.DDR4,
      ram_speed: 0,
      ram_slots: 0,
      max_ram_capacity: 0,
      pcie_slots: 0,
      pcie_version: PCIeType.PCIE_4_0,
      m2_slots: 0,
      sata_slots: 0,
      usb_ports: 0,
      rgb: false,
      size: '',
    },
  });

  const ramForm = useForm<RAMFormValues>({
    resolver: zodResolver(ramSchema),
    defaultValues: {
      ram_type: RamType.DDR4,
      speed: 0,
      capacity: 0,
      latency: '',
      voltage: 0,
      module_type: ModuleType.DIMM,
      ecc_support: false,
      channel: ChannelType.DUAL,
      timing: '',
      rgb: false,
      heat_spreader: false,
    },
  });

  const storageForm = useForm<StorageFormValues>({
    resolver: zodResolver(storageSchema),
    defaultValues: {
      storage_type: StorageType.HDD,
      capacity: 0,
      read_speed: 0,
      write_speed: 0,
      form_factor: '',
      cache: 0,
    },
  });

  const caseForm = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      length: 0,
      width: 0,
      height: 0,
      color: '',
      material: '',
      psu_max_length: 0,
      cpu_cooler_height: 0,
      max_gpu_length: 0,
      form_factor: [],
    },
  });

  const coolingForm = useForm<CoolingFormValues>({
    resolver: zodResolver(coolingSchema),
    defaultValues: {
      cooling_type: CoolingType.AIR_COOLER,
      length: 0,
      width: 0,
      height: 0,
      socket_support: [],
      fan_speed: 0,
      noise_level: 0,
      fan_size: 0,
    },
  });

  // Reset form khi đóng dialog
  const resetForms = useCallback(() => {
    baseForm.reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category_id: [],
      is_active: true,
      type: ProductType.CPU,
      specifications: {},
      images: [],
      brand_id: null,
    });
    cpuForm.reset({
      socket_type: SocketType.LGA1700,
      supported_chipsets: [],
      supported_ram: [],
      cores: 0,
      threads: 0,
      base_clock: '',
      boost_clock: '',
      wattage: 0,
      cache: '',
      tdp: 0,
      pcie_slots: 0,
      max_memory_capacity: 0,
      pcie_version: PCIeType.PCIE_4_0,
      has_integrated_gpu: false,
    });
    gpuForm.reset({
      chipset: '',
      memory_size: 0,
      memory_type: GpuMemoryType.GDDR6X,
      core_clock: '',
      boost_clock: '',
      min_psu_wattage: 0,
      power_connector: PowerConnectorType.PIN_8,
      tdp: 0,
      cuda_cores: 0,
      tensor_cores: 0,
      display_ports: [],
      pcie_version: PCIeType.PCIE_4_0,
      slot_size: '',
      length: 0,
    });
    psuForm.reset({
      wattage: 0,
      efficiency_rating: 0,
      form_factor: MainboardFormFactor.ATX,
      modular: false,
      input_voltage: 0,
      atx12v_version: ATX12VType.ATX12V_2_5,
      protection_features: [],
      pcie_connectors: 0,
      sata_connectors: 0,
      eps_connectors: 0,
      fan_size: 0,
      fan_speed: 0,
      noise_level: 0,
      fan_bearing: '',
      rgb: false,
    });
    mainboardForm.reset({
      socket_type: SocketType.LGA1700,
      form_factor: MainboardFormFactor.ATX,
      chipset: ChipsetType.Z790,
      ram_type: RamType.DDR4,
      ram_speed: 0,
      ram_slots: 0,
      max_ram_capacity: 0,
      pcie_slots: 0,
      pcie_version: PCIeType.PCIE_4_0,
      m2_slots: 0,
      sata_slots: 0,
      usb_ports: 0,
      rgb: false,
      size: '',
    });
    ramForm.reset({
      ram_type: RamType.DDR4,
      speed: 0,
      capacity: 0,
      latency: '',
      voltage: 0,
      module_type: ModuleType.DIMM,
      ecc_support: false,
      channel: ChannelType.DUAL,
      timing: '',
      rgb: false,
      heat_spreader: false,
    });
    storageForm.reset({
      storage_type: StorageType.HDD,
      capacity: 0,
      read_speed: 0,
      write_speed: 0,
      form_factor: '',
      cache: 0,
    });
    caseForm.reset({
      length: 0,
      width: 0,
      height: 0,
      color: '',
      material: '',
      psu_max_length: 0,
      cpu_cooler_height: 0,
      max_gpu_length: 0,
      form_factor: [],
    });
    coolingForm.reset({
      cooling_type: CoolingType.AIR_COOLER,
      length: 0,
      width: 0,
      height: 0,
      socket_support: [],
      fan_speed: 0,
      noise_level: 0,
      fan_size: 0,
    });
    setSpecs({});
    setSpecKey('');
    setSpecValue('');
    setActiveTab('basic');
  }, [
    baseForm,
    cpuForm,
    gpuForm,
    ramForm,
    storageForm,
    coolingForm,
    mainboardForm,
    caseForm,
    psuForm,
  ]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetchAllCategories({ size: 1000 });
        if (res.status === 200) {
          setCategories(res.data.categories);
        }
      } catch (_error) {
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh mục sản phẩm',
          variant: 'destructive',
        });
      }
    };
    getCategories();
  }, []);

  // Load data khi edit và dialog mở
  useEffect(() => {
    if (!open) return;

    if (isUpdate && product) {
      const loadProductData = async () => {
        try {
          setIsLoading(true);
          // Set base product data
          baseForm.reset({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category_id: product.categories.map((cat) => cat.id.toString()),
            is_active: product.is_active,
            type: product.type as ProductType,
            specifications: product.specifications || {},
            images: product.images || [],
            brand_id: product.brand_id || null,
          });

          setSpecs(product.specifications || {});

          if (product.type === ProductType.CPU) {
            const cpuRes = await fetchCPUDetails(product.id);
            if (cpuRes.status === 200) {
              cpuForm.reset(cpuRes.data);
            }
          }

          if (product.type === ProductType.GPU) {
            const gpuRes = await fetchGPUDetails(product.id);
            console.log(gpuRes.data);
            if (gpuRes.status === 200) {
              gpuForm.reset(gpuRes.data);
            }
          }

          if (product.type === ProductType.POWER_SUPPLY) {
            const psuRes = await fetchPSUDetails(product.id);
            if (psuRes.status === 200) {
              psuForm.reset(psuRes.data);
            }
          }

          if (product.type === ProductType.RAM) {
            const ramRes = await fetchRAMDetails(product.id);
            if (ramRes.status === 200) {
              ramForm.reset(ramRes.data);
            }
          }

          if (product.type === ProductType.STORAGE) {
            const storageRes = await fetchStorageDetails(product.id);
            if (storageRes.status === 200) {
              storageForm.reset(storageRes.data);
            }
          }

          if (product.type === ProductType.COOLING) {
            const coolingRes = await fetchCoolingDetails(product.id);
            if (coolingRes.status === 200) {
              coolingForm.reset(coolingRes.data);
            }
          }

          if (product.type === ProductType.MAINBOARD) {
            const mainboardRes = await fetchMainboardDetails(product.id);
            if (mainboardRes.status === 200) {
              mainboardForm.reset(mainboardRes.data);
            }
          }

          if (product.type === ProductType.CASE) {
            const caseRes = await fetchCaseDetails(product.id);
            if (caseRes.status === 200) {
              caseForm.reset(caseRes.data);
            }
          }
        } catch (error) {
          toast({
            title: 'Lỗi',
            description: 'Không thể tải thông tin sản phẩm',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      loadProductData();
    } else {
      resetForms();
    }
  }, [
    open,
    product,
    isUpdate,
    baseForm,
    cpuForm,
    gpuForm,
    psuForm,
    ramForm,
    storageForm,
    coolingForm,
    mainboardForm,
    caseForm,
    resetForms,
  ]);

  const handleAddSpec = () => {
    if (specKey && specValue) {
      const newSpecs = {
        ...specs,
        [specKey]: specValue,
      };
      setSpecs(newSpecs);
      setSpecKey('');
      setSpecValue('');
      baseForm.setValue('specifications', newSpecs);
    }
  };

  const handleRemoveSpec = (key: string) => {
    const newSpecs = { ...specs };
    delete newSpecs[key];
    setSpecs(newSpecs);
    baseForm.setValue('specifications', newSpecs);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validate form dựa vào type đang được chọn
      const baseValid = await baseForm.trigger();
      let specificFormValid = false;

      const baseData = baseForm.getValues();
      let specificData = {};

      switch (product?.type || baseData.type) {
        case ProductType.CPU:
          specificFormValid = await cpuForm.trigger();
          specificData = cpuForm.getValues();
          break;
        case ProductType.GPU:
          specificFormValid = await gpuForm.trigger();
          specificData = gpuForm.getValues();
          break;
        case ProductType.POWER_SUPPLY:
          specificFormValid = await psuForm.trigger();
          specificData = psuForm.getValues();
          break;
        case ProductType.RAM:
          specificFormValid = await ramForm.trigger();
          specificData = ramForm.getValues();
          break;
        case ProductType.STORAGE:
          specificFormValid = await storageForm.trigger();
          specificData = storageForm.getValues();
          break;
        case ProductType.COOLING:
          specificFormValid = await coolingForm.trigger();
          specificData = coolingForm.getValues();
          break;
        case ProductType.MAINBOARD:
          specificFormValid = await mainboardForm.trigger();
          specificData = mainboardForm.getValues();
          break;
        case ProductType.CASE:
          specificFormValid = await caseForm.trigger();
          specificData = caseForm.getValues();
          break;
      }

      if (!baseValid || !specificFormValid) {
        // Lấy lỗi từ baseForm
        const baseFormErrors = baseForm.formState.errors;
        console.log('Lỗi form cơ bản:', baseFormErrors);

        // Lấy lỗi từ form chi tiết tương ứng
        let specificFormErrors = {};
        switch (product?.type || baseData.type) {
          case ProductType.CPU:
            specificFormErrors = cpuForm.formState.errors;
            break;
          case ProductType.GPU:
            specificFormErrors = gpuForm.formState.errors;
            break;
          case ProductType.POWER_SUPPLY:
            specificFormErrors = psuForm.formState.errors;
            break;
          case ProductType.RAM:
            specificFormErrors = ramForm.formState.errors;
            break;
          case ProductType.STORAGE:
            specificFormErrors = storageForm.formState.errors;
            break;
          case ProductType.COOLING:
            specificFormErrors = coolingForm.formState.errors;
            break;
          case ProductType.MAINBOARD:
            specificFormErrors = mainboardForm.formState.errors;
            break;
          case ProductType.CASE:
            specificFormErrors = caseForm.formState.errors;
            break;
        }
        console.log('Lỗi form chi tiết:', specificFormErrors);

        toast({
          title: 'Lỗi validation',
          description:
            'Vui lòng kiểm tra lại thông tin. Xem console để biết chi tiết lỗi.',
          variant: 'destructive',
        });
        return;
      }

      const submitData = {
        ...baseData,
        ...specificData,
        category_id: baseData.category_id.map((id) => Number(id)),
        brand_id: baseData.brand_id,
      };

      // Xử lý cập nhật sản phẩm
      if (product) {
        try {
          const updateData = {
            id: Number(product.id),
            ...submitData,
          };

          const baseProductResponse = await updateProduct({
            id: Number(product.id),
            name: submitData.name,
            description: submitData.description,
            price: submitData.price,
            stock: submitData.stock,
            images: submitData.images,
            is_active: submitData.is_active,
            type: submitData.type,
            category_id: submitData.category_id,
            brand_id: submitData.brand_id,
            specifications: submitData.specifications,
          });

          if (baseProductResponse?.status !== 200) {
            throw new Error('Cập nhật thông tin cơ bản thất bại');
          }

          let response;
          switch (product.type) {
            case ProductType.CPU:
              response = await updateCPU(updateData);
              break;
            case ProductType.GPU:
              response = await updateGPU(updateData);
              break;
            case ProductType.POWER_SUPPLY:
              response = await updatePSU(updateData);
              break;
            case ProductType.RAM:
              response = await updateRam(updateData);
              break;
            case ProductType.STORAGE:
              response = await updateStorage(updateData);
              break;
            case ProductType.COOLING:
              response = await updateCooling(updateData);
              break;
            case ProductType.MAINBOARD:
              response = await updateMainboard(updateData);
              break;
            case ProductType.CASE:
              response = await updateCase(updateData);
              break;
          }

          if (response?.status === 200) {
            toast({
              title: 'Thành công',
              description: `Cập nhật sản phẩm loại ${product.type} thành công`,
            });
            onRefresh?.();
            onClose();
          } else {
            throw new Error('Cập nhật thông tin chi tiết thất bại');
          }
        } catch (error: any) {
          console.error('Lỗi khi cập nhật sản phẩm:', error);
          toast({
            title: 'Lỗi',
            description: 'Có lỗi xảy ra khi cập nhật sản phẩm',
            variant: 'destructive',
          });
        }
      }
      // Xử lý tạo mới sản phẩm
      else {
        try {
          let response;
          switch (baseData.type) {
            case ProductType.CPU:
              response = await createCPU(submitData);
              break;
            case ProductType.GPU:
              response = await createGPU(submitData);
              break;
            case ProductType.POWER_SUPPLY:
              response = await createPSU(submitData);
              break;
            case ProductType.RAM:
              console.log('submitData', submitData);
              response = await createRam(submitData);
              break;
            case ProductType.STORAGE:
              response = await createStorage(submitData);
              break;
            case ProductType.COOLING:
              response = await createCooling(submitData);
              break;
            case ProductType.MAINBOARD:
              response = await createMainboard(submitData);
              break;
            case ProductType.CASE:
              response = await createCase(submitData);
              break;
          }

          if (response?.status === 201) {
            toast({
              title: 'Thành công',
              description: `Thêm sản phẩm loại ${baseData.type} thành công`,
            });
            onRefresh?.();
            onClose();
          }
        } catch (error: any) {
          toast({
            title: 'Lỗi tạo mới',
            description:
              error.response?.data?.message ||
              'Có lỗi xảy ra khi thêm sản phẩm',
            variant: 'destructive',
          });
          console.error('Create error:', error);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra, vui lòng thử lại',
        variant: 'destructive',
      });
      console.error('General error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    try {
      setIsLoading(true);
      const res = await deleteProduct(product.id);
      if (res.status === 200) {
        toast({
          title: 'Thành công',
          description: 'Xóa sản phẩm thành công',
        });
        onRefresh?.();
        handleClose();
      }
    } catch (_error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi xóa sản phẩm',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderDetailForm = () => {
    const currentType =
      isUpdate && product ? product.type : baseForm.getValues().type;

    switch (currentType) {
      case ProductType.CPU:
        return <CPUForm form={cpuForm} />;
      case ProductType.GPU:
        return <GPUForm form={gpuForm} />;
      case ProductType.POWER_SUPPLY:
        return <PSUForm form={psuForm} />;
      case ProductType.RAM:
        return <RAMForm form={ramForm} />;
      case ProductType.STORAGE:
        return <StorageForm form={storageForm} />;
      case ProductType.COOLING:
        return <CoolingForm form={coolingForm} />;
      case ProductType.MAINBOARD:
        return <MainboardForm form={mainboardForm} />;
      case ProductType.CASE:
        return <CaseForm form={caseForm} />;
      default:
        return null;
    }
  };

  // useEffect(() => {
  //   const subscription = baseForm.watch((value, { name }) => {
  //     if (name === 'type') {
  //       cpuForm.reset();
  //       gpuForm.reset();
  //       psuForm.reset();
  //       ramForm.reset();
  //       storageForm.reset();
  //       coolingForm.reset();
  //       mainboardForm.reset();
  //       caseForm.reset();
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [
  //   baseForm,
  //   cpuForm,
  //   gpuForm,
  //   psuForm,
  //   ramForm,
  //   storageForm,
  //   coolingForm,
  //   mainboardForm,
  //   caseForm,
  // ]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='basic'>Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value='details'>Thông tin chi tiết</TabsTrigger>
          </TabsList>

          <TabsContent value='basic' className='space-y-4'>
            <BaseProductForm
              form={baseForm}
              categories={categories}
              specs={specs}
              specKey={specKey}
              specValue={specValue}
              setSpecKey={setSpecKey}
              setSpecValue={setSpecValue}
              handleAddSpec={handleAddSpec}
              handleRemoveSpec={handleRemoveSpec}
            />
          </TabsContent>

          <TabsContent value='details' className='space-y-4'>
            {renderDetailForm()}
          </TabsContent>
        </Tabs>

        <div className='flex justify-end space-x-2'>
          {isUpdate && (
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={isLoading}
            >
              Xóa
            </Button>
          )}
          <Button variant='outline' onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isUpdate ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
