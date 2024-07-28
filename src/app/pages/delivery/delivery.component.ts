import { Component, OnInit } from '@angular/core';
import { transformAttributesInParams } from 'src/app/helpers/helpers';
import { Delivery } from 'src/app/models/delivery.model';
import { Filters } from 'src/app/models/filters.model';
import { ApiService } from 'src/app/services/api.service';
import { TableService } from 'src/app/shared/table/table.service';

import { FilterInputs } from './../../shared/table/table.component';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit {
  tableData: Delivery[] = [];
  total = 0;
  page = 1;
  size = 10;

  filterInputs: FilterInputs[] = [
    {
      inputModel: { attr: 'motorista.nome', value: '' },
      label: 'Motorista',
      placeholder: 'Filtre pelo nome do motorista',
    },
    {
      inputModel: { attr: 'status_entrega', value: '' },
      label: 'Status',
      placeholder: 'Filtre pelo tipo do status',
    },
  ];

  constructor(
    private apiService: ApiService,
    private tableService: TableService
  ) {}

  ngOnInit(): void {
    this.getItems(1, 10);
  }

  getItems(page: number, size: number, filters?: Filters[]) {
    this.tableService.setLoading({ type: 'deliveries' }, true);
    let filtersQueriesStringify = '';

    if (filters?.length) {
      filtersQueriesStringify = transformAttributesInParams(filters);
    } else {
      filtersQueriesStringify = '';
    }

    this.apiService
      .getWithPaginationAndFilter(page, size, filtersQueriesStringify)
      .subscribe({
        next: (response) => {
          this.tableService.setTableData({ type: 'deliveries' }, response);
          this.tableService.setLoading({ type: 'deliveries' }, false);
        },
        error: () =>
          this.tableService.setLoading({ type: 'deliveries' }, false),
      });
  }

  onPagination(e: any) {
    this.getItems(e.page, e.size, e.filters);
  }

  onFilter(e: any) {
    this.getItems(e.page, e.size, e.filters);
  }
}
