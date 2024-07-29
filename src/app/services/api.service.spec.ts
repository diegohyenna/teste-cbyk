import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DeliveryReturn } from '../models/delivery-return.model';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWithPaginationAndFilter', () => {
    it('should return paginated data', () => {
      const mockDeliveries: any[] = [
        {
          id: '1',
          motorista: { nome: 'John' },
          status_entrega: 'ENTREGUE',
          cliente_destino: { bairro: 'Centro' },
        },
      ];

      service
        .getWithPaginationAndFilter(1, 10)
        .subscribe((result: DeliveryReturn) => {
          expect(result.data.length).toBe(1);
          expect(result.total).toBe(1);
        });

      const req = httpMock.expectOne(service.baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockDeliveries);
    });

    it('should filter and paginate data when filters are provided', () => {
      const mockDeliveries: any[] = [
        {
          id: '1',
          motorista: { nome: 'John' },
          status_entrega: 'ENTREGUE',
          cliente_destino: { bairro: 'Centro' },
        },
        {
          id: '2',
          motorista: { nome: 'Jane' },
          status_entrega: 'INSUCESSO',
          cliente_destino: { bairro: 'Centro' },
        },
      ];

      service
        .getWithPaginationAndFilter(1, 10, '?motorista.nome=John')
        .subscribe((result: DeliveryReturn) => {
          expect(result.data.length).toBe(1);
          expect(result.total).toBe(1);
          expect(result.data[0].motorista.nome).toBe('John');
        });

      const req = httpMock.expectOne(service.baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockDeliveries);
    });
  });

  describe('getDeliverySuccessful', () => {
    it('should return successful deliveries data', () => {
      const mockDeliveries: any[] = [
        {
          motorista: { nome: 'John' },
          status_entrega: 'ENTREGUE',
          cliente_destino: { bairro: 'Centro' },
        },
        {
          motorista: { nome: 'John' },
          status_entrega: 'ENTREGUE',
          cliente_destino: { bairro: 'Centro' },
        },
      ];

      service.getDeliverySuccessful(1, 10).subscribe((result: any) => {
        expect(result.data.length).toBe(1);
        expect(result.total).toBe(1);
        expect(result.data[0].driver).toBe('John');
        expect(result.data[0].totalDeliveriesSuccess).toBe(2);
      });

      const req = httpMock.expectOne(service.baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockDeliveries);
    });
  });

  describe('getDeliveryUnsuccessful', () => {
    it('should return unsuccessful deliveries data', () => {
      const mockDeliveries: any[] = [
        {
          motorista: { nome: 'John' },
          status_entrega: 'INSUCESSO',
          cliente_destino: { bairro: 'Centro' },
        },
        {
          motorista: { nome: 'Jane' },
          status_entrega: 'INSUCESSO',
          cliente_destino: { bairro: 'Centro' },
        },
      ];

      service
        .getDeliveryUnsuccessful(1, 10)
        .subscribe((result: DeliveryReturn) => {
          expect(result.data.length).toBe(2);
          expect(result.total).toBe(2);
        });

      const req = httpMock.expectOne(service.baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockDeliveries);
    });
  });

  describe('getListNeighborhood', () => {
    it('should return neighborhood data', () => {
      const mockDeliveries: any[] = [
        {
          motorista: { nome: 'John' },
          status_entrega: 'ENTREGUE',
          cliente_destino: { bairro: 'Centro' },
        },
        {
          motorista: { nome: 'Jane' },
          status_entrega: 'INSUCESSO',
          cliente_destino: { bairro: 'Centro' },
        },
      ];

      service.getListNeighborhood(1, 10).subscribe((result: any) => {
        expect(result.data.length).toBe(1);
        expect(result.total).toBe(1);
        expect(result.data[0].neighborhood).toBe('Centro');
      });

      const req = httpMock.expectOne(service.baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockDeliveries);
    });
  });
});
