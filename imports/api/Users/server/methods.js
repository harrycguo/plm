import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({

    'testMethod':function(){
      console.log("test method works")
    },

    'createUserFromAdmin':function(emailAddress, password, username, firstName, lastName){
        
      const user = Accounts.createUser({
          email: emailAddress,
          password: password,
          username: username,
          profile: {
            name: {
              first: firstName,
              last: lastName,
              username: username,
            },
          },
        }); 

        Roles.addUsersToRoles(user, ['user']);
    }
  })