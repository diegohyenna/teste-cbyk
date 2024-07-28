import { Observable } from 'rxjs';

export interface IApi<U> {
  baseUrl: string;
  getWithPaginationAndFilter(
    page: number,
    size: number,
    filters: string | null
  ): Observable<U>;
  getDeliverySuccessful(page: number, size: number): Observable<U>;
  getDeliveryUnsuccessful(page: number, size: number): Observable<U>;
  getListNeighborhood(page: number, size: number): Observable<U>;
}
