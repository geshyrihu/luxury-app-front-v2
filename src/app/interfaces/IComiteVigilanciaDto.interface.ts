import { ECargoComite } from '../enums/cargo-comite.enum';
import { IListCondominoDto } from './IListCondominoDto.interface';

export interface IComiteVigilanciaDto {
  id: number;
  listCondominoId: number;
  listCondomino: IListCondominoDto;
  ePosicionComite: ECargoComite;
}
