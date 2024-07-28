import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DeliveryReturn } from 'src/app/models/delivery-return.model';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private tableDataSubject = new BehaviorSubject<DeliveryReturn>({
    data: [],
    page: 1,
    size: 10,
    total: 0,
  });
  tableData$ = this.tableDataSubject.asObservable();

  setTableData(data: DeliveryReturn): void {
    this.tableDataSubject.next(data);
  }

  updateTableData(newData: DeliveryReturn): void {
    this.setTableData(newData);
  }
}
