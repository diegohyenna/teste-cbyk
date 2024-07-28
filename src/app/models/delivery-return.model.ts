import { Delivery } from './delivery.model';

export interface DeliveryReturn {
  page: number;
  data: Delivery[];
  total: number;
  size: number;
  prevPage?: number | null;
  nextPage?: number | null;
}
