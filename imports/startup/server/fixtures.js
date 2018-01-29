import { Meteor } from 'meteor/meteor';

if ( Meteor.users.find({username: 'admin'}).count() === 0 ) {
  
  const admin = Accounts.createUser({
    email: 'admin@admin.com',
    password: 'adminpassword',
    username: 'admin',
    profile: {
      name: {
        first: 'admin',
        last: 'admin',
        username: 'admin',
      },
    },
  });

  Roles.addUsersToRoles(admin, ['admin']);
}



