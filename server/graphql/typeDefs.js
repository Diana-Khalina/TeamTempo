import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    role: Role!
  }

  enum Role {
    EMPLOYEE
    MANAGER
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUsers: [User!]!
    
    
    me: User
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
    role: Role!
    inviteCode: String
  }

  type Mutation {
    
    addUser(
      username: String!
      email: String!
      password: String!
      role: Role!
      inviteCode: String
    ): AuthPayload!
    
    
    signup(input: SignupInput!): AuthPayload!

    
    login(
      email: String!
      password: String!
    ): AuthPayload!
  }
`;

export default typeDefs;
