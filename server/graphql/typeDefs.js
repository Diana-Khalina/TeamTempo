import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    role: Role!
    moodEntries: [MoodEntry!]! # Зв’язок з настроями
  }

  type MoodEntry {
    _id: ID!
    date: String!
    answers: [Answer!]!
  }

  type Answer {
    question: String!
    answer: String!
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
    getUserMoodEntries(id: ID!): [MoodEntry!]! # Новий запит для отримання настроїв конкретного користувача
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
