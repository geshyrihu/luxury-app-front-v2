import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';

export function toBase64(file: File) {
  return new Promise((resolve, rejects) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => rejects(err);
  });
}

export function onGetNameEnum(
  enumeracion: ISelectItemDto[],
  value: number
): string {
  let result: string = '';

  enumeracion.forEach((element) => {
    if (element.value == value) {
      result = element.label;
    }
  });
  return result;
}
