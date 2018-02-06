import { Mongo } from 'meteor/mongo';
import Carts from './Cart.js'
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
        console.log(cart.length === 0);
    	if (cart.length === 0) {
            Carts.update({ user : Meteor.userId()},{$push : { ingredients : {
                ingredient : selectedIngredient,
                amount: amount
            }}});
        }
    	else throw new Meteor.Error("Ingredient already in cart","Ingredient already in cart");
    },
    'removeIngredientFromCart': function(selectedIngredient) {
        console.log(selectedIngredient)
    	Carts.update({ user : Meteor.userId()},{$pull : {ingredients : { "ingredient._id" : selectedIngredient._id}}});
    }
});