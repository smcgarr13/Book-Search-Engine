import { gql } from '@apollo/client';

// Define GET_ME query to get the current logged-in user's data
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;