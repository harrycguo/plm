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
        // if(Meteor.userId()){
        //     if (Roles.userIsInRole(Meteor.userId(), ['admin','manager'])){
        //        throw new Meteor.Error('not-authorized', 'not-authorized')
        //     }sdfsdfsdf
        // }
        console.log(Carts.find().fetch())
        console.log(Vendors.find().fetch())

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
                    console.log('We setting!')
                    vendorInfo = vendorList[i]
                }
            }
        }

        if (cartContainsIng(selectedIngredient._id)) {
            console.log('CHANGING QTY')
            Meteor.call('cart.changeQuantity',selectedIngredient._id, numPackages)
        } else {
            Carts.update({ user : Meteor.userId()}, {$push : { ingredients : {
                ingredient : selectedIngredient._id,
                amount: numPackages,
                vendorInfo: vendorInfo
            }}});
        }
    },
    'removeIngredientFromCart': function(selectedIngredient) {
    	Carts.update({ user : Meteor.userId()},{$pull : {ingredients : { ingredient : selectedIngredient}}});
    },
    'cart.changeQuantity': function(selectedIngredient, numPackages){
        addToCartCheck(selectedIngredient,numPackages)
        console.log("LETS GET IT")
        Carts.update({ user : Meteor.userId(), 'ingredients.ingredient' : selectedIngredient }, {$set : { 'ingredients.$.amount' : numPackages }});
    },
    'cart.changeVendor': function(selectedIngredient, vendor) {
        //TODO: Implement
        // checkCartExists()
        console.log(vendor)
        vendorInfoArr = IngredientsList.find({ _id : selectedIngredient }).fetch()[0].vendorInfo
        vendorInfo = {}
        console.log(vendorInfoArr)
        console.log(vendor)
        for (var i=0; i<vendorInfoArr.length; i++) {
            if (vendorInfoArr[i].vendor == vendor) {
                console.log(Carts.find().fetch())
                vendorInfo = vendorInfoArr[i];
            }
        }
        console.log(vendorInfo)
        Carts.update({ user : Meteor.userId(), 'ingredients.ingredient' : selectedIngredient}, {$set : { 'ingredients.$.vendorInfo' : vendorInfo }});
    },
    'checkoutIngredients': function() { //Allow adding to inentory instead of just remove
        let cart = Carts.find({ user : Meteor.userId()}).fetch()[0];
        let ings = cart.ingredients;
        //This is where the magic happens
        var diff;
        console.log(ings);
        ings.forEach(function(ingCartInfo){
            console.log(ingCartInfo.ingredient)
            var ing = IngredientsList.find({ _id : ingCartInfo.ingredient}).fetch()[0]
            newAmount = ing.packageInfo.numPackages + ingCartInfo.amount;
            Meteor.call('editNumPackages',ingCartInfo.ingredient,Number(newAmount));
            Meteor.call('logProductionInReport',ing,Number(ingCartInfo.amount),Number(ingCartInfo.vendorInfo.price));
        });
        Carts.update({ user : Meteor.userId()}, {$set : {ingredients : []}});
        console.log("finished");
    }
});