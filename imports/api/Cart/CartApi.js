import { Mongo } from 'meteor/mongo';
import Carts from './Cart.js';
//Cart api
Meteor.methods({
	'createUserCart': function() {
		Carts.insert({
			user: Meteor.userId(),
			ingredients: []
		});
	},
    'addIngredientToCart': function(selectedIngredient, amount) {
    	var cart = Carts.find({ user: Meteor.userId(), "ingredients.ingredient._id" : selectedIngredient._id}).fetch();
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
    'checkoutIngredients': function() {

    }
});