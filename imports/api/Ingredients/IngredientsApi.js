import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Vendors } from '../Vendors/vendors.js';
// import { StorageCapacities } from '../StorageCapacities/storageCapacities.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { isInt } from '../../utils/checks.js';
import { containsVendor, indexOfVendorWithId } from '../../utils/checks.js';
import { StorageCapacities } from '../StorageCapacities/storageCapacities.js';

if (Meteor.isClient) {
    Meteor.subscribe('storageCapacities');
}

//IngredientsList API suh
Meteor.methods({
    'addIngredient': function (ingName, ingPackage, ingStorage, ingTemperatureState, ingVendor, ingPrice) {

        //Check to see if user is authorized
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        if (Object.keys(ingVendor).length === 0 && ingVendor.constructor === Object && ingPrice) {
            throw new Meteor.Error('Vendor required for price','Specify vendor or remove price');
        } 

        if (Object.keys(ingVendor).length > 0 && !ingPrice) {
            throw new Meteor.Error('Price required for vendor','Specify price or remove vendor');
        }

        console.log(ingVendor);

        //Check to see if capacity won't be exceeded
        if (!(ingPackage.toLowerCase() == 'truckload' || ingPackage.toLowerCase() == 'railcar')) {
            let container = StorageCapacities.findOne({ type: ingTemperatureState });
            let newUsed = Number(container.used) + Number(ingStorage)
            Meteor.call('sc.editUsed', container._id, Number(newUsed));
        }

        var vendorInfoArr = [];
        console.log(Object.keys(ingVendor).length > 0);
        console.log(ingPrice);
        if (ingPrice && Object.keys(ingVendor).length > 0) {
            vendorInfoArr = [{
                vendor: ingVendor,
                price: Number(ingPrice)
            }];
        }
        console.log(vendorInfoArr);
        
        IngredientsList.insert({
            name: ingName.trim(),
            package: ingPackage.toLowerCase(),
            temperatureState: ingTemperatureState.toLowerCase(),
            vendorInfo: vendorInfoArr,
            quantity: Number(ingStorage),
            price: Number(0)
            // prices: priceTuples
        });
    },
    //This method will check to see if the ingredient already exists. If not, then call addIngredient.
    'addToExistingIngredient': function (ingName, ingPackage, ingStorage, ingTemperatureState, ingVendor, ingPrice) {
        console.log(IngredientsList.find({_id : "jlskfhskjdfsjdfbsmdfbsdmfjhsfdjh"}).fetch());

        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        let existingIng = IngredientsList.findOne({ name: ingName.trim() });
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
                let newUsed = Number(container.used) + Number(ingStorage)
                Meteor.call('sc.editUsed', container._id, Number(newUsed));
            }

            IngredientsList.update({ _id: existingIng._id }, { $inc: { quantity: Number(ingStorage) } });
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
                ingName.trim(),
                ingPackage,
                ingStorage,
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

        let existingIng = IngredientsList.findOne({ name: newName.trim() });
        
        if (existingIng !== undefined) {
            throw new Meteor.Error('ingredient name already exists', 'Ingredient Name Already Exists');
        }
    
        check(selectedIngredient, String);
        //Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
        check(newName, String);
        IngredientsList.update({ _id: selectedIngredient }, { $set: { name: newName.trim() } });
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
            console.log("edit used check")
        }

        check(selectedIngredient, String);
        console.log("Selected ingredient ok")
        //Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
        check(newPackage, String);
        console.log("New package okay")
        IngredientsList.update({ _id: selectedIngredient }, { $set: { package: newPackage.toLowerCase() } });
        console.log("Done changing package")
    },
    'editQuantity': function (selectedIngredient, newQuantity) {
        // if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
        //     throw new Meteor.Error('not-authorized', 'not-authorized');
        // }

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
    },
    'orderIngredient': function (ingredient, vendor, numPackages) {
        // var ingredient = IngredientsList.find({ _id: selectedIngredient }).fetch();

        //WILL BE DONE IN THE CART NOW!
        check(numPackages, Number);

        var packagingMap = new Map();
        packagingMap.set('sack', 0.5);
        packagingMap.set('pail', 1);
        packagingMap.set('drum', 3);
        packagingMap.set('supersack', 16);
        packagingMap.set('truckload', 0);
        packagingMap.set('railcar', 0);

        let ingredientQuantity = Number(packagingMap.get(ingredient.package)) * Number(numPackages)
        console.log("\t"+vendor)
        console.log("\t"+vendor.cost+" "+ingredientQuantity +" "+ingredient.price +" "+ ingredient.quantity)
        let newPrice = Number((vendor.cost * ingredientQuantity + ingredient.price * ingredient.quantity) / (ingredientQuantity +ingredient.quantity))

        console.log("\t"+newPrice)
        IngredientsList.update({ _id: ingredient._id}, {$set: {price: Number(newPrice)}});

        // TODO: Throw down a call to the sales table
        Meteor.call('addToExistingIngredient', 
            ingredient.name,
            ingredient.package,
            ingredientQuantity,
            ingredient.temperatureState,
            ingredient.vendorInfo,
        )

        Meteor.call('logOrderInReport', ingredient, ingredientQuantity, vendor.cost)
    },
    'addVendor': function(selectedIngredient, vendorId, price) {
        if (vendorId === "null" || !price) {
            throw new Meteor.Error("Missing fields","Vendor and/or price unspecified");
        }
        var ing = IngredientsList.findOne({ _id : selectedIngredient._id });
        var vendor = Vendors.findOne({ _id : vendorId}); 
        if(containsVendor(vendor,ing.vendorInfo)) {
            throw new Meteor.Error('Already has vendor','this vendor is already associated with this ingredient');
        }
        var newVendor = {
            vendor: vendor,
            price: price
        };
        IngredientsList.update({ _id : selectedIngredient._id}, {$push : {vendorInfo : newVendor}});
    },
    'removeVendor': function(selectedIngredient, vendor) {
        IngredientsList.update({ _id : selectedIngredient._id} , {$pull : { vendorInfo : { "vendor._id" : vendor._id}}});
    }
});