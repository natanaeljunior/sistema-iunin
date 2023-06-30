import { gql } from 'apollo-angular'

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      description
    }
  }
`;

const GET_POSTS_BY_USERNAME = gql`
  query GetPostsByUsername($username: String!) {
    posts(username: $username) {
      id
      title
      description
    }
  }
`;

const NEW_USUARIO = gql`
  mutation CriarUsuario($nome: String!, $email: String!, $password: String!) {
    insert_usuarios_one(object: { nome: $nome, email: $email, password: $password }) {
        id
        nome
        email
    }
  }
`;

export { GET_POSTS, GET_POSTS_BY_USERNAME, NEW_USUARIO }
