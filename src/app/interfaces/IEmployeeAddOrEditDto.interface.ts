import { ESex } from 'src/app/enums/sexo.enum';
import { ETypeContract } from 'src/app/enums/tipo-contrato.enum';
import { EAreaResponsable } from '../enums/area-responsable.enum';
import { EMaritalStatus } from '../enums/estado-civil.enum';
import { EEducationLevel } from '../enums/nivel-educacion.enum';

export interface IEmployeeAddOrEditDto {
  dateCreation: string | null;
  lastName: string;
  salary: number;
  typeContract: ETypeContract | null;
  curp: string;
  rFC: string;
  nSS: string;
  sex: ESex | null;
  dateAdmission: string;
  address: string;
  localPhone: string;
  bloodType: any;
  nationality: string;
  maritalStatus: EMaritalStatus | null;
  educationLevel: EEducationLevel | null;
  area: EAreaResponsable | null;
}
