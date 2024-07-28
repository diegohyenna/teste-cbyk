import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  driversSuccessful = {
    page: 1,
    size: 10,
    total: 0,
    isLoading: false,
    data: [],
  };
  driversUnsuccessful = {
    page: 1,
    size: 10,
    total: 0,
    isLoading: false,
    data: [],
  };
  neighborhood = {
    page: 1,
    size: 10,
    total: 0,
    isLoading: false,
    data: [],
  };

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.getDriversSuccessful(1, 10);
    this.getDriversUnsuccessful(1, 10);
    this.getListNeighborhood(1, 10);
  }

  getDriversSuccessful(page: number, size: number) {
    this.driversSuccessful.isLoading = true;
    this.apiService.getDeliverySuccessful(page, size).subscribe({
      next: (drivers) => {
        this.driversSuccessful.data = drivers.data;
        this.driversSuccessful.page = drivers.page;
        this.driversSuccessful.size = drivers.size;
        this.driversSuccessful.total = drivers.total;
        this.driversSuccessful.isLoading = false;
      },
      error: () => (this.driversSuccessful.isLoading = false),
    });
  }

  getDriversUnsuccessful(page: number, size: number) {
    this.driversUnsuccessful.isLoading = true;
    this.apiService.getDeliveryUnsuccessful(page, size).subscribe({
      next: (drivers) => {
        this.driversUnsuccessful.data = drivers.data;
        this.driversUnsuccessful.page = drivers.page;
        this.driversUnsuccessful.size = drivers.size;
        this.driversUnsuccessful.total = drivers.total;
        this.driversUnsuccessful.isLoading = false;
      },
      error: () => (this.driversUnsuccessful.isLoading = false),
    });
  }

  getListNeighborhood(page: number, size: number) {
    this.neighborhood.isLoading = true;
    this.apiService.getListNeighborhood(page, size).subscribe({
      next: (neighborhood) => {
        this.neighborhood.data = neighborhood.data;
        this.neighborhood.page = neighborhood.page;
        this.neighborhood.size = neighborhood.size;
        this.neighborhood.total = neighborhood.total;
        this.neighborhood.isLoading = false;
      },
      error: () => (this.neighborhood.isLoading = false),
    });
  }

  onPaginationDeliverySuccessful(e: any) {
    this.getDriversSuccessful(e.page, e.size);
  }

  onPaginationDeliveryUnsuccessful(e: any) {
    this.getDriversUnsuccessful(e.page, e.size);
  }
}
