import { ETypePiscina } from '../enums/type-piscina.enum';

export interface PiscinaAddOrEditDto {
  id: number;
  customerId: number;
  name: string;
  ubication: string;
  volumen: number;
  typePiscina: ETypePiscina;
  pathImage: File | null;
  employeeId: number;
}
