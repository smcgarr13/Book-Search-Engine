// Import required modules and components
import React, { useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

// Define SavedBooks component
const SavedBooks = () => {
  // Execute the GET_ME query to get user data
  // const { loading, data: userData } = useQuery(GET_ME);
  const { loading, data: userData, refetch } = useQuery(GET_ME, { fetchPolicy: 'network-only' });
  // Use the useMutation() Hook to execute the REMOVE_BOOK mutation
  const [removeBook] = useMutation(REMOVE_BOOK);

  // // Add useState for setUserData
  // const [, setUserData] = useState({});

  // Determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  // Fetch user data using useEffect() hook
  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        // Refetch the GET_ME query with the token
        await refetch();

      } catch (err) {
        console.error(err);
      }
    };

    //     // Execute the GET_ME query with the token
    //     const { data } = await useQuery(GET_ME, {
    //       variables: { token },
    //     });

    //     setUserData(data.getMe);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };

    getUserData();
  }, [userDataLength, refetch]);

  // Function to delete a book using its mongo _id value
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({ variables: { bookId } });

      if (data.removeBook.savedBooks) {
        // Upon success, remove book's id from localStorage
        removeBookId(bookId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Show loading message if data isn't here yet
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  const user = userData.getMe;

  // Render the SavedBooks component
  return (
    <>
      <div fluid className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {user.savedBooks.length
            ? `Viewing ${user.savedBooks.length} saved ${user.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {user.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;