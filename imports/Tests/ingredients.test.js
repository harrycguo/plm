// //Ingredients API tests
// import { Meteor } from 'meteor/meteor';
// import { Accounts } from 'meteor/accounts-base';
// import { chai, expect } from 'meteor/practicalmeteor:chai';
// import { resetDatabase } from 'meteor/xolvio:cleaner';

// // fixtures.common = {
// //   reset: function () {
// //     // make sure the DDP connection is not logged in before clearing the database
// //     server.call('logout');
// //     server.execute(function () {
// //       Package['xolvio:cleaner'].resetDatabase();
// //     });
// //   }
// // };

// describe('Ingredients', function () {

//   beforeEach(function () {
//     // server.call('logout');
//     // server.execute(function () {
//     //   Package['xolvio:cleaner'].resetDatabase();
//     // });
//     server.call('login', {
//         user: {email: "kim@mail.com"},
//         password: "password"
//     });
//   });

//   it('should be able to create a user', function () {
//     const createUser = new Promise((resolve, reject) => {
//       Accounts.createUser({
//         username: 'demo',
//         email: 'demo@demo.com',
//         password: 'demopassword',
//       }, (error) => {
//         if (error) {
//           reject(error);
//         } else {
//           const newUser = Meteor.users.findOne();
//           resolve(newUser);
//         }
//       });
//     });
//     return createUser.then(function (newUser) {
//       expect(newUser).to.not.be.undefined;
//       expect(newUser.username).to.equal('demo');
//     });
//   });

// });