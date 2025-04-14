import { gql } from '@apollo/client';

export const ADDUSER = gql`
  mutation AddUser(
    $username: String!,
    $email: String!,
    $password: String!,
    $role: Role!,
    $inviteCode: String
  ) {
    addUser(
      username: $username,
      email: $email,
      password: $password,
      role: $role,
      inviteCode: $inviteCode
    ) {
      token
      user {
        _id
        username
        email
        role
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        role
      }
    }
  }
`;
