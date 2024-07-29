import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { ApiService } from 'src/app/services/api.service';
import { TableService } from 'src/app/shared/table/table.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let apiServiceMock: any;
  let tableServiceMock: any;

  beforeEach(async () => {
    apiServiceMock = {
      getDeliverySuccessful: jasmine
        .createSpy('getDeliverySuccessful')
        .and.returnValue(of({ data: [], page: 1, size: 10, total: 0 })),
      getDeliveryUnsuccessful: jasmine
        .createSpy('getDeliveryUnsuccessful')
        .and.returnValue(of({ data: [], page: 1, size: 10, total: 0 })),
      getListNeighborhood: jasmine
        .createSpy('getListNeighborhood')
        .and.returnValue(of({ data: [], page: 1, size: 10, total: 0 })),
    };

    tableServiceMock = {
      setLoading: jasmine.createSpy('setLoading'),
      setTableData: jasmine.createSpy('setTableData'),
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: TableService, useValue: tableServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDriversSuccessful, getDriversUnsuccessful and getListNeighborhood on ngOnInit', () => {
    spyOn(component, 'getDriversSuccessful');
    spyOn(component, 'getDriversUnsuccessful');
    spyOn(component, 'getListNeighborhood');
    component.ngOnInit();
    expect(component.getDriversSuccessful).toHaveBeenCalledWith(1, 10);
    expect(component.getDriversUnsuccessful).toHaveBeenCalledWith(1, 10);
    expect(component.getListNeighborhood).toHaveBeenCalledWith(1, 10);
  });

  it('should call ApiService and setTableData on getDriversSuccessful', () => {
    component.getDriversSuccessful(1, 10);
    expect(tableServiceMock.setLoading).toHaveBeenCalledWith(
      { type: 'driversSuccessful' },
      true
    );
    expect(apiServiceMock.getDeliverySuccessful).toHaveBeenCalledWith(1, 10);
    expect(tableServiceMock.setTableData).toHaveBeenCalledWith(
      { type: 'driversSuccessful' },
      { data: [], page: 1, size: 10, total: 0 }
    );
    expect(tableServiceMock.setLoading).toHaveBeenCalledWith(
      { type: 'driversSuccessful' },
      false
    );
  });

  it('should handle error in getDriversSuccessful', () => {
    apiServiceMock.getDeliverySuccessful.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.getDriversSuccessful(1, 10);
    expect(tableServiceMock.setLoading).toHaveBeenCalledWith(
      { type: 'driversSuccessful' },
      false
    );
  });

  it('should call ApiService and setTableData on getDriversUnsuccessful', () => {
    component.getDriversUnsuccessful(1, 10);
    expect(tableServiceMock.setLoading).toHaveBeenCalledWith(
      { type: 'driversUnsuccessful' },
      true
    );
    expect(apiServiceMock.getDeliveryUnsuccessful).toHaveBeenCalledWith(1, 10);
    expect(tableServiceMock.setTableData).toHaveBeenCalledWith(
      { type: 'driversUnsuccessful' },
      { data: [], page: 1, size: 10, total: 0 }
    );
    expect(tableServiceMock.setLoading).toHaveBeenCalledWith(
      { type: 'driversUnsuccessful' },
      false
    );
  });

  it('should handle error in getDriversUnsuccessful', () => {
    apiServiceMock.getDeliveryUnsuccessful.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.getDriversUnsuccessful(1, 10);
    expect(tableServiceMock.setLoading).toHaveBeenCalledWith(
      { type: 'driversUnsuccessful' },
      false
    );
  });

  it('should call ApiService and setTableData on getListNeighborhood', () => {
    component.getListNeighborhood(1, 10);
    expect(tableServiceMock.setLoading).toHaveBeenCalledWith(
      { type: 'neighborhood' },
      true
    );
    expect(apiServiceMock.getListNeighborhood).toHaveBeenCalledWith(1, 10);
    expect(tableServiceMock.setTableData).toHaveBeenCalledWith(
      { type: 'neighborhood' },
      { data: [], page: 1, size: 10, total: 0 }
    );
    expect(tableServiceMock.setLoading).toHaveBeenCalledWith(
      { type: 'neighborhood' },
      false
    );
  });

  it('should handle error in getListNeighborhood', () => {
    apiServiceMock.getListNeighborhood.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.getListNeighborhood(1, 10);
    expect(tableServiceMock.setLoading).toHaveBeenCalledWith(
      { type: 'neighborhood' },
      false
    );
  });

  it('should call getDriversSuccessful with correct parameters on pagination', () => {
    spyOn(component, 'getDriversSuccessful');
    const event = { page: 2, size: 10 };
    component.onPaginationDeliverySuccessful(event);
    expect(component.getDriversSuccessful).toHaveBeenCalledWith(2, 10);
  });

  it('should call getDriversUnsuccessful with correct parameters on pagination', () => {
    spyOn(component, 'getDriversUnsuccessful');
    const event = { page: 2, size: 10 };
    component.onPaginationDeliveryUnsuccessful(event);
    expect(component.getDriversUnsuccessful).toHaveBeenCalledWith(2, 10);
  });

  it('should call getListNeighborhood with correct parameters on pagination', () => {
    spyOn(component, 'getListNeighborhood');
    const event = { page: 2, size: 10 };
    component.onPaginationNeighborhoodl(event);
    expect(component.getListNeighborhood).toHaveBeenCalledWith(2, 10);
  });
});
