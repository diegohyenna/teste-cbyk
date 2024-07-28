import { Delivery } from './delivery.model';

export type DeliveryReturn = {
  page: number;
  data: Delivery[];
  total: number;
  size: number;
  prevPage?: number | null;
  nextPage?: number | null;
  isLoading?: boolean;
};
