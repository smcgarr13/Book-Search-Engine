const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Define the User type with fields matching the User Mongoose model
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  # Define the Book type with fields matching the Book Mongoose subdocument schema
  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  # Define the Auth type with a token field and a User type field
  type Auth {
    token: ID!
    user: User
  }

  # Define the Query type for the GraphQL schema
  type Query {
    me: User
  }

  # Define the Mutation type for the GraphQL schema
  type Mutation {
    # Mutation to log in a user, returns Auth type with token and user data
    login(email: String!, password: String!): Auth
    # Mutation to register a new user, returns Auth type with token and user data
    addUser(username: String!, email: String!, password: String!): Auth
    # Mutation to save a book to the user's savedBooks array, returns updated User type
    saveBook(authors: [String!], description: String!, title: String!, bookId: String!, image: String, link: String): User
    # Mutation to remove a book from the user's savedBooks array, returns updated User type
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;