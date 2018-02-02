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
if (StorageCapacities.find({name: "Freezer"}).count() === 0){
  StorageCapacities.insert(
    {
      name: "Freezer",
      type: "frozen",
      capacity: Number(100000),
      used: Number(0)
    })
}

if (StorageCapacities.find({name: "Refrigerator"}).count() === 0){
  StorageCapacities.insert(
    {
      name: "Refrigerator",
      type: "refrigerated",
      capacity: Number(100000),
      used: Number(0)
    })
}

if (StorageCapacities.find({name: "Warehouse"}).count() === 0){
  StorageCapacities.insert(
    {
      name: "Warehouse",
      type: "room temperature",
      capacity: Number(100000),
      used: Number(0)
    })
}



