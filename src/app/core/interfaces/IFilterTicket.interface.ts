import { EStatusTask } from '../enums/estatus.enum';

export interface IFilterTicket {
  customer: any;
  status: EStatusTask;
  responsible: any;
  request: any;
  requestStart: any;
  finishedStart: any;
  requestEnd: any;
  finishedEnd: any;
  priority: any;
  folioReporte: boolean;
}
