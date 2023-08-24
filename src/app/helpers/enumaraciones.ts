import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';

export function onGetEnum(enumeracion: any): ISelectItemDto[] {
  const enumeraciones: ISelectItemDto[] = [];

  for (const [key, value] of Object.entries(enumeracion)) {
    if (isNaN(Number(key))) {
      enumeraciones.push({ label: key, value });
    }
  }

  return enumeraciones;
}
