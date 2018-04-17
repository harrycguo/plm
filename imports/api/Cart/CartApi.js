import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import Carts from './Cart.js';
import IngredientsList from '../Ingredients/IngredientList.js';
import Lots from '../Lots/Lots.js'
import '../Ingredients/IngredientsApi.js';
import '../Lots/LotsApi.js';
import { Vendors } from '../Vendors/vendors.js';
import { containsVendor, indexOfVendorWithId, isInt, checkUndefined, checkIngExists, checkGreaterThanZero, cartContainsIng, cartExists, addToCartCheck, checkCartExists } from '../../utils/checks.js';
import { StorageCapacities } from '../StorageCapacities/storageCapacities';

if(Meteor.isClient) {
    Meteor.subscribe('ingredients');
    Meteor.subscribe('lots');
}

//Cart api
Meteor.methods({
	'createUserCart': function() {
		Carts.insert({
			user: Meteor.userId(),
            ingredients: [],
            pendingOrders: []
		});
	},
    'addIngredientToCart': function(selectedIngredient, numPackages, vendor) {

        if (Carts.find({user: Meteor.userId()}).fetch()[0] === undefined) {
            Meteor.call('createUserCart')
        }

        addToCartCheck(selectedIngredient._id, numPackages)
        let vendorInfo = null

        if (vendor == null) {
            vendorInfo = IngredientsList.find({ _id : selectedIngredient._id }).fetch()[0].vendorInfo[0]
        }
        else {
            vendorList = IngredientsList.find({ _id : selectedIngredient._id }).fetch()[0].vendorInfo
            for (var i = 0; i < vendorList.length; i++) {
                if (vendorList[i].vendor == vendor) {
                    vendorInfo = vendorList[i]
                }
            }
        }

        if (cartContainsIng(selectedIngredient._id)) {
            Meteor.call('cart.changeQuantity',selectedIngredient._id, numPackages)
        } else {
            Carts.update({ user : Meteor.userId()}, {$push : { ingredients : {
                ingredient : selectedIngredient._id,
                numPackages: numPackages,
                vendorInfo: vendorInfo,
                lotsSelected: false,
                lots: []
            }}})
        }
        //For debugging
        // var date = Lots.find({inventoryID : 'Cw8k8FrFQtMm3CRzN'}).fetch()[0].queue[0].time
        // Meteor.call('lots.editLotQty','Cw8k8FrFQtMm3CRzN',1,20,date)
        Meteor.call('systemlog.insert', "Cart", selectedIngredient.name,  selectedIngredient._id, "Added", "");
    },
    'removeIngredientFromCart': function(selectedIngredient) {
        Carts.update({ user : Meteor.userId()},{$pull : {ingredients : { ingredient : selectedIngredient}}});
        Carts.update({ user : Meteor.userId()},{$pull : {pendingOrders : { ingredient : selectedIngredient}}});
        
        Meteor.call('systemlog.insert', 
            "Cart", 
            IngredientsList.find({_id:selectedIngredient}).fetch()[0].name,  
            selectedIngredient, 
            "Removed", 
            ""
        );
    },
    'cart.changeQuantity': function(selectedIngredient, numPackages){
        addToCartCheck(selectedIngredient,numPackages)
        Meteor.call('systemlog.insert', 
            "Cart", 
            IngredientsList.find({_id:selectedIngredient}).fetch()[0].name,  
            selectedIngredient, 
            "Modified - Package Count", 
            numPackages
        );
        Carts.update({ user : Meteor.userId(), 'ingredients.ingredient' : selectedIngredient }, {$set : { 'ingredients.$.numPackages' : numPackages, lotsSelected: false }});
    },
    'cart.changeVendor': function(selectedIngredient, vendor) {
        //TODO: Implement
        // checkCartExists()
        vendorInfoArr = IngredientsList.find({ _id : selectedIngredient }).fetch()[0].vendorInfo
        vendorInfo = {}
        for (var i=0; i<vendorInfoArr.length; i++) {
            if (vendorInfoArr[i].vendor == vendor) {
                vendorInfo = vendorInfoArr[i];
            }
        }
      
        Meteor.call('systemlog.insert', 
            "Cart", 
            IngredientsList.find({_id:selectedIngredient}).fetch()[0].name,  
            selectedIngredient._id, 
            "Modified - Vendor", 
            Vendors.find({_id : vendorInfo.vendor}).fetch()[0].vendor
        );
        Carts.update({ user : Meteor.userId(), 'ingredients.ingredient' : selectedIngredient}, {$set : { 'ingredients.$.vendorInfo' : vendorInfo }});
    },
    'cart.changeLots': function(selectedIngredient, lots, amount, lotsArrived){

        Carts.update(
            {
              user: Meteor.userId(),
              pendingOrders: { $elemMatch: { ingredient: selectedIngredient, numPackages: amount } }
            },
            { $set: { "pendingOrders.$.lotsSelected" : lotsArrived } },
            {multi : false}
         )

         Carts.update(
            {
              user: Meteor.userId(),
              pendingOrders: { $elemMatch: { ingredient: selectedIngredient, numPackages: amount } }
            },
            { $set: { 'pendingOrders.$.lots' : lots } },
            {multi : false}
         )
    
    
    },
    'cart.checkout'(){
        let cart = Carts.find({ user : Meteor.userId()}).fetch()[0];
        let ings = cart.ingredients

        if (ings.length <= 0){
            throw new Meteor.Error("Cart is empty", "Cart is Empty")
        }

        //see if it will exceed capacity
        let packagingMap = new Map();
		packagingMap.set('sack', 0.5);
		packagingMap.set('pail', 1.5);
		packagingMap.set('drum', 3);
		packagingMap.set('supersack', 16);
		packagingMap.set('truckload', 0);
        packagingMap.set('railcar', 0);

        let scMapUsed = new Map();
        let scMapTotal = new Map();

        let storageCapacities = StorageCapacities.find({}).fetch()

        for (let i = 0; i < storageCapacities.length; i++) {
            scMapUsed.set(storageCapacities[i].type, Number(storageCapacities[i].used))
            scMapTotal.set(storageCapacities[i].type, Number(storageCapacities[i].capacity))
        }

        for (let i = 0; i < ings.length; i++){
            let existingIng = IngredientsList.findOne({ _id: ings[i].ingredient })
            let packageType = existingIng.packageInfo.packageType
            let numPackages = ings[i].numPackages
            let storageType = existingIng.temperatureState
            let newStorage = Number(packagingMap.get(packageType)) * Number(numPackages) + Number(scMapUsed.get(storageType))
            scMapUsed.set(storageType, Number(newStorage))
        }

        const temperatures = ['frozen', 'refrigerated', 'room temperature']
        const storage = ['Freezer', 'Refrigerator', 'Warehouse']
        for (let i = 0; i < temperatures.length; i++) {
            if (Number(scMapUsed.get(temperatures[i])) > Number(scMapTotal.get(temperatures[i]))) {
                throw new Meteor.Error("Exceeding Capacity", "Exceeding Capacity for temperature state: " + storage[i] + " with this order")
            }
        }

        for (let i = 0; i < ings.length; i++){
            let ing = ings[i]
            Carts.update({ user : Meteor.userId()}, {$push : { pendingOrders : {
                ingredient : ing.ingredient,
                numPackages: ing.numPackages,
                vendorInfo: ing.vendorInfo,
                lotsSelected: ing.lotsSelected,
                lots: ing.lots
            }}})
        }

        Carts.update({ user : Meteor.userId()}, {$set : {ingredients : []}});

    },
    'pendingOrders.addToInventory'() { //Allow adding to inentory instead of just remove
        let cart = Carts.find({ user : Meteor.userId()}).fetch()[0];
        let ings = cart.pendingOrders;

        if (ings.length <= 0){
            throw new Meteor.Error("Pending Orders is empty", "Can't Update, No Pending Orders")
        }

        //see if it will exceed capacity
        let packagingMap = new Map();
		packagingMap.set('sack', 0.5);
		packagingMap.set('pail', 1.5);
		packagingMap.set('drum', 3);
		packagingMap.set('supersack', 16);
		packagingMap.set('truckload', 0);
        packagingMap.set('railcar', 0);

        let scMapUsed = new Map();
        let scMapTotal = new Map();

        let storageCapacities = StorageCapacities.find({}).fetch()

        for (let i = 0; i < storageCapacities.length; i++) {
            scMapUsed.set(storageCapacities[i].type, Number(storageCapacities[i].used))
            scMapTotal.set(storageCapacities[i].type, Number(storageCapacities[i].capacity))
        }

        for (let i = 0; i < ings.length; i++){
            let existingIng = IngredientsList.findOne({ _id: ings[i].ingredient })
            let packageType = existingIng.packageInfo.packageType
            let numPackages = ings[i].numPackages
            let storageType = existingIng.temperatureState
            let newStorage = Number(packagingMap.get(packageType)) * Number(numPackages) + Number(scMapUsed.get(storageType))
            scMapUsed.set(storageType, Number(newStorage))
        }

        const temperatures = ['frozen', 'refrigerated', 'room temperature']
        const storage = ['Freezer', 'Refrigerator', 'Warehouse']
        for (let i = 0; i < temperatures.length; i++) {
            if (Number(scMapUsed.get(temperatures[i])) > Number(scMapTotal.get(temperatures[i]))) {
                throw new Meteor.Error("Exceeding Capacity", "Exceeding Capacity for temperature state: " + storage[i] + " with adding this order to inventory")
            }
        }

        //This is where the magic happens
        var diff

        ings.forEach(function(ingCartInfo){
            if (ingCartInfo.lotsSelected) {
                var ing = IngredientsList.find({ _id : ingCartInfo.ingredient}).fetch()[0]
                // newAmount = ing.nativeInfo.totalQuantity + ingCartInfo.numPackages * ing.nativeInfo.numNativeUnitsPerPackage;
                // Meteor.call('editTotalNumNativeUnits',ingCartInfo.ingredient,Number(newAmount));
                Meteor.call('ingredients.updateTotalSpending',ingCartInfo.ingredient,ingCartInfo.vendorInfo.vendor,ingCartInfo.numPackages)
                ingCartInfo.lots.forEach(function(lotInfo) {
                    Meteor.call('lots.add',ingCartInfo.ingredient, lotInfo.lotStuff * ing.nativeInfo.numNativeUnitsPerPackage, lotInfo.lotNumber, ingCartInfo.vendorInfo.vendor, ingCartInfo.vendorInfo.price, new Date())
                })
                Carts.update({ user : Meteor.userId()} , {$pull : { pendingOrders : { ingredient : ingCartInfo.ingredient, lotsSelected: true}}})
            }

        })
        Meteor.call('systemlog.insert', "Cart", "Checked Out",  null, "Event", "")

    }
});