import { EExtintor } from '../enums/extintor.enum';

export interface IInventarioExtintorDto {
  id: number;
  customerId: string;
  eExtintor: EExtintor;
  ubicacion: string;
}
