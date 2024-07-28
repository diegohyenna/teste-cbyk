import {
  AfterContentChecked,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Filters } from 'src/app/models/filters.model';

import { FormErrors } from '../form/input/input.component';
import { LoadingTable, StateTableTypes, TableService } from './table.service';

export interface FilterInputs {
  label: string;
  placeholder: string;
  inputModel: {
    attr: string;
    value: any;
  };
  validators?: Validators[] | undefined;
  formErrors?: FormErrors[] | undefined;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterContentChecked {
  @Input({ required: true }) columns!: string[];
  @Input({ required: true }) tableColumns!: any[];
  @Input() filterInputs?: FilterInputs[];

  isLoading: LoadingTable = {
    deliveries: false,
    driversSuccessful: false,
    driversUnsuccessful: false,
    neighborhood: false,
  };

  tableData: any = {
    deliveries: { data: [], page: 1, size: 10, total: 0 },
    driversSuccessful: { data: [], page: 1, size: 10, total: 0 },
    driversUnsuccessful: { data: [], page: 1, size: 10, total: 0 },
    neighborhood: { data: [], page: 1, size: 10, total: 0 },
  };

  @Input({ required: true }) tableDataAttr!: StateTableTypes;
  page = 1;
  size = 10;
  total = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Output('onFilter') onFilter = new EventEmitter<{
    page: number;
    size: number;
    filters: Filters[];
  }>();
  @Output('onPagination') onPagination = new EventEmitter<{
    page: number;
    size: number;
    filters: Filters[];
  }>();

  filtersQueries: Filters[] = [];
  filtersQueriesStringify = '';

  constructor(private tableService: TableService) {}

  ngAfterContentChecked(): void {
    this.tableService.loading$.subscribe((loading) => {
      this.isLoading[this.tableDataAttr.type] =
        loading[this.tableDataAttr.type];
    });

    this.tableService.tableData$.subscribe((response) => {
      this.tableData[this.tableDataAttr.type] =
        response[this.tableDataAttr.type].data;
      this.page = response[this.tableDataAttr.type].page;
      this.size = response[this.tableDataAttr.type].size;
      this.total = response[this.tableDataAttr.type].total;
    });
  }

  handlePageEvent(e: PageEvent) {
    this.onPagination.emit({
      page: e.pageIndex + 1,
      size: this.size,
      filters: this.filtersQueries,
    });
  }

  filter() {
    this.page = 1;
    this.paginator?.firstPage();
    this.filtersQueries = [];
    this.filterInputs?.map((input) => {
      if (input.inputModel.value) {
        this.filtersQueries.push({
          attr: input.inputModel.attr,
          value: input.inputModel.value,
        });
      }
    });

    this.onFilter.emit({
      page: this.page,
      size: this.size,
      filters: this.filtersQueries,
    });
  }
}
