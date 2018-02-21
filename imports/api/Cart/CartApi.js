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
    'addIngredientToCart': function(selectedIngredient, amount) {
        if(Meteor.userId()){
            if (Roles.userIsInRole(Meteor.userId(), ['admin','manager'])){
               throw new Meteor.Error('not-authorized', 'not-authorized')
            }
        }
        addToCartCheck(selectedIngredient._id, amount)
        vendorInfo = IngredientsList.findOne({ _id : selectedIngredient._id }).vendorInfo
        if (cartContainsIng(selectedIngredient._id)) {
            Meteor.call('changeQuantity',selectedIngredient, amount)
        } else {
            Carts.update({ user : Meteor.userId()}, {$push : { ingredients : {
                ingredient : selectedIngredient,
                amount: amount,
                vendorInfo: vendorInfo
            }}});
        }
    },
    'removeIngredientFromCart': function(selectedIngredient) {
    	Carts.update({ user : Meteor.userId()},{$pull : {ingredients : { "ingredient._id" : selectedIngredient._id}}});
    },
    'changeQuantity': function(selectedIngredient, amount){
        //TODO: Implement
        addToCartCheck(selectedIngredient._id,amount)
        checkCartExists()
        Carts.update({ user : Meteor.userId()}, {$set : { ingredients : { amount: amount }}});
    },
    'changeVendor': function(selectedIngredient, vendor) {
        //TODO: Implement
        // checkCartExists()
        vendorInfoArr = IngredientsList({ _id : selectedIngredient_id }).vendorInfo
        vendorInfo = {}
        for (var i=0; i<vendorInfoArr.length; i++) {
            if (vendorInfoArr[i].vendor == vendor) vendorInfo = vendorInfoArr[i];
        }
        Carts.update({ user : Meteor.userId()}, {$set : { ingredients : { vendorInfo: vendorInfo }}});
    },
    'checkoutIngredients': function() { //Allow adding to inentory instead of just remove
        let cart = Carts.find({ user : Meteor.userId()}).fetch()[0];
        let ings = cart.ingredients;
        //This is where the magic happens
        var diff;
        console.log(ings);
        ings.forEach(function(ingCartInfo){
            console.log(ingCartInfo.ingredient._id)
            diff = ingCartInfo.ingredient.quantity - ingCartInfo.amount;
            //Meteor.call('editQuantity',ingCartInfo.ingredient._id,Number(diff));
            Meteor.call('logProductionInReport',ingCartInfo.ingredient,Number(ingCartInfo.amount));
        });
        Carts.update({ user : Meteor.userId()}, {$set : {ingredients : []}});
        console.log("finished");
    }
});