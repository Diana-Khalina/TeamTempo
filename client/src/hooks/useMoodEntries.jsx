import { useQuery } from '@apollo/client';
import { GET_USER_MOOD_ENTRIES } from '../graphql/queries';

const useMoodEntries = (userId) => {
  const { loading, error, data } = useQuery(GET_USER_MOOD_ENTRIES, {
    variables: { id: userId },
    skip: !userId, // Skip query if no userId
  });

  return { loading, error, moodEntries: data?.getUserMoodEntries || [] };
};

export default useMoodEntries;
