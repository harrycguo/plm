import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Vendors } from '../Vendors/vendors.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { containsVendor, indexOfVendorWithId, isInt, checkUndefined, checkIngExists, checkGreaterThanZero } from '../../utils/checks.js';
import { StorageCapacities } from '../StorageCapacities/storageCapacities.js';

if (Meteor.isClient) {
    Meteor.subscribe('storageCapacities'); 
}

//IngredientsList API suh
Meteor.methods({
    'addIngredient': function (ingName, ingPackage, ingQuantity, ingTemperatureState, ingVendor, ingPrice, ingFormulas, ingNativeInfo) {

        //Check to see if user is authorized
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        if (!ingVendor && ingPrice) {
            throw new Meteor.Error('Vendor required for price','Specify vendor or remove price');
        } 

        if (ingVendor && !ingPrice) {
            throw new Meteor.Error('Price required for vendor','Specify price or remove vendor');
        }

        //Check if vendor exists
        var obj = Vendors.findOne({ _id : ingVendor});
        if (Object.keys(obj).length === 0 && obj.constructor === Object) {
            throw new Meteor.Error('Vendor does not exist','Vendor does not exist');
        }

        if (Object.keys(obj).length === 0 && obj.constructor === Object) {
            throw new Meteor.Error('Ingredient native info must be provided','Ingredient native info must be provided');
        }
        else {
            check(ingNativeInfo.name,String);
            check(ingNativeInfo.perPackageQty,Number);
        }

        // console.log(ingVendor);

        //Check to see if capacity won't be exceeded
        if (!(ingPackage.toLowerCase() == 'truckload' || ingPackage.toLowerCase() == 'railcar')) {
            let container = StorageCapacities.findOne({ type: ingTemperatureState });
            let newUsed = Number(container.used) + Number(ingQuantity)
            Meteor.call('sc.editUsed', container._id, Number(newUsed));
        }

        var vendorInfoArr = [];
        if (ingPrice && ingVendor) {
            vendorInfoArr = [{
                vendor: ingVendor,
                price: Number(ingPrice)
            }];
        }
        
        IngredientsList.insert({
            name: ingName.trim(),
            package: ingPackage.toLowerCase(),
            temperatureState: ingTemperatureState.toLowerCase(),
            vendorInfo: vendorInfoArr,
            quantity: Number(ingQuantity),
            nativeInfo: ingNativeInfo,
            formulaInfo: ingFormulas
        });
    },
    //This method will check to see if the ingredient already exists. If not, then call addIngredient.
    'addToExistingIngredient': function (ingName, ingPackage, ingQuantity, ingTemperatureState, ingVendor, ingPrice) {
        // console.log(IngredientsList.find({_id : "jlskfhskjdfsjdfbsmdfbsdmfjhsfdjh"}).fetch());

        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        if (Number(ingStorage) <= 0){
            throw new Meteor.Error('storage must be positive', 'Number of Packages Must Be Greater Than 0');
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
                ingName.trim(),
                ingPackage,
                Number(ingStorage),
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

        if (existingIng.formulaInfo.length > 0) {
            throw new Meteor.Error('Ingredient used in a formula','Ingredient used in a formula');
        }

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

        if (!isInt(newQuantity)) {
            throw new Meteor.Error('Quantity must be an integer','Quantity must be an integer');
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
            if (vendorInfo[i].vendor == vendorId) {
                IngredientsList.update({
                    _id: selectedIngredient,
                    "vendorInfo._id": vendorId
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
        packagingMap.set('sack', 50);
        packagingMap.set('pail', 50);
        packagingMap.set('drum', 500);
        packagingMap.set('supersack', 2000);
        packagingMap.set('truckload', 50000);
        packagingMap.set('railcar', 280000);

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
    'editNativeUnitName': function(selectedIngredient, newName){
        //TODO: Implement this...
        ing = IngredientsList.findOne({ _id : selectedIngredient});
        if (ing !== undefined) {
            IngredientsList.update({ _id : selectedIngredient},{$set : {name : newName}});
        }
        else {
            throw new Meteor.Error('Ingredient not found','Ingredient not found');
        }
    },
    'editNativeQtyPerPackage': function(selectedIngredient, newQty) {
        ing = IngredientsList.findOne({ _id : selectedIngredient});
        checkGreaterThanZero(newQty, 'native units per package');
        checkIngExists(selectedIngredient);
        IngredientsList.update({ _id : selectedIngredient},{$set : {name : newName}});
    },
    'addVendor': function(selectedIngredient, vendorId, price) {
        if (vendorId === "null" || !price) {
            throw new Meteor.Error("Missing fields","Vendor and/or price unspecified");
        }
        var ing = IngredientsList.findOne({ _id : selectedIngredient._id });
        var vendor = Vendors.findOne({ _id : vendorId}); 
        checkUndefined(vendor,'vendor');
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