import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  declarations: [DeliveryComponent, NotFoundComponent, DashboardComponent],
  imports: [CommonModule, PagesRoutingModule, SharedModule],
  exports: [DeliveryComponent, NotFoundComponent, DashboardComponent],
})
export class PagesModule {}
