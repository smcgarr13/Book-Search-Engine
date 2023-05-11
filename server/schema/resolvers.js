const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    test: () => 'Hello, world!',
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in');
      }

      try {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');

        if (!userData) {
          throw new Error('User not found');
        }

        return userData;
      } catch (error) {
        console.log('Error in me query resolver:', error);
        throw new Error('Something went wrong');
      }
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const token = signToken(user);
      return { token, user };
    },

    // addUser: async (parent, { username, email, password }) => {
    //   const user = await User.create({ username, email, password });
    //   const token = signToken(user);
    //   return { token, user };
    // },

    addUser: async (parent, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.error('Error in addUser mutation:', error);
        throw new AuthenticationError('Error creating user');
      }
    },    

    saveBook: async (parent, { authors, description, title, bookId, image, link }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      return await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: { authors, description, title, bookId, image, link } } },
        { new: true, runValidators: true }
      );
    },

    removeBook: async (parent, { bookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      return await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;



// // Import Mongoose models
// const { AuthenticationError } = require('apollo-server-express');
// const { User } = require('../models');
// const { signToken } = require('../utils/auth');

// const resolvers = {
//     // Define the resolvers for GraphQL Queries
//     Query: {
//       test: () => 'Hello, world!',
//       // Define the 'me' resolver to get the current logged-in user's data
//       me: async (parent, args, context) => {
//         // Check if the user is authenticated (context.user will be set if the user is authenticated)
//         if (context.user) {
//           console.log('Context user:', context.user);
//         // If authenticated, find the user in the database using their _id from the context
//         try {
//           const userData = await User.findOne({ _id: context.user._id })
//             // Exclude the '__v' and 'password' fields from the returned data
//             .select('-__v -password')
//             // Populate the 'savedBooks' field with the data of the saved books
//             .populate('savedBooks');
        
//           // Return the user data
//           return userData;
//         } catch (error) {
//           console.log('Error in me query resolver:', error);
  
//         // If the user is not authenticated, throw an AuthenticationError
//         throw new Error('Something went wrong');
//       }
//     } else {
//     throw new Error('You need to be logged in');
//       }
//     },
//   },
  
//   Mutation: {
//     // Mutation to log in a user
//     login: async (parent, { email, password }) => {
//       const user = await User.findOne({ email });

//       if (!user) {
//         throw new Error('Incorrect email or password');
//       }

//       const correctPw = await user.isCorrectPassword(password);

//       if (!correctPw) {
//         throw new Error('Incorrect email or password');
//       }

//       const token = signToken(user);
//       return { token, user };
//     },
//     // login: async (parent, { email, password }) => {
//     //   const user = await User.findOne({ email });

//     //   if (!user) {
//     //     throw new AuthenticationError('Incorrect credentials');
//     //   }

//     //   const correctPw = await user.isCorrectPassword(password);

//     //   if (!correctPw) {
//     //     throw new AuthenticationError('Incorrect credentials');
//     //   }

//     //   const token = signToken(user);
//     //   return { token, user };
//     // },

//     // Mutation to register a new user
//     addUser: async (parent, { username, email, password }) => {
//       const user = await User.create({ username, email, password });
//       const token = signToken(user);
//       return { token, user };
//     },
//   //   addUser: async (parent, { username, email, password }) => {
//   //     console.log('addUser input:', { username, email, password });
//   //     try {
//   //         const user = await User.create({ username, email, password });
//   //         const token = signToken(user);
//   //         return { token, user };
//   //     } catch (error) {
//   //         console.log('addUser error:', error);
//   //         console.error('addUser error details:', error.details);
//   //         throw new Error('Error creating user');
//   //     }
//   // },

//     // addUser: async (parent, { username, email, password }) => {
//     //   const user = await User.create({ username, email, password });

//     //   if (!user) {
//     //     throw new Error('Something went wrong');
//     //   }

//     //   const token = signToken(user);
//     //   return { token, user };
//     // },

//     // Mutation to add a book to a user's savedBooks array
//     saveBook: async (parent, { authors, description, title, bookId, image, link }, context) => {
//         if (context.user) {
//           return await User.findByIdAndUpdate(
//             context.user._id,
//             { $addToSet: { savedBooks: { authors, description, title, bookId, image, link } } },
//             { new: true, runValidators: true }
//           );
//         }
//         throw new AuthenticationError('Not logged in');
//       },

//     // Mutation to remove a book from a user's savedBooks array
//     removeBook: async (parent, { bookId }, context) => {
//         if (context.user) {
//             return await User.findByIdAndUpdate(
//               context.user._id,
//               { $pull: { savedBooks: { bookId } } },
//               { new: true }
//             );
//           }
//           throw new AuthenticationError('Not logged in');
//         },
//       },
//     };  

// module.exports = resolvers;