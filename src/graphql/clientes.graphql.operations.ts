import { gql } from 'apollo-angular'

const GET_CLIENTES = gql`
  query GetClientes {
    clientes {
      telefone
      nomeCompleto
      id
      uf
      endereco
      email
      created_at
      cidade
      updated_at
    }
  }
`;


const DELETE_CLIENTE_BY_ID = gql`
  mutation DeleteClienteByPk($id: uuid!) {
    delete_clientes_by_pk(id: $id)  {
      id
    }
  }
`;

const UPDATE_CLIENTE_BY_ID = gql`
  mutation EditClienteByID($id: uuid!, $fields: clientes_set_input) {
    update_clientes_by_pk(pk_columns: {id: $id}, _set: $fields) {
      id
      nomeCompleto
      telefone
      uf
      email
      endereco
      cidade
    }
  }
`;

const NEW_CLIENTE = gql`
  mutation NewCliente($object: clientes_insert_input!) {
    insert_clientes_one(object: $object) {
      id
      nomeCompleto
      telefone
      uf
      email
      endereco
      cidade
    }
  }
`;

export { GET_CLIENTES, NEW_CLIENTE, UPDATE_CLIENTE_BY_ID, DELETE_CLIENTE_BY_ID }
