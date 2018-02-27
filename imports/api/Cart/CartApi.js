import { Mongo } from 'meteor/mongo';
import Carts from './Cart.js';
import IngredientsList from '../Ingredients/IngredientList.js';
import '../Ingredients/IngredientsApi.js';
import { Vendors } from '../Vendors/vendors.js';
import { containsVendor, indexOfVendorWithId, isInt, checkUndefined, checkIngExists, checkGreaterThanZero, cartContainsIng, cartExists, addToCartCheck, checkCartExists } from '../../utils/checks.js';

if(Meteor.isClient) {
    Meteor.subscribe('ingredients');
}

//Cart api
Meteor.methods({
	'createUserCart': function() {
		Carts.insert({
			user: Meteor.userId(),
			ingredients: []
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
                amount: numPackages,
                vendorInfo: vendorInfo
            }}});
        }
        Meteor.call('systemlog.insert', "Cart", selectedIngredient.name,  selectedIngredient._id, "Added", "");
    },
    'removeIngredientFromCart': function(selectedIngredient) {
    	Carts.update({ user : Meteor.userId()},{$pull : {ingredients : { ingredient : selectedIngredient}}});
        
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
            "Modified", 
            numPackages
        );
        Carts.update({ user : Meteor.userId(), 'ingredients.ingredient' : selectedIngredient }, {$set : { 'ingredients.$.amount' : numPackages }});
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
        console.log(Vendors.find({_id : vendorInfo.vendor}).fetch()[0])
        Meteor.call('systemlog.insert', 
            "Cart", 
            IngredientsList.find({_id:selectedIngredient}).fetch()[0].name,  
            selectedIngredient._id, 
            "Modified", 
            Vendors.find({_id : vendorInfo.vendor}).fetch()[0].vendor
        );
        Carts.update({ user : Meteor.userId(), 'ingredients.ingredient' : selectedIngredient}, {$set : { 'ingredients.$.vendorInfo' : vendorInfo }});
    },
    'checkoutIngredients': function() { //Allow adding to inentory instead of just remove
        let cart = Carts.find({ user : Meteor.userId()}).fetch()[0];
        let ings = cart.ingredients;
        //This is where the magic happens
        var diff;
        ings.forEach(function(ingCartInfo){
            var ing = IngredientsList.find({ _id : ingCartInfo.ingredient}).fetch()[0]
            newAmount = ing.nativeInfo.totalQuantity + ingCartInfo.amount * ing.nativeInfo.numNativeUnitsPerPackage;
            Meteor.call('editTotalNumNativeUnits',ingCartInfo.ingredient,Number(newAmount));
            Meteor.call('ingredients.updateTotalSpending',ingCartInfo.ingredient,ingCartInfo.vendorInfo.vendor,ingCartInfo.amount)
        });
        Meteor.call('systemlog.insert', "Cart", "Checked Out",  null, "Event", "");
        Carts.update({ user : Meteor.userId()}, {$set : {ingredients : []}});
    }
});