import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { TableService } from 'src/app/shared/table/table.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private tableService: TableService
  ) {}

  ngOnInit(): void {
    this.getDriversSuccessful(1, 10);
    this.getDriversUnsuccessful(1, 10);
    this.getListNeighborhood(1, 10);
  }

  getDriversSuccessful(page: number, size: number) {
    this.tableService.setLoading({ type: 'driversSuccessful' }, true);
    this.apiService.getDeliverySuccessful(page, size).subscribe({
      next: (drivers) => {
        this.tableService.setTableData({ type: 'driversSuccessful' }, drivers);
        this.tableService.setLoading({ type: 'driversSuccessful' }, false);
      },
      error: () =>
        this.tableService.setLoading({ type: 'driversSuccessful' }, false),
    });
  }

  getDriversUnsuccessful(page: number, size: number) {
    this.tableService.setLoading({ type: 'driversUnsuccessful' }, true);
    this.apiService.getDeliveryUnsuccessful(page, size).subscribe({
      next: (drivers) => {
        this.tableService.setTableData(
          { type: 'driversUnsuccessful' },
          drivers
        );
        this.tableService.setLoading({ type: 'driversUnsuccessful' }, false);
      },
      error: () =>
        this.tableService.setLoading({ type: 'driversUnsuccessful' }, false),
    });
  }

  getListNeighborhood(page: number, size: number) {
    this.tableService.setLoading({ type: 'neighborhood' }, true);
    this.apiService.getListNeighborhood(page, size).subscribe({
      next: (drivers) => {
        this.tableService.setTableData({ type: 'neighborhood' }, drivers);
        this.tableService.setLoading({ type: 'neighborhood' }, false);
      },
      error: () =>
        this.tableService.setLoading({ type: 'neighborhood' }, false),
    });
  }

  onPaginationDeliverySuccessful(e: any) {
    this.getDriversSuccessful(e.page, e.size);
  }

  onPaginationDeliveryUnsuccessful(e: any) {
    this.getDriversUnsuccessful(e.page, e.size);
  }

  onPaginationNeighborhoodl(e: any) {
    this.getListNeighborhood(e.page, e.size);
  }
}
