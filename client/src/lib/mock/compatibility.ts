import type {
  Compatibility,
  BuilderItem,
} from '@/services/types/response/product_types/product.res';

export function checkCompatibility(items: BuilderItem[]): Compatibility {
  const messages: string[] = [];
  let isCompatible = true;

  // Get products by category
  const cpu = items.find((item) => item.product.category === 'CPU')?.product;
  const motherboard = items.find(
    (item) => item.product.category === 'MOTHERBOARD'
  )?.product;
  const ram = items.find((item) => item.product.category === 'RAM')?.product;
  const psu = items.find((item) => item.product.category === 'PSU')?.product;
  const gpu = items.find((item) => item.product.category === 'GPU')?.product;

  // Check CPU and Motherboard compatibility
  if (cpu && motherboard) {
    if (cpu.specs.socket !== motherboard.specs.socket) {
      messages.push(
        `CPU socket ${cpu.specs.socket} is not compatible with motherboard socket ${motherboard.specs.socket}`
      );
      isCompatible = false;
    }
  }

  // Check RAM compatibility
  if (ram && motherboard) {
    if (ram.specs.type !== motherboard.specs.memory.type) {
      messages.push(
        `RAM type ${ram.specs.type} is not compatible with motherboard memory type ${motherboard.specs.memory.type}`
      );
      isCompatible = false;
    }
  }

  // Check Power Supply
  if (psu) {
    let totalPower = 0;
    if (cpu) totalPower += cpu.specs.tdp;
    if (gpu) totalPower += gpu.specs.power.tdp;

    if (totalPower > psu.specs.wattage) {
      messages.push(
        `Power supply wattage (${psu.specs.wattage}W) is insufficient for system requirements (${totalPower}W)`
      );
      isCompatible = false;
    }
  }

  // If no issues found
  if (messages.length === 0) {
    messages.push('All components are compatible');
  }

  return { isCompatible, messages };
}
