import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    'createUserFromAdmin':function(emailAdress, password, username, firstName, lastName, username){
        
      Accounts.createUser({
          email: emailAddress,
          password: password,
          username: username,
          profile: {
            name: {
              first: firstName,
              last: lastName,
              username: userName,
            },
          },
        }); 
    }
  })