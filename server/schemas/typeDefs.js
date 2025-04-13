const { gql } = import('apollo-server-express');

module.exports = gql`
  type User {
    _id: ID
    username: String
    email: String
    entries: [MoodEntry]
  }

  type MoodEntry {
    _id: ID
    mood: String
    energyLevel: Int
    stressLevel: Int
    supportLevel: Int
    date: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    entries: [MoodEntry]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    signup(username: String!, email: String!, password: String!): Auth
    addMoodEntry(mood: String!, energyLevel: Int!, stressLevel: Int!, supportLevel: Int!): MoodEntry
    deleteMoodEntry(id: ID!): MoodEntry
  }
`;
