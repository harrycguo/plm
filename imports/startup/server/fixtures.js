import { Meteor } from 'meteor/meteor';
import { StorageCapacities } from '../../api/StorageCapacities/storageCapacities.js'
import { LotNumberSystem } from '../../api/Lots/LotNumberSystem.js'

//Create default admin
if ( Meteor.users.find({username: 'admin'}).count() === 0 ) {
  
  const admin = Accounts.createUser({
    email: 'admin@admin.com',
    password: 'ECE458!',
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
      capacity: Number(0),
      used: Number(0)
    })
}

if (StorageCapacities.find({name: "Refrigerator"}).count() === 0){
  StorageCapacities.insert(
    {
      name: "Refrigerator",
      type: "refrigerated",
      capacity: Number(0),
      used: Number(0)
    })
}

if (StorageCapacities.find({name: "Warehouse"}).count() === 0){
  StorageCapacities.insert(
    {
      name: "Warehouse",
      type: "room temperature",
      capacity: Number(0),
      used: Number(0)
    })
}

//create default System Lot Number
if (LotNumberSystem.find({name: 'system'}).count() === 0){
  LotNumberSystem.insert(
    {
      name: 'system',
      lotNumber: 1,
    }
  )
}



