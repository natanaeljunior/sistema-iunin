export interface Cliente {
  nomeCompleto: string,
  email: string,
  telefone: string,
  endereco: string,
  cidade: string,
  uf: string
}

export const newCliente: Cliente = {
  nomeCompleto: '',
  email: '',
  telefone: '',
  endereco: '',
  cidade: '',
  uf: ''
};
