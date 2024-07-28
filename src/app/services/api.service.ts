import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, map, Observable, switchMap, concatAll, filter } from 'rxjs';

import { IApi } from '../interfaces/IApi.interface';
import { DeliveryReturn } from '../models/delivery-return.model';
import { Delivery } from '../models/delivery.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements IApi<DeliveryReturn> {
  baseUrl =
    'https://raw.githubusercontent.com/brunochikuji/example/main/entregas.json';

  constructor(private httpClient: HttpClient) {}

  getWithPaginationAndFilter(
    page = 1,
    size = 10,
    filters?: string | null
  ): Observable<DeliveryReturn> {
    return this.httpClient.get<Delivery[]>(this.baseUrl).pipe(
      map((delivery) => {
        delivery.sort((a, b) => (a.motorista.nome > b.motorista.nome ? 1 : -1));
        if (filters) {
          return this.getOnPaginationAndFilters(page, size, filters, delivery);
        } else {
          return this.getOnPagination(page, size, delivery);
        }
      })
    );
  }

  private getOnPagination(
    page: number,
    size: number,
    data: any[],
    total?: number
  ) {
    const firstItem = (page - 1) * size;
    const lastItem = firstItem + size;

    let itemsReturned: any;

    itemsReturned = this.filterByPagination(data, firstItem, lastItem);
    total = total ? total : data.length;

    return {
      page,
      size,
      nextPage: lastItem >= total ? null : ++page,
      prevPage: firstItem <= 1 ? null : --page,
      data: itemsReturned,
      total,
    };
  }

  private getOnPaginationAndFilters(
    page: number,
    size: number,
    filters: string,
    data: any
  ) {
    const queryArray = this.transformStringInArray(filters);
    let dataReturned = this.filterByQueriesParams(queryArray, data);
    return this.getOnPagination(page, size, dataReturned, dataReturned.length);
  }

  private filterByQueriesParams(
    queryString: { attr: string; value: string }[],
    deliveries: Delivery[]
  ) {
    let result = deliveries;
    queryString.forEach((param) => {
      result = this.filterByQueriesParamsRecursive(
        param.attr,
        param.value,
        result
      );
    });
    return result;
  }

  private filterByQueriesParamsRecursive(
    paramAttr: string,
    paramValue: any,
    deliveries: Delivery[]
  ) {
    return deliveries.filter((item: any) => {
      if (
        !(typeof item[paramAttr.split('.')[0]] == 'object') &&
        typeof paramAttr == 'string' &&
        typeof paramValue == 'string'
      ) {
        return paramValue.toLowerCase() == item[paramAttr].toLowerCase();
      } else if (typeof (item[paramAttr.split('.')[0]] == 'object')) {
        if (
          typeof item[paramAttr.split('.')[0]][paramAttr.split('.')[1]] ==
          'string'
        ) {
          return (
            item[paramAttr.split('.')[0]][
              paramAttr.split('.')[1]
            ].toLowerCase() == paramValue.toLowerCase()
          );
        } else {
          return (
            item[paramAttr.split('.')[0]][paramAttr.split('.')[1]] == paramValue
          );
        }
      }
      return item[paramAttr] == paramValue;
    });
  }

  filterByPagination(items: any[], firstItem: number, lastItem: number) {
    return items.filter((item, index: number) => {
      return index >= firstItem && index < lastItem;
    });
  }

  getDeliverySuccessful(page = 1, size = 10) {
    return this.httpClient
      .get<Delivery[]>(this.baseUrl)
      .pipe(
        map((deliveries) => {
          let results: {
            driver: string;
            totalDeliveries: number;
            totalDeliveriesSuccess: number;
            id: string;
          }[] = [];
          let driversMap: { [key: string]: number } = {};
          deliveries
            .sort((a, b) => (a.motorista.nome > b.motorista.nome ? 1 : -1))
            .forEach((delivery) => {
              const driver = delivery.motorista.nome;

              if (!(driver in driversMap)) {
                driversMap[driver] = results.length;
                results.push({
                  id: delivery.id,
                  driver: delivery.motorista.nome,
                  totalDeliveries: 0,
                  totalDeliveriesSuccess: 0,
                });
              }

              const index = driversMap[driver];

              if (delivery.status_entrega != 'INSUCESSO') {
                results[index].totalDeliveries++;
              }
              if (delivery.status_entrega == 'ENTREGUE') {
                results[index].totalDeliveriesSuccess++;
              }
            });

          return results;
        })
      )
      .pipe(
        map((drivers) => {
          return this.getOnPagination(page, size, drivers);
        })
      );
  }

  getDeliveryUnsuccessful(page = 1, size = 10) {
    return this.httpClient
      .get<Delivery[]>(this.baseUrl)
      .pipe(
        map((deliveries) => {
          let results: {
            driver: string;
            total: number;
            id: string;
          }[] = [];
          let driversMap: { [key: string]: number } = {};
          deliveries
            .sort((a, b) => (a.motorista.nome > b.motorista.nome ? 1 : -1))
            .forEach((delivery) => {
              const driver = delivery.motorista.nome;

              if (!(driver in driversMap)) {
                driversMap[driver] = results.length;
                results.push({
                  id: delivery.id,
                  driver: delivery.motorista.nome,
                  total: 0,
                });
              }

              const index = driversMap[driver];

              if (delivery.status_entrega == 'INSUCESSO') {
                results[index].total++;
              }
            });

          return results;
        })
      )
      .pipe(
        map((drivers) => {
          return this.getOnPagination(page, size, drivers);
        })
      );
  }

  getListNeighborhood(page = 1, size = 10) {
    return this.httpClient
      .get<Delivery[]>(this.baseUrl)
      .pipe(
        map((deliveries) => {
          let results: {
            neighborhood: string;
            totalDeliveries: number;
            totalDeliveriesSuccess: number;
            id: string;
          }[] = [];
          let neighborhoodMap: { [key: string]: number } = {};
          deliveries
            .sort((a, b) =>
              a.cliente_destino.bairro > b.cliente_destino.bairro ? 1 : -1
            )
            .forEach((delivery) => {
              const neighborhood = delivery.cliente_destino.bairro;

              if (!(neighborhood in neighborhoodMap)) {
                neighborhoodMap[neighborhood] = results.length;
                results.push({
                  id: delivery.id,
                  neighborhood: delivery.cliente_destino.bairro,
                  totalDeliveries: 0,
                  totalDeliveriesSuccess: 0,
                });
              }

              const index = neighborhoodMap[neighborhood];

              if (delivery.status_entrega != 'INSUCESSO') {
                results[index].totalDeliveries++;
              }

              if (delivery.status_entrega == 'ENTREGUE') {
                results[index].totalDeliveriesSuccess++;
              }
            });

          return results;
        })
      )
      .pipe(
        map((drivers) => {
          return this.getOnPagination(page, size, drivers);
        })
      );
  }

  transformStringInArray(filters: string) {
    return filters
      .substring(1)
      .split('&')
      .map((param) => {
        const [attr, value] = param.split('=');
        return { attr, value };
      });
  }
}
