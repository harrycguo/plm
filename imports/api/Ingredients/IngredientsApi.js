import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Vendors } from '../Vendors/vendors.js';
import { Carts } from '../Cart/Cart'
import { Bert } from 'meteor/themeteorchef:bert';
import { containsVendor, indexOfVendorWithId, isInt, checkUndefined, checkIngExists, checkGreaterThanZero } from '../../utils/checks.js';
import { StorageCapacities } from '../StorageCapacities/storageCapacities.js';
import  Formulas  from '../Formulas/formulas.js'
import { Intermediates } from '../Intermediates/intermediates.js'
// import FreshReportApi from '../FreshReport/FreshReportApi.js'

if (Meteor.isClient) {
    Meteor.subscribe('storageCapacities'); 
    Meteor.subscribe('lots');
    Meteor.subscribe('lotshistory')
}

//IngredientsList API suhhhhhhhhh
Meteor.methods({
    'addIngredient': function (ingName, ingTemperatureState, ingPackage, numPackages, ingStorage, ingTotalNumNativeUnits , ingNativeUnit, ingNumNativeUnitsPerPackage, ingVendor, ingPrice) {

        //Check to see if user is authorized
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        // if ingredient already exists
        let existingIng = IngredientsList.findOne({ name: ingName.trim() });
        if (existingIng !== undefined){
            throw new Meteor.Error("Ingredient Already Exists", "Ingredient Already Exists")
        }

        //check vendor price tuple
        if (Object.keys(ingVendor).length === 0 && ingVendor.constructor === Object && ingPrice) {
            throw new Meteor.Error('Vendor required for price','Specify Vendor or remove Price');
        } 

        if (Object.keys(ingVendor).length > 0 && !ingPrice) {
            throw new Meteor.Error('Price required for vendor','Specify Price or remove Vendor');
        }

        //Check to see if capacity won't be exceeded
        if (!(ingPackage.toLowerCase() == 'truckload' || ingPackage.toLowerCase() == 'railcar')) {
            let container = StorageCapacities.findOne({ type: ingTemperatureState });
            let newUsed = Number(container.used) + Number(ingStorage)
            Meteor.call('sc.editUsed', container._id, Number(newUsed));
        }

        var vendorInfoArr = [];
        if (ingPrice && ingVendor) {
            vendorInfoArr = [{
                vendor: ingVendor,
                price: Number(ingPrice)
            }];
        }

        let nativeInfoArr = {
            totalQuantity: Number(ingTotalNumNativeUnits),
			nativeUnit: ingNativeUnit,
			numNativeUnitsPerPackage: Number(ingNumNativeUnitsPerPackage),
        }
        
        let packageInfoArr = {
            packageType: ingPackage.toLowerCase(),
            numPackages: Number(numPackages),
        }
        
        IngredientsList.insert({
            name: ingName.trim(),
            temperatureState: ingTemperatureState.toLowerCase(),
            packageInfo: packageInfoArr,
            storage: Number(ingStorage),
            nativeInfo: nativeInfoArr,
            vendorInfo: vendorInfoArr,
            formulaInfo: []
        });
        Meteor.call('systemlog.insert',
      "Ingredient", ingName.trim(), IngredientsList.findOne({name: ingName.trim()})._id, 
        "Added", ingName.trim());
        // IngredientsList.simpleSchema().clean()
        console.log(IngredientsList.find().fetch())
    },
    //This method will check to see if the ingredient already exists. If not, then call addIngredient.
    'addToExistingIngredient': function (ingName, ingTemperatureState, ingPackage, numPackages, ingStorage, ingTotalNumNativeUnits , ingNativeUnit, ingNumNativeUnitsPerPackage, ingVendor, ingPrice) {
        
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        // Storage must be positive no matter what
        if (Number(numPackages) < 0){
            throw new Meteor.Error('storage must be positive', 'Number of Packages Must Be Greater Than 0');
        }

        let existingIng = IngredientsList.findOne({ name: ingName.trim() });

        //If ingredient exists, update it instead of adding a new database entry
        if (existingIng !== undefined) {

            //check packaging time
            if (existingIng.packageInfo.packageType != ingPackage.toLowerCase()) {
                throw new Meteor.Error('incorrect temperature state', 'Incorrect Packaging Selected, Should be ' + existingIng.packageInfo.packageType);
            }

             //check temperature state
             if (existingIng.temperatureState != ingTemperatureState.toLowerCase()) {
                throw new Meteor.Error('incorrect temperature state', 'Incorrect Temperature State Selected, Should be ' + existingIng.temperatureState);
            }

            //check to see if num native units per package is correct
            if (existingIng.nativeInfo.numNativeUnitsPerPackage != ingNumNativeUnitsPerPackage) {
                throw new Meteor.Error('incorrect native unit per package', 'Incorrect Native Units perPackage, Should be ' + existingIng.nativeInfo.numNativeUnitsPerPackage);
            }

            //Check if native unit is correct
            if (existingIng.nativeInfo.nativeUnit != ingNativeUnit) {
                throw new Meteor.Error('incorrect native unit', 'Incorrect Native Unit Selected, Should be ' + existingIng.nativeInfo.nativeUnit);
            }

            //Edit quantity to match new package
            if (!(ingPackage.toLowerCase() == 'truckload' || ingPackage.toLowerCase() == 'railcar')) {
                let container = StorageCapacities.findOne({ type: ingTemperatureState });
                let newUsed = Number(container.used) + Number(ingStorage)
                Meteor.call('sc.editUsed', container._id, Number(newUsed));
            }

            // increase storage, num packages, quantity of native units
            IngredientsList.update({ _id: existingIng._id }, { $inc: { storage: Number(ingStorage) } });
            IngredientsList.update({ _id: existingIng._id }, { $inc: { "packageInfo.numPackages": Number(numPackages) } });
            IngredientsList.update({ _id: existingIng._id }, { $inc: { "nativeInfo.totalQuantity": Number(ingTotalNumNativeUnits) } });
            
            
            //if it has both price and vendor
            if (ingPrice && ingVendor) {

                let vendorInfo = existingIng.vendorInfo

                if (!containsVendor(ingVendor, vendorInfo)) {
                    vendorInfo.push({
                        vendor: ingVendor,
                        price: Number(ingPrice)
                    });
                    
                } else {
                    
                    for (let i = 0; i < vendorInfo.length; i++) {
                        if (vendorInfo[i] == ingVendor){
                            vendorInfo[i] = {vendor: ingVendor, price: Number(ingPrice)}
                        }
                    }
                }

                IngredientsList.update({ _id: existingIng._id }, {
                    $set: { vendorInfo: vendorInfo }
                });
            }   
        }


        else {
            Meteor.call('addIngredient',
                ingName.trim(),
                ingTemperatureState,
                ingPackage,
                numPackages,
                Number(ingStorage),
                ingTotalNumNativeUnits,
                ingNativeUnit,
                ingNumNativeUnitsPerPackage,
                ingVendor,
                ingPrice
            );
        }
    },
    'addToExistingIngredientBulk': function (ingName, ingTemperatureState, ingPackage, numPackages, ingStorage, ingTotalNumNativeUnits , ingNativeUnit, ingNumNativeUnitsPerPackage, ingVendor, ingPrice) {
        
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        let existingIng = IngredientsList.findOne({ name: ingName.trim() });

        //If ingredient exists, update it instead of adding a new database entry
        if (existingIng !== undefined) {

            //check packaging time
            if (existingIng.packageInfo.packageType != ingPackage.toLowerCase()) {
                throw new Meteor.Error('incorrect temperature state', 'Incorrect Packaging Selected, Should be ' + existingIng.packageInfo.packageType);
            }

             //check temperature state
             if (existingIng.temperatureState != ingTemperatureState.toLowerCase()) {
                throw new Meteor.Error('incorrect temperature state', 'Incorrect Temperature State Selected, Should be ' + existingIng.temperatureState);
            }

            //check to see if num native units per package is correct
            if (existingIng.nativeInfo.numNativeUnitsPerPackage != ingNumNativeUnitsPerPackage) {
                throw new Meteor.Error('incorrect native unit per package', 'Incorrect Native Units perPackage, Should be ' + existingIng.nativeInfo.numNativeUnitsPerPackage);
            }

            //Check if native unit is correct
            if (existingIng.nativeInfo.nativeUnit != ingNativeUnit) {
                throw new Meteor.Error('incorrect native unit', 'Incorrect Native Unit Selected, Should be ' + existingIng.nativeInfo.nativeUnit);
            }

            //Edit quantity to match new package
            if (!(ingPackage.toLowerCase() == 'truckload' || ingPackage.toLowerCase() == 'railcar')) {
                let container = StorageCapacities.findOne({ type: ingTemperatureState });
                let newUsed = Number(container.used) + Number(ingStorage)
                Meteor.call('sc.editUsed', container._id, Number(newUsed));
            }

            // increase storage, num packages, quantity of native units
            IngredientsList.update({ _id: existingIng._id }, { $inc: { storage: Number(ingStorage) } });
            IngredientsList.update({ _id: existingIng._id }, { $inc: { "packageInfo.numPackages": Number(numPackages) } });
            IngredientsList.update({ _id: existingIng._id }, { $inc: { "nativeInfo.totalQuantity": Number(ingTotalNumNativeUnits) } });
            
            Meteor.call('systemlog.insert',
            "Ingredient", existingIng.name, existingIng._id, 
            "Modified - Storage", ingStorage);
            
            Meteor.call('systemlog.insert',
            "Ingredient", existingIng.name, existingIng._id, 
            "Modified - Package Count", numPackages);

            Meteor.call('systemlog.insert',
            "Ingredient", existingIng.name, existingIng._id, 
            "Modified - Total Native Units", ingTotalNumNativeUnits);
            //if it has both price and vendor
            if (ingPrice && ingVendor) {

                let vendorInfo = existingIng.vendorInfo

                if (!containsVendor(ingVendor, vendorInfo)) {
                    vendorInfo.push({
                        vendor: ingVendor,
                        price: Number(ingPrice)
                    });
                    
                } else {
                    console.log(ingVendor)
                    console.log(vendorInfo)
                    for (let i = 0; i < vendorInfo.length; i++) {
                        if (vendorInfo[i].vendor == ingVendor){
                            vendorInfo[i] = {vendor: ingVendor, price: Number(ingPrice)}
                        }
                    }
                }


                Meteor.call('systemlog.insert',
                    "Ingredient", existingIng.name, existingIng._id, 
                    "Modified - Vendors", "");
                IngredientsList.update({ _id: existingIng._id }, {
                    $set: { vendorInfo: vendorInfo }
                });
            }   
        }

        else {
            Meteor.call('addIngredient',
                ingName.trim(),
                ingTemperatureState,
                ingPackage,
                numPackages,
                Number(ingStorage),
                ingTotalNumNativeUnits,
                ingNativeUnit,
                ingNumNativeUnitsPerPackage,
                ingVendor,
                ingPrice
            );
        }
        // Meteor.call('freshreport.insert',)
    },
    'removeIngredient': function (selectedIngredient) {
        //Check if user can
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        let existingIng = IngredientsList.findOne({ _id: selectedIngredient });

        let formulasError = ""
        let removeArr = []
        let formulaInfo = existingIng.formulaInfo

        if (formulaInfo.length > 0){
            for (let i = 0; i < existingIng.formulaInfo.length; i++){
              let existingFP = Formulas.findOne({_id: formulaInfo[i]})
              let existingInt = Intermediates.findOne({_id: formulaInfo[i]})
              
              if (existingFP == undefined && existingInt == undefined){
                removeArr.push(i)
              } else {
                let item = existingFP != undefined ? existingFP : existingInt
                let ingList = item.ingredientsList
                let ingListSet = new Set()
                for (let k = 0; k < ingList.length; k++){
                  ingListSet.add(ingList[k].id)
                }
                if (!ingListSet.has(selectedIngredient)){
                  removeArr.push(i)
                }
                else {
                    formulasError += item.name + ", "
                }
              }
            }
      
            if (removeArr.length > 0){
              for (let j = 0; j < removeArr.length; j++){
                  let index = removeArr[j] - j
                  formulaInfo.splice(index, 1);
              }
            }
      
            IngredientsList.update({ _id: selectedIngredient }, {
              $set: {
                formulaInfo: formulaInfo
              }
            })
          }

        if (formulasError.length > 0){
            formulasError = formulasError.substring(0, formulasError.length - 2)
            throw new Meteor.Error('Ingredient used in a formulas','Cannot delete, Ingredient used in Formula(s): ' + formulasError);
        }

        if (!(existingIng.package == 'truckload' || existingIng.package == 'railcar')) {

            let container = StorageCapacities.findOne({ type: existingIng.temperatureState });
            let newUsed = Number(container.used) - Number(existingIng.storage)
            Meteor.call('sc.editUsed', container._id, Number(newUsed));
        }

        //check to see if it's in cart
        Meteor.call('removeIngredientFromCart', selectedIngredient)

        IngredientsList.remove({ _id: selectedIngredient });
        Lots.remove({ inventoryID : selectedIngredient});
        Meteor.call('systemlog.insert',
            "Ingredient", existingIng.name, existingIng._id, 
            "Removed", "");
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
        Meteor.call('systemlog.insert',
            "Ingredient", 
            IngredientsList.findOne({_id: selectedIngredient}).name, 
            selectedIngredient, 
            "Modified - Name", newName);
        IngredientsList.update({ _id: selectedIngredient }, { $set: { name: newName.trim() } });
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
            let oldUsed = Number(oldContainer.used) - Number(existingIng.storage);
            let newUsed = Number(newContainer.used) + Number(existingIng.storage);
            Meteor.call('sc.editUsed', newContainer._id, Number(newUsed));
            Meteor.call('sc.editUsed', oldContainer._id, Number(oldUsed));
            
        }

        check(selectedIngredient, String);
        //Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
        check(newTemperatureState, String);
        Meteor.call('systemlog.insert',
            "Ingredient", existingIng.name, existingIng._id, 
            "Modified - Temp. State", newTemperatureState);
        IngredientsList.update({ _id: selectedIngredient }, { $set: { temperatureState: newTemperatureState.toLowerCase() } });
    },
    'editPackage': function (selectedIngredient, newPackage) {

        if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        //if it is going from truckload or railcar to something else, we have to make sure enough room in storage
        let existingIng = IngredientsList.findOne({ _id: selectedIngredient });
        let container = StorageCapacities.findOne({ type: existingIng.temperatureState });

        let packagingMap = new Map();
		packagingMap.set('sack', 0.5);
		packagingMap.set('pail', 1.5);
		packagingMap.set('drum', 3);
		packagingMap.set('supersack', 16);
		packagingMap.set('truckload', 0);
        packagingMap.set('railcar', 0);
        
        //update storage and container
        let newStorage = Number(packagingMap.get(newPackage.toLowerCase())) * Number(existingIng.packageInfo.numPackages)
        let newUsed = 0;
        
        //truck or rail to physical, put in inventory
        if ((existingIng.packageInfo.packageType == 'truckload' || existingIng.packageInfo.packageType == 'railcar') &&
            !(newPackage.toLowerCase() == 'truckload' || newPackage.toLowerCase() == 'railcar')) {
            console.log("rail/truck to phyiscal: put in storage")
            newUsed = Number(container.used) + Number(newStorage)
        } 
        
        // truck to rail or vice versa, no change
        else if ((existingIng.packageInfo.packageType == 'truckload' || existingIng.packageInfo.packageType == 'railcar') &&
            (newPackage.toLowerCase() == 'truckload' || newPackage.toLowerCase() == 'railcar')) {
            console.log('rail/truck to rail/car: nothing')
        }
        
        //going to truckload, take out of inventory
        else if (newPackage.toLowerCase() == 'truckload' || newPackage.toLowerCase() == 'railcar') {
            newUsed = Number(container.used) - Number(existingIng.storage)
            console.log("physical to rail/truck")
        } 
        
        //regular 
        else {
            newUsed = Number(container.used) - Number(existingIng.storage) + Number(newStorage)
            console.log("physical to physical")
        }

        Meteor.call('sc.editUsed', container._id, Number(newUsed));

        check(selectedIngredient, String);
        //Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
        check(newPackage, String);

        Meteor.call('systemlog.insert',
            "Ingredient", existingIng.name, existingIng._id, 
            "Modified - Packaging", newPackage);
        //update package
        IngredientsList.update({ _id: selectedIngredient }, { $set: { "packageInfo.packageType": newPackage.toLowerCase() } });
        IngredientsList.update({ _id: selectedIngredient }, { $set: { storage:  Number(newStorage)} });    
    },
    'editNumPackages': function (selectedIngredient, newNumPackages) {

        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        check(newNumPackages, Number);

        
        if (!isInt(newNumPackages)) {
            throw new Meteor.Error('New Number of packages must be an integer', 'New number of packages must be an integer');
        }

        let existingIng = IngredientsList.findOne({ _id: selectedIngredient });

        check(selectedIngredient, String);
        //Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
        check(newNumPackages, Number);

        //Just set new packages up: make sure to pass the correct value in the first place
        IngredientsList.update({ _id: selectedIngredient }, { $set: { "packageInfo.numPackages": Number(newNumPackages) } });

        let packagingMap = new Map();
		packagingMap.set('sack', 0.5);
		packagingMap.set('pail', 1.5);
		packagingMap.set('drum', 3);
		packagingMap.set('supersack', 16);
		packagingMap.set('truckload', 0);
        packagingMap.set('railcar', 0);

        let newStorage = newNumPackages * packagingMap.get(existingIng.packageInfo.packageType)
        Meteor.call('systemlog.insert',
            "Ingredient", existingIng.name, existingIng._id, 
            "Modified - Package Count", newNumPackages);
        Meteor.call('editStorage', selectedIngredient, Number(newStorage))

    },
    'editStorage': function (selectedIngredient, newStorage) {

        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        // if (!isInt(newStorage)) {
        //     throw new Meteor.Error('Storage must be an Integer', 'Storage must be an Integer');
        // }jlkjkjhlk

        let existingIng = IngredientsList.findOne({ _id: selectedIngredient });

        if (!(existingIng.packageInfo.packageType == 'truckload' || existingIng.packageInfo.packageType == 'railcar')) {
            let container = StorageCapacities.findOne({ type: existingIng.temperatureState });
            let newUsed = Number(container.used) - Number(existingIng.storage) + Number(newStorage)
            Meteor.call('sc.editUsed', container._id, Number(newUsed));
        }
        Meteor.call('systemlog.insert',
            "Ingredient", existingIng.name, existingIng._id, 
            "Modified - Storage", newStorage);
        IngredientsList.update({ _id: selectedIngredient }, { $set: { storage : Number(newStorage) } });
    },
    'editNumNativeUnitsPerPackage': function(selectedIngredient, newNumNativeUnitsPerPackage) {
        
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        if (!isInt(newNumNativeUnitsPerPackage)) {
            throw new Meteor.Error('Number of Native Units Per Package must be an integer', 'Number of Native Units Per Package must be an Integer');
        }


        let existingIng = IngredientsList.findOne({ _id: selectedIngredient });

        //edit packages
        let remainingPackages = Math.ceil(Number(existingIng.nativeInfo.totalQuantity) / Number(newNumNativeUnitsPerPackage))
        Meteor.call('systemlog.insert',
            "Ingredient", existingIng.name, existingIng._id, 
            "Modified - Native Units per Package", newNumNativeUnitsPerPackage);
    
        Meteor.call('editNumPackages', selectedIngredient, Number(remainingPackages))


        //update number of native units per package
        IngredientsList.update({ _id : selectedIngredient}, {$set : {"nativeInfo.numNativeUnitsPerPackage" : Number(newNumNativeUnitsPerPackage)}});

        
    },
    'editTotalNumNativeUnits': function(selectedIngredient, newTotalNumNativeUnits) {
        
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }

        // if (!isInt(newTotalNumNativeUnits)) {
        //     throw new Meteor.Error('Number of Total Native Units must be an integer', 'Number of Total Native Units must be an Integer');
        // }

        if (newTotalNumNativeUnits < 0) {
            throw new Meteor.Error('Number of Total Native Units must be greater than 0', 'Number of Total Native Units must be greater than 0');
        }

        let existingIng = IngredientsList.findOne({ _id: selectedIngredient });

        Meteor.call('systemlog.insert',
            "Ingredient", existingIng.name, existingIng._id, 
            "Modified - Total Native Units", newTotalNumNativeUnits);
        

        //re-calculate footprint
        let remainingPackages = Math.ceil(Number(newTotalNumNativeUnits) / Number(existingIng.nativeInfo.numNativeUnitsPerPackage))
        
        let packagingMap = new Map();
		packagingMap.set('sack', 0.5);
		packagingMap.set('pail', 1.5);
		packagingMap.set('drum', 3);
		packagingMap.set('supersack', 16);
		packagingMap.set('truckload', 0);
        packagingMap.set('railcar', 0);

        let newStorage = remainingPackages * packagingMap.get(existingIng.packageInfo.packageType)
        Meteor.call('editStorage', selectedIngredient, Number(newStorage))
        Meteor.call('editNumPackages', selectedIngredient, Number(remainingPackages))
        IngredientsList.update({ _id : selectedIngredient}, {$set : {"nativeInfo.totalQuantity" : Number(newTotalNumNativeUnits)}});

    },
    'editNativeUnit': function(selectedIngredient, newNativeUnit){
        
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }
        Meteor.call('systemlog.insert',
            "Ingredient", IngredientsList.findOne({_id: selectedIngredient}).name, selectedIngredient, 
            "Modified - Native Unit", newNativeUnit);
        IngredientsList.update({ _id : selectedIngredient}, {$set : {"nativeInfo.nativeUnit" : newNativeUnit}});
    },
    'editPrice': function (selectedIngredient, vendorId, newPrice) {
        if (!this.userId || !Roles.userIsInRole(this.userId, 'admin')) {
            throw new Meteor.Error('not-authorized', 'not-authorized');
        }
        var ingredient = IngredientsList.find({ _id: selectedIngredient }).fetch();
        var vendorInfo = ingredient[0].vendorInfo;
        check(vendorInfo, Array);
        check(newPrice, Number);
        console.log("updating price")
        console.log(newPrice)
        //Perhaps I should return an error if the ingredient price cannot be changed because the vendor
        //specified doesn't exist.

        for (i = 0; i < vendorInfo.length; i++) {
            if (vendorInfo[i].vendor == vendorId) {
                IngredientsList.update({
                    _id: selectedIngredient,
                    "vendorInfo.vendor": vendorId
                },
                    {
                        $set:
                            {
                                "vendorInfo.$.price": Number(newPrice)
                            }
                    });
            }
        }

        Meteor.call('systemlog.insert',
            "Ingredient", IngredientsList.findOne({_id: selectedIngredient}).name, selectedIngredient, 
            "Modified - Price", newPrice); 
        vendorInfoUpdated = IngredientsList.find({ _id: selectedIngredient }).fetch()[0].vendorInfo;
        vendorInfoUpdated.sort(function(a,b) {return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);})
        IngredientsList.update({ _id : selectedIngredient._id}, {$set : {vendorInfo : vendorInfoUpdated}});
    },
    'orderIngredient': function (ingredient, vendor, numPackages) {
        // var ingredient = IngredientsList.find({ _id: selectedIngredient }).fetch();

        //WILL BE DONE IN THE CART NOW!
        check(numPackages, Number);

        let packagingMap = new Map();
		packagingMap.set('sack', 0.5);
		packagingMap.set('pail', 1.5);
		packagingMap.set('drum', 3);
		packagingMap.set('supersack', 16);
		packagingMap.set('truckload', 0);
        packagingMap.set('railcar', 0);

        let ingredientQuantity = Number(packagingMap.get(ingredient.package)) * Number(numPackages)
        let newPrice = Number((vendor.cost * ingredientQuantity + ingredient.price * ingredient.storage) / (ingredientQuantity +ingredient.quantity))

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
    'getIngredientFromId': function(id) {
        var ing = IngredientsList.findOne({ _id : id});
        if (ing === undefined)
            throw new Meteor.Error('Ingredient does not exist','Ingredient does not exist');
        return ing;
    },
    'addVendor': function(selectedIngredient, vendorId, price) {
        console.log("From Add Vendor:")
        console.log(selectedIngredient)
        console.log(vendorId)
        console.log(price)
        if (vendorId === "null" || !price) {
            throw new Meteor.Error("Missing fields","Vendor and/or price unspecified");
        }
        var ing = IngredientsList.findOne({ _id : selectedIngredient._id });
        var vendor = Vendors.findOne({ _id : vendorId}); 
        console.log(vendor)
        checkUndefined(vendor,'vendor');
        if(containsVendor(vendor._id, ing.vendorInfo)) {
            throw new Meteor.Error('Already has vendor','Vendor is already associated with this Ingredient');
        }
        var newVendor = {
            vendor: vendor._id,
            price: price
        };
        Meteor.call('systemlog.insert',
            "Ingredient", selectedIngredient.name, selectedIngredient._id, 
            "Modified - New Price Option", price);
        ing.vendorInfo.push(newVendor)
        ing.vendorInfo.sort(function(a,b) {return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);})
        IngredientsList.update({ _id : selectedIngredient._id}, {$set : {vendorInfo : ing.vendorInfo}});
    },
    'swapVendor': function(selectedIngredient, oldVendor, newVendor, price) {
        if (newVendor === "null" || !price) {
            throw new Meteor.Error("Missing fields","Vendor and/or price unspecified");
        }
        console.log("swap")
        console.log(oldVendor)
        console.log(newVendor)
        console.log(price)
        if(newVendor == oldVendor._id) {
            console.log("price edit")
            Meteor.call('editPrice',
                selectedIngredient._id, newVendor, price)
        } else {
            var ing = IngredientsList.findOne({ _id : selectedIngredient._id });
            var vendor = Vendors.findOne({ _id : newVendor}); 
            checkUndefined(vendor,'vendor');
            if(containsVendor(vendor._id, ing.vendorInfo)) {
                throw new Meteor.Error('Already has vendor','Vendor is already associated with this Ingredient');
            }
            var newVendor = {
                vendor: vendor._id,
                price: price
            };
            Meteor.call('systemlog.insert',
                "Ingredient", selectedIngredient.name, selectedIngredient._id, 
                "Modified - New Price Option", price);
            ing.vendorInfo.push(newVendor)
            ing.vendorInfo.sort(function(a,b) {return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);})
            IngredientsList.update({ _id : selectedIngredient._id}, {$set : {vendorInfo : ing.vendorInfo}});
            
            Meteor.call('systemlog.insert',
                "Ingredient", selectedIngredient.name, selectedIngredient._id, 
                "Modified - Removed Vendor", oldVendor.name);
            IngredientsList.update({ _id : selectedIngredient._id} , {$pull : { vendorInfo : { vendor : oldVendor._id}}});
        }
    },
    'removeVendor': function(selectedIngredient, vendor) {
        //This comment only exists just so that I can minimize the method
        Meteor.call('systemlog.insert',
            "Ingredient", selectedIngredient.name, selectedIngredient._id, 
            "Modified - Removed Vendor", vendor.name);
        IngredientsList.update({ _id : selectedIngredient._id} , {$pull : { vendorInfo : { vendor : vendor._id}}});
    },
    'ingredients.updateTotalSpending': function(selectedIngredient, vendor, numPackages) {
        var ing = IngredientsList.find({ _id : selectedIngredient}).fetch()[0]
        price = 0
        vendorInfoArr = ing.vendorInfo
        for (var i = 0; i < vendorInfoArr.length; i++) {
            if (vendorInfoArr[i].vendor == vendor) {
                price = vendorInfoArr[i].price//sdfdfdsf
            }
        }
        let newPrice = Number((price * numPackages + ing.spendingInfo.totalSpending) / (numPackages +ing.spendingInfo.numPackagesOrdered))
        let newTotalSpending = newPrice * (numPackages + ing.spendingInfo.numPackagesOrdered)
        IngredientsList.update({ _id : selectedIngredient},{$set : {'spendingInfo.totalSpending' : Number(newTotalSpending).toFixed(2)}})
        IngredientsList.update({ _id : selectedIngredient},{$set : {'spendingInfo.avgPrice' : Number(newPrice).toFixed(2)}})
        IngredientsList.update({ _id : selectedIngredient},{$inc : {'spendingInfo.numPackagesOrdered' : Number(numPackages).toFixed(2)}})
    },
    'ingredients.updateTotalProdSpending': function(selectedIngredient, numNativeUnits) {
        var ing = IngredientsList.find({ _id : selectedIngredient}).fetch()[0]
        var newNumNativeUnitsProduced = numNativeUnits + ing.spendingInfo.numNativeUnitsProduced
        console.log('New: '+newNumNativeUnitsProduced)
        let totalPackagesUsedInProd = newNumNativeUnitsProduced/ing.nativeInfo.numNativeUnitsPerPackage 
        var newProdSpendingTotal = totalPackagesUsedInProd * ing.spendingInfo.avgPrice

        if (newProdSpendingTotal > ing.spendingInfo.totalSpending) {
            newProdSpendingTotal = ing.spendingInfo.totalSpending
        }

        console.log('Production spending: '+newProdSpendingTotal)
        // console.log('packages used in prod'+packagesUsedInProd)
        console.log('Avg Price'+ing.spendingInfo.avgPrice)
        IngredientsList.update({ _id : selectedIngredient},{$set : {'spendingInfo.totalProdSpending' : Number(newProdSpendingTotal).toFixed(2)}})
        IngredientsList.update({ _id : selectedIngredient},{$set : {'spendingInfo.numNativeUnitsProduced' : Number(newNumNativeUnitsProduced).toFixed(2)}})
    }
});