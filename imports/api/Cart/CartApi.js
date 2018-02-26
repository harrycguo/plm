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
        // if(Meteor.userId()){
        //     if (Roles.userIsInRole(Meteor.userId(), ['admin','manager'])){
        //        throw new Meteor.Error('not-authorized', 'not-authorized')
        //     }kuhkjhj
        // }
        console.log(Carts.find().fetch())
        addToCartCheck(selectedIngredient._id, amount)
        vendorInfo = IngredientsList.find({ _id : selectedIngredient._id }).fetch()[0].vendorInfo[0]
        if (cartContainsIng(selectedIngredient._id)) {
            console.log('CHANGING QTY')
            Meteor.call('changeQuantity',selectedIngredient, amount)
        } else {
            Carts.update({ user : Meteor.userId()}, {$push : { ingredients : {
                ingredient : selectedIngredient._id,
                amount: amount,
                vendorInfo: vendorInfo
            }}});
        }
    },
    'removeIngredientFromCart': function(selectedIngredient) {
    	Carts.update({ user : Meteor.userId()},{$pull : {ingredients : { ingredient : selectedIngredient}}});
    },
    'changeQuantity': function(selectedIngredient, amount){
        addToCartCheck(selectedIngredient,amount)
        console.log("LETS GET IT")
        Carts.update({ user : Meteor.userId(), 'ingredients.ingredient' : selectedIngredient }, {$set : { 'ingredients.$.amount' : amount }});
    },
    'changeVendor': function(selectedIngredient, vendor) {
        //TODO: Implement
        // checkCartExists()
        vendorInfoArr = IngredientsList({ _id : selectedIngredient_id }).vendorInfo
        vendorInfo = {}
        for (var i=0; i<vendorInfoArr.length; i++) {
            if (vendorInfoArr[i].vendor == vendor) vendorInfo = vendorInfoArr[i];
        }
        console.log(selectedIngredient)
        Carts.update({ user : Meteor.userId(), 'ingredients.ingredient' : selectedIngredient._id}, {$set : { 'ingredients.$.vendorInfo' : vendorInfo }});
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