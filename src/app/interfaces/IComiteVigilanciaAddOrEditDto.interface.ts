import { ECargoComite } from '../enums/cargo-comite.enum';

export interface IComiteVigilanciaAddOrEditDto {
  listCondominoId: number;
  ePosicionComite: ECargoComite;
}
