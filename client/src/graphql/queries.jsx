import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      _id
      username
      email
      role
    }
  }
`;
export const GET_USER_MOOD_ENTRIES = gql`
  query GetUserMoodEntries($id: ID!) {
    getUserMoodEntries(id: $id) {
      _id
      date
      answers {
        question
        answer
      }
    }
  }
`;