import { Meteor } from 'meteor/meteor';
import { StorageCapacities } from '../../api/StorageCapacities/storageCapacities.js'

//Create default admin
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

//Create default Storage Capacities
if (StorageCapacities.find({type: "Freezer"}).count() === 0){
  StorageCapacities.insert(
    {
      type: "Freezer",
      capacity: Number(100000),
      used: Number(0)
    })
}

if (StorageCapacities.find({type: "Refrigerator"}).count() === 0){
  StorageCapacities.insert(
    {
      type: "Refrigerator",
      capacity: Number(100000),
      used: Number(0)
    })
}

if (StorageCapacities.find({type: "Warehouse"}).count() === 0){
  StorageCapacities.insert(
    {
      type: "Warehouse",
      capacity: Number(100000),
      used: Number(0)
    })
}



