import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Carts } from '../Cart/Cart.js'

if (Meteor.isClient) {
  Meteor.subscribe('cart');
}

Meteor.methods({

  'regularLogin': function (username, password) {
    Meteor.loginWithPassword({ username: this.username.value }, this.password.value,
        (error) => {
          if (error) {
            Bert.alert(error.reason, 'danger');
          } else {

            Bert.alert('Welcome!', 'success');
            //determine route based on role
            let user = Meteor.user();

            //Creates a cart for user if they don't already have one
            if (Carts.find({ user: Meteor.userId() }).fetch().length === 0) {
              Meteor.call('createUserCart');
            }

            //admin login
            if (Roles.userIsInRole(user, ['admin'])) {
              history.push('/adminHomepage');
            }
            //user login
            else {
              history.push('/userHomepage');
            }
          }
        });
  },
  'createUserDefault': function (emailAddress, password, username, firstName, lastName) {

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
    }
  );

    Roles.addUsersToRoles(user, ['user']);

  },

  'createUserFromAdmin': function (emailAddress, password, username, firstName, lastName, permissionLevel) {
    // Make sure the user is logged in before inserting a task
    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
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
  },


  'editUserRole': function (user, newPermissionLevel) {

    if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('not-authorized', 'not-authorized');
    }

    Roles.setUserRoles(user, [newPermissionLevel]);
  }

})

if (Meteor.isServer) {
  Meteor.publish('users', function () {
    return Meteor.users.find({});
  });
}
