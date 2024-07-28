import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DeliveryReturn } from 'src/app/models/delivery-return.model';

export interface StateTable {
  deliveries: DeliveryReturn;
  driversSuccessful: DeliveryReturn;
  driversUnsuccessful: DeliveryReturn;
  neighborhood: DeliveryReturn;
}

export interface StateTableTypes {
  type:
    | 'deliveries'
    | 'driversSuccessful'
    | 'driversUnsuccessful'
    | 'neighborhood';
}

export interface StateLoadingTypes {
  type:
    | 'deliveries'
    | 'driversSuccessful'
    | 'driversUnsuccessful'
    | 'neighborhood';
}

export interface LoadingTable {
  deliveries: boolean;
  driversSuccessful: boolean;
  driversUnsuccessful: boolean;
  neighborhood: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private tableDataSubject = new BehaviorSubject<StateTable>({
    deliveries: { data: [], page: 1, size: 10, total: 0 },
    driversSuccessful: { data: [], page: 1, size: 10, total: 0 },
    driversUnsuccessful: { data: [], page: 1, size: 10, total: 0 },
    neighborhood: { data: [], page: 1, size: 10, total: 0 },
  });

  private loadingSubject = new BehaviorSubject<LoadingTable>({
    deliveries: false,
    driversSuccessful: false,
    driversUnsuccessful: false,
    neighborhood: false,
  });

  tableData$ = this.tableDataSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  setTableData(stateAttr: StateTableTypes, data: DeliveryReturn): void {
    this.tableDataSubject.value[stateAttr.type] = data;
  }

  updateTableData(stateAttr: StateTableTypes, data: DeliveryReturn): void {
    this.setTableData(stateAttr, data);
  }

  setLoading(stateAttr: StateLoadingTypes, state: boolean): void {
    this.loadingSubject.value[stateAttr.type] = state;
  }
}
