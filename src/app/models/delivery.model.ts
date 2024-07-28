export interface Delivery {
  id: string;
  documento: string;
  motorista: Driver;
  cliente_origem: Origin;
  cliente_destino: Destination;
  status_entrega: string;
}

export interface Driver {
  nome: string;
}

export interface Destination {
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
}

export interface Origin {
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
}
