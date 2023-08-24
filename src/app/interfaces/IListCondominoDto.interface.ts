import { EHabitant } from 'src/app/enums/habitante.enum';

export interface IListCondominoDto {
  id: number;
  habitant: EHabitant | null;
  nameDirectoryCondominium: string;
  extencion: string;
  fixedPhone: string;
  cellPhone: string;
  mail: string;
  directoryCondominiumId: number;
  directoryCondominium: string;
}
