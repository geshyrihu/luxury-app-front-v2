import { ETypeMeeting } from 'src/app/enums/tipo-reunion.enum';

export interface IMeetingIndexDto {
  id: number;
  customerId: number;
  date: string;
  eTypeMeeting: ETypeMeeting | null;
  issues: number;
  pending: number;
}
