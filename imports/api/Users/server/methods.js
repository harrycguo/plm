import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({

    'testMethod':function(){
      console.log("test method works")
    },

    'createUserFromAdmin':function(emailAddress, password, username, firstName, lastName, permissionLevel){
        
      // Make sure the user is logged in before inserting a task
      if (! this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        throw new Meteor.Error('not-authorized', 'not-authorized');
      }
      
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

        Roles.addUsersToRoles(user, [permissionLevel]);
    }
  })