import { Mongo } from 'meteor/mongo';

//Cart api
Meteor.methods({
	'createUserCart': function() {
		var existingCart = Carts.
		Carts.insert({
			user: Meteor.user,
			ingredients: []
		})
	},
    'addIngredientToCart': function(selectedIngredient, amount) {
    	var cart = Carts.find({ "user._id": Meteor.userId(), "ingredient._id" : selectedIngredient._id}).fetch();
    	if (cart.length === 0)
    		Carts.update({ "user._id" : Meteor.userId()},{$push : { ingredients : {
    			ingredient : selectedIngredient,
    			amount: amount
    		}}});
    	else throw new Meteor.Error("Ingredient already in cart","Ingredient already in cart");
    },
    'removeIngredientFromCart': function(selectedIngredient) {
    	Carts.deleteOne({ "user._id" : Meteor.userId(), "ingredients.ingredient._id" : selectedIngredient._id});
    	//Check that ingredient is in the cart first!
    	// var cart = Carts.find({ user._id: Meteor.user._id, "ingredient._id" : selectedIngredient._id}).fetch
    	// var difference = 
        // IngredientsList.update({ _id : selectedIngredient._id} , {$pull : { vendorInfo : { "vendor._id" : vendor._id}}});
    }
});