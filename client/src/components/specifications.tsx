import type { ProductRes } from '@/services/types/response/product_types/product.res';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetchRamDetails } from '@/services/modules/product.service';

export async function Specifications({ product }: { product: ProductRes }) {
  switch (product.type) {
    case 'RAM':
      const ram = await fetchRamDetails(product.id);
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>
                Thông số kĩ thuật của {product.name}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium'>Dung lượng</TableCell>
              <TableCell>{ram.capacity}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Speed</TableCell>
              <TableCell>{ram.ram_speed}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Timing</TableCell>
              <TableCell>{ram.timing}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Voltage</TableCell>
              <TableCell>{ram.voltage}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Form Factor</TableCell>
              <TableCell>{ram.form_factor}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>RGB Lighting</TableCell>
              <TableCell>{ram.rgb ? 'Có' : 'Không'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

    case 'PSU':
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>Power Supply Specifications</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium'>Wattage</TableCell>
              <TableCell>{product.specs.wattage}W</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Efficiency Rating</TableCell>
              <TableCell>{product.specs.efficiency}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Modularity</TableCell>
              <TableCell>{product.specs.modularity}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Certification</TableCell>
              <TableCell>{product.specs.certification}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Fan Size</TableCell>
              <TableCell>{product.specs.fanSize}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium' colSpan={2}>
                Connectors
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PCIe 8-pin</TableCell>
              <TableCell>{product.specs.connectors.pcie8pin}x</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PCIe 6-pin</TableCell>
              <TableCell>{product.specs.connectors.pcie6pin}x</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SATA</TableCell>
              <TableCell>{product.specs.connectors.sata}x</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Molex</TableCell>
              <TableCell>{product.specs.connectors.molex}x</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

    case 'CPU':
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>Processor Specifications</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium'>Cores/Threads</TableCell>
              <TableCell>
                {product.specs.cores}C/{product.specs.threads}T
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Base Clock</TableCell>
              <TableCell>{product.specs.baseSpeed}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Boost Clock</TableCell>
              <TableCell>{product.specs.boostSpeed}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Socket</TableCell>
              <TableCell>{product.specs.socket}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium' colSpan={2}>
                Cache
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>L1 Cache</TableCell>
              <TableCell>{product.specs.cache.l1}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>L2 Cache</TableCell>
              <TableCell>{product.specs.cache.l2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>L3 Cache</TableCell>
              <TableCell>{product.specs.cache.l3}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>TDP</TableCell>
              <TableCell>{product.specs.tdp}W</TableCell>
            </TableRow>
            {product.specs.integratedGraphics && (
              <TableRow>
                <TableCell className='font-medium'>
                  Integrated Graphics
                </TableCell>
                <TableCell>{product.specs.integratedGraphics}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      );

    case 'GPU':
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>Graphics Card Specifications</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium' colSpan={2}>
                Memory
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Capacity</TableCell>
              <TableCell>{product.specs.memory.size}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>{product.specs.memory.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Interface</TableCell>
              <TableCell>{product.specs.memory.interface}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium' colSpan={2}>
                Clock Speeds
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Base Clock</TableCell>
              <TableCell>{product.specs.clocks.base}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Boost Clock</TableCell>
              <TableCell>{product.specs.clocks.boost}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium' colSpan={2}>
                Power
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>TDP</TableCell>
              <TableCell>{product.specs.power.tdp}W</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Recommended PSU</TableCell>
              <TableCell>{product.specs.power.recommended}W</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Power Connectors</TableCell>
              <TableCell>{product.specs.power.connectors}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium' colSpan={2}>
                Display Outputs
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>HDMI</TableCell>
              <TableCell>{product.specs.outputs.hdmi}x</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>DisplayPort</TableCell>
              <TableCell>{product.specs.outputs.displayPort}x</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

    case 'MOTHERBOARD':
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>Motherboard Specifications</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium'>Socket</TableCell>
              <TableCell>{product.specs.socket}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Form Factor</TableCell>
              <TableCell>{product.specs.formFactor}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium'>Chipset</TableCell>
              <TableCell>{product.specs.chipset}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium' colSpan={2}>
                Memory Support
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Memory Slots</TableCell>
              <TableCell>{product.specs.memory.slots}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Maximum Capacity</TableCell>
              <TableCell>{product.specs.memory.maxCapacity}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Memory Type</TableCell>
              <TableCell>{product.specs.memory.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Maximum Speed</TableCell>
              <TableCell>{product.specs.memory.maxSpeed}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium' colSpan={2}>
                Storage
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SATA Ports</TableCell>
              <TableCell>{product.specs.storage.sata}x</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>M.2 Slots</TableCell>
              <TableCell>{product.specs.storage.m2}x</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-medium' colSpan={2}>
                Expansion Slots
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PCIe x16</TableCell>
              <TableCell>{product.specs.expansion.pciEx16}x</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PCIe x4</TableCell>
              <TableCell>{product.specs.expansion.pciEx4}x</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PCIe x1</TableCell>
              <TableCell>{product.specs.expansion.pciEx1}x</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
  }
}
