import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { transformAttributesInParams } from 'src/app/helpers/helpers';
import { Filters } from 'src/app/models/filters.model';
import { ApiService } from 'src/app/services/api.service';
import { TableService } from 'src/app/shared/table/table.service';

import { DeliveryComponent } from './delivery.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DeliveryComponent', () => {
  let component: DeliveryComponent;
  let fixture: ComponentFixture<DeliveryComponent>;
  let apiServiceMock: any;
  let tableServiceMock: any;

  beforeEach(async () => {
    apiServiceMock = {
      getWithPaginationAndFilter: jasmine
        .createSpy('getWithPaginationAndFilter')
        .and.returnValue(of({ data: [], page: 1, size: 10, total: 0 })),
    };

    tableServiceMock = {
      setLoading: jasmine.createSpy('setLoading'),
      setTableData: jasmine.createSpy('setTableData'),
    };

    await TestBed.configureTestingModule({
      declarations: [DeliveryComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: TableService, useValue: tableServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data on ngOnInit', () => {
    spyOn(component, 'getItems');
    component.ngOnInit();
    expect(component.getItems).toHaveBeenCalledWith(1, 10);
  });

  it('should call ApiService and setTableData on getItems', () => {
    component.getItems(1, 10);
    expect(tableServiceMock.setLoading).toHaveBeenCalledWith(
      { type: 'deliveries' },
      true
    );
    expect(apiServiceMock.getWithPaginationAndFilter).toHaveBeenCalledWith(
      1,
      10,
      ''
    );
    expect(tableServiceMock.setTableData).toHaveBeenCalledWith(
      { type: 'deliveries' },
      { data: [], page: 1, size: 10, total: 0 }
    );
    expect(tableServiceMock.setLoading).toHaveBeenCalledWith(
      { type: 'deliveries' },
      false
    );
  });

  it('should handle error in getItems', () => {
    apiServiceMock.getWithPaginationAndFilter.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.getItems(1, 10);
    expect(tableServiceMock.setLoading).toHaveBeenCalledWith(
      { type: 'deliveries' },
      false
    );
  });

  it('should call getItems with correct parameters on pagination', () => {
    spyOn(component, 'getItems');
    const event = { page: 2, size: 10, filters: [] };
    component.onPagination(event);
    expect(component.getItems).toHaveBeenCalledWith(2, 10, []);
  });

  it('should call getItems with correct parameters on filter', () => {
    spyOn(component, 'getItems');
    const event = {
      page: 1,
      size: 10,
      filters: [{ attr: 'status_entrega', value: 'delivered' }],
    };
    component.onFilter(event);
    expect(component.getItems).toHaveBeenCalledWith(1, 10, [
      { attr: 'status_entrega', value: 'delivered' },
    ]);
  });

  it('should transform filters into query string', () => {
    const filters: Filters[] = [{ attr: 'status_entrega', value: 'delivered' }];
    const queryString = transformAttributesInParams(filters);
    expect(queryString).toBe('?status_entrega=delivered');
  });
});
