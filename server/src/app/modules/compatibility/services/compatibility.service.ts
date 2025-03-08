import { Injectable, NotFoundException } from '@nestjs/common';
import { CPU } from '../../products/entities/cpu.entity';
import { GPU } from '../../products/entities/gpu.entity';
import { Mainboard } from '../../products/entities/mainboard.entity';
import { RAM } from '../../products/entities/ram.entity';
import { PSU } from '../../products/entities/psu.entity';
import { Case } from '../../products/entities/case.entity';
import { Cooling } from '../../products/entities/cooling.entity';
import { ChipsetType } from '../../products/enums/chipset-type.enum';
import { RamType } from '../../products/enums/ram-type.enum';
import { PowerConnectorType } from '../../products/enums/power-connector-type.enum';
import { StorageType } from '../../products/enums/storage-type.enum';
import { Storage } from '../../products/entities/storage.entity';
import {
  CompatibilityReq,
  CompatibilityByIdReq,
  CompatibilityByProductIdsReq,
} from '../controllers/types/compatibility.req';
import { CpuRes } from 'src/app/modules/products/controllers/types/cpu_types/cpu.res';
import { GpuRes } from 'src/app/modules/products/controllers/types/gpu_types/gpu.res';
import { PsuRes } from 'src/app/modules/products/controllers/types/psu_types/psu.res';
import { CpuRepository } from '../../products/repositories/cpu.repositories';
import { GpuRepository } from '../../products/repositories/gpu.repositories';
import { MainboardRepository } from '../../products/repositories/mainboard.repositories';
import { RamRepository } from '../../products/repositories/ram.repositories';
import { PsuRepository } from '../../products/repositories/psu.repositories';
import { CaseRepository } from '../../products/repositories/case.repositories';
import { CoolingRepository } from '../../products/repositories/cooling.repositories';
import { StorageRepository } from '../../products/repositories/storage.repositories';
import { ProductRepository } from '../../products/repositories/products.repositories';
import { ProductType } from '../../products/enums/product-type.enum';

@Injectable()
export class CompatibilityService {
  constructor(
    private readonly cpuRepository: CpuRepository,
    private readonly gpuRepository: GpuRepository,
    private readonly mainboardRepository: MainboardRepository,
    private readonly ramRepository: RamRepository,
    private readonly psuRepository: PsuRepository,
    private readonly caseRepository: CaseRepository,
    private readonly coolingRepository: CoolingRepository,
    private readonly storageRepository: StorageRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  // Phương thức mới để kiểm tra tương thích bằng danh sách ID sản phẩm
  async checkCompatibilityByProductIds(
    compatibilityByProductIdsReq: CompatibilityByProductIdsReq,
  ) {
    const { products } = compatibilityByProductIdsReq;

    // Tạo một đối tượng CompatibilityReq để tái sử dụng phương thức checkCompatibility
    const compatibilityReq: CompatibilityReq = {};

    try {
      // Lấy thông tin sản phẩm từ danh sách ID
      for (const productItem of products) {
        const { product_id, product_type } = productItem;

        // Lấy thông tin sản phẩm từ ID
        const product = await this.productRepository.findById(product_id);
        if (!product) {
          throw new NotFoundException(
            `Không tìm thấy sản phẩm với ID ${product_id}`,
          );
        }

        // Kiểm tra xem loại sản phẩm có khớp với loại đã chỉ định không
        if (product.type !== product_type) {
          throw new NotFoundException(
            `Sản phẩm với ID ${product_id} không phải là loại ${product_type}`,
          );
        }

        // Lấy thông tin chi tiết của sản phẩm dựa trên loại
        switch (product_type) {
          case ProductType.CPU:
            const cpu = await this.cpuRepository.findById(product_id);
            if (!cpu) {
              throw new NotFoundException(
                `Không tìm thấy CPU với ID ${product_id}`,
              );
            }
            compatibilityReq.cpu = cpu as unknown as CpuRes;
            break;

          case ProductType.GPU:
            const gpu = await this.gpuRepository.findById(product_id);
            if (!gpu) {
              throw new NotFoundException(
                `Không tìm thấy GPU với ID ${product_id}`,
              );
            }
            compatibilityReq.gpu = gpu as unknown as GpuRes;
            break;

          case ProductType.MAINBOARD:
            const mainboard =
              await this.mainboardRepository.findById(product_id);
            if (!mainboard) {
              throw new NotFoundException(
                `Không tìm thấy Mainboard với ID ${product_id}`,
              );
            }
            compatibilityReq.mainboard = mainboard as any;
            break;

          case ProductType.RAM:
            const ram = await this.ramRepository.findById(product_id);
            if (!ram) {
              throw new NotFoundException(
                `Không tìm thấy RAM với ID ${product_id}`,
              );
            }
            if (!compatibilityReq.rams) {
              compatibilityReq.rams = [];
            }
            compatibilityReq.rams.push(ram as any);
            break;

          case ProductType.POWER_SUPPLY:
            const psu = await this.psuRepository.findById(product_id);
            if (!psu) {
              throw new NotFoundException(
                `Không tìm thấy PSU với ID ${product_id}`,
              );
            }
            compatibilityReq.psu = psu as unknown as PsuRes;
            break;

          case ProductType.CASE:
            const computerCase = await this.caseRepository.findById(product_id);
            if (!computerCase) {
              throw new NotFoundException(
                `Không tìm thấy Case với ID ${product_id}`,
              );
            }
            compatibilityReq.computerCase = computerCase as any;
            break;

          case ProductType.COOLING:
            const cooling = await this.coolingRepository.findById(product_id);
            if (!cooling) {
              throw new NotFoundException(
                `Không tìm thấy Cooling với ID ${product_id}`,
              );
            }
            compatibilityReq.cooling = cooling as any;
            break;

          case ProductType.STORAGE:
            const storage = await this.storageRepository.findById(product_id);
            if (!storage) {
              throw new NotFoundException(
                `Không tìm thấy Storage với ID ${product_id}`,
              );
            }
            if (!compatibilityReq.storages) {
              compatibilityReq.storages = [];
            }
            compatibilityReq.storages.push(storage as any);
            break;

          default:
            throw new NotFoundException(
              `Loại sản phẩm ${product_type} không được hỗ trợ`,
            );
        }
      }

      // Gọi phương thức checkCompatibility với dữ liệu đã lấy
      return this.checkCompatibility(compatibilityReq);
    } catch (error) {
      return {
        isCompatible: false,
        messages: [
          error.message || 'Có lỗi xảy ra khi kiểm tra tính tương thích',
        ],
      };
    }
  }

  checkCompatibility(compatibilityReq: CompatibilityReq) {
    const { cpu, gpu, mainboard, rams, psu, computerCase, cooling, storages } =
      compatibilityReq;

    let warnings: string[] = [];
    let errors: string[] = [];
    let infos: string[] = [];

    // Kiểm tra xem có đủ linh kiện để kiểm tra không
    if (!cpu || !mainboard) {
      return {
        isCompatible: false,
        messages: [
          'Cần ít nhất CPU và Mainboard để kiểm tra tính tương thích.',
        ],
      };
    }

    // Kiểm tra các linh kiện thiếu
    if (!computerCase) {
      infos.push(
        'THÔNG TIN: Bạn chưa chọn case cho cấu hình. Chúng tôi có thể giúp bạn chọn case phù hợp cho cấu hình này.',
      );
    }

    if (!cooling) {
      infos.push(
        'THÔNG TIN: Bạn chưa chọn tản nhiệt cho CPU. Nếu CPU của bạn không đi kèm tản nhiệt, bạn nên chọn một tản nhiệt phù hợp.',
      );
    }

    if (!psu) {
      infos.push(
        'THÔNG TIN: Bạn chưa chọn nguồn (PSU) cho cấu hình. Nguồn là thành phần quan trọng để cung cấp điện cho các linh kiện.',
      );
    }

    if (!rams || rams.length === 0) {
      infos.push(
        'THÔNG TIN: Bạn chưa chọn RAM cho cấu hình. RAM là thành phần cần thiết để máy tính hoạt động.',
      );
    }

    if (!storages || storages.length === 0) {
      infos.push(
        'THÔNG TIN: Bạn chưa chọn ổ cứng cho cấu hình. Ổ cứng là nơi lưu trữ hệ điều hành và dữ liệu của bạn.',
      );
    }

    // Kiểm tra GPU tích hợp
    if (cpu.has_integrated_gpu === false && !gpu) {
      errors.push(
        'LỖI: CPU không có GPU tích hợp, cần thêm GPU rời để hiển thị hình ảnh!',
      );
    } else if (cpu.has_integrated_gpu === true && !gpu) {
      infos.push(
        'THÔNG TIN: Cấu hình này sẽ sử dụng GPU tích hợp từ CPU. Phù hợp cho các tác vụ văn phòng và giải trí cơ bản.',
      );

      // Kiểm tra xem mainboard có hỗ trợ đầu ra video cho GPU tích hợp không
      if (mainboard.has_video_ports === false) {
        errors.push(
          'LỖI: Mainboard không có cổng xuất hình ảnh cho GPU tích hợp từ CPU!',
        );
      } else if (mainboard.has_video_ports === undefined) {
        warnings.push(
          'CẢNH BÁO: Không có thông tin về cổng xuất hình ảnh của Mainboard. Vui lòng kiểm tra thêm.',
        );
      }
    } else if (cpu.has_integrated_gpu === undefined && !gpu) {
      warnings.push(
        'CẢNH BÁO: Không có thông tin về GPU tích hợp của CPU. Nếu CPU không có GPU tích hợp, bạn sẽ cần thêm GPU rời.',
      );
    } else if (cpu.has_integrated_gpu === true && gpu) {
      infos.push(
        'THÔNG TIN: CPU có GPU tích hợp nhưng bạn đã thêm GPU rời. Hệ thống sẽ ưu tiên sử dụng GPU rời để có hiệu năng tốt hơn.',
      );
    } else if (cpu.has_integrated_gpu === false && gpu) {
      infos.push(
        'THÔNG TIN: CPU không có GPU tích hợp và bạn đã thêm GPU rời. Đây là cấu hình phù hợp.',
      );
    }

    // CPU - Mainboard
    if (cpu.socket_type !== mainboard.socket_type) {
      errors.push('LỖI: CPU và Mainboard không cùng socket!');
    } else {
      infos.push(
        `THÔNG TIN: CPU và Mainboard tương thích với socket ${cpu.socket_type}.`,
      );
    }

    if (
      cpu.supported_chipsets &&
      !cpu.supported_chipsets.includes(mainboard.chipset as ChipsetType)
    ) {
      errors.push('LỖI: Mainboard không hỗ trợ chipset của CPU!');
    } else if (cpu.supported_chipsets) {
      infos.push(
        `THÔNG TIN: Chipset ${mainboard.chipset} của Mainboard tương thích với CPU.`,
      );
    }

    // RAM
    if (rams && rams.length > 0) {
      const totalRamCapacity = rams.reduce((sum, ram) => sum + ram.capacity, 0);
      infos.push(`THÔNG TIN: Tổng dung lượng RAM là ${totalRamCapacity}GB.`);

      if (
        mainboard.max_ram_capacity &&
        totalRamCapacity > mainboard.max_ram_capacity
      ) {
        errors.push(
          `LỖI: Tổng dung lượng RAM (${totalRamCapacity}GB) vượt quá mức tối đa của Mainboard (${mainboard.max_ram_capacity}GB)!`,
        );
      } else if (mainboard.max_ram_capacity) {
        infos.push(
          `THÔNG TIN: Mainboard hỗ trợ tối đa ${mainboard.max_ram_capacity}GB RAM.`,
        );
      }

      if (
        cpu.max_memory_capacity &&
        totalRamCapacity > cpu.max_memory_capacity
      ) {
        errors.push(
          `LỖI: Tổng dung lượng RAM (${totalRamCapacity}GB) vượt quá mức tối đa của CPU (${cpu.max_memory_capacity}GB)!`,
        );
      } else if (cpu.max_memory_capacity) {
        infos.push(
          `THÔNG TIN: CPU hỗ trợ tối đa ${cpu.max_memory_capacity}GB RAM.`,
        );
      }

      // Kiểm tra từng thanh RAM
      for (const ram of rams) {
        if (
          cpu.supported_ram &&
          !cpu.supported_ram.some(
            (ramOption) => ramOption.ram_type === ram.ram_type,
          )
        ) {
          errors.push('LỖI: RAM không tương thích với CPU!');
          break;
        }

        if (cpu.supported_ram) {
          const matchingRAM = cpu.supported_ram.find(
            (ramOption) => ramOption.ram_type === ram.ram_type,
          );
          if (matchingRAM && ram.speed > matchingRAM.max_speed) {
            warnings.push(
              `CẢNH BÁO: RAM sẽ bị giới hạn tốc độ xuống ${matchingRAM.max_speed}MHz do CPU không hỗ trợ tốc độ cao hơn.`,
            );
          } else if (matchingRAM) {
            infos.push(`THÔNG TIN: RAM ${ram.ram_type} tương thích với CPU.`);
          }
        }

        if (ram.ram_type !== mainboard.ram_type) {
          errors.push('LỖI: RAM và Mainboard không cùng loại RAM!');
          break;
        } else {
          infos.push(
            `THÔNG TIN: RAM ${ram.ram_type} tương thích với Mainboard.`,
          );
        }

        if (mainboard.ram_speed && ram.speed > mainboard.ram_speed) {
          warnings.push(
            `CẢNH BÁO: RAM sẽ bị giới hạn tốc độ xuống ${mainboard.ram_speed}MHz do Mainboard không hỗ trợ tốc độ cao hơn.`,
          );
        } else if (mainboard.ram_speed && ram.speed <= mainboard.ram_speed) {
          infos.push(
            `THÔNG TIN: Tốc độ RAM ${ram.speed}MHz được Mainboard hỗ trợ.`,
          );
        }
      }
    }

    // GPU
    if (gpu) {
      if (
        gpu.pcie_version &&
        mainboard.pcie_version &&
        gpu.pcie_version > mainboard.pcie_version
      ) {
        warnings.push(
          `CẢNH BÁO: GPU yêu cầu phiên bản PCIe ${gpu.pcie_version} cao hơn so với Mainboard (${mainboard.pcie_version})!`,
        );
      } else if (gpu.pcie_version && mainboard.pcie_version) {
        infos.push(
          `THÔNG TIN: GPU tương thích với phiên bản PCIe ${mainboard.pcie_version} của Mainboard.`,
        );
      }

      // PSU - GPU
      if (psu && gpu.power_connector) {
        const powerCheckResult = this.checkPowerConnectors(psu, gpu);
        if (powerCheckResult === 'error') {
          errors.push(
            `LỖI: PSU không có đủ cổng PCIe cho GPU (cần ${gpu.power_connector === PowerConnectorType.PIN_16 ? '3 cổng 8-pin' : gpu.power_connector})`,
          );
        } else if (powerCheckResult === 'warning') {
          warnings.push(
            'CẢNH BÁO: GPU cần dùng adapter từ 3 x 8-pin sang 16-pin. Hãy đảm bảo PSU có công suất đủ mạnh!',
          );
        } else {
          infos.push('THÔNG TIN: PSU có đủ cổng kết nối cho GPU.');
        }
      }
    }

    // PSU
    if (psu && cpu && gpu) {
      const totalPowerRequired = (cpu.tdp || 0) + (gpu.tdp || 0) + 100;
      if (psu.wattage < totalPowerRequired) {
        errors.push(
          `LỖI: PSU không đủ công suất (${psu.wattage}W) để cung cấp cho tất cả các thành phần (cần khoảng ${totalPowerRequired}W)!`,
        );
      } else {
        const headroom = psu.wattage - totalPowerRequired;
        if (headroom < 100) {
          warnings.push(
            `CẢNH BÁO: PSU có công suất ${psu.wattage}W, chỉ cao hơn nhu cầu ước tính (${totalPowerRequired}W) khoảng ${headroom}W. Nên chọn PSU có công suất dự phòng cao hơn.`,
          );
        } else {
          infos.push(
            `THÔNG TIN: PSU có công suất ${psu.wattage}W, đủ để cung cấp cho cấu hình (cần khoảng ${totalPowerRequired}W).`,
          );
        }
      }
    } else if (psu && cpu && !gpu) {
      const totalPowerRequired = (cpu.tdp || 0) + 50; // Ước tính cho các thành phần khác
      if (psu.wattage < totalPowerRequired) {
        errors.push(
          `LỖI: PSU không đủ công suất (${psu.wattage}W) để cung cấp cho cấu hình (cần khoảng ${totalPowerRequired}W)!`,
        );
      } else {
        infos.push(
          `THÔNG TIN: PSU có công suất ${psu.wattage}W, đủ để cung cấp cho cấu hình (cần khoảng ${totalPowerRequired}W).`,
        );
      }
    }

    // Storage
    if (storages && storages.length > 0 && mainboard) {
      let m2Count = 0;
      let sataCount = 0;

      for (const storage of storages) {
        if (storage.storage_type === StorageType.M2) {
          m2Count++;
        } else if (storage.storage_type === StorageType.SATA) {
          sataCount++;
        }
      }

      if (m2Count > 0) {
        infos.push(`THÔNG TIN: Cấu hình có ${m2Count} ổ M.2.`);
      }

      if (sataCount > 0) {
        infos.push(`THÔNG TIN: Cấu hình có ${sataCount} ổ SATA.`);
      }

      if (mainboard.m2_slots && m2Count > mainboard.m2_slots) {
        errors.push(
          `LỖI: Số lượng ổ M.2 (${m2Count}) vượt quá số slot M.2 của Mainboard (${mainboard.m2_slots})!`,
        );
      } else if (mainboard.m2_slots) {
        infos.push(
          `THÔNG TIN: Mainboard hỗ trợ tối đa ${mainboard.m2_slots} ổ M.2.`,
        );
      }

      if (mainboard.sata_slots && sataCount > mainboard.sata_slots) {
        errors.push(
          `LỖI: Số lượng ổ SATA (${sataCount}) vượt quá số cổng SATA của Mainboard (${mainboard.sata_slots})!`,
        );
      } else if (mainboard.sata_slots) {
        infos.push(
          `THÔNG TIN: Mainboard hỗ trợ tối đa ${mainboard.sata_slots} ổ SATA.`,
        );
      }
    }

    // Case - Mainboard
    if (computerCase && mainboard) {
      if (
        computerCase.form_factor &&
        !computerCase.form_factor.includes(mainboard.form_factor)
      ) {
        errors.push(
          `LỖI: Case không hỗ trợ mainboard form factor ${mainboard.form_factor}!`,
        );
      } else if (computerCase.form_factor) {
        infos.push(
          `THÔNG TIN: Case hỗ trợ mainboard form factor ${mainboard.form_factor}.`,
        );
      }
    }

    // Case - GPU
    if (computerCase && gpu && gpu.length && computerCase.max_gpu_length) {
      if (gpu.length > computerCase.max_gpu_length) {
        errors.push(
          `LỖI: GPU quá dài (${gpu.length}mm) so với độ dài tối đa mà case hỗ trợ (${computerCase.max_gpu_length}mm)!`,
        );
      } else {
        const clearance = computerCase.max_gpu_length - gpu.length;
        infos.push(
          `THÔNG TIN: GPU (${gpu.length}mm) vừa với case (hỗ trợ tối đa ${computerCase.max_gpu_length}mm), còn dư ${clearance}mm.`,
        );
      }
    }

    // Case - Cooling
    if (
      cooling &&
      computerCase &&
      cooling.height &&
      computerCase.cpu_cooler_height
    ) {
      if (cooling.height > computerCase.cpu_cooler_height) {
        errors.push(
          `LỖI: CPU Cooler quá cao (${cooling.height}mm) so với độ cao tối đa mà case hỗ trợ (${computerCase.cpu_cooler_height}mm)!`,
        );
      } else {
        const clearance = computerCase.cpu_cooler_height - cooling.height;
        infos.push(
          `THÔNG TIN: Tản nhiệt CPU (${cooling.height}mm) vừa với case (hỗ trợ tối đa ${computerCase.cpu_cooler_height}mm), còn dư ${clearance}mm.`,
        );
      }
    }

    // Kết quả
    // Loại bỏ các thông tin trùng lặp
    const uniqueInfos = [...new Set(infos)];
    const uniqueWarnings = [...new Set(warnings)];
    const uniqueErrors = [...new Set(errors)];

    // Sắp xếp thông báo theo mức độ nghiêm trọng: Lỗi > Cảnh báo > Thông tin
    const messages = [...uniqueErrors, ...uniqueWarnings, ...uniqueInfos];

    if (
      uniqueErrors.length === 0 &&
      uniqueWarnings.length === 0 &&
      uniqueInfos.length === 0
    ) {
      messages.push(
        'THÔNG TIN: Tất cả các linh kiện đều tương thích với nhau.',
      );
    }

    return {
      isCompatible: uniqueErrors.length === 0,
      messages,
    };
  }

  private checkPowerConnectors(
    psu: PsuRes,
    gpu: GpuRes,
  ): 'ok' | 'warning' | 'error' {
    if (!psu.pcie_connectors || !gpu.power_connector) {
      return 'ok'; // Không đủ thông tin để kiểm tra
    }

    if (gpu.power_connector === PowerConnectorType.PIN_16) {
      // Kiểm tra xem PSU có đủ cổng PCIe không
      if (psu.pcie_connectors >= 3) {
        return 'warning'; // Có thể dùng adapter từ 3 x 8-pin sang 16-pin
      }
      return 'error'; // Không đủ 8-pin để dùng adapter
    }

    // Kiểm tra dựa trên số lượng cổng PCIe
    const requiredConnectors =
      gpu.power_connector === PowerConnectorType.PIN_8
        ? 1
        : gpu.power_connector === PowerConnectorType.PIN_6
          ? 1
          : 0;

    return psu.pcie_connectors >= requiredConnectors ? 'ok' : 'error';
  }
}
