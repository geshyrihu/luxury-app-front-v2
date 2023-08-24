import { IDataSets } from './auth/chart-data-set.interface';

export interface IChartData {
  labels: string[];
  dataSets: IDataSets[];
}
