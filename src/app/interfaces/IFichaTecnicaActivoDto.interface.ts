import { EInventoryCategory } from '../enums/categoria-inventario.enum';
import { EState } from '../enums/state.enum';

export interface IFichaTecnicaActivoDto {
  id: number;
  nameMachinery: string;
  ubication: string;
  brand: string;
  serie: string;
  model: string;
  photoPath: string;
  state: EState;
  inventoryCategory: EInventoryCategory;
  dateOfPurchase: string;
  technicalSpecifications: string;
  observations: string;
  equipoClasificacion: string;
}
