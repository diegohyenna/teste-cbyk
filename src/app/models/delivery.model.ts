export type Delivery = {
  id: string;
  documento: string;
  motorista: Driver;
  cliente_origem: Origin;
  cliente_destino: Destination;
  status_entrega: string;
};

export type Driver = {
  nome: string;
};

export type Destination = {
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
};

export type Origin = {
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
};
