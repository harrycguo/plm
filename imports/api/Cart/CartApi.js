import { Mongo } from 'meteor/mongo';
import Carts from './Cart.js';
import IngredientsList from '../Ingredients/IngredientList.js';
import '../Ingredients/IngredientsApi.js';

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
    	let cart = Carts.find({ user: Meteor.userId(), "ingredients.ingredient._id" : selectedIngredient._id}).fetch();
        let ingQty = selectedIngredient.quantity;
        console.log(cart.length === 0);
        if ((ingQty - amount) < 0) {
            throw new Meteor.Error("Can't add more to cart than is in inventory","Can't add more to cart than is in inventory");
        }
    	else if (cart.length === 0) {
            Carts.update({ user : Meteor.userId()},{$push : { ingredients : {
                ingredient : selectedIngredient,
                amount: amount
            }}});
        }
    	else throw new Meteor.Error("Ingredient already in cart","Ingredient already in cart");
    },
    'removeIngredientFromCart': function(selectedIngredient) {
    	Carts.update({ user : Meteor.userId()},{$pull : {ingredients : { "ingredient._id" : selectedIngredient._id}}});
    },
    'editCart': function(){

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
            Meteor.call('editQuantity',ingCartInfo.ingredient._id,Number(diff));
            Meteor.call('logProductionInReport',ingCartInfo.ingredient,Number(ingCartInfo.amount));
        });
        Carts.update({ user : Meteor.userId()}, {$set : {ingredients : []}});
        console.log("finished");
    }
});