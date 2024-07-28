import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Filters } from 'src/app/models/filters.model';

import { FormErrors } from '../form/input/input.component';

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
export class TableComponent implements OnChanges {
  @Input({ required: true }) columns!: string[];
  @Input({ required: true }) tableColumns!: any[];
  @Input() filterInputs?: FilterInputs[];
  @Input() isLoading = false;
  @Input() tableData: any[] = [];
  @Input() page = 1;
  @Input() size = 10;
  @Input() total = 0;

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

  ngOnChanges(changes: any): void {
    console.log(changes);
    this.tableData = changes?.tableData?.currentValue
      ? changes?.tableData?.currentValue
      : this.tableData;
    this.total = changes?.total?.currentValue
      ? changes?.total?.currentValue
      : this.total;
    console.log(this.tableData);
    this.size = changes?.size?.currentValue
      ? changes?.size?.currentValue
      : this.size;
    this.page = changes?.page?.currentValue
      ? changes?.page?.currentValue
      : this.page;
    this.columns = changes?.columns?.currentValue
      ? changes?.columns?.currentValue
      : this.columns;
    console.log(this.columns);
    this.tableColumns = changes?.tableColumns?.currentValue
      ? changes?.tableColumns?.currentValue
      : this.tableColumns;

    console.log(this.tableColumns);

    this.isLoading = changes?.isLoading?.currentValue;
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
