import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Vendors } from '../Vendors/vendors.js';
import { StorageCapacities } from '../StorageCapacities/storageCapacities.js';
import convertPackageString from '../../utils/conversions.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { isInt } from '../../utils/checks.js';
import { containsVendor, indexOfVendorWithId } from '../../utils/checks.js';

//Meteor.subscribe('capacities');

//IngredientsList API
Meteor.methods({
    'addIngredient': function (ingName, ingPackage, ingQuantity, ingTemperatureState, ingVendor, ingPrice) {

        //Check to see if user is authorized
        if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        console.log(ingPackage)

        //Check to see if capacity won't be exceeded
        if (!(ingPackage.toLowerCase() == 'truckload' || ingPackage.toLowerCase() == 'railcar')) {
            let container = StorageCapacities.findOne({ type: ingTemperatureState });
            let newUsed = Number(container.used) + Number(ingQuantity)
            Meteor.call('sc.editUsed', container._id, Number(newUsed));
        }

        var vendorInfoArr = [{
            vendor: ingVendor,
            price: Number(ingPrice)
        }];

        IngredientsList.insert({
            name: ingName,
            package: ingPackage.toLowerCase(),
            temperatureState: ingTemperatureState.toLowerCase(),
            vendorInfo: vendorInfoArr,
            quantity: Number(ingQuantity)
            // prices: priceTuples
        });
    },
    //This method will check to see if the ingredient already exists. If not, then call addIngredient.
    'addToExistingIngredient': function (ingName, ingPackage, ingQuantity, ingTemperatureState, ingVendor, ingPrice) {
        if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        var existingIng = IngredientsList.findOne({ name: ingName });
        console.log(existingIng)

        //If ingredient exists, update it instead of adding a new database entry
        if (existingIng !== undefined) {

            if (existingIng.temperatureState != ingTemperatureState.toLowerCase()) {
                throw new Meteor.Error('incorrect temperature state', 'Incorrect Temperature State Selected, Should be ' + existingIng.temperatureState);
            }

            if (existingIng.package != ingPackage.toLowerCase()) {
                throw new Meteor.Error('incorrect temperature state', 'Incorrect Packaging Selected, Should be ' + existingIng.package);
            }

            //Check quantity
            if (!(ingPackage.toLowerCase() == 'truckload' || ingPackage.toLowerCase() == 'railcar')) {
                let container = StorageCapacities.findOne({ type: ingTemperatureState });
                let newUsed = Number(container.used) + Number(ingQuantity)
                Meteor.call('sc.editUsed', container._id, Number(newUsed));
            }

            IngredientsList.update({ _id: existingIng._id }, { $inc: { quantity: Number(ingQuantity) } });
            if (!containsVendor(ingVendor, existingIng.vendorInfo)) {
                existingIng.vendorInfo.push({
                    vendor: ingVendor,
                    price: Number(ingPrice)
                });
                IngredientsList.update({ _id: existingIng._id }, {
                    $set: { vendorInfo: existingIng.vendorInfo }
                });
            }
        }
        else {
            Meteor.call('addIngredient',
                ingName,
                ingPackage,
                ingQuantity,
                ingTemperatureState,
                ingVendor,
                ingPrice
            );
        }
    },
    'removeIngredient': function (selectedIngredient) {
        //Check if user can
        if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }
        let existingIng = IngredientsList.findOne({ _id: selectedIngredient });

        if (!(existingIng.package == 'truckload' || existingIng.package == 'railcar')) {

            let container = StorageCapacities.findOne({ type: existingIng.temperatureState });
            let newUsed = Number(container.used) - Number(existingIng.quantity)
            Meteor.call('sc.editUsed', container._id, Number(newUsed));
        }

        IngredientsList.remove({ _id: selectedIngredient });
        // }
    },
    'editName': function (selectedIngredient, newName) {
        if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }
        check(selectedIngredient, String);
        //Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
        check(newName, String);
        IngredientsList.update({ _id: selectedIngredient }, { $set: { name: newName } });
    },
    'editPackage': function (selectedIngredient, newPackage) {
        if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        //if it is going from truckload or railcar to something else, we have to make sure enough room in storage
        let existingIng = IngredientsList.findOne({ _id: selectedIngredient });
        let container = StorageCapacities.findOne({ type: existingIng.temperatureState });

        //truck or rail to physical, put in inventory
        if ((existingIng.package == 'truckload' || existingIng.package == 'railcar') &&
            !(newPackage.toLowerCase() == 'truckload' || newPackage.toLowerCase() == 'railcar')) {
            console.log("this one")
            let newUsed = Number(container.used) + Number(existingIng.quantity)
            Meteor.call('sc.editUsed', container._id, Number(newUsed));
        } 
        
        // truck to rail or vice versa, no change
        else if ((existingIng.package == 'truckload' || existingIng.package == 'railcar') &&
            (newPackage.toLowerCase() == 'truckload' || newPackage.toLowerCase() == 'railcar')) {
            console.log('those ones')
        }
        
        //going to truckload, take out of inventory
        else if (newPackage.toLowerCase() == 'truckload' || newPackage.toLowerCase() == 'railcar') {
            console.log("this other one")
            let newUsed = Number(container.used) - Number(existingIng.quantity)
            Meteor.call('sc.editUsed', container._id, Number(newUsed));
        }

        check(selectedIngredient, String);
        //Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
        check(newPackage, String);
        console.log('here111')
        IngredientsList.update({ _id: selectedIngredient }, { $set: { package: newPackage.toLowerCase() } });
        console.log('here222')
    },
    'editQuantity': function (selectedIngredient, newQuantity) {

        if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        let existingIng = IngredientsList.findOne({ _id: selectedIngredient });

        if (!(existingIng.package == 'truckload' || existingIng.package == 'railcar')) {
            let container = StorageCapacities.findOne({ type: existingIng.temperatureState });
            let newUsed = Number(container.used) - Number(existingIng.quantity) + Number(newQuantity)
            Meteor.call('sc.editUsed', container._id, Number(newUsed));
        }

        check(selectedIngredient, String);
        //Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
        check(newQuantity, Number);
        IngredientsList.update({ _id: selectedIngredient }, { $set: { quantity: Number(newQuantity) } });
    },
    'editTemperatureState': function (selectedIngredient, newTemperatureState) {
        if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        //moving temperature states would change quantities
        let existingIng = IngredientsList.findOne({ _id: selectedIngredient });

        if (!(existingIng.package == 'truckload' || existingIng.package == 'railcar')) {
            let oldContainer = StorageCapacities.findOne({ type: existingIng.temperatureState });
            let newContainer = StorageCapacities.findOne({ type: newTemperatureState.toLowerCase() });
            let oldUsed = Number(oldContainer.used) - Number(existingIng.quantity);
            let newUsed = Number(newContainer.used) + Number(existingIng.quantity);
            Meteor.call('sc.editUsed', newContainer._id, Number(newUsed));
            Meteor.call('sc.editUsed', oldContainer._id, Number(oldUsed));
            
        }

        check(selectedIngredient, String);
        //Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
        check(newTemperatureState, String);
        IngredientsList.update({ _id: selectedIngredient }, { $set: { temperatureState: newTemperatureState.toLowerCase() } });
    },
    'editPrice': function (selectedIngredient, vendorId, newPrice) {
        if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }
        var ingredient = IngredientsList.find({ _id: selectedIngredient }).fetch();
        var vendorInfo = ingredient[0].vendorInfo;
        check(vendorInfo, Array);
        check(newPrice, Number);

        //Perhaps I should return an error if the ingredient price cannot be changed because the vendor
        //specified doesn't exist.

        for (i = 0; i < vendorInfo.length; i++) {
            if (vendorInfo[i].vendor._id == vendorId) {
                IngredientsList.update({
                    _id: selectedIngredient,
                    "vendorInfo.vendor._id": vendorId
                },
                    {
                        $set:
                            {
                                "vendorInfo.$.price": Number(newPrice)
                            }
                    });
            }
        }
    }
});