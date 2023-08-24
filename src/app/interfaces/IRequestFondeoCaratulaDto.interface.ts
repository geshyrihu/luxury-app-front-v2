import { ETipoGasto } from '../enums/tipo-gasto.enum';

export interface IRequestFondeoCaratulaDto {
  customerId: number;
  fechaInicial: string;
  fechaFinal: string;
  eTipoGasto: ETipoGasto;
  cuenta: string;
  datoDePago: string;
  entregadoPor: string;
  ligaFacturas: string;
}
